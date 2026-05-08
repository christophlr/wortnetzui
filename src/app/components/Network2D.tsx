import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { defaultNetworkColorSettings, getNetworkLabelStyle, getNetworkThemeBackground } from '../networkTheme';

interface Network2DProps {
  inputText?: string;
  parseMode?: 'sentence' | 'word' | 'both';
  colorSettings?: { hueStart: number; hueEnd: number; saturation: number; lightness: number };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number };
  physicsParams?: {
    repulsion: number; springK: number; damping: number;
    minSpeed: number; linkDistance: number; gravity: number; turbulence: number;
  };
  theme?: 'light' | 'dark' | 'system';
}

interface GraphNode {
  label: string;
  wordCount: number;
  sentenceIds: Set<number>;
  x: number; y: number;
  vx: number; vy: number;
  textSprite?: THREE.Sprite;
}

interface GraphEdge {
  a: GraphNode;
  b: GraphNode;
  line?: THREE.Line;
}

const DEFAULT_TEXT = `Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes, far away up the hill. It was 3am that day, cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write, I write like a ritual over and over. The more exist the more I go I fly, they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`;

const DEFAULT_PHYSICS_2D = {
  repulsion: 1500,
  springK: 0.06,
  damping: 0.88,
  minSpeed: 0.5,
  linkDistance: 80,
  gravity: 3,
  turbulence: 0,
};

/* ── GRAPH BUILDING ── */

