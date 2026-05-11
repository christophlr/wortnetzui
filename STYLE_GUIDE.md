# Wortnetze — Style Guide

> **Read this file only when your task involves UI components or visual appearance.**
> For engine/physics/rendering detail, read `ARCHITECTURE.md` instead.

---

## UI Language
- **The UI must be German by default.** Labels, tooltips, and descriptions should be in German. 
- If easily feasible, detect system language and offer English, but the primary target is German.

---

## UI Conventions

### Theme Modes
- **Light**: White UI + light 3D background.
- **Dark**: Dark UI + dark 3D background.
- Managed via the `themeMode` state in `WortnetzContext` and the `.dark` class on the `<html>` element.

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
- **AppShell Architecture**: The layout is managed as a set of structural siblings: `AppSidebar` (right), `Timeline` (bottom), and `AppCanvas` (center/background).
- **Inspector**: A docked right sidebar. Never floating. Resizable via handle.
- **Timeline**: A docked bottom panel. Never floating. Resizable via handle.
- **Toolbar**: Floating left, inside artboard, not fixed to browser window.
- **Overlay Elements**: Loading spinners, version badges, etc., must be positioned relative to the `AppCanvas` / `Preview` viewport, not the full browser window.
- **Visual Parity**: The `Preview` component handles the 3D network rendering within the artboard. The model remains in the space *between* panels (not under them), especially for the timeline and sidebar.

### Property Stack UI Pattern (Inspector)
- The **Visualisierung** (Visuals) tab uses a high-density "Property Stack" layout.
- **Section Headers**: Use standard `SidebarGroupLabel` styling with a global visibility toggle (eye icon) on the far right.
- **Segmented Controls**: Prefer horizontal icon-button groups (Figma-style) with `bg-zinc-100` and `bg-white` active states.
- **Density**: Use `text-[11px]` and standard sidebar background for consistent visual flow.
- **Readouts**: Numeric values should be subtle monospaced readouts (`text-zinc-400`) aligned to the right.


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
