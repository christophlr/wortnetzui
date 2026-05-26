# Plan: Phase 5 Audit, Fix-ups, and Phase 6 Sequencing

> **Status: ACTIVE — approved 2026-05-26**
> Next step: Phase 6.2 — BPM / musical time.

## Context

Phase 5 (Animation Phase 5: Toolbar functionality — 6 interactive canvas tools, paintbrush cursor, painted-overrides, glitch impulses, path animator) is shipped per `ROADMAP.md`. Before opening Phase 6, we audit Phase 5 for real defects, capture carry-over gaps, and order Phase 6 (shaders, BPM, MIDI — auto-detect language is already shipped and is dropped from scope). Two cross-cutting audits — performance and atomic structure — slot in as a "Pre-Phase 6" pair, mirroring the Pre-Phase 4 pattern.

Decisions locked in:
- **Full undo/redo coverage** for paint AND path edits.
- **Fix the glitch raycast properly** (no z=0 hack).
- **Atomic extraction of Toolbar happens now**, before Phase 6.
- Phase 6 order: audits → shaders → BPM → MIDI.

---

## Phase 5.1 — Defect fixes

### A. State-coverage gaps (critical)

**A1. Extend `TimelineState` to include `paintedOverrides` and `pathNodes`.**
- `src/app/context/WortnetzContextTypes.ts:40-45` — add both fields to `TimelineState`.
- `src/app/context/WortnetzContext.tsx:153` — `useUndoStack<TimelineState>` initial value gets the two new fields.
- Update `getTimelineState` and the undo/redo apply path to set both states.

**A2. Push history at the right granularity.**
- **Paint:** push once per stroke (pointer-up), not per pixel. In `useToolHandlers.ts` emit a `bag.onStrokeEnd?.()` callback; the context wires it to `pushHistory({ ...getTimelineState() })`. Capture pre-stroke snapshot on pointer-down so a stroke is one undo unit.
- **Path:** push on add / remove / reorder. Mutators in `WortnetzContext.tsx` (`reorderPathNodes`, `removePathNode`, `clearPath`, add) each get a `pushHistory` call mirroring the physics/camera mutators around lines 299/305/340.

**A3. Sync `WorkspaceState.paintedOverrides` type — extract a shared `PaintedOverride` type.**
- `useWorkspaceIO.ts:22` omits `colorBlend`; `WortnetzContextTypes.ts:240` includes it. Saving silently drops `colorBlend`.
- Define `export type PaintedOverride = { color?: string; colorBlend?: number; scale?: number; opacity?: number }` in `WortnetzContextTypes.ts`. Import it everywhere: `useWorkspaceIO.ts`, `useToolHandlers.ts`, `WortnetzContext.tsx`, `syncVisuals.ts`.

### B. Logic / hot-path fixes

**B1. Glitch tool — proper raycast.**
- `useToolHandlers.ts:312-314` hardcodes a `z=0` world plane.
- Replace with a camera-aligned plane through the cluster's COM. Derive COM from `workerPosVelRef` once per click (it's already on main thread). Plane normal = `camera.getWorldDirection()`, point = COM.
- Hoist `THREE.Plane` and `clickPoint: THREE.Vector3` to module scope (no per-click allocations).

**B2. Paint hot-path — remove dead `undefined` writes.**
- `useToolHandlers.ts:163` writes `{ color: undefined, colorBlend: undefined, ... }` for erase, then line 179 just `delete`s it.
- For erase: collect labels into a reusable scratch array; do `delete next[label]` per label directly.

**B3. Move `[` and `]` brush-size hotkeys into `useShortcuts.ts`.**
- Currently a `useEffect`-bound listener in `Network3D.tsx` with `[activeTool, brushRadius, setBrushRadius]` deps — reattaches on every brush-size change.
- Move into the central shortcut manager; gate on `activeTool === 'paint'`. Add to `ShortcutsDialog.tsx`.

### C. Consistency / cleanup

- **C1.** Key tool-id shortcuts off the `ToolId` union (not hardcoded strings) in `useShortcuts.ts`.
- **C2.** Extract `readOverride(node, field, vs, paintedOverrides)` helper in `syncVisuals.ts` — triplet repeated for scale/opacity/color.
- **C3.** Align path-tool click toggle with pointer-tool (`useToolHandlers.ts:275-280`).

### D. Atomic-structure refactor in Toolbar (subsumes old "PathAnimatorUI" debt)

`PathAnimatorUI.tsx` no longer exists — inlined into `Toolbar.tsx` in 5afc93a5. Extract these new atoms into `src/app/components/toolbar/ToolbarAtoms.tsx`:

- `ToolbarSegmentedPicker` — paint-mode `grid-cols-4` block (≈ lines 88-107).
- `ToolbarPopoverRow` — ColorPicker / Scrubber groupings (≈ lines 113-187).
- `ToolbarPopoverHeader` — path-animator section header (≈ lines 219-235).
- `ToolbarPathItem` — waypoint list row (≈ lines 246-266).
- `ToolbarActionButton` — "Clear paint" / clear-all variants (≈ lines 190-198).

