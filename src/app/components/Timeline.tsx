import { createPortal } from 'react-dom';
import { Eye, Lock, ChevronRight, Diamond, Play, Pause, SkipBack, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut, Magnet, Bookmark } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { TIMELINE_DURATION } from '../constants';
import { evaluateHermite, computeCatmullRomTangent } from '../easing';

/* ── Types & constants ── */

type PhysicsKeyframe = { time: number; value: number; handleIn?: number; handleOut?: number; mode?: 'aligned' | 'broken' };

type SceneMarker = { time: number; label: string };

interface TimelineProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop?: () => void;
  playheadPosition: number;
  onPlayheadChange: (pos: number) => void;
  selectedKeyframes: { track: string; time: number }[];
  onKeyframeSelect: (track: string, time: number, additive: boolean) => void;
  onSelectKeyframes?: (kfs: { track: string; time: number }[]) => void;
  cameraKeyframes?: Array<{ time: number; position: any; target: any; handleInPos?: any; handleOutPos?: any; handleInTgt?: any; handleOutTgt?: any; mode?: 'aligned' | 'broken'; tension?: number; tensionHandleIn?: number; tensionHandleOut?: number; tensionHandleInTime?: number; tensionHandleOutTime?: number }>;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  onCaptureKeyframe?: () => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onSetHandle?: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetHandle2D?: (trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset: number) => void;
  onClearHandle?: (trackId: string, time: number) => void;
  onSetValue?: (trackId: string, time: number, value: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'aligned' | 'broken') => void;
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
  onDropSceneMarker?: (fromTime: number, toTime: number) => void;
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
  cyan:   { dot: 'bg-blue-500',   border: 'border-l-blue-500/60',   kf: 'text-blue-400',   kfFill: '#60a5fa', trackBg: 'bg-blue-950/10',   graphStroke: '#3b82f6' },
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
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`size-7 border ${active ? 'border-border bg-accent text-accent-foreground shadow-sm' : 'border-transparent text-foreground/60'}`}
    >
      {children}
    </Button>
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
  onPresetAuto, onPresetFlat, onPresetEaseIn, onPresetEaseOut, hasHandlePresets,
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
  onPresetAuto?: () => void;
  onPresetFlat?: () => void;
  onPresetEaseIn?: () => void;
  onPresetEaseOut?: () => void;
  hasHandlePresets?: boolean;
}) {
  const menuW = 196;
  const menuH = mode === 'background' ? 68 : hasHandlePresets ? 220 : 136;
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
            {hasHandlePresets && (
              <>
                <div className="border-t border-border/60 my-1 mx-2" />
                <div className="px-3 py-1 text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Easing</div>
                <Item label="Auto (Catmull-Rom)" shortcut="" action={onPresetAuto ?? (() => {})} disabled={!onPresetAuto} />
                <Item label="Flat (hold)" shortcut="" action={onPresetFlat ?? (() => {})} disabled={!onPresetFlat} />
                <Item label="Ease In (slow arrival)" shortcut="" action={onPresetEaseIn ?? (() => {})} disabled={!onPresetEaseIn} />
                <Item label="Ease Out (slow departure)" shortcut="" action={onPresetEaseOut ?? (() => {})} disabled={!onPresetEaseOut} />
              </>
            )}
            <div className="border-t border-border/60 my-1 mx-2" />
            <Item label="Delete" shortcut="⌫" action={onDelete} danger disabled={!hasItem} />
          </>
        )}
      </div>
    </>,
    document.body
  );
}

/* ── Value Graph Track ── */

const EASING_H = 56;

