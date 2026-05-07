import { createPortal } from 'react-dom';
import { Eye, Lock, ChevronRight, Plus, Diamond, Play, Pause, Square, SkipBack, SkipForward, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TIMELINE_DURATION } from '../constants';
import { segmentBezierPath } from '../easing';

/* ── Types & constants ── */

interface TimelineProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  playheadPosition: number;
  onPlayheadChange: (pos: number) => void;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  cameraSnapshots?: Array<{ time: number; position: any; target: any; outWeight?: number; inWeight?: number }>;
  onCaptureSnapshot?: () => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onSetHandle?: (time: number, side: 'out' | 'in', weight: number) => void;
  onDeleteKeyframe?: (trackId: string, time: number) => void;
  onDuplicateKeyframe?: (trackId: string, srcTime: number, destTime: number) => void;
  timecode?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

interface ViewWindow {
  start: number;
  end: number;
}

const LABEL_W = 224;

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
  onClick, title, children, active = false, disabled = false,
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
          ? 'opacity-30 cursor-not-allowed text-muted-foreground/40'
          : active
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Timecode display ── */

function TCDisplay({ value, accent = false }: { value: string; accent?: boolean }) {
  return (
    <div className={`px-2 py-[3px] bg-input rounded border font-mono text-[11px] text-center tracking-wide ${
      accent
        ? 'border-blue-800/60 ring-1 ring-blue-800/30 text-blue-400 min-w-[100px]'
        : 'border-border text-muted-foreground min-w-[80px]'
    }`}>
      {value}
    </div>
  );
}

/* ── Ruler ── */

