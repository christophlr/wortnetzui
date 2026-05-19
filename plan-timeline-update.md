# Wortnetze — Animation, Visuals & Tools Roadmap

> **Amendment log** — REMEDY-TL-2026-05-18: Applied Tier B blueprint amendments (B-MANDATE, B-FREEZE, B-PHASE1, B-WORKER, B-PHASE4-REFS, B-PHASE4-BLOOM, B-PHASE5-OVERRIDE, B-TEST-GATE, B-WORTNETZ) plus four adversarial-review corrections (jolt mechanism, sidebar blend regression, B-FREEZE scope, null-guard canonicalisation). Phase 0 remediation must complete before any Phase 2+ work resumes.
>
> **Doc status (2026-05-19)** — Phases 1, 2, and 3 are implemented (Phase 3 *except* the Glide timeline UI — see §3.6, design pending). The Context block below is a **historical audit snapshot** taken pre-Phase 1; many of the listed bugs are now fixed in code. The next active section is **Pre-Phase 4** (operational stabilisation), followed by Phase 4 (slim-composer extraction + segment-evaluator unification + bloom).

## Context

The sidebar atomic refactor (`plan.md`) is the immediate predecessor. With sidebar discipline established, the next surfaces in scope are **Timeline**, the **physics → keyframe contract**, **Network3D**, and the **Toolbar**. An audit of each surface revealed concrete problems plus a deeper architectural tension:

