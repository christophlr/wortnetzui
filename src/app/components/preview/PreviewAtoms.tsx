/**
 * PreviewAtoms — primitives for the preview surface. Provides the framed
 * artboard (aspect ratio + theme-aware shadow), the bottom-corner badge
 * overlays, and the initial loading scrim.
 */

import * as React from 'react';
import { Progress } from '../ui/progress';
import { cn } from '../ui/utils';

export type ArtboardAspectRatio = 'full' | '16:9' | '4:3' | '3:2' | 'din' | string;

function aspectRatioCss(value: ArtboardAspectRatio): string | undefined {
  switch (value) {
    case 'din':
      return '1.414/1';
    case '16:9':
      return '16/9';
    case '4:3':
      return '4:3';
    case '3:2':
      return '3/2';
    case 'full':
      return undefined;
    default:
      return undefined;
  }
}

export function Artboard({
  aspectRatio,
  isReady,
  themeHybrid,
  primary,
  children,
}: {
  aspectRatio: ArtboardAspectRatio;
  isReady: boolean;
  themeHybrid: boolean;
  /** Main content (e.g. Network3D). Fades in on `isReady`. */
  primary: React.ReactNode;
  /** Persistent overlays (badges, edge indicators). Always visible. */
  children?: React.ReactNode;
}) {
  const isFull = aspectRatio === 'full';

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-500',
        isFull ? 'p-0' : 'p-8 sm:p-12 lg:p-16',
      )}
    >
      <div
        className={cn(
          'relative transition-all duration-500 ease-in-out overflow-hidden border border-border rounded-[2px]',
          themeHybrid
            ? 'preview-portal shadow-2xl'
            : 'shadow-[0_30px_90px_rgba(0,0,0,0.4)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.6)]',
        )}
        style={{
          width: isFull ? '100%' : 'auto',
          height: isFull ? '100%' : 'auto',
          aspectRatio: aspectRatioCss(aspectRatio),
          background: 'var(--preview-background)',
        }}
      >
        <div
          className={cn(
            'w-full h-full transition-opacity duration-1000',
            isReady ? 'opacity-100' : 'opacity-0',
          )}
        >
          {primary}
        </div>

        {/* Subtle internal edge indicator */}
        <div className="absolute inset-0 border border-white/5 pointer-events-none z-10" />

        {children}
      </div>
    </div>
  );
}

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
