# Plan: Phase 5 Audit, Fix-ups, and Phase 6 Sequencing

> **Status: ACTIVE — approved 2026-05-26**
> Next step: Phase 6.3 — Node shapes & centered picker, then 6.3b — Hover-reveal reorder handle. (6.3a Shape-switch performance ✅ done.)

## Context

Phase 5 (Animation Phase 5: Toolbar functionality — 6 interactive canvas tools, paintbrush cursor, painted-overrides, glitch impulses, path animator) is shipped per `ROADMAP.md`. Before opening Phase 6, we audit Phase 5 for real defects, capture carry-over gaps, and order Phase 6 (shaders, BPM, MIDI — auto-detect language is already shipped and is dropped from scope). Two cross-cutting audits — performance and atomic structure — slot in as a "Pre-Phase 6" pair, mirroring the Pre-Phase 4 pattern.

Decisions locked in:
- **Full undo/redo coverage** for paint AND path edits.
- **Fix the glitch raycast properly** (no z=0 hack).
- **Atomic extraction of Toolbar happens now**, before Phase 6.
- Phase 6 order: audits → shaders → BPM → shape-switch perf (6.3a) → node shapes & centered picker (6.3) → hover-reveal reorder handle (6.3b) → MIDI (6.4).

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

### 6.2 — BPM / musical time ✅ DONE
- Global BPM + beat-mode flag + grid subdivision live in `visualSettings`, serialized in workspace.
- Timeline transport toolbar exposes a Music-icon beat-mode toggle, an inline BPM editor (20–300), and a subdivision dropdown (1/1 … 1/16).
- `TimelineRuler` switches to Bar.Beat labels when beat mode is on; `useTimelineView` snaps to the chosen subdivision.
- `Modulator.bpmSync?` replaces the legacy `bpm?` field: modulators with `bpmSync: true` follow the global BPM live; legacy `bpm` values migrate to `bpmSync: true` on workspace load.
- `LfoControls` BPM scrubber writes through to the global context, so all synced modulators retime in unison.

### 6.3a — Shape-switch performance ✅ DONE

