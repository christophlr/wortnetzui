# Wortnetze — Animation, Visuals & Tools Roadmap

## Context

The sidebar atomic refactor (`plan.md`) is the immediate predecessor. With sidebar discipline established, the next surfaces in scope are **Timeline**, the **physics ↔ keyframe contract**, **Network3D**, and the **Toolbar**. An audit of each surface revealed concrete problems plus a deeper architectural tension:

- **Timeline.tsx** (532 lines) is mostly sound but atomically thin: `TimelineAtoms.tsx` exports only 2 atoms vs. the sidebar's 13+. `TrackRow`, `TrackGroup`, value chips, and keyframe toggles are all hand-rolled in `TimelineTracks.tsx`.
- **Two undo systems coexist**: [`hooks/useTimelineHistory.ts`](src/app/hooks/useTimelineHistory.ts) exists but is unused — an inline duplicate stack lives at [WortnetzContext.tsx:97-127](src/app/context/WortnetzContext.tsx#L97-L127). The ARCHITECTURE.md "debounced commit" claim is fiction.
- **History bug**: [`handleSetValue` (WortnetzContext.tsx:552-575)](src/app/context/WortnetzContext.tsx#L552-L575) never calls `pushHistory` — graph value drags are not undoable.
- **Recording is broken**: the button toggles `isRecording` but no code samples parameter values; `useRecordingHistory` only manipulates the undo stack.
- **Hardcoded colors** in timeline files: `text-purple-400`, `bg-red-500` ×2, `text-red-500`. Unused export `TimelineContextMenu`.
- **Physics-keyframe momentum tension** is a design problem, not a bug ([Network3D.tsx:1421-1451](src/app/components/Network3D.tsx#L1421-L1451) + [physics.worker.ts:51](src/app/graph/physics.worker.ts#L51)): keyframes override parameters, but node velocities persist. Friction decays them slowly (log-decay); the system "drifts" after keyframes end.
- **Network3D.tsx** (1973 lines) needs trimming before more physics or visual complexity lands: 9 ref-sync `useEffect`s, dead `applyingKeyframe`/`frameCount`, commented gizmo block, no EffectComposer for glow/bloom.
- **Toolbar tools** render but `activeTool` (context state, exists) is never read by canvas event handlers in Network3D. Tools are dead UI.
- **Existing `pulse` parameter** ([Network3D.tsx:1484-1492](src/app/components/Network3D.tsx#L1484-L1492)) is a hardcoded sine on repulsion+linkDistance — already a primitive LFO seed.

Long-term aspirations (BPM sync, MIDI mapping, recordings, LFO modulators, brush tools, post-processing effects) all share an architectural choke point: the param-blend region [Network3D.tsx:1421-1492](src/app/components/Network3D.tsx#L1421-L1492). Resolving the momentum tension means inserting a layer there — and that layer is the same layer that hosts LFOs and modulators later.

**Architectural target (Phase 3 north star):** the "destination + glide" model, borrowed jointly from DAW automation (Bitwig/Ableton modulator chains) and 3D animation constraint blending (Maya/Houdini cloth-with-goal). Keyframes drive a **target** value; physics damps toward it at a configurable settle rate; modulators (LFO/MIDI/BPM later) layer on top of the target.

```
keyframe value ─┐
LFO output    ──┼──→ target ──→ physics worker damps toward target
manual UI     ──┘                (per-track settle time)
```

This single indirection unlocks every long-term goal without re-architecting again.

---

## Guiding principles

1. **Atom-first** — every UI surface composes from its own `*Atoms.tsx` pack. Continuation of the sidebar contract.
2. **Each phase ships independently** — a phase boundary is a working app, not a "halfway state."
3. **Simplicity by default, complexity behind disclosure** — every new feature has a zero-config default that matches current behavior. Advanced knobs live behind collapsed panels or per-item menus. The user opts in to complexity; they never face it unsolicited.
4. **No interweaving Phase 3 and Phase 4** — both touch [Network3D.tsx:1421-1492](src/app/components/Network3D.tsx#L1421-L1492), but separately. P3 rewires the block to read from a new evaluator (animation concern). P4 extracts it into a hook + adds EffectComposer (rendering concern). The same 70 lines are touched twice, but each touch is small, scoped, and shippable.

---

## Model + effort selection guide

The roadmap spans ~80–100 small commits across 5 active phases. Cost discipline matters. Switch models between turns with `/model`. Higher effort = more thinking time per response. Each numbered subsection below carries a *suggested: model / effort* tag. **These are non-binding** — if Sonnet stalls on judgment, escalate to Opus next turn; if a step is more mechanical than expected, drop to Haiku.

| Task type | Anthropic (Claude Code) | Gemini equivalent (Antigravity) | Why |
|---|---|---|---|
| Architectural decisions, evaluator design, sim-correctness work, debugging unexplained breakage | **Opus 4.7 / max** (fast mode on) | **Gemini Pro 3.1 / high** | Real judgment; no good cheaper substitute |
| Hard refactors that may surface design questions (Network3D extraction, paintbrush UX, modulator UI) | **Opus 4.7 / high** | **Gemini Pro 3.1 / high** | Cheaper than max but still thoughtful |
| Pattern-following work — extracting atoms following a known shape, replacing literals with token vars, applying an established hook pattern across files | **Sonnet 4.6 / medium** | **Gemini Pro 3.1 / low** | ~5× cheaper than Opus, fully capable for "copy this pattern" work |
| Tricky mechanical work where one mistake cascades (history-commit audit across handlers, hardcoded-color sweep, atom rename) | **Sonnet 4.6 / high** | **Gemini Pro 3.1 / low** (or high if you've been burned) | One notch up — single careful pass |
| Trivial single-file or single-line fixes, deletions, lint cleanup, file moves | **Haiku 4.5 / minimal** | **Gemini Pro 3.1 / low** | Cheapest tier, plenty for this |
| Verification / smoke-test reasoning | **Sonnet 4.6 / medium** | **Gemini Pro 3.1 / low** | Reading-heavy, not thinking-heavy |

**Rule of thumb:** plan with Opus / Gemini high, execute with Sonnet / Gemini low, escalate when the executor hits a fork. Expect ~3–4× cost reduction versus running max-tier on every turn while preserving quality where it matters.

Within a subsection that touches many files (e.g. the TimelineAtoms expansion spans 5+ files), **commit per file**, not per subsection. The smaller the commit, the cheaper the rollback if something breaks.

---

## Phase 1 — Timeline correctness + atomization

**Goal:** Timeline matches sidebar atomic discipline; undo/redo is unified, debounced, and actually correct; recording UI is honest about being WIP; no hardcoded colors. Smallest, most mechanical phase. Ship in small commits.

### 1.1 Unify the undo system  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
- Keep the inline pattern in `WortnetzContext.tsx` (it correctly brackets drag start/end via `preDragStateRef` at lines 578-587). Delete `src/app/hooks/useTimelineHistory.ts` — it's the dead branch.
- Extract the inline impl into `src/app/hooks/useUndoStack.ts` as a real hook; the context calls into it. Capped stack (50 entries), serialized snapshots.
- Add `debounceCommit(ms)` helper inside the hook for high-frequency mutations. Signature: `const { push, pushDebounced, undo, redo, canUndo, canRedo } = useUndoStack(captureFn, applyFn, { capacity: 50 })`.
- Order of work: write the hook → swap context to use it → delete `useTimelineHistory.ts` → re-run smoke test.

### 1.2 Fix the missing history commit  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
- Wrap [`handleSetValue` (WortnetzContext.tsx:552-575)](src/app/context/WortnetzContext.tsx#L552-L575) so a drag gesture in `GraphEditor` commits **once** on gesture end (mirror the `handleDragStart`/`handleDragEnd` pattern that already works for keyframe drags). Use the new debounce helper.
- Audit `handleSetHandle`, `handleSetHandle2D`, `handleClearHandle` for the same gap. Apply the same pattern.
- Mechanical pattern application across ~4 handlers. Commit per handler.

### 1.3 Disable recording (per user choice)  ·  *suggested: Haiku 4.5 / minimal · Gemini Pro 3.1 / low*
- Hide / disable the record button in [Timeline.tsx:303-311](src/app/components/Timeline.tsx#L303-L311). Show a tooltip "Wird in einer kommenden Version verfügbar" (i18n key reserved).
- Keep `isRecording` state in context — Phase 3 rebuilds the feature on top of it.
- Delete `useRecordingHistory` from `useAppEffects.ts` (it only touches undo history, no real recording).
- Trivial. Single commit.

### 1.4 TimelineAtoms expansion  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low (escalate to high if atom API feels off)*
Promote hand-rolled patterns into atoms. Names mirror the sidebar's vocabulary so the cascade reads consistently. Variants over className overrides — no `className="..."` passed in from consumers; consumers ask for a variant (`tone`, `size`, `state`).

Final shape of `TimelineAtoms.tsx`:

| Atom | Replaces | Sketch signature |
|---|---|---|
| `TimelineTransportButton` *(existing)* | — | `{ icon, onClick, isActive?, tone? }` |
| `TrackLabel` *(existing)* | — | `{ children, indent?, tone? }` |
| `TrackRow` | [TimelineTracks.tsx:220-283](src/app/components/timeline/TimelineTracks.tsx#L220-L283) | `{ trackId, label, colorTone, isHovered?, isExpanded?, onToggleGraph?, children }` |
| `TrackGroup` | [TimelineTracks.tsx:305-324](src/app/components/timeline/TimelineTracks.tsx#L305-L324) | `{ title, colorTone, isCollapsed, onToggle, actions?, children }` |
| `TrackValueChip` | Numeric display in keyframe cells | `{ value, format? }` |
| `TrackEditableNumber` | Click-to-edit (mirrors `SidebarEditableNumber`) | `{ value, onCommit, min, max, format?, parseInput? }` |
| `TrackKeyframeToggle` | [Timeline.tsx:303-307](src/app/components/Timeline.tsx#L303-L307) | `{ hasKeyframe, onCapture, onDelete, state?: 'normal' \| 'recorded' }` |
| `RecordingIndicator` | [Timeline.tsx:310](src/app/components/Timeline.tsx#L310) | `{ isActive }` |
| `PlayheadLine` | Duplicated at [Timeline.tsx:347, 506](src/app/components/Timeline.tsx#L347) | `{ x, height }` |
| `SceneMarkerHandle` | [TimelineTracks.tsx:91-92](src/app/components/timeline/TimelineTracks.tsx#L91-L92) | `{ marker, isSelected, onClick, onDrag }` |
| `GraphEditorHeader` | [GraphEditor.tsx:204](src/app/components/timeline/GraphEditor.tsx#L204) | `{ title, actions? }` |

Order of work: write atoms one at a time → swap consumer → smoke-test → commit. Cheapest pattern: `PlayheadLine` (duplicated literal); hardest: `TrackRow` (lots of conditional className).

### 1.5 Hardcoded color sweep  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
Add to `theme/tokens.ts`:
- `--wn-timeline-marker-fill` → replaces `text-purple-400` ([TimelineTracks.tsx:75](src/app/components/timeline/TimelineTracks.tsx#L75))
- `--wn-timeline-playhead` → replaces `bg-red-500` (Timeline.tsx:347, 506)
- `--wn-timeline-recording` → replaces `text-red-500 fill-red-500` (Timeline.tsx:310)

Pick existing palette hexes (purple-400, red-500) so visual baseline is identical pre/post change.

### 1.6 Misc cleanup  ·  *suggested: Haiku 4.5 / minimal · Gemini Pro 3.1 / low*
- Delete unused `TimelineContextMenu` function ([ContextMenu.tsx:135-150](src/app/components/timeline/ContextMenu.tsx#L135-L150)).
- Extract time-equality helper to `timeline/timeUtils.ts`: `const TIME_EPSILON = 0.1; export const sameTime = (a,b) => Math.abs(a-b) <= TIME_EPSILON;` Replace the 10+ inline occurrences in `WortnetzContext.tsx`.
- Remove the custom fixed-position portal pattern in `Timeline.tsx:518` — the Shadcn `ContextMenu` route already works.

### Files modified
- `src/app/components/Timeline.tsx`
- `src/app/components/timeline/TimelineAtoms.tsx`
- `src/app/components/timeline/TimelineTracks.tsx`
- `src/app/components/timeline/GraphEditor.tsx`
- `src/app/components/timeline/ContextMenu.tsx`
- `src/app/context/WortnetzContext.tsx`
- `src/app/hooks/useAppEffects.ts` (remove `useRecordingHistory`)
- `src/app/theme/tokens.ts`

### Files deleted
- `src/app/hooks/useTimelineHistory.ts`

### Files created
- `src/app/hooks/useUndoStack.ts` (extracted from inline)
- `src/app/components/timeline/timeUtils.ts`

### Verification
- `npm run build` and `npx tsc --noEmit` both exit 0.
- Smoke test: drag a keyframe → undo works once per drag. Drag a value in the graph → undo works once per drag. Rapid scrubs don't blow the stack.
- Record button is visibly disabled with tooltip.
- `grep -rE "(text|bg|fill)-(red|purple|blue|emerald|indigo)-[0-9]" src/app/components/timeline` returns 0 matches.
- 5 sidebar tabs and all 8 physics tracks render unchanged.

---

## Phase 2 — Timeline interaction parity + bug fixes

**Goal:** Bring timeline keyframe interaction to standard video-editor parity (Premiere/After Effects/Resolve baseline). Fix the audit-discovered bugs. Expand the context menu. Reshape scene markers as bulk-keyframe affordances. Each sub-step independently shippable.

The Phase 2 audit (separate from the original Timeline.tsx audit) found one bug + multiple missing standard behaviors. This phase fixes them.

### 2.1 Fix keyframe duplication bug  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
**Bug:** Tolerance mismatch in [WortnetzContext.tsx:269-324](src/app/context/WortnetzContext.tsx#L269-L324) — `handleMoveKeyframe` matches with `Math.abs(s.time - oldTime) < 0.01` but other paths filter at `> 0.1`. When you drag keyframe A to time T where keyframe B already exists within 0.01-0.1s, both can coexist briefly and the state becomes inconsistent.

**Fix:**
- Adopt the `TIME_EPSILON = 0.1` constant from Phase 1.6 `timeUtils.ts` everywhere.
- After `handleMoveKeyframe` updates the dragged keyframe, dedupe: remove any *other* keyframe within `TIME_EPSILON` of the destination time on the same track. Add a one-line dedup step.
- Audit `handleCaptureKeyframe`, `handleDuplicateKeyframe`, paste handlers for the same pattern. Same fix.

### 2.2 Multi-select hardening (Premiere/AE convention)  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
The audit found multi-select works but the drag-on-unselected-keyframe path is inconsistent. Per your choice: **clicking + dragging a keyframe that's NOT in the current selection clears the selection and drags only that one**.

- Audit [TimelineTracks.tsx:194-217](src/app/components/timeline/TimelineTracks.tsx#L194-L217) drag start: on `mousedown`, if `kf.id ∉ selection`, set selection = `[kf.id]` *before* drag starts.
- Confirm the multi-drag path at [WortnetzContext.tsx:274-304](src/app/context/WortnetzContext.tsx#L274-L304) still works when selection has >1 entries.
- Document the convention in a one-line comment.

### 2.3 Video-editor parity gaps  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low (escalate to high for snap)*
From the interaction audit:

| Gap | Implementation |
|---|---|
| **Arrow-key nudge** | Selected keyframes shift by ±1 frame (1/30s) with arrow keys. Shift+arrow = ±10 frames. Listen on document keydown when timeline has focus or a kf is selected. |
| **Cmd-A / select all** | Select all keyframes in visible/expanded tracks. Standard `(meta\|ctrl)+a` binding. |
| **Snap-to-playhead during drag** | Add playhead time as a snap target in [useTimelineView.ts:47-68](src/app/components/timeline/useTimelineView.ts#L47-L68) alongside scene markers and 30fps grid. Show a vertical guideline when snapped. |
| **Shift-drag = constrain to time axis** | When `e.shiftKey` is held during keyframe drag, ignore vertical pointer movement; lock to horizontal only. (Already locked in dopesheet drags but not in GraphEditor value drags — confirm both surfaces.) |
| **Alt-drag = duplicate** | When `e.altKey` is held at drag start, clone the keyframe first, then drag the clone. Original stays put. |
| **Drag-to-pan timeline** | Middle-click drag on timeline area pans the view horizontally. Also: Alt+drag on background pans. Updates the view offset in `useTimelineView`. |
| **Esc to cancel drag** | Pressing Escape during a drag returns the keyframe to its pre-drag position. Uses `preDragStateRef` already present at [WortnetzContext.tsx:578-587](src/app/context/WortnetzContext.tsx#L578-L587). |

Commit per gap. Each is independently testable.

### 2.4 Context menu expansion  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
The audit found the current context menu thin. Expand `ContextMenu.tsx`:

| Add to | Item | Wires to existing handler |
|---|---|---|
| Keyframe menu | Duplicate | `handleDuplicateKeyframe` (exists) |
| Keyframe menu | Ripple delete | New: deletes the kf AND shifts subsequent kfs on the same track left by the gap |
| Keyframe menu | Convert to/from Hold | Sets/clears handle slopes via `handleSetInterpolation` |
| Keyframe menu | Time-reverse selection | Mirrors selected kfs around their center time |
| Scene marker menu | Rename | Wires to existing `handleRenameSceneMarker` (handler exists, no UI) |
| Scene marker menu | **Create keyframes on all tracks here** | New bulk action — see 2.5 |
| Background menu | Select all visible | Cmd-A equivalent for users who don't know the shortcut |

### 2.5 Scene markers as bulk-keyframe affordance (Option 2 chosen)  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
Per your choice: **scene marker data model stays simple (`{ time, label }`)** — no snapshots stored. Add a single bulk action.

- New handler `handleCreateKeyframesAtMarker(marker)` in `WortnetzContext.tsx`: reads current `physicsParams` + current camera state, inserts a keyframe on every physics track at `marker.time`, plus a camera keyframe at `marker.time`.
- Available via scene marker right-click → "Create keyframes on all tracks here".
- After the action, the marker is unchanged — it's still just a label at a time. The keyframes it spawned are independent state, fully editable.
- One-line note in code comment: scene markers are time bookmarks, not state snapshots.

### 2.6 GraphEditor tangent handle hit detection  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
Current handles in [GraphEditor.tsx](src/app/components/timeline/GraphEditor.tsx) are finicky. Widen the invisible hit area (transparent enlarged hit zone) without changing visual size. Pattern: render a larger `<rect>` with `pointerEvents="all"` and `fill="transparent"` over the visible handle.

### 2.7 Visual polish (the original P2 short list)  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
- Selection ring on selected keyframes (variant on `TrackKeyframeToggle`).
- Drag delta chip — small floating tooltip showing `Δt: +0.42s, Δv: -12` during drag.
- Easing presets cycle on click — clicking the keyframe icon (not opening menu) cycles `auto → linear → hold → easeIn → easeOut → auto`. Right-click still opens the full menu.
- Reset per track via right-click → "Auf Standard zurücksetzen" on track header.

### Verification
- Tolerance bug: drag a keyframe across an existing one. Result must be one keyframe at the destination, never two.
- Premiere/AE drag: select 3 kfs, click+drag a 4th unselected one. Selection should become just that 4th one; only it moves.
- All keyboard shortcuts work: arrows nudge, Cmd-A selects, Esc cancels mid-drag.
- Pan, snap, constrain, duplicate-on-Alt all visible in a single ≤2-minute smoke test session.
- Scene marker bulk action: drop a marker, change physics params, right-click → "Create keyframes on all tracks here." Verify 8 physics tracks + camera get a keyframe at that time with the *current* values.

---

## Phase 3 — Animation architecture: Glide + LFO + recording v2

**Goal:** Resolve the physics-keyframe momentum tension via the layered "destination + Glide" model. Same machinery hosts a simple LFO and a working recording feature. Largest phase — but every sub-step is independently testable.

**No-break contract for this phase (critical):**
- **The sidebar Physics tab sliders are NOT touched.** `damping`, `repulsion`, `springK`, `linkDistance`, `gravity`, `turbulence`, `verticalOrder`, `pulse` all keep their current behavior, names, and ranges.
- The new parameter `Glide` (formerly "settle time") lives **only on the timeline track**, not in the sidebar. It defaults to `0` (instant snap, identical to today).
- The `pulse` slider stays as a one-knob shorthand even after the LFO panel exists. LFO is an **additional** capability, not a replacement. Users who only ever touch the pulse slider see no change.
- Every existing `.wortnetz` project file loads with identical visual playback because defaults match today.

**Vocabulary note:** "Glide" (the new concept) is distinct from "damping" (sidebar, untouched). Glide operates on the *parameter signal* (smoothing the input to the simulation). Damping operates on *node velocities* (the simulation's response). Two layers, two names, no overlap in vocabulary.

### 3.1 Reshape PhysicsKeyframe as a target value  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- Semantically rename `PhysicsKeyframe.value` → it's a **target**. No type change; just comment + docstring.
- Add `Track<T>` type in new `src/app/animation/Track.ts`: `{ id, paramKey, keyframes, glide: number, modulator?: Modulator }`. `glide` default `0` = instant snap (matches today's behavior — invisible change).
- Migration: existing keyframe arrays become tracks with `glide: 0`. No project file format change required (it's a runtime-only wrapper for now); on save, persist `glide` only if non-zero.
- This is type-architecture work — needs judgment so the type doesn't foreclose Phase 6 (BPM/MIDI). The `Track<T>` generic should leave room for non-numeric values (camera vectors, color) without committing to those today.

### 3.2 Physics worker: target-following with Glide  ·  *suggested: Opus 4.7 / max · Gemini Pro 3.1 / high*
- Add an optional `glideRates: Record<string, number>` field to the worker message.
- For each param with a non-zero glide value, the worker smooths the *currently-applied* parameter toward the *target* over the glide time. Implementation: simple exponential approach (`current += (target - current) * dt / glide`).
- Default (glide 0) bypasses the smoothing — equivalent to current behavior.
- Result: a keyframe with `glide: 0.5s` causes the parameter to ease in over half a second; lingering momentum still exists in node velocities (governed by sidebar `damping` as today) but the *parameter that drives the forces* converges smoothly rather than snapping.
- **Crucially**: this does NOT modify node velocity calculations or change how `damping` works. The two concepts live at different layers and never touch each other in the worker.
- Minimal change to `physics.worker.ts` — a few lines in the step function, before forces are computed.
- **Sim-correctness work** — wrong math feels like "everything's slow" or "everything's twitchy" and is hard to debug. Worth the max-effort tier here.

### 3.3 Modulator layer (simple LFO)  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- New type in `src/app/animation/Modulator.ts`: `Modulator = { waveform: 'sine'|'triangle'|'square', rate: number /* Hz */, depth: number /* 0-1 */, phase: number }`. Deliberately small surface — no envelopes, no complex shapes.
- Modulator output **adds** to the keyframe-evaluated target (still clamped to param range, still passes through Glide).
- One modulator per track maximum (simplicity rule).
- **`pulse` handling — coexistence, not replacement:**
  - The existing hardcoded `pulse` mechanism at [Network3D.tsx:1484-1492](src/app/components/Network3D.tsx#L1484-L1492) keeps working unchanged.
  - The sidebar `pulse` slider stays exactly as today. Users never have to learn the LFO panel to use it.
  - When a user opens the LFO panel on the repulsion track, the panel is pre-populated with the pulse equivalent as a hint ("Tipp: dies entspricht dem Pulse-Regler"). If they configure their own LFO there, the two effects stack (both still apply).
  - Long-term: when LFO panel matures, we may deprecate pulse. Not in this phase. Don't break things people are using.
- UI: a small "M" badge in `TrackGroup` (collapsed by default). Click opens an inline `LfoControls` atom with waveform selector + rate slider + depth slider. No more knobs than that.
- Atom signature: `LfoControls = { modulator, onChange, paramRange }`. Composes existing `SidebarSliderRow` + `SidebarRadioRow` atoms.

### 3.4 Recording v2  ·  *suggested: Opus 4.7 / high for design, Sonnet 4.6 / medium for implementation pass · Gemini Pro 3.1 / high then low*
- New module `src/app/animation/Recorder.ts`: sampling loop. While `isRecording && isPlaying`, sample armed-track param values at 30Hz into a ring buffer.
- On record stop: downsample buffer into keyframes using threshold-based reduction (skip samples within Δvalue tolerance). Insert into track.
- Per-track "arm" toggle (small dot in `TrackGroup`). Default: all tracks armed. Advanced: arm subset.
- Re-enable the record button from Phase 1 (it now has real wiring).
- Visual: recorded keyframes get a subtle bg variant (`TrackKeyframeToggle` `state="recorded"`). They're regular keyframes otherwise — fully editable.
- Recommend: split into two commits. First commit = recorder module + sampling loop (Opus, designs the downsampling). Second commit = UI wiring + arm toggle (Sonnet, mechanical).

### 3.5 Rewire Network3D  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
- Replace [Network3D.tsx:1421-1492](src/app/components/Network3D.tsx#L1421-L1492) with calls to a new evaluator function `evaluateTracks(tracks, time): Record<paramKey, number>` from `src/app/animation/Track.ts`.
- Evaluator pipeline: keyframe Hermite interpolation → add modulator output (if present) → return target value. Settle rates pass through to the worker message.
- The block becomes ~15 lines instead of ~70. Sets up Phase 4's extraction cleanly.
- Mechanical once 3.1–3.4 land — the design is decided; this is wiring.

### Files created
- `src/app/animation/Track.ts`
- `src/app/animation/Modulator.ts`
- `src/app/animation/Recorder.ts`
- `src/app/components/timeline/LfoControls.tsx` (consumes `SidebarSliderRow` atoms)

### Files modified
- `src/app/context/WortnetzContextTypes.ts` (add `Track`, `Modulator` types)
- `src/app/context/WortnetzContext.tsx` (handlers, evaluator wiring)
- `src/app/components/Network3D.tsx` (lines 1421-1492 region only)
- `src/app/graph/physics.worker.ts` (settle-toward-target — small addition)
- `src/app/components/timeline/TimelineAtoms.tsx` (`LfoBadge`, `TrackArmToggle`, recorded-state variant for `TrackKeyframeToggle`)
- `src/app/hooks/useAppEffects.ts` (recorder integration)
- `useWorkspaceIO.ts` (serialize `glide` and `modulator` when non-default)

### Verification
- **No-break check**: default Glide 0 means every existing `.wortnetz` file loads identically. Sidebar Physics tab sliders behave exactly as before. Pulse slider works exactly as before. Verify with a saved-before / loaded-after screenshot comparison.
- Set repulsion track Glide to 1s → drag the slider during playback → param eases in over 1s rather than snapping.
- Open LFO on damping track, sine 0.5Hz, depth 0.3 → damping target visibly oscillates → keyframes still drive the center value → sidebar `damping` slider still adjusts the node-velocity multiplier (separate concern).
- Record button: arm 2 tracks, press record + play, drag those sliders → on stop, keyframes appear in the armed tracks at sampled times.
- Pulse slider in sidebar: still works regardless of whether an LFO is configured on repulsion. The two effects stack.
- `npm run build` + `npx tsc --noEmit` clean.

---

## Phase 4 — Network3D extraction + visual effects

**Goal:** Trim `Network3D.tsx` from 1973 lines to <800. Add the EffectComposer-based post-processing pipeline that unlocks glow/bloom and future shader effects.

### 4.1 Extraction (zero behavior change)  ·  *suggested: Opus 4.7 / high for ref consolidation; Sonnet 4.6 / high for hook extractions · Gemini Pro 3.1 / high then low*
- Consolidate 9 ref-sync `useEffect`s ([Network3D.tsx:293-321](src/app/components/Network3D.tsx#L293-L321)) into one memoized ref object. **Needs Opus for the consolidation** — design call about how the merged ref behaves under prop change.
- Extract hooks (each a separate commit, Sonnet-tier each):
  - `usePhysicsBlend` — the (now-shrunken) param blend region from Phase 3.
  - `useCameraFlyTo` — [Network3D.tsx:1543-1555](src/app/components/Network3D.tsx#L1543-L1555).
  - `useRaycastHover` — [Network3D.tsx:1280-1315](src/app/components/Network3D.tsx#L1280-L1315).
  - `useResizeObserver` — already separable.
- Extract pure modules (Haiku-tier each — pure code moves):
  - `network3d/keyframeInterpolation.ts` — already pure, just move.
  - `network3d/workerGlue.ts` — worker init + message packing.
  - `network3d/textureCache.ts` — sprite texture builder.
- Remove dead code (Haiku-tier): `applyingKeyframe` (set never read), `frameCount` (incremented never read), commented gizmo block [1587-1590](src/app/components/Network3D.tsx#L1587-L1590).

### 4.2 Visual effects pipeline  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- Add EffectComposer. Default render path: `RenderPass → OutputPass` (no visible change — verify pixel parity against Phase 3 baseline).
- Add `UnrealBloomPass` toggleable from a new "Effekte" section in the Visual sidebar tab. Defaults: off. When on: low intensity preset.
- Add a minimal `ShaderEffect` slot for future custom passes (vignette, chromatic aberration, DOF) — implemented as a tagged-union; not exposed in UI yet, just architectural placeholder.
- Bloom intensity is keyframeable (it becomes a `Track<T>` consumer via Phase 3 machinery — no new wiring beyond adding it to the param map).
- **Pipeline design needs judgment** — pass ordering, depth-buffer handling with sprites (preserve `depthTest: true` requirement from ARCHITECTURE 1.2), antialiasing strategy. Worth Opus-tier.

### Files created
- `src/app/hooks/usePhysicsBlend.ts`
- `src/app/hooks/useCameraFlyTo.ts`
- `src/app/hooks/useRaycastHover.ts`
- `src/app/network3d/keyframeInterpolation.ts`
- `src/app/network3d/workerGlue.ts`
- `src/app/network3d/textureCache.ts`
- `src/app/network3d/effectsPipeline.ts`

### Files modified
- `src/app/components/Network3D.tsx` (extraction targets — file shrinks substantially)
- `src/app/components/sidebar/tabs/VisualTab.tsx` (add Effekte section)
- `src/app/context/WortnetzContextTypes.ts` (add `effects: { bloom: { enabled, intensity } }` to visual settings)

### Verification
- `wc -l src/app/components/Network3D.tsx` returns <800.
- Visual diff against Phase 3 baseline: identical (effects default off).
- Toggle bloom on → glow appears on bright nodes. Adjust intensity slider → glow changes.
- All 5 sidebar tabs and 8 physics tracks unchanged.

---

## Phase 5 — Toolbar functionality

**Goal:** The toolbar's 7 buttons become real tools. Same simplicity contract: each tool has one obvious purpose, no exposed knobs beyond what's necessary.

### 5.1 Tool dispatch foundation  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- Read `activeTool` from context in Network3D's canvas event handlers.
- Route `mousemove`/`mousedown`/`mouseup`/`click` to a `useToolHandlers(activeTool)` hook that delegates to per-tool implementations.
- Default tool (`pointer`) preserves current orbit + select behavior.
- **Foundation step** — wrong shape here makes every later tool harder. Worth getting right.

### 5.2 Navigation tools  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
- `pan`: drag canvas to pan camera target.
- `zoom`: drag-to-zoom (rubber-band box → fit to box).
- `scale`: drag affects the global scale of the network (visual zoom out via spread).
- `rotate`: explicit orbit (currently implicit on `pointer`).
- Each tool is a separate file in `src/app/tools/`; commit per tool.

### 5.3 Paintbrush tool  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- Hover shows a 3D brush cursor (sized via brush radius).
- Drag over nodes paints a chosen attribute. Default attribute: **color**. Advanced: pick attribute (color/size/opacity/"weight") from a small brush picker palette in the toolbar's flyout.
- Painted overrides persist independently of physics/keyframes (a "painted override" map per node).
- Reset painted attributes via a track-header reset (uses Phase 2 pattern).
- **UX design + override-state architecture together** — needs judgment on interaction model. Worth Opus-tier.

### 5.4 Glitch / Path tools  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
- `glitch`: click a node region → one-shot physics jolt (boosts repulsion locally for ~0.5s). Uses existing jolt mechanism.
- `path`: click to drop polyline waypoints; nodes orbit/follow path. Stretch goal — defer if too much.

### Files modified
- `src/app/components/Network3D.tsx` (tool dispatch in event handlers)
- `src/app/components/Toolbar.tsx` (wire `onToolChange`)
- `src/app/components/toolbar/ToolbarAtoms.tsx` (brush picker atoms)
- `src/app/context/WortnetzContext.tsx` (painted overrides map)

### Files created
- `src/app/hooks/useToolHandlers.ts`
- `src/app/tools/paint.ts`, `tools/pan.ts`, `tools/scale.ts`, `tools/glitch.ts`

### Verification
- Click each tool → cursor changes → canvas behaves accordingly.
- Painted node colors survive keyframe playback.
- Reset clears painted overrides.

---

## Phase 6 — Long-term (architectural placeholders only)

**Not actively planned. Mentioned so Phase 3's `Track<T>` / `Modulator` types reserve room for these without retrofitting.**

- **BPM / musical time**: timeline switchable from seconds to beats. `Modulator.rate` accepts beat divisions (`'1/4'`, `'1/8'`). BPM input in TopBar. Keyframes snap to beat grid.
- **MIDI mapping**: Web MIDI API. Learn-mode binding from any param to any MIDI CC. MIDI input can drive a track as a modulator alternative.
- **Additional shader effects**: vignette, DOF, chromatic aberration — drop into Phase 4's `ShaderEffect` slot.
- **Tool palette expansion**: lasso select, mask, copy/paste paint patterns.

These exist as a guardrail: when designing Phase 3's `Track<T>` and `Modulator` types, the implementation must not foreclose these futures.

---

## Critical files reference

### Modified (existing)
- `src/app/components/Timeline.tsx` — P1, P2
- `src/app/components/timeline/TimelineAtoms.tsx` — P1, P3
- `src/app/components/timeline/TimelineTracks.tsx` — P1, P2
- `src/app/components/timeline/GraphEditor.tsx` — P1, P2
- `src/app/components/timeline/ContextMenu.tsx` — P1
- `src/app/components/timeline/types.ts` — P3
- `src/app/components/Network3D.tsx` — P3 (rewire blend), P4 (extraction), P5 (tool dispatch)
- `src/app/components/Toolbar.tsx` — P5
- `src/app/components/toolbar/ToolbarAtoms.tsx` — P5
- `src/app/components/sidebar/tabs/VisualTab.tsx` — P4 (Effekte section)
- `src/app/context/WortnetzContext.tsx` — all phases
- `src/app/context/WortnetzContextTypes.ts` — P3, P4
- `src/app/graph/physics.worker.ts` — P3 (small addition)
- `src/app/hooks/useAppEffects.ts` — P1 (remove `useRecordingHistory`), P3 (recorder integration)
- `src/app/theme/tokens.ts` — P1

### Deleted
- `src/app/hooks/useTimelineHistory.ts` — P1

### Created
- `src/app/hooks/useUndoStack.ts` — P1
- `src/app/components/timeline/timeUtils.ts` — P1
- `src/app/animation/Track.ts` — P3
- `src/app/animation/Modulator.ts` — P3
- `src/app/animation/Recorder.ts` — P3
- `src/app/components/timeline/LfoControls.tsx` — P3
- `src/app/hooks/usePhysicsBlend.ts` — P4
- `src/app/hooks/useCameraFlyTo.ts` — P4
- `src/app/hooks/useRaycastHover.ts` — P4
- `src/app/network3d/keyframeInterpolation.ts` — P4
- `src/app/network3d/workerGlue.ts` — P4
- `src/app/network3d/textureCache.ts` — P4
- `src/app/network3d/effectsPipeline.ts` — P4
- `src/app/hooks/useToolHandlers.ts` — P5
- `src/app/tools/paint.ts`, `pan.ts`, `scale.ts`, `glitch.ts` — P5

### Reused without modification
- `graph/parsing.ts` (engine, untouched)
- `graph/physics.worker.ts` core integration (P3 adds settle logic only)
- `networkTheme.ts`
- `hooks/useWorkspaceIO.ts` (P3 adds field serialization but no structural change)
- shadcn primitives in `components/ui/`
- `SidebarAtoms.tsx` (consumed, not modified)

---

## Verification gates (per phase)

Each phase commits sub-step by sub-step. Per commit:

1. **Build** — `npm run build` exits 0.
2. **TypeScript** — `npx tsc --noEmit` exits 0.
3. **Smoke test** — `npm run dev`, exercise the affected surface in the browser (≤30s).
4. **Visual parity** — compare against `STYLE_GUIDE.md` "Locked Visual Baseline." Pixel changes only where the plan explicitly authorizes (Phase 4 bloom toggle off = no change; Phase 1 timeline color sweep should be identical visually because new tokens carry same hex).

**Phase boundary gate** (additional checks at the end of each phase):

- **End of P1**: `grep -rE "(text|bg|fill)-(red|purple)-[0-9]" src/app/components/timeline` returns 0; record button is disabled; undo works on graph-value drag.
- **End of P2**: any keyframe action that opens the clipboard is undoable as a single step.
- **End of P3**: existing `.wortnetz` files load with identical playback behavior (Glide 0 is the silent default). Sidebar Physics tab sliders all unchanged. Pulse slider still works. LFO collapsed by default. Record produces editable keyframes.
- **End of P4**: `wc -l src/app/components/Network3D.tsx` < 800. Bloom toggle works; off by default.
- **End of P5**: every toolbar button has visible effect on canvas; pointer is default and unchanged from today.
