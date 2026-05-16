/**
 * TimelineAtoms — primitives for the bottom timeline. Today exposes only
 * TrackLabel: the fixed-width left column shared by SceneMarkerLane,
 * TrackRow, TrackGroup, GraphEditor, and the ruler's empty cell. Other
 * candidates from the master plan (RulerTick, GraphEditorHeader,
 * TrackValueChip, TrackRow itself) stay inlined for now — they're either
 * single-consumer or logic-heavy components, not atoms.
 */

import * as React from 'react';
import { LABEL_W } from './types';
import { cn } from '../ui/utils';

export type TrackLabelVariant = 'row' | 'stacked';
export type TrackLabelPadding = 'header' | 'indent';
export type TrackLabelBorder = 'right' | 'none';

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
