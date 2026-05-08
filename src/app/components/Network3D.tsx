import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import * as THREE from 'three';
import { createPortal } from 'react-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { solveBezierEasing, applyEasing, computeAutoWeights } from '../easing';
import { defaultGradientSettings, getNetworkLabelStyle, getNetworkThemeBackground, type GradientSettings, type NodeShape } from '../networkTheme';
import { type GraphNode, type GraphEdge, type PhysicsParams, DEFAULT_PHYSICS, buildNetworkFromText } from '../graph';
import { rebuildPhysicsCache } from '../graph';

type PhysicsKeyframe = { time: number; value: number; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };

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
  cameraKeyframes?: Array<{ time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; outWeight?: number; inWeight?: number }>;
  onCameraChange?: () => void;
  isDark?: boolean;
  onReady?: () => void;
  renderMode?: 'edit' | 'render';
  nodeAppearance?: { borderColor: 'auto' | string; fillColor: 'auto' | string; textColor: 'auto' | string };
  edgeAppearance?: { color: 'auto' | string };
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
function drawGizmoCanvas(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = canvas.width;
  const c = size / 2;
  const r = size * 0.36;

  ctx.clearRect(0, 0, size, size);

  const invQ = camera.quaternion.clone().invert();
  const axes = [
    { dir: new THREE.Vector3(1, 0, 0), posColor: '#ef4444', negColor: 'rgba(239,68,68,0.38)', label: 'x' },
    { dir: new THREE.Vector3(0, 1, 0), posColor: '#22c55e', negColor: 'rgba(34,197,94,0.38)', label: 'y' },
    { dir: new THREE.Vector3(0, 0, 1), posColor: '#60a5fa', negColor: 'rgba(96,165,250,0.38)', label: 'z' },
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
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    if (label) {
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.font = 'bold 10px system-ui,sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    }
  });
}

const PHYS_TRACK_PARAM: Record<string, keyof PhysicsParams> = {
  'phys-rep': 'repulsion',
  'phys-spk': 'springK',
  'phys-dmp': 'damping',
};

/** Interpolate a physics param from pre-sorted keyframes (sorted once on change, not per frame). */
function interpolatePhysicsParam(sorted: PhysicsKeyframe[], time: number): number | null {
  if (sorted.length === 0) return null;
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i], b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const segDur = b.time - a.time;
      const tRaw = (time - a.time) / segDur;
      const isAuto = a.interpolation === 'auto' || b.interpolation === 'auto';
      let outW: number, inW: number;
      if (isAuto) {
        const prevDur = i > 0 ? a.time - sorted[i - 1].time : null;
        const nextDur = i + 2 < sorted.length ? sorted[i + 2].time - b.time : null;
        ({ outWeight: outW, inWeight: inW } = computeAutoWeights(segDur, prevDur, nextDur));
      } else {
        outW = a.outWeight ?? 0;
        inW = b.inWeight ?? 0;
      }
      const easedT = solveBezierEasing(tRaw, outW, inW);
      return a.value + (b.value - a.value) * easedT;
    }
  }
  return null;
}

export interface Network3DHandle {
  getCameraKeyframe: () => { position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } | null;
  getEffectivePhysicsParams: () => PhysicsParams;
}

