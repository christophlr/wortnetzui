/**
 * TopBarAtoms — primitives for the top menu bar. Provides the rounded pill
 * shell, the styled menu trigger, the view-mode toggle, and the right-pill
 * action button. All brand/state colors reference CSS variables defined in
 * theme.css.
 */

import * as React from 'react';
import { Square, Box } from 'lucide-react';
import { Button } from '../ui/button';
import { MenubarTrigger } from '../ui/menubar';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
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

export function TopBarViewToggle({
  value,
  onChange,
  titleTwoD,
  titleThreeD,
}: {
  value: '2D' | '3D';
  onChange: (mode: '2D' | '3D') => void;
  titleTwoD?: string;
  titleThreeD?: string;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as '2D' | '3D')}
      className="h-7 gap-0 border border-border rounded-md overflow-hidden bg-background/50"
    >
      <ToggleGroupItem
        value="2D"
        className="h-7 w-8 p-0 text-[11px] hover:bg-accent/50 data-[state=on]:bg-primary/10"
        title={titleTwoD}
      >
        <Square size={13} strokeWidth={2.5} fill={value === '2D' ? 'currentColor' : 'none'} fillOpacity={0.12} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="3D"
        className="h-7 w-8 p-0 text-[11px] border-l border-border hover:bg-accent/50 data-[state=on]:bg-primary/10"
        title={titleThreeD}
      >
        <Box size={13} strokeWidth={2.5} fill={value === '3D' ? 'currentColor' : 'none'} fillOpacity={0.12} />
      </ToggleGroupItem>
    </ToggleGroup>
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
          ? 'bg-wn-topbar-toggle-active text-wn-topbar-toggle-text border-wn-topbar-toggle-border hover:bg-wn-topbar-toggle-active-hover hover:text-wn-topbar-toggle-text'
          : 'text-muted-foreground hover:bg-accent border-border',
      )}
    >
      {children}
    </Button>
  );
}