Today, changing `nodeShape` triggers a synchronous full-cache rebuild ([Network3D.tsx:1411-1418](src/app/components/Network3D.tsx#L1411-L1418)) — N canvas redraws + N GPU uploads in one frame. At ~300 nodes this is a ~120-250ms block. Adding parametric shapes in 6.3 makes this path hotter (arm-count slider would rebuild on every tick if uncontrolled), so the fix lands first.

- **P1. Async chunking in `rebuildAndRefreshTextures`** ([Network3D.tsx:595-608](src/app/components/Network3D.tsx#L595-L608)). Split the node iteration into ~32-node batches dispatched via `requestIdleCallback` (fallback `setTimeout(_, 0)`). First batch runs synchronously so the user sees immediate change. Cancel any in-flight rebuild before starting a new one.
- **P2. Shape-only fast path in `textureCache`** ([textureCache.ts:35-148](src/app/network3d/textureCache.ts#L35-L148)). When only `nodeShape` changes (text/font/border identical), skip `measureText` and reuse cached layout metrics keyed by label. Extend `TextureCacheEntry` with `layout: { logicalWidth, logicalHeight, words }`.
- **P3. Debounce parametric-shape changes** — `nodeShape` will become an object (see 6.3); slider-driven fields (`arms`, `innerRatio`) get the same 80ms debounce already used for `nodeBorderWidth` ([Network3D.tsx:1421-1429](src/app/components/Network3D.tsx#L1421-L1429)).
- **P4. Extend perf baseline doc** with a "shape-switch (300 nodes)" scenario in [docs/phase-6-perf-baseline.md](docs/phase-6-perf-baseline.md). Capture before/after frame-time for the rebuild block.

### 6.3 — Node shapes & centered picker

Adds parametric star + polygon family, replaces the 3-button shape row with a new centered-picker atom, and migrates the Effects dropdowns to the same atom for cycling-feel consistency.

**S1. Widen `NodeShape`** ([networkTheme.ts:10](src/app/networkTheme.ts#L10)) from a string union to a discriminated object:
```ts
type NodeShape =
  | { kind: 'rectangle' }
  | { kind: 'rounded-rectangle' }
  | { kind: 'ellipse' }
  | { kind: 'triangle' }
  | { kind: 'hexagon' }
  | { kind: 'octagon' }
  | { kind: 'star'; arms: number; innerRatio: number };
```
Thread through `styleSettings` ([WortnetzContextTypes.ts](src/app/context/WortnetzContextTypes.ts)), workspace IO, and the texture cache key (use `JSON.stringify` of the shape object as part of the key; include only relevant params). Provide a migration for legacy string values on workspace load.

**S2. Shape draw functions** ([textureCache.ts:71-94](src/app/network3d/textureCache.ts#L71-L94)). Extract `drawShape(ctx, cx, cy, w, h, shape)` and `drawShapeStroke(ctx, ...)` helpers. Star uses `arms * 2` points alternating outer / inner radius; polygons (triangle/hex/oct) use `n` points on the ellipse circumference. Apply per-shape area compensation so a star inscribed in the same bbox doesn't look smaller than a rectangle (~1.15× scale for star, ~1.05× for triangle).

**S3. `SidebarCenteredPicker` atom** (`src/app/components/sidebar/SidebarAtoms.tsx`). Modeled on Figma's Effects dropdown (see screenshots): trigger shows the active option with a chevron; on open, the menu positions so the active row is **vertically centered on the trigger**, giving cycling-through-options feel. Built on Radix `DropdownMenu` (already in `ui/dropdown-menu.tsx`) with a custom `align`/`sideOffset` computed from the index of the active item and the row height. Active row gets the selected style (Figma's blue highlight → our `--wn-accent`).
- API: `<SidebarCenteredPicker<T> value options onChange renderOption? />` where `options: { id: T; label: string; icon?: ComponentType }[]`.
- Keyboard: arrow keys move selection (Radix default); Enter commits; the open animation is short (~120ms) so it feels like a wheel.

**S4. Migrate consumers**:
- Shape control in `VisualTab.tsx` (replaces `SidebarButtonGroupRow` at [VisualTab.tsx:346-349](src/app/components/sidebar/tabs/VisualTab.tsx#L346-L349)). When the active shape is `star`, reveal an inline panel below with two `SidebarSliderRow`s: `arms` (3-12, integer) and `innerRatio` (0.2-0.8).
- Effects-section dropdowns currently in `VisualTab.tsx` (post-FX kind selectors). Same atom, same behaviour.

**S5. i18n + presets.** New keys: `sidebar.tab.visual.shape.{triangle,hexagon,octagon,star}`, `sidebar.tab.visual.shape.arms`, `sidebar.tab.visual.shape.innerRatio` (DE + EN parity). Default star: 5 arms, 0.4 inner ratio.

**Out of scope for 6.3** (defer to Phase 7+):
- Per-node shape overrides (paint-tool integration).
- Shader-based shape rendering (the canvas pipeline stays).

### 6.3b — Hover-reveal reorder handle (sidebar list rows)

Figma's Fill panel (see reference screenshot) shows a small grip indicator on the **left edge** of each list row only on hover — when the user drags it, the row reorders. We want the same affordance on the Effects list in `VisualTab.tsx` (and any other reorderable sidebar list). Reuses the existing `effectsList` ordering in `visualSettings` ([WortnetzContextTypes.ts:144](src/app/context/WortnetzContextTypes.ts#L144)).

**H1. `SidebarReorderRow` atom** (`src/app/components/sidebar/SidebarAtoms.tsx`). Wraps any sidebar row and reveals a `GripVertical` icon (`lucide-react`, already imported in `ToolbarAtoms`) on the left edge on hover. Layout: 12px reserved gutter, icon `opacity-0` → `opacity-60` on `group-hover`. Cursor `grab` over the icon, `grabbing` while dragging. No layout shift on hover (gutter is always reserved).
- API: `<SidebarReorderRow index onReorder>{children}</SidebarReorderRow>` where `onReorder(fromIndex, toIndex)` mirrors the existing `ToolbarPathItem` contract ([ToolbarAtoms.tsx:175-220](src/app/components/toolbar/ToolbarAtoms.tsx#L175-L220)).
- Drag implementation: HTML5 drag-and-drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`), same as `ToolbarPathItem` — no new dependency. The whole row is the drop target; only the grip area is the drag handle (`onMouseDown` on grip sets a ref-flag the row's `onDragStart` checks).
- Visual drop indicator: a 1px `--wn-accent` line at the target row's top edge during dragover (Figma matches this).

**H2. Wire to Effects list** in `VisualTab.tsx`. Each effect row is wrapped in `SidebarReorderRow`. Add a `reorderEffect(fromIndex, toIndex)` mutator to `WortnetzContext.tsx` that splices `effectsList`. Order persists through workspace save/load (already serialized).

**H3. Accessibility & keyboard.** Grip gets `role="button"`, `aria-label="Reorder"`, and `tabIndex={0}`. `↑`/`↓` while focused on the grip calls `onReorder(i, i±1)`. Skip if there's already a Radix sortable in use elsewhere — we're not adopting a new lib for this.

**Out of scope for 6.3b**:
- Touch drag (HTML5 DnD is mouse-only; defer touch to Phase 7 if needed).
- Animated row reflow during drop — pure index swap is enough for now.

### 6.4 — MIDI mapping
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
| Perf (6.3a) | `src/app/components/Network3D.tsx` | Chunked rebuild scheduler; debounce parametric-shape deps |
| Perf (6.3a) | `src/app/network3d/textureCache.ts` | Shape-only fast path; cache layout metrics on `TextureCacheEntry` |
| Perf (6.3a) | `docs/phase-6-perf-baseline.md` | New "shape-switch (300 nodes)" scenario row |
| Shapes (6.3) | `src/app/networkTheme.ts` | Widen `NodeShape` to discriminated object; export shape defaults |
| Shapes (6.3) | `src/app/network3d/textureCache.ts` | `drawShape` / `drawShapeStroke` helpers; star + polygon draw |
| Shapes (6.3) | `src/app/context/WortnetzContextTypes.ts` | New `NodeShape` type threaded through `styleSettings` |
| Shapes (6.3) | `src/app/hooks/useWorkspaceIO.ts` | Legacy string-shape → object migration on load |
| Picker (6.3) | `src/app/components/sidebar/SidebarAtoms.tsx` | New `SidebarCenteredPicker` atom (active row centered on trigger) |
| Picker (6.3) | `src/app/components/sidebar/tabs/VisualTab.tsx` | Replace shape button-row + post-FX kind dropdowns with new atom; reveal arm/innerRatio sliders when `kind === 'star'` |
| i18n (6.3) | `src/app/i18n/locales/{de,en}.json` | Triangle/hexagon/octagon/star labels + arms/innerRatio strings |
| Reorder (6.3b) | `src/app/components/sidebar/SidebarAtoms.tsx` | New `SidebarReorderRow` atom with hover-reveal grip handle |
| Reorder (6.3b) | `src/app/components/sidebar/tabs/VisualTab.tsx` | Wrap each effect row in `SidebarReorderRow`; pass index + onReorder |
| Reorder (6.3b) | `src/app/context/WortnetzContext.tsx` | `reorderEffect(fromIndex, toIndex)` mutator splicing `effectsList` |
| i18n (6.3b) | `src/app/i18n/locales/{de,en}.json` | `aria.reorder` label string |

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
- **Phase 6.3a verification**:
  - Shape-switch on the 300-node graph no longer drops a frame (FPS counter stays ≥ 58 across the rebuild).
  - Baseline doc updated with before/after numbers for the new shape-switch scenario.
  - Border-width slider behaviour unchanged (still debounced; no regression).
- **Phase 6.3 verification**:
  - All 7 shapes selectable from the new picker; active row visually centered on trigger.
  - Star arm/innerRatio sliders only visible when `kind === 'star'`; sliders debounce rebuilds.
  - Workspace round-trip: save with a star → reload → arms/innerRatio survive.
  - Legacy workspaces (string `nodeShape`) load without error and map to the matching object.
  - i18n parity check passes; DE + EN both show new shape labels.
  - Effects-section dropdowns visually identical to before but use the new atom (same option set, centered open).
- **Phase 6.3b verification**:
  - Hovering an effect row reveals the grip on the left edge with no layout shift.
  - Drag-and-drop reorders the effect; new order survives workspace save/reload.
  - `↑`/`↓` on a focused grip moves the row by one position.
  - Pipeline re-composes in the new order (verify visually that swapping e.g. Bloom ↔ Vignette changes final compositing).
