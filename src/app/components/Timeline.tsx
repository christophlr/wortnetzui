import { Eye, Lock, ChevronRight, Plus, Diamond } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { useState, useRef, useEffect, useCallback } from 'react';

/* ── Types & constants ── */

interface TimelineProps {
  playheadPosition: number;
  onPlayheadChange: (pos: number) => void;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  cameraSnapshots?: Array<{ time: number; position: any; target: any }>;
  onCaptureSnapshot?: () => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
}

const DURATION = 30;
const LABEL_W = 224; // px, must match the w-[224px] class below

const TRACK_GROUPS = [
  {
    id: 'camera', name: 'Camera', color: 'cyan' as const,
    tracks: [
      { id: 'camera-snapshots', name: 'Snapshots', kfs: [], graph: false },
    ],
  },
  {
    id: 'physics', name: 'Physics', color: 'orange' as const,
    tracks: [
      { id: 'phys-rep',  name: 'Repulsion', kfs: [], graph: false },
      { id: 'phys-spk',  name: 'Spring K',  kfs: [], graph: false },
      { id: 'phys-dmp',  name: 'Damping',   kfs: [], graph: false },
    ],
  },
];

/* ── Color maps ── */

const COLOR = {
  cyan:   { dot: 'bg-cyan-500',   border: 'border-l-cyan-500/60',   kf: 'text-cyan-400',   kfFill: '#3b9eff', trackBg: 'bg-cyan-950/10',   graphStroke: '#007fff' },
  orange: { dot: 'bg-orange-500', border: 'border-l-orange-500/60', kf: 'text-orange-400', kfFill: '#fb923c', trackBg: 'bg-orange-950/10', graphStroke: '#f97316' },
};

/* ── Ruler ── */

