# Wortnetze — Roadmap

This document outlines the current status of features, planned work, and known technical debt. Full implementation plan: see `PLAN.md`.

## Active

## Planned

- **Phase 6.4 — MIDI mapping**:
  - Web MIDI device enumeration, MIDI Learn mode, CC normalisation, workspace serialization.

- **Node-Based Modulation (Patchbay) System (Future)**:
  - Transition from static modulators to a visual patching system. Detailed design proposal: [NODE_MODULATION.md](file:///Users/christoph/Documents/Code/wortnetzui/NODE_MODULATION.md).
  - Highlights: custom glassmorphic node UI, bidirectional sidebar inspector tabs, topological compiler, and 60Hz worker execution.

## Known Gaps

- **Phase 2 frozen features**: Shift-drag axis lock, Alt+background pan, time-reverse selection, easing click-cycle. Explicitly deferred.

## Completed

- **Phase 6.3 — Node shapes & centered picker**:
  - Widen `NodeShape` from string union to discriminated object; add triangle, hexagon, octagon, and parametric star (arms 3-12, inner ratio 0.2-0.8).
  - Per-shape area compensation so inscribed shapes match rectangle visual size.
  - New `SidebarCenteredPicker` atom modeled on Figma's Effects dropdown — the active option is vertically centered on the trigger when opened, giving a cycling feel.
  - Migrate Shape control and post-FX kind selectors in `VisualTab.tsx` to the new atom; reveal arms/innerRatio sliders only when `kind === 'star'`.
  - Workspace migration for legacy string-shape values.
- **Phase 6.3b — Hover-reveal reorder handle**:
  - New `SidebarReorderRow` atom in `SidebarAtoms.tsx`: grip indicator (`GripVertical`) appears on the left edge of sidebar list rows on hover (modeled on Figma's Fill panel) with a reserved 12px gutter so layout doesn't shift.
  - Drag handle is the grip only (`onMouseDown` arms drag); whole row is the drop target. HTML5 drag-and-drop, no new dependency.
  - 1px accent-color drop indicator at the target row's top edge during dragover.
  - Keyboard: focused grip accepts `↑`/`↓` to reorder by one position.
  - Wired to the Effects list in `VisualTab.tsx`; a local `reorderEffect(fromIndex, toIndex)` splices `effectsList` through the existing `setVisual` flow. Order persists through workspace save/load.
- **Phase 6.3a — Shape-switch performance**:
  - Async-chunked texture rebuild in `Network3D.tsx`: cancellable in-flight rebuild token, first 32-node batch synchronous for immediate visual feedback, remaining batches dispatched via `requestIdleCallback` (fallback `setTimeout(_, 0)`).
  - Shape-only fast path in `textureCache.ts`: each cache entry stores `LayoutMetrics` (`logicalWidth`, `logicalHeight`, `words`); shape / border / theme rebuilds reuse them through `createCanvasTextureFromLayout`, skipping `measureText`.
  - Highlighted / selected variants now also reuse cached layout instead of recomputing it.
  - Extended `docs/phase-6-perf-baseline.md` with the "Shape-Switch (300 Nodes)" scenario and memory-allocation notes.
- **Phase 6.2 — BPM / musical time**:
  - Added global `globalBpm`, `globalBpmEnabled`, and `timelineGridSubdivision` to `visualSettings`, serialized in workspace.
  - Extended `Modulator` with `bpmSync?` flag; `evalLfo(m, t, globalBpm)` now uses the live global tempo when sync is enabled. Legacy `bpm?` values migrate to `bpmSync: true` on load.
  - `TimelineRuler` switches to Bar.Beat labels in beat mode; `useTimelineView` snaps to the chosen musical subdivision.
  - Timeline transport toolbar gained a Music-icon beat-mode toggle, an inline BPM editor (20–300), and a subdivision dropdown (1/1 … 1/16).
  - `LfoControls` BPM scrubber writes through to the global context, so all synced modulators retime in unison.
- **Phase 6.1 — Additional shader effects**:
  - Implemented dynamic-reordering post-processing pipeline supporting Unreal Bloom, Vignette, Chromatic Aberration (Radial/Horizontal), Film Grain (Color/Monochrome), and Pixelation.
  - Exposed keyframeable intensity, offset, and size parameters on the timeline and added fully localized control cards in the Sidebar's Visual tab.
- **Phase 5.5 — Pre-Phase 6 Audits**:
  - Audit α: Implemented a lightweight, direct-DOM FPS counter toggle under `View → Debug → Show FPS` and recorded baseline benchmarks in `docs/phase-6-perf-baseline.md`.
  - Audit β: Modularized the Toolbar and VisualTab card UI (shipped as part of 5.1).
- **Phase 5.1 — Defect fixes & Toolbar Atomization**:
  - A1/A2: Extended `TimelineState` with `paintedOverrides` + `pathNodes`; push undo history at stroke-end / path-mutation.
  - A3: Extracted shared `PaintedOverride` type; sync `colorBlend` into `WorkspaceState`.
  - B1: Fixed glitch-tool raycast (camera-aligned plane through COM, not hardcoded z=0).
  - B2: Removed dead `undefined` writes in paint hot-path.
  - B3: Moved `[`/`]` brush hotkeys into `useShortcuts.ts`.
  - C1–C3: Shortcut ToolId typing, `readOverride()` helper, path-tool toggle alignment.
  - D: Extracted 5 new `ToolbarAtoms`; replaced inline `VisualTab` brush card with `SidebarToggleRow` (then refactored).
  - Waypoint Loop & Reorder: Implemented HTML5 drag reordering and loop options for the path animator.
  - Save/Load Overrides: Renamed saved files prefix to `wortnetze` and forced immediate override sync upon load.
  - Brush Edits UI: Rebuilt Brush Edits component with paintbrush icon matching the effects section card style.
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