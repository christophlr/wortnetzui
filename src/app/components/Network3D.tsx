import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Crosshair, Lock, Maximize2 } from 'lucide-react';
import * as THREE from 'three';
import { createPortal } from 'react-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { evaluateHermite, computeCatmullRomTangent, applyEasing } from '../easing';
import { defaultGradientSettings, getNetworkLabelStyle, getNetworkThemeBackground, defaultNodeAppearance, type GradientSettings, type NodeShape } from '../networkTheme';
import { type GraphNode, type GraphEdge, type PhysicsParams, DEFAULT_PHYSICS, buildNetworkFromText } from '../graph';
import { rebuildPhysicsCache } from '../graph';

type PhysicsKeyframe = { time: number; value: number; handleIn?: number; handleOut?: number; mode?: 'aligned' | 'broken' };

interface Network3DProps {
  isPlaying: boolean;
  playheadPosition: number;
  inputText?: string;
  theme?: 'light' | 'dark' | 'system';
  viewMode?: '2D' | '3D';
  physicsParams?: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
  };
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  parseMode?: 'sentence' | 'word' | 'both';
  gradientSettings?: GradientSettings;
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
  renderMode?: 'edit' | 'render';
  nodeAppearance?: { borderColor: 'auto' | string; fillColor: 'auto' | string; textColor: 'auto' | string };
  edgeAppearance?: { color: 'auto' | string };
  timelineHeight?: number;
}




const DEFAULT_TEXT = `Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes, far away up the hill. It was 3am that day, cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write, I write like a ritual over and over. The more exist the more I go I fly, they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`;



/* ── THEME-AWARE BACKGROUND COLORS ── */
const getThemeBackgroundColors = (): { hex: string; threeColor: number } => {
  return getNetworkThemeBackground();
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

/* ── ORIENTATION GIZMO ── */
function drawGizmoCanvas(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement, hoveredLabel: string | null = null, activeLabel: string | null = null): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = canvas.width;
  const c = size / 2;
  const r = size * 0.36;

  ctx.clearRect(0, 0, size, size);

  const invQ = camera.quaternion.clone().invert();
  const axes = [
    { dir: new THREE.Vector3(1, 0, 0), posColor: '#ef4444', negColor: 'rgba(239,68,68,0.38)', label: 'X' },
    { dir: new THREE.Vector3(0, 1, 0), posColor: '#22c55e', negColor: 'rgba(34,197,94,0.38)', label: 'Y' },
    { dir: new THREE.Vector3(0, 0, 1), posColor: '#60a5fa', negColor: 'rgba(96,165,250,0.38)', label: 'Z' },
  ];

  const segs: { x: number; y: number; z: number; color: string; label: string }[] = [];
  axes.forEach(({ dir, posColor, negColor, label }) => {
    const pos = dir.clone().applyQuaternion(invQ);
    const neg = dir.clone().negate().applyQuaternion(invQ);
    segs.push({ x: c + pos.x * r, y: c - pos.y * r, z: pos.z, color: posColor, label });
    segs.push({ x: c + neg.x * r, y: c - neg.y * r, z: neg.z, color: negColor, label: '' });
  });

  segs.sort((a, b) => a.z - b.z);

  segs.forEach(({ x, y, color, label }) => {
    const isHovered = label && label === hoveredLabel;
    const isActive = label && label === activeLabel;
    
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = isActive ? 3.5 : (isHovered ? 3 : 2.5);
    ctx.stroke();

    if (label) {
      // Draw flat translucent halo for hover/active states
      if (isActive || isHovered) {
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 14 : 12, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = isActive ? 0.4 : 0.2;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      let rad = 9;
      if (isActive) rad = 10.5;
      else if (isHovered) rad = 9.5;
      
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      ctx.font = 'bold 11px system-ui,sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y + 0.5);
    }
  });
}

const PHYS_TRACK_PARAM: Record<string, keyof PhysicsParams> = {
  'phys-rep': 'repulsion',
  'phys-spk': 'springK',
  'phys-dmp': 'damping',
};

/** Interpolate a physics param from pre-sorted keyframes using Cubic Hermite splines. */
function interpolatePhysicsParam(sorted: PhysicsKeyframe[], time: number): number | null {
  if (sorted.length === 0) return null;
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i], b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const segDur = b.time - a.time;
      if (segDur === 0) return a.value;
      const tRaw = (time - a.time) / segDur;
      const prevTime = i > 0 ? sorted[i - 1].time : null;
      const prevVal = i > 0 ? sorted[i - 1].value : null;
      const nextTime = i + 2 < sorted.length ? sorted[i + 2].time : null;
      const nextVal = i + 2 < sorted.length ? sorted[i + 2].value : null;
      const m0 = a.handleOut ?? computeCatmullRomTangent(prevTime, prevVal, a.time, a.value, b.time, b.value);
      const m1 = b.handleIn ?? computeCatmullRomTangent(a.time, a.value, b.time, b.value, nextTime, nextVal);
      return evaluateHermite(tRaw, a.value, m0, b.value, m1, segDur);
    }
  }
  return null;
}

