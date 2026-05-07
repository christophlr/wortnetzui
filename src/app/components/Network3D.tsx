import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import * as THREE from 'three';
import { createPortal } from 'react-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { solveBezierEasing, applyEasing, computeAutoWeights } from '../easing';
import { defaultNetworkColorSettings, getNetworkLabelStyle, getNetworkThemeBackground } from '../networkTheme';

interface Network3DProps {
  isPlaying: boolean;
  playheadPosition: number;
  inputText?: string;
  theme?: 'light' | 'dark' | 'system';
  physicsParams?: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
  };
  colorSettings?: { hueStart: number; hueEnd: number; saturation: number; lightness: number };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number };
  cameraKeyframes?: Array<{ time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; outWeight?: number; inWeight?: number }>;
  onCameraChange?: () => void;
}

interface GraphNode {
  label: string;
  wordCount: number;
  sentenceIds: Set<number>;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  mesh?: THREE.Mesh;
  textSprite?: THREE.Sprite;
}

interface GraphEdge {
  a: GraphNode;
  b: GraphNode;
  line?: THREE.Line;
}


const DEFAULT_TEXT = `Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes, far away up the hill. It was 3am that day, cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write, I write like a ritual over and over. The more exist the more I go I fly, they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`;

const DEFAULT_PHYSICS = {
  repulsion: 1500,
  springK: 0.06,
  damping: 0.88,
  minSpeed: 0.5,
  linkDistance: 80,
  gravity: 0,
  turbulence: 0,
};

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

  ctx.beginPath();
  ctx.arc(c, c, c - 1, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 15, 20, 0.82)';
  ctx.fill();

  const invQ = camera.quaternion.clone().invert();
  const axes = [
    { dir: new THREE.Vector3(1, 0, 0), posColor: '#ef4444', negColor: '#7f1d1d', label: 'x' },
    { dir: new THREE.Vector3(0, 1, 0), posColor: '#22c55e', negColor: '#14532d', label: 'y' },
    { dir: new THREE.Vector3(0, 0, 1), posColor: '#60a5fa', negColor: '#1e3a5f', label: 'z' },
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

export interface Network3DHandle {
  getCameraKeyframe: () => { position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } | null;
}

export const Network3D = forwardRef<Network3DHandle, Network3DProps>(function Network3D({
  isPlaying,
  playheadPosition,
  inputText = DEFAULT_TEXT,
  theme = 'system',
  physicsParams = DEFAULT_PHYSICS,
  colorSettings = defaultNetworkColorSettings,
  styleSettings = { edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1 },
  cameraKeyframes = [],
  onCameraChange,
}: Network3DProps, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const graphNodesRef = useRef<Map<string, GraphNode>>(new Map());
  const graphEdgesRef = useRef<GraphEdge[]>([]);
  const graphNodeArrayRef = useRef<GraphNode[]>([]);
  const sharedPairMatrixRef = useRef<Uint8Array>(new Uint8Array(0));
  const spritesArrayRef = useRef<THREE.Object3D[]>([]);
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
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const colorSettingsRef = useRef(colorSettings);
  const styleSettingsRef = useRef(styleSettings);
  const onCameraChangeRef = useRef(onCameraChange);
  useEffect(() => { onCameraChangeRef.current = onCameraChange; }, [onCameraChange]);
  useEffect(() => { playheadRef.current = playheadPosition; }, [playheadPosition]);
  useEffect(() => { cameraKeyframesRef.current = cameraKeyframes; }, [cameraKeyframes]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { colorSettingsRef.current = colorSettings; }, [colorSettings]);
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
    }
  }));

  useEffect(() => {
    playheadRef.current = playheadPosition;
  }, [playheadPosition]);

  useEffect(() => {
    cameraKeyframesRef.current = cameraKeyframes;
    lastAppliedTimeRef.current = null;
  }, [cameraKeyframes]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  /* ── TEXT PARSING ── */
  const normalizeText = (text: string) => {
    return text
      .replace(/[,!?;:()"""]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .toUpperCase();
  };

  const splitSentences = (text: string) => {
    return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  };

  const buildSubstrings = (words: string[], sentenceId: number, nodes: Map<string, GraphNode>) => {
    const n = words.length;

    // Create all possible substrings
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j <= n; j++) {
        const sub = words.slice(i, j).join(' ');
        if (!nodes.has(sub)) {
          nodes.set(sub, {
            label: sub,
            wordCount: j - i,
            sentenceIds: new Set([sentenceId]),
            x: 0, y: 0, z: 0,
            vx: 0, vy: 0, vz: 0
          });
        } else {
          nodes.get(sub)!.sentenceIds.add(sentenceId);
        }
      }
    }
  };

  const buildInclusionEdges = (words: string[], nodes: Map<string, GraphNode>, edges: GraphEdge[]) => {
    const n = words.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j <= n; j++) {
        if (j - i <= 1) continue; // Need at least 2 words to create sub-edges

        const curLabel = words.slice(i, j).join(' ');
        const cur = nodes.get(curLabel);
        if (!cur) continue;

        // Left substring: remove first word
        const leftLabel = words.slice(i + 1, j).join(' ');
        const left = nodes.get(leftLabel);

        // Right substring: remove last word
        const rightLabel = words.slice(i, j - 1).join(' ');
        const right = nodes.get(rightLabel);

        // Add edges if not already present
        if (left && !edges.some(e =>
          (e.a === cur && e.b === left) || (e.a === left && e.b === cur)
        )) {
          edges.push({ a: cur, b: left });
        }

        if (right && !edges.some(e =>
          (e.a === cur && e.b === right) || (e.a === right && e.b === cur)
        )) {
          edges.push({ a: cur, b: right });
        }
      }
    }
  };

  const buildNetworkFromText = (text: string) => {
    const nodes = new Map<string, GraphNode>();
    const edges: GraphEdge[] = [];

    const clean = normalizeText(text);
    const sentences = splitSentences(clean);

    // Build nodes
    sentences.forEach((sentence, sentenceId) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      buildSubstrings(words, sentenceId, nodes);
    });

    // Build inclusion edges
    sentences.forEach((sentence) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      buildInclusionEdges(words, nodes, edges);
    });

    // Find min/max word counts
    let minW = Infinity;
    let maxW = -Infinity;
    nodes.forEach(node => {
      minW = Math.min(minW, node.wordCount);
      maxW = Math.max(maxW, node.wordCount);
    });

    return { nodes, edges, minWords: minW, maxWords: maxW };
  };

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

  /* ── PHYSICS CACHE ── */
  const rebuildPhysicsCache = (nodes: Map<string, GraphNode>) => {
    const arr = Array.from(nodes.values());
    graphNodeArrayRef.current = arr;
    const n = arr.length;
    const matrix = new Uint8Array(n * n);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        for (const id of arr[i].sentenceIds) {
          if (arr[j].sentenceIds.has(id)) {
            matrix[i * n + j] = 1;
            matrix[j * n + i] = 1;
            break;
          }
        }
      }
    }
    sharedPairMatrixRef.current = matrix;
  };

  /* ── PHYSICS ENGINE ── */
  const applyPhysics = (
    nodes: Map<string, GraphNode>,
    edges: GraphEdge[],
    params: typeof DEFAULT_PHYSICS,
    nodeArr?: GraphNode[],
    sharedMatrix?: Uint8Array
  ): number => {
    const nodeArray = nodeArr ?? Array.from(nodes.values());
    const { repulsion, springK, damping, minSpeed, linkDistance, gravity, turbulence } = params;

    // Reset forces
    nodeArray.forEach(node => {
      node.vx *= damping;
      node.vy *= damping;
      node.vz *= damping;

      // Gravity toward origin
      if (gravity > 0) {
        node.vx -= node.x * gravity * 0.001;
        node.vy -= node.y * gravity * 0.001;
        node.vz -= node.z * gravity * 0.001;
      }

      // Turbulence: random impulse each frame
      if (turbulence > 0) {
        node.vx += (Math.random() - 0.5) * turbulence * 0.5;
        node.vy += (Math.random() - 0.5) * turbulence * 0.5;
        node.vz += (Math.random() - 0.5) * turbulence * 0.5;
      }
    });

    // Repulsion (O(n²))
    const n = nodeArray.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = nodeArray[i];
        const b = nodeArray[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const distSq = dx * dx + dy * dy + dz * dz + 1;
        const dist = Math.sqrt(distSq);

        // Use precomputed matrix when available, else fall back to set iteration
        let sharedSentence: boolean;
        if (sharedMatrix) {
          sharedSentence = sharedMatrix[i * n + j] === 1;
        } else {
          sharedSentence = false;
          for (const id of a.sentenceIds) {
            if (b.sentenceIds.has(id)) { sharedSentence = true; break; }
          }
        }

        // Modulation: 0.6 if shared, 1.5 otherwise (less extreme)
        const sentenceMod = sharedSentence ? 0.6 : 1.5;

        // Difference factor based on word count difference (reduced impact)
        const diff = Math.abs(a.wordCount - b.wordCount);
        const differenceFactor = 1 + diff * 0.15;

        // Calculate force
        let force = (repulsion * sentenceMod * differenceFactor) / distSq;
        force = Math.min(force, 40); // Cap max force

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        a.vx += fx;
        a.vy += fy;
        a.vz += fz;
        b.vx -= fx;
        b.vy -= fy;
        b.vz -= fz;
      }
    }

    // Spring attraction along edges with rest-length
    edges.forEach(edge => {
      const dx = edge.b.x - edge.a.x;
      const dy = edge.b.y - edge.a.y;
      const dz = edge.b.z - edge.a.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;

      // Displacement from rest length
      const displacement = dist - linkDistance;
      const forceMag = displacement * springK;

      const fx = (dx / dist) * forceMag;
      const fy = (dy / dist) * forceMag;
      const fz = (dz / dist) * forceMag;

      edge.a.vx += fx;
      edge.a.vy += fy;
      edge.a.vz += fz;
      edge.b.vx -= fx;
      edge.b.vy -= fy;
      edge.b.vz -= fz;
    });

    // Apply velocity with speed limit and track total movement
    const maxSpeed = 20;
    let totalMovement = 0;

    nodeArray.forEach(node => {
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy + node.vz * node.vz);

      if (speed > maxSpeed) {
        node.vx = (node.vx / speed) * maxSpeed;
        node.vy = (node.vy / speed) * maxSpeed;
        node.vz = (node.vz / speed) * maxSpeed;
      }

      // Apply minimum speed threshold
      if (speed > minSpeed) {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;
        totalMovement += speed;
      }
    });

    return totalMovement / nodeArray.length; // Average movement
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

  /* ── CREATE TEXT SPRITE WITH BILLBOARDING ── */
  const createTextSprite = (text: string, color: string, highlighted = false, selected = false) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    const words = text.split(' ');
    const fontSize = 28;
    const lineHeight = fontSize * 1.2;
    const padding = 14;

    // High-resolution canvas for crisp text
    const pixelRatio = 3; // 3x resolution for sharp rendering

    context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;

    const maxWidth = Math.max(...words.map(w => context.measureText(w).width));
    const logicalWidth = maxWidth + padding * 2;
    const logicalHeight = words.length * lineHeight + padding * 2;

    // Set actual canvas size to high-res
    canvas.width = logicalWidth * pixelRatio;
    canvas.height = logicalHeight * pixelRatio;

    // Scale context to match
    context.scale(pixelRatio, pixelRatio);

    // Background box with colored border
    const bgColors = getThemeBackgroundColors();
    context.fillStyle = getNetworkLabelStyle().backgroundHex;
    context.fillRect(0, 0, logicalWidth, logicalHeight);

    // Border logic: selected wins, otherwise highlighted draws white border
    if (selected) {
      context.strokeStyle = 'rgba(80, 180, 255, 0.95)';
      context.lineWidth = 4;
      context.strokeRect(1, 1, logicalWidth - 2, logicalHeight - 2);
    } else if (highlighted) {
      context.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      context.lineWidth = 6; // Thicker on hover for visibility
      context.strokeRect(1, 1, logicalWidth - 2, logicalHeight - 2);
    } else {
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.strokeRect(1, 1, logicalWidth - 2, logicalHeight - 2);
    }

    // Text with optional stroke for readability when highlighted
    context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    context.fillStyle = color; // Keep original color for legibility
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    if (highlighted) {
      // Add stroke to text for contrast against white border
      context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      context.lineWidth = 1.5;
      words.forEach((word, i) => {
        const y = padding + lineHeight / 2 + i * lineHeight;
        context.strokeText(word, logicalWidth / 2, y);
      });
    }

    words.forEach((word, i) => {
      const y = padding + lineHeight / 2 + i * lineHeight;
      context.fillText(word, logicalWidth / 2, y);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);

    // Scale based on word count
    const wordCount = text.split(' ').length;
    const scaleFactor = Math.max(0.4, 1 - (wordCount * 0.05)); // Longer texts get smaller
    const baseScale = (Math.max(logicalWidth, logicalHeight) / 2.5) * scaleFactor;
    const aspectRatio = logicalHeight / logicalWidth;
    sprite.scale.set(baseScale, baseScale * aspectRatio, 1);
    sprite.userData.baseScale = baseScale;
    sprite.userData.aspectRatio = aspectRatio;

    return sprite;
  };

  const getColorFromWordCount = (
    wordCount: number,
    min: number,
    max: number,
    settings: { hueStart: number; hueEnd: number; saturation: number; lightness: number }
  ) => {
    const t = max !== min ? (wordCount - min) / (max - min) : 0.5;
    const hue = settings.hueStart + (settings.hueEnd - settings.hueStart) * t;
    return `hsl(${hue}, ${settings.saturation}%, ${settings.lightness}%)`;
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
    const bgColors = getThemeBackgroundColors();
    scene.background = new THREE.Color(bgColors.threeColor);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      15000
    );
    camera.position.set(1200, 800, 1500);
    camera.lookAt(0, 400, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10; // Allow very close zoom
    controls.maxDistance = 50000; // Allow very far zoom
    controls.target.set(0, 400, 0);
    controls.update();
    controlsRef.current = controls;
    let applyingKeyframe = false;
    const handleCameraChange = () => {
      if (!applyingKeyframe) {
        onCameraChangeRef.current?.();
        if (zoomSliderRef.current) {
          zoomSliderRef.current.value = distToSliderVal(
            camera.position.distanceTo(controls.target)
          ).toString();
        }
      }
    };
    controls.addEventListener('change', handleCameraChange);

    // Build network
    const { nodes, edges, minWords, maxWords } = buildNetworkFromText(inputText);
    arrangeNodesCone3D(nodes, minWords, maxWords);

    // Pre-simulate to settled positions so nodes appear static on first render
    let stillCount = 0;
    for (let i = 0; i < 500; i++) {
      const movement = applyPhysics(nodes, edges, DEFAULT_PHYSICS);
      if (movement < 0.5) { if (++stillCount >= 10) break; }
      else stillCount = 0;
    }
    nodes.forEach(n => { n.vx = 0; n.vy = 0; n.vz = 0; });
    physicsEnabledRef.current = false;
    stillFramesRef.current = 9999;

    graphNodesRef.current = nodes;
    graphEdgesRef.current = edges;
    minWordsRef.current = minWords;
    maxWordsRef.current = maxWords;
    rebuildPhysicsCache(nodes);

    // Create edges (adjustable lines)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x9aa0aa,
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

    // Create nodes with billboarded text
    nodes.forEach(node => {
      const color = getColorFromWordCount(node.wordCount, minWords, maxWords, colorSettings);
      const sprite = createTextSprite(node.label, color, false, false);
      sprite.userData.label = node.label;
      sprite.position.set(node.x, node.y, node.z);
      // Apply user scale proportionally
      const baseScale = sprite.userData.baseScale || 1;
      const aspectRatio = sprite.userData.aspectRatio || 1;
      sprite.scale.set(
        baseScale * styleSettings.nodeScale,
        baseScale * styleSettings.nodeScale * aspectRatio,
        1
      );
      scene.add(sprite);
      node.textSprite = sprite;
    });

    // Cache sprite list for raycasting — rebuilt here and on hover highlight change
    spritesArrayRef.current = graphNodeArrayRef.current
      .map(n => n.textSprite)
      .filter(Boolean) as THREE.Object3D[];

    // Hover detection via raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const rebuildSprite = (node: GraphNode, highlighted: boolean, selected: boolean) => {
      if (!node.textSprite || !sceneRef.current) return;
      const cs = colorSettingsRef.current;
      const ss = styleSettingsRef.current;
      const color = getColorFromWordCount(node.wordCount, minWordsRef.current, maxWordsRef.current, cs);
      const newSprite = createTextSprite(node.label, color, highlighted, selected);
      newSprite.userData.label = node.label;
      newSprite.position.copy(node.textSprite.position);
      const baseScale = newSprite.userData.baseScale || 1;
      const aspectRatio = newSprite.userData.aspectRatio || 1;
      newSprite.scale.set(baseScale * ss.nodeScale, baseScale * ss.nodeScale * aspectRatio, 1);
      sceneRef.current.remove(node.textSprite);
      node.textSprite.material.dispose();
      sceneRef.current.add(newSprite);
      node.textSprite = newSprite;
      // Keep raycasting cache fresh
      spritesArrayRef.current = graphNodeArrayRef.current
        .map(n => n.textSprite)
        .filter(Boolean) as THREE.Object3D[];
    };

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
      if (prevNode) rebuildSprite(prevNode, false, prevNode.label === selectedNodeRef.current?.label);
      if (nextNode) rebuildSprite(nextNode, true, nextNode.label === selectedNodeRef.current?.label);
      hoveredNodeRef.current = nextNode;
      renderer.domElement.style.cursor = nextNode ? 'pointer' : 'default';
    };

    const handleHoverLeave = () => {
      if (hoveredNodeRef.current) {
        const was = hoveredNodeRef.current;
        rebuildSprite(was, false, was.label === selectedNodeRef.current?.label);
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
        if (prev) rebuildSprite(prev, prev.label === hoveredNodeRef.current?.label, false);
        selectedNodeRef.current = null;
        return;
      }

      if (prev && prev.label !== hit.label) rebuildSprite(prev, prev.label === hoveredNodeRef.current?.label, false);

      const selecting = hit.label !== prev?.label;
      selectedNodeRef.current = selecting ? hit : null;
      rebuildSprite(hit, hit.label === hoveredNodeRef.current?.label, selecting);
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


      if (delta < 5 && physicsEnabledRef.current) { // Skip if tab was hidden
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

        effectivePhysicsRef.current = paramsForFrame;
        const avgMovement = applyPhysics(
          graphNodesRef.current, graphEdgesRef.current, paramsForFrame,
          graphNodeArrayRef.current, sharedPairMatrixRef.current
        );
        syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, graphNodeArrayRef.current);

        // Auto-stop physics when system has stabilized (disabled when turbulence is active)
        if (paramsForFrame.turbulence > 0) {
          stillFramesRef.current = 0;
        } else if (avgMovement < 0.5) {
          stillFramesRef.current++;
          if (stillFramesRef.current > 60) { // ~1 second of stillness
            physicsEnabledRef.current = false;
          }
        } else {
          stillFramesRef.current = 0;
        }
      }
      frameCount++;

      // Apply camera animation from keyframes
      const time = playheadRef.current;
      const keyframes = cameraKeyframesRef.current;
      const shouldApply = isPlayingRef.current || time !== lastAppliedTimeRef.current;
      if (shouldApply) {
        applyingKeyframe = true;
        applyCameraKeyframes(keyframes, time);
        lastAppliedTimeRef.current = time;
      }

      // Smooth fly-to target (if requested)
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

      if (gizmoCanvasRef.current) {
        drawGizmoCanvas(camera, gizmoCanvasRef.current);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
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
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [inputText]); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera settings removed - OrbitControls handles all camera interaction

  // Update node colors when color settings change
  useEffect(() => {
    if (!sceneRef.current || graphNodesRef.current.size === 0) return;

    const nodes = graphNodesRef.current;
    const minW = minWordsRef.current;
    const maxW = maxWordsRef.current;

    nodes.forEach(node => {
      if (node.textSprite) {
        const color = getColorFromWordCount(node.wordCount, minW, maxW, colorSettings);
        const isHovered = hoveredNodeRef.current?.label === node.label;
        const isSelected = selectedNodeRef.current?.label === node.label;
        const newSprite = createTextSprite(node.label, color, isHovered, isSelected);
        newSprite.userData.label = node.label;
        newSprite.position.copy(node.textSprite.position);
        const baseScale = newSprite.userData.baseScale || 1;
        const aspectRatio = newSprite.userData.aspectRatio || 1;
        newSprite.scale.set(
          baseScale * styleSettings.nodeScale,
          baseScale * styleSettings.nodeScale * aspectRatio,
          1
        );
        sceneRef.current!.remove(node.textSprite);
        sceneRef.current!.add(newSprite);
        node.textSprite = newSprite;
        if (isHovered) hoveredNodeRef.current = node;
      }
    });
  }, [colorSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update node scale when style settings change
  useEffect(() => {
    if (!graphNodesRef.current.size) return;

    graphNodesRef.current.forEach(node => {
      if (node.textSprite) {
        const baseScale = node.textSprite.userData.baseScale || 1;
        const aspectRatio = node.textSprite.userData.aspectRatio || 1;
        node.textSprite.scale.set(
          baseScale * styleSettings.nodeScale,
          baseScale * styleSettings.nodeScale * aspectRatio,
          1
        );
      }
    });
  }, [styleSettings.nodeScale]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Update background color and node label sprites when theme changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const bgColors = getThemeBackgroundColors();
    sceneRef.current.background = new THREE.Color(bgColors.threeColor);

    const nodes = graphNodesRef.current;
    if (nodes.size === 0) return;
    const minW = minWordsRef.current;
    const maxW = maxWordsRef.current;
    nodes.forEach(node => {
      if (node.textSprite) {
        const color = getColorFromWordCount(node.wordCount, minW, maxW, colorSettings);
        const isHovered = hoveredNodeRef.current?.label === node.label;
        const isSelected = selectedNodeRef.current?.label === node.label;
        const newSprite = createTextSprite(node.label, color, isHovered, isSelected);
        newSprite.userData.label = node.label;
        newSprite.position.copy(node.textSprite.position);
        const baseScale = newSprite.userData.baseScale || 1;
        const aspectRatio = newSprite.userData.aspectRatio || 1;
        newSprite.scale.set(
          baseScale * styleSettings.nodeScale,
          baseScale * styleSettings.nodeScale * aspectRatio,
          1
        );
        sceneRef.current!.remove(node.textSprite);
        sceneRef.current!.add(newSprite);
        node.textSprite = newSprite;
        if (isHovered) hoveredNodeRef.current = node;
      }
    });
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleZoomBy = (factor: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const current = cameraRef.current.position.distanceTo(controlsRef.current.target);
    const newDist = Math.max(MIN_ZOOM_DIST, Math.min(MAX_ZOOM_DIST, current * factor));
    const dir = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
    cameraRef.current.position.copy(controlsRef.current.target).addScaledVector(dir, newDist);
    controlsRef.current.update();
    if (zoomSliderRef.current) zoomSliderRef.current.value = distToSliderVal(newDist).toString();
  };

  const handleZoomSlider = (s: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newDist = sliderValToDist(s);
    const dir = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
    cameraRef.current.position.copy(controlsRef.current.target).addScaledVector(dir, newDist);
    controlsRef.current.update();
  };

  return (
    <>
      <div ref={containerRef} className="w-full h-full relative">
        {/* Orientation gizmo */}
        <canvas
          ref={gizmoCanvasRef}
          width={90}
          height={90}
          className="absolute top-3 right-3 z-10 pointer-events-none"
          style={{ borderRadius: '50%' }}
        />

        {/* Zoom slider */}
        <div className="absolute right-3 z-10 flex flex-col items-center gap-1.5 select-none"
             style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <button
            onMouseDown={() => handleZoomBy(0.75)}
            className="w-6 h-6 rounded flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/60 hover:text-white text-base leading-none"
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
            className="w-6 h-6 rounded flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/60 hover:text-white text-base leading-none"
            title="Zoom out"
          >−</button>
        </div>
      </div>
      {contextMenu && createPortal(
        <>
          <div className="fixed inset-0 z-40" onMouseDown={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl py-1 overflow-hidden"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 196 - 8),
              top: Math.min(contextMenu.y, window.innerHeight - 48 - 8),
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
              Center in camera
            </button>
          </div>
        </>
      , document.body)}
    </>
  );
});

Network3D.displayName = 'Network3D';