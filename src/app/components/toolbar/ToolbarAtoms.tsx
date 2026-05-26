/**
 * ToolbarAtoms — primitives for the floating left-edge tool palette.
 * Provides the rounded pill shell, the tool button, and the inline
 * divider. Single consumer today (Toolbar.tsx); the pack establishes the
 * pattern so any future floating UI composes the shell rather than
 * re-implementing the styling.
 */

import * as React from 'react';
import { cn } from '../ui/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

export function ToolbarShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 p-1.5 bg-wn-control-bg/90 backdrop-blur-md border border-border shadow-xl rounded-2xl pointer-events-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarDivider() {
  return <div className="w-6 h-[1px] bg-wn-divider my-0.5" />;
}

export function ToolButton<TId extends string>({
  id,
  activeId,
  onSelect,
  icon: Icon,
  label,
}: {
  id: TId;
  activeId: TId;
  onSelect: (id: TId) => void;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
}) {
  const isActive = activeId === id;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onSelect(id)}
          className={cn(
            'group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer',
            isActive
              ? 'bg-wn-accent text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-wn-control-hover',
          )}
        >
          <Icon
            size={18}
            strokeWidth={isActive ? 2.5 : 2}
            className={cn('transition-transform duration-200 origin-center will-change-transform', isActive ? 'scale-105 group-hover:scale-110' : 'scale-100 group-hover:scale-110')}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent hideArrow side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