export interface Network3DHandle {
  getCameraKeyframe: () => { position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } | null;
  getEffectivePhysicsParams: () => PhysicsParams;
  panView: (dx: number, dy: number) => void;
  rotateView: (deltaTheta: number, deltaPhi: number) => void;
  setRotation: (theta: number, phi: number) => void;
  resetView: () => void;
}

export const Network3D = forwardRef<Network3DHandle, Network3DProps>((props, ref) => {
  const {
    isPlaying,
    playheadPosition,
    inputText = DEFAULT_TEXT,
    theme = 'system',
    viewMode = '3D',
    parseMode = 'sentence',
    physicsParams = DEFAULT_PHYSICS,
    physicsKeyframes,
    gradientSettings = defaultGradientSettings,
    styleSettings = { edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1, nodeShape: 'rectangle' as NodeShape, nodeBorderWidth: 2, depthSizeEnabled: false, depthSizeStrength: 50 },
    cameraKeyframes = [],
    onCameraChange,
    isDark,
    onReady,
    renderMode = 'edit',
    nodeAppearance = defaultNodeAppearance,
    edgeAppearance = { color: 'auto' },
    timelineHeight = 0,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const graphNodesRef = useRef<Map<string, GraphNode>>(new Map());
  const graphEdgesRef = useRef<GraphEdge[]>([]);
  const graphNodeArrayRef = useRef<GraphNode[]>([]);
  const sharedPairMatrixRef = useRef<Uint8Array>(new Uint8Array(0));
  const spritesArrayRef = useRef<THREE.Object3D[]>([]);
  const textureCacheRef = useRef<Map<string, { normal: THREE.CanvasTexture; highlighted?: THREE.CanvasTexture; selected?: THREE.CanvasTexture; baseScale: number; aspectRatio: number }>>(new Map());
  const physicsWorkerRef = useRef<Worker | null>(null);
  const workerBusyRef = useRef(false);
  const workerPosVelRef = useRef<Float64Array>(new Float64Array(0));
  const animationFrameRef = useRef<number>();
  const minWordsRef = useRef(Infinity);
  const maxWordsRef = useRef(-Infinity);
  const physicsEnabledRef = useRef(true);
  const stillFramesRef = useRef(0);
  const playheadRef = useRef(playheadPosition);
  const cameraKeyframesRef = useRef(cameraKeyframes);
  const isPlayingRef = useRef(isPlaying);
  const physicsParamsRef = useRef(physicsParams);
  const effectivePhysicsRef = useRef(physicsParams);
  const physicsBlendActiveRef = useRef(false);
  const physicsBlendStartRef = useRef<number>(0);
  const physicsBlendDurationRef = useRef<number>(60);
  const physicsBlendFromRef = useRef(physicsParams);
  const physicsBlendToRef = useRef(physicsParams);
  const physicsBlendScratchRef = useRef({ ...DEFAULT_PHYSICS });
  const lastAppliedTimeRef = useRef<number | null>(null);
  const hoveredNodeRef = useRef<GraphNode | null>(null);
  const selectedNodeRef = useRef<GraphNode | null>(null);
  const lockedNodeRef = useRef<GraphNode | null>(null);
  const flyToTargetRef = useRef<THREE.Vector3 | null>(null);
  const gizmoCanvasRef = useRef<HTMLCanvasElement>(null);
  const zoomSliderRef = useRef<HTMLInputElement>(null);
  const zoomAnimRef = useRef<{ from: number; to: number; startTime: number; duration: number } | null>(null);
  const cameraFlyRef = useRef<{
    fromPos: THREE.Vector3; toPos: THREE.Vector3;
    fromTarget: THREE.Vector3; toTarget: THREE.Vector3;
    startTime: number; duration: number;
  } | null>(null);
  const gizmoDragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    hasMoved: boolean;
  }>({ isDragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0, hasMoved: false });
  const gizmoHoverRef = useRef<string | null>(null);
  const gizmoActiveRef = useRef<string | null>(null);
  const [panX, setPanX] = useState(0);
  const lastPanXRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const [cameraLocked, setCameraLocked] = useState(false);
  const setCameraLockedRef = useRef(setCameraLocked);
  const textureRebuildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gradientRebuildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appearanceRebuildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gradientSettingsRef = useRef(gradientSettings);
  const styleSettingsRef = useRef(styleSettings);
  const isDarkRef = useRef(isDark);
  const onReadyRef = useRef(onReady);
  const renderModeRef = useRef(renderMode);
  const nodeAppearanceRef = useRef(nodeAppearance);
  const edgeAppearanceRef = useRef(edgeAppearance);
  const onCameraChangeRef = useRef(onCameraChange);
  const physicsKeyframesRef = useRef(physicsKeyframes ?? {});
  useEffect(() => { onCameraChangeRef.current = onCameraChange; }, [onCameraChange]);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);
  useEffect(() => { renderModeRef.current = renderMode; }, [renderMode]);
  useEffect(() => { nodeAppearanceRef.current = nodeAppearance; }, [nodeAppearance]);
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
    // Pre-sort keyframes once on change instead of per-frame in interpolatePhysicsParam
    const raw = physicsKeyframes ?? {};
    const sorted: Record<string, PhysicsKeyframe[]> = {};
    for (const [trackId, kfs] of Object.entries(raw)) {
      sorted[trackId] = [...kfs].sort((a, b) => a.time - b.time);
    }
    physicsKeyframesRef.current = sorted;
  }, [physicsKeyframes]);
  useEffect(() => { gradientSettingsRef.current = gradientSettings; }, [gradientSettings]);
  useEffect(() => { styleSettingsRef.current = styleSettings; }, [styleSettings]);
  useEffect(() => {
    physicsParamsRef.current = physicsParams;
    physicsBlendFromRef.current = effectivePhysicsRef.current;
    physicsBlendToRef.current = physicsParams;
    physicsBlendStartRef.current = performance.now();
    physicsBlendActiveRef.current = true;
    physicsEnabledRef.current = true;
    stillFramesRef.current = 0;
  }, [physicsParams]);

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
      if (!cameraRef.current || !controlsRef.current) return;
      cameraFlyRef.current = {
        fromPos: cameraRef.current.position.clone(),
        toPos: new THREE.Vector3(1200, 800, 1500),
        fromTarget: controlsRef.current.target.clone(),
        toTarget: new THREE.Vector3(0, 400, 0),
        startTime: performance.now(),
        duration: 600,
      };
    }
  }));

  useEffect(() => {
    cameraKeyframesRef.current = cameraKeyframes;
    lastAppliedTimeRef.current = null;
  }, [cameraKeyframes]);

  const panView = (deltaX: number, deltaY: number) => {
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
  };

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





  const syncGraphVisuals = (nodes: Map<string, GraphNode>, edges: GraphEdge[], nodeArr?: GraphNode[]) => {
    const arr = nodeArr ?? Array.from(nodes.values());
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i];
      if (node.textSprite) node.textSprite.position.set(node.x, node.y, node.z);
    }

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      if (edge.line) {
        const pos = edge.line.geometry.attributes.position;
        pos.setXYZ(0, edge.a.x, edge.a.y, edge.a.z);
        pos.setXYZ(1, edge.b.x, edge.b.y, edge.b.z);
        pos.needsUpdate = true;
      }
    }
  };

  /* ── CANVAS TEXTURE CREATION (fixed dimensions for all states) ── */
  const EDIT_NODE_COLOR = '#6b7280'; // neutral gray for edit mode
  // Fixed outline margin — always allocated so all 3 state textures share identical canvas size
  const OUTLINE_STROKE = 3;
  const OUTLINE_GAP = 2;
  const OUTLINE_MARGIN = OUTLINE_STROKE + OUTLINE_GAP;

  const createCanvasTexture = (
    text: string, color: string, highlighted: boolean, selected: boolean, darkOverride?: boolean
  ): { texture: THREE.CanvasTexture; baseScale: number; aspectRatio: number } => {
    const dark = darkOverride !== undefined ? darkOverride : isDarkRef.current;
    const na = nodeAppearanceRef.current;
    const isEditMode = renderModeRef.current === 'edit';
    const effectiveColor = isEditMode ? EDIT_NODE_COLOR : color;
    const effectiveBorderColor = (!isEditMode && na.borderColor !== 'auto') ? na.borderColor : effectiveColor;
    const effectiveFillColor = (!isEditMode && na.fillColor !== 'auto') ? na.fillColor : (!isEditMode && na.fillColor === 'auto' ? effectiveColor : undefined);
    const effectiveTextColor = (!isEditMode && na.textColor !== 'auto') ? na.textColor : (!isEditMode && na.textColor === 'auto' ? '#ffffff' : effectiveColor);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

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
    const fillColor = effectiveFillColor ?? getNetworkLabelStyle(dark).backgroundHex;
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
      context.strokeStyle = '#2563eb';
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

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const wordCount = words.length;
    const scaleFactor = Math.max(0.4, 1 - (wordCount * 0.05));
    const baseScale = (Math.max(canvasLogicalWidth, canvasLogicalHeight) / 2.5) * scaleFactor;
    const aspectRatio = canvasLogicalHeight / canvasLogicalWidth;

    return { texture, baseScale, aspectRatio };
  };

  /** Create a sprite from a pre-built texture. */
  const createSpriteFromTexture = (
    texture: THREE.CanvasTexture, label: string, baseScale: number, aspectRatio: number, nodeScale: number
  ): THREE.Sprite => {
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.renderOrder = 1; // always draw sprites on top of edge lines
    sprite.userData.label = label;
    sprite.userData.baseScale = baseScale;
    sprite.userData.aspectRatio = aspectRatio;
    sprite.scale.set(baseScale * nodeScale, baseScale * nodeScale * aspectRatio, 1);
    return sprite;
  };

  const hexLerp = (a: string, b: string, t: number): string => {
    const p = (h: string) => {
      const c = h.replace('#', '');
      return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
    };
    const ca = p(a), cb = p(b);
    const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
    const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
    const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`;
  };

  const getColorFromWordCount = (wordCount: number, min: number, max: number, gs: GradientSettings): string => {
    const t = max !== min ? (wordCount - min) / (max - min) : 0.5;
    if (gs.mode === 'solid') return gs.innerColor;
    return hexLerp(gs.innerColor, gs.outerColor, t);
  };

  /** Build (or rebuild) the 3-state texture cache for all nodes. */
  const buildTextureCache = (nodes: Map<string, GraphNode>, minW: number, maxW: number, gs: GradientSettings) => {
    textureCacheRef.current.forEach(entry => {
      entry.normal.dispose();
      entry.highlighted?.dispose();
      entry.selected?.dispose();
    });
    const cache = new Map<string, { normal: THREE.CanvasTexture; highlighted?: THREE.CanvasTexture; selected?: THREE.CanvasTexture; baseScale: number; aspectRatio: number }>();
    nodes.forEach(node => {
      const color = getColorFromWordCount(node.wordCount, minW, maxW, gs);
      const n = createCanvasTexture(node.label, color, false, false);
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
        const color = getColorFromWordCount(node.wordCount, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
        const s = createCanvasTexture(node.label, color, false, true);
        cached.selected = s.texture;
      }
      tex = cached.selected;
    } else if (highlighted) {
      if (!cached.highlighted) {
        const color = getColorFromWordCount(node.wordCount, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
        const h = createCanvasTexture(node.label, color, true, false);
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
          const color = getColorFromWordCount(node.wordCount, minW, maxW, gradientSettingsRef.current);
          const s = createCanvasTexture(node.label, color, false, true);
          cached.selected = s.texture;
        }
        tex = cached.selected;
      } else if (isHovered) {
        if (!cached.highlighted) {
          const color = getColorFromWordCount(node.wordCount, minW, maxW, gradientSettingsRef.current);
          const h = createCanvasTexture(node.label, color, true, false);
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

    cameraRef.current.position.set(camX, camY, camZ);
    controlsRef.current.target.set(tgtX, tgtY, tgtZ);
    cameraRef.current.lookAt(controlsRef.current.target);
  };

  /* ── SETUP & ANIMATION ── */
  useEffect(() => {
    if (!containerRef.current) return;

    let isCancelled = false;
    let localCleanup: (() => void) | null = null;
    let animFrame: number;
    let timerId: ReturnType<typeof setTimeout>;

    // Setup scene
    const scene = new THREE.Scene();
    const bgColors = getNetworkThemeBackground(isDarkRef.current);
    scene.background = new THREE.Color(bgColors.threeColor);
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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(cw || 1000, ch || 800);
    renderer.setPixelRatio(window.devicePixelRatio);
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
        if (!is2D && zoomSliderRef.current) {
          zoomSliderRef.current.value = distToSliderVal(
            camera.position.distanceTo(controls.target)
          ).toString();
        }
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

    worker.onmessage = (e: MessageEvent<{ type: string; posVel: Float64Array; avgMovement?: number }>) => {
      const { posVel } = e.data;
      const arr = graphNodeArrayRef.current;

      if (e.data.type === 'settled') {
        // Write settled positions back and reveal the scene
        for (let i = 0; i < arr.length; i++) {
          const b = i * 6;
          arr[i].x = posVel[b]; arr[i].y = posVel[b + 1]; arr[i].z = posVel[b + 2];
          arr[i].vx = 0; arr[i].vy = 0; arr[i].vz = 0;
        }
        workerPosVelRef.current = posVel;
        syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, arr);
        requestAnimationFrame(() => onReadyRef.current?.());
        return;
      }

      // ── STEP response ──
      const avgMovement = e.data.avgMovement!;

      // Write positions back to node objects
      for (let i = 0; i < arr.length; i++) {
        const b = i * 6;
        arr[i].x = posVel[b];     arr[i].y = posVel[b + 1]; arr[i].z = posVel[b + 2];
        arr[i].vx = posVel[b + 3]; arr[i].vy = posVel[b + 4]; arr[i].vz = posVel[b + 5];
      }

      // Reclaim the transferred buffer for reuse on the next step
      workerPosVelRef.current = posVel;

      // 2D sprite-based overlap separation (must run on main thread — reads sprite scales)
      let maxOverlap = 0;
      if (is2D) {
        const n2 = arr.length;
        for (let pass = 0; pass < 4; pass++) {
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

      syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, arr);

      // Auto-stop heuristic
      const curParams = effectivePhysicsRef.current;
      if (curParams.turbulence > 0 || maxOverlap > 1) {
        stillFramesRef.current = 0;
      } else if (avgMovement < 0.5) {
        stillFramesRef.current++;
        if (stillFramesRef.current > 60) physicsEnabledRef.current = false;
      } else {
        stillFramesRef.current = 0;
      }

      workerBusyRef.current = false;
    };

    // Create edges (adjustable lines)
    const edgeColor = edgeAppearance.color !== 'auto' ? new THREE.Color(edgeAppearance.color) : new THREE.Color(0x9aa0aa);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      opacity: styleSettings.edgeOpacity,
      transparent: true,
      linewidth: styleSettings.edgeWidth
    });

    edges.forEach(edge => {
      const points = [
        new THREE.Vector3(edge.a.x, edge.a.y, edge.a.z),
        new THREE.Vector3(edge.b.x, edge.b.y, edge.b.z)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, edgeMaterial);
      scene.add(line);
      edge.line = line;
    });

    // Build 3-state texture cache for all nodes (normal, highlighted, selected)
    buildTextureCache(nodes, minWords, maxWords, gradientSettings);

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

    // Hover detection via raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleHoverMove = (e: MouseEvent) => {
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
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spritesArrayRef.current);
      const hit = intersects.length > 0 ? graphNodesRef.current.get((intersects[0].object as THREE.Sprite).userData.label) ?? null : null;
      if (hit) setContextMenu({ x: e.clientX, y: e.clientY, node: hit });
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
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);

    // Animation loop
    let frameCount = 0;
    let lastTime = Date.now();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Apply physics every frame (with delta time for stability)
      const now = Date.now();
      const delta = (now - lastTime) / 16.67; // Normalize to ~60fps
      lastTime = now;


      // Re-enable physics during playback if it was auto-stopped but keyframes are still driving values
      if (isPlayingRef.current && !physicsEnabledRef.current) {
        const hasKfs = Object.values(physicsKeyframesRef.current).some(kfs => kfs.length > 0);
        if (hasKfs) { physicsEnabledRef.current = true; stillFramesRef.current = 0; }
      }

      // Dispatch a physics step to the worker when idle — result arrives in worker.onmessage
      if (delta < 5 && physicsEnabledRef.current && !workerBusyRef.current) {
        let paramsForFrame = physicsParamsRef.current;

        if (physicsBlendActiveRef.current) {
          const elapsed = performance.now() - physicsBlendStartRef.current;
          const tRaw = Math.max(0, Math.min(1, elapsed / physicsBlendDurationRef.current));
          const t = applyEasing(tRaw, 'easeInOut');
          const from = physicsBlendFromRef.current;
          const to = physicsBlendToRef.current;

          // Reuse a scratch object to avoid per-frame allocation during blend
          physicsBlendScratchRef.current.repulsion   = from.repulsion   + (to.repulsion   - from.repulsion)   * t;
          physicsBlendScratchRef.current.springK     = from.springK     + (to.springK     - from.springK)     * t;
          physicsBlendScratchRef.current.damping     = from.damping     + (to.damping     - from.damping)     * t;
          physicsBlendScratchRef.current.minSpeed    = from.minSpeed    + (to.minSpeed    - from.minSpeed)    * t;
          physicsBlendScratchRef.current.linkDistance= from.linkDistance+ (to.linkDistance- from.linkDistance)* t;
          physicsBlendScratchRef.current.gravity     = from.gravity     + (to.gravity     - from.gravity)     * t;
          physicsBlendScratchRef.current.turbulence  = from.turbulence  + (to.turbulence  - from.turbulence)  * t;
          paramsForFrame = physicsBlendScratchRef.current;

          if (tRaw >= 1) {
            physicsBlendActiveRef.current = false;
            paramsForFrame = physicsBlendToRef.current;
          }
        }

        // Apply physics keyframe overrides (during playback and when scrubbing)
        {
          const pkfs = physicsKeyframesRef.current;
          const t = playheadRef.current;
          let overridden = false;
          const scratch = physicsBlendScratchRef.current;
          for (const [trackId, param] of Object.entries(PHYS_TRACK_PARAM)) {
            const val = interpolatePhysicsParam(pkfs[trackId] ?? [], t);
            if (val !== null) {
              if (!overridden) {
                scratch.repulsion    = paramsForFrame.repulsion;
                scratch.springK      = paramsForFrame.springK;
                scratch.damping      = paramsForFrame.damping;
                scratch.minSpeed     = paramsForFrame.minSpeed;
                scratch.linkDistance = paramsForFrame.linkDistance;
                scratch.gravity      = paramsForFrame.gravity;
                scratch.turbulence   = paramsForFrame.turbulence;
                overridden = true;
              }
              (scratch as Record<string, number>)[param] = val;
            }
          }
          if (overridden) {
            paramsForFrame = scratch;
            stillFramesRef.current = 0; // keep physics active while keyframes are driving values
          }
        }

        effectivePhysicsRef.current = paramsForFrame;

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
          { type: 'step', posVel: pv, params: paramsForFrame, is2D },
          [pv.buffer]
        );
      }
      frameCount++;

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
          if (zoomSliderRef.current) zoomSliderRef.current.value = distToSliderVal(dist).toString();
          if (t >= 1) zoomAnimRef.current = null;
        }

        // Camera fly-to (gizmo double-click reset)
        if (cameraFlyRef.current) {
          const { fromPos, toPos, fromTarget, toTarget, startTime, duration } = cameraFlyRef.current;
          const t = Math.min(1, (performance.now() - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          camera.position.lerpVectors(fromPos, toPos, eased);
          controls.target.lerpVectors(fromTarget, toTarget, eased);
          if (zoomSliderRef.current) zoomSliderRef.current.value = distToSliderVal(camera.position.distanceTo(controls.target)).toString();
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

      if (!is2D && gizmoCanvasRef.current) {
        drawGizmoCanvas(camera as THREE.PerspectiveCamera, gizmoCanvasRef.current, gizmoHoverRef.current, gizmoActiveRef.current);
      }
    };
    animate();
    // 2D: reveal immediately after the first frame.
    // 3D: onReady is called once the worker settle completes (see onmessage 'settled' handler).
    if (is2D) requestAnimationFrame(() => onReadyRef.current?.());

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
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
    window.addEventListener('resize', handleResize);

    localCleanup = () => {
      renderer.domElement.removeEventListener('mousemove', handleHoverMove);
      renderer.domElement.removeEventListener('mouseleave', handleHoverLeave);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('dblclick', handleDblClick);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.removeEventListener('change', handleCameraChange);
        controlsRef.current.dispose();
      }
      graphNodesRef.current.forEach(node => {
        if (node.textSprite) {
          node.textSprite.material.map?.dispose();
          node.textSprite.material.dispose();
        }
      });
      graphEdgesRef.current.forEach(edge => {
        if (edge.line) edge.line.geometry.dispose();
      });
      if (rendererRef.current && containerRef.current) {
        if (rendererRef.current.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      physicsWorkerRef.current?.terminate();
      physicsWorkerRef.current = null;
      workerBusyRef.current = false;
    };
    // Cleanup
    return () => {
      isCancelled = true;
      if (localCleanup) {
        localCleanup();
      }
    };

  }, [inputText, viewMode, parseMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera settings removed - OrbitControls handles all camera interaction

  // Update node colors when color settings change — debounced so color picker stays smooth
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    if (gradientRebuildTimerRef.current) clearTimeout(gradientRebuildTimerRef.current);
    gradientRebuildTimerRef.current = setTimeout(() => {
      if (!sceneRef.current) return;
      buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
      refreshAllSpriteTextures();
      gradientRebuildTimerRef.current = null;
    }, 80);
  }, [gradientSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild textures when render mode switches (edit vs render colors)
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
    refreshAllSpriteTextures();
  }, [renderMode]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Rebuild textures when node shape or border width changes — debounced for smooth slider
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    if (textureRebuildTimerRef.current) clearTimeout(textureRebuildTimerRef.current);
    textureRebuildTimerRef.current = setTimeout(() => {
      if (!sceneRef.current) return;
      buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
      refreshAllSpriteTextures();
      textureRebuildTimerRef.current = null;
    }, 80);
  }, [styleSettings.nodeShape, styleSettings.nodeBorderWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update edge material when style settings change
  useEffect(() => {
    graphEdgesRef.current.forEach(edge => {
      if (edge.line) {
        (edge.line.material as THREE.LineBasicMaterial).opacity = styleSettings.edgeOpacity;
        (edge.line.material as THREE.LineBasicMaterial).linewidth = styleSettings.edgeWidth;
        (edge.line.material as THREE.LineBasicMaterial).needsUpdate = true;
      }
    });
  }, [styleSettings.edgeOpacity, styleSettings.edgeWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update edge color when edge appearance changes
  useEffect(() => {
    const newColor = edgeAppearance.color !== 'auto' ? new THREE.Color(edgeAppearance.color) : new THREE.Color(0x9aa0aa);
    graphEdgesRef.current.forEach(edge => {
      if (edge.line) {
        (edge.line.material as THREE.LineBasicMaterial).color = newColor;
        (edge.line.material as THREE.LineBasicMaterial).needsUpdate = true;
      }
    });
  }, [edgeAppearance]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild textures when node appearance settings change — debounced for color picker
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    if (appearanceRebuildTimerRef.current) clearTimeout(appearanceRebuildTimerRef.current);
    appearanceRebuildTimerRef.current = setTimeout(() => {
      if (!sceneRef.current) return;
      buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
      refreshAllSpriteTextures();
      appearanceRebuildTimerRef.current = null;
    }, 80);
  }, [nodeAppearance]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update background color and rebuild textures when theme changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const bgColors = getNetworkThemeBackground(isDarkRef.current);
    sceneRef.current.background = new THREE.Color(bgColors.threeColor);

    if (graphNodesRef.current.size === 0) return;
    buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
    refreshAllSpriteTextures();
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleZoomBy = (factor: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const from = cameraRef.current.position.distanceTo(controlsRef.current.target);
    const to = Math.max(MIN_ZOOM_DIST, Math.min(MAX_ZOOM_DIST, from * factor));
    zoomAnimRef.current = { from, to, startTime: performance.now(), duration: 220 };
  };

  const handleZoomSlider = (s: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newDist = sliderValToDist(s);
    const dir = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
    cameraRef.current.position.copy(controlsRef.current.target).addScaledVector(dir, newDist);
    controlsRef.current.update();
  };

  const handlePanSlider = (val: number) => {
    const delta = val - lastPanXRef.current;
    panView(delta * 40, 0);
    lastPanXRef.current = val;
    setPanX(val);
  };

  const handleGizmoDoubleClick = (e: React.MouseEvent) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    // If double clicking a specific axis ball, don't reset the whole camera.
    // The single click will have already triggered the snap animation.
    if (getGizmoAxisAtPoint(e.clientX, e.clientY)) {
      return;
    }

    zoomAnimRef.current = null;
    cameraFlyRef.current = {
      fromPos: cameraRef.current.position.clone(),
      toPos: new THREE.Vector3(1200, 800, 1500),
      fromTarget: controlsRef.current.target.clone(),
      toTarget: new THREE.Vector3(0, 400, 0),
      startTime: performance.now(),
      duration: 600,
    };
  };

  const unlockCamera = () => {
    lockedNodeRef.current = null;
    setCameraLocked(false);
  };

  const getGizmoAxisAtPoint = (clientX: number, clientY: number) => {
    if (!cameraRef.current || !gizmoCanvasRef.current) return null;
    const canvas = gizmoCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    const size = canvas.width;
    const c = size / 2;
    const r = size * 0.42;
    const invQ = cameraRef.current.quaternion.clone().invert();
    
    const axes = [
      { dir: new THREE.Vector3(1, 0, 0), label: 'X' },
      { dir: new THREE.Vector3(0, 1, 0), label: 'Y' },
      { dir: new THREE.Vector3(0, 0, 1), label: 'Z' },
    ];

    let closestHit = null;
    let maxZ = -Infinity;

    axes.forEach(({ dir, label }) => {
      const pos = dir.clone().applyQuaternion(invQ);
      const px = c + pos.x * r;
      const py = c - pos.y * r;
      const dist = Math.sqrt(Math.pow(mx - px, 2) + Math.pow(my - py, 2));
      
      if (dist <= 12 && pos.z > maxZ) {
        maxZ = pos.z;
        closestHit = { dir, label };
      }
    });

    return closestHit;
  };

  const handleGizmoPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    gizmoDragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      hasMoved: false,
    };
    const hit = getGizmoAxisAtPoint(e.clientX, e.clientY);
    gizmoActiveRef.current = hit ? hit.label : 'center';
  };

  const handleGizmoPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = gizmoDragRef.current;
    
    if (!drag.isDragging) {
      const hit = getGizmoAxisAtPoint(e.clientX, e.clientY);
      gizmoHoverRef.current = hit ? hit.label : null;
      return;
    }
    
    if (!cameraRef.current || !controlsRef.current) return;
    
    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    
    if (Math.abs(e.clientX - drag.startX) > 3 || Math.abs(e.clientY - drag.startY) > 3) {
      drag.hasMoved = true;
    }

    if (drag.hasMoved) {
      const cam = cameraRef.current;
      const target = controlsRef.current.target;
      
      const angleX = -dx * 0.01;
      const angleY = -dy * 0.01;

      const offset = cam.position.clone().sub(target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleX);
      
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
      offset.applyAxisAngle(right, angleY);

      cam.position.copy(target).add(offset);
      cam.lookAt(target);
      controlsRef.current.update();
    }
    
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
  };

  const handleGizmoPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = gizmoDragRef.current;
    
    gizmoActiveRef.current = null;
    
    if (!drag.isDragging) return;
    
    drag.isDragging = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (!drag.hasMoved) {
      const hit = getGizmoAxisAtPoint(e.clientX, e.clientY);
      if (hit && cameraRef.current && controlsRef.current) {
        const dist = cameraRef.current.position.distanceTo(controlsRef.current.target);
        const newOffset = hit.dir.clone().multiplyScalar(dist);
        
        cameraFlyRef.current = {
          fromPos: cameraRef.current.position.clone(),
          toPos: controlsRef.current.target.clone().add(newOffset),
          fromTarget: controlsRef.current.target.clone(),
          toTarget: controlsRef.current.target.clone(),
          startTime: performance.now(),
          duration: 400,
        };
      }
    }
  };

  return (
    <>
      <div ref={containerRef} className="w-full h-full relative">
        {/* Orientation gizmo — 3D only — HIDDEN FOR NOW */}
        {false && viewMode !== '2D' && (
          <canvas
            ref={gizmoCanvasRef}
            width={72}
            height={72}
            draggable={false}
            className="absolute left-1/2 -translate-x-1/2 z-10 rounded-full bg-zinc-50 border border-zinc-200 transition-colors hover:border-zinc-300 shadow-sm"
            style={{ bottom: 12, cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none' }}
            onPointerDown={handleGizmoPointerDown}
            onPointerMove={handleGizmoPointerMove}
            onPointerUp={handleGizmoPointerUp}
            onPointerCancel={handleGizmoPointerUp}
            onPointerLeave={() => { gizmoHoverRef.current = null; }}
            onDoubleClick={handleGizmoDoubleClick}
            title="Drag to rotate, click axis to snap, double-click to reset"
          />
        )}

        {/* Live indicator */}
        {isPlaying && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded border bg-destructive/10 dark:bg-destructive/20 border-destructive/20 dark:border-destructive/30 pointer-events-none z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            <span className="text-[10px] text-destructive font-medium tracking-wide">LIVE</span>
          </div>
        )}

        {/* Locked camera indicator */}
        {cameraLocked && (
          <button
            type="button"
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
              unlockCamera();
            }}
            className={`absolute ${isPlaying ? 'top-11' : 'top-3'} left-3 flex items-center gap-1.5 px-2 py-1 rounded-md border bg-background border-border shadow-sm z-10 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50`}
            title="Unlock camera"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" />
            <span className="text-[10px] text-foreground/40 font-medium tracking-wide">LOCKED</span>
          </button>
        )}

        {/* Zoom slider — 3D only — HIDDEN FOR NOW */}
        {false && viewMode !== '2D' && (
          <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 select-none p-1 rounded-full bg-zinc-50 border border-zinc-200 shadow-sm"
               style={{ bottom: 92 }}>
            <button
              onMouseDown={() => handleZoomBy(1.33)}
              className="w-6 h-6 flex items-center justify-center rounded-full text-zinc-500 font-medium text-sm leading-none transition-colors hover:bg-zinc-100 focus-visible:outline-none"
              title="Zoom out"
            >−</button>
            <div style={{ width: 64, height: 20, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                ref={zoomSliderRef}
                type="range"
                min={0}
                max={100}
                step={0.5}
                defaultValue={distToSliderVal(1962)}
                onChange={(e) => handleZoomSlider(parseFloat(e.target.value))}
                className="zoom-slider-horizontal"
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
            <button
              onMouseDown={() => handleZoomBy(0.75)}
              className="w-6 h-6 flex items-center justify-center rounded-full text-zinc-500 font-medium text-sm leading-none transition-colors hover:bg-zinc-100 focus-visible:outline-none"
              title="Zoom in"
            >+</button>
          </div>
        )}

      </div>

      {contextMenu && createPortal(
        <>
          <div className="fixed inset-0 z-40" onMouseDown={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl py-1 overflow-hidden text-popover-foreground"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 210 - 8),
              top: Math.min(contextMenu.y, window.innerHeight - 112 - 8),
              width: 210
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <button
              onMouseDown={e => {
                e.stopPropagation();
                flyToTargetRef.current = new THREE.Vector3(contextMenu.node.x, contextMenu.node.y, contextMenu.node.z);
                setContextMenu(null);
              }}
              className="flex items-center w-full px-3 py-[5px] text-[11px] rounded transition-[color,background-color,box-shadow] text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer text-left"
            >
              <Crosshair className="w-3.5 h-3.5 mr-2 shrink-0 text-muted-foreground" />
              Center
            </button>
            <button
              onMouseDown={e => {
                e.stopPropagation();
                const node = contextMenu.node;
                const nodePos = new THREE.Vector3(node.x, node.y, node.z);
                lockedNodeRef.current = node;
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
                setContextMenu(null);
              }}
              className="flex items-center w-full px-3 py-[5px] text-[11px] rounded transition-[color,background-color,box-shadow] text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer text-left"
            >
              <Lock className="w-3.5 h-3.5 mr-2 shrink-0 text-muted-foreground" />
              Lock camera
            </button>
            <button
              onMouseDown={e => {
                e.stopPropagation();
                const nodePos = new THREE.Vector3(contextMenu.node.x, contextMenu.node.y, contextMenu.node.z);
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
                setContextMenu(null);
              }}
              className="flex items-center w-full px-3 py-[5px] text-[11px] rounded transition-[color,background-color,box-shadow] text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer text-left"
            >
              <Maximize2 className="w-3.5 h-3.5 mr-2 shrink-0 text-muted-foreground" />
              Fill view
            </button>
          </div>
        </>
      , document.body)}
    </>
  );
});

Network3D.displayName = 'Network3D';