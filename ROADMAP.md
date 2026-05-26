# Wortnetze — Roadmap

This document outlines the current status of features, planned work, and known technical debt. Full implementation plan: see `PLAN.md`.

## Active

- **Phase 5.1 — Phase 5 defect fixes** (see `PLAN.md` for full detail):
  - A1/A2: Extend `TimelineState` with `paintedOverrides` + `pathNodes`; push undo history at stroke-end / path-mutation.
  - A3: Extract shared `PaintedOverride` type; sync `colorBlend` into `WorkspaceState`.
  - B1: Fix glitch-tool raycast (camera-aligned plane through COM, not hardcoded z=0).
  - B2: Remove dead `undefined` writes in paint hot-path.
  - B3: Move `[`/`]` brush hotkeys into `useShortcuts.ts`.
  - C1–C3: Shortcut ToolId typing, `readOverride()` helper, path-tool toggle alignment.
  - D: Extract 5 new `ToolbarAtoms`; replace inline `VisualTab` brush card with `SidebarToggleRow`.

- **Phase 5.5 — Pre-Phase 6 audits** (parallel, after 5.1):
  - Audit α: FPS counter + performance baseline doc.
  - Audit β: Atomic extraction pass (subsumes D above).

## Planned

- **Phase 6** (order: shaders → BPM → MIDI):
  - 6.1: Additional shader effects (Vignette, Chromatic Aberration, Film Grain — `EffectComposer` pattern already established).
  - 6.2: BPM / musical time (`Modulator.bpm` scaffold exists; needs beat-ruler UI + global BPM context).
  - 6.3: MIDI mapping (no groundwork — Web MIDI API, learn mode, serialization).

## Known Gaps

- **Phase 2 frozen features**: Shift-drag axis lock, Alt+background pan, time-reverse selection, easing click-cycle. Explicitly deferred.
- **Toolbar atomic debt**: `Toolbar.tsx` popover content is inline JSX (no atoms for segmented-picker, popover rows, path items). Addressed in Phase 5.1-D.

## Completed

- **Animation Phase 5: Toolbar functionality**:
  - Wired `activeTool` to canvas event handlers via the new `useToolHandlers` hook in `Network3D.tsx`.
  - Implemented 6 interactive canvas tools: `pointer` (clicking selects nodes, double-clicking flies camera), `pan` (left-mouse camera panning), `zoom` (vertical drag dolly), `paint` (paint brush overrides for node color, scale, opacity, and eraser), `glitch` (radial shockwave impulse applied directly to physical node velocities), and `path` (click to select nodes for the path animator).
  - Integrated a premium SVG paintbrush cursor overlay displaying the brush size and color/eraser modes with smooth size transitions.
  - Added support for global hotkeys (`[` and `]`) to dynamically resize the paintbrush when not typing.
  - Integrated `paintedOverrides` serialization and deserialization across workspace save and load routines.
- **Modulator Waveforms & UI Icons Upgrade**:
  - Implemented four new modulator waveforms (Sawtooth Up `sawtooth`, Sawtooth Down `sawtoothDown`, Step Random `random`, and Smooth Random `noise`).
  - Added a deterministic pseudo-random `hash` generator to ensure Step Random and Smooth Random animations are scrubbable and repeatable.
  - Upgraded the modulator waveform picker to use Lucide React icons (`Spline`, `Triangle`, `Square`, `TrendingUp`, `TrendingDown`, `Dice5`, and `Waves`).
  - Generalized the shared `SidebarSegmentedPicker` to support custom `React.ReactNode` labels.
- **Canvas Background Customization**:
  - Added a dedicated "Canvas Background" configuration group under the "Nodes" section in the Visuals tab.
  - Implemented color picker with automatic theme default fallbacks (dark: `#09090b`, light: `#f8fafc`) and a quick-reset trash button to clear custom backgrounds.
- **Bloom Parameter Normalization & Fine-Tuning**:
  - Normalized selective bloom boosting by computing node color relative luminance (Rec. 709), scaling the boost factor dynamically so all hues glow with uniform intensity.
  - Lowered default `bloomIntensity` (from 0.4 to 0.15) and `bloomRadius` (from 0.85 to 0.4) to eliminate blinding whiteout.
  - Refined slider ranges (max intensity 2.0, max radius 1.5) and smoothed step sizes (0.01) in the Visual tab and LFO depth settings for subtle, precise control.
- **Popover-based Modulator & Glide Controls**:
  - Unified the modulator UI under a single Popover pattern for both the Physics Tab and Visual Tab (Bloom settings).
  - Clicking the wave button immediately enables a default modulator if inactive and opens the popover, avoiding double-clicking.
  - Placed LFO controls and Glide parameter settings inside the popover to keep the settings lists clean and avoid vertical layout clipping.
- **Animation Phase 4.3: Bloom Refinements, Unified Effects Panel & Path Animator System**
  - Consolidated effects lists (`effectsList`) and path node serialization across saves and loads.
  - Implemented Catmull-Rom path drawing, animated emissive orb, active trail line, and smooth camera tracking in `Network3D.tsx`.
  - Created a unified Figma-style "Effects" section with settings Popovers, type-cycling Select triggers, visibility toggles, and deletion.
- **Animation Phase 4.1.5: Segment-evaluator unification**
  - Consolidated three Hermite call sites (`evaluateTracks` worker, camera keyframes, GraphEditor draw) onto a single `animation/segmentEvaluate.ts`.
- **Animation Phase 4.2: Visual effects pipeline**
  - EffectComposer + UnrealBloomPass; added `Effekte` section to Visual tab; keyframeable bloom intensity.
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
- **Layout Overhaul & Physics Centering (Pro App Style)**
  - Transitioned the entire app layout to a nested `ResizablePanelGroup` with persistent component trees (no WebGL canvas resets when toggling the sidebar).
  - Replaced legacy linear-grid margins and card framing with full-bleed rendering and a modern radial dot grid backdrop.
  - Implemented crop guide letterbox/pillarbox safe-frame overlays for non-full aspect ratio selections.
  - Added Center of Mass coordinate and velocity drift correction inside `physics.worker.ts` to prevent the network from drifting away and disappearing when friction (damping) is low.