import { useCallback, useEffect, useRef } from 'react';
import { defaultNetworkColorSettings, getNetworkLabelStyle, getNetworkThemeBackground } from '../networkTheme';

interface Network2DProps {
  isPlaying?: boolean;
  playheadPosition?: number;
  inputText?: string;
  colorSettings?: { hueStart: number; hueEnd: number; saturation: number; lightness: number };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number };
  physicsParams?: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
  };
}

interface GraphNode {
  label: string;
  wordCount: number;
  sentenceIds: Set<number>;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GraphEdge {
  a: GraphNode;
  b: GraphNode;
}

const DEFAULT_TEXT = `Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes, far away up the hill. It was 3am that day, cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write, I write like a ritual over and over. The more exist the more I go I fly, they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`;

const DEFAULT_PHYSICS_2D = {
  repulsion: 3000,
  springK: 0.03,
  damping: 0.88,
  minSpeed: 0.5,
  linkDistance: 150,
  gravity: 0.002,
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

const buildNetworkFromText = (text: string) => {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const clean = normalizeText(text);
  const sentences = splitSentences(clean);

  sentences.forEach((sentence, id) => {
    const words = sentence.split(/\s+/).filter(Boolean);
    buildSubstrings(words, id, nodes);
  });
  sentences.forEach(sentence => {
    buildInclusionEdges(sentence.split(/\s+/).filter(Boolean), nodes, edges);
  });

  let minW = Infinity, maxW = -Infinity;
  nodes.forEach(n => { minW = Math.min(minW, n.wordCount); maxW = Math.max(maxW, n.wordCount); });

  return { nodes, edges, minWords: minW, maxWords: maxW };
};

/* ── INITIAL SCATTER ── */

const scatterNodes = (nodes: Map<string, GraphNode>, width: number, height: number) => {
  for (const node of nodes.values()) {
    node.x = width * 0.15 + Math.random() * width * 0.7;
    node.y = height * 0.15 + Math.random() * height * 0.7;
    node.vx = 0;
    node.vy = 0;
  }
};

/* ── FORCE-DIRECTED PHYSICS STEP ── */

const stepPhysics2D = (
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  width: number,
  height: number,
  params: typeof DEFAULT_PHYSICS_2D
): number => {
  const arr = Array.from(nodes.values());
  const cx = width / 2;
  const cy = height / 2;

  // Repulsion between all pairs (Coulomb)
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i], b = arr[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const f = Math.min(params.repulsion / (dist * dist), 80);
      const fx = (dx / dist) * f;
      const fy = (dy / dist) * f;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    }
  }

  // Spring attraction along edges (Hooke)
  for (const edge of edges) {
    const dx = edge.b.x - edge.a.x;
    const dy = edge.b.y - edge.a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
    const f = params.springK * (dist - params.linkDistance);
    const fx = (dx / dist) * f;
    const fy = (dy / dist) * f;
    edge.a.vx += fx; edge.a.vy += fy;
    edge.b.vx -= fx; edge.b.vy -= fy;
  }

  // Gravity + turbulence + damping + integrate
  let maxSpeed = 0;
  for (const node of arr) {
    node.vx += (cx - node.x) * params.gravity;
    node.vy += (cy - node.y) * params.gravity;
    if (params.turbulence > 0) {
      node.vx += (Math.random() - 0.5) * params.turbulence;
      node.vy += (Math.random() - 0.5) * params.turbulence;
    }
    node.vx *= params.damping;
    node.vy *= params.damping;
    node.x += node.vx;
    node.y += node.vy;
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > maxSpeed) maxSpeed = speed;
  }

  return maxSpeed;
};

/* ── COLOR + BACKGROUND ── */

const getColorFromWordCount = (
  wordCount: number, min: number, max: number,
  settings: { hueStart: number; hueEnd: number; saturation: number; lightness: number }
) => {
  const t = max !== min ? (wordCount - min) / (max - min) : 0.5;
  const hue = settings.hueStart + (settings.hueEnd - settings.hueStart) * t;
  return `hsl(${hue}, ${settings.saturation}%, ${settings.lightness}%)`;
};