Also replace the inline "Brush Edits" card in `VisualTab.tsx:313-340` with `SidebarToggleRow`.

Keep `ToolbarAtoms` independent from `SidebarAtoms` (different visual shells).

### Known gaps explicitly carried (not in scope for 5.1)

- **Phase 2 frozen features** — Shift-drag axis lock, Alt+background pan, time-reverse selection, easing click-cycle. Stay deferred.

---

## Phase 5.5 — "Pre-Phase 6" audits (parallel tracks)

### Audit α — Performance & memory baseline

- Add lightweight **FPS counter** behind `View → Debug → Show FPS` toggle (RAF deltas; zero cost when off).
- Record a baseline doc (`docs/phase-6-perf-baseline.md`): (i) idle settled network, (ii) playback + 2 armed LFO tracks, (iii) paint-drag at max brush radius, (iv) glitch impulse on 500-node graph. FPS, JS heap, GPU buffer count.
- Confirm no per-frame allocations remain after B1/B2.

### Audit β — Atomic extraction

This is item D above — execute as one focused pass. α and β touch different files, can ship as parallel PRs.

---

## Phase 6 — order

**Drop:** Auto-detect language — already shipped (`LanguageDetector` in `i18n/index.ts`, `LANGUAGE_AUTO_KEY` in `TopBar.tsx`, View → Language → "Auto" works).

### 6.1 — Additional shader effects
`EffectComposer` + `effectsList` pattern already exists in `network3d/effectsPipeline.ts`. Add 2-3 new passes (Vignette, Chromatic Aberration, Film Grain). Each gets a row in the Effects section in `VisualTab.tsx` + keyframeable params per the bloom pattern.

### 6.2 — BPM / musical time
`Modulator.bpm?` scaffolded in `Modulator.ts:41`; worker clock is centralised. Work is mostly UI:
- Global BPM in `WortnetzContext` (serialized in workspace).
- Timeline beat-ruler overlay + snap mode.
- Modulator rate input toggles Hz ↔ beat-divisions (1/4, 1/8, 1/16, 1/4T…).

### 6.3 — MIDI mapping
No Web MIDI usage today. Full stack: device enumeration → MIDI Learn mode → CC normalisation → workspace serialization. Depends on 6.2 + perf baseline.

---

## Critical files

| Area | File | Change |
|------|------|--------|
| Types | `src/app/context/WortnetzContextTypes.ts` | Extend `TimelineState`; export `PaintedOverride` |
| State | `src/app/context/WortnetzContext.tsx` | Stroke-end + path-mutation history pushes |
| Undo | `src/app/hooks/useUndoStack.ts` | No change; consumes widened type |
| Tool | `src/app/hooks/useToolHandlers.ts` | Alloc fix; glitch raycast; `onStrokeEnd`; path toggle |
| Shortcuts | `src/app/hooks/useShortcuts.ts` | Own `[`/`]`; key off `ToolId` |
| Dialog | `src/app/components/ShortcutsDialog.tsx` | Document brush hotkeys |
| Canvas | `src/app/components/Network3D.tsx` | Remove local brush-size listener |
| Save | `src/app/hooks/useWorkspaceIO.ts` | Import `PaintedOverride` (gains `colorBlend`) |
| Visuals | `src/app/network3d/syncVisuals.ts` | `readOverride()` helper |
| Toolbar | `src/app/components/Toolbar.tsx` | Replace inline JSX with new atoms |
| Atoms | `src/app/components/toolbar/ToolbarAtoms.tsx` | 5 new atoms |
| Sidebar | `src/app/components/sidebar/tabs/VisualTab.tsx` | Inline card → `SidebarToggleRow` |
| Docs | `ROADMAP.md` | Mark auto-detect done; restate Phase 6 order |

---

## Verification

- `npm run typecheck` clean.
- i18n parity check: `node -e "const d=require('./src/app/i18n/locales/de.json'),e=require('./src/app/i18n/locales/en.json');const dk=Object.keys(d).filter(k=>!(k in e)),ek=Object.keys(e).filter(k=>!(k in d));if(dk.length||ek.length){console.error('Missing:',{de:dk,en:ek});process.exit(1)}else console.log('OK')"`.
- App.tsx ≤ 180 lines.
- Manual smoke:
  - Paint nodes → ⌘Z restores.
  - Add/remove/reorder path nodes → ⌘Z restores.
  - Save → reload → `colorBlend` survives round-trip.
  - `[`/`]` resize brush (typing suppressed).
  - Glitch impulse tracks screen click even when cluster has drifted off z=0.
  - Toolbar visually identical after atom extraction (browser side-by-side).
- Perf baseline doc committed before any Phase 6 code lands.