function ValueGraphTrack({
  trackId, keyframeData, onSetHandle, onSetHandle2D, onSetValue, onClearHandle, onSetInterpolation, onDragStart, onDragEnd, viewWindow,
}: {
  trackId: string;
  keyframeData: Array<{ time: number; value?: number; handleIn?: number; handleOut?: number; handleInTime?: number; handleOutTime?: number; mode?: 'aligned' | 'broken' }>;
  onSetHandle: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetHandle2D?: (trackId: string, time: number, side: 'out' | 'in', slope: number, timeOffset: number) => void;
  onSetValue?: (trackId: string, time: number, value: number) => void;
  onClearHandle?: (trackId: string, time: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'aligned' | 'broken') => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  viewWindow: ViewWindow;
}) {
  const visibleDuration = viewWindow.end - viewWindow.start;
  const trackRef = useRef<HTMLDivElement>(null);

  const keyframes = useMemo(() => [...keyframeData].sort((a, b) => a.time - b.time), [keyframeData]);
  const isCamera = keyframes.length > 0 && keyframes[0].value === undefined;

  const minVal = useMemo(() => Math.min(...keyframes.map(k => k.value ?? 0)), [keyframes]);
  const maxVal = useMemo(() => Math.max(...keyframes.map(k => k.value ?? 0)), [keyframes]);
  const valRange = maxVal === minVal ? 1 : maxVal - minVal;

  const getNormY = (val: number) => EASING_H - ((val - minVal) / valRange) * EASING_H * 0.8 - EASING_H * 0.1;

  const pathData = useMemo(() => {
    if (isCamera || keyframes.length < 2) return '';
    let d = '';
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i];
      const b = keyframes[i + 1];
      const leftPct = ((a.time - viewWindow.start) / visibleDuration) * 100;
      const rightPct = ((b.time - viewWindow.start) / visibleDuration) * 100;
      if (rightPct <= 0 || leftPct >= 100) continue;

      const segDur = b.time - a.time;
      const tPrev = i > 0 ? keyframes[i - 1].time : null;
      const vPrev = i > 0 ? keyframes[i - 1].value! : null;
      const tNext = i + 2 < keyframes.length ? keyframes[i + 2].time : null;
      const vNext = i + 2 < keyframes.length ? keyframes[i + 2].value! : null;

      // Boundary fix: horizontal tangent at first/last keyframe prevents overshoot spike
      const m0 = a.handleOut ?? (tPrev === null ? 0 : computeCatmullRomTangent(tPrev, vPrev, a.time, a.value!, b.time, b.value!));
      const m1 = b.handleIn ?? (tNext === null ? 0 : computeCatmullRomTangent(a.time, a.value!, b.time, b.value!, tNext, vNext));

      const pts = [];
      const steps = 30;
      for (let j = 0; j <= steps; j++) {
        const tRaw = j / steps;
        const val = evaluateHermite(tRaw, a.value!, m0, b.value!, m1, segDur);
        const tWorld = a.time + tRaw * segDur;
        const xPct = ((tWorld - viewWindow.start) / visibleDuration) * 100;
        pts.push(`${xPct},${getNormY(val)}`);
      }
      if (d === '') d += `M ${pts[0]} `;
      for (let j = 1; j < pts.length; j++) d += `L ${pts[j]} `;
    }
    return d;
  }, [keyframes, viewWindow, visibleDuration, isCamera, minVal, valRange]);

  const [dragging, setDragging] = useState<{
    kfTime: number; side: 'out' | 'in';
    startX: number; startY: number;
    startSlope: number; startHandleTime: number;
  } | null>(null);
  const [draggingValue, setDraggingValue] = useState<{ kfTime: number; startY: number; startValue: number } | null>(null);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const trackWidth = trackRef.current?.getBoundingClientRect().width || 1000;
      if (onSetHandle2D) {
        const dx_time = (e.clientX - dragging.startX) / trackWidth * visibleDuration;
        const dy_val = -(e.clientY - dragging.startY) / (EASING_H * 0.8) * valRange;
        const valueDelta = dragging.startSlope * dragging.startHandleTime + dy_val;
        const newHandleTime = Math.max(0.01, dragging.startHandleTime + (dragging.side === 'out' ? dx_time : -dx_time));
        onSetHandle2D(trackId, dragging.kfTime, dragging.side, valueDelta / newHandleTime, newHandleTime);
      } else {
        const dy = dragging.startY - e.clientY;
        const delta = (dy / (EASING_H * 0.8)) * valRange;
        const stdDt = 20 / trackWidth * visibleDuration;
        onSetHandle(trackId, dragging.kfTime, dragging.side, dragging.startSlope + delta / stdDt);
      }
    };
    const onUp = () => { onDragEnd?.(); setDragging(null); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, trackId, onSetHandle, onSetHandle2D, onDragEnd, valRange, visibleDuration]);

  useEffect(() => {
    if (!draggingValue || !onSetValue) return;
    const onMove = (e: MouseEvent) => {
      const dy = draggingValue.startY - e.clientY;
      const delta = (dy / (EASING_H * 0.8)) * valRange;
      onSetValue(trackId, draggingValue.kfTime, Math.max(0, draggingValue.startValue + delta));
    };
    const onUp = () => { onDragEnd?.(); setDraggingValue(null); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [draggingValue, trackId, onSetValue, onDragEnd, valRange]);

  return (
    <div className="flex border-b border-border/50" style={{ height: EASING_H }}>
      <div className="shrink-0 flex items-center pl-8 pr-2 border-r border-border bg-background gap-1.5 relative" style={{ width: LABEL_W }}>
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-muted-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M 0 9 C 3 9 7 1 10 1" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] text-muted-foreground flex-1 truncate">Value Graph</span>
        {keyframes.length > 0 && !isCamera && (
          <div className="absolute right-2 inset-y-0 flex flex-col justify-between py-1 pointer-events-none">
            <span className="text-[8px] tabular-nums text-muted-foreground/50 leading-none">{maxVal.toFixed(maxVal >= 100 ? 0 : 1)}</span>
            <span className="text-[8px] tabular-nums text-muted-foreground/50 leading-none">{minVal.toFixed(minVal >= 100 ? 0 : 1)}</span>
          </div>
        )}
      </div>

      <div ref={trackRef} className="flex-1 relative bg-blue-950/5 overflow-visible">
        {keyframes.length === 0 && (
          <div className="absolute inset-0 flex items-center px-3">
            <div className="w-full border-t border-dashed border-border/40" />
          </div>
        )}

        {!isCamera && (
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <path d={pathData} fill="none" stroke="#2dd4bf" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

            {keyframes.map((kf, i) => {
              const xPct = ((kf.time - viewWindow.start) / visibleDuration) * 100;
              if (xPct < -5 || xPct > 105) return null;

              const y = getNormY(kf.value!);
              const mode = kf.mode || 'aligned';
              const tPrev = i > 0 ? keyframes[i - 1].time : null;
              const vPrev = i > 0 ? keyframes[i - 1].value! : null;
              const tNext = i + 1 < keyframes.length ? keyframes[i + 1].time : null;
              const vNext = i + 1 < keyframes.length ? keyframes[i + 1].value! : null;

              // Boundary fix: 0 tangent at first/last keyframe
              const mOut = kf.handleOut ?? (i === 0 ? 0 : computeCatmullRomTangent(tPrev, vPrev, kf.time, kf.value!, tNext, vNext));
              const mIn  = kf.handleIn  ?? (i === keyframes.length - 1 ? 0 : computeCatmullRomTangent(tPrev, vPrev, kf.time, kf.value!, tNext, vNext));

              // Segment-aware arm length — cap at 1/3 of adjacent segment duration
              const trackWidth = trackRef.current?.getBoundingClientRect().width || 1000;
              const stdDt = 20 / trackWidth * visibleDuration;
              const segDurOut = tNext !== null ? tNext - kf.time : Infinity;
              const segDurIn  = tPrev !== null ? kf.time - tPrev : Infinity;
              const handleTimeOut = kf.handleOutTime ?? Math.min(stdDt, segDurOut / 3);
              const handleTimeIn  = kf.handleInTime  ?? Math.min(stdDt, segDurIn  / 3);

              const yOut = getNormY(kf.value! + mOut * handleTimeOut);
              const yIn  = getNormY(kf.value! - mIn  * handleTimeIn);
              const xOut = xPct + (handleTimeOut / visibleDuration) * 100;
              const xIn  = xPct - (handleTimeIn  / visibleDuration) * 100;

              return (
                <g key={kf.time}>
                  {tNext !== null && (
                    <line x1={`${xPct}%`} y1={y} x2={`${xOut}%`} y2={yOut} stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.5" />
                  )}
                  {tPrev !== null && (
                    <line x1={`${xPct}%`} y1={y} x2={`${xIn}%`} y2={yIn} stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.5" />
                  )}

                  {tNext !== null && (
                    <circle cx={`${xOut}%`} cy={yOut} r="5" fill="#0d9488" stroke="#2dd4bf" strokeWidth="1.5" className="cursor-move"
                      onMouseDown={(e) => { e.stopPropagation(); onDragStart?.(); setDragging({ kfTime: kf.time, side: 'out', startX: e.clientX, startY: e.clientY, startSlope: mOut, startHandleTime: handleTimeOut }); }}
                      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onSetInterpolation?.(trackId, kf.time, mode === 'aligned' ? 'broken' : 'aligned'); }}
                    />
                  )}
                  {tPrev !== null && (
                    <circle cx={`${xIn}%`} cy={yIn} r="5" fill="#0d9488" stroke="#2dd4bf" strokeWidth="1.5" className="cursor-move"
                      onMouseDown={(e) => { e.stopPropagation(); onDragStart?.(); setDragging({ kfTime: kf.time, side: 'in', startX: e.clientX, startY: e.clientY, startSlope: mIn, startHandleTime: handleTimeIn }); }}
                      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onSetInterpolation?.(trackId, kf.time, mode === 'aligned' ? 'broken' : 'aligned'); }}
                    />
                  )}
                  <circle cx={`${xPct}%`} cy={y} r="5" fill="#14b8a6" stroke="#ccfbf1" strokeWidth="1.5"
                    className={onSetValue ? "cursor-ns-resize" : undefined}
                    onMouseDown={onSetValue ? (e) => { e.stopPropagation(); onDragStart?.(); setDraggingValue({ kfTime: kf.time, startY: e.clientY, startValue: kf.value! }); } : undefined}
                  />
                </g>
              );
            })}
          </svg>
        )}
        {keyframes.map(kf => {
          const pct = ((kf.time - viewWindow.start) / visibleDuration) * 100;
          if (pct < 0 || pct > 100) return null;
          return (
            <div
              key={`tick-${kf.time}`}
              className="absolute inset-y-0 w-px bg-blue-500/30 pointer-events-none"
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
    if (snap) return Math.round(clamped * 30) / 30;
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
  onAdd, onMove, onDrop, onSceneMarkerContextMenu, onSelectSceneMarker,
  onDragStart, onDragEnd, selectedMarkerTimes = [], activeMarkerTime,
}: {
  markers: SceneMarker[];
  contentRef: React.RefObject<HTMLDivElement | null>;
  viewWindow: ViewWindow;
  duration: number;
  snap: boolean;
  onAdd?: (time: number) => void;
  onMove: (oldTime: number, newTime: number) => void;
  onDrop?: (fromTime: number, toTime: number) => void;
  onSceneMarkerContextMenu: (time: number, x: number, y: number) => void;
  onSelectSceneMarker?: (time: number, additive: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  selectedMarkerTimes?: number[];
  activeMarkerTime?: number | null;
}) {
  const [draggingMarker, setDraggingMarker] = useState<{ time: number; startTime: number } | null>(null);
  const visibleDuration = viewWindow.end - viewWindow.start;

  const timeFromClientX = useCallback((clientX: number) => {
    if (!contentRef.current) return null;
    const rect = contentRef.current.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = clientX - rect.left - LABEL_W;
    const frac = x / rightW;
    const raw = viewWindow.start + frac * visibleDuration;
    const clamped = Math.max(0, Math.min(duration, raw));
    if (snap) return Math.round(clamped * 30) / 30;
    return clamped;
  }, [snap, contentRef, duration, viewWindow, visibleDuration]);

  useEffect(() => {
    if (!draggingMarker) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newTime = timeFromClientX(e.clientX);
      if (newTime !== null) {
        onMove(draggingMarker.time, newTime);
        setDraggingMarker(d => d ? { ...d, time: newTime } : null);
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      const finalTime = timeFromClientX(e.clientX);
      onDragEnd?.();
      if (onDrop && finalTime !== null) onDrop(draggingMarker.startTime, finalTime);
      setDraggingMarker(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingMarker, timeFromClientX, onMove, onDrop, onDragEnd]);

  return (
    <div className="flex border-b border-purple-500/20 shrink-0 sticky top-0 z-20 bg-background" style={{ height: 28 }}>
      <div
        className="shrink-0 flex items-center pl-3 pr-2 border-r border-border bg-background"
        style={{ width: LABEL_W }}
      >
        <span className="flex items-center gap-1 text-[11px] text-purple-400"><Bookmark size={10} />Scene Markers</span>
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
                  setDraggingMarker({ time: marker.time, startTime: marker.time });
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
  onMoveKeyframe, onSetHandle, onSetHandle2D, onClearHandle, onSetValue, onSetInterpolation, onKeyframeContextMenu, onDragStart, onDragEnd,
  snap, contentRef, playheadPosition, duration, viewWindow,
}: {
  group: typeof TRACK_GROUPS[number];
  expanded: boolean;
  onToggle: () => void;
  collapsedTracks: Record<string, boolean>;
  onToggleTrackCollapsed: (trackId: string) => void;
  selectedKeyframes: { track: string; time: number }[];
  onKeyframeSelect: (track: string, time: number, additive: boolean) => void;
  cameraKeyframes: Array<{ time: number; position: any; target: any; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual'; tension?: number; tensionHandleIn?: number; tensionHandleOut?: number; tensionHandleInTime?: number; tensionHandleOutTime?: number; mode?: 'aligned' | 'broken' }>;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onSetHandle?: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetHandle2D?: (trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset: number) => void;
  onClearHandle?: (trackId: string, time: number) => void;
  onSetValue?: (trackId: string, time: number, value: number) => void;
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
          ? cameraKeyframes.map(kf => ({ time: kf.time, value: kf.tension ?? 1, handleIn: kf.tensionHandleIn, handleOut: kf.tensionHandleOut, handleInTime: kf.tensionHandleInTime, handleOutTime: kf.tensionHandleOutTime, mode: kf.mode }))
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
              <ValueGraphTrack
                trackId={track.id}
                keyframeData={easingData}
                onSetHandle={onSetHandle}
                onSetHandle2D={onSetHandle2D}
                onClearHandle={onClearHandle}
                onSetValue={onSetValue}
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
  onSetHandle2D,
  onClearHandle,
  onSetValue,
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
  onDropSceneMarker,
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
    if (snap) return Math.round(clamped * 30) / 30;
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
          // Also select scene markers in the drag box
          const markerHits = sceneMarkers.filter(m => checkTime(m.time)).map(m => m.time);
          if (markerHits.length > 0) setSelectedSceneMarkers(markerHits);
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
  }, [dragSelect, contentRef, cameraKeyframes, physicsKeyframes, sceneMarkers, viewWindow, onSelectKeyframes]);

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
    <div className="flex flex-col bg-zinc-50 border-t border-zinc-200 shrink-0" style={{ height }}>

      {/* ── Toolbar ── */}
      <div className="h-14 bg-accent/5 border-b border-border flex items-center px-3 shrink-0 relative">

        {/* Left */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onCaptureKeyframe}
            title={hasKfAtPlayhead ? 'Update keyframe at playhead' : 'Capture new keyframe at playhead'}
            className={`h-6 px-2.5 gap-1.5 text-[11px] font-medium rounded-md shadow-sm border-blue-500/40 bg-background text-blue-600 hover:bg-blue-500/10 hover:text-blue-700 hover:border-blue-500/60
              ${hasKfAtPlayhead
                ? 'border-amber-500/40 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 hover:border-amber-500/60'
                : ''
              }`}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" className="size-2.5 shrink-0">
              <path d="M5 0 L10 5 L5 10 L0 5 Z" />
            </svg>
            {hasKfAtPlayhead ? 'Update' : 'Keyframe'}
            {selCount > 1 && (
              <span className="ml-0.5 text-[9px] opacity-75 font-normal tabular-nums">({selCount})</span>
            )}
          </Button>
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
            title={snap ? 'Snap on (Frames)' : 'Snap off'}
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
              onMove={onMoveSceneMarker ?? (() => {})}
              onDrop={onDropSceneMarker}
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
              onSetHandle2D={onSetHandle2D}
              onClearHandle={onClearHandle}
              onSetValue={onSetValue}
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
        const tid = contextMenu.trackId;
        const t = contextMenu.time;
        const hasHandlePresets = contextMenu.kind === 'keyframe' && !!(onClearHandle || onSetHandle2D) && !!tid;
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
            hasHandlePresets={hasHandlePresets}
            onPresetAuto={hasHandlePresets && onClearHandle && tid ? () => { onClearHandle(tid, t); } : undefined}
            onPresetFlat={hasHandlePresets && onSetHandle2D && tid ? () => { onSetHandle2D(tid, t, 'out', 0, 0.33); onSetHandle2D(tid, t, 'in', 0, 0.33); } : undefined}
            onPresetEaseIn={hasHandlePresets && onSetHandle2D && tid ? () => { onSetHandle2D(tid, t, 'in', 0, 0.33); } : undefined}
            onPresetEaseOut={hasHandlePresets && onSetHandle2D && tid ? () => { onSetHandle2D(tid, t, 'out', 0, 0.33); } : undefined}
          />
        );
      })()}
    </div>
  );
}
