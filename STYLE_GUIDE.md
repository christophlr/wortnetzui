# Wortnetze — Style Guide

> **🤖 AI INSTRUCTION:** Read this file only when your task involves UI components or visual appearance.

**Atom-first rule**: Every UI surface composes from its own `*Atoms.tsx` pack. Hand-rolled className stacks or hex values in `.tsx` files are violations. CSS variables are the only color source.

---

## UI Language
- **English is the source of truth in code** (variable names, JSON keys, comments).
- **German is the displayed default.** UI text MUST be loaded through `useTranslation()` — never hardcoded literals.
- **Locale files** live at `src/app/i18n/locales/de.json` (primary) and `en.json` (fallback). Both files must stay in key parity.
- **Canonical reference**: `src/app/components/Sidebar.tsx` — the sidebar and its tabs are the golden example of correct i18n wiring.

---

## UI Conventions

### Canonical Code References (Golden Examples)
When generating new components, strictly reference the following files for the current architectural standard:
- **UI Toolbars:** Reference `@src/components/Toolbar.tsx`
- **Numeric Sliders:** Reference `@src/components/ui/SliderParamTemplate.tsx`
- **Sidebar Panels:** Reference `@src/components/Sidebar.tsx`
- **Context Menus:** Reference the Shadcn/Radix implementation in `@src/components/timeline/`

### Scale Baseline
- `h-6` (24px) = maximum height for all **inline** controls (toggle buttons, icon buttons, label buttons, accordion headers, inline inputs).
- Exception: primary full-width action buttons (e.g. "Aktualisieren") may be taller.
- Text: `text-[11px]` labels/captions · `text-xs` accordion content · `text-sm` body copy only.

### SliderParam Rule
Every numeric slider value **must** be a `<button>` that opens an inline `<input>` on click:
- Commit: Enter / Tab / blur. Cancel: Escape. Always clamp to `[min, max]`.
- If displayed value ≠ raw value (e.g. ×10 scale), pass `parseInput` to invert.
- **Never** render a `<span>` for a numeric slider value.

### Modulator & Glide Popover Pattern
- Sliders supporting modulation (Physics parameters and Bloom Intensity) expose a **Modulator** (wave) button between the value input and keyframe toggle.
- Clicking the Modulator button auto-enables a default modulator (if none was active) and opens a Popover containing the Glide and LFO controls.
- Inside the popover, an "Enable modulator" toggle switch lets the user disable/enable the modulator. This design keeps the sidebar and visual settings clean and avoids layout clipping.

### Toolbar Popovers Pattern
- Creative tools requiring active parameters or sequence lists (like the Paintbrush and Path Animator) anchor their setting/list overlays as side popovers attached to their respective toolbar buttons.
- These popovers must use `bg-popover/95` and `backdrop-blur-sm` for a premium, integrated aesthetic. Floating canvas cards are prohibited.

### Colour Rule
- **UI**: `hsl(var(--...))` CSS variables. Never hardcode hex in React components.
- **3D scene**: use `networkTheme.ts` functions. Never hardcode scene colours inline.
- **2D and 3D must stay visually consistent**: if you change a colour, spacing, or label
  behaviour in one mode, check that the intent carries to the other.

### Layout Rule
- **Resizable Panel Architecture**: The layout uses `<ResizablePanelGroup>` blocks. 
  - Main workspace splits vertically between the viewport (Canvas) and Timeline.
  - The right sidebar is a horizontal split with the workspace. When collapsed, it locks to `48px` width (activity bar only).
- Sidebar = docked right sidebar. Never floating.
- Toolbar = floating left, inside Canvas panel, not fixed to browser window.
- Overlay elements (loading, dialogs) = positioned relative to Preview viewport, not window.
- TopBar = absolute top-0 inside main viewport Canvas panel, `pointer-events-none` shell with
  `pointer-events-auto` on the pills.
- Timeline = docked inside its own vertical `ResizablePanel` below the Canvas panel.
- **Auto-sizing**: Resizing the panels automatically updates container sizes; legacy dynamic offset calculations are completely removed.

### Property Stack UI Pattern (Sidebar)
- **Hierarchy Spacing**: In the Visual tab's full-width property stack, each section uses wider vertical rhythm and deeper indented control rows (`pl-5`) so headers, groups, and control values read as a clear parent-child hierarchy.
- **Legibility Contrast**: Section titles use stronger contrast, labels sit one step below, and value chips use bordered surfaces to separate readings from labels in a Figma-like property panel flow.

### Sidebar Hierarchy Atoms
- Sidebar subgroup UI is composed from shared atoms in `src/app/components/sidebar/SidebarAtoms.tsx`.
- Required hierarchy is: `Sidebar` -> `Tab` -> `SidebarGroup` -> `Control row`.
- **Note:** Detailed rhythm and typography rules for these atoms are documented in the JSDoc header of `SidebarAtoms.tsx`.

### Sidebar Activity Tabs
- In the Sidebar's left activity bar, inactive tab buttons use the same subtle rounded hover rectangle as the toolbar buttons.
- The active tab indicator and selection styling stay unchanged; only the hover affordance is shared.

