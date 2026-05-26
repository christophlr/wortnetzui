import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Crosshair, Lock } from 'lucide-react';
import * as THREE from 'three';
import { createPortal } from 'react-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { applyEasing } from '../easing';
import { evaluateKeyframeSegment } from '../animation/segmentEvaluate';
import { getNetworkThemeBackground, type NodeShape } from '../networkTheme';
import { type GraphNode, type GraphEdge, type PhysicsParams, DEFAULT_PHYSICS, buildNetworkFromText } from '../graph';
import { rebuildPhysicsCache } from '../graph';
import { PHYS_TRACK_PARAM, VISUAL_TRACK_IDS, VISUAL_TRACK_PARAM } from '../context/WortnetzContextConstants';
import type { TrackMeta } from '../animation/Track';
import { evalLfo } from '../animation/Modulator';
import type { WorkerTrack } from '../animation/evaluateTracks';
import {
  type TextureCache,
  type TextureBuildOptions,
  createSpriteFromTexture,
  buildTextureCache,
  disposeTextureCache,
  swapSpriteTexture as swapSpriteTextureImpl,
  refreshAllSpriteTextures,
  getDepthFactor,
} from '../network3d/textureCache';
import { syncGraphVisuals } from '../network3d/syncVisuals';
import {
  buildInitPayload,
  buildSettlePayload,
} from '../network3d/workerGlue';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useToolHandlers } from '../hooks/useToolHandlers';
import { useCameraFlyTo } from '../hooks/useCameraFlyTo';
import { usePhysicsWorkerSync } from '../hooks/usePhysicsWorkerSync';
import { setupEffectsPipeline } from '../network3d/effectsPipeline';
import { useWortnetz } from '../context/WortnetzContext';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from './ui/context-menu';

import type { PhysicsKeyframe } from './timeline/types';
import i18n from '../i18n';


interface Network3DProps {
  isPlaying: boolean;
  playheadPosition: number;
  inputText?: string;
  viewMode?: '2D' | '3D';
  physicsParams?: PhysicsParams;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  trackMeta?: Record<string, TrackMeta>;
  parseMode?: 'sentence' | 'word' | 'both';
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape?: NodeShape; nodeBorderWidth?: number; depthSizeEnabled?: boolean; depthSizeStrength?: number };
  cameraKeyframes?: Array<{
    time: number;
    position: { x: number; y: number; z: number };
    target: { x: number; y: number; z: number };
    handleInPos?: { x: number; y: number; z: number };
    handleOutPos?: { x: number; y: number; z: number };
    handleInTgt?: { x: number; y: number; z: number };
    handleOutTgt?: { x: number; y: number; z: number };
    mode?: 'aligned' | 'broken';
    tension?: number;
  }>;
  onCameraChange?: () => void;
  isDark?: boolean;
  onReady?: () => void;
  onProgress?: (progress: number) => void;
  edgeAppearance?: { color: 'auto' | string };
  timelineHeight?: number;
  visualSettings?: {
    nodesVisible: boolean;
    edgesVisible: boolean;
    radialBiasScale: number;
    radialBiasOpacity: number;
    gradientOrigin: string;
    gradientPeriphery: string;
    glitchActive: boolean;
    glitchBrushRadius: number;
    glitchFeather: number;
    pathSmoothness: number;
    pathCameraFollow: boolean;
    bloomEnabled: boolean;
    bloomIntensity: number;
    bloomSelective: boolean;
    bloomSelectiveRatio: number;
    bloomGlowMode: 'deterministic' | 'flicker' | 'index';
    bloomFlickerSpeed: number;
    gradientHueShift: number;
    bloomRadius?: number;
    bloomThreshold?: number;
    effectsList?: ('bloom' | 'glitch')[];
    bloomPreset?: 'sharp-neon' | 'soft-dreamy' | 'subtle-glint' | 'custom';
    backgroundColor?: string;
  };
  onNodeSelect?: (node: any) => void;
  pathNodes?: { id: string; label: string }[];
  isPathPlaying?: boolean;
  onPathPlaybackFinished?: () => void;
}




const DEFAULT_TEXT = `Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes, far away up the hill. It was 3am that day, cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write, I write like a ritual over and over. The more exist the more I go I fly, they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`;



/* ── THEME-AWARE BACKGROUND COLORS ── */
const getThemeBackgroundColors = (isDark?: boolean): { hex: string; threeColor: number } => {
  return getNetworkThemeBackground(isDark);
};

/* ── ZOOM SLIDER HELPERS ── */
const MIN_ZOOM_DIST = 100;
const MAX_ZOOM_DIST = 8000;

function distToSliderVal(d: number): number {
  const clamped = Math.max(MIN_ZOOM_DIST, Math.min(MAX_ZOOM_DIST, d));
  return (Math.log(MAX_ZOOM_DIST) - Math.log(clamped)) /
         (Math.log(MAX_ZOOM_DIST) - Math.log(MIN_ZOOM_DIST)) * 100;
}

function sliderValToDist(s: number): number {
  return Math.exp(Math.log(MAX_ZOOM_DIST) - (s / 100) * (Math.log(MAX_ZOOM_DIST) - Math.log(MIN_ZOOM_DIST)));
}




export interface Network3DHandle {
  getCameraKeyframe: () => { position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } | null;
  getEffectivePhysicsParams: () => PhysicsParams;
  panView: (dx: number, dy: number) => void;
  rotateView: (deltaTheta: number, deltaPhi: number) => void;
  setRotation: (theta: number, phi: number) => void;
  resetView: () => void;
  fitToView: (instant?: boolean) => void;
  setZoom: (val: number) => void;
  getZoom: () => number;
  getCameraState: () => { position: [number, number, number], rotation: [number, number, number] } | null;
}