const normalizeText = (text: string) =>
  text.replace(/[,!?;:()"""]/g, '').replace(/\n+/g, ' ').trim().toUpperCase();

const splitSentences = (text: string) =>
  text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

const buildSubstrings = (words: string[], sentenceId: number, nodes: Map<string, GraphNode>) => {
  const n = words.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const sub = words.slice(i, j).join(' ');
      if (!nodes.has(sub)) {
        nodes.set(sub, { label: sub, wordCount: j - i, sentenceIds: new Set([sentenceId]), x: 0, y: 0, vx: 0, vy: 0 });
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
      if (j - i <= 1) continue;
      const cur = nodes.get(words.slice(i, j).join(' '));
      if (!cur) continue;
      const left = nodes.get(words.slice(i + 1, j).join(' '));
      const right = nodes.get(words.slice(i, j - 1).join(' '));
      if (left && !edges.some(e => (e.a === cur && e.b === left) || (e.a === left && e.b === cur)))
        edges.push({ a: cur, b: left });
      if (right && !edges.some(e => (e.a === cur && e.b === right) || (e.a === right && e.b === cur)))
        edges.push({ a: cur, b: right });
    }
  }
};

const buildCharSubstrings = (word: string, nodes: Map<string, GraphNode>) => {
  const n = word.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const sub = word.slice(i, j);
      if (!nodes.has(sub)) {
        nodes.set(sub, { label: sub, wordCount: j - i, sentenceIds: new Set(), x: 0, y: 0, vx: 0, vy: 0 });
      }
    }
  }
};

const buildCharInclusionEdges = (word: string, nodes: Map<string, GraphNode>, edges: GraphEdge[]) => {
  const n = word.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      if (j - i <= 1) continue;
      const cur = nodes.get(word.slice(i, j));
      if (!cur) continue;
      const left = nodes.get(word.slice(i + 1, j));
      const right = nodes.get(word.slice(i, j - 1));
      if (left && !edges.some(e => (e.a === cur && e.b === left) || (e.a === left && e.b === cur)))
        edges.push({ a: cur, b: left });
      if (right && !edges.some(e => (e.a === cur && e.b === right) || (e.a === right && e.b === cur)))
        edges.push({ a: cur, b: right });
    }
  }
};

const buildNetworkFromText = (text: string, mode: 'sentence' | 'word' | 'both' = 'sentence') => {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const clean = normalizeText(text);
  const sentences = splitSentences(clean);

  if (mode === 'sentence' || mode === 'both') {
    sentences.forEach((s, id) => buildSubstrings(s.split(/\s+/).filter(Boolean), id, nodes));
    sentences.forEach(s => buildInclusionEdges(s.split(/\s+/).filter(Boolean), nodes, edges));
  }

  if (mode === 'word' || mode === 'both') {
    const allWords = new Set<string>();
    sentences.forEach(s => s.split(/\s+/).filter(Boolean).forEach(w => allWords.add(w)));
    allWords.forEach(word => buildCharSubstrings(word, nodes));
    allWords.forEach(word => buildCharInclusionEdges(word, nodes, edges));
  }

  let minW = Infinity, maxW = -Infinity;
  nodes.forEach(n => { minW = Math.min(minW, n.wordCount); maxW = Math.max(maxW, n.wordCount); });
  return { nodes, edges, minWords: minW, maxWords: maxW };
};

/* ── INITIAL SCATTER ── */

const scatterNodes2D = (nodes: Map<string, GraphNode>, width: number, height: number) => {
  const spread = Math.min(width, height) * 0.35;
  for (const node of nodes.values()) {
    node.x = (Math.random() - 0.5) * spread * 2;
    node.y = (Math.random() - 0.5) * spread * 2;
    node.vx = (Math.random() - 0.5) * 2;
    node.vy = (Math.random() - 0.5) * 2;
  }
};

/* ── PHYSICS ── */

const applyPhysics2D = (
  edges: GraphEdge[],
  params: typeof DEFAULT_PHYSICS_2D,
  nodeArr: GraphNode[]
): number => {
  const { repulsion, springK, damping, minSpeed, linkDistance, gravity, turbulence } = params;

  for (const node of nodeArr) {
    node.vx *= damping;
    node.vy *= damping;
    if (gravity > 0) {
      node.vx -= node.x * gravity * 0.001;
      node.vy -= node.y * gravity * 0.001;
    }
    if (turbulence > 0) {
      node.vx += (Math.random() - 0.5) * turbulence * 0.5;
      node.vy += (Math.random() - 0.5) * turbulence * 0.5;
    }
  }

  const n = nodeArr.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = nodeArr[i], b = nodeArr[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const distSq = dx * dx + dy * dy + 1;
      const dist = Math.sqrt(distSq);
      let shared = false;
      for (const id of a.sentenceIds) { if (b.sentenceIds.has(id)) { shared = true; break; } }
      const sentenceMod = shared ? 0.6 : 1.5;
      const diffFactor = 1 + Math.abs(a.wordCount - b.wordCount) * 0.15;
      const force = Math.min((repulsion * sentenceMod * diffFactor) / distSq, 40);
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    }
  }

  for (const edge of edges) {
    const dx = edge.b.x - edge.a.x, dy = edge.b.y - edge.a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
    const f = (dist - linkDistance) * springK;
    const fx = (dx / dist) * f, fy = (dy / dist) * f;
    edge.a.vx += fx; edge.a.vy += fy;
    edge.b.vx -= fx; edge.b.vy -= fy;
  }

  const maxSpeedLimit = 20;
  let total = 0;
  for (const node of nodeArr) {
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > maxSpeedLimit) { node.vx = (node.vx / speed) * maxSpeedLimit; node.vy = (node.vy / speed) * maxSpeedLimit; }
    if (speed > minSpeed) { node.x += node.vx; node.y += node.vy; total += speed; }
  }
  return total / nodeArr.length;
};

const syncVisuals2D = (edges: GraphEdge[], nodeArr: GraphNode[]) => {
  for (const node of nodeArr) {
    if (node.textSprite) node.textSprite.position.set(node.x, node.y, 0);
  }
  for (const edge of edges) {
    if (edge.line) {
      const pos = edge.line.geometry.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, edge.a.x, edge.a.y, 0);
      pos.setXYZ(1, edge.b.x, edge.b.y, 0);
      pos.needsUpdate = true;
    }
  }
};

/* ── COLOR HELPERS ── */

const getColorString = (
  wordCount: number, min: number, max: number,
  s: { hueStart: number; hueEnd: number; saturation: number; lightness: number }
) => {
  const t = max !== min ? (wordCount - min) / (max - min) : 0.5;
  const hue = s.hueStart + (s.hueEnd - s.hueStart) * t;
  return `hsl(${hue}, ${s.saturation}%, ${s.lightness}%)`;
};

const getThreeColor = (
  wordCount: number, min: number, max: number,
  s: { hueStart: number; hueEnd: number; saturation: number; lightness: number }
) => {
  const t = max !== min ? (wordCount - min) / (max - min) : 0.5;
  const hue = (s.hueStart + (s.hueEnd - s.hueStart) * t) / 360;
  return new THREE.Color().setHSL(hue, s.saturation / 100, s.lightness / 100);
};

/* ── TEXT SPRITE ── */

const createTextSprite2D = (text: string, color: string, highlighted = false, nodeScale = 1) => {
  const offscreen = document.createElement('canvas');
  const ctx = offscreen.getContext('2d')!;

  const words = text.split(' ');
  const fontSize = 18;
  const lineHeight = fontSize * 1.2;
  const padding = 10;
  const pixelRatio = 2;

  ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  const maxWidth = Math.max(...words.map(w => ctx.measureText(w).width));
  const logicalWidth = maxWidth + padding * 2;
  const logicalHeight = words.length * lineHeight + padding * 2;

  // Outside stroke lives in transparent canvas margin so it never overlaps the node border
  const outlineStroke = highlighted ? 3 : 0;
  const outlineGap = highlighted ? 2 : 0;
  const outlineMargin = outlineStroke + outlineGap;

  const canvasLogicalWidth = logicalWidth + outlineMargin * 2;
  const canvasLogicalHeight = logicalHeight + outlineMargin * 2;

  offscreen.width = Math.ceil(canvasLogicalWidth * pixelRatio);
  offscreen.height = Math.ceil(canvasLogicalHeight * pixelRatio);
  ctx.scale(pixelRatio, pixelRatio);

  ctx.fillStyle = getNetworkLabelStyle().backgroundHex;
  ctx.fillRect(outlineMargin, outlineMargin, logicalWidth, logicalHeight);

  if (!highlighted) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(outlineMargin + 1, outlineMargin + 1, logicalWidth - 2, logicalHeight - 2);
  } else {
    const pathOff = outlineMargin - outlineGap - outlineStroke / 2;
    const pathW = logicalWidth + 2 * (outlineGap + outlineStroke / 2);
    const pathH = logicalHeight + 2 * (outlineGap + outlineStroke / 2);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = outlineStroke;
    ctx.beginPath();
    ctx.roundRect(pathOff, pathOff, pathW, pathH, 5);
    ctx.stroke();
  }

  ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  words.forEach((word, i) => {
    ctx.fillText(word, outlineMargin + logicalWidth / 2, outlineMargin + padding + lineHeight / 2 + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(offscreen);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);

  const wordCountFactor = Math.max(0.5, 1 - words.length * 0.04);
  const baseScale = canvasLogicalWidth * wordCountFactor;
  const aspectRatio = canvasLogicalHeight / canvasLogicalWidth;
  sprite.scale.set(baseScale * nodeScale, baseScale * nodeScale * aspectRatio, 1);
  sprite.userData.baseScale = baseScale;
  sprite.userData.aspectRatio = aspectRatio;

  return sprite;
};

const disposeSprite = (sprite: THREE.Sprite) => {
  const mat = sprite.material as THREE.SpriteMaterial;
  mat.map?.dispose();
  mat.dispose();
};

/* ── COMPONENT ── */

export function Network2D({
  inputText = DEFAULT_TEXT,
  parseMode = 'sentence',
  colorSettings = defaultNetworkColorSettings,
  styleSettings = { edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1 },
  physicsParams = DEFAULT_PHYSICS_2D,
  theme = 'system',
}: Network2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const graphNodesRef = useRef<Map<string, GraphNode>>(new Map());
  const graphEdgesRef = useRef<GraphEdge[]>([]);
  const graphNodeArrayRef = useRef<GraphNode[]>([]);
  const spritesArrayRef = useRef<THREE.Object3D[]>([]);
  const animFrameRef = useRef<number>();
  const minWordsRef = useRef(Infinity);
  const maxWordsRef = useRef(-Infinity);
  const physicsEnabledRef = useRef(true);
  const stillFramesRef = useRef(0);
  const physicsParamsRef = useRef(physicsParams);
  const colorSettingsRef = useRef(colorSettings);
  const styleSettingsRef = useRef(styleSettings);
  const hoveredNodeRef = useRef<GraphNode | null>(null);

  /* ── MAIN SETUP (re-runs only when inputText changes) ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const bg = getNetworkThemeBackground();
    scene.background = new THREE.Color(bg.threeColor);
    sceneRef.current = scene;

    // Orthographic camera: 1 world unit = 1 CSS pixel at zoom=1
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -10000, 10000);
    camera.position.set(0, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Pan + zoom only — no orbit rotation for 2D
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
    controlsRef.current = controls;

    // Build graph
    const { nodes, edges, minWords, maxWords } = buildNetworkFromText(inputText, parseMode);
    scatterNodes2D(nodes, w, h);
    graphNodesRef.current = nodes;
    graphEdgesRef.current = edges;
    graphNodeArrayRef.current = Array.from(nodes.values());
    minWordsRef.current = minWords;
    maxWordsRef.current = maxWords;
    physicsEnabledRef.current = true;
    stillFramesRef.current = 0;
    hoveredNodeRef.current = null;

    const cs = colorSettingsRef.current;
    const ss = styleSettingsRef.current;

    // Edges with vertex colors
    edges.forEach(edge => {
      const colA = getThreeColor(edge.a.wordCount, minWords, maxWords, cs);
      const colB = getThreeColor(edge.b.wordCount, minWords, maxWords, cs);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([edge.a.x, edge.a.y, 0, edge.b.x, edge.b.y, 0]), 3
      ));
      geometry.setAttribute('color', new THREE.BufferAttribute(
        new Float32Array([colA.r, colA.g, colA.b, colB.r, colB.g, colB.b]), 3
      ));
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        vertexColors: true, opacity: ss.edgeOpacity, transparent: true,
      }));
      scene.add(line);
      edge.line = line;
    });

    // Node sprites
    nodes.forEach(node => {
      const color = getColorString(node.wordCount, minWords, maxWords, cs);
      const sprite = createTextSprite2D(node.label, color, false, ss.nodeScale);
      sprite.userData.label = node.label;
      sprite.position.set(node.x, node.y, 0);
      scene.add(sprite);
      node.textSprite = sprite;
    });
    spritesArrayRef.current = graphNodeArrayRef.current
      .map(n => n.textSprite).filter(Boolean) as THREE.Object3D[];

    // Hover via raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const rebuildSprite = (node: GraphNode, highlighted: boolean) => {
      if (!node.textSprite || !sceneRef.current) return;
      const color = getColorString(node.wordCount, minWordsRef.current, maxWordsRef.current, colorSettingsRef.current);
      const newSprite = createTextSprite2D(node.label, color, highlighted, styleSettingsRef.current.nodeScale);
      newSprite.userData.label = node.label;
      newSprite.position.copy(node.textSprite.position);
      sceneRef.current.remove(node.textSprite);
      disposeSprite(node.textSprite);
      sceneRef.current.add(newSprite);
      node.textSprite = newSprite;
      spritesArrayRef.current = graphNodeArrayRef.current
        .map(n => n.textSprite).filter(Boolean) as THREE.Object3D[];
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(spritesArrayRef.current)[0];
      const hitLabel = hit ? (hit.object as THREE.Sprite).userData.label as string : null;
      const prev = hoveredNodeRef.current;
      const next = hitLabel ? graphNodesRef.current.get(hitLabel) ?? null : null;
      if (prev?.label === next?.label) return;
      if (prev) rebuildSprite(prev, false);
      if (next) rebuildSprite(next, true);
      hoveredNodeRef.current = next;
      renderer.domElement.style.cursor = next ? 'pointer' : 'default';
    };

    const handleMouseLeave = () => {
      if (hoveredNodeRef.current) {
        rebuildSprite(hoveredNodeRef.current, false);
        hoveredNodeRef.current = null;
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (physicsEnabledRef.current) {
        const avgMovement = applyPhysics2D(graphEdgesRef.current, physicsParamsRef.current, graphNodeArrayRef.current);
        syncVisuals2D(graphEdgesRef.current, graphNodeArrayRef.current);
        if (physicsParamsRef.current.turbulence > 0) {
          stillFramesRef.current = 0;
        } else if (avgMovement < 0.5) {
          if (++stillFramesRef.current > 60) physicsEnabledRef.current = false;
        } else {
          stillFramesRef.current = 0;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const nw = container.clientWidth, nh = container.clientHeight;
      camera.left = -nw / 2; camera.right = nw / 2;
      camera.top = nh / 2;   camera.bottom = -nh / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      edges.forEach(e => {
        if (e.line) {
          e.line.geometry.dispose();
          (e.line.material as THREE.Material).dispose();
        }
      });
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [inputText, parseMode]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── COLOR SETTINGS ── */
  useEffect(() => {
    colorSettingsRef.current = colorSettings;
    if (!sceneRef.current || !graphNodesRef.current.size) return;
    const minW = minWordsRef.current, maxW = maxWordsRef.current;

    graphNodesRef.current.forEach(node => {
      if (!node.textSprite) return;
      const color = getColorString(node.wordCount, minW, maxW, colorSettings);
      const isHovered = hoveredNodeRef.current?.label === node.label;
      const newSprite = createTextSprite2D(node.label, color, isHovered, styleSettingsRef.current.nodeScale);
      newSprite.userData.label = node.label;
      newSprite.position.copy(node.textSprite.position);
      sceneRef.current!.remove(node.textSprite);
      disposeSprite(node.textSprite);
      sceneRef.current!.add(newSprite);
      node.textSprite = newSprite;
      if (isHovered) hoveredNodeRef.current = node;
    });
    spritesArrayRef.current = graphNodeArrayRef.current.map(n => n.textSprite).filter(Boolean) as THREE.Object3D[];

    graphEdgesRef.current.forEach(edge => {
      if (!edge.line) return;
      const colA = getThreeColor(edge.a.wordCount, minW, maxW, colorSettings);
      const colB = getThreeColor(edge.b.wordCount, minW, maxW, colorSettings);
      const attr = edge.line.geometry.attributes.color as THREE.BufferAttribute;
      attr.setXYZ(0, colA.r, colA.g, colA.b);
      attr.setXYZ(1, colB.r, colB.g, colB.b);
      attr.needsUpdate = true;
    });
  }, [colorSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── STYLE SETTINGS ── */
  useEffect(() => {
    styleSettingsRef.current = styleSettings;
    graphNodesRef.current.forEach(node => {
      if (!node.textSprite) return;
      const { baseScale, aspectRatio } = node.textSprite.userData;
      const ns = styleSettings.nodeScale;
      node.textSprite.scale.set(baseScale * ns, baseScale * ns * aspectRatio, 1);
    });
    graphEdgesRef.current.forEach(edge => {
      if (!edge.line) return;
      (edge.line.material as THREE.LineBasicMaterial).opacity = styleSettings.edgeOpacity;
      (edge.line.material as THREE.LineBasicMaterial).needsUpdate = true;
    });
  }, [styleSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── PHYSICS PARAMS ── */
  useEffect(() => {
    physicsParamsRef.current = physicsParams;
    physicsEnabledRef.current = true;
    stillFramesRef.current = 0;
  }, [physicsParams]);

  /* ── THEME ── */
  useEffect(() => {
    if (!sceneRef.current) return;
    const bg = getNetworkThemeBackground();
    sceneRef.current.background = new THREE.Color(bg.threeColor);

    if (!graphNodesRef.current.size) return;
    const minW = minWordsRef.current, maxW = maxWordsRef.current;
    graphNodesRef.current.forEach(node => {
      if (!node.textSprite) return;
      const color = getColorString(node.wordCount, minW, maxW, colorSettingsRef.current);
      const isHovered = hoveredNodeRef.current?.label === node.label;
      const newSprite = createTextSprite2D(node.label, color, isHovered, styleSettingsRef.current.nodeScale);
      newSprite.userData.label = node.label;
      newSprite.position.copy(node.textSprite.position);
      sceneRef.current!.remove(node.textSprite);
      disposeSprite(node.textSprite);
      sceneRef.current!.add(newSprite);
      node.textSprite = newSprite;
      if (isHovered) hoveredNodeRef.current = node;
    });
    spritesArrayRef.current = graphNodeArrayRef.current.map(n => n.textSprite).filter(Boolean) as THREE.Object3D[];
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="w-full h-full" />;
}

Network2D.displayName = 'Network2D';
