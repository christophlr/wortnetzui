 # Wortnetze — Style Guide

> **Read this file only when your task involves UI components or visual appearance.**
> For engine/physics/rendering detail, read `ARCHITECTURE.md` instead.

---

## UI Language
- **The UI must be German by default.** Labels, tooltips, and descriptions should be in German. 
- If easily feasible, detect system language and offer English, but the primary target is German.

---

## UI Conventions

### Scale Baseline
- `h-6` (24px) = maximum height for all **inline** controls: toggle buttons, icon buttons,
  label buttons, accordion headers, inline inputs.
- Exception: primary full-width action buttons (e.g. "Aktualisieren") may be taller.
- Text: `text-[11px]` labels/captions · `text-xs` accordion content · `text-sm` body copy only.

### SliderParam Rule
Every numeric slider value **must** be a `<button>` that opens an inline `<input>` on click:
- Commit: Enter / Tab / blur. Cancel: Escape. Always clamp to `[min, max]`.
- If displayed value ≠ raw value (e.g. ×10 scale), pass `parseInput` to invert.
- **Never** render a `<span>` for a numeric slider value.

### Colour Rule
- **UI**: `hsl(var(--...))` CSS variables. Never hardcode hex in React components.
- **3D scene**: use `networkTheme.ts` functions. Never hardcode scene colours inline.
- **2D and 3D must stay visually consistent**: if you change a colour, spacing, or label
  behaviour in one mode, check that the intent carries to the other.

### Layout Rule
- Inspector = docked right sidebar. Never floating.
- Toolbar = floating left, inside artboard, not fixed to browser window.
- Overlay elements (loading, dialogs) = positioned relative to Preview viewport, not window.
- TopBar = absolute top-0 inside main viewport div, `pointer-events-none` shell with
  `pointer-events-auto` on the pills.
- Timeline = absolute bottom-0 inside main viewport div.
- **Dynamic Offsets**: The `Preview` area is constrained by `top` and `bottom` offsets 
  calculated from the absolute UI bands. This prevents overlap while respecting the 
  absolute positioning requirement.

### Property Stack UI Pattern (Inspector)
- **Hierarchy Spacing**: In the Visual tab's full-width property stack, each section uses wider vertical rhythm and deeper indented control rows (`pl-5`) so headers, groups, and control values read as a clear parent-child hierarchy.
- **Legibility Contrast**: Section titles use stronger contrast, labels sit one step below, and value chips use bordered surfaces to separate readings from labels in a Figma-like property panel flow.

### Sidebar Activity Tabs
- In the Inspector's left activity bar, inactive tab buttons use the same subtle rounded hover rectangle as the toolbar buttons.
- The active tab indicator and selection styling stay unchanged; only the hover affordance is shared.


### Version Display Rule
- Lives in the **bottom-left of the artboard** (inside Preview).
- Displays: build number + last commit date/time.
- **Never touch this element unless explicitly asked. Never hardcode a version string.**

### Context Menu Rule
- **All** context menus (right-click) must use Shadcn/Radix `ContextMenu` components.
- Never use custom portals or floating divs for context menus.
- Menus must have `bg-popover/95` and `backdrop-blur-sm` for a professional, integrated look.

---

## Locked Visual Baseline

The following values describe the current intended appearance. Any change requires explicit
instruction. If implementing a non-visual feature causes you to touch these values,
restore them before submitting.

| Element | Value |
|---|---|
| **Node shape default** | `rectangle` |
| **Node fill** | Gradient: `#4f46e5` (low word count) → `#7c3aed` (high word count) |
| **Node fill in edit mode** | `#6b7280` (neutral gray) — ignores gradient |
| **Node text** | White · `600 28px "Space Grotesk", sans-serif` · centered · multi-line |
| **Node border** | 2px · same colour as fill gradient value for that node |
| **Node hover/select outline** | `#2563eb` (blue-600) · 3px · with gap from node boundary |
| **Edge colour** | `#9aa0aa` (auto default) |
| **Edge opacity** | `0.35` |
| **Edge width** | `2px` |
| **Edge render order** | Always behind nodes (`renderOrder 0` vs sprites at `renderOrder 1`) |
| **3D background — dark** | `#09090b` (zinc-950) |
| **3D background — light** | `#f8fafc` (slate-50) |
| **Pasteboard grid** | 40px cells · dark: `rgba(255,255,255,0.08)` · light: `rgba(0,0,0,0.06)` |
| **Artboard border** | `border-zinc-300` light / `border-white/10` dark · `rounded-[2px]` |
| **Artboard shadow** | `shadow-[0_30px_90px_rgba(0,0,0,0.4)]` |
| **Gizmo axis colours** | X `#ef4444` · Y `#22c55e` · Z `#60a5fa` |
| **Gizmo negative axes** | Same hue at 38% opacity |
| **Gradient presets** | Indigo→Violet · Cyan→Green · Purple→Pink · Orange→Red |
| **Node label font (canvas)** | `600 28px "Space Grotesk", sans-serif` |
| **UI baseline height** | `h-6` (24px) inline controls |
| **UI label text size** | `text-[11px]` |
| **TopBar pill height** | `h-11` (44px) |
| **TopBar pill style** | `bg-sidebar · rounded-xl · border · shadow-sm` |
| **Sidebar activity bar width** | `w-11` (44px) |
| **Toolbar style** | `bg-zinc-50/90 · backdrop-blur-md · rounded-2xl · border-zinc-200 · shadow-xl` |
| **Active tool button** | `bg-zinc-900 · text-white · rounded-lg` |
| **Inactive tool button** | `text-zinc-500 · hover:bg-zinc-200/50` |
| **Version badge** | Bottom-left of artboard · `text-[10px] font-mono text-muted-foreground/80` |
| **Keyframe Icons** | Semantic SVG shapes · 10px size · blue-500 when selected |
| **Context Menu Style** | `bg-popover/95` · `backdrop-blur-sm` · `border-border` · `rounded-lg` · `shadow-2xl` |

---

## shadcn/ui Components in Use

Subset of the 49 available components that are actively used in the app:

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