function Ruler({ zoom }: { zoom: number }) {
  const totalSec = DURATION;
  // At zoom=1, show every 5s; at zoom>3, show every 1s; at zoom>6 show every 0.5s
  const majorStep = zoom >= 6 ? 1 : zoom >= 3 ? 2 : 5;
  const minorStep = majorStep / 5;
  const ticks: { t: number; major: boolean }[] = [];
  for (let t = 0; t <= totalSec; t += minorStep) {
    ticks.push({ t: parseFloat(t.toFixed(4)), major: Math.abs(t % majorStep) < 0.001 });
  }

  return (
    <div className="relative w-full h-full">
      {ticks.map(({ t, major }) => (
        <div
          key={t}
          className="absolute top-0 flex flex-col items-start"
          style={{ left: `${(t / DURATION) * 100}%` }}
        >
          <div className={`w-px ${major ? 'h-3.5 bg-zinc-600' : 'h-2 bg-zinc-700'}`} />
          {major && (
            <span className="text-[9px] font-mono text-zinc-600 ml-0.5 mt-0.5 leading-none">
              {t % 60 === 0 && t > 0 ? `${t / 60}m` : `${t}s`}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Curve (graph view) ── */

function GraphCurve({ kfs, color }: { kfs: number[]; color: string }) {
  if (kfs.length < 2) return null;
  const h = 26;
  // Build a smooth curve through kfs (treated as value 1 at odd indices, 0 at even)
  const pts = kfs.map((t, i) => ({
    x: (t / DURATION) * 100,
    y: i % 2 === 0 ? h * 0.8 : h * 0.2,
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], curr = pts[i];
    const cx = (prev.x + curr.x) / 2;
    d += ` C ${cx} ${prev.y} ${cx} ${curr.y} ${curr.x} ${curr.y}`;
  }

  return (
    <svg className="absolute inset-0 w-full pointer-events-none" style={{ height: h }}>
      <path d={d} fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.35" />
    </svg>
  );
}

/* ── Track row (inside a group) ── */

function TrackRow({
  track, color, selectedKeyframe, onKeyframeSelect, onMoveKeyframe, snap, contentRef,
}: {
  track: { id: string; name: string; kfs: number[]; graph: boolean };
  color: keyof typeof COLOR;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  snap: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
}) {
  const c = COLOR[color];
  const [draggingKf, setDraggingKf] = useState<{ time: number; startX: number } | null>(null);

  const timeFromClientX = useCallback((clientX: number) => {
    if (!contentRef.current) return null;
    const rect = contentRef.current.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = clientX - rect.left - LABEL_W;
    const raw = (x / rightW) * DURATION;
    const clamped = Math.max(0, Math.min(DURATION, raw));
    if (snap) return Math.round(clamped * 2) / 2; // snap to 0.5s
    return clamped;
  }, [snap, contentRef]);

  useEffect(() => {
    if (!draggingKf) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newTime = timeFromClientX(e.clientX);
      if (newTime !== null && onMoveKeyframe) {
        onMoveKeyframe(track.id, draggingKf.time, newTime);
        setDraggingKf({ ...draggingKf, time: newTime });
      }
    };

    const handleMouseUp = () => {
      setDraggingKf(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingKf, timeFromClientX, onMoveKeyframe, track.id]);

  return (
    <div className="flex border-b border-zinc-800/50" style={{ height: 26 }}>
      {/* Left label */}
      <div
        className="shrink-0 flex items-center pl-8 pr-2 border-r border-zinc-800 bg-zinc-950 gap-1.5"
        style={{ width: LABEL_W }}
      >
        <span className="text-[10px] text-zinc-500 flex-1 truncate">{track.name}</span>
        {track.graph && (
          <span className="text-[8px] text-zinc-700 bg-zinc-900 border border-zinc-800 rounded px-1">curve</span>
        )}
      </div>

      {/* Right: keyframes */}
      <div className={`flex-1 relative ${c.trackBg}`}>
        {track.graph && <GraphCurve kfs={track.kfs} color={c.graphStroke} />}
        {track.kfs.map((t, idx) => {
          const selected = selectedKeyframe?.track === track.id && selectedKeyframe?.time === t;
          return (
            <button
              key={`${track.id}-${t}-${idx}`}
              onMouseDown={e => {
                e.stopPropagation();
                // Allow dragging for camera-snapshots track
                if (track.id === 'camera-snapshots') {
                  setDraggingKf({ time: t, startX: e.clientX });
                  onKeyframeSelect(track.id, t);
                } else {
                  onKeyframeSelect(track.id, t);
                }
              }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 hover:scale-150 transition-transform z-10 cursor-grab active:cursor-grabbing"
              style={{ left: `${(t / DURATION) * 100}%` }}
            >
              <Diamond
                size={10}
                className={selected ? `${c.kf} drop-shadow-[0_0_8px_currentColor]` : 'text-zinc-500 hover:text-zinc-300 drop-shadow-md'}
                fill={selected ? c.kfFill : 'currentColor'}
                stroke={selected ? c.kfFill : 'currentColor'}
                strokeWidth={selected ? 2 : 1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Track group ── */

function TrackGroup({
  group, expanded, onToggle, selectedKeyframe, onKeyframeSelect, cameraSnapshots, onMoveKeyframe, snap, contentRef,
}: {
  group: typeof TRACK_GROUPS[number];
  expanded: boolean;
  onToggle: () => void;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  cameraSnapshots: Array<{ time: number; position: any; target: any }>;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  snap: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
}) {
  const c = COLOR[group.color];

  return (
    <>
      {/* Group header row */}
      <div className={`flex border-b border-zinc-800 border-l-2 ${c.border}`} style={{ height: 30 }}>
        {/* Left */}
        <div
          className="shrink-0 flex items-center gap-1.5 px-2 cursor-pointer hover:bg-zinc-800/40 transition-colors border-r border-zinc-800"
          style={{ width: LABEL_W }}
          onClick={onToggle}
        >
          <ChevronRight
            size={12}
            className={`text-zinc-500 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
          />
          <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
          <span className="text-[11px] font-medium text-zinc-200 flex-1 truncate">{group.name}</span>
          <button className="opacity-0 hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <Eye size={11} className="text-zinc-600 hover:text-zinc-400" />
          </button>
          <button onClick={e => e.stopPropagation()}>
            <Lock size={11} className="text-zinc-700 hover:text-zinc-500" />
          </button>
        </div>

        {/* Right: group bar */}
        <div className="flex-1 relative">
          <div className={`absolute inset-y-2 left-0 right-0 rounded-sm opacity-10 ${c.dot}`} />
        </div>
      </div>

      {/* Sub-tracks */}
      {expanded && group.tracks.map(track => {
        // Use dynamic keyframes for camera-snapshots track
        const dynamicKfs = track.id === 'camera-snapshots'
          ? cameraSnapshots.map(s => s.time)
          : track.kfs;

        return (
          <TrackRow
            key={track.id}
            track={{ ...track, kfs: dynamicKfs }}
            color={group.color}
            selectedKeyframe={selectedKeyframe}
            onKeyframeSelect={onKeyframeSelect}
            onMoveKeyframe={onMoveKeyframe}
            snap={snap}
            contentRef={contentRef}
          />
        );
      })}
    </>
  );
}

/* ── Main Timeline ── */

export function Timeline({
  playheadPosition,
  onPlayheadChange,
  selectedKeyframe,
  onKeyframeSelect,
  cameraSnapshots = [],
  onCaptureSnapshot,
  onMoveKeyframe,
}: TimelineProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ camera: true, physics: true });
  const [zoom, setZoom] = useState([1]);
  const [snap, setSnap] = useState(true);
  const [loop, setLoop] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const posFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!contentRef.current) return null;
    const rect = contentRef.current.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = e.clientX - rect.left - LABEL_W;
    const raw = (x / rightW) * DURATION;
    const clamped = Math.max(0, Math.min(DURATION, raw));
    if (snap) return Math.round(clamped * 2) / 2; // snap to 0.5s
    return clamped;
  }, [snap]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    const pos = posFromEvent(e);
    if (pos !== null) onPlayheadChange(pos);
  };

  useEffect(() => {
    const up = () => { isDragging.current = false; };
    const move = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const pos = posFromEvent(e);
      if (pos !== null) onPlayheadChange(pos);
    };
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', move); };
  }, [posFromEvent, onPlayheadChange]);

  const ratio = playheadPosition / DURATION;
  // Playhead left within the full content area (label + right)
  const playheadLeft = `calc(${ratio * 100}% + ${LABEL_W * (1 - ratio)}px)`;

  return (
    <div className="flex flex-col bg-zinc-900 border-t border-zinc-800 shrink-0" style={{ height: 268 }}>

      {/* ── Toolbar ── */}
      <div className="h-9 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1 h-6 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] rounded border border-zinc-700/60 transition-colors">
            <Plus size={10} />Track
          </button>
          <button className="flex items-center gap-1 h-6 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] rounded border border-zinc-700/60 transition-colors">
            <Plus size={10} />Parameter
          </button>
          <button
            onClick={onCaptureSnapshot}
            className="flex items-center gap-1 h-6 px-2 bg-cyan-800/30 hover:bg-cyan-700/40 text-cyan-400 hover:text-cyan-300 rounded border border-cyan-700/60 transition-colors text-[10px]"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0 L10 5 L5 10 L0 5 Z" />
            </svg>
            Keyframe
          </button>
          <div className="h-4 w-px bg-zinc-800 mx-0.5" />
          <button className="h-6 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 text-[10px] rounded border border-zinc-700/60 transition-colors">
            Marker
          </button>
        </div>

        <div className="flex items-center gap-3">
          

          <div className="flex items-center gap-1">
            
            
          </div>

          <span className="text-[9px] font-mono text-zinc-700">00:30:00</span>
        </div>
      </div>

      {/* ── Content (ruler + tracks) ── */}
      <div className="flex-1 overflow-hidden flex flex-col relative" ref={contentRef}>

        {/* Ruler row */}
        <div className="flex shrink-0 border-b border-zinc-800" style={{ height: 24 }}>
          {/* Label spacer */}
          <div className="shrink-0 bg-zinc-950 border-r border-zinc-800" style={{ width: LABEL_W }} />
          {/* Ruler + click zone */}
          <div
            className="flex-1 relative bg-zinc-950 cursor-col-resize overflow-hidden"
            onMouseDown={handleMouseDown}
          >
            <Ruler zoom={zoom[0]} />
            {/* Playhead triangle in ruler */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{ left: `${ratio * 100}%` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-red-500" />
              <div className="absolute top-1 bottom-0 left-1/2 -translate-x-1/2 w-px bg-red-500/60" />
            </div>
          </div>
        </div>

        {/* Track rows */}
        <div className="flex-1 overflow-y-auto" onMouseDown={handleMouseDown}>
          {TRACK_GROUPS.map(group => (
            <TrackGroup
              key={group.id}
              group={group}
              expanded={expanded[group.id]}
              onToggle={() => setExpanded(p => ({ ...p, [group.id]: !p[group.id] }))}
              selectedKeyframe={selectedKeyframe}
              onKeyframeSelect={onKeyframeSelect}
              cameraSnapshots={cameraSnapshots}
              onMoveKeyframe={onMoveKeyframe}
              snap={snap}
              contentRef={contentRef}
            />
          ))}

          {/* Bottom padding */}
          <div className="flex border-b border-zinc-800/30" style={{ height: 16 }}>
            <div className="shrink-0 border-r border-zinc-800" style={{ width: LABEL_W }} />
            <div className="flex-1" />
          </div>
        </div>

        {/* ── Full-height playhead overlay ── */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-20"
          style={{ left: playheadLeft }}
        >
          <div className="absolute top-0 bottom-0 w-px bg-red-500/70" />
        </div>
      </div>
    </div>
  );
}