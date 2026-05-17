/**
 * TimelineAtoms — primitives for the bottom timeline. Exposes:
 *   - TrackLabel: the fixed-width left column shared by SceneMarkerLane,
 *     TrackRow, TrackGroup, GraphEditor, and the ruler's empty cell.
 *   - TimelineTransportButton: square 6×6 ghost button used for the
 *     toolbar transport / zoom / snap / record / undo etc. controls.
 *
 * Other candidates from the master plan (RulerTick, GraphEditorHeader,
 * TrackValueChip, TrackRow itself) stay inlined for now — they're either
 * single-consumer or logic-heavy components, not atoms.
 */

import * as React from 'react';
import { Button } from '../ui/button';
import { LABEL_W } from './types';
import { cn } from '../ui/utils';
import { Circle } from 'lucide-react';

export type TrackLabelVariant = 'row' | 'stacked';
export type TrackLabelPadding = 'header' | 'indent';
export type TrackLabelBorder = 'right' | 'none';

export function TimelineTransportButton({
  children,
  onClick,
  disabled,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'h-6 w-6 p-0 shrink-0',
        active && 'text-wn-timeline-transport-active',
        disabled && 'opacity-40 pointer-events-none',
      )}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </Button>
  );
}

export function TrackLabel({
  variant = 'row',
  padding = 'header',
  border = 'right',
  children,
}: {
  variant?: TrackLabelVariant;
  padding?: TrackLabelPadding;
  border?: TrackLabelBorder;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{ width: LABEL_W }}
      className={cn(
        'shrink-0 bg-background relative z-30',
        border === 'right' && 'border-r border-border',
        variant === 'stacked' ? 'flex flex-col justify-between py-1' : 'flex items-center gap-1.5',
        padding === 'indent' ? 'pl-8 pr-2' : 'px-2',
      )}
    >
      {children}
    </div>
  );
}

export function PlayheadLine({ ratio, withTriangle = false }: { ratio: number; withTriangle?: boolean }) {
  return (
    <div
      className="absolute top-0 w-px h-full bg-wn-timeline-playhead z-20 pointer-events-none"
      style={{ left: `${ratio * 100}%` }}
    >
      {withTriangle && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <svg width="10" height="8" viewBox="0 0 10 8">
            <polygon points="0,0 10,0 5,8" fill="var(--wn-timeline-playhead)" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function RecordButton({ isRecording, onToggleRecording, title }: { isRecording: boolean; onToggleRecording: () => void; title: string }) {
  return (
    <TimelineTransportButton
      onClick={onToggleRecording}
      title={title}
      active={false}
      disabled
    >
      <Circle className="w-3 h-3" />
    </TimelineTransportButton>
  );
}

export function SceneMarkerHandle({ isSelected }: { isSelected: boolean }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" className="shrink-0">
      <path
        d="M 1 1 L 11 1 L 11 9 L 6 13 L 1 9 Z"
        fill={isSelected ? 'var(--wn-timeline-marker-selected)' : 'var(--wn-timeline-marker-fill)'}
        stroke={isSelected ? 'var(--wn-timeline-kf-selected-stroke)' : 'var(--wn-timeline-marker-fill)'}
        strokeWidth={isSelected ? 2 : 1}
      />
    </svg>
  );
}

export function TrackValueChip({ value, colorClass }: { value: number | string; colorClass?: string }) {
  return (
    <span className={cn("text-[9px] font-mono tabular-nums px-1 py-0.5 rounded-sm bg-wn-control-bg text-muted-foreground", colorClass)}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </span>
  );
}

export function TrackEditableNumber({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <span className="text-[10px] font-mono tabular-nums text-foreground cursor-ns-resize hover:text-wn-accent">
      {value.toFixed(2)}
    </span>
  );
}

export function TrackKeyframeToggle({ active, onClick }: { active: boolean; onClick?: () => void }) {
  return (
    <button
      className={cn("w-2 h-2 rotate-45 border transition-colors", active ? "bg-wn-keyframe-active border-wn-keyframe-active" : "border-muted-foreground hover:border-foreground")}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    />
  );
}
