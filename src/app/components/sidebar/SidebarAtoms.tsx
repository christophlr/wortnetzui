/**
 * SidebarAtoms — canonical atomic primitives for the right sidebar.
 *
 * Hierarchy (see plan: Atomic hierarchy correction):
 *   1  SidebarTabHeader            <h1>  uppercased tab title
 *   2  SidebarSection              <h2>  major section (e.g. "Knoten")
 *   3  SidebarGroup                <h3>  real subgroup of 2+ related controls
 *                                        — never used for a single control
 *   4  SidebarSliderRow / SidebarToggleRow / SidebarColorRow / SidebarRadioRow /
 *      SidebarRadioCard / SidebarButtonGroupRow
 *                                  one full control block for a single parameter
 *                                  (header row + control body + optional description)
 *   5  SidebarValueChip / SidebarKeyframeToggle / SidebarSliderTrack /
 *      SidebarEditableNumber / SidebarDescription
 *                                  inline pieces that fill the slots of a level-4 row
 *
 * Visual rules currently use the existing zinc-* baseline so parity holds
 * during the migration; Phase 2.A swaps these for CSS-variable tokens.
 */

import * as React from 'react';
import { Diamond, Minus, Plus } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { RadioGroupItem } from '../ui/radio-group';
import { cn } from '../ui/utils';
import { pad } from '../../theme/tokens';

type DivProps = React.ComponentProps<'div'>;

// ──────────────────────────────────────────────────────────────────────────
// Shell atoms — tab header, activity rail button, tab content wrapper
// ──────────────────────────────────────────────────────────────────────────

export function SidebarTabHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'text-[13px] font-bold text-zinc-500 uppercase tracking-wider',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SidebarActivityButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        'group relative flex h-10 w-10 items-center justify-center',
        active
          ? 'text-zinc-900 dark:text-zinc-100'
          : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300',
      )}
    >
      <Icon
        size={20}
        className={cn(active ? 'scale-110' : 'scale-100 group-hover:scale-105')}
      />
      {active ? (
        <div className="absolute left-0 h-5 w-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-r-full" />
      ) : null}
    </button>
  );
}

export function SidebarTabContent({ className, ...props }: DivProps) {
  return (
    <div
      className={cn('divide-y divide-wn-divider', className)}
      {...props}
    />
  );
}

/**
 * SidebarDivider — single horizontal divider for use inside a section that
 * cannot rely on a parent `divide-y` (e.g. between two unrelated control
 * blocks in the same SidebarSection). Uses the same `--wn-divider` token
 * as SidebarTabContent so light/dark theming stays unified.
 */
