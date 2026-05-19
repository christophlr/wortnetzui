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
 *   5  SidebarValueChip / SidebarKeyframeToggle / SidebarModulatorButton / SidebarSliderTrack /
 *      SidebarEditableNumber / SidebarDescription / SidebarSegmentedPicker
 *                                  inline pieces that fill the slots of a level-4 row
 *
 * Rhythm & Typography Rules:
 * - Subgroup headings (`SidebarGroup`): `text-[12px] font-semibold`.
 * - Section titles (`SidebarSection`): `text-[12px] font-semibold tracking-[0.03em]`.
 * - Numeric slider readings must use `SidebarEditableNumber` or `SidebarValueChip`.
 * - New tabs or subgroups MUST reuse these shared atoms first. Do not hand-roll fresh 
 *   spacing, heading, or value-chip class stacks unless a shared atom is missing.
 * - Visual rules are sourced from the `--wn-*` and shadcn semantic tokens
 *   (`text-foreground`, `text-muted-foreground`, `border-border`,
 *   `bg-wn-control-bg`, `bg-wn-info-bg`, `border-wn-divider`). Raw
 *   `zinc-*` palette classes must not be reintroduced here — the tokens
 *   carry both light and dark values.
 */

import * as React from 'react';
import { Diamond, Eye, EyeOff, Minus, Plus, AudioWaveform } from 'lucide-react';
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
        'text-[13px] font-bold text-muted-foreground uppercase tracking-wider',
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
  showIndicator = true,
  className,
}: {
  active: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
  /** When false the left-edge accent bar is hidden (collapse button). */
  showIndicator?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        'group relative flex h-10 w-10 items-center justify-center transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-1 rounded-lg transition-colors group-hover:bg-wn-control-hover"
      />
      <Icon
        size={20}
        className={cn(
          'relative transition-transform duration-200 origin-center will-change-transform',
          active ? 'scale-105 group-hover:scale-110' : 'scale-100 group-hover:scale-110',
        )}
      />
      {active && showIndicator ? (
        <div className="absolute left-0 h-5 w-0.5 bg-wn-accent rounded-r-full" />
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
            <h2 className="flex-1 text-foreground text-[12px] font-semibold tracking-[0.03em]">
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
  actions,
  children,
}: {
  title?: React.ReactNode;
  stack?: SidebarGroupStack;
  /**
   * Optional inline-trailing controls (e.g. a randomize button) rendered on
   * the same baseline as the title, aligned to the right — mirroring the
   * value-chip column used by SidebarSliderRow.
   */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const stackClass =
    stack === 'loose' ? pad.subgroupLoose : stack === 'snug' ? pad.subgroupSnug : pad.subgroup;
  return (
    <div className={stackClass}>
      {title || actions ? (
        <div className="flex items-center justify-between gap-2">
          {title ? (
            <h3 className="flex-1 text-[12px] font-semibold text-foreground">
              {title}
            </h3>
          ) : (
            <div className="flex-1" />
          )}
          {actions ? (
            <div className="flex items-center gap-1 shrink-0">{actions}</div>
          ) : null}
        </div>
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
        'font-mono text-[12px] font-semibold text-foreground bg-wn-control-bg border border-wn-divider px-2 py-0.5 rounded',
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
      className={cn('text-[10px] text-muted-foreground leading-tight', className)}
      {...props}
    />
  );
}

/**
 * SidebarSegmentedPicker — a row of mutually-exclusive button segments.
 * Generic over T so it works for string labels (waveforms) and numeric rates
 * (BPM subdivisions) alike.  Fills the `slider` slot of `SidebarSliderRow`.
 */
export function SidebarSegmentedPicker<T extends string | number>({
  items,
  value,
  onChange,
}: {
  items: { label: string; value: T; title?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1">
      {items.map((item) => (
        <button
          key={String(item.value)}
          type="button"
          title={item.title}
          onClick={() => onChange(item.value)}
          className={cn(
            'flex-1 h-6 rounded-sm text-[11px] font-medium border transition-colors',
            item.value === value
              ? 'bg-wn-accent-soft border-wn-accent text-foreground'
              : 'border-wn-divider text-muted-foreground hover:text-foreground',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
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
          : 'text-muted-foreground hover:text-foreground hover:bg-wn-control-bg',
      )}
    >
      <Diamond className={cn('size-2.5', active && 'fill-current')} />
    </button>
  );
}

export const SidebarModulatorButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { active: boolean }
>(function SidebarModulatorButton({ active, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'size-5 rounded-full flex items-center justify-center transition-colors',
        active
          ? 'text-wn-keyframe-active bg-wn-accent-soft border border-wn-accent/40 shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-wn-control-bg',
        className,
      )}
      {...props}
    >
      <AudioWaveform className="size-2.5" />
    </button>
  );
});

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
          'w-14 h-6 text-[10px] px-1 py-0 text-center border-border',
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
        'text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors',
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
        <span className="flex-1 text-[12px] font-medium text-foreground">
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

export function SidebarToggleRow({
  label,
  checked,
  onCheckedChange,
  description,
  className,
}: {
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  description?: React.ReactNode;
  className?: string;
}) {

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 text-[12px] font-medium text-foreground">
          {label}
        </span>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="scale-90 data-[state=checked]:bg-wn-accent"
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
      <label className="text-[10px] font-semibold text-muted-foreground">
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
        className="mt-0.5 border-border text-foreground"
      />
      <label
        htmlFor={id}
        className="text-[12px] font-semibold leading-tight cursor-pointer group-hover:text-foreground text-foreground transition-colors"
      >
        {label}
        {description ? (
          <p className="text-[10px] text-muted-foreground font-normal mt-1">{description}</p>
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
        className="flex flex-col items-center justify-center rounded-md border border-border bg-wn-info-bg p-2 hover:bg-wn-control-bg peer-data-[state=checked]:border-wn-accent peer-data-[state=checked]:bg-wn-accent-soft cursor-pointer transition-all"
      >
        <span className="mb-1 flex h-4 items-center justify-center">
          <Icon size={16} className="text-muted-foreground" />
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
        'flex bg-wn-control-bg rounded-lg p-1 border border-wn-divider',
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
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-wn-control-bg/60',
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
// Section action atoms — small icon buttons used in a SidebarSection's
// `actions` slot. Replace per-tab hand-rolled visibility eyes and shuffle
// dice so the click target, hover styling, and token use stay unified.
// ──────────────────────────────────────────────────────────────────────────

export function SidebarVisibilityToggle({
  visible,
  onToggle,
  title,
}: {
  visible: boolean;
  onToggle: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={title}
      className={cn(
        'p-0 transition-colors',
        visible
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {visible ? <Eye size={13} /> : <EyeOff size={13} />}
    </button>
  );
}

export function SidebarSectionActionButton({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-wn-control-bg transition-all"
    >
      <Icon size={13} />
    </button>
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
      <p className="text-[10px] text-muted-foreground leading-relaxed italic">{children}</p>
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
        <span className="text-foreground text-[12px] font-semibold tracking-[0.03em]">
          {title}
        </span>
        {status ? <span className="text-[10px] text-muted-foreground">{status}</span> : null}
        <span className="ml-auto text-muted-foreground">
          {isOpen ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      {isOpen ? (
        <div
          className={cn(
            'space-y-4 rounded-lg border border-wn-divider bg-wn-info-bg p-3.5',
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
      ? 'pointer-events-auto size-5 rounded-full bg-wn-control-bg border border-border shadow-sm flex items-center justify-center text-[8px] font-bold text-muted-foreground hover:bg-card hover:text-foreground transition-colors'
      : 'pointer-events-auto size-4 rounded bg-wn-control-bg/60 hover:bg-card border border-transparent hover:border-border transition-all';
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
        'relative w-full bg-wn-info-bg rounded-2xl border shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden',
        DRAG_PUCK_ASPECT[aspect],
        isDragging ? 'border-wn-accent' : 'border-border',
        className,
      )}
    >
      {overlay}
      {children}
    </div>
  );
}
