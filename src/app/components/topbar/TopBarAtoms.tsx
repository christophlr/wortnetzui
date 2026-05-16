/**
 * TopBarAtoms — primitives for the top menu bar. Provides the rounded pill
 * shell, the styled menu trigger, and the right-pill action button. The
 * brand-color literals (`bg-blue-500/10`, NetworkLogo `#3b9eff`) stay as
 * pass-through values until the Phase 3.3 color sweep.
 */

import * as React from 'react';
import { Button } from '../ui/button';
import { MenubarTrigger } from '../ui/menubar';
import { cn } from '../ui/utils';

export function TopBarPill({
  gap = 'gap-2',
  className,
  children,
}: {
  gap?: 'gap-2' | 'gap-3';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-center px-3 h-11 bg-sidebar border border-sidebar-border shadow-sm rounded-xl pointer-events-auto',
        gap,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TopBarMenuTrigger({
  children,
  ...props
}: React.ComponentProps<typeof MenubarTrigger>) {
  return (
    <MenubarTrigger
      className="h-8 hover:bg-accent/50 data-[state=open]:bg-accent/50"
      {...props}
    >
      {children}
    </MenubarTrigger>
  );
}

export function TopBarActionButton({
  active = false,
  children,
  onClick,
  title,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      title={title}
      onClick={onClick}
      className={cn(
        'h-7 px-3 text-[11px] font-medium transition-all duration-200',
        active
          ? 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20 hover:text-blue-700'
          : 'text-zinc-600 hover:bg-zinc-100 border-zinc-200',
      )}
    >
      {children}
    </Button>
  );
}
