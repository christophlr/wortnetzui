import { useEffect, useRef } from 'react';
import { defaultNetworkColorSettings, getNetworkLabelStyle, getNetworkThemeBackground } from '../networkTheme';

interface Network2DProps {
  isPlaying?: boolean;
  playheadPosition?: number;
  inputText?: string;
  colorSettings?: { hueStart: number; hueEnd: number; saturation: number; lightness: number };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number };
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

/* ── SHARED GRAPH-BUILDING FUNCTIONS ── */

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

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const sub = words.slice(i, j).join(' ');
      if (!nodes.has(sub)) {
        nodes.set(sub, {
          label: sub,
          wordCount: j - i,
          sentenceIds: new Set([sentenceId]),
          x: 0, y: 0,
          vx: 0, vy: 0
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
      if (j - i <= 1) continue;

      const curLabel = words.slice(i, j).join(' ');
      const cur = nodes.get(curLabel);
      if (!cur) continue;

      const leftLabel = words.slice(i + 1, j).join(' ');
      const left = nodes.get(leftLabel);

      const rightLabel = words.slice(i, j - 1).join(' ');
      const right = nodes.get(rightLabel);

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

  sentences.forEach((sentence, sentenceId) => {
    const words = sentence.split(/\s+/).filter(Boolean);
    buildSubstrings(words, sentenceId, nodes);
  });

  sentences.forEach((sentence) => {
    const words = sentence.split(/\s+/).filter(Boolean);
    buildInclusionEdges(words, nodes, edges);
  });

  let minW = Infinity;
  let maxW = -Infinity;
  nodes.forEach(node => {
    minW = Math.min(minW, node.wordCount);
    maxW = Math.max(maxW, node.wordCount);
  });

  return { nodes, edges, minWords: minW, maxWords: maxW };
};

/* ── 2D LAYOUT ── */

const arrangeNodes2D = (
  nodes: Map<string, GraphNode>,
  minWords: number,
  maxWords: number,
  width: number,
  height: number
) => {
  const nodeArray = Array.from(nodes.values());
  const padding = 60;
  const maxRadius = Math.min(width, height) / 2 - padding;

  nodeArray.forEach((node, index) => {
    const t = maxWords !== minWords
      ? (node.wordCount - minWords) / (maxWords - minWords)
      : 0.5;

    const radius = maxRadius * Math.pow(t, 0.5) * (0.4 + Math.random() * 0.6);
    const angle = (index / nodeArray.length) * Math.PI * 2 + Math.random() * 0.3;

    node.x = width / 2 + radius * Math.cos(angle);
    node.y = height / 2 + radius * Math.sin(angle);
    node.vx = 0;
    node.vy = 0;
  });
};

/* ── LIGHT PHYSICS FOR OVERLAP AVOIDANCE ── */

const applyLightPhysics = (
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  iterations: number = 3
) => {
  const nodeArray = Array.from(nodes.values());
  const minDistance = 80;
  const repelForce = 0.5;

  for (let iter = 0; iter < iterations; iter++) {
    // Reset velocities
    nodeArray.forEach(node => {
      node.vx *= 0.8;
      node.vy *= 0.8;
    });

    // Repulsion
    for (let i = 0; i < nodeArray.length; i++) {
      for (let j = i + 1; j < nodeArray.length; j++) {
        const a = nodeArray[i];
        const b = nodeArray[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy + 1;
        const dist = Math.sqrt(distSq);

        if (dist < minDistance) {
          const force = repelForce * (minDistance - dist) / dist;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }
    }

    // Apply velocities
    nodeArray.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
    });
  }
};

/* ── COLOR HELPER ── */

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

/* ── CANVAS RENDERING ── */

// Helper to get the background color from CSS variables
const getBackgroundColor = (): string => {
  return getNetworkThemeBackground().hex;
};

const renderCanvas = (
  canvas: HTMLCanvasElement,
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  minWords: number,
  maxWords: number,
  colorSettings: { hueStart: number; hueEnd: number; saturation: number; lightness: number },
  styleSettings: { edgeOpacity: number; edgeWidth: number; nodeScale: number }
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // Background - now responsive to light/dark mode
  ctx.fillStyle = getBackgroundColor();
  ctx.fillRect(0, 0, width, height);

  // Draw edges first (behind nodes)
  ctx.globalAlpha = styleSettings.edgeOpacity;
  edges.forEach(edge => {
    const color = getColorFromWordCount(edge.a.wordCount, minWords, maxWords, colorSettings);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.5, styleSettings.edgeWidth * 0.4);
    ctx.beginPath();
    ctx.moveTo(edge.a.x, edge.a.y);
    ctx.lineTo(edge.b.x, edge.b.y);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Draw nodes
  const nodeArray = Array.from(nodes.values());
  nodeArray.forEach(node => {
    const color = getColorFromWordCount(node.wordCount, minWords, maxWords, colorSettings);
    const fontSize = 11;
    const lineHeight = fontSize * 1.2;
    const words = node.label.split(' ');
    const padding = 6;

    // Measure text
    ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    const maxWidth = Math.max(...words.map(w => ctx.measureText(w).width));
    const boxWidth = maxWidth + padding * 2;
    const boxHeight = words.length * lineHeight + padding * 2;

    // Scale by node scale setting and word count
    const wordCountScale = Math.max(0.6, 1 - (node.wordCount * 0.04));
    const scale = styleSettings.nodeScale * wordCountScale;
    const scaledWidth = boxWidth * scale;
    const scaledHeight = boxHeight * scale;

    // Draw black box
    ctx.fillStyle = getNetworkLabelStyle().backgroundHex;
    ctx.fillRect(
      node.x - scaledWidth / 2,
      node.y - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    // Draw colored border
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      node.x - scaledWidth / 2,
      node.y - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    // Draw text
    ctx.fillStyle = color;
    ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    words.forEach((word, i) => {
      const textX = node.x;
      const textY = node.y - scaledHeight / 2 + padding + (i + 0.5) * lineHeight * scale;
      ctx.fillText(word, textX, textY);
    });
  });
};

/* ── MAIN COMPONENT ── */

export function Network2D({
  inputText = DEFAULT_TEXT,
  colorSettings = defaultNetworkColorSettings,
  styleSettings = { edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1 },
}: Network2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Map<string, GraphNode>>(new Map());
  const edgesRef = useRef<GraphEdge[]>([]);
  const minWordsRef = useRef(Infinity);
  const maxWordsRef = useRef(-Infinity);
  const animationFrameRef = useRef<number>();

  // Build graph on input text change
  useEffect(() => {
    const { nodes, edges, minWords, maxWords } = buildNetworkFromText(inputText);
    nodesRef.current = nodes;
    edgesRef.current = edges;
    minWordsRef.current = minWords;
    maxWordsRef.current = maxWords;

    if (containerRef.current && canvasRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      arrangeNodes2D(nodes, minWords, maxWords, width, height);
      applyLightPhysics(nodes, edges, 5);
      renderCanvas(canvasRef.current, nodes, edges, minWords, maxWords, colorSettings, styleSettings);
    }
  }, [inputText]);

  // Render on color/style changes
  useEffect(() => {
    if (canvasRef.current) {
      renderCanvas(
        canvasRef.current,
        nodesRef.current,
        edgesRef.current,
        minWordsRef.current,
        maxWordsRef.current,
        colorSettings,
        styleSettings
      );
    }
  }, [colorSettings, styleSettings]);

  // Setup animation loop and resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      arrangeNodes2D(nodesRef.current, minWordsRef.current, maxWordsRef.current, width, height);
      applyLightPhysics(nodesRef.current, edgesRef.current, 5);
      renderCanvas(
        canvas,
        nodesRef.current,
        edgesRef.current,
        minWordsRef.current,
        maxWordsRef.current,
        colorSettings,
        styleSettings
      );
    };

    let resizeTimeout: number;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(handleResize, 100);
    });

    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      renderCanvas(
        canvas,
        nodesRef.current,
        edgesRef.current,
        minWordsRef.current,
        maxWordsRef.current,
        colorSettings,
        styleSettings
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [colorSettings, styleSettings]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-zinc-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

Network2D.displayName = 'Network2D';
