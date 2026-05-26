/**
 * PreviewAtoms — primitives for the preview surface. Provides the framed
 * artboard (aspect ratio + theme-aware shadow), the bottom-corner badge
 * overlays, and the initial loading scrim.
 */

import * as React from 'react';
import { Progress } from '../ui/progress';
import { cn } from '../ui/utils';

export type ArtboardAspectRatio = 'full' | '16:9' | '4:3' | '3:2' | 'din' | string;

export function OverlayBadge({
  position,
  children,
}: {
  position: 'bottom-left' | 'bottom-right';
  children: React.ReactNode;
}) {
  const isRight = position === 'bottom-right';
  return (
    <div
      className={cn(
        'absolute bottom-3 z-50 pointer-events-none',
        isRight ? 'right-3' : 'left-3',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-0.5',
          isRight ? 'items-end' : 'items-start',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function LoadingOverlay({
  label = 'Initialisierung',
  progress,
}: {
  label?: string;
  progress?: number;
}) {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/40 dark:bg-black/40 animate-in fade-in duration-700">
      <div className="w-64 flex flex-col items-center gap-4">
        <div className="w-full space-y-3">
          <div className="flex justify-center items-center">
            <span className="text-[13px] font-medium text-foreground tracking-tight">
              {label}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-1 bg-wn-control-bg overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}
