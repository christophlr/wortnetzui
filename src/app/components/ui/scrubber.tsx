"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "./utils";
import { Input } from "./input";

export interface ScrubberProps {
  className?: string;
  /** Decimal places shown in value display (default 2). */
  decimals?: number;
  /** Custom display formatter — overrides decimals. */
  format?: (v: number) => string;
  /** Label rendered inside the track on the left. */
  label?: string;
  max?: number;
  min?: number;
  /** Called on every pointer-move during drag (continuous). */
  onValueChange?: (value: number) => void;
  /** Called when drag ends or an inline input is committed. */
  onCommit?: (value: number) => void;
  /** Custom parser for the inline-input string (default parseFloat). */
  parseInput?: (raw: string) => number;
  step?: number;
  /** Number of tick marks (0 = none). */
  ticks?: number;
  value: number;
}

const _clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const _snap = (v: number, step: number, min: number) =>
  Math.round((v - min) / step) * step + min;

/** Right-side pixel zone reserved for the value display — no drag here. */
const VALUE_AREA_PX = 46;

export function Scrubber({
  label,
  value,
  onValueChange,
  onCommit,
  min = 0,
  max = 1,
  step = 0.01,
  decimals = 2,
  ticks = 0,
  format,
  parseInput,
  className,
}: ScrubberProps) {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isHoverDevice, setIsHoverDevice] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");

  const range = max - min;
  const pct = range > 0 ? _clamp(((value - min) / range) * 100, 0, 100) : 0;
  const isActive = isDragging || (isHoverDevice && isHovering);
  const displayValue = format ? format(value) : value.toFixed(decimals);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const apply = React.useCallback(
    (raw: number, commit: boolean) => {
      const v = _clamp(_snap(raw, step, min), min, max);
      onValueChange?.(v);
      if (commit) onCommit?.(v);
    },
    [step, min, max, onValueChange, onCommit],
  );

  const fromPointer = React.useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return value;
      const r = el.getBoundingClientRect();
      return min + _clamp((clientX - r.left) / r.width, 0, 1) * range;
    },
    [min, range, value],
  );

  const inValueZone = React.useCallback((clientX: number) => {
    const el = trackRef.current;
    return el ? clientX > el.getBoundingClientRect().right - VALUE_AREA_PX : false;
  }, []);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (isEditing || inValueZone(e.clientX)) return;
      e.preventDefault();
      trackRef.current?.setPointerCapture(e.pointerId);
      setIsDragging(true);
      apply(fromPointer(e.clientX), false);
    },
    [isEditing, inValueZone, fromPointer, apply],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      apply(fromPointer(e.clientX), false);
    },
    [isDragging, fromPointer, apply],
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      apply(fromPointer(e.clientX), true);
    },
    [isDragging, fromPointer, apply],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (isEditing) return;
      let next: number | undefined;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = value + step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = value - step;
          break;
        case "Home":
          next = min;
          break;
        case "End":
          next = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      apply(next, true);
    },
    [isEditing, value, step, min, max, apply],
  );

  const handleValueDoubleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(true);
      setLocalValue(value.toFixed(decimals));
    },
    [value, decimals],
  );

  const commitInput = React.useCallback(
    (raw: string) => {
      const parsed = parseInput ? parseInput(raw) : parseFloat(raw);
      if (!Number.isNaN(parsed)) apply(parsed, true);
      setIsEditing(false);
    },
    [parseInput, apply],
  );

  const spring = shouldReduceMotion
    ? { duration: 0 }
    : ({ type: "spring", duration: 0.25, bounce: 0.1 } as const);

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Number(value.toFixed(decimals))}
      className={cn(
        "relative h-7 w-full overflow-hidden rounded-md border border-wn-divider bg-wn-control-bg",
        "select-none touch-none outline-offset-2 focus-visible:outline-1 focus-visible:outline-ring",
        isEditing ? "cursor-default" : "cursor-ew-resize",
        className,
      )}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Fill */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-wn-slider-range/20"
        style={{
          width: `${pct}%`,
          transition: isDragging ? "none" : "width 120ms cubic-bezier(0.23,1,0.32,1)",
        }}
      />

      {/* Tick marks */}
      {ticks > 0 && (
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: ticks }, (_, i) => {
            const pos = ((i + 1) / (ticks + 1)) * 100;
            return (
              <div
                key={pos}
                className="absolute top-1/2 bg-foreground/20"
                style={{
                  left: `${pos}%`,
                  width: 1,
                  height: 4,
                  borderRadius: 999,
                  transform: "translateX(-50%) translateY(-50%)",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Animated capsule thumb */}
      <div
        className="pointer-events-none absolute top-1/2"
        style={{
          left: `${pct}%`,
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 3,
          transition: isDragging ? "none" : "left 120ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <motion.div
          animate={{
            opacity: isActive ? 0.65 : 0.18,
            scaleX: isActive ? 1 : 0.7,
            scaleY: isActive ? 1 : 0.7,
          }}
          transition={spring}
          className="bg-foreground rounded-full"
          style={{ width: 3, height: 18 }}
        />
      </div>

      {/* Label (left) */}
      {label && (
        <span
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none"
          style={{ left: 8, zIndex: 4 }}
        >
          {label}
        </span>
      )}

      {/* Value display / inline editor (right) */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ right: 6, zIndex: 4 }}
        onDoubleClick={handleValueDoubleClick}
      >
        {isEditing ? (
          <Input
            type="number"
            autoFocus
            className="w-12 h-5 text-[10px] px-1 py-0 text-center border-border bg-background"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                commitInput(localValue);
              } else if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
            onBlur={() => commitInput(localValue)}
          />
        ) : (
          <span
            className="font-mono text-[10px] font-medium text-muted-foreground cursor-text select-none"
            title="Double-click to enter value"
          >
            {displayValue}
          </span>
        )}
      </div>
    </div>
  );
}