### Version Display Rule
- Lives in the **bottom-left of the artboard** (inside Preview).
- Displays: build number + last commit date/time.
- **Never touch this element unless explicitly asked. Never hardcode a version string.**

### Context Menu Rule
- **All** context menus (right-click) must use Shadcn/Radix `ContextMenu` components.
- Never use custom portals or floating divs for context menus.
- Menus must have `bg-popover/95` and `backdrop-blur-sm` for a professional, integrated look.

### Tooltip Design Rule
- When adding or upgrading tooltips for interactive icons or buttons (e.g. `SidebarSegmentedPicker`, `ToolButton`), use the custom `<Tooltip>` wrapper from `@src/components/ui/tooltip.tsx`.
- Disable the default arrow styling by passing the `hideArrow` prop.
- Set appropriate positioning (`side="top"` or `side="right"`) and offset (`sideOffset={6}` or `sideOffset={8}`) to avoid visual overlap.

### Timeline Track Tuning
- The timeline’s per-track tuning panel (beneath the Graph Editor) shows **Modulator** controls only; Glide tuning is not displayed in timeline tracks.

---

## Locked Visual Baseline

*(Drift-prone — re-verify quarterly)*

The following values describe the current intended appearance. Any change requires explicit
instruction. If implementing a non-visual feature causes you to touch these values,
restore them before submitting.

| Element | Hex / Value | CSS Variable |
|---|---|---|
| **Node shape default** | `rectangle` | - |
| **Node fill** | Gradient: `#4f46e5` → `#7c3aed` | - |
| **Node fill in edit mode** | `#6b7280` (neutral gray) | - |
| **Node text** | White · `600 28px "Space Grotesk", sans-serif` | - |
| **Node border** | 2px · same colour as fill gradient | - |
| **Node hover/select outline** | `#2563eb` (blue-600) | - |
| **Edge colour** | `#9aa0aa` (auto default) | - |
| **Edge opacity** | `0.35` | - |
| **Edge width** | `2px` | - |
| **Edge render order** | Always behind nodes | - |
| **3D background — dark** | `oklch(0.16 0 0)` (refined dark charcoal) | - |
| **3D background — light** | `#ffffff` | - |
| **Dot grid** | 24px cells · radial-gradient · dark `rgba(255,255,255,0.08)` / light `rgba(0,0,0,0.05)` | - |
| **Crop Guide Overlay** | Dashed border · semi-transparent `rgba(9,9,11,0.6)` letterbox mask | - |
| **Gizmo axis colours** | X `#ef4444` · Y `#22c55e` · Z `#60a5fa` | - |
| **Gizmo negative axes** | Same hue at 38% opacity | - |
| **Gradient presets** | Indigo→Violet · Cyan→Green · Purple→Pink · Orange→Red | - |
| **Node label font (canvas)** | `600 28px "Space Grotesk", sans-serif` | - |
| **UI baseline height** | `h-6` (24px) inline controls | - |
| **UI label text size** | `text-[11px]` | - |
| **TopBar pill height** | `h-11` (44px) | - |
| **TopBar pill style** | `bg-sidebar · rounded-xl · border · shadow-sm` | `--topbar-pill-bg` |
| **Sidebar activity bar width** | `w-11` (44px) | - |
| **Toolbar style** | `bg-zinc-50/90 · backdrop-blur-md · rounded-2xl` | - |
| **Active tool button** | `bg-zinc-900 · text-white · rounded-lg` | `--wn-accent` |
| **Inactive tool button** | `text-zinc-500 · hover:bg-zinc-200/50` | - |
| **Version badge** | Bottom-left of Canvas viewport panel | - |
| **Keyframe Icons** | Semantic SVG shapes · 10px size | `--wn-timeline-keyframe-fill` |
| **Context Menu Style** | `bg-popover/95` · `backdrop-blur-sm` · `border-border` | - |

---

## shadcn/ui Components in Use

The following shadcn components are actively used in the app:

`Button`, `Textarea`, `Input`, `RadioGroup` / `RadioGroupItem`, `Switch`, `Separator`,
`Slider`, `Sidebar` / `SidebarContent` / `SidebarHeader` / `SidebarGroup` /
`SidebarGroupContent` / `SidebarGroupLabel` / `SidebarProvider`,
`Menubar` / `MenubarMenu` / `MenubarTrigger` / `MenubarContent` / `MenubarItem` /
`MenubarSeparator` / `MenubarShortcut` / `MenubarRadioGroup` / `MenubarRadioItem` /
`MenubarLabel`,
`ToggleGroup` / `ToggleGroupItem`, `Dialog` / `DialogContent` / `DialogHeader` /
`DialogTitle` / `DialogDescription` / `DialogFooter`,
`Progress`, `Tooltip`, `ContextMenu` / `ContextMenuTrigger` / `ContextMenuContent` / `ContextMenuItem` / `ContextMenuSeparator` / `ContextMenuSub` / `ContextMenuSubTrigger` / `ContextMenuSubContent`.

Always prefer an existing shadcn component before writing a custom one.
