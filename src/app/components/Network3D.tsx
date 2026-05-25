import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Crosshair, Lock } from 'lucide-react';
import * as THREE from 'three';
import { createPortal } from 'react-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { evaluateHermite, computeCatmullRomTangent, applyEasing } from '../easing';
import { getNetworkLabelStyle, getNetworkThemeBackground, type NodeShape, SCENE_COLORS } from '../networkTheme';
import { type GraphNode, type GraphEdge, type PhysicsParams, DEFAULT_PHYSICS, buildNetworkFromText } from '../graph';
import { rebuildPhysicsCache } from '../graph';
import { PHYS_TRACK_PARAM } from '../context/WortnetzContextConstants';
import type { TrackMeta } from '../animation/Track';
import type { WorkerTrack } from '../animation/evaluateTracks';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from './ui/context-menu';

import type { PhysicsKeyframe } from './timeline/types';
import i18n from '../i18n';


const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _scratchColor = new THREE.Color();
const _scratchVec1 = new THREE.Vector3();
const _scratchVec2 = new THREE.Vector3();


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
  };
  onNodeSelect?: (node: any) => void;
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
      pathCameraFollow: true
    },
    onNodeSelect
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const graphNodesRef = useRef<Map<string, GraphNode>>(new Map());
  const graphEdgesRef = useRef<GraphEdge[]>([]);
  const graphNodeArrayRef = useRef<GraphNode[]>([]);
  const sharedPairMatrixRef = useRef<Uint8Array>(new Uint8Array(0));
  const spritesArrayRef = useRef<THREE.Object3D[]>([]);
  const edgeLinesRef = useRef<THREE.LineSegments | null>(null);
  const textureCacheRef = useRef<Map<string, { normal: THREE.Texture; highlighted?: THREE.Texture; selected?: THREE.Texture; baseScale: number; aspectRatio: number }>>(new Map());
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
  const flyToTargetRef = useRef<THREE.Vector3 | null>(null);
  const zoomAnimRef = useRef<{ from: number; to: number; startTime: number; duration: number } | null>(null);
  const cameraFlyRef = useRef<{
    fromPos: THREE.Vector3; toPos: THREE.Vector3;
    fromTarget: THREE.Vector3; toTarget: THREE.Vector3;
    startTime: number; duration: number;
  } | null>(null);
  const [panX, setPanX] = useState(0);
  const lastPanXRef = useRef(0);
  const mousePosRef = useRef(new THREE.Vector2(0, 0));
  const [contextMenuNode, setContextMenuNode] = useState<GraphNode | null>(null);
  const [cameraLocked, setCameraLocked] = useState(false);
  const setCameraLockedRef = useRef(setCameraLocked);
  const textureRebuildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styleSettingsRef = useRef(styleSettings);
  const isDarkRef = useRef(isDark);
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
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);
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





  const syncGraphVisuals = (nodes: Map<string, GraphNode>, edges: GraphEdge[], nodeArr?: GraphNode[], vsOverride?: any, ssOverride?: any) => {
    const arr = nodeArr ?? Array.from(nodes.values());
    const vs = vsOverride ?? visualSettingsRef.current;
    const ss = ssOverride ?? styleSettingsRef.current;
    
    // Preparation for uDistMap (conceptual for now as requested)
    _colorA.set(vs.gradientOrigin);
    _colorB.set(vs.gradientPeriphery);

    // Normalize distance against the actual furthest node so the falloff
    // spreads across the visible range regardless of graph extent.
    let maxDistSq = 0;
    for (let i = 0; i < arr.length; i++) {
      const n = arr[i];
      const dSq = n.x * n.x + n.y * n.y + n.z * n.z;
      if (dSq > maxDistSq) maxDistSq = dSq;
    }
    const invMaxDistSq = 1 / (maxDistSq || 1);

    // Quadratic slider response: subtle near zero, dramatic at the extremes.
    // Sign of the slider chooses growth (right) vs. shrink (left).
    const falloffMagnitude = vs.radialBiasScale * vs.radialBiasScale * 8;

    for (let i = 0; i < arr.length; i++) {
      const node = arr[i];
      if (node.textSprite) {
        node.textSprite.position.set(node.x, node.y, node.z);

        // Visibility
        node.textSprite.visible = vs.nodesVisible;

        const distSq = node.x * node.x + node.y * node.y + node.z * node.z;
        const normDistSq = distSq * invMaxDistSq;

        // Scale Radial Bias — cubic curve concentrates the growth at one
        // end of the radial axis. Positive slider grows outer nodes,
        // negative slider grows inner nodes; the other end stays untouched.
        const baseScale = node.textSprite.userData.baseScale * ss.nodeScale;
        const t = vs.radialBiasScale >= 0 ? normDistSq : 1.0 - normDistSq;
        const distCurve = t * t * t;
        const scaleIntensity = 1.0 + (falloffMagnitude * distCurve);
        const aspectRatio = node.textSprite.userData.aspectRatio;
        
        let finalScale = baseScale * scaleIntensity;
        // Instance Override
        if (node.unlinkedScale && node.scaleOverride !== undefined) {
          finalScale = node.textSprite.userData.baseScale * node.scaleOverride;
        }
        
        node.textSprite.scale.set(finalScale, finalScale * aspectRatio, 1);
        
        // Opacity Radial Bias
        let finalOpacity = Math.max(0.0, 1.0 - (vs.radialBiasOpacity * normDistSq));
        // Instance Override
        if (node.unlinkedOpacity && node.opacityOverride !== undefined) {
          finalOpacity = node.opacityOverride;
        }
        node.textSprite.material.opacity = finalOpacity;
        
        // MESH GRADIENT (uDistMap simulation)
        // Interpolate between Origin and Periphery based on distance
        const nodeColor = _scratchColor.lerpColors(_colorA, _colorB, normDistSq);
        // Apply color - since we use textures, we might need to adjust the sprite's material color
        // if the texture itself is white/grayscale, or swap textures if they are color-baked.
        // For now, let's tint the sprite material.
        node.textSprite.material.color.copy(nodeColor);

        // GLITCH PAINT LOGIC (Reveal by distance from mouse)
        if (vs.glitchActive) {
          // Calculate distance from mouse in world space or screen space
          // This is a simplified JS version of the shader logic requested
          _scratchVec1.copy(node.textSprite.position).project(cameraRef.current!);
          _scratchVec2.set(mousePosRef.current.x, mousePosRef.current.y, _scratchVec1.z);
          const mouseDist = _scratchVec1.distanceTo(_scratchVec2);
          
          // Revealed radius based on brush size (normalized)
          const brushRadiusNorm = vs.glitchBrushRadius / 500; 
          const feather = vs.glitchFeather;
          
          const reveal = 1.0 - THREE.MathUtils.smoothstep(mouseDist, brushRadiusNorm * (1 - feather), brushRadiusNorm);
          node.textSprite.material.opacity *= reveal;
        }
      }
    }

    // Update merged edge positions buffer (single LineSegments object)
    const edgeLines = edgeLinesRef.current;
    if (edgeLines) {
      edgeLines.visible = vs.edgesVisible;
      const pos = edgeLines.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const idx = i * 2;
        pos.setXYZ(idx, edge.a.x, edge.a.y, edge.a.z);
        pos.setXYZ(idx + 1, edge.b.x, edge.b.y, edge.b.z);
      }
      pos.needsUpdate = true;
    }
    
    // GLITCH PAINT TOOL revealed by distance (conceptual uniform update)
    if (vs.glitchActive) {
      // In a real implementation, we would pass uMousePos and vs.glitchBrushRadius/glitchFeather
      // to the node shader here.
    }
  };

  // Immediate sync when visual/style settings change
  useEffect(() => {
    if (graphNodesRef.current) {
      syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, undefined, visualSettings, styleSettings);
    }
  }, [visualSettings, styleSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── CANVAS TEXTURE CREATION (fixed dimensions for all states) ── */
  const EDIT_NODE_COLOR = SCENE_COLORS.editNodeColor; // neutral gray for edit mode
  // Fixed outline margin — always allocated so all 3 state textures share identical canvas size
  const OUTLINE_STROKE = 3;
  const OUTLINE_GAP = 2;
  const OUTLINE_MARGIN = OUTLINE_STROKE + OUTLINE_GAP;

  // Use standard DOM canvas elements instead of OffscreenCanvas to bypass WebKit's strict hard limits on OffscreenCanvas contexts,
  // and avoid DataTexture/getImageData to prevent synchronous main-thread pipeline stalls during initialization.
  const createCanvasTexture = (
    text: string, highlighted: boolean, selected: boolean, darkOverride?: boolean
  ): { texture: THREE.Texture; baseScale: number; aspectRatio: number } => {
    const dark = darkOverride !== undefined ? darkOverride : isDarkRef.current;
    const effectiveBorderColor = EDIT_NODE_COLOR;
    const effectiveTextColor = EDIT_NODE_COLOR;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const words = text.split(' ');
    const fontSize = 28;
    const lineHeight = fontSize * 1.2;
    const padding = 14;
    const pixelRatio = 3;

    context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    const maxWidth = Math.max(...words.map(w => context.measureText(w).width));
    const logicalWidth = maxWidth + padding * 2;
    const logicalHeight = words.length * lineHeight + padding * 2;

    // Always use fixed outline margin so all states have identical canvas dimensions
    const canvasLogicalWidth = logicalWidth + OUTLINE_MARGIN * 2;
    const canvasLogicalHeight = logicalHeight + OUTLINE_MARGIN * 2;

    canvas.width = canvasLogicalWidth * pixelRatio;
    canvas.height = canvasLogicalHeight * pixelRatio;
    context.scale(pixelRatio, pixelRatio);

    const nodeShape = styleSettingsRef.current.nodeShape ?? 'rectangle';
    const bw = styleSettingsRef.current.nodeBorderWidth ?? 2;
    const fillColor = getNetworkLabelStyle(dark).backgroundHex;
    const cx = OUTLINE_MARGIN + logicalWidth / 2;
    const cy = OUTLINE_MARGIN + logicalHeight / 2;

    // Clip to shape so text doesn't bleed outside ellipse
    context.save();
    context.beginPath();
    if (nodeShape === 'ellipse') {
      context.ellipse(cx, cy, logicalWidth / 2, logicalHeight / 2, 0, 0, Math.PI * 2);
    } else if (nodeShape === 'rounded-rectangle') {
      context.roundRect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight, 6);
    } else {
      context.rect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight);
    }
    context.clip();

    // Background fill
    context.fillStyle = fillColor;
    if (nodeShape === 'ellipse') {
      context.beginPath();
      context.ellipse(cx, cy, logicalWidth / 2, logicalHeight / 2, 0, 0, Math.PI * 2);
      context.fill();
    } else if (nodeShape === 'rounded-rectangle') {
      context.beginPath();
      context.roundRect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight, 6);
      context.fill();
    } else {
      context.fillRect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight);
    }
    context.restore();

    if (!highlighted && !selected) {
      if (bw > 0) {
        context.strokeStyle = effectiveBorderColor;
        context.lineWidth = bw;
        context.beginPath();
        // Outside stroke: path is outset by bw/2 so the inner stroke edge touches the fill boundary
        if (nodeShape === 'ellipse') {
          context.ellipse(cx, cy, logicalWidth / 2 + bw / 2, logicalHeight / 2 + bw / 2, 0, 0, Math.PI * 2);
        } else if (nodeShape === 'rounded-rectangle') {
          context.roundRect(OUTLINE_MARGIN - bw / 2, OUTLINE_MARGIN - bw / 2, logicalWidth + bw, logicalHeight + bw, 6);
        } else {
          context.roundRect(OUTLINE_MARGIN - bw / 2, OUTLINE_MARGIN - bw / 2, logicalWidth + bw, logicalHeight + bw, 3 + bw / 2);
        }
        context.stroke();
      }
    } else {
      const pathOff = OUTLINE_MARGIN - OUTLINE_GAP - OUTLINE_STROKE / 2;
      const pathW = logicalWidth + 2 * (OUTLINE_GAP + OUTLINE_STROKE / 2);
      const pathH = logicalHeight + 2 * (OUTLINE_GAP + OUTLINE_STROKE / 2);
      context.strokeStyle = SCENE_COLORS.selectionOutline;
      context.lineWidth = OUTLINE_STROKE;
      context.beginPath();
      if (nodeShape === 'ellipse') {
        context.ellipse(cx, cy, pathW / 2, pathH / 2, 0, 0, Math.PI * 2);
      } else if (nodeShape === 'rounded-rectangle') {
        context.roundRect(pathOff, pathOff, pathW, pathH, 8);
      } else {
        context.roundRect(pathOff, pathOff, pathW, pathH, 5);
      }
      context.stroke();
    }

    context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    context.fillStyle = effectiveTextColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    words.forEach((word, i) => {
      const y = OUTLINE_MARGIN + padding + lineHeight / 2 + i * lineHeight;
      context.fillText(word, OUTLINE_MARGIN + logicalWidth / 2, y);
    });

    // Use CanvasTexture, which asynchronously uploads the DOM canvas to the GPU during rendering.
    // This is much faster than DataTexture + getImageData, avoiding synchronous CPU/GPU stalls.
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const wordCount = words.length;
    const scaleFactor = Math.max(0.4, 1 - (wordCount * 0.05));
    const baseScale = (Math.max(canvasLogicalWidth, canvasLogicalHeight) / 2.5) * scaleFactor;
    const aspectRatio = canvasLogicalHeight / canvasLogicalWidth;

    return { texture, baseScale, aspectRatio };
  };

  /** Create a sprite from a pre-built texture. */
  const createSpriteFromTexture = (
    texture: THREE.Texture, label: string, baseScale: number, aspectRatio: number, nodeScale: number
  ): THREE.Sprite => {
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true, 
      depthTest: true,
      depthWrite: true,
      alphaTest: 0.1
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.renderOrder = 1; // always draw sprites on top of edge lines
    sprite.userData.label = label;
    sprite.userData.baseScale = baseScale;
    sprite.userData.aspectRatio = aspectRatio;
    sprite.scale.set(baseScale * nodeScale, baseScale * nodeScale * aspectRatio, 1);
    return sprite;
  };

  /** Build (or rebuild) the 3-state texture cache for all nodes. */
  const buildTextureCache = (nodes: Map<string, GraphNode>) => {
    textureCacheRef.current.forEach(entry => {
      entry.normal.dispose();
      entry.highlighted?.dispose();
      entry.selected?.dispose();
    });
    const cache = new Map<string, { normal: THREE.Texture; highlighted?: THREE.Texture; selected?: THREE.Texture; baseScale: number; aspectRatio: number }>();
    nodes.forEach(node => {
      const n = createCanvasTexture(node.label, false, false);
      cache.set(node.label, {
        normal: n.texture,
        baseScale: n.baseScale, aspectRatio: n.aspectRatio,
      });
    });
    textureCacheRef.current = cache;
  };

  /** Swap a sprite's texture to the correct cached state (generating on-demand if needed). */
  const swapSpriteTexture = (node: GraphNode, highlighted: boolean, selected: boolean) => {
    if (!node.textSprite) return;
    const cached = textureCacheRef.current.get(node.label);
    if (!cached) return;

    let tex = cached.normal;
    if (selected) {
      if (!cached.selected) {
        const s = createCanvasTexture(node.label, false, true);
        cached.selected = s.texture;
      }
      tex = cached.selected;
    } else if (highlighted) {
      if (!cached.highlighted) {
        const h = createCanvasTexture(node.label, true, false);
        cached.highlighted = h.texture;
      }
      tex = cached.highlighted;
    }

    node.textSprite.material.map = tex;
    node.textSprite.material.needsUpdate = true;
  };

  const getDepthFactor = (wordCount: number, minW: number, maxW: number, ss: typeof styleSettings): number => {
    if (!ss.depthSizeEnabled) return 1;
    const depthT = maxW !== minW ? (wordCount - minW) / (maxW - minW) : 0.5;
    const strength = (ss.depthSizeStrength ?? 50) / 100;
    return 1 + strength * 0.5 * (1 - 2 * depthT);
  };

  /** Update all sprite textures from cache (after cache rebuild). */
  const refreshAllSpriteTextures = () => {
    const ss = styleSettingsRef.current;
    const minW = minWordsRef.current;
    const maxW = maxWordsRef.current;
    graphNodesRef.current.forEach(node => {
      if (!node.textSprite) return;
      const cached = textureCacheRef.current.get(node.label);
      if (!cached) return;
      const isHovered = hoveredNodeRef.current?.label === node.label;
      const isSelected = selectedNodeRef.current?.label === node.label;
      
      let tex = cached.normal;
      if (isSelected) {
        if (!cached.selected) {
          const s = createCanvasTexture(node.label, false, true);
          cached.selected = s.texture;
        }
        tex = cached.selected;
      } else if (isHovered) {
        if (!cached.highlighted) {
          const h = createCanvasTexture(node.label, true, false);
          cached.highlighted = h.texture;
        }
        tex = cached.highlighted;
      }
      
      node.textSprite.material.map = tex;
      node.textSprite.material.needsUpdate = true;
      node.textSprite.userData.baseScale = cached.baseScale;
      node.textSprite.userData.aspectRatio = cached.aspectRatio;
      const depthFactor = getDepthFactor(node.wordCount, minW, maxW, ss);
      node.textSprite.scale.set(
        cached.baseScale * ss.nodeScale * depthFactor,
        cached.baseScale * ss.nodeScale * depthFactor * cached.aspectRatio,
        1
      );
    });
  };

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

    if (sorted.length === 1 || time <= sorted[0].time) {
      cameraRef.current.position.set(sorted[0].position.x, sorted[0].position.y, sorted[0].position.z);
      controlsRef.current.target.set(sorted[0].target.x, sorted[0].target.y, sorted[0].target.z);
      cameraRef.current.lookAt(controlsRef.current.target);
      return;
    }
    if (time >= sorted[sorted.length - 1].time) {
      const last = sorted[sorted.length - 1];
      cameraRef.current.position.set(last.position.x, last.position.y, last.position.z);
      controlsRef.current.target.set(last.target.x, last.target.y, last.target.z);
      cameraRef.current.lookAt(controlsRef.current.target);
      return;
    }

    let prevIdx = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (time >= sorted[i].time && time <= sorted[i + 1].time) { prevIdx = i; break; }
    }
    const prev = sorted[prevIdx];
    const next = sorted[prevIdx + 1];
    const pp = prevIdx > 0 ? sorted[prevIdx - 1] : null;
    const nn = prevIdx + 2 < sorted.length ? sorted[prevIdx + 2] : null;

    const segDur = next.time - prev.time;
    if (segDur === 0) {
      cameraRef.current.position.set(prev.position.x, prev.position.y, prev.position.z);
      controlsRef.current.target.set(prev.target.x, prev.target.y, prev.target.z);
      cameraRef.current.lookAt(controlsRef.current.target);
      return;
    }
    const tRaw = Math.max(0, Math.min(1, (time - prev.time) / segDur));

    if (prev.interpolation === 'hold') {
      cameraRef.current.position.set(prev.position.x, prev.position.y, prev.position.z);
      controlsRef.current.target.set(prev.target.x, prev.target.y, prev.target.z);
      cameraRef.current.lookAt(controlsRef.current.target);
      return;
    }

    if (prev.interpolation === 'linear') {
      const lerp = (a: number, b: number) => a + (b - a) * tRaw;
      cameraRef.current.position.set(
        lerp(prev.position.x, next.position.x),
        lerp(prev.position.y, next.position.y),
        lerp(prev.position.z, next.position.z),
      );
      controlsRef.current.target.set(
        lerp(prev.target.x, next.target.x),
        lerp(prev.target.y, next.target.y),
        lerp(prev.target.z, next.target.z),
      );
      cameraRef.current.lookAt(controlsRef.current.target);
      return;
    }

    const t0 = prev.tension ?? 1;
    const t1 = next.tension ?? 1;
    const hermite = (pPrev: number | null, tPrev: number | null, p0: number, p1: number, pNext: number | null, tNext: number | null, mOut: number | undefined, mIn: number | undefined): number => {
      // Boundary fix: clamp to 0 at first/last keyframe to prevent overshoot
      const m0 = (mOut ?? (tPrev === null ? 0 : computeCatmullRomTangent(tPrev, pPrev, prev.time, p0, next.time, p1))) * t0;
      const m1 = (mIn  ?? (tNext === null ? 0 : computeCatmullRomTangent(prev.time, p0, next.time, p1, tNext, pNext))) * t1;
      return evaluateHermite(tRaw, p0, m0, p1, m1, segDur);
    };

    const camX = hermite(pp?.position.x ?? null, pp?.time ?? null, prev.position.x, next.position.x, nn?.position.x ?? null, nn?.time ?? null, prev.handleOutPos?.x, next.handleInPos?.x);
    const camY = hermite(pp?.position.y ?? null, pp?.time ?? null, prev.position.y, next.position.y, nn?.position.y ?? null, nn?.time ?? null, prev.handleOutPos?.y, next.handleInPos?.y);
    const camZ = hermite(pp?.position.z ?? null, pp?.time ?? null, prev.position.z, next.position.z, nn?.position.z ?? null, nn?.time ?? null, prev.handleOutPos?.z, next.handleInPos?.z);
    const tgtX = hermite(pp?.target.x ?? null, pp?.time ?? null, prev.target.x, next.target.x, nn?.target.x ?? null, nn?.time ?? null, prev.handleOutTgt?.x, next.handleInTgt?.x);
    const tgtY = hermite(pp?.target.y ?? null, pp?.time ?? null, prev.target.y, next.target.y, nn?.target.y ?? null, nn?.time ?? null, prev.handleOutTgt?.y, next.handleInTgt?.y);
    const tgtZ = hermite(pp?.target.z ?? null, pp?.time ?? null, prev.target.z, next.target.z, nn?.target.z ?? null, nn?.time ?? null, prev.handleOutTgt?.z, next.handleInTgt?.z);

    // Cartesian Hermite traces a chord rather than an arc, causing the camera to drift
    // closer to the target mid-segment. Rescale the offset to the linearly interpolated
    // distance so rotation moves stay at constant distance and dolly moves still work.
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

    // Map node labels to stable indices for edge encoding
    const labelToIdx = new Map<string, number>();
    nodeArr.forEach((node, i) => labelToIdx.set(node.label, i));

    const edgeIdxArr = new Int32Array(edges.length * 2);
    edges.forEach((edge, ei) => {
      edgeIdxArr[ei * 2]     = labelToIdx.get(edge.a.label)!;
      edgeIdxArr[ei * 2 + 1] = labelToIdx.get(edge.b.label)!;
    });

    const wordCountArr = new Int32Array(nodeArr.map(n => n.wordCount));
    const spm = physCache.sharedPairMatrix;

    // Reusable position+velocity buffer (transferred back and forth — zero GC)
    workerPosVelRef.current = new Float64Array(nodeCount * 6);

    const worker = new Worker(new URL('../graph/physics.worker.ts', import.meta.url), { type: 'module' });
    physicsWorkerRef.current = worker;

    worker.postMessage(
      { type: 'init', edgeIndices: edgeIdxArr, wordCounts: wordCountArr, sharedPairMatrix: spm, nodeCount },
    );

    if (!is2D) {
      // 3D settle: hand initial node positions to the worker so it can run up to 500
      // physics iterations off the main thread. The loading overlay covers the initial
      // unsettled state until the worker reports back.
      const settleBuffer = new Float64Array(nodeCount * 6);
      nodeArr.forEach((node, i) => {
        settleBuffer[i * 6]     = node.x;
        settleBuffer[i * 6 + 1] = node.y;
        settleBuffer[i * 6 + 2] = node.z;
        // vx/vy/vz stay 0
      });
      worker.postMessage(
        { type: 'settle', posVel: settleBuffer, params: DEFAULT_PHYSICS, maxIterations: 500 },
        [settleBuffer.buffer],
      );
    }

    worker.onmessage = (e: MessageEvent<{ type: string; posVel?: Float64Array; avgMovement?: number; progress?: number; applied?: PhysicsParams }>) => {
      if (e.data.type === 'settle_progress') {
        const { progress } = e.data;
        if (progress !== undefined) {
          onProgressRef.current?.(progress);
        }
        return;
      }

      if (e.data.type === 'settled') {
        const { posVel } = e.data;
        if (!posVel) return;
        const arr = graphNodeArrayRef.current;
        // Write settled positions back and reveal the scene
        for (let i = 0; i < arr.length; i++) {
          const b = i * 6;
          arr[i].x = posVel[b]; arr[i].y = posVel[b + 1]; arr[i].z = posVel[b + 2];
          arr[i].vx = 0; arr[i].vy = 0; arr[i].vz = 0;
        }
        workerPosVelRef.current = posVel;
        syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, arr);
        fitToView(true);
        if (rendererRef.current) rendererRef.current.domElement.style.opacity = '1';
        requestAnimationFrame(() => onReadyRef.current?.());
        return;
      }

      // ── STEP response ──
      const { posVel, avgMovement, applied } = e.data;
      if (!posVel || avgMovement === undefined) return;
      if (applied) {
        // Worker is authoritative for `applied`; surfaces it back so the main
        // thread can drive jolt velocity, recording, and external consumers
        // via `getEffectivePhysicsParams()`.
        effectivePhysicsRef.current = applied;
      }
      const arr = graphNodeArrayRef.current;
      for (let i = 0; i < arr.length; i++) {
        const b = i * 6;
        arr[i].x = posVel[b];     arr[i].y = posVel[b + 1]; arr[i].z = posVel[b + 2];
        arr[i].vx = posVel[b + 3]; arr[i].vy = posVel[b + 4]; arr[i].vz = posVel[b + 5];
      }

      // Reclaim the transferred buffer for reuse on the next step
      workerPosVelRef.current = posVel;

      // 2D sprite-based overlap separation (must run on main thread — reads sprite scales)
      let maxOverlap = 0;
      if (is2D && (avgMovement > 0.5 || prevMaxOverlapRef.current > 0)) {
        const n2 = arr.length;
        const maxPasses = n2 > 300 ? 1 : (n2 > 150 ? 2 : 4);
        for (let pass = 0; pass < maxPasses; pass++) {
          for (let i = 0; i < n2; i++) {
            for (let j = i + 1; j < n2; j++) {
              const a = arr[i], b2 = arr[j];
              const dx = a.x - b2.x, dy = a.y - b2.y;
              const distSep = Math.sqrt(dx * dx + dy * dy) + 0.001;
              const rA = a.textSprite ? (a.textSprite.scale.x + a.textSprite.scale.y) / 4 : 30;
              const rB = b2.textSprite ? (b2.textSprite.scale.x + b2.textSprite.scale.y) / 4 : 30;
              const minSep = rA + rB + 6;
              if (distSep < minSep) {
                const overlap = minSep - distSep;
                if (overlap > maxOverlap) maxOverlap = overlap;
                const push = overlap * 0.5 / distSep;
                a.x += dx * push;   a.y += dy * push;
                b2.x -= dx * push;  b2.y -= dy * push;
              }
            }
          }
        }
      }

      prevMaxOverlapRef.current = maxOverlap;

      const hasActiveModulationLoc = (isPlayingRef.current && hasAnyKfsRef.current) || hasAnyModulatorRef.current;
      if (avgMovement > 0.05 || maxOverlap > 0 || hasActiveModulationLoc) {
        syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, arr);
      }

      // Auto-stop heuristic
      const curParams = effectivePhysicsRef.current;
      const hasActiveModulation = (isPlayingRef.current && hasAnyKfsRef.current) || hasAnyModulatorRef.current;
      if (curParams.turbulence > 0 || maxOverlap > 1 || hasActiveModulation) {
        stillFramesRef.current = 0;
      } else if (avgMovement < 0.5) {
        stillFramesRef.current++;
        if (stillFramesRef.current > 60) physicsEnabledRef.current = false;
      } else {
        stillFramesRef.current = 0;
      }

      workerBusyRef.current = false;
    };

    // Create edges — single merged LineSegments (1 draw call for all edges)
    const edgeColor = edgeAppearance.color !== 'auto' 
      ? new THREE.Color(edgeAppearance.color) 
      : new THREE.Color(isDark ? 0xe4e4e7 : 0x94a3b8); // Zinc-200 on dark, Zinc-400 on light
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
    buildTextureCache(nodes);

    // Create nodes with billboarded text from cached normal textures
    nodes.forEach(node => {
      const cached = textureCacheRef.current.get(node.label)!;
      const sprite = createSpriteFromTexture(
        cached.normal, node.label, cached.baseScale, cached.aspectRatio, styleSettings.nodeScale
      );
      sprite.position.set(node.x, node.y, node.z);
      scene.add(sprite);
      node.textSprite = sprite;
    });

    // Cache sprite list for raycasting — only rebuilt here and on structural changes (text change)
    spritesArrayRef.current = graphNodeArrayRef.current
      .map(n => n.textSprite)
      .filter(Boolean) as THREE.Object3D[];

    // Hover detection via raycasting (throttled to ~30fps)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastRaycastTime = 0;


    const handleHoverMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastRaycastTime < 33) return; // ~30fps throttle
      lastRaycastTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(spritesArrayRef.current);
      const hitLabel = intersects.length > 0 ? (intersects[0].object as THREE.Sprite).userData.label as string : null;
      const prevNode = hoveredNodeRef.current;
      const nextNode = hitLabel ? graphNodesRef.current.get(hitLabel) ?? null : null;

      if (prevNode?.label === nextNode?.label) return;
      if (prevNode) swapSpriteTexture(prevNode, false, prevNode.label === selectedNodeRef.current?.label);
      if (nextNode) swapSpriteTexture(nextNode, true, nextNode.label === selectedNodeRef.current?.label);
      hoveredNodeRef.current = nextNode;
      renderer.domElement.style.cursor = nextNode ? 'pointer' : 'default';
    };

    const handleHoverLeave = () => {
      if (hoveredNodeRef.current) {
        const was = hoveredNodeRef.current;
        swapSpriteTexture(was, false, was.label === selectedNodeRef.current?.label);
        hoveredNodeRef.current = null;
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('mousemove', handleHoverMove);
    renderer.domElement.addEventListener('mouseleave', handleHoverLeave);

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spritesArrayRef.current);
      const hit = intersects.length > 0 ? graphNodesRef.current.get((intersects[0].object as THREE.Sprite).userData.label) ?? null : null;
      const prev = selectedNodeRef.current;

      if (!hit) {
        if (prev) swapSpriteTexture(prev, prev.label === hoveredNodeRef.current?.label, false);
        selectedNodeRef.current = null;
        return;
      }

      if (prev && prev.label !== hit.label) swapSpriteTexture(prev, prev.label === hoveredNodeRef.current?.label, false);

      const selecting = hit.label !== prev?.label;
      selectedNodeRef.current = selecting ? hit : null;
      swapSpriteTexture(hit, hit.label === hoveredNodeRef.current?.label, selecting);
      
      // Notify parent
      onNodeSelectRef.current?.(selecting ? hit : null);
    };

    const handleDblClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spritesArrayRef.current);
      const hit = intersects.length > 0 ? graphNodesRef.current.get((intersects[0].object as THREE.Sprite).userData.label) ?? null : null;
      if (!hit) return;
      const nodePos = new THREE.Vector3(hit.x, hit.y, hit.z);
      if (!is2D && cameraRef.current && controlsRef.current) {
        const dir = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
        cameraFlyRef.current = {
          fromPos: cameraRef.current.position.clone(),
          toPos: nodePos.clone().addScaledVector(dir, 150),
          fromTarget: controlsRef.current.target.clone(),
          toTarget: nodePos.clone(),
          startTime: performance.now(),
          duration: 700,
        };
      } else if (is2D && cameraRef.current) {
        flyToTargetRef.current = nodePos.clone();
        const cam = cameraRef.current as THREE.OrthographicCamera;
        cam.zoom = Math.max(cam.zoom, 5);
        cam.updateProjectionMatrix();
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('dblclick', handleDblClick);

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

      // Dispatch a physics step to the worker when idle — result arrives in worker.onmessage
      if (delta < 5 && physicsEnabledRef.current && !workerBusyRef.current) {
        // The worker is now authoritative for keyframe/glide/LFO evaluation.
        // Main thread tracks parameter-change velocity from the previous frame's
        // `applied` to drive the jolt overrides — both are layered on top
        // of `applied` via `paramOverrides` so the worker stays a pure evaluator.
        const lastApplied = effectivePhysicsRef.current;

        const now = performance.now();
        const dtMs = Math.max(1, now - lastParamsTimeRef.current);
        const prev = lastParamsValuesRef.current;

        const dRep = Math.abs(lastApplied.repulsion - prev.repulsion) / 1000;
        const dSpr = Math.abs(lastApplied.springK - prev.springK) * 20;
        const dDmp = Math.abs(lastApplied.damping - prev.damping) * 20;
        const dSpd = Math.abs(lastApplied.minSpeed - prev.minSpeed);
        const dLnk = Math.abs(lastApplied.linkDistance - prev.linkDistance) / 100;
        const dGrv = Math.abs(lastApplied.gravity - prev.gravity) / 5;
        const dTrb = Math.abs((lastApplied.turbulence ?? 0) - (prev.turbulence ?? 0)) / 5;
        const dVto = Math.abs((lastApplied.verticalOrder ?? 0) - (prev.verticalOrder ?? 0)) / 2;
        const velocity = (dRep + dSpr + dDmp + dSpd + dLnk + dGrv + dTrb + dVto) / dtMs;

        // Keep jolt tracking velocity from worker-applied values, not sidebar state.
        if (!isPlayingRef.current) {
          physicsVelocityRef.current = Math.min(1.0, (physicsVelocityRef.current || 0) + velocity * 150);
        } else {
          physicsVelocityRef.current = (physicsVelocityRef.current || 0) * 0.8;
        }

        lastParamsTimeRef.current = now;
        Object.assign(lastParamsValuesRef.current, lastApplied);

        // Jolt damping floor become per-frame param overrides.
        const paramOverrides: Partial<PhysicsParams> = {};
        if ((physicsVelocityRef.current || 0) > 0.01) {
          const jolt = physicsVelocityRef.current || 0;
          const targetDamping = Math.max(lastApplied.damping, 0.92);
          paramOverrides.damping = lastApplied.damping + (targetDamping - lastApplied.damping) * Math.min(1, jolt * 1.5);
          physicsVelocityRef.current = (physicsVelocityRef.current || 0) * 0.80;
        }

        // dt for the worker's glide integrator (seconds since last step, clamped).
        const dtSeconds = Math.min(0.1, Math.max(0.001, (now - lastStepNowRef.current) / 1000));
        lastStepNowRef.current = now;

        // Pack current positions + velocities into the reusable buffer and transfer to worker
        const pv = workerPosVelRef.current;
        const dispArr = graphNodeArrayRef.current;
        for (let i = 0; i < dispArr.length; i++) {
          const b = i * 6;
          pv[b]     = dispArr[i].x;  pv[b + 1] = dispArr[i].y;  pv[b + 2] = dispArr[i].z;
          pv[b + 3] = dispArr[i].vx; pv[b + 4] = dispArr[i].vy; pv[b + 5] = dispArr[i].vz;
        }
        workerBusyRef.current = true;
        physicsWorkerRef.current!.postMessage(
          {
            type: 'step',
            posVel: pv,
            time: playheadRef.current,
            dt: dtSeconds,
            sliderParams: physicsParamsRef.current,
            paramOverrides: Object.keys(paramOverrides).length > 0 ? paramOverrides : undefined,
            is2D,
          },
          [pv.buffer],
        );
      }

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

        // Camera fly-to (gizmo double-click reset)
        if (cameraFlyRef.current) {
          const { fromPos, toPos, fromTarget, toTarget, startTime, duration } = cameraFlyRef.current;
          const t = Math.min(1, (performance.now() - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          camera.position.lerpVectors(fromPos, toPos, eased);
          controls.target.lerpVectors(fromTarget, toTarget, eased);
          if (t >= 1) cameraFlyRef.current = null;
        }
      }

      // Smooth fly-to target (node center — works in both modes)
      if (flyToTargetRef.current && controlsRef.current) {
        controlsRef.current.target.lerp(flyToTargetRef.current, 0.08);
        if (controlsRef.current.target.distanceTo(flyToTargetRef.current) < 0.5) {
          controlsRef.current.target.copy(flyToTargetRef.current);
          flyToTargetRef.current = null;
        }
      }

      // Locked camera: translate camera + target together to follow the node
      if (lockedNodeRef.current && controlsRef.current && !flyToTargetRef.current && !cameraFlyRef.current) {
        const n = lockedNodeRef.current;
        const newTarget = new THREE.Vector3(n.x, n.y, n.z);
        const delta = newTarget.clone().sub(controlsRef.current.target);
        camera.position.add(delta);
        controlsRef.current.target.copy(newTarget);
      }

      // Update controls (for damping) — fires 'change' synchronously if camera moved
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      applyingKeyframe = false;

      renderer.render(scene, camera);
    };
    animate();
    // 2D: reveal immediately after the first frame.
    // 3D: onReady is called once the worker settle completes (see onmessage 'settled' handler).
    if (is2D) {
      fitToView(true);
      if (rendererRef.current) rendererRef.current.domElement.style.opacity = '1';
      requestAnimationFrame(() => onReadyRef.current?.());
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      if (nw === 0 || nh === 0) return;
      if (is2D) {
        const cam = camera as THREE.OrthographicCamera;
        cam.left = -nw / 2; cam.right = nw / 2;
        cam.top = nh / 2;   cam.bottom = -nh / 2;
      } else {
        (camera as THREE.PerspectiveCamera).aspect = nw / nh;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      isCancelled = true;
      console.log('[Network3D] Effect cleanup running', { inputText: inputText.substring(0, 20) + '...' });
      
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      if (timerId !== undefined) clearTimeout(timerId);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      renderer.domElement.removeEventListener('mousemove', handleHoverMove);
      renderer.domElement.removeEventListener('mouseleave', handleHoverLeave);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('dblclick', handleDblClick);
      
      if (renderer.domElement.parentNode === containerRef.current) {
        containerRef.current?.removeChild(renderer.domElement);
      }
      
      controls.dispose();
      renderer.dispose();
      
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
    buildTextureCache(graphNodesRef.current);
    refreshAllSpriteTextures();
  }, [styleSettings.nodeShape]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild textures debounced when border width changes (potentially slider-driven)
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    if (textureRebuildTimerRef.current) clearTimeout(textureRebuildTimerRef.current);
    textureRebuildTimerRef.current = setTimeout(() => {
      if (!sceneRef.current) return;
      buildTextureCache(graphNodesRef.current);
      refreshAllSpriteTextures();
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
    buildTextureCache(graphNodesRef.current);
    refreshAllSpriteTextures();
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
