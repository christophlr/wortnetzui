import { useState, useRef, useMemo } from 'react';
import { LABEL_W, GRAPH_H, COLOR, inferEasingType, type ViewWindow, type EasingType } from './types';
import { evaluateHermite, computeCatmullRomTangent } from '../../easing';

/**
 * Full Hermite curve editor for a single track.
 * Shows the interpolation curve with draggable tangent handles.
 * 
 * For physics tracks: renders actual value curve.
 * For camera track: renders a "tension" curve (how smooth the path is).
 */
export function GraphEditor({
  trackId, color, keyframeData, viewWindow,
  onSetHandle, onSetHandle2D, onSetValue, onClearHandle, onSetInterpolation,
  onDragStart, onDragEnd,
  selectedKeyframes,
  onContextMenu,
}: {
  trackId: string;
  color: 'cyan' | 'orange';
  keyframeData: Array<{
    time: number;
    value?: number;
    handleIn?: number;
    handleOut?: number;
    handleInTime?: number;
    handleOutTime?: number;
    mode?: 'aligned' | 'broken';
    tension?: number;
  }>;
  viewWindow: ViewWindow;
  onSetHandle?: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetHandle2D?: (trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset?: number) => void;
  onSetValue?: (trackId: string, time: number, value: number) => void;
  onClearHandle?: (trackId: string, time: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'aligned' | 'broken') => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  selectedKeyframes?: { track: string; time: number }[];
  onContextMenu?: (trackId: string, time: number) => void;
}) {
  const visibleDuration = viewWindow.end - viewWindow.start;
  const trackRef = useRef<HTMLDivElement>(null);
  const colorMap = COLOR[color];

  const keyframes = useMemo(() => [...keyframeData].sort((a, b) => a.time - b.time), [keyframeData]);
  const isCamera = keyframes.length > 0 && keyframes[0].value === undefined;
  const isTension = isCamera; // Camera graph shows tension curve

  // For tension curve, use the tension values (default 1)
  const values = useMemo(() =>
    keyframes.map(kf => isTension ? (kf.tension ?? 1) : (kf.value ?? 0)),
    [keyframes, isTension]
  );

  const minVal = useMemo(() => Math.min(...values, 0), [values]);
  const maxVal = useMemo(() => Math.max(...values, 1), [values]);
  const valRange = maxVal === minVal ? 1 : maxVal - minVal;

  const getNormY = (val: number) => GRAPH_H - ((val - minVal) / valRange) * GRAPH_H * 0.8 - GRAPH_H * 0.1;

  // Build SVG curve path
  const pathData = useMemo(() => {
    if (keyframes.length < 2) return '';
    let d = '';
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i];
      const b = keyframes[i + 1];
      const leftPct = ((a.time - viewWindow.start) / visibleDuration) * 100;
      const rightPct = ((b.time - viewWindow.start) / visibleDuration) * 100;
      if (rightPct <= 0 || leftPct >= 100) continue;

      const aVal = isTension ? (a.tension ?? 1) : a.value!;
      const bVal = isTension ? (b.tension ?? 1) : b.value!;

      const segDur = b.time - a.time;
      const tPrev = i > 0 ? keyframes[i - 1].time : null;
      const vPrev = i > 0 ? (isTension ? (keyframes[i - 1].tension ?? 1) : keyframes[i - 1].value!) : null;
      const tNext = i + 2 < keyframes.length ? keyframes[i + 2].time : null;
      const vNext = i + 2 < keyframes.length ? (isTension ? (keyframes[i + 2].tension ?? 1) : keyframes[i + 2].value!) : null;

      const m0 = a.handleOut ?? (tPrev === null ? 0 : computeCatmullRomTangent(tPrev, vPrev, a.time, aVal, b.time, bVal));
      const m1 = b.handleIn ?? (tNext === null ? 0 : computeCatmullRomTangent(a.time, aVal, b.time, bVal, tNext, vNext));

      const pts: string[] = [];
      const steps = 30;
      for (let j = 0; j <= steps; j++) {
        const tRaw = j / steps;
        const val = evaluateHermite(tRaw, aVal, m0, bVal, m1, segDur);
        const tWorld = a.time + tRaw * segDur;
        const xPct = ((tWorld - viewWindow.start) / visibleDuration) * 100;
        pts.push(`${xPct},${getNormY(val)}`);
      }
      if (d === '') d += `M ${pts[0]} `;
      for (let j = 1; j < pts.length; j++) d += `L ${pts[j]} `;
    }
    return d;
  }, [keyframes, viewWindow, visibleDuration, isTension, minVal, valRange]);

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: { y: number; label: string }[] = [];
    const step = valRange <= 1 ? 0.25 : valRange <= 10 ? 1 : valRange <= 100 ? 10 : 50;
    const start = Math.ceil(minVal / step) * step;
    for (let v = start; v <= maxVal; v += step) {
      lines.push({ y: getNormY(v), label: v.toFixed(v % 1 !== 0 ? 1 : 0) });
    }
    return lines;
  }, [minVal, maxVal, valRange]);

  // Drag state for handles
  const [dragging, setDragging] = useState<{
    kfTime: number; side: 'out' | 'in';
    startX: number; startY: number;
    startSlope: number; startHandleTime: number;
  } | null>(null);

  const [draggingValue, setDraggingValue] = useState<{
    kfTime: number; startY: number; startValue: number;
  } | null>(null);

  // Handle drag — mousemove
  const handleDragMove = (e: MouseEvent) => {
    if (!dragging || !trackRef.current) return;
    const trackWidth = trackRef.current.getBoundingClientRect().width;
    if (onSetHandle2D) {
      const dx_time = (e.clientX - dragging.startX) / trackWidth * visibleDuration;
      const dy_val = -(e.clientY - dragging.startY) / (GRAPH_H * 0.8) * valRange;
      const valueDelta = dragging.startSlope * dragging.startHandleTime + dy_val;
      const newHandleTime = Math.max(0.01, dragging.startHandleTime + (dragging.side === 'out' ? dx_time : -dx_time));
      onSetHandle2D(trackId, dragging.kfTime, dragging.side, valueDelta / newHandleTime, newHandleTime);
    } else if (onSetHandle) {
      const dy = dragging.startY - e.clientY;
      const delta = (dy / (GRAPH_H * 0.8)) * valRange;
      const stdDt = 20 / trackWidth * visibleDuration;
      onSetHandle(trackId, dragging.kfTime, dragging.side, dragging.startSlope + delta / stdDt);
    }
  };

  // Handle drag — mouseup
  const handleDragEnd = () => {
    onDragEnd?.();
    setDragging(null);
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  };

  const startHandleDrag = (e: React.MouseEvent, kf: typeof keyframes[0], side: 'out' | 'in', slope: number, handleTime: number) => {
    e.stopPropagation();
    onDragStart?.();
    const state = { kfTime: kf.time, side, startX: e.clientX, startY: e.clientY, startSlope: slope, startHandleTime: handleTime };
    setDragging(state);
    
    const moveFn = (ev: MouseEvent) => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.getBoundingClientRect().width;
      if (onSetHandle2D) {
        const dx_time = (ev.clientX - state.startX) / trackWidth * visibleDuration;
        const dy_val = -(ev.clientY - state.startY) / (GRAPH_H * 0.8) * valRange;
        const valueDelta = state.startSlope * state.startHandleTime + dy_val;
        const newHandleTime = Math.max(0.01, state.startHandleTime + (state.side === 'out' ? dx_time : -dx_time));
        onSetHandle2D(trackId, state.kfTime, state.side, valueDelta / newHandleTime, newHandleTime);
      } else if (onSetHandle) {
        const dy = state.startY - ev.clientY;
        const delta = (dy / (GRAPH_H * 0.8)) * valRange;
        const stdDt = 20 / trackWidth * visibleDuration;
        onSetHandle(trackId, state.kfTime, state.side, state.startSlope + delta / stdDt);
      }
    };
    const upFn = () => {
      onDragEnd?.();
      setDragging(null);
      window.removeEventListener('mousemove', moveFn);
      window.removeEventListener('mouseup', upFn);
    };
    window.addEventListener('mousemove', moveFn);
    window.addEventListener('mouseup', upFn);
  };

  // Value drag
  const startValueDrag = (e: React.MouseEvent, kfTime: number, startValue: number) => {
    e.stopPropagation();
    onDragStart?.();
    const startY = e.clientY;
    setDraggingValue({ kfTime, startY, startValue });

    const moveFn = (ev: MouseEvent) => {
      const dy = startY - ev.clientY;
      const delta = (dy / (GRAPH_H * 0.8)) * valRange;
      onSetValue?.(trackId, kfTime, Math.max(0, startValue + delta));
    };
    const upFn = () => {
      onDragEnd?.();
      setDraggingValue(null);
      window.removeEventListener('mousemove', moveFn);
      window.removeEventListener('mouseup', upFn);
    };
    window.addEventListener('mousemove', moveFn);
    window.addEventListener('mouseup', upFn);
  };

  return (
    <div className={`flex border-b border-border/50`} style={{ height: GRAPH_H }}>
      {/* Label column */}
      <div className="shrink-0 flex flex-col justify-between pl-8 pr-2 border-r border-border bg-background py-1 relative z-30" style={{ width: LABEL_W }}>
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-muted-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M 0 9 C 3 9 7 1 10 1" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] text-muted-foreground truncate">
            {isTension ? 'Tension Curve' : 'Value Graph'}
          </span>
        </div>
        {keyframes.length > 0 && (
          <div className="flex flex-col gap-0 pointer-events-none">
            <span className="text-[8px] tabular-nums text-muted-foreground/50 leading-none">{maxVal.toFixed(maxVal >= 100 ? 0 : 1)}</span>
            <span className="text-[8px] tabular-nums text-muted-foreground/50 leading-none mt-auto">{minVal.toFixed(minVal >= 100 ? 0 : 1)}</span>
          </div>
        )}
      </div>

      {/* Graph area */}
      <div ref={trackRef} className="flex-1 relative overflow-visible" style={{ background: 'rgba(0,0,0,0.03)' }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {gridLines.map(({ y, label }, i) => (
            <g key={i}>
              <line x1="0" y1={y} x2="100%" y2={y} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.08" />
              <text x="4" y={y - 2} fontSize="8" fill="currentColor" fillOpacity="0.2" fontFamily="monospace">
                {label}
              </text>
            </g>
          ))}
        </svg>

        {keyframes.length === 0 && (
          <div className="absolute inset-0 flex items-center px-3">
            <div className="w-full border-t border-dashed border-border/40" />
          </div>
        )}

        {/* Curve + handles */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Main curve */}
          <path d={pathData} fill="none" stroke={colorMap.graphStroke} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeOpacity="0.8" />

          {/* Keyframe dots + handles */}
          {keyframes.map((kf, i) => {
            const kfVal = isTension ? (kf.tension ?? 1) : kf.value!;
            const xPct = ((kf.time - viewWindow.start) / visibleDuration) * 100;
            if (xPct < -5 || xPct > 105) return null;

            const y = getNormY(kfVal);
            const isSelected = selectedKeyframes?.some(s => s.track === trackId && Math.abs(s.time - kf.time) < 0.01);
            const isHover = false; // TODO: hover state

            // Tangent computation
            const mode = kf.mode || 'aligned';
            const tPrev = i > 0 ? keyframes[i - 1].time : null;
            const vPrev = i > 0 ? (isTension ? (keyframes[i - 1].tension ?? 1) : keyframes[i - 1].value!) : null;
            const tNext = i + 1 < keyframes.length ? keyframes[i + 1].time : null;
            const vNext = i + 1 < keyframes.length ? (isTension ? (keyframes[i + 1].tension ?? 1) : keyframes[i + 1].value!) : null;

            const mOut = kf.handleOut ?? (i === 0 ? 0 : computeCatmullRomTangent(tPrev, vPrev, kf.time, kfVal, tNext, vNext));
            const mIn  = kf.handleIn  ?? (i === keyframes.length - 1 ? 0 : computeCatmullRomTangent(tPrev, vPrev, kf.time, kfVal, tNext, vNext));
            const isAutoHandles = kf.handleIn === undefined && kf.handleOut === undefined;

            const trackWidth = trackRef.current?.getBoundingClientRect().width || 1000;
            const stdDt = 20 / trackWidth * visibleDuration;
            const segDurOut = tNext !== null ? tNext - kf.time : Infinity;
            const segDurIn  = tPrev !== null ? kf.time - tPrev : Infinity;
            const handleTimeOut = kf.handleOutTime ?? Math.min(stdDt, segDurOut / 3);
            const handleTimeIn  = kf.handleInTime  ?? Math.min(stdDt, segDurIn  / 3);

            const yOut = getNormY(kfVal + mOut * handleTimeOut);
            const yIn  = getNormY(kfVal - mIn  * handleTimeIn);
            const xOut = xPct + (handleTimeOut / visibleDuration) * 100;
            const xIn  = xPct - (handleTimeIn  / visibleDuration) * 100;

            const showHandles = isSelected || isHover;

            return (
              <g key={kf.time}>
                {/* Handle arms — only show when selected/hovered */}
                {showHandles && tNext !== null && (
                  <line
                    x1={`${xPct}%`} y1={y} x2={`${xOut}%`} y2={yOut}
                    stroke={colorMap.graphStroke} strokeWidth="1" strokeOpacity={isAutoHandles ? 0.25 : 0.6}
                    strokeDasharray={isAutoHandles ? '3 2' : 'none'}
                  />
                )}
                {showHandles && tPrev !== null && (
                  <line
                    x1={`${xPct}%`} y1={y} x2={`${xIn}%`} y2={yIn}
                    stroke={colorMap.graphStroke} strokeWidth="1" strokeOpacity={isAutoHandles ? 0.25 : 0.6}
                    strokeDasharray={isAutoHandles ? '3 2' : 'none'}
                  />
                )}

                {/* Handle dots — only when selected/hovered */}
                {showHandles && tNext !== null && (
                  <circle
                    cx={`${xOut}%`} cy={yOut} r="5"
                    fill={isAutoHandles ? 'transparent' : colorMap.graphStroke}
                    stroke={colorMap.graphStroke} strokeWidth="1.5"
                    strokeOpacity={isAutoHandles ? 0.4 : 1}
                    className="cursor-move"
                    onMouseDown={(e) => startHandleDrag(e, kf, 'out', mOut, handleTimeOut)}
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onSetInterpolation?.(trackId, kf.time, mode === 'aligned' ? 'broken' : 'aligned'); }}
                  />
                )}
                {showHandles && tPrev !== null && (
                  <circle
                    cx={`${xIn}%`} cy={yIn} r="5"
                    fill={isAutoHandles ? 'transparent' : colorMap.graphStroke}
                    stroke={colorMap.graphStroke} strokeWidth="1.5"
                    strokeOpacity={isAutoHandles ? 0.4 : 1}
                    className="cursor-move"
                    onMouseDown={(e) => startHandleDrag(e, kf, 'in', mIn, handleTimeIn)}
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onSetInterpolation?.(trackId, kf.time, mode === 'aligned' ? 'broken' : 'aligned'); }}
                  />
                )}

                {/* Keyframe dot */}
                <circle
                  cx={`${xPct}%`} cy={y} r={isSelected ? 6 : 5}
                  fill={isSelected ? '#3b82f6' : colorMap.graphStroke}
                  stroke={isSelected ? '#93c5fd' : '#fff'}
                  strokeWidth={isSelected ? 2 : 1.5}
                  className={onSetValue && !isTension ? 'cursor-ns-resize' : undefined}
                  onMouseDown={onSetValue && !isTension ? (e) => startValueDrag(e, kf.time, kf.value!) : undefined}
                />

                {/* Value tooltip when selected */}
                {isSelected && (
                  <text
                    x={`${xPct}%`} y={y - 10}
                    textAnchor="middle" fontSize="9" fontFamily="monospace"
                    fill={colorMap.graphStroke} fillOpacity="0.8"
                  >
                    {kfVal.toFixed(kfVal >= 100 ? 0 : 1)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Vertical keyframe tick lines */}
        {keyframes.map(kf => {
          const pct = ((kf.time - viewWindow.start) / visibleDuration) * 100;
          if (pct < 0 || pct > 100) return null;
          return (
            <div
              key={`tick-${kf.time}`}
              className="absolute inset-y-0 w-px pointer-events-none"
              style={{ left: `${pct}%`, background: `${colorMap.graphStroke}30` }}
            />
          );
        })}
      </div>
    </div>
  );
}
