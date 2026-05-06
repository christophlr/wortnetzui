import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { applyEasing } from '../easing';
import type { EasingType } from '../easing';

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
  };
  colorSettings?: { hueStart: number; hueEnd: number; saturation: number; lightness: number };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number };
  cameraSnapshots?: Array<{ time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; easing?: EasingType }>;
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
  minSpeed: 0.5
};

/* ── THEME-AWARE BACKGROUND COLORS ── */
const getThemeBackgroundColors = (): { hex: string; threeColor: number } => {
  const isDark = document.documentElement.classList.contains('dark');
  return isDark
    ? { hex: '#0a0b0d', threeColor: 0x0d0e10 }
    : { hex: '#ffffff', threeColor: 0xffffff };
};

export interface Network3DHandle {
  getCameraSnapshot: () => { position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } | null;
}

export const Network3D = forwardRef<Network3DHandle, Network3DProps>(function Network3D({
  isPlaying,
  playheadPosition,
  inputText = DEFAULT_TEXT,
  theme = 'system',
  physicsParams = DEFAULT_PHYSICS,
  colorSettings = { hueStart: 180, hueEnd: 120, saturation: 75, lightness: 65 },
  styleSettings = { edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1 },
  cameraSnapshots = [],
  onCameraChange,
}: Network3DProps, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const graphNodesRef = useRef<Map<string, GraphNode>>(new Map());
  const graphEdgesRef = useRef<GraphEdge[]>([]);
  const animationFrameRef = useRef<number>();
  const minWordsRef = useRef(Infinity);
  const maxWordsRef = useRef(-Infinity);
  const physicsEnabledRef = useRef(true);
  const stillFramesRef = useRef(0);
  const playheadRef = useRef(playheadPosition);
  const cameraSnapshotsRef = useRef(cameraSnapshots);
  const isPlayingRef = useRef(isPlaying);
  const physicsParamsRef = useRef(physicsParams);
  const lastAppliedTimeRef = useRef<number | null>(null);
  const onCameraChangeRef = useRef(onCameraChange);
  const transitionActiveRef = useRef(false);
  const transitionStartRef = useRef<number>(0);
  const transitionDurationRef = useRef<number>(600);
  const transitionOriginalRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());
  const transitionTargetRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());
  useEffect(() => { onCameraChangeRef.current = onCameraChange; }, [onCameraChange]);
  useEffect(() => { playheadRef.current = playheadPosition; }, [playheadPosition]);
  useEffect(() => { cameraSnapshotsRef.current = cameraSnapshots; }, [cameraSnapshots]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { physicsParamsRef.current = physicsParams; }, [physicsParams]);

  useImperativeHandle(ref, () => ({
    getCameraSnapshot: () => {
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
    cameraSnapshotsRef.current = cameraSnapshots;
    lastAppliedTimeRef.current = null;
  }, [cameraSnapshots]);

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

  /* ── PHYSICS ENGINE ── */
  const applyPhysics = (
    nodes: Map<string, GraphNode>,
    edges: GraphEdge[],
    params: typeof DEFAULT_PHYSICS
  ): number => {
    const nodeArray = Array.from(nodes.values());
    const { repulsion, springK, damping, minSpeed } = params;

    // Reset forces
    nodeArray.forEach(node => {
      node.vx *= damping;
      node.vy *= damping;
      node.vz *= damping;
    });

    // Repulsion (O(n²))
    for (let i = 0; i < nodeArray.length; i++) {
      for (let j = i + 1; j < nodeArray.length; j++) {
        const a = nodeArray[i];
        const b = nodeArray[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const distSq = dx * dx + dy * dy + dz * dz + 1;
        const dist = Math.sqrt(distSq);

        // Check if nodes share sentence
        let sharedSentence = false;
        a.sentenceIds.forEach(id => {
          if (b.sentenceIds.has(id)) sharedSentence = true;
        });

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

    // Spring attraction along edges
    edges.forEach(edge => {
      const dx = edge.b.x - edge.a.x;
      const dy = edge.b.y - edge.a.y;
      const dz = edge.b.z - edge.a.z;

      const fx = dx * springK;
      const fy = dy * springK;
      const fz = dz * springK;

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

      // Update mesh positions
      if (node.textSprite) {
        node.textSprite.position.set(node.x, node.y, node.z);
      }
    });

    // Update edge positions
    edges.forEach(edge => {
      if (edge.line) {
        const positions = edge.line.geometry.attributes.position;
        positions.setXYZ(0, edge.a.x, edge.a.y, edge.a.z);
        positions.setXYZ(1, edge.b.x, edge.b.y, edge.b.z);
        positions.needsUpdate = true;
      }
    });

    return totalMovement / nodeArray.length; // Average movement
  };

  /* ── CREATE TEXT SPRITE WITH BILLBOARDING ── */
  const createTextSprite = (text: string, color: string) => {
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
    context.fillStyle = bgColors.hex;
    context.fillRect(0, 0, logicalWidth, logicalHeight);

    context.strokeStyle = color;
    context.lineWidth = 2;
    context.strokeRect(1, 1, logicalWidth - 2, logicalHeight - 2);

    // Text
    context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

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

  const applyCameraSnapshots = (
    snapshots: Array<{ time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } }>,
    time: number
  ) => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (snapshots.length === 0) return;

    const sorted = [...snapshots].sort((a, b) => a.time - b.time);
    let prev = sorted[0];
    let next = sorted[sorted.length - 1];

    if (sorted.length === 1 || time <= sorted[0].time) {
      prev = sorted[0];
      next = sorted[0];
    } else if (time >= sorted[sorted.length - 1].time) {
      prev = sorted[sorted.length - 1];
      next = sorted[sorted.length - 1];
    } else {
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].time <= time && sorted[i + 1].time >= time) {
          prev = sorted[i];
          next = sorted[i + 1];
          break;
        }
      }
    }

    const duration = next.time - prev.time;
    const elapsed = time - prev.time;
    const t = duration > 0 ? Math.max(0, Math.min(1, elapsed / duration)) : 0;
    const smoothT = applyEasing(t, prev.easing ?? 'easeInOut');

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
    let applyingSnapshot = false;
    const handleCameraChange = () => { if (!applyingSnapshot) onCameraChangeRef.current?.(); };
    controls.addEventListener('change', handleCameraChange);

    // Build network
    const { nodes, edges, minWords, maxWords } = buildNetworkFromText(inputText);
    arrangeNodesCone3D(nodes, minWords, maxWords);

    graphNodesRef.current = nodes;
    graphEdgesRef.current = edges;
    minWordsRef.current = minWords;
    maxWordsRef.current = maxWords;

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
      const sprite = createTextSprite(node.label, color);
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

    // Animation loop
    let frameCount = 0;
    let lastTime = Date.now();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Apply physics every frame (with delta time for stability)
      const now = Date.now();
      const delta = (now - lastTime) / 16.67; // Normalize to ~60fps
      lastTime = now;

      if (transitionActiveRef.current) {
        // Interpolate from original -> target over configured duration
        const elapsed = now - transitionStartRef.current;
        const tRaw = Math.max(0, Math.min(1, elapsed / transitionDurationRef.current));
        const t = applyEasing(tRaw, 'easeInOut');

        graphNodesRef.current.forEach((node, key) => {
          const orig = transitionOriginalRef.current.get(key);
          const targ = transitionTargetRef.current.get(key);
          if (!orig || !targ) return;
          node.x = orig.x + (targ.x - orig.x) * t;
          node.y = orig.y + (targ.y - orig.y) * t;
          node.z = orig.z + (targ.z - orig.z) * t;
          if (node.textSprite) node.textSprite.position.set(node.x, node.y, node.z);
        });

        if (tRaw >= 1) {
          transitionActiveRef.current = false;
          physicsEnabledRef.current = true;
          stillFramesRef.current = 0;
        }
      } else if (delta < 5 && physicsEnabledRef.current) { // Skip if tab was hidden
        const avgMovement = applyPhysics(graphNodesRef.current, graphEdgesRef.current, physicsParamsRef.current);

        // Auto-stop physics when system has stabilized
        if (avgMovement < 0.5) {
          stillFramesRef.current++;
          if (stillFramesRef.current > 60) { // ~1 second of stillness
            physicsEnabledRef.current = false;
            console.log('Physics stabilized and paused');
          }
        } else {
          stillFramesRef.current = 0;
        }
      }
      frameCount++;

      // Apply camera animation from snapshots
      const time = playheadRef.current;
      const snapshots = cameraSnapshotsRef.current;
      const shouldApply = isPlayingRef.current || time !== lastAppliedTimeRef.current;
      if (shouldApply) {
        applyingSnapshot = true;
        applyCameraSnapshots(snapshots, time);
        lastAppliedTimeRef.current = time;
      }

      // Update controls (for damping) — fires 'change' synchronously if camera moved
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      applyingSnapshot = false;

      renderer.render(scene, camera);
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

  // Re-enable physics when parameters change
  useEffect(() => {
    physicsEnabledRef.current = true;
    stillFramesRef.current = 0;
  }, [physicsParams]);

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
        // Re-create sprite with new color
        const newSprite = createTextSprite(node.label, color);
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

  // Update background color when theme changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const bgColors = getThemeBackgroundColors();
    sceneRef.current.background = new THREE.Color(bgColors.threeColor);
  }, [theme]);

  return <div ref={containerRef} className="w-full h-full" />;
});

Network3D.displayName = 'Network3D';