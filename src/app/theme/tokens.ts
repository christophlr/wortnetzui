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
  | '--wn-accent' | '--wn-accent-muted' | '--wn-accent-soft' | '--wn-keyframe-active'
  | '--wn-divider' | '--wn-control-bg' | '--wn-control-hover' | '--wn-info-bg'
  // Brand + TopBar state (Phase 3.3)
  | '--wn-brand-blue'
  | '--wn-topbar-toggle-active' | '--wn-topbar-toggle-active-hover'
  | '--wn-topbar-toggle-text' | '--wn-topbar-toggle-border'
  // Timeline keyframe + marker (Phase 3.3)
  | '--wn-timeline-kf-selected' | '--wn-timeline-kf-selected-stroke' | '--wn-timeline-kf-selected-outline'
  | '--wn-timeline-marker-fill' | '--wn-timeline-marker-selected'
  | '--wn-timeline-playhead' | '--wn-timeline-recording'
  // Timeline transport + per-color tracks
  | '--wn-timeline-transport-active' | '--wn-timeline-drag-select' | '--wn-timeline-bg'
  | '--wn-timeline-cyan-kf-fill' | '--wn-timeline-cyan-graph-stroke'
  | '--wn-timeline-cyan-dot' | '--wn-timeline-cyan-border' | '--wn-timeline-cyan-track-bg'
  | '--wn-timeline-orange-kf-fill' | '--wn-timeline-orange-graph-stroke'
  | '--wn-timeline-orange-dot' | '--wn-timeline-orange-border' | '--wn-timeline-orange-track-bg'
  // Chart palette (defined in .dark scope)
  | '--chart-1' | '--chart-2' | '--chart-3' | '--chart-4' | '--chart-5';

/** Helper to produce a typed `var(--…)` CSS string. */
export const themeVar = (name: CssVarName): string => `var(${name})`;

// Theme persistence + OS detection (mirrors the Language Auto pattern
// in src/app/i18n/index.ts). `themeMode` stays concrete ('light' | 'dark');
// `themeAuto` flags that the user picked "System" so the app should follow
// prefers-color-scheme in real time.
export const THEME_STORAGE_KEY = 'wortnetze.theme';
export const THEME_AUTO_KEY = 'wortnetze.theme.auto';

export function resolveSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// B. Spacing aliases — pure className constants, no runtime cost.
export const pad = {
  section: 'px-5 py-5',
  // Stack scales for SidebarSection: normal (default) | snug.
  sectionStack: 'space-y-5',
  sectionStackSnug: 'space-y-4',
  // Stack scales for SidebarGroup: tight (default) | snug | loose.
  subgroup: 'space-y-3',
  subgroupSnug: 'space-y-3.5',
  subgroupLoose: 'space-y-4',
} as const;

// C. Gradient presets (typed; home for the four-preset palette).
export interface GradientPreset {
  /** Display name for programmatic use. When a gradient-picker UI lands, names should be
   *  looked up via i18n rather than stored here directly. */
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