const getBackgroundColor = () => getNetworkThemeBackground().hex;

/* ── CANVAS RENDERING ── */

const renderCanvas = (
  canvas: HTMLCanvasElement,
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  minWords: number,
  maxWords: number,
  colorSettings: { hueStart: number; hueEnd: number; saturation: number; lightness: number },
  styleSettings: { edgeOpacity: number; edgeWidth: number; nodeScale: number },
  hoveredNodeLabel: string | null,
  transform: { x: number; y: number; scale: number }
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getBackgroundColor();
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.scale, transform.scale);

  // Edges
  ctx.globalAlpha = styleSettings.edgeOpacity;
  for (const edge of edges) {
    ctx.strokeStyle = getColorFromWordCount(edge.a.wordCount, minWords, maxWords, colorSettings);
    ctx.lineWidth = Math.max(0.5, styleSettings.edgeWidth * 0.4);
    ctx.beginPath();
    ctx.moveTo(edge.a.x, edge.a.y);
    ctx.lineTo(edge.b.x, edge.b.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Nodes
  const fontSize = 11;
  const lineHeight = fontSize * 1.2;
  const padding = 6;

  for (const node of nodes.values()) {
    const color = getColorFromWordCount(node.wordCount, minWords, maxWords, colorSettings);
    const words = node.label.split(' ');

    ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    const maxW = Math.max(...words.map(w => ctx.measureText(w).width));
    const boxW = maxW + padding * 2;
    const boxH = words.length * lineHeight + padding * 2;
    const wordCountScale = Math.max(0.6, 1 - node.wordCount * 0.04);
    const scale = styleSettings.nodeScale * wordCountScale;
    const sw = boxW * scale;
    const sh = boxH * scale;

    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = getNetworkLabelStyle().backgroundHex;
    ctx.fillRect(node.x - sw / 2, node.y - sh / 2, sw, sh);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(node.x - sw / 2, node.y - sh / 2, sw, sh);

    if (node.label === hoveredNodeLabel) {
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 2;
      ctx.strokeRect(node.x - sw / 2 - 3, node.y - sh / 2 - 3, sw + 6, sh + 6);
    }

    ctx.fillStyle = color;
    ctx.font = `600 ${fontSize * scale}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    words.forEach((word, i) => {
      ctx.fillText(word, node.x, node.y - sh / 2 + padding * scale + (i + 0.5) * lineHeight * scale);
    });
  }

  ctx.restore();
};

/* ── COMPONENT ── */

export function Network2D({
  inputText = DEFAULT_TEXT,
  colorSettings = defaultNetworkColorSettings,
  styleSettings = { edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1 },
  physicsParams = DEFAULT_PHYSICS_2D,
}: Network2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Map<string, GraphNode>>(new Map());
  const edgesRef = useRef<GraphEdge[]>([]);
  const minWordsRef = useRef(Infinity);
  const maxWordsRef = useRef(-Infinity);
  const hoveredNodeLabelRef = useRef<string | null>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragTransformStartRef = useRef({ x: 0, y: 0 });
  const colorSettingsRef = useRef(colorSettings);
  const styleSettingsRef = useRef(styleSettings);
  const physicsParamsRef = useRef(physicsParams);
  const physicsActiveRef = useRef(false);
  const stillFramesRef = useRef(0);
  const animFrameRef = useRef<number>();

  const render = useCallback(() => {
    if (!canvasRef.current) return;
    renderCanvas(
      canvasRef.current,
      nodesRef.current,
      edgesRef.current,
      minWordsRef.current,
      maxWordsRef.current,
      colorSettingsRef.current,
      styleSettingsRef.current,
      hoveredNodeLabelRef.current,
      transformRef.current
    );
  }, []);

  // Physics + render loop — stops automatically when nodes settle
  const startPhysicsLoop = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    physicsActiveRef.current = true;
    stillFramesRef.current = 0;

    const loop = () => {
      const container = containerRef.current;
      if (container && physicsActiveRef.current) {
        const maxSpeed = stepPhysics2D(
          nodesRef.current, edgesRef.current,
          container.clientWidth, container.clientHeight,
          physicsParamsRef.current
        );
        if (maxSpeed < physicsParamsRef.current.minSpeed) {
          if (++stillFramesRef.current > 60) {
            physicsActiveRef.current = false;
            render();
            return; // loop stops
          }
        } else {
          stillFramesRef.current = 0;
        }
      }
      render();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, [render]);

  // Build graph when text changes
  useEffect(() => {
    const { nodes, edges, minWords, maxWords } = buildNetworkFromText(inputText);
    nodesRef.current = nodes;
    edgesRef.current = edges;
    minWordsRef.current = minWords;
    maxWordsRef.current = maxWords;

    const container = containerRef.current;
    if (container) scatterNodes(nodes, container.clientWidth, container.clientHeight);

    startPhysicsLoop();
  }, [inputText, startPhysicsLoop]);

  // Restart physics when physics params change
  useEffect(() => {
    physicsParamsRef.current = physicsParams;
    startPhysicsLoop();
  }, [physicsParams, startPhysicsLoop]);

  // Re-render only when color/style changes (no physics restart)
  useEffect(() => { colorSettingsRef.current = colorSettings; render(); }, [colorSettings, render]);
  useEffect(() => { styleSettingsRef.current = styleSettings; render(); }, [styleSettings, render]);

  // Event handlers (mount only — reads all live state from refs)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const getNodeAtPoint = (mouseX: number, mouseY: number): string | null => {
      const ctx = canvas.getContext('2d')!;
      ctx.font = `600 11px "Space Grotesk", sans-serif`;
      const t = transformRef.current;
      const wx = (mouseX - t.x) / t.scale;
      const wy = (mouseY - t.y) / t.scale;
      const padding = 6, fontSize = 11, lineHeight = fontSize * 1.2;

      for (const node of nodesRef.current.values()) {
        const words = node.label.split(' ');
        const maxW = Math.max(...words.map(w => ctx.measureText(w).width));
        const scale = styleSettingsRef.current.nodeScale * Math.max(0.6, 1 - node.wordCount * 0.04);
        const sw = (maxW + padding * 2) * scale;
        const sh = (words.length * lineHeight + padding * 2) * scale;
        if (wx >= node.x - sw / 2 && wx <= node.x + sw / 2 &&
            wy >= node.y - sh / 2 && wy <= node.y + sh / 2) return node.label;
      }
      return null;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const t = transformRef.current;
      const newScale = Math.max(0.05, Math.min(20, t.scale * factor));
      transformRef.current = {
        x: mx - (mx - t.x) * (newScale / t.scale),
        y: my - (my - t.y) * (newScale / t.scale),
        scale: newScale,
      };
      render();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      dragTransformStartRef.current = { x: transformRef.current.x, y: transformRef.current.y };
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        transformRef.current = {
          ...transformRef.current,
          x: dragTransformStartRef.current.x + (e.clientX - dragStartRef.current.x),
          y: dragTransformStartRef.current.y + (e.clientY - dragStartRef.current.y),
        };
        render();
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const newHovered = getNodeAtPoint(e.clientX - rect.left, e.clientY - rect.top);
      if (newHovered !== hoveredNodeLabelRef.current) {
        hoveredNodeLabelRef.current = newHovered;
        canvas.style.cursor = newHovered ? 'pointer' : 'default';
        render();
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        canvas.style.cursor = 'default';
      }
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      hoveredNodeLabelRef.current = null;
      canvas.style.cursor = 'default';
      render();
    };

    const handleResize = () => {
      scatterNodes(nodesRef.current, container.clientWidth, container.clientHeight);
      startPhysicsLoop();
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseup', handleMouseUp);

    let resizeTimeout: number;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(handleResize, 150);
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [render, startPhysicsLoop]);

  // Cancel loop on unmount
  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-zinc-950 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

Network2D.displayName = 'Network2D';
