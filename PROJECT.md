# Wortnetze — Project Description

> **Read this file before every task.** It contains the standing orders and file map.
> For deeper reference, read conditionally:
> - `ARCHITECTURE.md` — engine, physics, rendering, data flow
> - `STYLE_GUIDE.md` — UI components, visual appearance, locked baseline
> - `ROADMAP.md` — known gaps, planned features, migrations

---

## Standing Orders for AI Agents

These rules apply to every task, every session, without exception:

1. **Do not change any visual appearance unless explicitly asked.** Colors, fonts, spacing,
   shapes, opacity, shadows, gradients, icons, layout proportions, animation curves — all
   locked. See `STYLE_GUIDE.md` for the full baseline.
2. **Do not refactor, rename, or restructure code unless the task requires it.**
3. **Do not add, remove, or replace dependencies** without an explicit instruction.
4. **Do not change the text parsing logic** (`parsing.ts`) — it is the conceptual core of
   the artwork, not utility code.
5. **Do not move physics back to the main thread.** The Web Worker is intentional.
6. **Do not replace `THREE.Sprite` nodes with any other geometry.** Sprites are mandatory
   for the billboard/always-face-camera behaviour and z-ordering over edges.
7. **When in doubt about scope, ask — do not guess and over-deliver.**
9. **The UI must be German by default.** This project is primarily for a German-speaking
   audience. Labels, tooltips, and descriptions should be in German. If easily feasible,
   detect system language and offer English, but the primary target is German.
10. **After completing any code change, update the appropriate doc:**
    - Added/removed/moved a component → `PROJECT.md` (file map)
    - Changed engine, physics, or rendering → `ARCHITECTURE.md`
    - Changed visual appearance, colour, spacing, or UI pattern → `STYLE_GUIDE.md`
    - Completed a known gap or added a planned feature → `ROADMAP.md`
    - Pure internal refactor/bug fix with no behavioural change → no update needed.
11. **The orientation gizmo is deactivated.** It is hidden from the UI and its logic is commented out in `Network3D.tsx`. Camera zoom is now handled in the Inspector.

---

## What This Project Is

**Wortnetze** ("word networks") is a browser-based creative tool for visualising the
linguistic structure of text as an animated 3D/2D network graph. It is an **art and
research instrument**, not a dashboard.

The tool takes free-form text, extracts every overlapping word sub-phrase (n-gram) as a
node, and connects phrases to the phrases they contain. Users can animate the network
over a **professional keyframe timeline** (Dopesheet + Graph Editor), tune force-directed
physics with live visual previews, style node/edge appearance, and switch between 2D and 3D modes.

The **aesthetic target** is a professional creative application (Figma / After Effects),
not a prototype. The UI is **German by default** and designed for high-performance,
"snappy" interaction. This is achieved through a strict Zinc-based design system, unified
Radix-based context menus, and semantic iconography.

---

## File Map

| File | Role |
|---|---|
| `App.tsx` | Root component. Owns all React state. All callbacks. Layout shell. |
| `Network3D.tsx` | Three.js scene, RAF loop, camera, physics worker, hover/select. |
| `Preview.tsx` | Artboard wrapper, pasteboard, version badge, loading overlay. |
| `Inspector.tsx` | Right sidebar with 5 tab panels. |
| `TopBar.tsx` | Two floating pills: logo+menu (left), toggles+actions (right). |
| `Toolbar.tsx` | Vertical 5-tool picker (moved to App viewport overlay). |
| `timeline/` | Modular animation workspace: Transport, Ruler, Dopesheet, Graph Editor, ContextMenu. |
| `ShortcutsDialog.tsx` | Keyboard shortcut viewer/editor. |
| `figma/ImageWithFallback.tsx` | `<img>` with fallback placeholder. Utility only. |
| `ui/` | shadcn/ui component library (49 files). |
| `graph/parsing.ts` | N-gram extraction. **Do not change without explicit request.** |
| `graph/physics.ts` | Main-thread physics reference (not in hot path). |
| `graph/physics.worker.ts` | Off-thread physics with transferable buffers. |
| `graph/types.ts` | `GraphNode`, `GraphEdge`, `PhysicsParams`, `DEFAULT_PHYSICS`. |
| `networkTheme.ts` | 3D scene colour tokens. |
| `easing.ts` | Catmull-Rom + Hermite spline helpers. **Do not change.** |
| `constants.ts` | `TIMELINE_DURATION = 30`. |
| `vite.config.ts` | Build-time constants from git; chunk splitting; base path `/wortnetzui/`. |
| `scripts/sync-version.mjs` | Pre-dev/pre-build version sync from git commit count. |

---

## Technology Stack

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| Framework | React 18 + Vite 6 |
| 3D | Three.js r184 (imperative, no react-three-fiber) |
| UI | shadcn/ui (Radix + Tailwind v4) |
| CSS | Tailwind v4 + CSS variables (`hsl(var(--...))`) |
| Font | Space Grotesk (UI + 3D canvas textures) |
| Icons | Lucide React |
| State | React hooks only (no Redux, Zustand, or Context) |
| Physics | Web Worker with transferable `Float64Array` buffers |
| Build | Vite 6 + `@vitejs/plugin-react` + `@tailwindcss/vite` |
| Version | Git commit count → `0.XX`, injected by Vite `define` |
