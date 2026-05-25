# Wortnetze — Roadmap

This document outlines the current status of features, planned work, and known technical debt. For the detailed implementation plan, see `plan-timeline-update.md`.

## Active

- **Animation Phase 4.1.5: Segment-evaluator unification (next)**
  - Consolidate three Hermite call sites (`evaluateTracks` worker, camera keyframes, GraphEditor draw) onto a single `animation/segmentEvaluate.ts`.
- **Animation Phase 4.2: Visual effects pipeline (spike-gated)**
  - EffectComposer + UnrealBloomPass; add `Effekte` section to Visual tab; keyframeable bloom intensity.

## Planned

- **Animation Phase 5: Toolbar functionality**
  - Wire `activeTool` to canvas event handlers (currently dead UI).
  - Paint brush, navigation tools, glitch tool.
- **Future / Phase 6**
  - BPM / musical time, MIDI mapping, additional shader effects.
  - Auto-detect language activation (browser language behind opt-in toggle).

## Known Gaps

- **Phase 2 frozen features**: Shift-drag axis lock, Alt+background pan, time-reverse selection, easing click-cycle.
- **Glide UI**: Worker-side glide works but no timeline UI surfaces it (design pending per §3.6).
- **PathAnimatorUI**: Relies on legacy structures, not yet on the atomic pattern.

## Completed

- **Sidebar Refactor (Phases 1–4)**
  - Renamed Inspector → Sidebar, standardised cascade (`SidebarSection` → `SidebarGroup` → `SidebarRow`).
  - Atomic composition across all 5 tabs, semantic `--wn-*` CSS variables.
  - Shell extraction (`AppShell`, `AppCanvas`, `AppSidebar`), extended atom packs (TopBar, Toolbar, Timeline, Preview, Dialogs).
  - Full i18n with `i18next` (English source-of-truth, German default).
- **Animation Phase 1: Timeline correctness + atomization**
  - Unified undo via `useUndoStack.ts`, fixed history commit gaps, disabled recording (later rebuilt in Phase 3).
  - Expanded `TimelineAtoms.tsx`, partial hardcoded color sweep (marker/playhead/recording tokens done).
- **Animation Phase 2: Timeline interaction parity**
  - Arrow-key nudge, Cmd-A select all, Esc cancel drag, drag-to-pan, drag delta chip, track reset, context menu expansion, scene marker bulk-keyframe action.
- **Animation Phase 3: Worker-owned animation + Glide + LFO + Recording v2**
  - Single clock for param signals inside physics worker. Main thread: UI, render, message I/O.
  - Per-track LFO modulators, `Recorder.ts` sampling worker `appliedParams` at 30 Hz, per-track arm toggles.
  - Pulse parameter removed (superseded by LFO on repulsion/linkDistance).
- **Pre-Phase 4: Simulation stability & render budget**
  - RAF leak fix, GPU teardown, modulation-aware physics wake, allocation hygiene, spatial grid typed-array, 2D overlap gating.
- **Animation Phase 4.1: Network3D slim-composer extraction**
  - `Network3D.tsx` 1760 → 1198 lines (−32%). Logic now lives in `network3d/` (`textureCache`, `syncVisuals`, `workerGlue`) and `hooks/` (`useResizeObserver`, `useRaycastHover`, `useCameraFlyTo`, `usePhysicsWorkerSync`).