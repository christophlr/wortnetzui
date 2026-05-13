import * as React from 'react';
import { SidebarGroup, SidebarGroupContent } from '../ui/sidebar';
import { cn } from '../ui/utils';

type DivProps = React.ComponentProps<'div'>;

export function InspectorTabGroup({
  label,
  className,
  contentClassName,
  children,
}: {
  label: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarGroup className={cn('p-0', className)}>
      <div className="px-5 pt-5 text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">
        {label}
      </div>
      <SidebarGroupContent className={cn('px-5 pb-5 pt-5', contentClassName)}>{children}</SidebarGroupContent>
    </SidebarGroup>
  );
}

export function InspectorPanelSection({ className, ...props }: DivProps) {
  return <section className={cn('px-5 py-5 space-y-5', className)} {...props} />;
}

export function InspectorSectionHeader({
  title,
  actions,
  className,
  titleClassName,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h2 className={cn('text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]', titleClassName)}>{title}</h2>
      {actions}
    </div>
  );
}

export function InspectorSubgroup({ className, ...props }: DivProps) {
  return <div className={cn('space-y-3', className)} {...props} />;
}

export function InspectorSubgroupTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return <h3 className={cn('text-[12px] font-semibold text-zinc-800 dark:text-zinc-100', className)} {...props} />;
}

export function InspectorControlLabel({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-[12px] font-medium text-zinc-800 dark:text-zinc-200', className)} {...props} />;
}

export function InspectorValueChip({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded',
        className,
      )}
      {...props}
    />
  );
}