export const Network3D = forwardRef<Network3DHandle, Network3DProps>((props, ref) => {
  const {
    isPlaying,
    playheadPosition,
    inputText = DEFAULT_TEXT,
    viewMode = '3D',
    parseMode = 'word',
    physicsParams = DEFAULT_PHYSICS,
    physicsKeyframes,
    trackMeta,
    styleSettings = { edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1, nodeShape: 'rectangle' as NodeShape, nodeBorderWidth: 2, depthSizeEnabled: false, depthSizeStrength: 50 },
    cameraKeyframes = [],
    onCameraChange,
    isDark,
    onReady,
    onProgress,
    edgeAppearance = { color: 'auto' },
    timelineHeight = 0,
    visualSettings = {
      nodesVisible: true,
      edgesVisible: true,
      radialBiasScale: 0,
      radialBiasOpacity: 0.5,
      gradientOrigin: '#4f46e5',
      gradientPeriphery: '#7c3aed',
      glitchActive: false,
      glitchBrushRadius: 100,
      glitchFeather: 0.5,
      pathSmoothness: 0.5,
      pathCameraFollow: true,
      bloomEnabled: false,
      bloomIntensity: 0.15,
      bloomRadius: 0.4,
      bloomThreshold: 0.85,
      bloomSelective: false,
      bloomSelectiveRatio: 0.5,
      bloomGlowMode: 'deterministic' as const,
      bloomFlickerSpeed: 1.0,
      gradientHueShift: 0.0,
      effectsList: []
    },
    onNodeSelect,
    pathNodes = [],
    isPathPlaying = false,
    onPathPlaybackFinished,
  } = props;
  const {
    activeTool,
    brushRadius,
    setBrushRadius,
    paintColor,
    paintScale,
    paintOpacity,
    paintMode,
    paintedOverrides,
    setPaintedOverrides
  } = useWortnetz();

  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);

  const paintedOverridesRef = useRef(paintedOverrides);
  useEffect(() => {
    paintedOverridesRef.current = paintedOverrides;
  }, [paintedOverrides]);

  // Adjust brush radius using global hotkeys when not focused on an input/editable element
  useEffect(() => {
    if (activeTool !== 'paint') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      if (e.key === '[') {
        setBrushRadius(Math.max(10, brushRadius - 5));
      } else if (e.key === ']') {
        setBrushRadius(Math.min(300, brushRadius + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, brushRadius, setBrushRadius]);

  // Sync initial canvas style cursor immediately when the active tool changes
  useEffect(() => {
    const el = rendererRef.current?.domElement;
    if (!el) return;
    if (activeTool === 'paint') {
      el.style.cursor = 'none';
    } else if (activeTool === 'pan') {
      el.style.cursor = 'grab';
    } else if (activeTool === 'zoom') {
      el.style.cursor = 'zoom-in';
    } else if (activeTool === 'glitch') {
      el.style.cursor = 'crosshair';
    } else if (activeTool === 'path') {
      el.style.cursor = 'cell';
    } else {
      el.style.cursor = 'default';
    }
  }, [activeTool]);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const effectsPipelineRef = useRef<import('../network3d/effectsPipeline').EffectsPipeline | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const graphNodesRef = useRef<Map<string, GraphNode>>(new Map());
  const graphEdgesRef = useRef<GraphEdge[]>([]);
  const graphNodeArrayRef = useRef<GraphNode[]>([]);
  const sharedPairMatrixRef = useRef<Uint8Array>(new Uint8Array(0));
  const spritesArrayRef = useRef<THREE.Object3D[]>([]);
  const edgeLinesRef = useRef<THREE.LineSegments | null>(null);
  const textureCacheRef = useRef<TextureCache>(new Map());
  const physicsWorkerRef = useRef<Worker | null>(null);
  const workerBusyRef = useRef(false);
  const prevMaxOverlapRef = useRef(0);
  const workerPosVelRef = useRef<Float64Array>(new Float64Array(0));
  const animationFrameRef = useRef<number | null>(null);
  const minWordsRef = useRef(Infinity);
  const maxWordsRef = useRef(-Infinity);
  const physicsEnabledRef = useRef(true);
  const stillFramesRef = useRef(0);
  const playheadRef = useRef(playheadPosition);
  const cameraKeyframesRef = useRef(cameraKeyframes);
  const isPlayingRef = useRef(isPlaying);
  const physicsParamsRef = useRef(physicsParams);
  // `effectivePhysicsRef` is now the worker-authoritative `applied` snapshot,
  // updated on every worker step response. Exposed via `getEffectivePhysicsParams`.
  const effectivePhysicsRef = useRef<PhysicsParams>({ ...physicsParams });
  const lastStepNowRef = useRef<number>(performance.now());
  const lastParamsTimeRef = useRef<number>(performance.now());
  const lastParamsValuesRef = useRef<PhysicsParams>({ ...physicsParams });
  const physicsVelocityRef = useRef<number>(0);
  const lastAppliedTimeRef = useRef<number | null>(null);
  const hoveredNodeRef = useRef<GraphNode | null>(null);
  const selectedNodeRef = useRef<GraphNode | null>(null);
  const lockedNodeRef = useRef<GraphNode | null>(null);
  const zoomAnimRef = useRef<{ from: number; to: number; startTime: number; duration: number } | null>(null);
  const pathLineRef = useRef<THREE.Line | null>(null);
  const activeTrailLineRef = useRef<THREE.Line | null>(null);
  const orbMeshRef = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const pathPlaybackProgressRef = useRef<number>(0);
  const pathPlayingRef = useRef<boolean>(isPathPlaying);
  const pathNodesRef = useRef<any[]>(pathNodes);
  const onPathPlaybackFinishedRef = useRef(onPathPlaybackFinished);

  const { cameraFlyRef, flyToTargetRef, tick: tickCameraFly } = useCameraFlyTo({ cameraRef, controlsRef });
  const [panX, setPanX] = useState(0);
  const lastPanXRef = useRef(0);
  const mousePosRef = useRef(new THREE.Vector2(0, 0));
  const [contextMenuNode, setContextMenuNode] = useState<GraphNode | null>(null);
  const [cameraLocked, setCameraLocked] = useState(false);
  const setCameraLockedRef = useRef(setCameraLocked);
  const textureRebuildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styleSettingsRef = useRef(styleSettings);
  const isDarkRef = useRef(true);
  const onReadyRef = useRef(onReady);
  const onProgressRef = useRef(onProgress);
  const onNodeSelectRef = useRef(onNodeSelect);
  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);
  const edgeAppearanceRef = useRef(edgeAppearance);
  const onCameraChangeRef = useRef(onCameraChange);
  const physicsKeyframesRef = useRef(physicsKeyframes ?? {});
  const hasAnyKfsRef = useRef(false);
  const trackMetaRef = useRef<Record<string, TrackMeta>>(trackMeta ?? {});
  const hasAnyModulatorRef = useRef(false);
  useEffect(() => { 
    trackMetaRef.current = trackMeta ?? {}; 
    hasAnyModulatorRef.current = Object.values(trackMeta ?? {}).some(m => m.modulator != null && m.modulator.depth !== 0 || m.glide > 0);
  }, [trackMeta]);
  const tracksDebounceRef = useRef<number | null>(null);
  const visualSettingsRef = useRef(visualSettings);
  useEffect(() => { visualSettingsRef.current = visualSettings; }, [visualSettings]);
  useEffect(() => { onCameraChangeRef.current = onCameraChange; }, [onCameraChange]);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  useEffect(() => { isDarkRef.current = true; }, [isDark]);
  useEffect(() => { edgeAppearanceRef.current = edgeAppearance; }, [edgeAppearance]);
  useEffect(() => {
    playheadRef.current = playheadPosition;
    // When scrubbing (not playing) and keyframes exist, re-enable physics so it responds
    if (!isPlayingRef.current) {
      const hasKfs = Object.values(physicsKeyframesRef.current).some(kfs => kfs.length > 0);
      if (hasKfs) { physicsEnabledRef.current = true; stillFramesRef.current = 0; }
    }
  }, [playheadPosition]);
  useEffect(() => {
    // Pre-sort keyframes so the worker's per-step Hermite eval sees them in order.
    const raw = physicsKeyframes ?? {};
    const sorted: Record<string, PhysicsKeyframe[]> = {};
    for (const [trackId, kfs] of Object.entries(raw)) {
      sorted[trackId] = [...kfs].sort((a, b) => a.time - b.time);
    }
    physicsKeyframesRef.current = sorted;
    hasAnyKfsRef.current = Object.values(sorted).some(kfs => kfs.length > 0);
  }, [physicsKeyframes]);

  // Push tracks (keyframes + glide + modulator) to the worker. Debounced so a
  // drag of a keyframe or LFO slider doesn't flood the message queue. The
  // worker keys tracks by paramKey ('repulsion', ...) — `PHYS_TRACK_PARAM`
  // maps trackId → paramKey and is the single source of truth for that.
  useEffect(() => {
    if (tracksDebounceRef.current !== null) {
      window.clearTimeout(tracksDebounceRef.current);
    }
    tracksDebounceRef.current = window.setTimeout(() => {
      const tracksMsg: Record<string, WorkerTrack> = {};
      const kfs = physicsKeyframesRef.current;
      const meta = trackMetaRef.current;
      for (const [trackId, paramKey] of Object.entries(PHYS_TRACK_PARAM)) {
        const m = meta[trackId];
        tracksMsg[paramKey] = {
          trackId,
          keyframes: kfs[trackId] ?? [],
          glide: m?.glide ?? 0,
          modulator: m?.modulator,
        };
      }
      physicsWorkerRef.current?.postMessage({ type: 'updateTracks', tracks: tracksMsg });
      tracksDebounceRef.current = null;
    }, 100);
    return () => {
      if (tracksDebounceRef.current !== null) {
        window.clearTimeout(tracksDebounceRef.current);
        tracksDebounceRef.current = null;
      }
    };
  }, [physicsKeyframes, trackMeta]);
  useEffect(() => { styleSettingsRef.current = styleSettings; }, [styleSettings]);
  useEffect(() => {
    // Sidebar slider change: forward the new baseline to the worker on the
    // next step (sliderParams is included in every step message). Worker glide
    // = 0 (default) means tracks without keyframes snap instantly to the new
    // baseline — the old 30 ms easeOut blend was removed in Phase 3.
    physicsParamsRef.current = physicsParams;
    physicsEnabledRef.current = true;
    stillFramesRef.current = 0;
  }, [physicsParams]);
  
  const fitToView = (instant = false) => {
    if (!cameraRef.current || !controlsRef.current || graphNodeArrayRef.current.length === 0) return;

    const box = new THREE.Box3();
    graphNodeArrayRef.current.forEach(node => {
      box.expandByPoint(new THREE.Vector3(node.x, node.y, node.z));
    });

    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (viewMode === '3D') {
      const cam = cameraRef.current as THREE.PerspectiveCamera;
      const fov = cam.fov * (Math.PI / 180);
      // Determine distance based on FOV to fit the max dimension with padding
      let distance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5; 
      distance = Math.max(distance, 800); // Minimum comfortable distance

      // Standard isometric-ish angle for the reset/initial view
      const offset = new THREE.Vector3(distance * 0.8, distance * 0.5, distance).normalize().multiplyScalar(distance);
      const toPos = center.clone().add(offset);
      const toTarget = center.clone();

      if (instant) {
        cam.position.copy(toPos);
        controlsRef.current.target.copy(toTarget);
        cam.lookAt(toTarget);
        controlsRef.current.update();
      } else {
        cameraFlyRef.current = {
          fromPos: cam.position.clone(),
          toPos: toPos,
          fromTarget: controlsRef.current.target.clone(),
          toTarget: toTarget,
          startTime: performance.now(),
          duration: 800,
        };
      }
    } else {
      const cam = cameraRef.current as THREE.OrthographicCamera;
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      
      const zoomX = nw / (size.x || 1);
      const zoomY = nh / (size.y || 1);
      const targetZoom = Math.min(zoomX, zoomY) * 0.8;

      if (instant) {
        cam.zoom = targetZoom;
        cam.position.set(center.x, center.y, 1);
        controlsRef.current.target.set(center.x, center.y, 0);
        cam.updateProjectionMatrix();
        controlsRef.current.update();
      } else {
        flyToTargetRef.current = center.clone();
        cam.zoom = targetZoom;
        cam.updateProjectionMatrix();
      }
    }
  };

  useImperativeHandle(ref, () => ({
    getCameraKeyframe: () => {
      if (!cameraRef.current || !controlsRef.current) return null;
      return {
        position: {
          x: cameraRef.current.position.x,
          y: cameraRef.current.position.y,
          z: cameraRef.current.position.z,
        },
        target: {
          x: controlsRef.current.target.x,
          y: controlsRef.current.target.y,
          z: controlsRef.current.target.z,
        },
      };
    },
    getEffectivePhysicsParams: () => ({ ...effectivePhysicsRef.current }),
    panView: (dx: number, dy: number) => panView(dx, dy),
    rotateView: (deltaTheta: number, deltaPhi: number) => {
      if (!controlsRef.current) return;
      controlsRef.current.rotateLeft(deltaTheta);
      controlsRef.current.rotateUp(deltaPhi);
      controlsRef.current.update();
    },
    setRotation: (theta: number, phi: number) => {
      if (!controlsRef.current || !cameraRef.current) return;
      const distance = cameraRef.current.position.distanceTo(controlsRef.current.target);
      const x = distance * Math.sin(phi) * Math.sin(theta);
      const y = distance * Math.cos(phi);
      const z = distance * Math.sin(phi) * Math.cos(theta);
      cameraRef.current.position.set(
        controlsRef.current.target.x + x,
        controlsRef.current.target.y + y,
        controlsRef.current.target.z + z
      );
      controlsRef.current.update();
    },
    resetView: () => {
      fitToView(false);
    },
    fitToView: (instant = false) => {
      fitToView(instant);
    },
    setZoom: (val: number) => {
      if (!cameraRef.current || !controlsRef.current) return;
      if (viewMode === '3D') {
        const newDist = sliderValToDist(val);
        const dir = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
        cameraRef.current.position.copy(controlsRef.current.target).addScaledVector(dir, newDist);
      } else {
        const cam = cameraRef.current as THREE.OrthographicCamera;
        cam.zoom = val / 10; // Simple mapping for 2D
        cam.updateProjectionMatrix();
      }
      controlsRef.current.update();
    },
    getZoom: () => {
      if (!cameraRef.current || !controlsRef.current) return 50;
      if (viewMode === '3D') {
        return distToSliderVal(cameraRef.current.position.distanceTo(controlsRef.current.target));
      } else {
        return (cameraRef.current as THREE.OrthographicCamera).zoom * 10;
      }
    },
    getCameraState: () => {
      const cam = cameraRef.current;
      if (!cam) return null;
      return {
        position: [cam.position.x, cam.position.y, cam.position.z],
        rotation: [Math.round(THREE.MathUtils.radToDeg(cam.rotation.x)), Math.round(THREE.MathUtils.radToDeg(cam.rotation.y)), Math.round(THREE.MathUtils.radToDeg(cam.rotation.z))]
      };
    }
  }));

  useEffect(() => {
    cameraKeyframesRef.current = cameraKeyframes;
    lastAppliedTimeRef.current = null;
  }, [cameraKeyframes]);

  useEffect(() => {
    if (isPathPlaying && !pathPlayingRef.current) {
      pathPlaybackProgressRef.current = 0;
    }
    pathPlayingRef.current = isPathPlaying;
  }, [isPathPlaying]);

  useEffect(() => {
    pathNodesRef.current = pathNodes;
  }, [pathNodes]);

  useEffect(() => {
    onPathPlaybackFinishedRef.current = onPathPlaybackFinished;
  }, [onPathPlaybackFinished]);

  const panView = useCallback((deltaX: number, deltaY: number) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const cam = cameraRef.current;
    const target = controlsRef.current.target;
    
    const distance = cam.position.distanceTo(target);
    const speed = distance * 0.001;
    
    const left = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 1);
    
    const panVector = new THREE.Vector3()
      .addScaledVector(left, -deltaX * speed)
      .addScaledVector(up, deltaY * speed);
      
    cam.position.add(panVector);
    target.add(panVector);
    controlsRef.current.update();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't pan if typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      const step = e.shiftKey ? 40 : 15;
      switch (e.key) {
        case 'ArrowLeft':  panView(-step, 0); break;
        case 'ArrowRight': panView(step, 0); break;
        case 'ArrowUp':    panView(0, step); break;
        case 'ArrowDown':  panView(0, -step); break;
        default: return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panView]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mousePosRef.current.set(x, y);
    };
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    return () => containerRef.current?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) { physicsEnabledRef.current = true; stillFramesRef.current = 0; }
  }, [isPlaying]);

  // Component-scoped helpers — defined here so the hooks below can capture them.
  const getTextureOpts = (): TextureBuildOptions => ({
    dark: !!isDarkRef.current,
    nodeShape: styleSettingsRef.current.nodeShape ?? 'rectangle',
    nodeBorderWidth: styleSettingsRef.current.nodeBorderWidth ?? 2,
  });

  const swap = (node: GraphNode, highlighted: boolean, selected: boolean) =>
    swapSpriteTextureImpl(node, highlighted, selected, textureCacheRef.current, getTextureOpts());

  const rebuildAndRefreshTextures = () => {
    disposeTextureCache(textureCacheRef.current);
    textureCacheRef.current = buildTextureCache(graphNodesRef.current, getTextureOpts());
    refreshAllSpriteTextures(
      graphNodesRef.current,
      textureCacheRef.current,
      hoveredNodeRef.current?.label ?? null,
      selectedNodeRef.current?.label ?? null,
      styleSettingsRef.current,
      minWordsRef.current,
      maxWordsRef.current,
      getTextureOpts(),
    );
  };

  const sync = (
    nodeArr?: GraphNode[],
    vsOverride?: typeof visualSettings,
    ssOverride?: typeof styleSettings,
  ) => syncGraphVisuals({
    nodes: graphNodesRef.current,
    edges: graphEdgesRef.current,
    nodeArr,
    visualSettings: vsOverride ?? visualSettingsRef.current,
    styleSettings: ssOverride ?? styleSettingsRef.current,
    camera: cameraRef.current,
    mousePos: mousePosRef.current,
    edgeLines: edgeLinesRef.current,
    paintedOverrides: paintedOverridesRef.current,
  });

  const physicsSync = usePhysicsWorkerSync({
    graphNodeArrayRef,
    workerPosVelRef,
    effectivePhysicsRef,
    physicsParamsRef,
    playheadRef,
    isPlayingRef,
    hasAnyKfsRef,
    hasAnyModulatorRef,
    prevMaxOverlapRef,
    stillFramesRef,
    physicsEnabledRef,
    workerBusyRef,
    physicsVelocityRef,
    lastStepNowRef,
    lastParamsTimeRef,
    lastParamsValuesRef,
    sync,
    onSettled: () => {
      fitToView(true);
      if (rendererRef.current) rendererRef.current.domElement.style.opacity = '1';
      requestAnimationFrame(() => onReadyRef.current?.());
    },
    onProgress: (p) => onProgressRef.current?.(p),
  });

  const handleResize = useCallback((nw: number, nh: number) => {
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!camera || !renderer) return;
    if (viewMode === '2D') {
      const cam = camera as THREE.OrthographicCamera;
      cam.left = -nw / 2; cam.right = nw / 2;
      cam.top = nh / 2;   cam.bottom = -nh / 2;
    } else {
      (camera as THREE.PerspectiveCamera).aspect = nw / nh;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
    effectsPipelineRef.current?.resize(nw, nh);
  }, [viewMode]);
  useResizeObserver(containerRef, handleResize);

  const attachToolHandlers = useToolHandlers({
    activeTool,
    cameraRef,
    spritesArrayRef,
    graphNodesRef,
    graphNodeArrayRef,
    hoveredNodeRef,
    selectedNodeRef,
    controlsRef,
    cameraFlyRef,
    flyToTargetRef,
    onNodeSelectRef,
    viewMode,
    swap,
    sync,
    brushRadius,
    paintColor,
    paintScale,
    paintOpacity,
    paintMode,
    setPaintedOverrides,
    physicsVelocityRef,
    stillFramesRef,
    physicsEnabledRef,
    workerPosVelRef,
    is2D: viewMode === '2D',
    setMouseCoords,
  });

  /* ── INITIAL LAYOUT (ORGANIC SPHERE) ── */
  const arrangeNodesCone3D = (nodes: Map<string, GraphNode>, minWords: number, maxWords: number) => {
    const nodeArray = Array.from(nodes.values());

    nodeArray.forEach(node => {
      // More organic distribution - subtle influence of word count
      const t = maxWords !== minWords
        ? (node.wordCount - minWords) / (maxWords - minWords)
        : 0.5;

      // Reduced radius range for more compact structure
      const baseRadius = 300;
      const radiusVariation = 400;
      const radius = baseRadius + radiusVariation * Math.pow(t, 0.4) * (0.7 + Math.random() * 0.6);

      // Spherical distribution instead of cone
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      node.x = radius * Math.sin(phi) * Math.cos(theta);
      node.y = radius * Math.sin(phi) * Math.sin(theta) + 400; // Center around y=400
      node.z = radius * Math.cos(phi);

      // Small random velocity
      node.vx = (Math.random() - 0.5) * 3;
      node.vy = (Math.random() - 0.5) * 3;
      node.vz = (Math.random() - 0.5) * 3;
    });
  };

  /* ── INITIAL LAYOUT (2D FLAT SCATTER) ── */
  const scatterNodes2D = (nodes: Map<string, GraphNode>, width: number, height: number) => {
    const spread = Math.min(width, height) * 0.35;
    for (const node of nodes.values()) {
      node.x = (Math.random() - 0.5) * spread * 2;
      node.y = (Math.random() - 0.5) * spread * 2;
      node.z = 0;
      node.vx = (Math.random() - 0.5) * 2;
      node.vy = (Math.random() - 0.5) * 2;
      node.vz = 0;
    }
  };





  // Immediate sync when visual/style settings change
  useEffect(() => {
    if (graphNodesRef.current) {
      sync(undefined, visualSettings, styleSettings);
    }
  }, [visualSettings, styleSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyCameraKeyframes = (
    keyframes: Array<{
      time: number;
      position: { x: number; y: number; z: number };
      target: { x: number; y: number; z: number };
      handleInPos?: { x: number; y: number; z: number };
      handleOutPos?: { x: number; y: number; z: number };
      handleInTgt?: { x: number; y: number; z: number };
      handleOutTgt?: { x: number; y: number; z: number };
      tension?: number;
      interpolation?: 'auto' | 'linear' | 'hold';
    }>,
    time: number
  ) => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (keyframes.length === 0) return;

    const sorted = [...keyframes].sort((a, b) => a.time - b.time);

    // Find active segment's tRaw for distance scaling
    let prevIdx = 0;
    if (time > sorted[0].time && time < sorted[sorted.length - 1].time) {
      for (let i = 0; i < sorted.length - 1; i++) {
        if (time >= sorted[i].time && time <= sorted[i + 1].time) {
          prevIdx = i;
          break;
        }
      }
    }
    const prev = sorted[prevIdx];
    const next = sorted[prevIdx + 1] ?? prev;
    const segDur = next.time - prev.time;
    const tRaw = segDur === 0 ? 0 : Math.max(0, Math.min(1, (time - prev.time) / segDur));

    const evalChannel = (
      valSelector: (kf: any) => number,
      inSelector: (kf: any) => number | undefined,
      outSelector: (kf: any) => number | undefined
    ) => {
      return evaluateKeyframeSegment(sorted, time, {
        val: valSelector,
        handleIn: inSelector,
        handleOut: outSelector,
        tension: kf => kf.tension ?? 1,
        interpolation: kf => kf.interpolation,
        clampNonNegative: false,
      }) ?? valSelector(prev);
    };

    const camX = evalChannel(kf => kf.position.x, kf => kf.handleInPos?.x, kf => kf.handleOutPos?.x);
    const camY = evalChannel(kf => kf.position.y, kf => kf.handleInPos?.y, kf => kf.handleOutPos?.y);
    const camZ = evalChannel(kf => kf.position.z, kf => kf.handleInPos?.z, kf => kf.handleOutPos?.z);

    const tgtX = evalChannel(kf => kf.target.x, kf => kf.handleInTgt?.x, kf => kf.handleOutTgt?.x);
    const tgtY = evalChannel(kf => kf.target.y, kf => kf.handleInTgt?.y, kf => kf.handleOutTgt?.y);
    const tgtZ = evalChannel(kf => kf.target.z, kf => kf.handleInTgt?.z, kf => kf.handleOutTgt?.z);

    const d0 = Math.sqrt((prev.position.x - prev.target.x) ** 2 + (prev.position.y - prev.target.y) ** 2 + (prev.position.z - prev.target.z) ** 2);
    const d1 = Math.sqrt((next.position.x - next.target.x) ** 2 + (next.position.y - next.target.y) ** 2 + (next.position.z - next.target.z) ** 2);
    const interpDist = d0 + (d1 - d0) * tRaw;
    const dx = camX - tgtX, dy = camY - tgtY, dz = camZ - tgtZ;
    const rawDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const scale = rawDist > 0 ? interpDist / rawDist : 1;

    cameraRef.current.position.set(tgtX + dx * scale, tgtY + dy * scale, tgtZ + dz * scale);
    controlsRef.current.target.set(tgtX, tgtY, tgtZ);
    cameraRef.current.lookAt(controlsRef.current.target);
  };

  /* ── SETUP & ANIMATION ── */
  useEffect(() => {
    console.log('[Network3D] Effect triggered', { inputText: inputText.substring(0, 20) + '...', viewMode, parseMode });
    if (!containerRef.current) return;

    let isCancelled = false;
        let timerId: ReturnType<typeof setTimeout> | undefined;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const is2D = viewMode === '2D';
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;

    // Camera — orthographic for 2D (1 world unit = 1 CSS px at zoom=1), perspective for 3D
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    if (is2D) {
      camera = new THREE.OrthographicCamera(-cw / 2, cw / 2, ch / 2, -ch / 2, -10000, 10000);
      camera.position.set(0, 0, 1);
    } else {
      camera = new THREE.PerspectiveCamera(50, cw / ch, 1, 15000);
      camera.position.set(1200, 800, 1500);
      camera.lookAt(0, 400, 0);
    }
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(cw || 1000, ch || 800);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.opacity = '0'; // Prevent Safari WebGL compositing flash before CSS mask
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Configure Tonemapping to prevent color-clipping and support soft bloom edges
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const effectsPipeline = setupEffectsPipeline(renderer, scene, camera, cw || 1000, ch || 800);
    effectsPipelineRef.current = effectsPipeline;

    // Instantiate Path Animator visual assets
    const pathMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.35,
    });
    const pathGeom = new THREE.BufferGeometry();
    const pathLine = new THREE.Line(pathGeom, pathMat);
    pathLine.visible = false;
    scene.add(pathLine);
    pathLineRef.current = pathLine;

    const trailMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 1.0,
    });
    const trailGeom = new THREE.BufferGeometry();
    const trailLine = new THREE.Line(trailGeom, trailMat);
    trailLine.visible = false;
    scene.add(trailLine);
    activeTrailLineRef.current = trailLine;

    const orbGeom = new THREE.SphereGeometry(15, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
    });
    const orbMesh = new THREE.Mesh(orbGeom, orbMat);
    orbMesh.visible = false;
    scene.add(orbMesh);
    orbMeshRef.current = orbMesh;

    const pointLight = new THREE.PointLight(0x818cf8, 3.0, 300);
    pointLight.visible = false;
    scene.add(pointLight);
    pointLightRef.current = pointLight;


    // OrbitControls — pan+zoom only in 2D, full orbit in 3D
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    if (is2D) {
      controls.enableRotate = false;
      controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
      controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
    } else {
      controls.minDistance = 10;
      controls.maxDistance = 50000;
      controls.target.set(0, 400, 0);
    }
    controls.update();
    controlsRef.current = controls;
    controls.addEventListener('start', () => {
      lockedNodeRef.current = null;
      setCameraLockedRef.current(false);
    });
    let applyingKeyframe = false;
    const handleCameraChange = () => {
      if (!applyingKeyframe) {
        onCameraChangeRef.current?.();
      }
    };
    controls.addEventListener('change', handleCameraChange);

    // Build network
    const { nodes, edges, minWords, maxWords } = buildNetworkFromText(inputText, parseMode);

    if (is2D) {
      // 2D: scatter randomly then let live physics find the layout
      scatterNodes2D(nodes, cw, ch);
      physicsEnabledRef.current = true;
      stillFramesRef.current = 0;
    } else {
      // 3D: arrange initially; worker will settle asynchronously (see settle message below)
      arrangeNodesCone3D(nodes, minWords, maxWords);
      physicsEnabledRef.current = false;
      stillFramesRef.current = 9999;
    }

    graphNodesRef.current = nodes;
    graphEdgesRef.current = edges;
    minWordsRef.current = minWords;
    maxWordsRef.current = maxWords;
    const physCache = rebuildPhysicsCache(nodes);
    graphNodeArrayRef.current = physCache.nodeArray;
    sharedPairMatrixRef.current = physCache.sharedPairMatrix;

    // ── PHYSICS WORKER SETUP ──
    // Terminate any previous worker before creating a new one
    physicsWorkerRef.current?.terminate();
    workerBusyRef.current = false;

    const nodeArr = physCache.nodeArray;
    const nodeCount = nodeArr.length;

    // Reusable position+velocity buffer (transferred back and forth — zero GC)
    workerPosVelRef.current = new Float64Array(nodeCount * 6);

    const worker = new Worker(new URL('../graph/physics.worker.ts', import.meta.url), { type: 'module' });
    physicsWorkerRef.current = worker;

    worker.postMessage(buildInitPayload(nodeArr, edges, physCache.sharedPairMatrix));

    if (!is2D) {
      // 3D settle: run up to 500 physics iterations off the main thread.
      // The loading overlay covers the initial unsettled state until the
      // worker reports back.
      const settle = buildSettlePayload(nodeArr, DEFAULT_PHYSICS, 500);
      worker.postMessage(settle, [settle.posVel.buffer]);
    }

    worker.onmessage = (e) => physicsSync.handleMessage(e, is2D);

    // Create edges — single merged LineSegments (1 draw call for all edges)
    const edgeColor = edgeAppearance.color !== 'auto' 
      ? new THREE.Color(edgeAppearance.color) 
      : new THREE.Color(0xe4e4e7); // Always use dark-themed default (Zinc-200)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      opacity: styleSettings.edgeOpacity,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      linewidth: styleSettings.edgeWidth
    });

    const edgePositions = new Float32Array(edges.length * 2 * 3);
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const idx = i * 6;
      edgePositions[idx]     = edge.a.x; edgePositions[idx + 1] = edge.a.y; edgePositions[idx + 2] = edge.a.z;
      edgePositions[idx + 3] = edge.b.x; edgePositions[idx + 4] = edge.b.y; edgePositions[idx + 5] = edge.b.z;
    }
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    const edgeLineSegments = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edgeLineSegments.renderOrder = 0;
    scene.add(edgeLineSegments);
    edgeLinesRef.current = edgeLineSegments;

    // Build 3-state texture cache for all nodes (normal, highlighted, selected)
    disposeTextureCache(textureCacheRef.current);
    textureCacheRef.current = buildTextureCache(nodes, getTextureOpts());

    // Create nodes with billboarded text from cached normal textures
    let nodeIdx = 0;
    nodes.forEach(node => {
      const cached = textureCacheRef.current.get(node.label)!;
      const sprite = createSpriteFromTexture(
        cached.normal, node.label, cached.baseScale, cached.aspectRatio, styleSettings.nodeScale
      );
      sprite.position.set(node.x, node.y, node.z);
      scene.add(sprite);
      node.textSprite = sprite;
      // Assign stable glow seed and index for selective bloom
      node.glowSeed = Math.random();
      node.nodeIndex = nodeIdx++;
    });

    spritesArrayRef.current = graphNodeArrayRef.current
      .map(n => n.textSprite)
      .filter(Boolean) as THREE.Object3D[];

    const detachToolHandlers = attachToolHandlers(renderer.domElement);

    // Animation loop
    let lastTime = performance.now();
    const animate = () => {
      if (isCancelled) return;
      animationFrameRef.current = requestAnimationFrame(animate);

      // Apply physics every frame (with delta time for stability)
      const now = performance.now();
      const delta = (now - lastTime) / 16.67; // Normalize to ~60fps
      lastTime = now;


      // Re-enable physics during playback if it was auto-stopped but keyframes or a live
      // modulator (LFO) are still driving values. Modulators need continuous steps even
      // when the network is visually settled, because the LFO evaluates against live time.
      if (!physicsEnabledRef.current) {
        const hasKfs = isPlayingRef.current && hasAnyKfsRef.current;
        const hasModulator = hasAnyModulatorRef.current;
        if (hasKfs || hasModulator) { physicsEnabledRef.current = true; stillFramesRef.current = 0; }
      }

      physicsSync.dispatchStep(worker, is2D, delta);

      if (!is2D) {
        // Camera keyframe animation (3D only)
        const time = playheadRef.current;
        const keyframes = cameraKeyframesRef.current;
        const shouldApply = isPlayingRef.current || time !== lastAppliedTimeRef.current;
        if (shouldApply) {
          applyingKeyframe = true;
          applyCameraKeyframes(keyframes, time);
          lastAppliedTimeRef.current = time;
        }

        // Animated zoom (+/− buttons)
        if (zoomAnimRef.current) {
          const { from, to, startTime, duration } = zoomAnimRef.current;
          const t = Math.min(1, (performance.now() - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const dist = from + (to - from) * eased;
          const dir = camera.position.clone().sub(controls.target).normalize();
          camera.position.copy(controls.target).addScaledVector(dir, dist);
          if (t >= 1) zoomAnimRef.current = null;
        }

      }

      // Camera fly-to + smooth target lerp — handles both 3D fly and 2D target snap
      tickCameraFly();

      // Locked camera: translate camera + target together to follow the node
      if (lockedNodeRef.current && controlsRef.current && !flyToTargetRef.current && !cameraFlyRef.current) {
        const n = lockedNodeRef.current;
        const newTarget = new THREE.Vector3(n.x, n.y, n.z);
        const delta = newTarget.clone().sub(controlsRef.current.target);
        camera.position.add(delta);
        controlsRef.current.target.copy(newTarget);
      }

      // ──────────────────────────────────────────────────────────────────────
      // Path Animator Sequence Rendering & Animation
      // ──────────────────────────────────────────────────────────────────────
      const pNodes = pathNodesRef.current;
      const isPathPlayingActive = pathPlayingRef.current;
      
      let curve: THREE.CatmullRomCurve3 | null = null;
      
      if (pNodes.length >= 2) {
        const points: THREE.Vector3[] = [];
        pNodes.forEach(nodeItem => {
          const gn = graphNodesRef.current.get(nodeItem.id);
          if (gn) {
            points.push(new THREE.Vector3(gn.x, gn.y, gn.z));
          }
        });
        
        if (points.length >= 2) {
          curve = new THREE.CatmullRomCurve3(points);
          if (pathLineRef.current) {
            const curvePoints = curve.getPoints(100);
            pathLineRef.current.geometry.setFromPoints(curvePoints);
            pathLineRef.current.visible = true;
          }
        } else {
          if (pathLineRef.current) pathLineRef.current.visible = false;
        }
      } else {
        if (pathLineRef.current) pathLineRef.current.visible = false;
      }
      
      if (isPathPlayingActive && curve) {
        const currentNow = performance.now();
        const lastStep = lastStepNowRef.current;
        const dtSeconds = Math.min((currentNow - lastStep) / 1000, 0.1);
        
        const totalDuration = (pNodes.length - 1) * 1.5; // 1.5 seconds per segment
        pathPlaybackProgressRef.current += dtSeconds / totalDuration;
        
        if (pathPlaybackProgressRef.current >= 1.0) {
          pathPlaybackProgressRef.current = 1.0;
          pathPlayingRef.current = false;
          if (onPathPlaybackFinishedRef.current) {
            requestAnimationFrame(() => onPathPlaybackFinishedRef.current?.());
          }
        }
        
        const progress = pathPlaybackProgressRef.current;
        const currentPos = curve.getPointAt(progress);
        
        if (orbMeshRef.current) {
          orbMeshRef.current.position.copy(currentPos);
          orbMeshRef.current.visible = true;
        }
        
        if (pointLightRef.current) {
          pointLightRef.current.position.copy(currentPos);
          pointLightRef.current.visible = true;
        }
        
        if (activeTrailLineRef.current) {
          const trailPoints: THREE.Vector3[] = [];
          const numSamples = Math.max(2, Math.round(progress * 100));
          for (let i = 0; i <= numSamples; i++) {
            const tVal = (i / numSamples) * progress;
            trailPoints.push(curve.getPointAt(tVal));
          }
          activeTrailLineRef.current.geometry.setFromPoints(trailPoints);
          activeTrailLineRef.current.visible = true;
        }
        
        if (visualSettingsRef.current.pathCameraFollow && controlsRef.current) {
          controlsRef.current.target.lerp(currentPos, 0.05);
          if (viewMode !== '2D') {
            const targetCamPos = currentPos.clone().add(new THREE.Vector3(0, 300, 800));
            camera.position.lerp(targetCamPos, 0.03);
          }
        }
      } else {
        if (orbMeshRef.current) orbMeshRef.current.visible = false;
        if (pointLightRef.current) pointLightRef.current.visible = false;
        if (activeTrailLineRef.current) activeTrailLineRef.current.visible = false;
      }

      // Update controls (for damping) — fires 'change' synchronously if camera moved
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      applyingKeyframe = false;

      // ── Evaluate all visual/effects tracks ──
      const nowSec = performance.now() / 1000;
      const vsBase = visualSettingsRef.current;
      const ssBase = styleSettingsRef.current;
      const vsOverride: Record<string, unknown> = { ...vsBase };
      const ssOverride: Record<string, unknown> = { ...ssBase };

      for (const trackId of VISUAL_TRACK_IDS) {
        const paramKey = VISUAL_TRACK_PARAM[trackId];
        const defaultVal = ((vsBase as Record<string, unknown>)[paramKey] ?? (ssBase as Record<string, unknown>)[paramKey] ?? 0) as number;
        const kfs = physicsKeyframesRef.current[trackId] ?? [];
        const baseVal = evaluateKeyframeSegment(kfs, playheadRef.current, {
          val: kf => kf.value,
          handleIn: kf => kf.handleIn,
          handleOut: kf => kf.handleOut,
          interpolation: kf => kf.interpolation,
          clampNonNegative: true,
        }) ?? defaultVal;
        // Layer on LFO modulator if active
        const meta = trackMetaRef.current?.[trackId];
        const finalVal = meta?.modulator
          ? Math.max(0, baseVal + evalLfo(meta.modulator, nowSec))
          : baseVal;
        // Write to the appropriate override object
        if (paramKey in vsBase) {
          vsOverride[paramKey] = finalVal;
        } else {
          ssOverride[paramKey] = finalVal;
        }
      }

      // Sync visuals with animated overrides
      syncGraphVisuals({
        nodes: graphNodesRef.current,
        edges: graphEdgesRef.current,
        nodeArr: graphNodeArrayRef.current,
        visualSettings: vsOverride as any,
        styleSettings: ssOverride as any,
        camera,
        mousePos: mousePosRef.current,
        edgeLines: edgeLinesRef.current,
        time: nowSec,
        paintedOverrides: paintedOverridesRef.current,
      });

      // Configure bloom pass from animated values
      const bloomIntensity = (vsOverride.bloomIntensity ?? 0.15) as number;
      const bloomEnabled = vsBase.bloomEnabled;
      const effectsPipeline = effectsPipelineRef.current;

      if (effectsPipeline) {
        effectsPipeline.bloomPass.enabled = bloomEnabled;
        effectsPipeline.bloomPass.strength = bloomIntensity;
        effectsPipeline.bloomPass.radius = (vsOverride.bloomRadius ?? 0.4) as number;

        // When selective bloom is active, force threshold high so only HDR-boosted nodes glow
        const baseThreshold = (vsOverride.bloomThreshold ?? 0.85) as number;
        effectsPipeline.bloomPass.threshold = vsBase.bloomSelective ? 0.95 : baseThreshold;
      }

      if (effectsPipeline && bloomEnabled) {
        effectsPipeline.composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };
    animate();
    // 2D: reveal immediately after the first frame.
    // 3D: onReady is called once the worker settle completes (see onmessage 'settled' handler).
    if (is2D) {
      fitToView(true);
      if (rendererRef.current) rendererRef.current.domElement.style.opacity = '1';
      requestAnimationFrame(() => onReadyRef.current?.());
    }

    return () => {
      isCancelled = true;
      console.log('[Network3D] Effect cleanup running', { inputText: inputText.substring(0, 20) + '...' });
      if (timerId !== undefined) clearTimeout(timerId);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      detachToolHandlers();
      
      if (renderer.domElement.parentNode === containerRef.current) {
        containerRef.current?.removeChild(renderer.domElement);
      }
      
      controls.dispose();
      renderer.dispose();
      effectsPipeline.dispose();
      effectsPipelineRef.current = null;
      
      if (pathLineRef.current) {
        scene.remove(pathLineRef.current);
        pathLineRef.current.geometry.dispose();
        (pathLineRef.current.material as THREE.Material).dispose();
        pathLineRef.current = null;
      }
      if (activeTrailLineRef.current) {
        scene.remove(activeTrailLineRef.current);
        activeTrailLineRef.current.geometry.dispose();
        (activeTrailLineRef.current.material as THREE.Material).dispose();
        activeTrailLineRef.current = null;
      }
      if (orbMeshRef.current) {
        scene.remove(orbMeshRef.current);
        orbMeshRef.current.geometry.dispose();
        (orbMeshRef.current.material as THREE.Material).dispose();
        orbMeshRef.current = null;
      }
      if (pointLightRef.current) {
        scene.remove(pointLightRef.current);
        pointLightRef.current.dispose();
        pointLightRef.current = null;
      }
      
      worker.terminate();
      workerBusyRef.current = false;
      
      // Cleanup Three.js scene
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh || (object as THREE.Sprite).isSprite) {
          const mesh = object as THREE.Mesh | THREE.Sprite;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };

  }, [inputText, viewMode, parseMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera settings removed - OrbitControls handles all camera interaction

  // Update node scale (and depth-size) when relevant style settings change
  useEffect(() => {
    if (!graphNodesRef.current.size) return;
    const minW = minWordsRef.current;
    const maxW = maxWordsRef.current;
    graphNodesRef.current.forEach(node => {
      if (node.textSprite) {
        const baseScale = node.textSprite.userData.baseScale || 1;
        const aspectRatio = node.textSprite.userData.aspectRatio || 1;
        const depthFactor = getDepthFactor(node.wordCount, minW, maxW, styleSettings);
        node.textSprite.scale.set(
          baseScale * styleSettings.nodeScale * depthFactor,
          baseScale * styleSettings.nodeScale * depthFactor * aspectRatio,
          1
        );
      }
    });
  }, [styleSettings.nodeScale, styleSettings.depthSizeEnabled, styleSettings.depthSizeStrength]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild textures immediately when node shape changes (discrete button event — no debounce)
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    if (textureRebuildTimerRef.current) {
      clearTimeout(textureRebuildTimerRef.current);
      textureRebuildTimerRef.current = null;
    }
    rebuildAndRefreshTextures();
  }, [styleSettings.nodeShape]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild textures debounced when border width changes (potentially slider-driven)
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    if (textureRebuildTimerRef.current) clearTimeout(textureRebuildTimerRef.current);
    textureRebuildTimerRef.current = setTimeout(() => {
      if (!sceneRef.current) return;
      rebuildAndRefreshTextures();
      textureRebuildTimerRef.current = null;
    }, 80);
  }, [styleSettings.nodeBorderWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update edge material when style settings change
  useEffect(() => {
    if (!edgeLinesRef.current) return;
    const mat = edgeLinesRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = styleSettings.edgeOpacity;
    mat.linewidth = styleSettings.edgeWidth;
    mat.needsUpdate = true;
  }, [styleSettings.edgeOpacity, styleSettings.edgeWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update edge color when edge appearance changes
  useEffect(() => {
    if (!edgeLinesRef.current) return;
    const newColor = edgeAppearance.color !== 'auto' ? new THREE.Color(edgeAppearance.color) : new THREE.Color(0x9aa0aa);
    const mat = edgeLinesRef.current.material as THREE.LineBasicMaterial;
    mat.color = newColor;
    mat.needsUpdate = true;
  }, [edgeAppearance]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild textures when theme changes (light/dark affects label fill background)
  useEffect(() => {
    if (!sceneRef.current) return;
    if (graphNodesRef.current.size === 0) return;
    rebuildAndRefreshTextures();
  }, [isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewportContextMenu = useCallback((e: React.MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const intersects = raycaster.intersectObjects(spritesArrayRef.current);
    
    if (intersects.length > 0) {
      const sprite = intersects[0].object;
      const node = graphNodesRef.current.get(sprite.userData.label);
      if (node) {
        setContextMenuNode(node);
        return;
      }
    }
    
    // If no node clicked, don't open menu
    setContextMenuNode(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <ContextMenu onOpenChange={(open) => { if (!open) setContextMenuNode(null); }}>
      <div 
        ref={containerRef} 
        className="w-full h-full relative outline-none select-none bg-transparent"
        style={{ touchAction: 'none' }}
      >
        <ContextMenuTrigger 
          className="w-full h-full"
          onContextMenu={handleViewportContextMenu}
        >
          {/* Three.js Canvas will be here */}
        </ContextMenuTrigger>

        {/* SVG Paintbrush overlay circle */}
        {activeTool === 'paint' && mouseCoords && (
          <svg className="pointer-events-none absolute inset-0 w-full h-full z-30">
            <circle
              cx={mouseCoords.x}
              cy={mouseCoords.y}
              r={brushRadius}
              fill={paintMode === 'erase' ? 'rgba(225, 29, 72, 0.05)' : `${paintColor}0f`}
              stroke={paintMode === 'erase' ? '#e11d48' : paintColor}
              strokeWidth={1.5}
              strokeDasharray={paintMode === 'erase' ? '3,3' : undefined}
              className="opacity-80 transition-[r] duration-75 ease-out"
            />
          </svg>
        )}

        {/* Camera Locked Indicator */}
        {cameraLocked && (
          <div className="absolute top-4 right-4 z-20 bg-wn-accent/90 text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-lg animate-in slide-in-from-top-4 duration-300">
            <Lock className="w-3 h-3" />
            {i18n.t('network3d.camera.locked')}
            <button 
              className="ml-1 hover:bg-white/20 rounded px-1 transition-colors"
              onClick={() => {
                setCameraLocked(false);
                lockedNodeRef.current = null;
              }}
            >
              {i18n.t('network3d.camera.unlock')}
            </button>
          </div>
        )}

      </div>

      {/* Context Menu (Shadcn/Radix) */}
      {contextMenuNode && (
        <ContextMenuContent className="w-52">
          <ContextMenuItem
            onClick={() => {
              flyToTargetRef.current = new THREE.Vector3(contextMenuNode.x, contextMenuNode.y, contextMenuNode.z);
              setContextMenuNode(null);
            }}
          >
            <Crosshair className="w-3.5 h-3.5 mr-2" />
            {i18n.t('network3d.contextMenu.centerView')}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              const nodePos = new THREE.Vector3(contextMenuNode.x, contextMenuNode.y, contextMenuNode.z);
              lockedNodeRef.current = contextMenuNode;
              setCameraLocked(true);
              if (viewMode !== '2D' && cameraRef.current && controlsRef.current) {
                const dir = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
                cameraFlyRef.current = {
                  fromPos: cameraRef.current.position.clone(),
                  toPos: nodePos.clone().addScaledVector(dir, 320),
                  fromTarget: controlsRef.current.target.clone(),
                  toTarget: nodePos.clone(),
                  startTime: performance.now(),
                  duration: 700,
                };
              } else if (viewMode === '2D' && cameraRef.current) {
                flyToTargetRef.current = nodePos.clone();
                const cam = cameraRef.current as THREE.OrthographicCamera;
                cam.zoom = Math.max(cam.zoom, 3);
                cam.updateProjectionMatrix();
              }
              setContextMenuNode(null);
            }}
          >
            <Lock className="w-3.5 h-3.5 mr-2" />
            {i18n.t('network3d.contextMenu.lockCamera')}
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
});

Network3D.displayName = 'Network3D';
