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
import { Route, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';

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

export function ToolbarSegmentedPicker<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (val: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </h4>
      )}
      <div className="grid grid-cols-4 gap-1 bg-wn-control-bg p-0.5 rounded-lg border border-wn-divider">
        {options.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "text-[10px] font-medium py-1 px-1.5 rounded-md transition-colors cursor-pointer",
              value === m.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-wn-control-bg/60"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToolbarPopoverRow({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-medium text-foreground">
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export function ToolbarPopoverHeader({
  title,
  icon: Icon,
  actionLabel,
  onAction,
}: {
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="p-3 border-b border-wn-divider bg-wn-control-bg/30 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-wn-accent" />}
        <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-[9px] font-semibold text-destructive hover:underline cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ToolbarPathItem({
  index,
  label,
  onRemove,
  onReorder,
}: {
  index: number;
  label: string;
  onRemove: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  return (
    <div
      draggable={!!onReorder}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
      }}
      onDragOver={(e) => {
        if (onReorder) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={() => {
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        if (onReorder) {
          e.preventDefault();
          setIsDragOver(false);
          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
          if (!isNaN(fromIndex) && fromIndex !== index) {
            onReorder(fromIndex, index);
          }
        }
      }}
      onDragEnd={() => {
        setIsDragOver(false);
      }}
      className={cn(
        "group flex items-center gap-2 p-1.5 bg-wn-control-bg border rounded-lg hover:border-wn-accent/50 transition-all shadow-sm",
        onReorder ? "cursor-grab active:cursor-grabbing" : "",
        isDragOver ? "border-wn-accent bg-wn-control-bg/60 scale-[1.02]" : "border-wn-divider"
      )}
    >
      <div className="text-muted-foreground/40 shrink-0">
        <GripVertical size={11} />
      </div>
      <div className="size-4 rounded-full bg-wn-accent/10 border border-wn-accent/20 flex items-center justify-center text-[8px] font-bold text-wn-accent shrink-0">
        {index + 1}
      </div>
      <span className="flex-1 text-[10px] font-medium text-foreground truncate select-none">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

export function ToolbarActionButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("pt-2 border-t border-wn-divider", className)}>
      <Button
        variant="outline"
        onClick={onClick}
        className="w-full h-7 text-[10px] bg-card border-border hover:bg-wn-control-hover hover:text-foreground font-medium"
      >
        {label}
      </Button>
    </div>
  );
}
