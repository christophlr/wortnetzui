import { createPortal } from 'react-dom';
import { Eye, Lock, ChevronRight, Diamond, Play, Pause, Square, SkipBack, SkipForward, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut, Magnet } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TIMELINE_DURATION } from '../constants';
import { segmentBezierPath, computeAutoWeights } from '../easing';

/* ── Types & constants ── */

type PhysicsKeyframe = { time: number; value: number; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };

type SceneMarker = { time: number; label: string };

interface TimelineProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  playheadPosition: number;
  onPlayheadChange: (pos: number) => void;
  selectedKeyframes: { track: string; time: number }[];
  onKeyframeSelect: (track: string, time: number, additive: boolean) => void;
  onSelectKeyframes?: (kfs: { track: string; time: number }[]) => void;
  cameraKeyframes?: Array<{ time: number; position: any; target: any; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' }>;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  onCaptureKeyframe?: () => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onSetHandle?: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'auto' | 'manual') => void;
  onDeleteKeyframe?: (trackId: string, time: number) => void;
  onDuplicateKeyframe?: (trackId: string, srcTime: number, destTime: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  timecode?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  height?: number;
  sceneMarkers?: SceneMarker[];
  onAddSceneMarker?: (time: number) => void;
  onMoveSceneMarker?: (oldTime: number, newTime: number) => void;
  onDeleteSceneMarker?: (time: number) => void;
  onRenameSceneMarker?: (time: number, label: string) => void;
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
      { id: 'camera-keyframes', name: 'Keyframes', kfs: [], graph: false },
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
      className={`w-7 h-7 flex items-center justify-center rounded-md border transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 ${
        disabled
          ? 'border-transparent opacity-30 cursor-not-allowed text-muted-foreground/40'
          : active
            ? 'border-border bg-accent text-accent-foreground shadow-sm'
            : 'border-transparent bg-background text-foreground/60 hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Timecode display ── */

function TCDisplay({ value, accent = false }: { value: string; accent?: boolean }) {
  return (
    <span className={`text-[11px] tabular-nums tracking-wide ${
      accent ? 'text-foreground font-medium' : 'text-muted-foreground'
    }`}>
      {value}
    </span>
  );
}

/* ── Ruler ── */

function Ruler({ zoom, duration, viewWindow }: { zoom: number; duration: number; viewWindow: ViewWindow }) {
  const visibleDuration = viewWindow.end - viewWindow.start;
  const majorStep =
    zoom >= 100 ? 0.1  :
    zoom >= 50  ? 0.25 :
    zoom >= 20  ? 0.5  :
    zoom >= 10  ? 1    :
    zoom >= 5   ? 2    :
    zoom >= 2   ? 5    :
    visibleDuration > 60 ? 10 : 5;
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
              {t >= 60
                ? `${Math.floor(t / 60)}m${t % 60 > 0 ? `${(t % 60).toFixed(t % 1 !== 0 ? 2 : 0)}s` : ''}`
                : t % 1 !== 0 ? `${t.toFixed(2)}s` : `${t}s`}
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
  x, y, mode, hasClipboard, hasItem, onCopy, onCut, onPaste, onDelete, onCreateSceneMarker, onClose,
}: {
  x: number;
  y: number;
  mode: 'keyframe' | 'scene-marker' | 'background';
  hasClipboard: boolean;
  hasItem: boolean;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onCreateSceneMarker: () => void;
  onClose: () => void;
}) {
  const menuW = 196;
  const menuH = mode === 'background' ? 68 : 136;
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
      className={`w-full flex items-center justify-between px-3 py-[5px] text-[11px] rounded transition-[color,background-color,box-shadow] ${
        disabled
          ? 'text-muted-foreground/35 cursor-not-allowed'
          : danger
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer'
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
        className="fixed z-50 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl py-1 overflow-hidden text-popover-foreground"
        style={{ left, top, width: menuW }}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        {mode === 'background' ? (
          <>
            <Item label="Add Scene Marker" shortcut="" action={onCreateSceneMarker} />
            <div className="border-t border-border/60 my-1 mx-2" />
            <Item label="Paste at Playhead" shortcut="⌘V" action={onPaste} disabled={!hasClipboard} />
          </>
        ) : (
          <>
            <Item label="Copy" shortcut="⌘C" action={onCopy} disabled={!hasItem} />
            <Item label="Cut" shortcut="⌘X" action={onCut} disabled={!hasItem} />
            <Item label="Paste at Playhead" shortcut="⌘V" action={onPaste} disabled={!hasClipboard} />
            <div className="border-t border-border/60 my-1 mx-2" />
            <Item label="Delete" shortcut="⌫" action={onDelete} danger disabled={!hasItem} />
          </>
        )}
      </div>
    </>,
    document.body
  );
}

/* ── Easing track row — bezier curve editor ── */

const EASING_H = 56;

const EASING_PRESETS_GRID = [
  { label: 'Linear',     outW: 0,    inW: 0,    color: '#9ca3af' },
  { label: 'Ease Out',   outW: 0.42, inW: 0,    color: '#a78bfa' },
  { label: 'Ease In',    outW: 0,    inW: 0.42, color: '#60a5fa' },
  { label: 'Smooth',     outW: 0.33, inW: 0.33, color: '#22d3ee' },
  { label: 'Strong Out', outW: 0.5,  inW: 0,    color: '#34d399' },
  { label: 'Strong In',  outW: 0,    inW: 0.5,  color: '#fbbf24' },
  { label: 'Heavy',      outW: 0.5,  inW: 0.5,  color: '#fb923c' },
  { label: 'Auto',       outW: -1,   inW: -1,   color: '#2dd4bf' },
] as const;

function EasingPicker({
  anchorX, anchorY, trackId, kfTime, nextKfTime,
  currentOutW, currentInW, isAuto,
  onSetHandle, onSetInterpolation, onClose,
}: {
  anchorX: number; anchorY: number;
  trackId: string;
  kfTime: number; nextKfTime: number;
  currentOutW: number; currentInW: number; isAuto: boolean;
  onSetHandle: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'auto' | 'manual') => void;
  onClose: () => void;
}) {
  const pickerW = 268;
  const left = Math.max(8, Math.min(window.innerWidth - pickerW - 8, anchorX - pickerW / 2));
  const bottom = window.innerHeight - anchorY + 10;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={e => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-50 bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-2.5 shadow-2xl text-popover-foreground"
        style={{ left, bottom }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-0.5">
          Easing preset
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {EASING_PRESETS_GRID.map(preset => {
            const isActive = preset.label === 'Auto'
              ? isAuto
              : !isAuto && Math.abs(currentOutW - preset.outW) < 0.01 && Math.abs(currentInW - preset.inW) < 0.01;
            const curvePath = preset.label === 'Auto'
              ? segmentBezierPath(0.33, 0.33, 42, 26)
              : segmentBezierPath(preset.outW, preset.inW, 42, 26);
            return (
              <button
                key={preset.label}
                onClick={() => {
                  if (preset.label === 'Auto') {
                    onSetInterpolation?.(trackId, kfTime, 'auto');
                    onSetInterpolation?.(trackId, nextKfTime, 'auto');
                  } else {
                    onSetHandle(trackId, kfTime, 'out', preset.outW);
                    onSetHandle(trackId, nextKfTime, 'in', preset.inW);
                    onSetInterpolation?.(trackId, kfTime, 'manual');
                    onSetInterpolation?.(trackId, nextKfTime, 'manual');
                  }
                  onClose();
                }}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-[color,background-color,box-shadow,transform] ${
                  isActive
                    ? 'border-border bg-accent text-accent-foreground shadow-sm'
                    : 'border-transparent bg-background hover:border-border hover:bg-accent/60 hover:text-accent-foreground'
                }`}
                title={preset.label}
              >
                <svg width="42" height="26" viewBox={`0 0 42 26`} className="overflow-visible">
                  <path
                    d={curvePath}
                    fill="none"
                    stroke={preset.color}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {preset.label === 'Auto' && (
                    <text x="21" y="13" textAnchor="middle" dominantBaseline="middle" fontSize="7" fill={preset.color} fontFamily="monospace" opacity="0.8">auto</text>
                  )}
                </svg>
                <span className="text-[9px] text-muted-foreground leading-none whitespace-nowrap">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );
}

function EasingTrackRow({
  trackId, keyframeData, onSetHandle, onSetInterpolation, onDragStart, onDragEnd, viewWindow,
}: {
  trackId: string;
  keyframeData: Array<{ time: number; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' }>;
  onSetHandle: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'auto' | 'manual') => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  viewWindow: ViewWindow;
}) {
  const visibleDuration = viewWindow.end - viewWindow.start;
  const trackRef = useRef<HTMLDivElement>(null);

  const keyframes = useMemo(() => [...keyframeData].sort((a, b) => a.time - b.time), [keyframeData]);

  const [dragging, setDragging] = useState<{
    kfTime: number;
    side: 'out' | 'in';
    segLeft: number;
    segWidth: number;
  } | null>(null);

  const [picker, setPicker] = useState<{
    anchorX: number; anchorY: number; kfTime: number; nextKfTime: number;
  } | null>(null);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const { kfTime, side, segLeft, segWidth } = dragging;
      const frac = (e.clientX - segLeft) / segWidth;
      const weight = side === 'out'
        ? Math.max(0, Math.min(1, frac))
        : Math.max(0, Math.min(1, 1 - frac));
      onSetHandle(trackId, kfTime, side, weight);
    };
    const onUp = () => {
      onDragEnd?.();
      setDragging(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, trackId, onSetHandle, onDragEnd]);

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
        <span className="text-[9px] text-muted-foreground/40 hidden sm:block">click curve</span>
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

          const isAuto = kf.interpolation === 'auto' || nextKf.interpolation === 'auto';
          const segDur = nextKf.time - kf.time;
          const prevKf = i > 0 ? keyframes[i - 1] : null;
          const nextNextKf = i + 2 < keyframes.length ? keyframes[i + 2] : null;
          const autoW = isAuto
            ? computeAutoWeights(segDur, prevKf ? kf.time - prevKf.time : null, nextNextKf ? nextNextKf.time - nextKf.time : null)
            : null;
          const outW = autoW ? autoW.outWeight : (kf.outWeight ?? 0);
          const inW  = autoW ? autoW.inWeight  : (nextKf.inWeight ?? 0);
          const curvePath = segmentBezierPath(outW, inW, 100, EASING_H);

          const getSegRect = () => {
            if (!trackRef.current) return { segLeft: 0, segWidth: 1 };
            const trackRect = trackRef.current.getBoundingClientRect();
            return {
              segLeft: trackRect.left + (leftPct / 100) * trackRect.width,
              segWidth: (widthPct / 100) * trackRect.width,
            };
          };

          const startDragOut = (e: React.MouseEvent) => {
            if (isAuto) return;
            e.preventDefault();
            e.stopPropagation();
            onDragStart?.();
            const { segLeft, segWidth } = getSegRect();
            setDragging({ kfTime: kf.time, side: 'out', segLeft, segWidth });
          };
          const startDragIn = (e: React.MouseEvent) => {
            if (isAuto) return;
            e.preventDefault();
            e.stopPropagation();
            onDragStart?.();
            const { segLeft, segWidth } = getSegRect();
            setDragging({ kfTime: nextKf.time, side: 'in', segLeft, segWidth });
          };

          const openPicker = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setPicker({ anchorX: rect.left + rect.width / 2, anchorY: rect.top, kfTime: kf.time, nextKfTime: nextKf.time });
          };

          return (
            <div
              key={`seg-${kf.time}-${nextKf.time}`}
              className="absolute inset-y-0 overflow-visible"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            >
              {/* Bezier curve + click-to-open-picker hit area */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 100 ${EASING_H}`}
                preserveAspectRatio="none"
                style={{ cursor: 'pointer' }}
                onClick={openPicker}
              >
                {/* Transparent hit area */}
                <path d={`${curvePath} L 100 ${EASING_H} L 0 ${EASING_H} Z`} fill="transparent" stroke="none" />
                {/* Fill */}
                <path
                  d={`${curvePath} L 100 ${EASING_H} L 0 ${EASING_H} Z`}
                  fill="#2dd4bf"
                  fillOpacity={isAuto ? 0.05 : 0.08}
                  style={{ pointerEvents: 'none' }}
                />
                {/* Curve — dashed when auto */}
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  strokeOpacity={isAuto ? 0.5 : 0.75}
                  strokeDasharray={isAuto ? '4 3' : undefined}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  style={{ pointerEvents: 'none' }}
                />
                {/* Handle arms — hidden in auto mode */}
                {!isAuto && outW > 0.01 && (
                  <line x1="0" y1={EASING_H} x2={outW * 100} y2={EASING_H}
                    stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.4"
                    vectorEffect="non-scaling-stroke" style={{ pointerEvents: 'none' }}
                  />
                )}
                {!isAuto && inW > 0.01 && (
                  <line x1="100" y1="0" x2={(1 - inW) * 100} y2="0"
                    stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.4"
                    vectorEffect="non-scaling-stroke" style={{ pointerEvents: 'none' }}
                  />
                )}
              </svg>

              {/* Out-handle circle — hidden in auto mode */}
              {!isAuto && (
                <div
                  className="absolute z-10 cursor-ew-resize select-none"
                  style={{ left: `${outW * 100}%`, bottom: 0, transform: 'translate(-50%, 50%)' }}
                  onMouseDown={startDragOut}
                  title={`Ease-out: ${(outW * 100).toFixed(0)}% — drag to adjust, click curve for presets`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    dragging?.kfTime === kf.time && dragging.side === 'out'
                      ? 'bg-teal-300 border-teal-200 scale-125'
                      : 'bg-teal-600 border-teal-400 hover:bg-teal-400 hover:scale-125'
                  }`} />
                </div>
              )}

              {/* In-handle circle — hidden in auto mode */}
              {!isAuto && (
                <div
                  className="absolute z-10 cursor-ew-resize select-none"
                  style={{ left: `${(1 - inW) * 100}%`, top: 0, transform: 'translate(-50%, -50%)' }}
                  onMouseDown={startDragIn}
                  title={`Ease-in: ${(inW * 100).toFixed(0)}% — drag to adjust, click curve for presets`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    dragging?.kfTime === nextKf.time && dragging.side === 'in'
                      ? 'bg-teal-300 border-teal-200 scale-125'
                      : 'bg-teal-600 border-teal-400 hover:bg-teal-400 hover:scale-125'
                  }`} />
                </div>
              )}
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

      {picker && (() => {
        const kf = keyframes.find(k => k.time === picker.kfTime);
        const nextKf = keyframes.find(k => k.time === picker.nextKfTime);
        const isAuto = kf?.interpolation === 'auto' || nextKf?.interpolation === 'auto';
        return (
          <EasingPicker
            anchorX={picker.anchorX}
            anchorY={picker.anchorY}
            trackId={trackId}
            kfTime={picker.kfTime}
            nextKfTime={picker.nextKfTime}
            currentOutW={kf?.outWeight ?? 0}
            currentInW={nextKf?.inWeight ?? 0}
            isAuto={isAuto ?? false}
            onSetHandle={onSetHandle}
            onSetInterpolation={onSetInterpolation}
            onClose={() => setPicker(null)}
          />
        );
      })()}
    </div>
  );
}

/* ── Track row ── */

function TrackRow({
  track, color, selectedKeyframes, onKeyframeSelect, onMoveKeyframe, onKeyframeContextMenu, collapsed = false, onToggleCollapsed,
  onDragStart, onDragEnd,
  snap, contentRef, playheadPosition, duration, viewWindow,
}: {
  track: { id: string; name: string; kfs: number[]; graph: boolean };
  color: keyof typeof COLOR;
  selectedKeyframes: { track: string; time: number }[];
  onKeyframeSelect: (track: string, time: number, additive: boolean) => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onKeyframeContextMenu?: (trackId: string, time: number, x: number, y: number) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
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
    const handleMouseUp = () => {
      onDragEnd?.();
      setDraggingKf(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingKf, timeFromClientX, onMoveKeyframe, onDragEnd, track.id]);

  return (
    <div className="flex border-b border-border/50" style={{ height: 26 }}>
      <div
        className="shrink-0 flex items-center pl-8 pr-2 border-r border-border bg-background gap-1.5"
        style={{ width: LABEL_W }}
      >
        {onToggleCollapsed ? (
          <button
            type="button"
            aria-label={collapsed ? `Expand ${track.name} track` : `Collapse ${track.name} track`}
            onClick={onToggleCollapsed}
            className="shrink-0 rounded p-0.5 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:bg-accent"
          >
            <ChevronRight size={10} className={`transition-transform duration-150 ${collapsed ? '' : 'rotate-90'}`} />
          </button>
        ) : (
          <div className="w-[14px]" />
        )}
        <span className="text-[10px] text-muted-foreground flex-1 truncate">{track.name}</span>
        {track.graph && (
          <span className="text-[8px] text-muted-foreground/60 bg-muted border border-border rounded px-1">curve</span>
        )}
      </div>

      {!collapsed && (
        <div className={`flex-1 relative overflow-hidden ${c.trackBg}`}>
          {track.graph && <GraphCurve kfs={track.kfs} color={c.graphStroke} viewWindow={viewWindow} />}
          {track.kfs.map((t, idx) => {
            const leftPct = ((t - viewWindow.start) / visibleDuration) * 100;
            if (leftPct < -2 || leftPct > 102) return null;
            const selected = selectedKeyframes.some(s => s.track === track.id && Math.abs(s.time - t) < 0.01);
            const onPlayhead = !selected && selectedKeyframes.length === 0 && Math.abs(t - playheadPosition) < 0.1;
            return (
              <button
                key={`${track.id}-${t}-${idx}`}
                data-keyframe="true"
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDragStart?.();
                  setDraggingKf({ time: t, startX: e.clientX });
                  onKeyframeSelect(track.id, t, e.shiftKey || e.metaKey || e.ctrlKey);
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onKeyframeSelect(track.id, t, false);
                  onKeyframeContextMenu?.(track.id, t, e.clientX, e.clientY);
                }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center hover:scale-150 transition-transform z-10 cursor-grab active:cursor-grabbing"
                style={{ left: `${leftPct}%` }}
              >
                {selected && (
                  <Diamond
                    size={16}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                )}
                <Diamond
                  size={10}
                  className={
                    selected
                      ? c.kf
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
      )}
    </div>
  );
}

/* ── Scene marker lane ── */

function SceneMarkerLane({
  markers, contentRef, viewWindow, duration, snap,
  onAdd, onMove, onSceneMarkerContextMenu, onSelectSceneMarker,
  onDragStart, onDragEnd, selectedMarkerTimes = [], activeMarkerTime,
}: {
  markers: SceneMarker[];
  contentRef: React.RefObject<HTMLDivElement | null>;
  viewWindow: ViewWindow;
  duration: number;
  snap: boolean;
  onAdd?: (time: number) => void;
  onMove: (oldTime: number, newTime: number) => void;
  onSceneMarkerContextMenu: (time: number, x: number, y: number) => void;
  onSelectSceneMarker?: (time: number, additive: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  selectedMarkerTimes?: number[];
  activeMarkerTime?: number | null;
}) {
  const [draggingMarker, setDraggingMarker] = useState<{ time: number } | null>(null);
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
    if (!draggingMarker) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newTime = timeFromClientX(e.clientX);
      if (newTime !== null) {
        onMove(draggingMarker.time, newTime);
        setDraggingMarker({ time: newTime });
      }
    };
    const handleMouseUp = () => {
      onDragEnd?.();
      setDraggingMarker(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingMarker, timeFromClientX, onMove, onDragEnd]);

  return (
    <div className="flex border-b border-purple-500/20 shrink-0 sticky top-0 z-20 bg-background" style={{ height: 28 }}>
      <div
        className="shrink-0 flex items-center pl-3 pr-2 border-r border-border bg-background"
        style={{ width: LABEL_W }}
      >
        <span className="text-[9px] font-semibold text-purple-400/70 uppercase tracking-widest">Scene Markers</span>
      </div>
      <div
        className="flex-1 relative bg-purple-950/10 overflow-visible"
        onDoubleClick={e => {
          const target = e.target as Element;
          if (target.closest('[data-scene-marker]')) return;
          const time = timeFromClientX(e.clientX);
          if (time !== null) onAdd?.(time);
        }}
      >
        {markers.map(marker => {
          const pct = ((marker.time - viewWindow.start) / visibleDuration) * 100;
          if (pct < -3 || pct > 103) return null;
          const isActive = activeMarkerTime === marker.time;
          const isSelected = selectedMarkerTimes.includes(marker.time);
          return (
            <div
              key={`sm-${marker.time}`}
              data-scene-marker="true"
              className="absolute top-0 z-10 flex flex-col items-center"
              style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className="absolute w-px bg-purple-400/20 pointer-events-none"
                style={{ top: 0, height: '999px' }}
              />
              <button
                data-scene-marker="true"
                className="relative cursor-grab active:cursor-grabbing group focus-visible:outline-none w-4 h-4 flex items-center justify-center"
                onMouseDown={e => {
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  onSelectSceneMarker?.(marker.time, e.shiftKey || e.metaKey || e.ctrlKey);
                  onDragStart?.();
                  setDraggingMarker({ time: marker.time });
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSceneMarkerContextMenu(marker.time, e.clientX, e.clientY);
                }}
                title="Drag to move — right-click for options"
              >
                <svg viewBox="0 0 16 18" className="w-4 h-4 drop-shadow-sm group-hover:scale-110 transition-transform">
                  {(isSelected || isActive) && (
                    <path d="M 1 1 L 15 1 L 15 11 L 8 18 L 1 11 Z" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinejoin="round" strokeOpacity="1" />
                  )}
                  <path d="M 1 1 L 15 1 L 15 11 L 8 18 L 1 11 Z" fill="#a855f7" fillOpacity="0.8" stroke="#c084fc" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Track group ── */

function TrackGroup({
  group, expanded, onToggle, collapsedTracks, onToggleTrackCollapsed,
  selectedKeyframes, onKeyframeSelect, cameraKeyframes, physicsKeyframes,
  onMoveKeyframe, onSetHandle, onSetInterpolation, onKeyframeContextMenu, onDragStart, onDragEnd,
  snap, contentRef, playheadPosition, duration, viewWindow,
}: {
  group: typeof TRACK_GROUPS[number];
  expanded: boolean;
  onToggle: () => void;
  collapsedTracks: Record<string, boolean>;
  onToggleTrackCollapsed: (trackId: string) => void;
  selectedKeyframes: { track: string; time: number }[];
  onKeyframeSelect: (track: string, time: number, additive: boolean) => void;
  cameraKeyframes: Array<{ time: number; position: any; target: any; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' }>;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onSetHandle?: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'auto' | 'manual') => void;
  onKeyframeContextMenu?: (trackId: string, time: number, x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
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
          className="shrink-0 flex items-center gap-1.5 px-2 cursor-pointer hover:bg-accent/60 transition-[color,background-color,box-shadow] border-r border-border"
          style={{ width: LABEL_W }}
          onClick={onToggle}
        >
          <ChevronRight
            size={12}
            className={`text-muted-foreground/60 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
          />
          <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
          <span className="text-[11px] font-medium text-foreground flex-1 truncate">{group.name}</span>
          <button className="opacity-0 hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none" onClick={e => e.stopPropagation()}>
            <Eye size={11} className="text-muted-foreground/60 hover:text-muted-foreground" />
          </button>
          <button className="rounded p-0.5 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none" onClick={e => e.stopPropagation()}>
            <Lock size={11} className="text-muted-foreground/40 hover:text-muted-foreground/60" />
          </button>
        </div>
        <div className="flex-1 relative">
          <div className={`absolute inset-y-2 left-0 right-0 rounded-sm opacity-10 ${c.dot}`} />
        </div>
      </div>

      {expanded && group.tracks.map(track => {
        const isPhysics = group.id === 'physics';
        const dynamicKfs = track.id === 'camera-keyframes'
          ? cameraKeyframes.map(s => s.time)
          : isPhysics
            ? (physicsKeyframes?.[track.id] ?? []).map(k => k.time)
            : track.kfs;
        const easingData = track.id === 'camera-keyframes'
          ? cameraKeyframes
          : isPhysics
            ? (physicsKeyframes?.[track.id] ?? [])
            : [];
        const trackCollapsed = !!collapsedTracks[track.id];
        return (
          <div key={track.id}>
            <TrackRow
              track={{ ...track, kfs: dynamicKfs }}
              color={group.color}
              selectedKeyframes={selectedKeyframes}
              onKeyframeSelect={onKeyframeSelect}
              onMoveKeyframe={onMoveKeyframe}
              onKeyframeContextMenu={onKeyframeContextMenu}
              collapsed={trackCollapsed}
              onToggleCollapsed={() => onToggleTrackCollapsed(track.id)}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              snap={snap}
              contentRef={contentRef}
              playheadPosition={playheadPosition}
              duration={duration}
              viewWindow={viewWindow}
            />
            {onSetHandle && !trackCollapsed && (
              <EasingTrackRow
                trackId={track.id}
                keyframeData={easingData}
                onSetHandle={onSetHandle}
                onSetInterpolation={onSetInterpolation}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                viewWindow={viewWindow}
              />
            )}
          </div>
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
  selectedKeyframes,
  onKeyframeSelect,
  onSelectKeyframes,
  cameraKeyframes = [],
  physicsKeyframes,
  onCaptureKeyframe,
  onMoveKeyframe,
  onSetHandle,
  onSetInterpolation,
  onDeleteKeyframe,
  onDuplicateKeyframe,
  onDragStart,
  onDragEnd,
  timecode = '00:00:00:00',
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  height = 268,
  sceneMarkers = [],
  onAddSceneMarker,
  onMoveSceneMarker,
  onDeleteSceneMarker,
  onRenameSceneMarker,
}: TimelineProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ camera: true, physics: true });
  const [collapsedTracks, setCollapsedTracks] = useState<Record<string, boolean>>({});
  const [selectedSceneMarkers, setSelectedSceneMarkers] = useState<number[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panStart, setPanStart] = useState(0);
  const [snap, setSnap] = useState(true);
  const [duration, setDuration] = useState(TIMELINE_DURATION);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; kind: 'keyframe' | 'scene-marker' | 'background'; trackId?: string; time: number } | null>(null);
  const [clipboard, setClipboard] = useState<{ kind: 'keyframe'; trackId: string; time: number } | { kind: 'scene-marker'; label: string } | null>(null);
  const [dragSelect, setDragSelect] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const dragSelectActiveRef = useRef(false);

  useEffect(() => {
    let maxKfTime = cameraKeyframes.reduce((max, s) => Math.max(max, s.time), 0);
    if (physicsKeyframes) {
      for (const kfs of Object.values(physicsKeyframes)) {
        for (const k of kfs) maxKfTime = Math.max(maxKfTime, k.time);
      }
    }
    if (maxKfTime > duration * 0.9) setDuration(d => d + 60);
  }, [cameraKeyframes, physicsKeyframes, duration]);

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
    e.preventDefault();
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
        const newZoom = Math.max(1, Math.min(200, z * factor));
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

  // Drag-select rectangle
  useEffect(() => {
    if (!dragSelect) return;
    const handleMouseMove = (e: MouseEvent) => {
      setDragSelect(prev => prev ? { ...prev, endX: e.clientX, endY: e.clientY } : null);
    };
    const handleMouseUp = (e: MouseEvent) => {
      dragSelectActiveRef.current = false;
      if (!dragSelect) { setDragSelect(null); return; }
      const rect = contentRef.current?.getBoundingClientRect();
      if (rect && onSelectKeyframes) {
        const minX = Math.min(dragSelect.startX, e.clientX);
        const maxX = Math.max(dragSelect.startX, e.clientX);
        const minY = Math.min(dragSelect.startY, e.clientY);
        const maxY = Math.max(dragSelect.startY, e.clientY);
        if (maxX - minX > 5 || maxY - minY > 5) {
          const rightW = rect.width - LABEL_W;
          const visibleDur = viewWindow.end - viewWindow.start;
          const hits: { track: string; time: number }[] = [];
          const trackAreaLeft = rect.left + LABEL_W;
          const checkTime = (t: number) => {
            const kfX = trackAreaLeft + ((t - viewWindow.start) / visibleDur) * rightW;
            return kfX >= minX && kfX <= maxX;
          };
          for (const kf of cameraKeyframes) {
            if (checkTime(kf.time)) hits.push({ track: 'camera-keyframes', time: kf.time });
          }
          if (physicsKeyframes) {
            for (const [trackId, kfs] of Object.entries(physicsKeyframes)) {
              for (const kf of kfs) {
                if (checkTime(kf.time)) hits.push({ track: trackId, time: kf.time });
              }
            }
          }
          onSelectKeyframes(hits);
        }
      }
      setDragSelect(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragSelect, contentRef, cameraKeyframes, physicsKeyframes, viewWindow, onSelectKeyframes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const isMod = e.metaKey || e.ctrlKey;
      const primarySel = selectedKeyframes[0];

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedKeyframes.length > 0) {
        e.preventDefault();
        for (const sel of selectedKeyframes) {
          onDeleteKeyframe?.(sel.track, sel.time);
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSceneMarkers.length > 0) {
        e.preventDefault();
        for (const t of selectedSceneMarkers) onDeleteSceneMarker?.(t);
        setSelectedSceneMarkers([]);
      } else if (isMod && e.key === 'c' && primarySel) {
        e.preventDefault();
        setClipboard({ kind: 'keyframe', trackId: primarySel.track, time: primarySel.time });
      } else if (isMod && e.key === 'x' && primarySel) {
        e.preventDefault();
        setClipboard({ kind: 'keyframe', trackId: primarySel.track, time: primarySel.time });
        for (const sel of selectedKeyframes) {
          onDeleteKeyframe?.(sel.track, sel.time);
        }
      } else if (isMod && e.key === 'v' && clipboard) {
        e.preventDefault();
        if (clipboard.kind === 'keyframe') onDuplicateKeyframe?.(clipboard.trackId, clipboard.time, playheadPosition);
        else if (clipboard.kind === 'scene-marker') onAddSceneMarker?.(playheadPosition);
      } else if (isMod && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        onUndo?.();
      } else if ((isMod && e.key === 'y') || (isMod && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        onRedo?.();
      } else if (e.key === 'Escape') {
        setSelectedSceneMarkers([]);
        onSelectKeyframes?.([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKeyframes, selectedSceneMarkers, clipboard, playheadPosition, onDeleteKeyframe, onDeleteSceneMarker, onDuplicateKeyframe, onUndo, onRedo]);

  const stepFrame = (dir: number) =>
    onPlayheadChange(Math.max(0, Math.min(duration, playheadPosition + dir * (1 / 30))));

  const playheadRatio = (playheadPosition - viewWindow.start) / (viewWindow.end - viewWindow.start);
  const playheadInView = playheadRatio >= 0 && playheadRatio <= 1;
  const playheadLeft = `calc(${playheadRatio * 100}% + ${LABEL_W * (1 - playheadRatio)}px)`;

  const handleKeyframeContextMenu = useCallback((trackId: string, time: number, x: number, y: number) => {
    setContextMenu({ x, y, kind: 'keyframe', trackId, time });
  }, []);

  const handleSceneMarkerContextMenu = useCallback((time: number, x: number, y: number) => {
    setSelectedSceneMarkers([time]);
    setContextMenu({ x, y, kind: 'scene-marker', time });
  }, []);

  const copyAction = useCallback(() => {
    if (!contextMenu) return;
    if (contextMenu.kind === 'keyframe' && contextMenu.trackId) {
      setClipboard({ kind: 'keyframe', trackId: contextMenu.trackId, time: contextMenu.time });
    } else if (contextMenu.kind === 'scene-marker') {
      const marker = sceneMarkers.find(m => Math.abs(m.time - contextMenu.time) < 0.01);
      setClipboard({ kind: 'scene-marker', label: marker?.label ?? '' });
    }
  }, [contextMenu, sceneMarkers]);

  const cutAction = useCallback(() => {
    if (!contextMenu) return;
    if (contextMenu.kind === 'keyframe' && contextMenu.trackId) {
      setClipboard({ kind: 'keyframe', trackId: contextMenu.trackId, time: contextMenu.time });
      onDeleteKeyframe?.(contextMenu.trackId, contextMenu.time);
    } else if (contextMenu.kind === 'scene-marker') {
      const marker = sceneMarkers.find(m => Math.abs(m.time - contextMenu.time) < 0.01);
      setClipboard({ kind: 'scene-marker', label: marker?.label ?? '' });
      onDeleteSceneMarker?.(contextMenu.time);
    }
  }, [contextMenu, sceneMarkers, onDeleteKeyframe, onDeleteSceneMarker]);

  const pasteAction = useCallback(() => {
    if (!clipboard) return;
    if (clipboard.kind === 'keyframe') onDuplicateKeyframe?.(clipboard.trackId, clipboard.time, playheadPosition);
    else if (clipboard.kind === 'scene-marker') onAddSceneMarker?.(playheadPosition);
  }, [clipboard, playheadPosition, onDuplicateKeyframe, onAddSceneMarker]);

  const deleteAction = useCallback(() => {
    if (!contextMenu) return;
    if (contextMenu.kind === 'keyframe' && contextMenu.trackId) onDeleteKeyframe?.(contextMenu.trackId, contextMenu.time);
    else if (contextMenu.kind === 'scene-marker') onDeleteSceneMarker?.(contextMenu.time);
  }, [contextMenu, onDeleteKeyframe, onDeleteSceneMarker]);

  const createSceneMarkerAction = useCallback(() => {
    if (contextMenu) onAddSceneMarker?.(contextMenu.time);
  }, [contextMenu, onAddSceneMarker]);

  const zoomIn = () => {
    setZoom(z => {
      const newZ = Math.min(200, z * 1.5);
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

  const hasKfAtPlayhead = useMemo(() => {
    const t = playheadPosition;
    if (cameraKeyframes.some(k => Math.abs(k.time - t) < 0.1)) return true;
    if (physicsKeyframes) {
      for (const kfs of Object.values(physicsKeyframes)) {
        if (kfs.some(k => Math.abs(k.time - t) < 0.1)) return true;
      }
    }
    return false;
  }, [playheadPosition, cameraKeyframes, physicsKeyframes]);

  const selCount = selectedKeyframes.length;

  const toggleTrackCollapsed = useCallback((trackId: string) => {
    setCollapsedTracks(prev => ({ ...prev, [trackId]: !prev[trackId] }));
  }, []);

  return (
    <div className="flex flex-col bg-background border-t border-border shrink-0" style={{ height }}>

      {/* ── Toolbar ── */}
      <div className="h-14 bg-background border-b border-border flex items-center px-3 shrink-0 relative">

        {/* Left */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onCaptureKeyframe}
            title={hasKfAtPlayhead ? 'Update keyframe at playhead' : 'Capture new keyframe at playhead'}
            className={`flex items-center gap-1.5 h-6 px-2.5 rounded border transition-all text-[10px] font-medium shadow-sm
              hover:scale-[1.03] active:scale-[0.97]
              ${hasKfAtPlayhead
                ? 'bg-amber-600/80 hover:bg-amber-500 border-amber-500/60 text-white hover:shadow-[0_0_6px_rgba(251,191,36,0.35)]'
                : 'bg-teal-600/80  hover:bg-teal-500  border-teal-500/60  text-white hover:shadow-[0_0_6px_rgba(45,212,191,0.35)]'
              }`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0 L10 5 L5 10 L0 5 Z" />
            </svg>
            {hasKfAtPlayhead ? 'Update' : 'Keyframe'}
            {selCount > 1 && (
              <span className="ml-0.5 text-[9px] opacity-75 font-normal">({selCount})</span>
            )}
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
              className={`w-8 h-8 flex items-center justify-center rounded-md border transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 ${
                isPlaying
                  ? 'border-interactive/20 bg-interactive/15 text-interactive ring-1 ring-interactive/30 shadow-sm'
                  : 'border-border bg-background text-foreground/60 hover:bg-accent hover:text-accent-foreground shadow-sm'
              }`}
            >
              {isPlaying
                ? <Pause size={13} fill="currentColor" />
                : <Play size={13} fill="currentColor" className="translate-x-[1px]" />
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
              className="text-[9px] font-mono text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded-md hover:bg-accent transition-[color,background-color,box-shadow] min-w-[32px] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0"
              title="Reset zoom"
            >
              {zoom >= 10 ? `${Math.round(zoom)}×` : `${zoom.toFixed(1)}×`}
            </button>
          )}
          <TBtn onClick={zoomIn} title="Zoom in" disabled={zoom >= 200}>
            <ZoomIn size={12} />
          </TBtn>
          <div className="w-px h-4 bg-border mx-0.5" />
          <button
            onClick={() => setSnap(s => !s)}
            title={snap ? 'Snap on (0.5s)' : 'Snap off'}
            className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md border transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 ${
              snap
                ? 'border-border bg-accent text-accent-foreground shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Magnet size={9} />snap
          </button>
        </div>
      </div>

      {/* ── Content (ruler + tracks) ── */}
      <div className="flex-1 overflow-hidden flex flex-col relative" ref={contentRef}>

        {/* Ruler row */}
        <div className="flex shrink-0 border-b border-border" style={{ height: 24 }}>
          <div className="shrink-0 bg-background border-r border-border" style={{ width: LABEL_W }} />
          <div
            className="flex-1 relative bg-background cursor-col-resize overflow-hidden select-none"
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
        <div
          className="flex-1 overflow-y-auto select-none"
          onMouseDown={e => {
            if (e.button !== 0) return;
            const target = e.target as Element;
            // Start drag-select if not on a keyframe button or scene marker
            if (!target.closest('[data-keyframe]') && !target.closest('[data-scene-marker]')) {
              dragSelectActiveRef.current = true;
              setDragSelect({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY });
              setSelectedSceneMarkers([]);
              onSelectKeyframes?.([]);
            }
            handleMouseDown(e);
          }}
          onContextMenu={e => {
            e.preventDefault();
            const time = posFromEvent(e) ?? playheadPosition;
            setContextMenu({ x: e.clientX, y: e.clientY, kind: 'background', time });
          }}
        >
          {(onMoveSceneMarker && onDeleteSceneMarker) && (
            <SceneMarkerLane
              markers={sceneMarkers}
              contentRef={contentRef}
              viewWindow={viewWindow}
              duration={duration}
              snap={snap}
              onAdd={onAddSceneMarker}
              onMove={onMoveSceneMarker}
              onSceneMarkerContextMenu={handleSceneMarkerContextMenu}
              onSelectSceneMarker={(time, additive) =>
                setSelectedSceneMarkers(prev =>
                  additive
                    ? prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
                    : [time]
                )
              }
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              selectedMarkerTimes={selectedSceneMarkers}
              activeMarkerTime={contextMenu?.kind === 'scene-marker' ? contextMenu.time : null}
            />
          )}
          {TRACK_GROUPS.map(group => (
            <TrackGroup
              key={group.id}
              group={group}
              expanded={expanded[group.id]}
              onToggle={() => setExpanded(p => ({ ...p, [group.id]: !p[group.id] }))}
              collapsedTracks={collapsedTracks}
              onToggleTrackCollapsed={toggleTrackCollapsed}
              selectedKeyframes={selectedKeyframes}
              onKeyframeSelect={onKeyframeSelect}
              cameraKeyframes={cameraKeyframes}
              physicsKeyframes={physicsKeyframes}
              onMoveKeyframe={onMoveKeyframe}
              onSetHandle={onSetHandle}
              onSetInterpolation={onSetInterpolation}
              onKeyframeContextMenu={handleKeyframeContextMenu}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
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
            className="absolute top-0 bottom-0 pointer-events-none z-30"
            style={{ left: playheadLeft }}
          >
            <div className="absolute top-0 bottom-0 w-px bg-red-500/70" />
          </div>
        )}

        {/* Drag-select rectangle */}
        {dragSelect && (Math.abs(dragSelect.endX - dragSelect.startX) > 3 || Math.abs(dragSelect.endY - dragSelect.startY) > 3) && createPortal(
          <div
            className="fixed pointer-events-none z-50 border border-blue-400/70 bg-blue-400/10 rounded-sm"
            style={{
              left: Math.min(dragSelect.startX, dragSelect.endX),
              top: Math.min(dragSelect.startY, dragSelect.endY),
              width: Math.abs(dragSelect.endX - dragSelect.startX),
              height: Math.abs(dragSelect.endY - dragSelect.startY),
            }}
          />,
          document.body
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (() => {
        const hasItem = contextMenu.kind === 'scene-marker' ||
          (contextMenu.kind === 'keyframe' && selectedKeyframes.some(s =>
            s.track === contextMenu.trackId && Math.abs(s.time - contextMenu.time) < 0.01
          ));
        return (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            mode={contextMenu.kind}
            hasClipboard={!!clipboard}
            hasItem={hasItem}
            onCopy={copyAction}
            onCut={cutAction}
            onPaste={pasteAction}
            onDelete={deleteAction}
            onCreateSceneMarker={createSceneMarkerAction}
            onClose={() => setContextMenu(null)}
          />
        );
      })()}
    </div>
  );
}