export function SidebarDivider({
  className,
  ...props
}: React.ComponentProps<'hr'>) {
  return (
    <hr
      className={cn('border-0 border-t border-wn-divider', className)}
      {...props}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Layout atoms — compound Section (H2) and Group (H3)
// ──────────────────────────────────────────────────────────────────────────

export type SidebarSectionStack = 'normal' | 'snug';

export function SidebarSection({
  title,
  actions,
  stack = 'normal',
  children,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  stack?: SidebarSectionStack;
  children: React.ReactNode;
}) {
  const stackClass = stack === 'snug' ? pad.sectionStackSnug : pad.sectionStack;
  return (
    <section className={cn(pad.section, stackClass)}>
      {title || actions ? (
        <div className="flex items-center gap-2">
          {title ? (
            <h2 className="flex-1 text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">
              {title}
            </h2>
          ) : (
            <div className="flex-1" />
          )}
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export type SidebarGroupStack = 'tight' | 'snug' | 'loose';

export function SidebarGroup({
  title,
  stack = 'tight',
  children,
}: {
  title?: React.ReactNode;
  stack?: SidebarGroupStack;
  children: React.ReactNode;
}) {
  const stackClass =
    stack === 'loose' ? pad.subgroupLoose : stack === 'snug' ? pad.subgroupSnug : pad.subgroup;
  return (
    <div className={stackClass}>
      {title ? (
        <h3 className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Inline atoms — level-5 pieces that fill row slots
// ──────────────────────────────────────────────────────────────────────────

export function SidebarValueChip({
  className,
  ...props
}: React.ComponentProps<'span'>) {
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

export function SidebarSliderTrack({
  className,
  ...props
}: React.ComponentProps<typeof Slider>) {
  return <Slider className={cn('py-2', className)} {...props} />;
}

export function SidebarDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-[10px] text-zinc-500 leading-tight', className)}
      {...props}
    />
  );
}

export function SidebarKeyframeToggle({
  active,
  onClick,
  title,
}: {
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'size-5 rounded-full flex items-center justify-center transition-colors',
        active
          ? 'text-wn-keyframe-active bg-wn-accent-soft border border-wn-accent/40 shadow-sm'
          : 'text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100',
      )}
    >
      <Diamond className={cn('size-2.5', active && 'fill-current')} />
    </button>
  );
}

/**
 * SidebarEditableNumber — click-to-type numeric value button. Commits on
 * Enter / Tab / blur; cancels on Escape. Always clamps to [min, max].
 */
export function SidebarEditableNumber({
  value,
  onCommit,
  min,
  max,
  format = (v) => v.toFixed(2),
  parseInput = (raw) => parseFloat(raw),
  className,
}: {
  value: number;
  onCommit: (v: number) => void;
  min?: number;
  max?: number;
  format?: (v: number) => string;
  parseInput?: (raw: string) => number;
  className?: string;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value.toString());

  const commit = (raw: string) => {
    let next = parseInput(raw);
    if (!Number.isNaN(next)) {
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      onCommit(next);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        type="number"
        autoFocus
        className={cn(
          'w-14 h-6 text-[10px] px-1 py-0 text-center border-zinc-200',
          className,
        )}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Tab') {
            commit(localValue);
          } else if (e.key === 'Escape') {
            setIsEditing(false);
            setLocalValue(value.toString());
          }
        }}
        onBlur={() => commit(localValue)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setIsEditing(true);
        setLocalValue(value.toString());
      }}
      className={cn(
        'text-[10px] font-mono text-zinc-400 hover:text-zinc-900 transition-colors',
        className,
      )}
    >
      {format(value)}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Row atoms — level 4: one complete control block per parameter
// All row atoms share the same vertical grammar:
//   [optional header row: label-left + value/accessory-right]
//   [control body]
//   [optional description]
// ──────────────────────────────────────────────────────────────────────────

function RowHeader({
  label,
  value,
  accessory,
}: {
  label?: React.ReactNode;
  value?: React.ReactNode;
  accessory?: React.ReactNode;
}) {
  if (!label && !value && !accessory) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      {label ? (
        <span className="flex-1 text-[12px] font-medium text-zinc-800 dark:text-zinc-200">
          {label}
        </span>
      ) : (
        <div className="flex-1" />
      )}
      {(value || accessory) && (
        <div className="flex items-center gap-2 shrink-0">
          {value}
          {accessory}
        </div>
      )}
    </div>
  );
}

/**
 * SidebarSliderRow — the label is a <span>, NOT an <h3>: a single parameter
 * is not a subgroup.
 *
 * Two value-display modes:
 *   - Editable: pass numeric `value` together with `onCommit` (+ optional
 *     `min` / `max` / `format` / `parseInput`). The value renders as a
 *     click-to-type `SidebarEditableNumber`.
 *   - Display: pass `value` as any ReactNode without `onCommit`. Renders as
 *     a static `SidebarValueChip` (legacy path; STYLE_GUIDE expects rows to
 *     migrate to the editable form).
 */
type SidebarSliderRowCommon = {
  label?: React.ReactNode;
  accessory?: React.ReactNode;
  slider: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};
type SidebarSliderRowDisplay = SidebarSliderRowCommon & {
  value?: React.ReactNode;
  onCommit?: never;
};
type SidebarSliderRowEditable = SidebarSliderRowCommon & {
  value: number;
  onCommit: (v: number) => void;
  min?: number;
  max?: number;
  format?: (v: number) => string;
  parseInput?: (raw: string) => number;
};

export function SidebarSliderRow(
  props: SidebarSliderRowDisplay | SidebarSliderRowEditable,
) {
  const { label, accessory, slider, description, className } = props;
  let valueNode: React.ReactNode = null;
  if ('onCommit' in props && props.onCommit) {
    valueNode = (
      <SidebarEditableNumber
        value={props.value}
        onCommit={props.onCommit}
        min={props.min}
        max={props.max}
        format={props.format}
        parseInput={props.parseInput}
      />
    );
  } else if (props.value !== undefined && props.value !== null) {
    valueNode = <SidebarValueChip>{props.value}</SidebarValueChip>;
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      <RowHeader label={label} value={valueNode} accessory={accessory} />
      {slider}
      {description ? <SidebarDescription>{description}</SidebarDescription> : null}
    </div>
  );
}

export type SidebarSwitchTone = 'neutral' | 'accent' | 'positive';

export function SidebarToggleRow({
  label,
  checked,
  onCheckedChange,
  description,
  tone = 'neutral',
  className,
}: {
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  description?: React.ReactNode;
  tone?: SidebarSwitchTone;
  className?: string;
}) {
  const toneClass =
    tone === 'accent' || tone === 'positive'
      ? 'data-[state=checked]:bg-wn-accent'
      : 'data-[state=checked]:bg-zinc-900';

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 text-[12px] font-medium text-zinc-800 dark:text-zinc-200">
          {label}
        </span>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn('scale-90', toneClass)}
        />
      </div>
      {description ? <SidebarDescription>{description}</SidebarDescription> : null}
    </div>
  );
}

/**
 * SidebarColorRow — label above, native color picker below.
 * Replaces the GradientColorField placeholder in VisualTab.
 */
export function SidebarColorRow({
  label,
  value,
  onChange,
  className,
}: {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
        {label}
      </label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded cursor-pointer"
      />
    </div>
  );
}

/**
 * SidebarRadioRow — one item in a vertical list of radio options with
 * description text (ContentTab pattern). Must be a child of a shadcn
 * <RadioGroup>.
 */
export function SidebarRadioRow({
  id,
  value,
  label,
  description,
}: {
  id: string;
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-3 group">
      <RadioGroupItem
        value={value}
        id={id}
        className="mt-0.5 border-zinc-300 text-zinc-900"
      />
      <label
        htmlFor={id}
        className="text-[12px] font-semibold leading-tight cursor-pointer group-hover:text-zinc-900 text-zinc-800 transition-colors"
      >
        {label}
        {description ? (
          <p className="text-[10px] text-zinc-400 font-normal mt-1">{description}</p>
        ) : null}
      </label>
    </div>
  );
}

/**
 * SidebarRadioCard — one item in a grid of icon-card radio options
 * (CanvasTab aspect-ratio pattern). Must be a child of a shadcn
 * <RadioGroup>.
 */
export function SidebarRadioCard({
  id,
  value,
  label,
  icon: Icon,
}: {
  id: string;
  value: string;
  label: React.ReactNode;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div>
      <RadioGroupItem value={value} id={id} className="peer sr-only" />
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/50 p-2 hover:bg-zinc-100 peer-data-[state=checked]:border-wn-accent peer-data-[state=checked]:bg-wn-accent-soft cursor-pointer transition-all"
      >
        <span className="mb-1 flex h-4 items-center justify-center">
          <Icon size={16} className="text-zinc-600" />
        </span>
        <span className="text-[10px] font-medium">{label}</span>
      </label>
    </div>
  );
}

/**
 * SidebarButtonGroupRow — a row of toggle-style buttons grouped inside a
 * pill (VisualTab shape selector). Each option is rendered with its icon
 * + label; the active option is highlighted.
 */
export function SidebarButtonGroupRow<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (next: T) => void;
  options: Array<{
    id: T;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-300 dark:border-zinc-700',
        className,
      )}
    >
      {options.map((opt) => {
        const active = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            title={opt.label}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md transition-all text-[9px] font-medium',
              active
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50',
            )}
          >
            <Icon size={12} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Chrome atoms — info box, collapsible panel
// ──────────────────────────────────────────────────────────────────────────

/**
 * SidebarInfoBox — bordered italic help-text container. Used as a footer
 * inside a SidebarTabContent (CanvasTab hint, CameraTab footer). Relies on
 * the parent's divide-y for its top border — does NOT draw its own.
 */
export function SidebarInfoBox({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(pad.section, className)}>
      <p className="text-[10px] text-zinc-400 leading-relaxed italic">{children}</p>
    </div>
  );
}

/**
 * SidebarCollapsiblePanel — VisualTab "Fx" pattern. The header is a button
 * that toggles expansion; the body is shown when `expanded` or `forceOpen`
 * is true. `status` shows next to the title (e.g. "Aktiv" / "Keine Effekte").
 */
export function SidebarCollapsiblePanel({
  title,
  status,
  expanded,
  forceOpen = false,
  onToggle,
  bodyClassName,
  children,
}: {
  title: React.ReactNode;
  status?: React.ReactNode;
  expanded: boolean;
  forceOpen?: boolean;
  onToggle: () => void;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const isOpen = expanded || forceOpen;
  return (
    <div className="space-y-4">
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        onClick={onToggle}
      >
        <span className="text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">
          {title}
        </span>
        {status ? <span className="text-[10px] text-zinc-500">{status}</span> : null}
        <span className="ml-auto text-zinc-500">
          {isOpen ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      {isOpen ? (
        <div
          className={cn(
            'space-y-4 rounded-lg border border-zinc-300/80 bg-zinc-50/85 p-3.5 dark:border-zinc-700 dark:bg-zinc-900/20',
            bodyClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SidebarDragPuck — shared chrome for CameraTab's orbit / pan / zoom
// widgets. The wrapper provides the zinc background, border, grid + cross-
// hair overlay, and drag-active border switch (--wn-accent). Each consumer
// supplies its own mouse handlers and puck so the per-widget interaction
// logic stays in the tab.
// ──────────────────────────────────────────────────────────────────────────

/**
 * SidebarViewPresetButton — CameraTab orbit-puck preset button. Two visual
 * variants share placement props (`className` controls absolute/flex
 * positioning):
 *   - 'axis' — round letter button on the puck face (Y / -X / X / -Y).
 *   - 'iso'  — small rounded marker at a puck corner (ISO 1..4), label
 *              omitted.
 */
export type SidebarViewPresetVariant = 'axis' | 'iso';

export function SidebarViewPresetButton({
  variant,
  label,
  title,
  onClick,
  className,
}: {
  variant: SidebarViewPresetVariant;
  label?: React.ReactNode;
  title?: string;
  onClick: () => void;
  className?: string;
}) {
  const base =
    variant === 'axis'
      ? 'pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors'
      : 'pointer-events-auto size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all';
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(base, className)}
    >
      {label}
    </button>
  );
}

export type SidebarDragPuckAspect = 'square' | 'wide';

const DRAG_PUCK_ASPECT: Record<SidebarDragPuckAspect, string> = {
  square: 'h-40',
  wide: 'h-32',
};

export function SidebarDragPuck({
  aspect,
  isDragging,
  onMouseDown,
  onDoubleClick,
  overlay,
  children,
  className,
}: {
  aspect: SidebarDragPuckAspect;
  isDragging?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: () => void;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      className={cn(
        'relative w-full bg-zinc-50 rounded-2xl border shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden',
        DRAG_PUCK_ASPECT[aspect],
        isDragging ? 'border-wn-accent' : 'border-zinc-200',
        className,
      )}
    >
      {overlay}
      {children}
    </div>
  );
}
