import { Network3D, type Network3DHandle } from './Network3D';
import { useEffect, forwardRef } from 'react';

interface PreviewProps {
  viewMode: '2D' | '3D';
  physicsEnabled: boolean;
  isPlaying: boolean;
  playheadPosition: number;
  physicsParams?: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
  };
  inputText?: string;
  colorSettings?: { hueStart: number; hueEnd: number; saturation: number; lightness: number };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number };
  cameraSnapshots?: Array<{ time: number; position: any; target: any }>;
  onCameraChange?: () => void;
}

/* ── Static word-network mock data ── */

const NODES = [
  { id: 'die',     label: 'Die',       x: 41, y: 52, r: 3.5, bright: false },
  { id: 'blaue',   label: 'blaue',     x: 31, y: 37, r: 4.5, bright: true  },
  { id: 'insel',   label: 'Insel',     x: 50, y: 27, r: 5,   bright: true  },
  { id: 'geht',    label: 'geht',      x: 60, y: 46, r: 3,   bright: false },
  { id: 'einsam',  label: 'einsam',    x: 52, y: 62, r: 4.5, bright: true  },
  { id: 'in',      label: 'in',        x: 68, y: 39, r: 2.5, bright: false },
  { id: 'die2',    label: 'die',       x: 75, y: 30, r: 2.5, bright: false },
  { id: 'ferne',   label: 'Ferne',     x: 83, y: 21, r: 4.5, bright: true  },
  { id: 'stille',  label: 'Stille',    x: 24, y: 20, r: 3,   bright: false },
  { id: 'wellen',  label: 'Wellen',    x: 17, y: 57, r: 3,   bright: false },
  { id: 'wind',    label: 'Wind',      x: 65, y: 64, r: 3,   bright: false },
  { id: 'dunkel',  label: 'Dunkelheit',x: 79, y: 69, r: 2.5, bright: false },
  { id: 'meer',    label: 'Meer',      x: 13, y: 43, r: 3,   bright: false },
  { id: 'horizont',label: 'Horizont',  x: 73, y: 15, r: 2.5, bright: false },
  { id: 'blau',    label: 'Blau',      x: 20, y: 29, r: 3,   bright: false },
];

const EDGES: [string, string][] = [
  ['die', 'blaue'], ['die', 'insel'],
  ['blaue', 'insel'], ['blaue', 'blau'], ['blaue', 'wellen'], ['blaue', 'meer'],
  ['insel', 'geht'], ['insel', 'stille'],
  ['geht', 'einsam'], ['geht', 'in'],
  ['in', 'die2'], ['die2', 'ferne'],
  ['ferne', 'horizont'], ['ferne', 'dunkel'],
  ['einsam', 'wind'], ['wind', 'dunkel'],
  ['meer', 'wellen'], ['blau', 'stille'],
];

function NodeNetwork({ isPlaying, phase }: { isPlaying: boolean; phase: number }) {
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-strong">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0e7490" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="50" cy="42" rx="38" ry="28" fill="url(#centerGlow)" />

      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const na = nodeMap[a], nb = nodeMap[b];
        if (!na || !nb) return null;
        const isHighlighted = na.bright || nb.bright;
        return (
          <line
            key={i}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={isHighlighted ? '#3b9eff' : '#3f3f46'}
            strokeWidth={isHighlighted ? 0.18 : 0.12}
            strokeOpacity={isHighlighted ? 0.28 : 0.18}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map(node => {
        const wobble = isPlaying
          ? Math.sin(phase * 2 + node.x * 0.3) * 0.3
          : 0;
        const cy = node.y + wobble;

        if (node.bright) {
          return (
            <g key={node.id} filter="url(#glow-strong)">
              {/* Outer ring */}
              <circle cx={node.x} cy={cy} r={node.r + 1.5} fill="none" stroke="#3b9eff" strokeWidth="0.18" strokeOpacity="0.22" />
              {/* Node */}
              <circle cx={node.x} cy={cy} r={node.r} fill="#0c4a6e" stroke="#3b9eff" strokeWidth="0.35" strokeOpacity="0.8" />
              {/* Center dot */}
              <circle cx={node.x} cy={cy} r={1} fill="#66b3ff" fillOpacity="0.7" />
              {/* Label */}
              <text
                x={node.x} y={cy + node.r + 2.4}
                textAnchor="middle"
                fontSize="2.2"
                fill="#7dd3fc"
                fillOpacity="0.75"
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          );
        } else {
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={cy} r={node.r} fill="#1c1c20" stroke="#3f3f46" strokeWidth="0.2" strokeOpacity="0.6" />
              <text
                x={node.x} y={cy + node.r + 2.4}
                textAnchor="middle"
                fontSize="2"
                fill="#52525b"
                fillOpacity="0.9"
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          );
        }
      })}
    </svg>
  );
}

export const Preview = forwardRef<Network3DHandle, PreviewProps>(function Preview({
  viewMode,
  physicsEnabled,
  isPlaying,
  playheadPosition,
  physicsParams,
  inputText,
  colorSettings,
  styleSettings,
  cameraSnapshots,
  onCameraChange,
}: PreviewProps, ref) {
  const phase = playheadPosition * 0.5;

  return (
    <div className="flex-1 bg-zinc-950 relative overflow-hidden">
      {viewMode === '2D' ? (
        <>
          {/* Dot grid */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="#a1a1aa" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          {/* Word network */}
          <div className="absolute inset-0">
            <NodeNetwork isPlaying={isPlaying} phase={phase} />
          </div>

          {/* Crosshair center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative opacity-10">
              <div className="absolute w-px h-6 bg-zinc-400 left-1/2 -translate-x-1/2 -top-3" />
              <div className="absolute h-px w-6 bg-zinc-400 top-1/2 -translate-y-1/2 -left-3" />
            </div>
          </div>

          {/* Bottom center label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
            <span className="text-[9px] text-zinc-700 uppercase tracking-[0.2em]">
              Preview — Nicht-interaktiver Platzhalter
            </span>
          </div>
        </>
      ) : (
        /* 3D View */
        <div className="absolute inset-0">
          <Network3D
            ref={ref}
            isPlaying={isPlaying}
            playheadPosition={playheadPosition}
            physicsParams={physicsParams}
            inputText={inputText}
            colorSettings={colorSettings}
            styleSettings={styleSettings}
            cameraSnapshots={cameraSnapshots}
            onCameraChange={onCameraChange}
          />
        </div>
      )}

      {/* Top-left badges - visible in both modes */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none z-10">
        
        
      </div>

      {/* Top-right: playing indicator - visible in both modes */}
      {isPlaying && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded border bg-red-950/40 border-red-800/40 pointer-events-none z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-red-400 font-medium tracking-wide">LIVE</span>
        </div>
      )}

      {/* Camera info overlay (bottom-right) - visible in both modes */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-0.5 pointer-events-none z-10">
        <span className="text-[9px] font-mono text-zinc-700">CAM · POS 0 / 0 / 500</span>
        <span className="text-[9px] font-mono text-zinc-700">ROT 0° / 0° / 0°</span>
        <span className="text-[9px] font-mono text-zinc-700">ZOOM 800px</span>
      </div>
    </div>
  );
});