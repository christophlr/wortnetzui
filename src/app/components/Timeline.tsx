import { createPortal } from 'react-dom';
import { Eye, Lock, ChevronRight, Plus, Diamond, Play, Pause, Square, SkipBack, SkipForward, ChevronLeft, Undo2, Redo2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TIMELINE_DURATION } from '../constants';
import { EASING_PRESETS, easingCurvePath } from '../easing';
import type { EasingType } from '../easing';

/* ── Types & constants ── */

interface TimelineProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  playheadPosition: number;
  onPlayheadChange: (pos: number) => void;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  cameraSnapshots?: Array<{ time: number; position: any; target: any; easing?: EasingType }>;
  onCaptureSnapshot?: () => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onChangeEasing?: (time: number, easing: EasingType) => void;
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
  cyan:   { dot: 'bg-teal-500',   border: 'border-l-teal-500/60',   kf: 'text-teal-400',   kfFill: '#2dd4bf', trackBg: 'bg-teal-950/10',   graphStroke: '#0d9488' },
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
          ? 'border-blue-800/60 ring-1 ring-blue-800/30 text-blue-400 min-w-[100px]'
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

/* ── Easing preset picker (portal) ── */

function EasingPicker({
  anchorX, anchorY, currentEasing, onSelect, onClose,
}: {
  anchorX: number;
  anchorY: number;
  currentEasing: EasingType;
  onSelect: (t: EasingType) => void;
  onClose: () => void;
}) {
  const pickerW = 268;
  const left = Math.max(8, Math.min(window.innerWidth - pickerW - 8, anchorX - pickerW / 2));
  const bottom = window.innerHeight - anchorY + 10;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/80 rounded-xl p-2.5 shadow-2xl"
        style={{ left, bottom }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-0.5">
          Easing preset
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {EASING_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => { onSelect(preset.id); onClose(); }}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                preset.id === currentEasing
                  ? 'border-zinc-500 bg-zinc-800'
                  : 'border-transparent hover:border-zinc-700/80 hover:bg-zinc-800/60'
              }`}
              title={preset.label}
            >
              <svg width="42" height="26" viewBox="0 0 42 26" className="overflow-visible">
                <path
                  d={easingCurvePath(preset.id, 42, 26)}
                  fill="none"
                  stroke={preset.color}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[9px] text-zinc-400 leading-none whitespace-nowrap">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
}

/* ── Easing track row ── */

function EasingTrackRow({
  snapshots, onChangeEasing, duration,
}: {
  snapshots: Array<{ time: number; easing?: EasingType }>;
  onChangeEasing: (time: number, easing: EasingType) => void;
  duration: number;
}) {
  const [picker, setPicker] = useState<{ fromTime: number; anchorX: number; anchorY: number } | null>(null);

  const segments = useMemo(() => {
    const sorted = [...snapshots].sort((a, b) => a.time - b.time);
    return sorted.slice(0, -1).map((kf, i) => ({
      fromTime: kf.time,
      toTime: sorted[i + 1].time,
      easing: (kf.easing ?? 'easeInOut') as EasingType,
    }));
  }, [snapshots]);

  const preset = (e: EasingType) => EASING_PRESETS.find(p => p.id === e) ?? EASING_PRESETS[3];

  return (
    <>
      <div className="flex border-b border-zinc-800/50" style={{ height: 30 }}>
        {/* Left label */}
        <div
          className="shrink-0 flex items-center pl-8 pr-2 border-r border-zinc-800 bg-zinc-950 gap-1.5"
          style={{ width: LABEL_W }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-zinc-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M 0 9 Q 3 9 5 5 Q 7 1 10 1" strokeLinecap="round"/>
          </svg>
          <span className="text-[10px] text-zinc-500 flex-1 truncate">Easing</span>
        </div>

        {/* Right: segments */}
        <div className="flex-1 relative bg-teal-950/5">
          {segments.length === 0 && (
            <div className="absolute inset-0 flex items-center px-3">
              <div className="w-full border-t border-dashed border-zinc-800/60" />
            </div>
          )}
          {segments.map(seg => {
            const p = preset(seg.easing);
            const leftPct = (seg.fromTime / duration) * 100;
            const rightPct = (1 - seg.toTime / duration) * 100;
            return (
              <button
                key={seg.fromTime}
                className="absolute inset-y-1 rounded overflow-hidden group transition-opacity hover:opacity-90 cursor-pointer"
                style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
                onClick={e => {
                  e.stopPropagation();
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setPicker({
                    fromTime: seg.fromTime,
                    anchorX: rect.left + rect.width / 2,
                    anchorY: rect.top,
                  });
                }}
                title={`${p.label} — click to change`}
              >
                {/* Curve SVG fills the entire segment */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 28"
                  preserveAspectRatio="none"
                >
                  <rect x="0" y="0" width="100" height="28" fill={p.color} fillOpacity="0.07" rx="1" />
                  <path
                    d={easingCurvePath(seg.easing, 100, 28)}
                    fill="none"
                    stroke={p.color}
                    strokeWidth="1.6"
                    strokeOpacity="0.65"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {/* Label shown on hover if segment is reasonably wide */}
                <span
                  className="absolute inset-0 flex items-center justify-center text-[8px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ color: p.color }}
                >
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {picker && (
        <EasingPicker
          anchorX={picker.anchorX}
          anchorY={picker.anchorY}
          currentEasing={segments.find(s => s.fromTime === picker.fromTime)?.easing ?? 'easeInOut'}
          onSelect={easing => onChangeEasing(picker.fromTime, easing)}
          onClose={() => setPicker(null)}
        />
      )}
    </>
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
  group, expanded, onToggle, selectedKeyframe, onKeyframeSelect, cameraSnapshots, onMoveKeyframe, onChangeEasing, snap, contentRef, playheadPosition, duration,
}: {
  group: typeof TRACK_GROUPS[number];
  expanded: boolean;
  onToggle: () => void;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  cameraSnapshots: Array<{ time: number; position: any; target: any; easing?: EasingType }>;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onChangeEasing?: (time: number, easing: EasingType) => void;
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

      {/* Easing strip — only for camera group when expanded and there are segments */}
      {expanded && group.id === 'camera' && onChangeEasing && (
        <EasingTrackRow
          snapshots={cameraSnapshots}
          onChangeEasing={onChangeEasing}
          duration={duration}
        />
      )}
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
  onChangeEasing,
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
            className="flex items-center gap-1 h-6 px-2 bg-teal-800/30 hover:bg-teal-700/40 text-teal-400 hover:text-teal-300 rounded border border-teal-700/60 transition-colors text-[10px]"
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
                  ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/40'
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
              onChangeEasing={onChangeEasing}
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
