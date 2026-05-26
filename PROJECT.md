# Wortnetze — Project Overview & File Map

> **🤖 AI INSTRUCTION:** PROJECT.md = file map and reverse index. AGENTS.md = standing constraints. ARCHITECTURE.md = system design. STYLE_GUIDE.md = visual rules. VOCABULARY.md = string ↔ code mapping.

## What This Project Is
**Wortnetze** ("word networks") is a browser-based creative tool for visualising the linguistic structure of text as an animated 3D/2D network graph. It is an **art and research instrument**, not a dashboard. 
The aesthetic target is a professional creative application (Figma / After Effects).

## File Map

<file_map_update_protocol>
  <constraint>If you create, delete, or rename a file, you MUST update this table immediately in the same prompt response.</constraint>
</file_map_update_protocol>

| File / Directory | Role |
|---|---|
| `App.tsx` | Slim layout composer. Delegates all state and logic to `WortnetzContext`. |
| `context/WortnetzContext.tsx` | **Single source of truth.** Owns all React state and core handlers. |
| `hooks/` | Contains `useUndoStack.ts` (undo/redo), `useWorkspaceIO.ts` (save/load), `useResizeObserver.ts` (container size sync), `useRaycastHover.ts` (sprite hover/click/dblclick), `useCameraFlyTo.ts` (camera fly-to + target lerp), and `usePhysicsWorkerSync.ts` (physics worker message routing + step dispatch). |
| `components/shell/` | Modular layout components: `AppShell`, `AppSidebar`, `AppCanvas`. |
| `Network3D.tsx` | Three.js scene, RAF loop, camera, physics worker, hover/select. |
| `Preview.tsx` | Artboard wrapper, canvas mode, pasteboard, version/badge. |
| `components/preview/PreviewAtoms.tsx` | Atomic components for the preview surface. |
| `components/Sidebar.tsx` | Right sidebar with 5 tab panels. |
| `components/sidebar/tabs/` | Individual tab components for the sidebar. |
| `components/sidebar/SidebarAtoms.tsx` | Shared atomic building blocks for sidebar tabs. |
| `TopBar.tsx` & `Toolbar.tsx` | Floating UI overlays (menu, actions, tool picker). |
| `components/topbar/TopBarAtoms.tsx` | Atomic components for the TopBar. |
| `components/toolbar/ToolbarAtoms.tsx` | Atomic components for the Toolbar. |
| `timeline/` | Modular animation workspace (Transport, Ruler, Dopesheet, Graph Editor). |
| `components/timeline/TimelineAtoms.tsx` | Atomic components for the timeline. |
| `components/dialogs/DialogAtoms.tsx` | Atomic components for dialogs. |
| `theme/tokens.ts` | CSS variable tokens and spacing aliases. |
| `i18n/` | Internationalization config and locales (`en.json`, `de.json`). |
| `ui/` | shadcn/ui component library + local `color-picker.tsx`. |
| `.github/agents/sidebar-atom-maintenance.agent.md` | Custom agent for sidebar atom audits, semantic heading enforcement, and safe minimal refactors. |
| `.github/prompts/sidebar-violations-review.prompt.md` | Slash prompt that outputs only sidebar violations and acceptance checklist status. |
| `.github/skills/sidebar-patch-summary/SKILL.md` | Skill for per-file before/after sidebar refactor patch summaries. |
| `graph/` | N-gram extraction (`parsing.ts`) and off-thread physics (`physics.worker.ts`). |
| `animation/` | Animation engine: `evaluateTracks.ts`, `interpolatePhysicsParam.ts`, `Track.ts`, `Modulator.ts`, `Recorder.ts`. |
| `network3d/textureCache.ts` | Pure label-texture builder + 3-state sprite cache (normal/highlighted/selected). Extracted from `Network3D.tsx` (Phase 4.1). |
| `network3d/syncVisuals.ts` | Pure per-frame visual sync (sprite position/scale/opacity/color + edge buffer update). Extracted from `Network3D.tsx` (Phase 4.1). |
| `network3d/workerGlue.ts` | Pure physics-worker message helpers (init/settle/step payload build, posVel pack/unpack) and 2D overlap separation pass. Extracted from `Network3D.tsx` (Phase 4.1). |
| `context/WortnetzContextTypes.ts` | Type definitions for the global context (split from `WortnetzContext.tsx`). |
| `context/WortnetzContextConstants.ts` | Constants and param-to-track mappings used by the context. |
| `networkTheme.ts` & `constants.ts` | 3D scene colour tokens and global constants. |
| `NODE_MODULATION.md` | Architecture design proposal for the node-based modulation/patchbay system. |

## Reverse Index

| Concept | File Location |
|---|---|
| Where does the node modulation design live? | `NODE_MODULATION.md` |
| Where does undo/redo live? | `hooks/useUndoStack.ts` |
| Where is the project saved/loaded? | `hooks/useWorkspaceIO.ts` |
| Where are shortcuts defined? | `hooks/useShortcuts.ts` |
| Where is the Three.js render loop? | `Network3D.tsx` |
| Where does node physics happen? | `graph/physics.worker.ts` |
| Where is the text parsed into nodes? | `graph/parsing.ts` |
| Where do I change the language? | `i18n/` and `components/TopBar.tsx` |
| Where is the atomic sidebar UI built? | `components/sidebar/SidebarAtoms.tsx` |

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 6 + TypeScript (strict) |
| 3D | Three.js r184 (imperative, NO react-three-fiber) |
| UI & CSS | shadcn/ui (Radix) + Tailwind v4 + CSS variables |
| State | React Context (`WortnetzContext`) + custom hooks |
| Physics | Web Worker with transferable `Float64Array` buffers |