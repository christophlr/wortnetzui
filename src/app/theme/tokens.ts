/**
 * Theme tokens — typed bridge between styles/theme.css and atom packs.
 *
 *   A. CssVarName  — documentary union of every CSS variable theme.css exposes.
 *   B. pad         — spacing-class aliases consumed by SidebarAtoms.
 *   C. GRADIENT_PRESETS — typed atmosphere-gradient palette (home pending UI).
 *
 * Adding a CSS variable to theme.css? Add it to CssVarName too.
 */

// A. CSS-var registry (documentary; no runtime cost).
export type CssVarName =
  // Shell + surface
  | '--background' | '--foreground' | '--card' | '--card-foreground'
  | '--shell-background' | '--preview-background' | '--canvas-background'
  | '--popover' | '--popover-foreground'
  // Brand / state
  | '--primary' | '--primary-foreground'
  | '--secondary' | '--secondary-foreground'
  | '--muted' | '--muted-foreground'
  | '--accent' | '--accent-foreground'
  | '--destructive' | '--destructive-foreground'
  | '--border' | '--input' | '--input-background'
  | '--switch-background' | '--ring' | '--interactive' | '--radius'
  | '--font-size' | '--font-weight-medium' | '--font-weight-normal'
  // Sidebar surface (shadcn-defined)
  | '--sidebar' | '--sidebar-foreground'
  | '--sidebar-primary' | '--sidebar-primary-foreground'
  | '--sidebar-accent' | '--sidebar-accent-foreground'
  | '--sidebar-border' | '--sidebar-ring'
  // Wortnetz action accents
  | '--wn-accent' | '--wn-accent-soft' | '--wn-keyframe-active'
  | '--wn-divider' | '--wn-control-bg' | '--wn-info-bg';

/** Helper to produce a typed `var(--…)` CSS string. */
export const themeVar = (name: CssVarName): string => `var(${name})`;

// B. Spacing aliases — pure className constants, no runtime cost.
export const pad = {
  section: 'px-5 py-5',
  sectionStack: 'space-y-5',
  subgroup: 'space-y-3',
} as const;

// C. Gradient presets (typed; home for the four-preset palette).
export interface GradientPreset {
  /** Display name; will flow through i18n in Phase 4. */
  name: string;
  inner: string;
  outer: string;
}

export const GRADIENT_PRESETS: readonly GradientPreset[] = [
  { name: 'Indigo → Violett', inner: '#4f46e5', outer: '#7c3aed' },
  { name: 'Cyan → Grün',      inner: '#06b6d4', outer: '#10b981' },
  { name: 'Lila → Pink',      inner: '#a855f7', outer: '#ec4899' },
  { name: 'Orange → Rot',     inner: '#f97316', outer: '#ef4444' },
] as const;