function Ruler({ zoom, duration, viewWindow }: { zoom: number; duration: number; viewWindow: ViewWindow }) {
  const visibleDuration = viewWindow.end - viewWindow.start;
  const majorStep = zoom >= 20 ? 0.5 : zoom >= 10 ? 1 : zoom >= 5 ? 2 : zoom >= 2 ? 5 : visibleDuration > 60 ? 10 : 5;
  const minorStep = majorStep / 5;

  const ticks: { t: number; major: boolean; leftPct: number }[] = [];
  const firstTick = Math.floor(viewWindow.start / minorStep) * minorStep;
  const tickCount = Math.ceil(visibleDuration / minorStep) + 3;

  for (let i = 0; i < tickCount; i++) {
    const t = parseFloat((firstTick + i * minorStep).toFixed(4));
    if (t < 0 || t > duration) continue;
    const leftPct = ((t - viewWindow.start) / visibleDuration) * 100;
    if (leftPct < -1 || leftPct > 101) continue;
    ticks.push({ t, major: Math.abs(t % majorStep) < 0.001, leftPct });
  }

  return (
    <div className="relative w-full h-full">
      {ticks.map(({ t, major, leftPct }) => (
        <div
          key={t}
          className="absolute top-0 flex flex-col items-start"
          style={{ left: `${leftPct}%` }}
        >
          <div className={`w-px ${major ? 'h-3.5 bg-muted-foreground' : 'h-2 bg-muted-foreground/60'}`} />
          {major && (
            <span className="text-[9px] font-mono text-muted-foreground ml-0.5 mt-0.5 leading-none">
              {t >= 60 ? `${Math.floor(t / 60)}m${t % 60 > 0 ? `${t % 60}s` : ''}` : `${t}s`}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Curve (graph view) ── */

function GraphCurve({ kfs, color, viewWindow }: { kfs: number[]; color: string; viewWindow: ViewWindow }) {
  if (kfs.length < 2) return null;
  const h = 26;
  const visibleDuration = viewWindow.end - viewWindow.start;
  const pts = kfs.map((t, i) => ({
    x: ((t - viewWindow.start) / visibleDuration) * 100,
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

/* ── Context menu ── */

function ContextMenu({
  x, y, hasClipboard, onCopy, onCut, onPaste, onDelete, onClose,
}: {
  x: number;
  y: number;
  hasClipboard: boolean;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const menuW = 196;
  const menuH = 136;
  const left = Math.min(x, window.innerWidth - menuW - 8);
  const top = Math.min(y, window.innerHeight - menuH - 8);

  const Item = ({
    label, shortcut, action, disabled = false, danger = false,
  }: {
    label: string; shortcut: string; action: () => void; disabled?: boolean; danger?: boolean;
  }) => (
    <button
      onMouseDown={e => e.stopPropagation()}
      onClick={() => { if (!disabled) { action(); onClose(); } }}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-[5px] text-[11px] rounded transition-colors ${
        disabled
          ? 'text-muted-foreground/35 cursor-not-allowed'
          : danger
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer'
            : 'text-foreground hover:bg-muted cursor-pointer'
      }`}
    >
      <span>{label}</span>
      <span className="text-[10px] text-muted-foreground/50 ml-4 font-mono">{shortcut}</span>
    </button>
  );

  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onMouseDown={onClose} onContextMenu={e => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-50 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl py-1 overflow-hidden"
        style={{ left, top, width: menuW }}
        onMouseDown={e => e.stopPropagation()}
      >
        <Item label="Copy" shortcut="⌘C" action={onCopy} />
        <Item label="Cut" shortcut="⌘X" action={onCut} />
        <Item label="Paste at Playhead" shortcut="⌘V" action={onPaste} disabled={!hasClipboard} />
        <div className="border-t border-border/60 my-1 mx-2" />
        <Item label="Delete" shortcut="⌫" action={onDelete} danger />
      </div>
    </>,
    document.body
  );
}

/* ── Easing track row — bezier curve editor ── */

const EASING_H = 56;

function EasingTrackRow({
  snapshots, onSetHandle, viewWindow,
}: {
  snapshots: Array<{ time: number; outWeight?: number; inWeight?: number }>;
  onSetHandle: (time: number, side: 'out' | 'in', weight: number) => void;
  viewWindow: ViewWindow;
}) {
  const visibleDuration = viewWindow.end - viewWindow.start;
  const trackRef = useRef<HTMLDivElement>(null);

  const keyframes = useMemo(() => [...snapshots].sort((a, b) => a.time - b.time), [snapshots]);

  const [dragging, setDragging] = useState<{
    kfTime: number;
    side: 'out' | 'in';
    segLeft: number;
    segWidth: number;
  } | null>(null);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const { kfTime, side, segLeft, segWidth } = dragging;
      const frac = (e.clientX - segLeft) / segWidth;
      const weight = side === 'out'
        ? Math.max(0, Math.min(0.5, frac))
        : Math.max(0, Math.min(0.5, 1 - frac));
      onSetHandle(kfTime, side, weight);
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, onSetHandle]);

  return (
    <div className="flex border-b border-border/50" style={{ height: EASING_H }}>
      <div
        className="shrink-0 flex items-center pl-8 pr-2 border-r border-border bg-background gap-1.5"
        style={{ width: LABEL_W }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-muted-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M 0 9 C 3 9 7 1 10 1" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] text-muted-foreground flex-1 truncate">Easing</span>
      </div>

      <div ref={trackRef} className="flex-1 relative bg-teal-950/5 overflow-visible">
        {keyframes.length === 0 && (
          <div className="absolute inset-0 flex items-center px-3">
            <div className="w-full border-t border-dashed border-border/40" />
          </div>
        )}

        {keyframes.map((kf, i) => {
          if (i === keyframes.length - 1) return null;
          const nextKf = keyframes[i + 1];

          const leftPct = ((kf.time - viewWindow.start) / visibleDuration) * 100;
          const rightPct = ((nextKf.time - viewWindow.start) / visibleDuration) * 100;
          if (rightPct <= 0 || leftPct >= 100) return null;
          const widthPct = rightPct - leftPct;

          const outW = kf.outWeight ?? 0.33;
          const inW = nextKf.inWeight ?? 0.33;
          const curvePath = segmentBezierPath(outW, inW, 100, EASING_H);

          const startDragOut = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!trackRef.current) return;
            const trackRect = trackRef.current.getBoundingClientRect();
            const segLeft = trackRect.left + (leftPct / 100) * trackRect.width;
            const segWidth = (widthPct / 100) * trackRect.width;
            setDragging({ kfTime: kf.time, side: 'out', segLeft, segWidth });
          };
          const startDragIn = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!trackRef.current) return;
            const trackRect = trackRef.current.getBoundingClientRect();
            const segLeft = trackRect.left + (leftPct / 100) * trackRect.width;
            const segWidth = (widthPct / 100) * trackRect.width;
            setDragging({ kfTime: nextKf.time, side: 'in', segLeft, segWidth });
          };

          return (
            <div
              key={`seg-${kf.time}-${nextKf.time}`}
              className="absolute inset-y-0 overflow-visible"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            >
              {/* Bezier curve */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 100 ${EASING_H}`}
                preserveAspectRatio="none"
              >
                {/* Fill */}
                <path
                  d={`${curvePath} L 100 ${EASING_H} L 0 ${EASING_H} Z`}
                  fill="#2dd4bf"
                  fillOpacity={0.07}
                />
                {/* Curve */}
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  strokeOpacity={0.7}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
                {/* Handle arm — out (bottom) */}
                <line
                  x1="0" y1={EASING_H}
                  x2={outW * 100} y2={EASING_H}
                  stroke="#2dd4bf" strokeWidth="1"
                  strokeOpacity="0.45"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Handle arm — in (top) */}
                <line
                  x1="100" y1="0"
                  x2={(1 - inW) * 100} y2="0"
                  stroke="#2dd4bf" strokeWidth="1"
                  strokeOpacity="0.45"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Out-handle circle (bottom edge) */}
              <div
                className="absolute z-10 cursor-ew-resize select-none"
                style={{ left: `${outW * 100}%`, bottom: 0, transform: 'translate(-50%, 50%)' }}
                onMouseDown={startDragOut}
                title={`Ease-out weight: ${(outW * 100).toFixed(0)}%`}
              >
                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                  dragging?.kfTime === kf.time && dragging.side === 'out'
                    ? 'bg-teal-300 border-teal-200'
                    : 'bg-teal-700 border-teal-400 hover:bg-teal-400'
                }`} />
              </div>

              {/* In-handle circle (top edge) */}
              <div
                className="absolute z-10 cursor-ew-resize select-none"
                style={{ left: `${(1 - inW) * 100}%`, top: 0, transform: 'translate(-50%, -50%)' }}
                onMouseDown={startDragIn}
                title={`Ease-in weight: ${(inW * 100).toFixed(0)}%`}
              >
                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                  dragging?.kfTime === nextKf.time && dragging.side === 'in'
                    ? 'bg-teal-300 border-teal-200'
                    : 'bg-teal-700 border-teal-400 hover:bg-teal-400'
                }`} />
              </div>
            </div>
          );
        })}

        {/* Vertical keyframe tick marks */}
        {keyframes.map(kf => {
          const pct = ((kf.time - viewWindow.start) / visibleDuration) * 100;
          if (pct < 0 || pct > 100) return null;
          return (
            <div
              key={`tick-${kf.time}`}
              className="absolute inset-y-0 w-px bg-teal-500/30 pointer-events-none"
              style={{ left: `${pct}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Track row ── */

function TrackRow({
  track, color, selectedKeyframe, onKeyframeSelect, onMoveKeyframe, onKeyframeContextMenu,
  snap, contentRef, playheadPosition, duration, viewWindow,
}: {
  track: { id: string; name: string; kfs: number[]; graph: boolean };
  color: keyof typeof COLOR;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onKeyframeContextMenu?: (trackId: string, time: number, x: number, y: number) => void;
  snap: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  playheadPosition: number;
  duration: number;
  viewWindow: ViewWindow;
}) {
  const c = COLOR[color];
  const [draggingKf, setDraggingKf] = useState<{ time: number; startX: number } | null>(null);
  const visibleDuration = viewWindow.end - viewWindow.start;

  const timeFromClientX = useCallback((clientX: number) => {
    if (!contentRef.current) return null;
    const rect = contentRef.current.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = clientX - rect.left - LABEL_W;
    const frac = x / rightW;
    const raw = viewWindow.start + frac * visibleDuration;
    const clamped = Math.max(0, Math.min(duration, raw));
    if (snap) return Math.round(clamped * 2) / 2;
    return clamped;
  }, [snap, contentRef, duration, viewWindow, visibleDuration]);

  useEffect(() => {
    if (!draggingKf) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newTime = timeFromClientX(e.clientX);
      if (newTime !== null && onMoveKeyframe) {
        onMoveKeyframe(track.id, draggingKf.time, newTime);
        setDraggingKf({ ...draggingKf, time: newTime });
      }
    };
    const handleMouseUp = () => setDraggingKf(null);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingKf, timeFromClientX, onMoveKeyframe, track.id]);

  return (
    <div className="flex border-b border-border/50" style={{ height: 26 }}>
      <div
        className="shrink-0 flex items-center pl-8 pr-2 border-r border-border bg-background gap-1.5"
        style={{ width: LABEL_W }}
      >
        <span className="text-[10px] text-muted-foreground flex-1 truncate">{track.name}</span>
        {track.graph && (
          <span className="text-[8px] text-muted-foreground/60 bg-muted border border-border rounded px-1">curve</span>
        )}
      </div>

      <div className={`flex-1 relative overflow-hidden ${c.trackBg}`}>
        {track.graph && <GraphCurve kfs={track.kfs} color={c.graphStroke} viewWindow={viewWindow} />}
        {track.kfs.map((t, idx) => {
          const leftPct = ((t - viewWindow.start) / visibleDuration) * 100;
          if (leftPct < -2 || leftPct > 102) return null;
          const selected = selectedKeyframe?.track === track.id && selectedKeyframe?.time === t;
          const onPlayhead = !selected && Math.abs(t - playheadPosition) < 0.1;
          return (
            <button
              key={`${track.id}-${t}-${idx}`}
              onMouseDown={e => {
                e.stopPropagation();
                if (track.id === 'camera-snapshots') {
                  setDraggingKf({ time: t, startX: e.clientX });
                }
                onKeyframeSelect(track.id, t);
              }}
              onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
                onKeyframeSelect(track.id, t);
                onKeyframeContextMenu?.(track.id, t, e.clientX, e.clientY);
              }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 hover:scale-150 transition-transform z-10 cursor-grab active:cursor-grabbing"
              style={{ left: `${leftPct}%` }}
            >
              <Diamond
                size={10}
                className={
                  selected
                    ? `${c.kf} drop-shadow-[0_0_8px_currentColor]`
                    : onPlayhead
                      ? 'text-blue-400 drop-shadow-[0_0_8px_currentColor]'
                      : 'text-foreground hover:text-foreground drop-shadow-md'
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
  group, expanded, onToggle, selectedKeyframe, onKeyframeSelect, cameraSnapshots,
  onMoveKeyframe, onSetHandle, onKeyframeContextMenu, snap, contentRef,
  playheadPosition, duration, viewWindow,
}: {
  group: typeof TRACK_GROUPS[number];
  expanded: boolean;
  onToggle: () => void;
  selectedKeyframe: { track: string; time: number } | null;
  onKeyframeSelect: (track: string, time: number) => void;
  cameraSnapshots: Array<{ time: number; position: any; target: any; outWeight?: number; inWeight?: number }>;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onSetHandle?: (time: number, side: 'out' | 'in', weight: number) => void;
  onKeyframeContextMenu?: (trackId: string, time: number, x: number, y: number) => void;
  snap: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  playheadPosition: number;
  duration: number;
  viewWindow: ViewWindow;
}) {
  const c = COLOR[group.color];

  return (
    <>
      <div className={`flex border-b border-border border-l-2 ${c.border}`} style={{ height: 30 }}>
        <div
          className="shrink-0 flex items-center gap-1.5 px-2 cursor-pointer hover:bg-muted/40 transition-colors border-r border-border"
          style={{ width: LABEL_W }}
          onClick={onToggle}
        >
          <ChevronRight
            size={12}
            className={`text-muted-foreground/60 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
          />
          <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
          <span className="text-[11px] font-medium text-foreground flex-1 truncate">{group.name}</span>
          <button className="opacity-0 hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <Eye size={11} className="text-muted-foreground/60 hover:text-muted-foreground" />
          </button>
          <button onClick={e => e.stopPropagation()}>
            <Lock size={11} className="text-muted-foreground/40 hover:text-muted-foreground/60" />
          </button>
        </div>
        <div className="flex-1 relative">
          <div className={`absolute inset-y-2 left-0 right-0 rounded-sm opacity-10 ${c.dot}`} />
        </div>
      </div>

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
            onKeyframeContextMenu={onKeyframeContextMenu}
            snap={snap}
            contentRef={contentRef}
            playheadPosition={playheadPosition}
            duration={duration}
            viewWindow={viewWindow}
          />
        );
      })}

      {expanded && group.id === 'camera' && onSetHandle && (
        <EasingTrackRow
          snapshots={cameraSnapshots}
          onSetHandle={onSetHandle}
          viewWindow={viewWindow}
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
  onSetHandle,
  onDeleteKeyframe,
  onDuplicateKeyframe,
  timecode = '00:00:00:00',
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: TimelineProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ camera: true, physics: true });
  const [zoom, setZoom] = useState(1);
  const [panStart, setPanStart] = useState(0);
  const [snap, setSnap] = useState(true);
  const [duration, setDuration] = useState(TIMELINE_DURATION);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; trackId: string; time: number } | null>(null);
  const [clipboard, setClipboard] = useState<{ trackId: string; time: number } | null>(null);

  useEffect(() => {
    const maxKfTime = cameraSnapshots.reduce((max, s) => Math.max(max, s.time), 0);
    if (maxKfTime > duration * 0.9) setDuration(d => d + 60);
  }, [cameraSnapshots, duration]);

  const contentRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const viewWindow = useMemo((): ViewWindow => {
    const visibleDuration = duration / zoom;
    const maxStart = Math.max(0, duration - visibleDuration);
    const start = Math.max(0, Math.min(maxStart, panStart));
    return { start, end: start + visibleDuration };
  }, [zoom, panStart, duration]);

  const posFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!contentRef.current) return null;
    const rect = contentRef.current.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = e.clientX - rect.left - LABEL_W;
    const frac = x / rightW;
    const raw = viewWindow.start + frac * (viewWindow.end - viewWindow.start);
    const clamped = Math.max(0, Math.min(duration, raw));
    if (snap) return Math.round(clamped * 2) / 2;
    return clamped;
  }, [snap, duration, viewWindow]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
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

  // Wheel: pinch-to-zoom (ctrl/meta + scroll) and trackpad pan (deltaX)
  const viewWindowRef = useRef(viewWindow);
  useEffect(() => { viewWindowRef.current = viewWindow; }, [viewWindow]);
  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      // Only intercept events over the track area (right of labels)
      if (e.clientX < rect.left + LABEL_W) return;

      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const vw = viewWindowRef.current;
        const z = zoomRef.current;
        const x = e.clientX - rect.left - LABEL_W;
        const rightW = rect.width - LABEL_W;
        const frac = Math.max(0, Math.min(1, x / rightW));
        const timeAtCursor = vw.start + frac * (vw.end - vw.start);

        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        const newZoom = Math.max(1, Math.min(50, z * factor));
        const newVisibleDuration = duration / newZoom;
        const newPanStart = Math.max(0, Math.min(duration - newVisibleDuration, timeAtCursor - frac * newVisibleDuration));

        setZoom(newZoom);
        setPanStart(newPanStart);
      } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.5 || Math.abs(e.deltaX) > 2) {
        // Horizontal scroll / trackpad swipe → pan
        e.preventDefault();
        const vw = viewWindowRef.current;
        const rightW = rect.width - LABEL_W;
        const visibleDuration = vw.end - vw.start;
        const secondsPerPixel = visibleDuration / rightW;
        const delta = e.deltaX * secondsPerPixel;
        setPanStart(prev => {
          const maxStart = Math.max(0, duration - visibleDuration);
          return Math.max(0, Math.min(maxStart, prev + delta));
        });
      }
      // Pure vertical scroll falls through to natural track scroll
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const isMod = e.metaKey || e.ctrlKey;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedKeyframe) {
        e.preventDefault();
        onDeleteKeyframe?.(selectedKeyframe.track, selectedKeyframe.time);
      } else if (isMod && e.key === 'c' && selectedKeyframe) {
        e.preventDefault();
        setClipboard({ trackId: selectedKeyframe.track, time: selectedKeyframe.time });
      } else if (isMod && e.key === 'x' && selectedKeyframe) {
        e.preventDefault();
        setClipboard({ trackId: selectedKeyframe.track, time: selectedKeyframe.time });
        onDeleteKeyframe?.(selectedKeyframe.track, selectedKeyframe.time);
      } else if (isMod && e.key === 'v' && clipboard) {
        e.preventDefault();
        onDuplicateKeyframe?.(clipboard.trackId, clipboard.time, playheadPosition);
      } else if (isMod && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        onUndo?.();
      } else if ((isMod && e.key === 'y') || (isMod && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        onRedo?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKeyframe, clipboard, playheadPosition, onDeleteKeyframe, onDuplicateKeyframe, onUndo, onRedo]);

  const stepFrame = (dir: number) =>
    onPlayheadChange(Math.max(0, Math.min(duration, playheadPosition + dir * (1 / 30))));

  const playheadRatio = (playheadPosition - viewWindow.start) / (viewWindow.end - viewWindow.start);
  const playheadInView = playheadRatio >= 0 && playheadRatio <= 1;
  const playheadLeft = `calc(${playheadRatio * 100}% + ${LABEL_W * (1 - playheadRatio)}px)`;

  const handleKeyframeContextMenu = useCallback((trackId: string, time: number, x: number, y: number) => {
    setContextMenu({ x, y, trackId, time });
  }, []);

  const copyKeyframe = useCallback(() => {
    if (contextMenu) setClipboard({ trackId: contextMenu.trackId, time: contextMenu.time });
  }, [contextMenu]);

  const cutKeyframe = useCallback(() => {
    if (!contextMenu) return;
    setClipboard({ trackId: contextMenu.trackId, time: contextMenu.time });
    onDeleteKeyframe?.(contextMenu.trackId, contextMenu.time);
  }, [contextMenu, onDeleteKeyframe]);

  const pasteKeyframe = useCallback(() => {
    if (clipboard) onDuplicateKeyframe?.(clipboard.trackId, clipboard.time, playheadPosition);
  }, [clipboard, playheadPosition, onDuplicateKeyframe]);

  const deleteKeyframe = useCallback(() => {
    if (contextMenu) onDeleteKeyframe?.(contextMenu.trackId, contextMenu.time);
  }, [contextMenu, onDeleteKeyframe]);

  const zoomIn = () => {
    setZoom(z => {
      const newZ = Math.min(50, z * 1.5);
      // Keep the center of the view fixed
      const mid = (viewWindow.start + viewWindow.end) / 2;
      const newVisible = duration / newZ;
      setPanStart(Math.max(0, Math.min(duration - newVisible, mid - newVisible / 2)));
      return newZ;
    });
  };

  const zoomOut = () => {
    setZoom(z => {
      const newZ = Math.max(1, z / 1.5);
      if (newZ === 1) { setPanStart(0); return newZ; }
      const mid = (viewWindow.start + viewWindow.end) / 2;
      const newVisible = duration / newZ;
      setPanStart(Math.max(0, Math.min(duration - newVisible, mid - newVisible / 2)));
      return newZ;
    });
  };

  return (
    <div className="flex flex-col bg-background border-t border-border shrink-0" style={{ height: 268 }}>

      {/* ── Toolbar ── */}
      <div className="h-14 bg-background border-b border-border flex items-center px-3 shrink-0 relative">

        {/* Left */}
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1 h-6 px-2 bg-muted hover:bg-muted/80 text-foreground text-[10px] rounded border border-border transition-colors">
            <Plus size={10} />Track
          </button>
          <button className="flex items-center gap-1 h-6 px-2 bg-muted hover:bg-muted/80 text-foreground text-[10px] rounded border border-border transition-colors">
            <Plus size={10} />Parameter
          </button>
          <button
            onClick={onCaptureSnapshot}
            className="flex items-center gap-1 h-6 px-2.5 bg-teal-600/80 hover:bg-teal-600 text-white rounded border border-teal-500/60 transition-colors text-[10px] font-medium shadow-sm"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0 L10 5 L5 10 L0 5 Z" />
            </svg>
            Keyframe
          </button>
          <TBtn onClick={onUndo} title="Undo (⌘Z)" disabled={!canUndo}>
            <Undo2 size={11} />
          </TBtn>
          <TBtn onClick={onRedo} title="Redo (⌘⇧Z)" disabled={!canRedo}>
            <Redo2 size={11} />
          </TBtn>
        </div>

        {/* Center: timecode + transport — absolutely centered */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-row items-center gap-3">
          <TCDisplay value={timecode} accent />
          <div className="flex items-center gap-0.5">
            <TBtn onClick={() => onPlayheadChange(0)} title="Go to start">
              <SkipBack size={11} />
            </TBtn>
            <TBtn onClick={() => stepFrame(-1)} title="Step back one frame">
              <ChevronLeft size={13} />
            </TBtn>
            <TBtn onClick={onStop} title="Stop">
              <Square size={9} fill="currentColor" />
            </TBtn>
            <button
              onClick={onPlayPause}
              title={isPlaying ? 'Pause' : 'Play (Space)'}
              className={`w-8 h-8 flex items-center justify-center rounded transition-all ${
                isPlaying
                  ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {isPlaying
                ? <Pause size={13} fill="currentColor" />
                : <Play size={13} fill="currentColor" className="ml-0.5" />
              }
            </button>
            <TBtn onClick={() => stepFrame(1)} title="Step forward one frame">
              <ChevronRight size={13} />
            </TBtn>
            <TBtn onClick={() => onPlayheadChange(duration)} title="Go to end">
              <SkipForward size={11} />
            </TBtn>
          </div>
        </div>

        {/* Right: zoom + snap */}
        <div className="ml-auto flex items-center gap-1">
          <TBtn onClick={zoomOut} title="Zoom out" disabled={zoom <= 1}>
            <ZoomOut size={12} />
          </TBtn>
          {zoom > 1.05 && (
            <button
              onClick={() => { setZoom(1); setPanStart(0); }}
              className="text-[9px] font-mono text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors min-w-[32px] text-center"
              title="Reset zoom"
            >
              {zoom >= 10 ? `${Math.round(zoom)}×` : `${zoom.toFixed(1)}×`}
            </button>
          )}
          <TBtn onClick={zoomIn} title="Zoom in" disabled={zoom >= 50}>
            <ZoomIn size={12} />
          </TBtn>
          <div className="w-px h-4 bg-border mx-0.5" />
          <button
            onClick={() => setSnap(s => !s)}
            title={snap ? 'Snap on (0.5s)' : 'Snap off'}
            className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
              snap
                ? 'border-border bg-muted text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            snap
          </button>
        </div>
      </div>

      {/* ── Content (ruler + tracks) ── */}
      <div className="flex-1 overflow-hidden flex flex-col relative" ref={contentRef}>

        {/* Ruler row */}
        <div className="flex shrink-0 border-b border-border" style={{ height: 24 }}>
          <div className="shrink-0 bg-background border-r border-border" style={{ width: LABEL_W }} />
          <div
            className="flex-1 relative bg-background cursor-col-resize overflow-hidden"
            onMouseDown={handleMouseDown}
          >
            <Ruler zoom={zoom} duration={duration} viewWindow={viewWindow} />
            {playheadInView && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none"
                style={{ left: `${playheadRatio * 100}%` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-red-500" />
                <div className="absolute top-1 bottom-0 left-1/2 -translate-x-1/2 w-px bg-red-500/60" />
              </div>
            )}
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
              onSetHandle={onSetHandle}
              onKeyframeContextMenu={handleKeyframeContextMenu}
              snap={snap}
              contentRef={contentRef}
              playheadPosition={playheadPosition}
              duration={duration}
              viewWindow={viewWindow}
            />
          ))}
          <div className="flex border-b border-border/30" style={{ height: 16 }}>
            <div className="shrink-0 border-r border-border" style={{ width: LABEL_W }} />
            <div className="flex-1" />
          </div>
        </div>

        {/* Full-height playhead overlay */}
        {playheadInView && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-20"
            style={{ left: playheadLeft }}
          >
            <div className="absolute top-0 bottom-0 w-px bg-red-500/70" />
          </div>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          hasClipboard={!!clipboard}
          onCopy={copyKeyframe}
          onCut={cutKeyframe}
          onPaste={pasteKeyframe}
          onDelete={deleteKeyframe}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