- **Timeline.tsx** (532 lines) is mostly sound but atomically thin: `TimelineAtoms.tsx` exports only 2 atoms vs. the sidebar's 13+. `TrackRow`, `TrackGroup`, value chips, and keyframe toggles are all hand-rolled in `TimelineTracks.tsx`.
- **Two undo systems coexist**: [`hooks/useTimelineHistory.ts`](src/app/hooks/useTimelineHistory.ts) exists but is unused — an inline duplicate stack lives at [WortnetzContext.tsx:97-127](src/app/context/WortnetzContext.tsx#L97-L127). The ARCHITECTURE.md "debounced commit" claim is fiction.
- **History bug**: [`handleSetValue` (WortnetzContext.tsx:551-559)](src/app/context/WortnetzContext.tsx#L551-L559) never mutates physics state — physics tracks fall through the camera-only branch silently.
- **Recording is broken**: the button toggles `isRecording` but no code samples parameter values; `useRecordingHistory` only manipulates the undo stack.
- **Hardcoded colors** in timeline files: `text-purple-400`, `bg-red-500` ×2, `text-red-500`. Unused export `TimelineContextMenu`.
- **Physics-keyframe momentum tension** is a design problem, not a bug ([Network3D.tsx:1421-1451](src/app/components/Network3D.tsx#L1421-L1451) + [physics.worker.ts:51](src/app/graph/physics.worker.ts#L51)): keyframes override parameters, but node velocities persist. Friction decays them slowly (log-decay); the system "drifts" after keyframes end.
- **Network3D.tsx** (1973 lines) needs trimming before more physics or visual complexity lands: 9 ref-sync `useEffect`s, dead `applyingKeyframe`/`frameCount`, commented gizmo block, no EffectComposer for glow/bloom.
- **Toolbar tools** render but `activeTool` (context state, exists) is never read by canvas event handlers in Network3D. Tools are dead UI.
- **Existing `pulse` parameter** ([Network3D.tsx:1484-1492](src/app/components/Network3D.tsx#L1484-L1492)) is a hardcoded sine on repulsion+linkDistance — already a primitive LFO seed.

Long-term aspirations (BPM sync, MIDI mapping, recordings, LFO modulators, brush tools, post-processing effects) all share an architectural choke point: the param-blend region [Network3D.tsx:1421-1492](src/app/components/Network3D.tsx#L1421-L1492). Resolving the momentum tension means inserting a layer there — and that layer is the same layer that hosts LFOs and modulators later.

**Architectural target (Phase 3 north star):** the "destination + glide" model, borrowed jointly from DAW automation (Bitwig/Ableton modulator chains) and 3D animation constraint blending (Maya/Houdini cloth-with-goal). Keyframes drive a **target** value; physics damps toward it at a configurable settle rate; modulators (LFO/MIDI/BPM later) layer on top of the target.

```
keyframe value ──╮
LFO output    ───┼──▶ target ───▶ physics worker damps toward target
manual UI     ───╯                (per-track settle time)
```

This single indirection unlocks every long-term goal without re-architecting again.

---

## Engineering mandates (non-negotiable)

1. **Thread sanity:** The worker thread that runs `runStep` also evaluates animation time `t`, Hermite targets, LFO offsets, and glide integration. The main thread sends `{ type: 'step', time, dt, posVel }` and receives `{ posVel, appliedParams }`. Main-thread per-frame Hermite in `Network3D` is removed when Phase 3 ships.
2. **Undo memory:** Timeline undo stores `structuredClone` snapshots at push OR inverse patches. `JSON.stringify`/`parse` for undo is banned. Default stack capacity: **30**.
3. **Atom enforcement:** Timeline atoms accept only variant props (`tone`, `size`, `state`). Parents must not pass Tailwind `className` into atoms.
4. **URL as truth:** Global preferences (language) sync to `?lang=` per `docs/URL_STATE_RFC.md`.
5. **Test automation gate:** `npm run test` must pass before any phase is marked complete.

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

## ~~Phase 1 — Timeline correctness + atomization~~ ✓ COMPLETE

**Goal:** Timeline matches sidebar atomic discipline; undo/redo is unified, debounced, and actually correct; recording UI is honest about being WIP; no hardcoded colors. Smallest, most mechanical phase. Ship in small commits.

### 1.1 Unify the undo system  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
- Keep the inline pattern in `WortnetzContext.tsx` (it correctly brackets drag start/end via `preDragStateRef`). Delete `src/app/hooks/useTimelineHistory.ts` — it's the dead branch.
- Extract the inline impl into `src/app/hooks/useUndoStack.ts` as a real hook; the context calls into it. Capped stack (30 entries per M2), `structuredClone` at push boundary.
- Add `debounceCommit(ms)` helper inside the hook for high-frequency mutations. Signature: `const { push, pushDebounced, undo, redo, canUndo, canRedo } = useUndoStack(captureFn, applyFn, { capacity: 30 })`.
- Order of work: write the hook → swap context to use it → delete `useTimelineHistory.ts` → re-run smoke test.

### 1.2 Fix the missing history commit  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
- Wrap [`handleSetValue` (WortnetzContext.tsx:551-559)](src/app/context/WortnetzContext.tsx#L551-L559) so a drag gesture in `GraphEditor` commits **once** on gesture end (mirror the `handleDragStart`/`handleDragEnd` pattern that already works for keyframe drags). Use the new debounce helper.
- **Physics branch implementation note (A1):** the setter must do `physicsKeyframesRef.current = nextKfs` inside the `setPhysicsKeyframes` functional updater callback — not in a `useEffect`. All existing handlers in the file follow this pattern (e.g. line 626); deviating causes stale reads within the same frame.
- Audit `handleSetHandle`, `handleSetHandle2D`, `handleClearHandle` for the same gap. Apply the same pattern.
- Mechanical pattern application across ~4 handlers. Commit per handler.

### 1.3 Disable recording (per user choice)  ·  *suggested: Haiku 4.5 / minimal · Gemini Pro 3.1 / low*
- Hide / disable the record button. Show a tooltip "Wird in einer kommenden Version verfügbar" (i18n key reserved).
- Keep `isRecording` state in context — Phase 3 rebuilds the feature on top of it.
- Delete `useRecordingHistory` from `useAppEffects.ts` (it only touches undo history, no real recording).
- Trivial. Single commit.

### 1.4 TimelineAtoms expansion (PARTIAL — resume post-Phase 0)  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low (escalate to high if atom API feels off)*

**Shipped:** `TrackLabel`, `TimelineTransportButton`, `PlayheadLine`, `RecordButton` (disabled shell only — `isRecording` prop currently ignored; wire in 1.4), `SceneMarkerHandle`.

**Deferred (still inlined in `TimelineTracks.tsx`):** `TrackRow`, `TrackGroup`, `TrackEditableNumber` wiring, `TrackKeyframeToggle` wiring.

**Zombie atoms to remove before wiring (C1–C3):** `TrackValueChip`, `TrackEditableNumber`, `TrackKeyframeToggle` are exported but have zero consumers outside `TimelineAtoms.tsx`. Remove or wire — do not leave as dead exports.

Promote hand-rolled patterns into atoms. Variants over className overrides — no `className="..."` passed in from consumers; consumers ask for a variant (`tone`, `size`, `state`).

Final shape of `TimelineAtoms.tsx`:

| Atom | Replaces | Sketch signature |
|---|---|---|
| `TimelineTransportButton` *(existing)* | — | `{ icon, onClick, isActive?, tone? }` |
| `TrackLabel` *(existing)* | — | `{ children, indent?, tone? }` |
| `TrackRow` | [TimelineTracks.tsx:220-283](src/app/components/timeline/TimelineTracks.tsx#L220-L283) | `{ trackId, label, colorTone, isHovered?, isExpanded?, onToggleGraph?, children }` |
| `TrackGroup` | [TimelineTracks.tsx:305-324](src/app/components/timeline/TimelineTracks.tsx#L305-L324) | `{ title, colorTone, isCollapsed, onToggle, actions?, children }` |
| `TrackValueChip` | Numeric display in keyframe cells | `{ value, format?, tone?: 'cyan'\|'orange'\|'neutral' }` — no `colorClass` passthrough (M3) |
| `TrackEditableNumber` | Click-to-edit (mirrors `SidebarEditableNumber`) | `{ value, onCommit, min, max, format?, parseInput? }` |
| `TrackKeyframeToggle` | Keyframe diamond on track | `{ hasKeyframe, onCapture, onDelete, state?: 'normal' \| 'recorded' }` |
| `RecordingIndicator` | Recording dot | `{ isActive }` |
| `PlayheadLine` *(existing)* | Duplicated literal | `{ x, height }` |
| `SceneMarkerHandle` *(existing)* | Drag handle | `{ marker, isSelected, onClick, onDrag }` |
| `GraphEditorHeader` | [GraphEditor.tsx:204](src/app/components/timeline/GraphEditor.tsx#L204) | `{ title, actions? }` |

Order of work: write atoms one at a time → swap consumer → smoke-test → commit. Cheapest pattern: `PlayheadLine` (duplicated literal); hardest: `TrackRow` (lots of conditional className).

### 1.5 Hardcoded color sweep  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
Add to `theme/tokens.ts`:
- `--wn-timeline-marker-fill` → replaces `text-purple-400` ([TimelineTracks.tsx:75](src/app/components/timeline/TimelineTracks.tsx#L75))
- `--wn-timeline-playhead` → replaces `bg-red-500` (Timeline.tsx:347, 506)
- `--wn-timeline-recording` → replaces `text-red-500 fill-red-500` (Timeline.tsx:310)

**Also sweep COLOR map in [types.ts:117-119](src/app/components/timeline/types.ts#L117-L119):** the `dot` and `border` fields still contain raw Tailwind strings (`bg-blue-500`, `border-l-blue-500/60`, `bg-orange-500`, `border-l-orange-500/60`). The `kfFill`, `graphStroke`, `miniCurve` fields are already CSS vars — finish the migration. `trackBg` (`bg-blue-950/10`, `bg-orange-950/10`) should become CSS vars too.

Pick existing palette hexes so visual baseline is identical pre/post change.

### 1.6 Misc cleanup  ·  *suggested: Haiku 4.5 / minimal · Gemini Pro 3.1 / low*
- Delete unused `TimelineContextMenu` function.
- Unify time-equality helpers in `timeline/timeUtils.ts` per Phase 0 commit 0.1a: three named epsilons (`MUTATION_EPSILON = 0.1`, `SELECTION_EPSILON = 0.01`, `SNAP_EPSILON = 0.001`) with corresponding helpers. Replace all 10+ inline literals.
- Remove the custom fixed-position portal pattern in Timeline.tsx — the Shadcn `ContextMenu` route already works.

### Files modified
- `src/app/components/timeline/Timeline.tsx`
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
- `npm run test` exits 0 (M5).
- `npm run build` and `npx tsc --noEmit` both exit 0.
- Smoke test: drag a keyframe → undo works once per drag. Drag a value in the graph → undo works once per drag. Rapid scrubs don't blow the stack.
- Record button is visibly disabled with tooltip.
- `grep -rE "(text|bg|fill)-(red|purple|blue|emerald|indigo)-[0-9]" src/app/components/timeline` returns 0 matches.
- 5 sidebar tabs and all 8 physics tracks render unchanged.

---

## Pre-Phase 3 Remediation (MUST complete before Phase 3 begins)

See `High-Fidelity Remediation & Correction Plan.md` (REMEDY-TL-2026-05-18) for full commit table (0.0 → 0.8a) and Phase 0 exit gate. Summary of Tier A defects driving Phase 0:

| ID | Defect | Commit |
|---|---|---|
| A1 | `handleSetValue` physics branch is a no-op — physics tracks never mutate | 0.3a |
| A2 | Undo snapshots store live ref aliases (latent corruption risk under in-place mutation) | 0.2a–b |
| A3 | `useUndoStack` index desynchronises from truncated history on rapid push before re-render | 0.2c |
| A4 | Three conflicting time-equality epsilons scattered across files (0.1 / 0.01 / 0.001) | 0.1a–c |
| A5 | Duplicate `interpolatePhysicsParam` — Network3D local copy omits null guard on tangent inputs and the `Math.max(0, val)` clamp | 0.4a–b |
| A6 | `handleMoveSceneMarker` has no undo integration | 0.2f |
| A7 | `pushDebounced` implemented but never called | 0.2d |
| A8 | Multi-drag keyframe path skips deduplication | 0.3b |
| A9 | Dual parameter smoothing: main-thread 30 ms lerp + planned worker glide — two integrators on one signal | B-WORKER |

**Pre-Phase 3 exit gate:** `npm run test` ≥25 passing; `npm run build` clean; `check:inspector` + `check:time-literals` pass; manual smoke script documented in PR.

---


## ~~Phase 2 — Timeline interaction parity + bug fixes~~ ✓ COMPLETE (frozen gaps remain)

> **FREEZE (unimplemented gaps only):** The following Phase 2 features remain frozen until Phase 0 remediation exit gate passes: shift-drag axis lock (2.3), Alt+background pan (2.3), time-reverse selection (2.4), easing click-cycle on keyframe (2.7). Already-merged Phase 2 work (drag-delta chip 2.7B, right-click track reset 2.7C, context-menu fixes) is not subject to this freeze.

**Goal:** Bring timeline keyframe interaction to standard video-editor parity (Premiere/After Effects/Resolve baseline). Fix the audit-discovered bugs. Expand the context menu. Reshape scene markers as bulk-keyframe affordances. Each sub-step independently shippable.

### 2.1 Fix keyframe duplication bug  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
**Bug:** Tolerance mismatch in [WortnetzContext.tsx:269-324](src/app/context/WortnetzContext.tsx#L269-L324) — `handleMoveKeyframe` matches with `Math.abs(s.time - oldTime) < 0.01` but other paths filter at `> 0.1`. When you drag keyframe A to time T where keyframe B already exists within 0.01-0.1s, both can coexist briefly and the state becomes inconsistent.

**Fix:**
- Adopt `MUTATION_EPSILON = 0.1` from Phase 0 `timeUtils.ts` everywhere.
- After `handleMoveKeyframe` updates the dragged keyframe, dedupe: remove any *other* keyframe within `MUTATION_EPSILON` of the destination time on the same track. Add a one-line dedup step.
- Audit `handleCaptureKeyframe`, `handleDuplicateKeyframe`, paste handlers for the same pattern. Same fix.

### 2.2 Multi-select hardening (Premiere/AE convention)  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
The audit found multi-select works but the drag-on-unselected-keyframe path is inconsistent. Per your choice: **clicking + dragging a keyframe that's NOT in the current selection clears the selection and drags only that one**.

- Audit [TimelineTracks.tsx:194-217](src/app/components/timeline/TimelineTracks.tsx#L194-L217) drag start: on `mousedown`, if `kf.id ∉ selection`, set selection = `[kf.id]` *before* drag starts.
- Confirm the multi-drag path at [WortnetzContext.tsx:274-304](src/app/context/WortnetzContext.tsx#L274-L304) still works when selection has >1 entries.
- Document the convention in a one-line comment.

### 2.3 Video-editor parity gaps  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low (escalate to high for snap)*
From the interaction audit (frozen items marked ❄️):

| Gap | Implementation | Status |
|---|---|---|
| **Arrow-key nudge** | Selected keyframes shift by ±1 frame (1/30s) with arrow keys. Shift+arrow = ±10 frames. | Shipped |
| **Cmd-A / select all** | Select all keyframes in visible/expanded tracks. Standard `(meta\|ctrl)+a` binding. | Shipped |
| **Snap-to-playhead during drag** | Add playhead time as a snap target alongside scene markers and 30fps grid. Show a vertical guideline when snapped. | To implement |
| **Shift-drag = constrain to time axis** ❄️ | When `e.shiftKey` is held during keyframe drag, lock to horizontal only. | Frozen |
| **Alt-drag = duplicate** | When `e.altKey` is held at drag start, clone the keyframe first, then drag the clone. | To implement |
| **Drag-to-pan timeline** | Middle-click drag on timeline area pans the view horizontally. | Shipped |
| **Alt+drag on background pans** ❄️ | Alt+drag on background pans. Updates the view offset in `useTimelineView`. | Frozen |
| **Esc to cancel drag** | Pressing Escape during a drag returns the keyframe to its pre-drag position. Uses `preDragStateRef`. | Shipped |

Commit per gap. Each is independently testable.

### 2.4 Context menu expansion  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
The audit found the current context menu thin. Expand `ContextMenu.tsx`:

| Add to | Item | Wires to existing handler |
|---|---|---|
| Keyframe menu | Duplicate | `handleDuplicateKeyframe` (exists) |
| Keyframe menu | Ripple delete | New: deletes the kf AND shifts subsequent kfs on the same track left by the gap |
| Keyframe menu | Convert to/from Hold | Sets/clears handle slopes via `handleSetInterpolation` |
| Keyframe menu | Time-reverse selection ❄️ | Mirrors selected kfs around their center time |
| Scene marker menu | Rename | Wires to existing `handleRenameSceneMarker` (handler exists, no menu item yet — C6) |
| Scene marker menu | **Create keyframes on all tracks here** | New bulk action — see 2.5 |
| Background menu | Select all visible | Cmd-A equivalent for users who don't know the shortcut |

### 2.5 Scene markers as bulk-keyframe affordance  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
**Scene marker data model stays simple (`{ time, label }`)** — no snapshots stored. Add a single bulk action.

- New handler `handleCreateKeyframesAtMarker(marker)` in `WortnetzContext.tsx`: reads current `physicsParams` + current camera state, inserts a keyframe on every physics track at `marker.time`, plus a camera keyframe at `marker.time`.
- Available via scene marker right-click → "Create keyframes on all tracks here".
- After the action, the marker is unchanged — it's still just a label at a time.
- One-line note in code comment: scene markers are time bookmarks, not state snapshots.

### 2.6 GraphEditor tangent handle hit detection  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
Current handles in [GraphEditor.tsx](src/app/components/timeline/GraphEditor.tsx) are finicky. Widen the invisible hit area (transparent enlarged hit zone) without changing visual size. Pattern: render a larger `<rect>` with `pointerEvents="all"` and `fill="transparent"` over the visible handle.

### 2.7 Visual polish  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
- Selection ring on selected keyframes (variant on `TrackKeyframeToggle`). *(shipped)*
- Drag delta chip — small floating tooltip showing `Δt: +0.42s, Δv: -12` during drag. *(shipped 2.7B)*
- Easing presets cycle on click — clicking the keyframe icon cycles `auto → linear → hold → easeIn → easeOut → auto`. ❄️ frozen.
- Reset per track via right-click — "Auf Standard zurücksetzen" on track header. *(shipped 2.7C)*

### Verification
- Tolerance bug: drag a keyframe across an existing one. Result must be one keyframe at the destination, never two.
- Premiere/AE drag: select 3 kfs, click+drag a 4th unselected one. Selection should become just that 4th one; only it moves.
- Scene marker bulk action: drop a marker, change physics params, right-click → "Create keyframes on all tracks here." Verify 8 physics tracks + camera get a keyframe at that time with the *current* values.
- `npm run test` exits 0.

---

## Phase 3 — Worker-owned animation clock + Glide + LFO + recording v2 *(implemented — Glide UI deferred to §3.6)*

**Goal:** Single clock for param signals inside the physics worker. Main thread: UI, render, message I/O.

**No-break contract:**
- Sidebar Physics sliders unchanged (`damping`, `repulsion`, `springK`, `linkDistance`, `gravity`, `turbulence`, `verticalOrder`, `pulse` — names, ranges, behaviour).
- `Glide` on timeline track only; default `0` → `applied = target` instantly (identical to today).
- `pulse` sidebar unchanged; LFO opt-in only (never auto-created on load).
- Legacy workspace files (`sprachvernetzungen-*.json`) load identically when `glide = 0` and no `modulator`.
- **Remove** `physicsBlendActiveRef` / 30 ms main-thread lerp (`Network3D.tsx:1396-1418`) when worker glide ships. **Sidebar regression note:** with `glide = 0` (the default), the 30 ms easeOut transition that currently fires on every sidebar slider drag will be removed. Param changes for zero-glide tracks become instant. This is an intentional tradeoff — the snappy feel comes from the worker's real-time response. Verify this is acceptable before merging Phase 3.
- **Jolt mechanism preserved:** Lines 1453–1481 (`physicsVelocityRef` tracking, damping overshoot on rapid param changes) are a separate UX feature from the Hermite/keyframe override block. They are **not** deleted with the Hermite block — see §3.5 for explicit handling.

### 3.1 Track model + worker init  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- `src/app/animation/Track.ts`: `{ id, paramKey, keyframes, glide: number, modulator?: Modulator }`. `glide` default `0` = instant snap (matches today's behaviour — invisible change).
- Worker init message ships serialised tracks; worker holds `applied: Record<paramKey, number>`.
- `useWorkspaceIO`: `{ version: 1, ... }`; persist `glide`/`modulator` only if non-default.
- The `Track<T>` generic must leave room for non-numeric values (camera vectors, color) without committing to those today — needed for Phase 6 BPM/MIDI.

### 3.2 Worker step (evaluation + glide + forces)  ·  *suggested: Opus 4.7 / max · Gemini Pro 3.1 / high*

**Message:** `{ type: 'step', time: number, dt: number, posVel: Float64Array, is2D: boolean }`

**Per-step math (executed in worker before `runStep`):**
```
For each track tr:
  target[tr.paramKey] = Hermite(tr.keyframes, time) + LFO(tr.modulator, time)
  if tr.glide <= 0:
    applied[key] = target[key]
  else:
    applied[key] += (target[key] - applied[key]) * (dt / tr.glide)
```

Where `dt` is seconds from main thread monotonic clock (not inferred from message count). `runStep(posVel, applied, is2D)` → existing force integration unchanged.

**Single source of truth for Hermite evaluation:** use the context version of `interpolatePhysicsParam` (`src/app/animation/interpolatePhysicsParam.ts` after Phase 0 commit 0.4a). That version has the correct null guard on tangent inputs (`prevTime === null ? 0 : computeCatmullRomTangent(...)`) that the Network3D local copy lacks. Never port the Network3D copy to the worker.

### 3.3 LFO in worker only  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- `Modulator` evaluated at `time` in worker.
- `Modulator = { waveform: 'sine'|'triangle'|'square', rate: number /* Hz */, depth: number /* 0-1 */, phase: number }`.
- UI changes debounce `updateTracks` message (≥100 ms coalesce).
- When a user opens the LFO panel on the repulsion track, the panel shows a hint: "Tipp: dies entspricht dem Pulse-Regler". If they configure their own LFO there, both effects stack (LFO + pulse sidebar both apply).

### 3.4 Recording v2  ·  *suggested: Opus 4.7 / high for design, Sonnet 4.6 / medium for implementation · Gemini Pro 3.1 / high then low*
- New module `src/app/animation/Recorder.ts`: sampling loop. While `isRecording && isPlaying`, sample `appliedParams` from **worker responses** (not raw `physicsParams`) at 30 Hz into a ring buffer.
- **Sampling from `appliedParams` is mandatory**: `physicsParams` is the sidebar-slider state; `appliedParams` is the worker's post-glide output. Recording raw params when glide > 0 would double-count the smooth transition.
- On record stop: downsample buffer into keyframes using threshold-based reduction (skip samples within Δvalue tolerance ε = 0.01). Insert into track. Single `pushHistory` on stop.
- Per-track "arm" toggle. Default: all tracks armed.
- Re-enable the record button from Phase 1 (it now has real wiring).

### 3.5 Network3D thin client  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*

**Delete the Hermite/keyframe override block (~1421–1451):** main thread no longer evaluates `interpolatePhysicsParam`. Worker receives `time` and `dt` and computes params itself.

**Preserve the jolt mechanism (~1453–1481):** `physicsVelocityRef` (parameter change velocity tracking) and its damping overshoot effect are independent of Hermite evaluation. After the Hermite block is removed, the jolt mechanism receives `appliedParams` from the worker response instead of `paramsForFrame` computed locally. Wire accordingly. Do not delete lines 1453–1481.

**Pulse** (`lines 1486–1491`): temporarily kept on the main thread at Phase 3 time as a convenience. **Superseded by Pre-Phase 4 P4-0** — the block is deleted there once LFO on repulsion/linkDistance is the established tool. Do not invest in this block during Phase 3.

Result: the `postMessage` at line 1512 sends `{ type: 'step', time: playheadRef.current, dt, posVel, is2D }` (no `params` — worker computes from its track state). The block becomes ~20 lines instead of ~70.

**After Phase 3:** Phase 3 is code-complete when Verification below passes. **Pre-Phase 4 exit gate** must pass before starting Phase 4.

- `grep interpolatePhysicsParam src/app/components/Network3D.tsx` → 0 matches.
- `grep physicsBlendActiveRef src/app/components/Network3D.tsx` → 0 matches.
- Jolt mechanism (`physicsVelocityRef`) still present and functional.

### Files created
- `src/app/animation/Track.ts`
- `src/app/animation/Modulator.ts`
- `src/app/animation/Recorder.ts`
- `src/app/components/timeline/LfoControls.tsx` (consumes `SidebarSliderRow` atoms)

### Files modified
- `src/app/context/WortnetzContextTypes.ts` (add `Track`, `Modulator` types)
- `src/app/context/WortnetzContext.tsx` (handlers, evaluator wiring)
- `src/app/components/Network3D.tsx` (lines 1421–1451 deleted; 1453–1481 rewired; 1512 message updated)
- `src/app/graph/physics.worker.ts` (add time + glide integration before runStep)
- `src/app/components/timeline/TimelineAtoms.tsx` (`LfoBadge`, `TrackArmToggle`, recorded-state variant for `TrackKeyframeToggle`)
- `src/app/hooks/useAppEffects.ts` (recorder integration)
- `src/app/hooks/useWorkspaceIO.ts` (serialize `glide` and `modulator` when non-default; version field)

### Verification
- **No-break check**: default Glide 0 means every existing `sprachvernetzungen-*.json` file loads identically. Sidebar Physics tab sliders behave exactly as before. Pulse slider works exactly as before.
- **Sidebar instant-snap regression check**: drag a sidebar physics slider with Glide=0 — confirm the snap is tolerable and no visual stutter.
- Set repulsion track Glide to 1s → param eases in over 1s rather than snapping.
- Jolt effect still fires on rapid sidebar slider movement (physicsVelocityRef still non-zero after rapid changes).
- Record button: arm 2 tracks, press record + play → on stop, keyframes appear sampling `appliedParams` not raw params.
- `npm run test` exits 0.
- `npm run build` + `npx tsc --noEmit` clean.

### 3.6 Glide UI/UX *(design pending — Phase 3 tail)*

**Status:** Worker-side glide integration (`evaluateTracks.ts`) is implemented and tested. `trackMeta.glide` persists through `useWorkspaceIO` (default `0` → no-op). **Zero timeline UI surfaces it.** First UI attempt was reverted because it didn't read well in the existing track-row layout.

**Open question (resolve before re-attempting):** where does `glide` live in the UI? Options to weigh —

- *Per-track inline control* (number input in `TrackRow` header, next to the keyframe diamond). Cheap, but the timeline row is already dense and a unit-suffixed number ("0.5s") competes with the track label visually.
- *Right-click track menu* (already exists via `ContextMenu.tsx`): "Glide…" opens a small popover with slider + numeric. Discoverable enough for a power-user feature, doesn't add row chrome.
- *Sidebar "Track" detail panel*, mirroring how LFO is planned to surface (collapsed by default, expanded per-track). Most room to grow if other per-track knobs (arm, easing default, modulator) join it later.

**Recommendation:** wait until LFO UI is designed (Phase 3.3 `LfoControls.tsx`) and host both in the same per-track detail panel — one disclosure surface, one design pass. Until then, glide remains accessible only via workspace JSON (acceptable: default 0 is a no-op).

**Do not** re-add inline track-row glide UI without resolving the layout question first.

---

## Pre-Phase 4 — Simulation stability & render budget (MUST complete before Phase 4)

**Prerequisites:** Phase 3 verification complete (§Phase 3). Phase 0 / Pre-Phase 3 Tier A items that block builds/tests already green. This phase does **not** re-implement Phase 3 architecture.

**Goal:** Fix leaks and per-frame waste in Network3D, the physics worker, and playback-driven React churn so Phase 4 extraction and the bloom spike land on a stable baseline. Also retire the `pulse` sidebar parameter now that LFO on repulsion/linkDistance is the correct tool.

**Scope boundary:** Behaviour-only fixes in existing files. **No** EffectComposer, **no** `network3d/*` module extraction, **no** God-ref `useMemo` bag (forbidden in Phase 4.1 anyway), **no** Hermite→Bezier work (that is Phase 4.1.5).

**Relationship to Phase 3:** Phase 3 delivered M1 (worker-owned param evaluation). Pre-Phase 4 closes operational gaps surfaced after merge: zombie RAF, GPU teardown, modulation-aware physics wake, main-thread display-path churn (`effectivePhysicsParams`), and the pulse/LFO dual-path left open by §3.5.

**Note on step messages:** Worker `step` still receives `sliderParams` (sidebar baseline) plus `time`/`dt`. That is intentional per §3.2 and matches `evaluateTracks` math; not a Phase 3 defect.

### P0 — Correctness & leaks (blockers)  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*

| ID | Issue | Files | Remediation |
|----|-------|-------|-------------|
| P4-0 | **Remove `pulse` sidebar parameter** — LFO on repulsion/linkDistance is the correct tool. §3.5 kept pulse as a "main-thread convenience"; that rationale no longer holds now that LFO ships. Dual-path (pulse override + LFO) is confusing and makes the jolt-velocity calc messier. | `physics.worker.ts`, `Network3D.tsx`, `WortnetzContext.tsx`, `PhysicsTab.tsx`, `types.ts` | Delete `pulse` from `PhysicsParams` interface; remove the pulse `paramOverrides` block (~lines 1482–1488 in Network3D); remove `phys-pls` track entry from `types.ts`; remove sidebar slider row. Workspace files with `pulse > 0` load cleanly — the value is ignored on parse (add a migration note). For users who want the effect: add an LFO on the repulsion track (plan already suggests a tooltip for this at §3.3). |
| P4-1 | `animationFrameRef` never cancelled; cleanup references unused `animFrame` | `Network3D.tsx` | Cancel `animationFrameRef` on teardown; early-out in `animate` when `isCancelled` |
| P4-2 | `LineSegments` edges + `textureCacheRef` not disposed on scene teardown | `Network3D.tsx` | Dispose edge geometry/material; dispose every cached `CanvasTexture` |
| P4-3 | LFO/glide stop ticking when physics auto-sleeps (`stillFrames` only respects turbulence/movement; playback wake only checks keyframes) | `Network3D.tsx`, optionally `physics.worker.ts` | `hasActiveModulation()`: any track with `modulator.depth > 0`, `glide > 0` with changing target, or `isPlaying` → keep stepping. After P4-0, remove the `curParams.pulse > 0` guard from the auto-stop check. **Preferred efficiency:** when graph settled but modulation active, optional lightweight worker tick that runs `evaluateTracks` only (skip `runStep`) |

### P1 — Hot path reduction (high ROI)  ·  *suggested: Opus 4.7 / high (P4-4); Sonnet 4.6 / medium for the rest*

| ID | Issue | Files | Remediation |
|----|-------|-------|-------------|
| P4-4 | Sidebar physics display `effectivePhysicsParams` useMemo re-runs Hermite ×8 on every `playheadPosition` change (~60/s during play) | `WortnetzContext.tsx`, `PhysicsTab` | Sidebar display reads `network3DRef.getEffectivePhysicsParams()` (worker `applied`) at ~10–15 Hz during playback/scrub. Remove the `effectivePhysicsParams` dependency on `interpolatePhysicsParam` for live display. **Do not** optimise or extend the main-thread Hermite path — it will be deleted/bypassed in Phase 4.1.5 |
| P4-5 | Full `syncGraphVisuals` on every worker step | `Network3D.tsx` | Skip or reduce work when `avgMovement` below epsilon; reuse vectors in glitch path |
| P4-6 | Physics `step` posted every display frame | `Network3D.tsx` | Cap simulation posts at ~30 Hz; keep `renderer.render` at display rate |
| P4-7 | Retina × label `pixelRatio: 3` GPU cost | `Network3D.tsx` | `setPixelRatio(min(dpr, 2))`; consider label build ratio 2 |

### P2 — Mode-specific & optional LOD  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*

| ID | Issue | Files | Remediation |
|----|-------|-------|-------------|
| P4-8 | 2D overlap separation O(n²)×4 on main thread | `Network3D.tsx` | Spatial hash or fewer passes when n > threshold |
| P4-9 | Worker exact repulsion for all n < 2000 (graph runs up to ~700 nodes) | `physics.worker.ts` | Reuse spatial hash at a lower threshold (e.g. n ≥ 150) |
| P4-10 | **Optional** distance-LOD (tier B): cull/simplify distant sprites | `Network3D.tsx` | Only if P0–P1 insufficient; sprites remain billboards per `ARCHITECTURE.md` §1.2 |

### P3 — Allocation hygiene (GC pressure)  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*

These are mostly 1–4 line fixes. Each eliminates a recurring allocation in the per-frame hot path. Do in a single commit; no behaviour change.

| ID | Location | Issue | Remediation |
|----|----------|-------|-------------|
| P4-11 | `Network3D.tsx:603-604` | `new THREE.Color(gradientOrigin/Periphery)` allocated every call to `syncGraphVisuals` (~every step) | Cache two `THREE.Color` refs updated only when `visualSettings` changes |
| P4-12 | `Network3D.tsx:659` | `new THREE.Color().lerpColors(origin, periphery, t)` per node per frame — ~700 allocs/frame at typical graph size | Declare one scratch `THREE.Color` outside the loop; reuse it with `.lerpColors()` |
| P4-13 | `Network3D.tsx:669-670` | `.position.clone().project(camera)` + `new THREE.Vector3()` per node when `glitchActive` | Pre-allocate two scratch `THREE.Vector3`s outside the loop |
| P4-14 | `Network3D.tsx:1478` | `{ ...lastApplied }` spread every animation frame for jolt change-detection | Replace with a flat numeric ref; update scalars directly |
| P4-15 | `physics.worker.ts:355` | `{ ...applied }` snapshot allocated every step for postMessage | Couple with P4-4: send the `applied` snapshot only at the ~10–15 Hz sidebar cadence; full-rate send is wasteful once P4-4 throttles the consumer |
| P4-16 | `evaluateTracks.ts:34` | `Object.keys(sliderParams)` rebuilt every step in the worker (PhysicsParams shape is fixed) | Cache key list as a module-level const array |
| P4-17 | `Network3D.tsx:1442-1443` | `Object.values(physicsKeyframesRef.current).some(...)` + `Object.values(trackMetaRef.current).some(...)` scanned every animation frame (O(tracks × keyframes)) | Replace with two booleans (`hasAnyKfsRef`, `hasAnyModulatorRef`) updated only on `setPhysicsKeyframes` / `setTrackMeta`; feeds into P4-3 cleanly |
| P4-18 | `Network3D.tsx:1428,1455` | `Date.now()` for delta alongside `performance.now()` already computed two lines later | Compute `performance.now()` once per frame; derive `dt` from it; remove `Date.now()` |

### P4 — Worker hot-loop tightening  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*

| ID | Location | Issue | Remediation |
|----|----------|-------|-------------|
| P4-19 | `physics.worker.ts:107-117` | Spatial grid uses `Map<string, number[]>` with template-literal keys — string allocation per node per step | Replace with flat `Int32Array` bucket array keyed by integer cell hash (`(cx * PRIME1 ^ cy * PRIME2 ^ cz) & mask`). Must land before P4-9 lowers the threshold (otherwise P4-9 makes the string-key path hotter) |
| P4-20 | `Network3D.tsx:1249-1267` | 2D overlap O(n²)×4 passes runs every step even when the graph is settled | Gate the overlap passes on `avgMovement > 0.5 || prevMaxOverlap > 0`; skip entirely when both are false |
| P4-21 | `Network3D.tsx:615,629` | `Math.sqrt(maxDistSq)` once + `Math.sqrt(dist²)` per node in `syncGraphVisuals` | Compute `invMaxDist = 1 / Math.sqrt(maxDistSq)` once; per node use `normDistSq = distSq * invMaxDist²` for the cubic falloff (eliminates n×sqrt); only take sqrt if actual distance value is needed elsewhere |

### Explicitly deferred to Phase 4 / Phase 4.1.5

- `usePhysicsWorkerSync`, `textureCache.ts` module move, `useCameraFlyTo`, `useRaycastHover` extraction → Phase 4.1
- EffectComposer / bloom → Phase 4.2 (spike-gated)
- Hermite → Bezier consolidation, GraphEditor curve refactor, segment-evaluator unification → Phase 4.1.5

### Implementation order

```
P4-0 (remove pulse)
  → P4-1 (RAF) → P4-2 (dispose) → P4-3 (modulation wake, cleaner post P4-0)
  → P4-4 (sidebar reads worker applied)
  → P4-5 (syncVisuals skip) → P4-6 (30 Hz cap) → P4-7 (DPR)
  → P4-11–P4-18 (allocation hygiene — one commit)
  → P4-19 (spatial grid typed-array, prerequisite for P4-9)
  → P4-20 (2D overlap gate) → P4-21 (sqrt reduction)
  → P4-8 (2D overlap spatial hash) → P4-9 (worker threshold)
  → P4-10 (LOD, optional)
  → Phase 4.1 extraction
```

P4-0 ships first so P4-3's wake logic never needs to reference pulse. P4-19 must precede P4-9 — lowering the spatial-hash threshold onto a string-key Map makes performance worse, not better.

### Files modified (typical)
- `src/app/graph/physics.worker.ts` (P4-0 interface, P4-3 optional tick, P4-9, P4-15, P4-16, P4-19)
- `src/app/components/Network3D.tsx` (P4-0 pulse block, P4-1–P4-3, P4-5–P4-8, P4-10, P4-11–P4-14, P4-18, P4-20, P4-21)
- `src/app/context/WortnetzContext.tsx` (P4-0 physicsParams, P4-4, P4-17)
- `src/app/components/sidebar/tabs/PhysicsTab.tsx` (P4-0 slider row, P4-4)
- `src/app/components/timeline/types.ts` (P4-0 track entry)
- `src/app/animation/evaluateTracks.ts` (P4-16 key cache)

### Pre-Phase 4 exit gate

- `npm run test` and `npm run build` clean (mandate §5).
- `grep interpolatePhysicsParam src/app/components/Network3D.tsx` → 0 (regression guard for Phase 3).
- `grep -n "pulse" src/app/graph/physics.worker.ts src/app/components/sidebar/tabs/PhysicsTab.tsx src/app/components/Network3D.tsx` → 0 (pulse fully removed).
- Manual: toggle text / 2D↔3D / parse mode 10× — no climbing GPU memory; no duplicate RAF in DevTools Performance.
- Manual: LFO on repulsion (`depth > 0`), graph visually settled — sidebar/worker `applied` still oscillates; auto-sleep fires correctly afterward when LFO depth set to 0.
- Manual: playback 30 s — no full Network3D scene re-init; Timeline usable.
- Manual: load a workspace file that has `physicsParams.pulse > 0` — loads without error; pulse value silently ignored.
- Optional: record baseline Performance profile for "idle 3D settled" and "playback + 2 armed tracks" to compare against post-Phase-4.

---

## Phase 4 — Network3D slim-composer refactor + segment-evaluator unification + visual effects

**Goal:** Apply the **App.tsx / Sidebar slim-composer pattern** to `Network3D.tsx` (currently ~1973 lines): logic lives in hooks and `network3d/*` modules; the composer file only wires props, refs, hooks, and JSX. After extraction, unify the three Hermite call sites onto a single segment evaluator under `animation/` (Phase 4.1.5), then add the EffectComposer-based post-processing pipeline (Phase 4.2, spike-gated). The <800-line target on `Network3D.tsx` is enforced by import-graph review, not by `wc -l` alone.

### 4.1 Extraction (zero behaviour change)  ·  *suggested: Opus 4.7 / high for ref consolidation; Sonnet 4.6 / high for hook extractions*

**Forbidden:** Merging unrelated refs into one `useMemo` object used in React hook dependency arrays. A single memoised ref bag breaks granular `useEffect` deps and causes stale closures in hooks that depend on a subset of refs.

**Required pattern for ref-sync:**
```typescript
const bag = useRef({ onReady, onProgress, /* ... */ });
useEffect(() => {
  bag.current.onReady = onReady;
  bag.current.onProgress = onProgress;
}, [onReady, onProgress, /* exhaustive */]);
// rAF reads bag.current.* only
```

Extract hooks (each a separate commit, Sonnet-tier each):
- `usePhysicsWorkerSync` — worker init + step message packing + response handling.
- `useCameraFlyTo` — [Network3D.tsx:1543-1555](src/app/components/Network3D.tsx#L1543-L1555).
- `useRaycastHover` — [Network3D.tsx:1280-1315](src/app/components/Network3D.tsx#L1280-L1315).
- `useResizeObserver` — already separable.

Extract pure modules (Haiku-tier each — pure code moves):
- `network3d/workerGlue.ts` — worker init + message packing.
- `network3d/textureCache.ts` — sprite texture builder.
- `network3d/syncVisuals.ts` — `syncGraphVisuals` body + dependents.
- *Camera Hermite* extraction goes via Phase 4.1.5, not into `network3d/keyframeInterpolation.ts`. The intermediate filename is intentionally avoided so segment math doesn't briefly live under `network3d/` before moving again.

Remove dead code (Haiku-tier): `applyingKeyframe` (set never read), `frameCount` (incremented never read), commented gizmo block.

**Line gate:** Network3D.tsx ≤800 lines OR ≤400 lines with logic in `src/app/network3d/*` — enforced by import graph review, not `wc -l` alone.

### 4.1.5 Segment-evaluator unification (Hermite today, Bezier-ready)  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*

**Goal:** Collapse the three Hermite call sites onto a **single segment evaluator** so a later Bezier swap is a one-file change, not a hunt across the codebase.

**Today's curve sites:**

| Location | Curve | Role |
|---|---|---|
| `src/app/animation/interpolatePhysicsParam.ts` + worker `evaluateTracks` | Hermite + Catmull-Rom tangents | Physics param values at `time` |
| `Network3D.tsx` `applyCameraKeyframes` (post-4.1: a hook) | Inline Hermite (same helpers) | Camera position/target |
| `TimelineTracks.tsx` graph editor | Duplicate Hermite block | Curve **drawing** in the graph editor |
| `src/app/easing.ts` `solveBezierEasing` | Bezier | Easing presets — currently **not** on the keyframe value path |

**Scope:**

- New `src/app/animation/segmentEvaluate.ts` (name TBD) — single `evaluateSegment(keyframes, time, options)` API, used by:
  - `evaluateTracks` (worker) — replaces the inline Hermite term, keeps LFO/glide/forces untouched.
  - Camera hook (extracted in 4.1) — replaces inline `hermite()`.
  - GraphEditor draw path — deletes the duplicate Hermite block in `TimelineTracks.tsx`.
- Keep the implementation Hermite today; design the API so a future Bezier-handles migration is local to this file.
- Golden tests: extend `interpolatePhysicsParam.test.ts` as the contract suite for the new API.
- Sidebar live-value display: confirm P4-4 already reads worker `applied` (not the old `effectivePhysicsParams` Hermite memo) — Phase 4.1.5 should not re-introduce main-thread segment evaluation for the sidebar.

**Out of scope:**

- Physics forces, LFO, glide integration — stay in `evaluateTracks`; only the keyframe term changes.
- Keyframe/handle schema changes (AE-style Bezier handles vs current Catmull-Rom tangents). That is a workspace-format migration; if/when it lands, it gets its own phase with a version bump.
- GraphEditor visual handle redesign.

**Exit:**

- `grep -rn "hermite\|interpolatePhysicsParam" src/app | grep -v animation/segmentEvaluate | grep -v animation/interpolatePhysicsParam.ts` → 0 matches (single import surface).
- Worker, camera, and graph-editor draw paths all import from `src/app/animation/segmentEvaluate.ts`.
- Visual diff against post-4.1 baseline: identical (same math under a new name).
- `npm run test` clean; new contract test covers all three consumers via the shared API.

### 4.2 Visual effects pipeline (spike-gated)  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*

**Prerequisite spike:** EffectComposer + UnrealBloomPass on sprite scene; validate `alphaTest: 0.1` halos, edge depth ordering, ≥45 fps @500 nodes.

**If spike fails:** Ship extraction only; defer bloom; document CSS fallback. No forward progress on bloom until spike passes.

**No pixel-parity claim** with pre-effects baseline when bloom off — use screenshot diff tolerance.

- Default render path: `RenderPass → OutputPass` (no visible change — verify against Phase 3 baseline).
- Add `UnrealBloomPass` toggleable from a new "Effekte" section in the Visual sidebar tab. Defaults: off.
- Add a minimal `ShaderEffect` slot for future custom passes (vignette, chromatic aberration, DOF) — tagged-union; not exposed in UI yet.
- Bloom intensity is keyframeable via Phase 3 `Track<T>` machinery — add it to the param map.

### Files created
- `src/app/hooks/usePhysicsWorkerSync.ts`
- `src/app/hooks/useCameraFlyTo.ts`
- `src/app/hooks/useRaycastHover.ts`
- `src/app/network3d/workerGlue.ts`
- `src/app/network3d/textureCache.ts`
- `src/app/network3d/syncVisuals.ts`
- `src/app/network3d/effectsPipeline.ts`
- `src/app/animation/segmentEvaluate.ts` *(Phase 4.1.5 — unified Hermite/segment evaluator; replaces inline copies in worker, camera, and GraphEditor)*

### Files modified
- `src/app/components/Network3D.tsx` (extraction targets — file shrinks substantially)
- `src/app/components/sidebar/tabs/VisualTab.tsx` (add Effekte section)
- `src/app/context/WortnetzContextTypes.ts` (add `effects: { bloom: { enabled, intensity } }` to visual settings)

### Verification
- Import graph review confirms extracted modules cover the extraction targets.
- Visual diff against Phase 3 baseline: identical (effects default off).
- Toggle bloom on → glow appears on bright nodes.
- All 5 sidebar tabs and 8 physics tracks unchanged.
- `npm run test` exits 0.

---

## Phase 5 — Toolbar functionality

**Goal:** The toolbar's 7 buttons become real tools. Same simplicity contract: each tool has one obvious purpose, no exposed knobs beyond what's necessary.

### 5.0 NodeOverrideMap + undo extension  ·  *suggested: Opus 4.7 / high*

Before any paint tool ships, the override data structure and undo integration must be established.

- `NodeOverrideMap: Map<nodeId, Partial<{ color, size, opacity, weight }>>`.
- Undo: patches include `overrides` slice OR a separate 30-cap stack.
- Renderer applies overrides after texture resolve; worker ignores overrides.

### 5.1 Tool dispatch foundation  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- Read `activeTool` from context in Network3D's canvas event handlers. (`activeTool` exists in context but is currently never read in Network3D — confirmed gap.)
- Route `mousemove`/`mousedown`/`mouseup`/`click` to a `useToolHandlers(activeTool)` hook that delegates to per-tool implementations.
- Default tool (`pointer`) preserves current orbit + select behaviour.

### 5.2 Navigation tools  ·  *suggested: Sonnet 4.6 / medium · Gemini Pro 3.1 / low*
- `pan`: drag canvas to pan camera target.
- `zoom`: drag-to-zoom (rubber-band box → fit to box).
- `scale`: drag affects the global scale of the network (visual zoom out via spread).
- `rotate`: explicit orbit (currently implicit on `pointer`).
- Each tool is a separate file in `src/app/tools/`; commit per tool.

### 5.3 Paintbrush tool  ·  *suggested: Opus 4.7 / high · Gemini Pro 3.1 / high*
- Hover shows a 3D brush cursor (sized via brush radius).
- Drag over nodes paints a chosen attribute. Default attribute: **color**.
- Painted overrides persist in `NodeOverrideMap` (§5.0). Reset via right-click track header.

### 5.4 Glitch / Path tools  ·  *suggested: Sonnet 4.6 / high · Gemini Pro 3.1 / low*
- `glitch`: click a node region → one-shot physics jolt (boosts repulsion locally for ~0.5s).
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
- `npm run test` exits 0.

---

## Phase 6 — Long-term (architectural placeholders only)

**Not actively planned. Mentioned so Phase 3's `Track<T>` / `Modulator` types reserve room for these without retrofitting.**

- **BPM / musical time**: timeline switchable from seconds to beats. `Modulator.rate` accepts beat divisions (`'1/4'`, `'1/8'`). BPM input in TopBar. Keyframes snap to beat grid. **Note:** current snap formula `Math.round(clamped * 30) / 30` in `useTimelineView.ts:65` is second-based; BPM snap requires `round(t * BPM/60 * PPQ) / (BPM/60*PPQ)` — a separate code path, not an amendment to the existing formula.
- **MIDI mapping**: Web MIDI API. Learn-mode binding from any param to any MIDI CC. MIDI input can drive a track as a modulator alternative.
- **Additional shader effects**: vignette, DOF, chromatic aberration — drop into Phase 4's `ShaderEffect` slot.
- **Tool palette expansion**: lasso select, mask, copy/paste paint patterns.

These exist as a guardrail: when designing Phase 3's `Track<T>` and `Modulator` types, the implementation must not foreclose these futures.

---

## Critical files reference

### Modified (existing)
- `src/app/components/timeline/Timeline.tsx` — P1, P2
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
- `src/app/graph/physics.worker.ts` — P3 (add time + glide integration)
- `src/app/hooks/useAppEffects.ts` — P1 (remove `useRecordingHistory`), P3 (recorder integration)
- `src/app/theme/tokens.ts` — P1
- `src/app/hooks/useWorkspaceIO.ts` — P3 (version field, glide/modulator serialisation)

### Deleted
- `src/app/hooks/useTimelineHistory.ts` — P1

### Created
- `src/app/hooks/useUndoStack.ts` — P1
- `src/app/components/timeline/timeUtils.ts` — P1
- `src/app/animation/Track.ts` — P3
- `src/app/animation/Modulator.ts` — P3
- `src/app/animation/Recorder.ts` — P3
- `src/app/animation/interpolatePhysicsParam.ts` — Phase 0 commit 0.4a (extracted from WortnetzContext.tsx)
- `src/app/components/timeline/LfoControls.tsx` — P3
- `src/app/hooks/usePhysicsWorkerSync.ts` — P4
- `src/app/hooks/useCameraFlyTo.ts` — P4
- `src/app/hooks/useRaycastHover.ts` — P4
- `src/app/animation/segmentEvaluate.ts` — P4.1.5 (unified Hermite/segment evaluator)
- `src/app/network3d/syncVisuals.ts` — P4
- `src/app/network3d/workerGlue.ts` — P4
- `src/app/network3d/textureCache.ts` — P4
- `src/app/network3d/effectsPipeline.ts` — P4
- `src/app/hooks/useToolHandlers.ts` — P5
- `src/app/tools/paint.ts`, `pan.ts`, `scale.ts`, `glitch.ts` — P5

### Reused without modification
- `graph/parsing.ts` (engine, untouched)
- `graph/physics.worker.ts` core integration (P3 adds time + glide logic only)
- `networkTheme.ts`
- shadcn primitives in `components/ui/`
- `SidebarAtoms.tsx` (consumed, not modified)

---

## Verification gates (per phase)

Each phase commits sub-step by sub-step. Per commit:

1. **Test** — `npm run test` exits 0.
2. **Build** — `npm run build` exits 0.
3. **TypeScript** — `npx tsc --noEmit` exits 0.
4. **Smoke test** — `npm run dev`, exercise the affected surface in the browser (≤30s).
5. **Visual parity** — compare against `STYLE_GUIDE.md` "Locked Visual Baseline." Pixel changes only where the plan explicitly authorises (Phase 4 bloom toggle off = no change; Phase 1 timeline color sweep should be identical visually because new tokens carry same hex).

**Phase boundary gate** (additional checks at the end of each phase):

- **End of P0**: `npm run test` ≥25 tests, 0 fail; `npm run build` clean; `check:inspector` pass; `check:time-literals` pass; manual smoke script documented in PR; plan-timeline.md amendments applied.
- **End of P1**: `grep -rE "(text|bg|fill)-(red|purple)-[0-9]" src/app/components/timeline` returns 0; record button is disabled; undo works on graph-value drag; `npm run test` exits 0.
- **End of P2**: any keyframe action that opens the clipboard is undoable as a single step; `npm run test` exits 0.
- **End of P3**: existing workspace files (`sprachvernetzungen-*.json`) load with identical playback behaviour (Glide 0 is the silent default). Sidebar Physics tab sliders all unchanged. Pulse slider still works. LFO collapsed by default. Record produces editable keyframes sampling `appliedParams`. Jolt effect still fires on rapid sidebar slider movement. `npm run test` exits 0.
- **End of P4**: import graph review confirms extractions; bloom toggle works; off by default; `npm run test` exits 0.
- **End of P5**: every toolbar button has visible effect on canvas; pointer is default and unchanged from today; `npm run test` exits 0.

### Test automation gate (all phases)

1. `npm run test` → exit 0
2. `npm run build` → exit 0
3. New behaviour → new `*.test.ts`
4. Manual smoke ≤30s → supplementary only

**On failure:** HALT → REVERT → FIX (no stacking commits, no `--no-verify`)
