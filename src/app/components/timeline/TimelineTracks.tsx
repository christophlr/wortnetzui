import { useState, useRef, useCallback, useMemo } from 'react';
import { ChevronRight, View, Lock, Bookmark, LineChart } from 'lucide-react';
import { usePointerDrag } from './usePointerDrag';
import { KeyframeIcon } from './KeyframeIcon';
import {
  LABEL_W, TRACK_H, MINI_CURVE_H,
  COLOR, inferEasingType,
  type ViewWindow, type PhysicsKeyframe, type SceneMarker,
} from './types';
import { TrackLabel, SceneMarkerHandle, LfoBadge, TrackArmToggle } from './TimelineAtoms';
import { evaluateHermite, computeCatmullRomTangent } from '../../easing';
import { useT } from '../../i18n/useT';
import { sameTime, withinSelection, withinSnap } from './timeUtils';

/* ── Scene Marker Lane ── */

export function SceneMarkerLane({
  markers, viewWindow, selectedKeyframes,
  onAddMarker, onMoveMarker, onDropMarker, onDeleteMarker,
  onSelect, onContextMenu, timeFromClientX, contentRef, playheadTime,
}: {
  markers: SceneMarker[];
  viewWindow: ViewWindow;
  selectedKeyframes?: { track: string; time: number }[];
  onAddMarker?: (time: number) => void;
  onMoveMarker?: (oldTime: number, newTime: number) => void;
  onDropMarker?: (fromTime: number, toTime: number) => void;
  onDeleteMarker?: (time: number) => void;
  onSelect?: (track: string, time: number, additive: boolean) => void;
  onContextMenu?: (time: number, label: string) => void;
  timeFromClientX: (clientX: number, el: HTMLElement | null, snapPoints: number[]) => number | null;
  contentRef: React.RefObject<HTMLDivElement | null>;
  playheadTime?: number;
}) {
  const { t } = useT();
  const visibleDuration = viewWindow.end - viewWindow.start;
  const [draggingMarker, setDraggingMarker] = useState<{ origTime: number; currentTime: number } | null>(null);
  // Snap points: other markers + playhead
  const snapPoints = useMemo(
    () => [...markers.map(m => m.time), ...(playheadTime !== undefined ? [playheadTime] : [])],
    [markers, playheadTime]
  );

  const handleMarkerMouseDown = (e: React.MouseEvent, marker: SceneMarker) => {
    e.stopPropagation();
    onSelect?.('scene-markers', marker.time, e.shiftKey || e.metaKey);
    // Start manual drag
    let currentTime = marker.time;
    setDraggingMarker({ origTime: marker.time, currentTime: marker.time });

    const onMove = (ev: MouseEvent) => {
      // Snap to other markers? Maybe not while dragging the marker itself, but good to have the option.
      // Usually you don't snap a marker to another marker.
      const t = timeFromClientX(ev.clientX, contentRef.current, snapPoints);
      if (t !== null && !withinSnap(t, currentTime)) {
        onMoveMarker?.(currentTime, t);
        currentTime = t;
        setDraggingMarker(prev => prev ? { ...prev, currentTime: t } : null);
      }
    };
    const onUp = () => {
      setDraggingMarker(null);
      if (!withinSnap(currentTime, marker.time)) {
        onDropMarker?.(marker.time, currentTime);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const t = timeFromClientX(e.clientX, contentRef.current, snapPoints);
    if (t !== null) onAddMarker?.(t);
  };

  return (
    <div className="flex sticky top-[24px] z-20 border-b border-border bg-background/95 backdrop-blur-sm" style={{ height: TRACK_H }}>
      {/* Label */}
      <TrackLabel>
        <Bookmark className="w-3 h-3 text-wn-timeline-marker-fill" fill="currentColor" />
        <span className="text-xs text-muted-foreground font-medium truncate">{t('timeline.track.sceneMarkers')}</span>
      </TrackLabel>
      {/* Track area */}
      <div className="flex-1 relative" onDoubleClick={handleDoubleClick}>
        {markers.map(marker => {
          const displayTime = draggingMarker?.origTime === marker.time
            ? draggingMarker.currentTime
            : marker.time;
          const pct = ((displayTime - viewWindow.start) / visibleDuration) * 100;
          if (pct < -5 || pct > 105) return null;
          const isSelected = selectedKeyframes?.some(s => s.track === 'scene-markers' && withinSelection(s.time, marker.time)) ?? false;

          return (
            <button
              key={marker.time}
              className={`absolute top-1/2 flex items-center gap-0.5 group cursor-grab active:cursor-grabbing ${
                isSelected ? 'z-10' : ''
              }`}
              style={{ left: `${pct}%`, transform: 'translate(-6px, -50%)' }}
              onMouseDown={(e) => handleMarkerMouseDown(e, marker)}
              onContextMenu={() => {
                onContextMenu?.(marker.time, marker.label);
              }}
            >
              <SceneMarkerHandle isSelected={isSelected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Track Row (single keyframe lane) ── */

export function TrackRow({
  trackId, name, color, keyframeData, viewWindow,
  selectedKeyframes, showMiniCurve,
  isGraphEditorVisible,
  onToggleGraphEditor,
  onSelect, onMoveKeyframe, onContextMenu, onTrackHeaderContextMenu,
  onDragStart, onDragEnd, onDuplicateKeyframe,
  timeFromClientX, contentRef, sceneMarkers = [], playheadTime,
  modulatorWaveform,
  isArmed,
  onToggleArm,
}: {
  trackId: string;
  name: string;
  color: 'cyan' | 'orange';
  keyframeData: Array<{ time: number; value?: number; handleIn?: number; handleOut?: number; handleInTime?: number; handleOutTime?: number; mode?: 'aligned' | 'broken' }>;
  viewWindow: ViewWindow;
  selectedKeyframes?: { track: string; time: number }[];
  showMiniCurve?: boolean;
  isGraphEditorVisible?: boolean;
  onToggleGraphEditor?: () => void;
  onSelect?: (track: string, time: number, additive: boolean) => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onContextMenu?: (trackId: string, time: number) => void;
  onTrackHeaderContextMenu?: (trackId: string) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDuplicateKeyframe?: (trackId: string, srcTime: number, destTime: number) => void;
  timeFromClientX: (clientX: number, el: HTMLElement | null, snapPoints: number[]) => number | null;
  contentRef: React.RefObject<HTMLDivElement | null>;
  sceneMarkers?: SceneMarker[];
  playheadTime?: number;
  modulatorWaveform?: 'sine' | 'triangle' | 'square' | null;
  isArmed?: boolean;
  onToggleArm?: () => void;
}) {
  const { t } = useT();
  const visibleDuration = viewWindow.end - viewWindow.start;
  const colorMap = COLOR[color];
  const keyframes = useMemo(() => [...keyframeData].sort((a, b) => a.time - b.time), [keyframeData]);

  // Mini-curve data for dopesheet mode (physics tracks only)
  const miniCurvePath = useMemo(() => {
    if (!showMiniCurve || keyframes.length < 2 || keyframes[0].value === undefined) return '';
    const minVal = Math.min(...keyframes.map(k => k.value!));
    const maxVal = Math.max(...keyframes.map(k => k.value!));
    const range = maxVal === minVal ? 1 : maxVal - minVal;
    const getNormY = (v: number) => MINI_CURVE_H - ((v - minVal) / range) * MINI_CURVE_H * 0.8 - MINI_CURVE_H * 0.1;

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

      const m0 = a.handleOut ?? (tPrev === null ? 0 : computeCatmullRomTangent(tPrev, vPrev, a.time, a.value!, b.time, b.value!));
      const m1 = b.handleIn ?? (tNext === null ? 0 : computeCatmullRomTangent(a.time, a.value!, b.time, b.value!, tNext, vNext));

      const pts: string[] = [];
      const steps = 20;
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
  }, [keyframes, viewWindow, visibleDuration, showMiniCurve]);

  // Drag state for keyframe movement
  const handleKfMouseDown = (e: React.MouseEvent, kfTime: number) => {
    e.stopPropagation();
    if (e.button === 2) return; // right-click handled by context menu

    const isAdditive = e.shiftKey || e.metaKey;
    const isAlreadySelected = selectedKeyframes?.some(s => s.track === trackId && sameTime(s.time, kfTime)) ?? false;

    // Premiere/AE convention: clicking an unselected keyframe without a modifier
    // clears the current selection and selects only this keyframe before dragging.
    if (!isAdditive && !isAlreadySelected) {
      onSelect?.(trackId, kfTime, false);
    } else {
      onSelect?.(trackId, kfTime, isAdditive);
    }
    
    // Alt-drag = duplicate
    if (e.altKey) {
      onDuplicateKeyframe?.(trackId, kfTime, kfTime);
    }
    
    onDragStart?.();

    let currentTime = kfTime;
    const startTime = kfTime;
    const snapPoints = [
      ...sceneMarkers.map(m => m.time),
      ...(playheadTime !== undefined ? [playheadTime] : [])
    ];

    const onMove = (ev: MouseEvent) => {
      const t = timeFromClientX(ev.clientX, contentRef.current, snapPoints);
      if (t !== null && !withinSnap(t, currentTime)) {
        onMoveKeyframe?.(trackId, currentTime, t);
        currentTime = t;
      }
      const dt = currentTime - startTime;
      setDragDelta({ x: ev.clientX, y: ev.clientY, dt });
    };
    const onUp = () => {
      onDragEnd?.();
      setDragDelta(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const [dragDelta, setDragDelta] = useState<{ x: number; y: number; dt: number } | null>(null);

  return (
    <div
      className={`group flex border-b border-border/50 ${colorMap.border} border-l-2`}
      style={{ height: TRACK_H }}
    >
      {/* Label — right-click here resets the whole track. */}
      <div
        onContextMenu={() => {
          if (!onTrackHeaderContextMenu) return;
          onTrackHeaderContextMenu(trackId);
        }}
      >
      <TrackLabel padding="indent">
        {onToggleArm && (
          <TrackArmToggle
            armed={!!isArmed}
            onToggle={onToggleArm}
            title={isArmed ? t('timeline.track.armed') : t('timeline.track.arm')}
          />
        )}
        <span className="text-[11px] text-muted-foreground truncate flex-1">{name}</span>
        <LfoBadge waveform={modulatorWaveform ?? null} />
        {onToggleGraphEditor && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleGraphEditor(); }}
            className={`opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-sm transition-all ${isGraphEditorVisible ? 'text-wn-accent bg-wn-accent-soft opacity-100' : 'text-muted-foreground hover:text-foreground'}`}
            title={t('timeline.action.toggleGraphEditor')}
          >
            <LineChart className="w-3.5 h-3.5" />
          </button>
        )}
      </TrackLabel>
      </div>
      {/* Track area */}
      <div className={`flex-1 relative ${colorMap.trackBg}`}>
        {/* Mini-curve (Ableton-style faint curve in dopesheet mode) */}
        {showMiniCurve && miniCurvePath && (
          <svg
            className="absolute inset-0 w-full pointer-events-none"
            style={{ height: MINI_CURVE_H, top: (TRACK_H - MINI_CURVE_H) / 2 }}
            preserveAspectRatio="none"
          >
            <path d={miniCurvePath} fill="none" stroke={colorMap.miniCurve} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        )}

        {/* Keyframe diamonds */}
        {keyframes.map((kf, i) => {
          const pct = ((kf.time - viewWindow.start) / visibleDuration) * 100;
          if (pct < -3 || pct > 103) return null;
          const isSelected = selectedKeyframes?.some(s => s.track === trackId && withinSelection(s.time, kf.time));
          const prevKf = i > 0 ? keyframes[i - 1] : null;
          const nextKf = i + 1 < keyframes.length ? keyframes[i + 1] : null;
          const easingType = inferEasingType(kf, prevKf, nextKf, kf.value);

          return (
            <button
              key={kf.time}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing z-10 hover:scale-125 transition-transform"
              style={{
                left: `${pct}%`,
                filter: isSelected ? 'drop-shadow(0 0 6px color-mix(in srgb, var(--wn-timeline-kf-selected) 60%, transparent))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
              onMouseDown={(e) => handleKfMouseDown(e, kf.time)}
              onContextMenu={() => {
                onContextMenu?.(trackId, kf.time);
              }}
            >
              <KeyframeIcon
                type={easingType}
                size={10}
                fill={isSelected ? 'var(--wn-timeline-kf-selected)' : colorMap.kfFill}
                stroke={isSelected ? 'var(--wn-timeline-kf-selected-stroke)' : colorMap.kfFill}
                selected={isSelected}
              />
            </button>
          );
        })}
      </div>
      {dragDelta && (
        <div
          className="fixed pointer-events-none z-[10000] px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums bg-background border border-border text-foreground shadow-md"
          style={{ left: dragDelta.x + 12, top: dragDelta.y + 12 }}
        >
          Δt: {dragDelta.dt >= 0 ? '+' : ''}{dragDelta.dt.toFixed(2)}s
        </div>
      )}
    </div>
  );
}

/* ── Track Group (collapsible header + children) ── */

export function TrackGroup({
  id, name, color, children,
  defaultExpanded = true,
  isGraphEditorVisible,
  onToggleGraphEditor,
}: {
  id: string;
  name: string;
  color: 'cyan' | 'orange';
  children: React.ReactNode;
  defaultExpanded?: boolean;
  isGraphEditorVisible?: boolean;
  onToggleGraphEditor?: () => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const colorMap = COLOR[color];

  return (
    <div>
      {/* Group header */}
      <div
        className={`group flex items-center border-b border-border bg-background/50 cursor-pointer select-none relative ${colorMap.border} border-l-2`}
        style={{ height: TRACK_H }}
        onClick={() => setExpanded(!expanded)}
      >
        <TrackLabel border="none">
          <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
          <div className={`w-2 h-2 rounded-full ${colorMap.dot}`} />
          <span className="text-xs font-medium text-foreground flex-1 truncate">{name}</span>
        </TrackLabel>
        <div className="flex-1 border-r-0" />
      </div>
      {/* Children (track rows) */}
      {expanded && children}
    </div>
  );
}
