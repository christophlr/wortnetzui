# Wortnetze — Project Overview & File Map

> **🤖 AI INSTRUCTION:** Do not look for standing orders here. All immutable rules and constraints are located in `./AGENTS.md`.

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
| `hooks/` | Contains `useTimelineHistory.ts` (undo/redo) and `useWorkspaceIO.ts` (save/load). |
| `components/shell/` | Modular layout components: `AppShell`, `AppSidebar`, `AppCanvas`. |
| `Network3D.tsx` | Three.js scene, RAF loop, camera, physics worker, hover/select. |
| `Preview.tsx` | Artboard wrapper, canvas mode, pasteboard, version/badge. |
| `Inspector.tsx` | Right sidebar with 5 tab panels. |
| `components/inspector/InspectorAtoms.tsx` | Shared atomic building blocks for inspector tab groups, subgroup headers, labels, and value chips. |
| `TopBar.tsx` & `Toolbar.tsx` | Floating UI overlays (menu, actions, tool picker). |
| `timeline/` | Modular animation workspace (Transport, Ruler, Dopesheet, Graph Editor). |
| `ui/` | shadcn/ui component library + local `color-picker.tsx`. |
| `.github/agents/inspector-atom-maintenance.agent.md` | Custom Copilot agent for inspector atom audits, semantic heading enforcement, and safe minimal refactors. |
| `.github/prompts/inspector-violations-review.prompt.md` | Slash prompt that outputs only inspector violations and acceptance checklist status. |
| `.github/skills/inspector-patch-summary/SKILL.md` | Skill for per-file before/after inspector refactor patch summaries. |
| `graph/` | N-gram extraction (`parsing.ts`) and off-thread physics (`physics.worker.ts`). |
| `networkTheme.ts` & `constants.ts` | 3D scene colour tokens and global constants. |

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 6 + TypeScript (strict) |
| 3D | Three.js r184 (imperative, NO react-three-fiber) |
| UI & CSS | shadcn/ui (Radix) + Tailwind v4 + CSS variables |
| State | React Context (`WortnetzContext`) + custom hooks |
| Physics | Web Worker with transferable `Float64Array` buffers |