export const Network3D = forwardRef<Network3DHandle, Network3DProps>(function Network3D({
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
  nodeAppearance = { borderColor: 'auto', fillColor: 'auto', textColor: 'auto' },
  edgeAppearance = { color: 'auto' },
}: Network3DProps, ref) {
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
  const textureCacheRef = useRef<Map<string, { normal: THREE.CanvasTexture; highlighted: THREE.CanvasTexture; selected: THREE.CanvasTexture; baseScale: number; aspectRatio: number }>>(new Map());
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
  const flyToTargetRef = useRef<THREE.Vector3 | null>(null);
  const gizmoCanvasRef = useRef<HTMLCanvasElement>(null);
  const zoomSliderRef = useRef<HTMLInputElement>(null);
  const zoomAnimRef = useRef<{ from: number; to: number; startTime: number; duration: number } | null>(null);
  const cameraFlyRef = useRef<{
    fromPos: THREE.Vector3; toPos: THREE.Vector3;
    fromTarget: THREE.Vector3; toTarget: THREE.Vector3;
    startTime: number; duration: number;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
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
    getEffectivePhysicsParams: () => ({ ...effectivePhysicsRef.current })
  }));

  useEffect(() => {
    cameraKeyframesRef.current = cameraKeyframes;
    lastAppliedTimeRef.current = null;
  }, [cameraKeyframes]);

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
    const effectiveFillColor = (!isEditMode && na.fillColor !== 'auto') ? na.fillColor : undefined;
    const effectiveTextColor = (!isEditMode && na.textColor !== 'auto') ? na.textColor : effectiveColor;
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
        if (nodeShape === 'ellipse') {
          context.ellipse(cx, cy, logicalWidth / 2 - bw / 2, logicalHeight / 2 - bw / 2, 0, 0, Math.PI * 2);
        } else if (nodeShape === 'rounded-rectangle') {
          context.roundRect(OUTLINE_MARGIN + bw / 2, OUTLINE_MARGIN + bw / 2, logicalWidth - bw, logicalHeight - bw, 6);
        } else {
          context.rect(OUTLINE_MARGIN + bw / 2, OUTLINE_MARGIN + bw / 2, logicalWidth - bw, logicalHeight - bw);
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
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
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
      entry.highlighted.dispose();
      entry.selected.dispose();
    });
    const cache = new Map<string, { normal: THREE.CanvasTexture; highlighted: THREE.CanvasTexture; selected: THREE.CanvasTexture; baseScale: number; aspectRatio: number }>();
    nodes.forEach(node => {
      const color = getColorFromWordCount(node.wordCount, minW, maxW, gs);
      const n = createCanvasTexture(node.label, color, false, false);
      const h = createCanvasTexture(node.label, color, true, false);
      const s = createCanvasTexture(node.label, color, false, true);
      cache.set(node.label, {
        normal: n.texture, highlighted: h.texture, selected: s.texture,
        baseScale: n.baseScale, aspectRatio: n.aspectRatio,
      });
    });
    textureCacheRef.current = cache;
  };

  /** Swap a sprite's texture to the correct cached state (no canvas rebuild). */
  const swapSpriteTexture = (node: GraphNode, highlighted: boolean, selected: boolean) => {
    if (!node.textSprite) return;
    const cached = textureCacheRef.current.get(node.label);
    if (!cached) return;
    const tex = selected ? cached.selected : highlighted ? cached.highlighted : cached.normal;
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
      const tex = isSelected ? cached.selected : isHovered ? cached.highlighted : cached.normal;
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
    keyframes: Array<{ time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' }>,
    time: number
  ) => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (keyframes.length === 0) return;

    const sorted = [...keyframes].sort((a, b) => a.time - b.time);

    let prev = sorted[0];
    let next = sorted[sorted.length - 1];
    let prevIdx = 0;

    if (sorted.length === 1 || time <= sorted[0].time) {
      prev = next = sorted[0];
    } else if (time >= sorted[sorted.length - 1].time) {
      prev = next = sorted[sorted.length - 1];
      prevIdx = sorted.length - 1;
    } else {
      for (let i = 0; i < sorted.length - 1; i++) {
        if (time >= sorted[i].time && time <= sorted[i + 1].time) {
          prev = sorted[i]; next = sorted[i + 1]; prevIdx = i;
          break;
        }
      }
    }

    const segDuration = next.time - prev.time;
    const rawT = segDuration > 0 ? Math.max(0, Math.min(1, (time - prev.time) / segDuration)) : 0;

    const isAuto = prev.interpolation === 'auto' || next.interpolation === 'auto';
    let outW = prev.outWeight ?? 0;
    let inW  = next.inWeight  ?? 0;
    if (isAuto) {
      const prevPrevDur = prevIdx > 0 ? prev.time - sorted[prevIdx - 1].time : null;
      const nextNextDur = prevIdx + 2 < sorted.length ? sorted[prevIdx + 2].time - next.time : null;
      const auto = computeAutoWeights(segDuration, prevPrevDur, nextNextDur);
      outW = auto.outWeight; inW = auto.inWeight;
    }
    const smoothT = solveBezierEasing(rawT, outW, inW);

    const camX = prev.position.x + (next.position.x - prev.position.x) * smoothT;
    const camY = prev.position.y + (next.position.y - prev.position.y) * smoothT;
    const camZ = prev.position.z + (next.position.z - prev.position.z) * smoothT;
    const tgtX = prev.target.x + (next.target.x - prev.target.x) * smoothT;
    const tgtY = prev.target.y + (next.target.y - prev.target.y) * smoothT;
    const tgtZ = prev.target.z + (next.target.z - prev.target.z) * smoothT;

    cameraRef.current.position.set(camX, camY, camZ);
    controlsRef.current.target.set(tgtX, tgtY, tgtZ);
    cameraRef.current.lookAt(controlsRef.current.target);
  };

  /* ── SETUP & ANIMATION ── */
  useEffect(() => {
    if (!containerRef.current) return;

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
    renderer.setSize(cw, ch);
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

    renderer.domElement.addEventListener('click', handleClick);
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

      // Update controls (for damping) — fires 'change' synchronously if camera moved
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      applyingKeyframe = false;

      renderer.render(scene, camera);

      if (!is2D && gizmoCanvasRef.current) {
        drawGizmoCanvas(camera as THREE.PerspectiveCamera, gizmoCanvasRef.current);
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

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousemove', handleHoverMove);
      renderer.domElement.removeEventListener('mouseleave', handleHoverLeave);
      renderer.domElement.removeEventListener('click', handleClick);
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
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      physicsWorkerRef.current?.terminate();
      physicsWorkerRef.current = null;
      workerBusyRef.current = false;
    };
  }, [inputText, viewMode, parseMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera settings removed - OrbitControls handles all camera interaction

  // Update node colors when color settings change — rebuild texture cache, then swap textures
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettings);
    refreshAllSpriteTextures();
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

  // Rebuild textures when node shape or border width changes
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
    refreshAllSpriteTextures();
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

  // Rebuild textures when node appearance settings change
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;
    buildTextureCache(graphNodesRef.current, minWordsRef.current, maxWordsRef.current, gradientSettingsRef.current);
    refreshAllSpriteTextures();
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

  const handleGizmoDoubleClick = () => {
    if (!cameraRef.current || !controlsRef.current) return;
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

  return (
    <>
      <div ref={containerRef} className="w-full h-full relative">
        {/* Orientation gizmo — 3D only */}
        {viewMode !== '2D' && (
          <canvas
            ref={gizmoCanvasRef}
            width={90}
            height={90}
            className="absolute top-3 right-3 z-10"
            style={{ borderRadius: '50%', border: '1px solid rgba(120,120,140,0.25)', cursor: 'pointer' }}
            onDoubleClick={handleGizmoDoubleClick}
            title="Double-click to reset view"
          />
        )}

        {/* Zoom slider — 3D only */}
        {viewMode !== '2D' && (
          <div className="absolute right-3 z-10 flex flex-col items-center gap-1.5 select-none"
               style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <button
              onMouseDown={() => handleZoomBy(0.75)}
              className="w-6 h-6 rounded flex items-center justify-center bg-muted/70 hover:bg-muted border border-border text-muted-foreground hover:text-foreground text-sm leading-none transition-colors"
              title="Zoom in"
            >+</button>
            <div style={{ height: 88, width: 20, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                ref={zoomSliderRef}
                type="range"
                min={0}
                max={100}
                step={0.5}
                defaultValue={distToSliderVal(1962)}
                onChange={(e) => handleZoomSlider(parseFloat(e.target.value))}
                className="zoom-slider"
                style={{ position: 'absolute', width: 88, transform: 'rotate(-90deg)', cursor: 'pointer' }}
              />
            </div>
            <button
              onMouseDown={() => handleZoomBy(1.33)}
              className="w-6 h-6 rounded flex items-center justify-center bg-muted/70 hover:bg-muted border border-border text-muted-foreground hover:text-foreground text-sm leading-none transition-colors"
              title="Zoom out"
            >−</button>
          </div>
        )}
      </div>
      {contextMenu && createPortal(
        <>
          <div className="fixed inset-0 z-40" onMouseDown={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl py-1 overflow-hidden"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 196 - 8),
              top: Math.min(contextMenu.y, window.innerHeight - 96 - 8),
              width: 196
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <button
              onMouseDown={e => {
                e.stopPropagation();
                flyToTargetRef.current = new THREE.Vector3(contextMenu.node.x, contextMenu.node.y, contextMenu.node.z);
                setContextMenu(null);
              }}
              className="w-full px-3 py-[5px] text-[11px] rounded transition-colors text-foreground hover:bg-muted cursor-pointer text-left"
            >
              Center
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
              className="w-full px-3 py-[5px] text-[11px] rounded transition-colors text-foreground hover:bg-muted cursor-pointer text-left"
            >
              Fill view
            </button>
          </div>
        </>
      , document.body)}
    </>
  );
});

Network3D.displayName = 'Network3D';