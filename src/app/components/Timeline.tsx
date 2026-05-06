import { Eye, Lock, ChevronRight, Plus, Diamond, Play, Pause, Square, SkipBack, SkipForward, ChevronLeft, Undo2, Redo2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { TIMELINE_DURATION } from '../constants';

/* ── Types & constants ── */

interface TimelineProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  playheadPosition: number;
  onPlayheadChange: (pos: number) => void;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  cameraSnapshots?: Array<{ time: number; position: any; target: any }>;
  onCaptureSnapshot?: () => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  timecode?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

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

/* ── Transport button ── */

function TBtn({
  onClick, title, children, active = false, disabled = false
}: {
  onClick?: () => void;
  title?: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
        disabled
          ? 'opacity-30 cursor-not-allowed text-zinc-600'
          : active
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Timecode display ── */

function TCDisplay({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`px-2 py-[3px] bg-zinc-950 rounded border font-mono text-[11px] text-center tracking-wide ${
        accent
          ? 'border-cyan-800/60 ring-1 ring-cyan-800/30 text-cyan-400 min-w-[100px]'
          : 'border-zinc-800 text-zinc-600 min-w-[80px]'
      }`}>
        {value}
      </div>
    </div>
  );
}

/* ── Ruler ── */

function Ruler({ zoom, duration }: { zoom: number; duration: number }) {
  const majorStep = zoom >= 6 ? 1 : zoom >= 3 ? 2 : duration > 60 ? 10 : 5;
  const minorStep = majorStep / 5;
  const ticks: { t: number; major: boolean }[] = [];
  for (let t = 0; t <= duration; t += minorStep) {
    ticks.push({ t: parseFloat(t.toFixed(4)), major: Math.abs(t % majorStep) < 0.001 });
  }

  return (
    <div className="relative w-full h-full">
      {ticks.map(({ t, major }) => (
        <div
          key={t}
          className="absolute top-0 flex flex-col items-start"
          style={{ left: `${(t / duration) * 100}%` }}
        >
          <div className={`w-px ${major ? 'h-3.5 bg-zinc-600' : 'h-2 bg-zinc-700'}`} />
          {major && (
            <span className="text-[9px] font-mono text-zinc-600 ml-0.5 mt-0.5 leading-none">
              {t >= 60 ? `${Math.floor(t / 60)}m${t % 60 > 0 ? `${t % 60}s` : ''}` : `${t}s`}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Curve (graph view) ── */

function GraphCurve({ kfs, color, duration }: { kfs: number[]; color: string; duration: number }) {
  if (kfs.length < 2) return null;
  const h = 26;
  const pts = kfs.map((t, i) => ({
    x: (t / duration) * 100,
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
  track, color, selectedKeyframe, onKeyframeSelect, onMoveKeyframe, snap, contentRef, playheadPosition, duration,
}: {
  track: { id: string; name: string; kfs: number[]; graph: boolean };
  color: keyof typeof COLOR;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  snap: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  playheadPosition: number;
  duration: number;
}) {
  const c = COLOR[color];
  const [draggingKf, setDraggingKf] = useState<{ time: number; startX: number } | null>(null);

  const timeFromClientX = useCallback((clientX: number) => {
    if (!contentRef.current) return null;
    const rect = contentRef.current.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = clientX - rect.left - LABEL_W;
    const raw = (x / rightW) * duration;
    const clamped = Math.max(0, Math.min(duration, raw));
    if (snap) return Math.round(clamped * 2) / 2;
    return clamped;
  }, [snap, contentRef, duration]);

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
        {track.graph && <GraphCurve kfs={track.kfs} color={c.graphStroke} duration={duration} />}
        {track.kfs.map((t, idx) => {
          const selected = selectedKeyframe?.track === track.id && selectedKeyframe?.time === t;
          const onPlayhead = !selected && Math.abs(t - playheadPosition) < 0.1;
          return (
            <button
              key={`${track.id}-${t}-${idx}`}
              onMouseDown={e => {
                e.stopPropagation();
                if (track.id === 'camera-snapshots') {
                  setDraggingKf({ time: t, startX: e.clientX });
                  onKeyframeSelect(track.id, t);
                } else {
                  onKeyframeSelect(track.id, t);
                }
              }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 hover:scale-150 transition-transform z-10 cursor-grab active:cursor-grabbing"
              style={{ left: `${(t / duration) * 100}%` }}
            >
              <Diamond
                size={10}
                className={
                  selected
                    ? `${c.kf} drop-shadow-[0_0_8px_currentColor]`
                    : onPlayhead
                      ? 'text-blue-400 drop-shadow-[0_0_8px_currentColor]'
                      : 'text-zinc-500 hover:text-zinc-300 drop-shadow-md'
                }
                fill={selected ? c.kfFill : onPlayhead ? '#3b82f6' : 'currentColor'}
                stroke={selected ? c.kfFill : onPlayhead ? '#3b82f6' : 'currentColor'}
                strokeWidth={selected || onPlayhead ? 2 : 1.5}
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
  group, expanded, onToggle, selectedKeyframe, onKeyframeSelect, cameraSnapshots, onMoveKeyframe, snap, contentRef, playheadPosition, duration,
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
  playheadPosition: number;
  duration: number;
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
            playheadPosition={playheadPosition}
            duration={duration}
          />
        );
      })}
    </>
  );
}

/* ── Main Timeline ── */

export function Timeline({
  isPlaying,
  onPlayPause,
  onStop,
  playheadPosition,
  onPlayheadChange,
  selectedKeyframe,
  onKeyframeSelect,
  cameraSnapshots = [],
  onCaptureSnapshot,
  onMoveKeyframe,
  timecode = '00:00:00:00',
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: TimelineProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ camera: true, physics: true });
  const [zoom] = useState([1]);
  const [snap, setSnap] = useState(true);
  const [duration, setDuration] = useState(TIMELINE_DURATION);

  // Auto-extend when a keyframe lands in the last 10% of duration
  useEffect(() => {
    const maxKfTime = cameraSnapshots.reduce((max, s) => Math.max(max, s.time), 0);
    if (maxKfTime > duration * 0.9) {
      setDuration(d => d + 60);
    }
  }, [cameraSnapshots, duration]);

  const contentRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const posFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!contentRef.current) return null;
    const rect = contentRef.current.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = e.clientX - rect.left - LABEL_W;
    const raw = (x / rightW) * duration;
    const clamped = Math.max(0, Math.min(duration, raw));
    if (snap) return Math.round(clamped * 2) / 2;
    return clamped;
  }, [snap, duration]);

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

  const stepFrame = (dir: number) =>
    onPlayheadChange(Math.max(0, Math.min(duration, playheadPosition + dir * (1 / 30))));

  const ratio = playheadPosition / duration;
  const playheadLeft = `calc(${ratio * 100}% + ${LABEL_W * (1 - ratio)}px)`;

  // suppress unused warning — snap toggle can be added to UI later
  void setSnap;

  return (
    <div className="flex flex-col bg-zinc-900 border-t border-zinc-800 shrink-0" style={{ height: 268 }}>

      {/* ── Toolbar ── */}
      <div className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center px-3 shrink-0 relative">

        {/* Left: track/keyframe/undo/redo buttons */}
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
          <TBtn onClick={onUndo} title="Rückgängig (Undo)" disabled={!canUndo}>
            <Undo2 size={11} />
          </TBtn>
          <TBtn onClick={onRedo} title="Wiederholen (Redo)" disabled={!canRedo}>
            <Redo2 size={11} />
          </TBtn>
        </div>

        {/* Center: timecode above transport — absolutely centered */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-row items-center gap-3">
          <TCDisplay label="Timecode" value={timecode} accent />
          <div className="flex items-center gap-0.5">
            <TBtn onClick={() => onPlayheadChange(0)} title="Zum Anfang">
              <SkipBack size={11} />
            </TBtn>
            <TBtn onClick={() => stepFrame(-1)} title="Ein Frame zurück">
              <ChevronLeft size={13} />
            </TBtn>
            <TBtn onClick={onStop} title="Stopp">
              <Square size={9} fill="currentColor" />
            </TBtn>
            <button
              onClick={onPlayPause}
              title={isPlaying ? 'Pause' : 'Abspielen (Leertaste)'}
              className={`w-8 h-8 flex items-center justify-center rounded transition-all ${
                isPlaying
                  ? 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/40'
                  : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              {isPlaying
                ? <Pause size={13} fill="currentColor" />
                : <Play size={13} fill="currentColor" className="ml-0.5" />
              }
            </button>
            <TBtn onClick={() => stepFrame(1)} title="Ein Frame vor">
              <ChevronRight size={13} />
            </TBtn>
            <TBtn onClick={() => onPlayheadChange(duration)} title="Zum Ende">
              <SkipForward size={11} />
            </TBtn>
          </div>
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
            <Ruler zoom={zoom[0]} duration={duration} />
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
              playheadPosition={playheadPosition}
              duration={duration}
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