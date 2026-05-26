# Merged Audit: Handover Context × Plan × Codebase Reality

## Documents Analyzed

| Doc | Role | Lines |
|-----|------|-------|
| [read-project-md...proud-sedgewick.md](file:///Users/christoph/Documents/Code/wortnetzui/read-project-md-architecture-md-style-gu-proud-sedgewick.md) | **Architectural Handover Context** — the original master roadmap (Phases 1–6) | 462 |
| [plan-timeline-update.md](file:///Users/christoph/Documents/Code/wortnetzui/plan-timeline-update.md) | **Amended Roadmap** — evolved version with Pre-Phase 4, engineering mandates, phase completion markers | 720 |
| [make-thorough-plan-to-snappy-hopcroft.md](file:///Users/christoph/Documents/Code/wortnetzui/make-thorough-plan-to-snappy-hopcroft.md) | **Phase 1 execution plan** — 19-commit breakdown of Phase 1 | 154 |
| My audit (previous turn) | **Live codebase verification** — grep, wc -l, test runs, file reads | — |

---

## 1. Document Relationship

The three docs are **generations of the same plan**:

```
Handover (proud-sedgewick)   ← original blueprint, written pre-implementation
    ↓ evolved into
plan-timeline-update.md      ← living document, has amendment log, phase completion markers
    ↓ detailed one phase into
make-thorough-plan (snappy-hopcroft)  ← Phase 1 execution plan, 19 commits
```

`plan-timeline-update.md` is the **authoritative version** — it supersedes the Handover on every point where they conflict. The Handover should be treated as historical context only.

---

## 2. Overlap Analysis

### Nearly identical content (90%+ overlap)
- Guiding principles §1–4
- Model/effort selection guide table
- Phase 1 §1.1–1.6 (undo, history commit, recording, atoms, color sweep, cleanup)
- Phase 2 §2.1–2.7 (all sub-items)
- Phase 3 §3.1–3.5 (all sub-items)
- Phase 5 §5.1–5.4 (all sub-items)
- Phase 6 long-term placeholders
- Critical files reference
- Verification gates

### Where plan-timeline-update.md improves on the Handover
| Area | Handover | Amended plan | Assessment |
|------|----------|-------------|------------|
| Engineering mandates | Not present | §M1–M5 (thread sanity, undo memory, atom enforcement, URL truth, test gate) | ✅ Good additions |
| Undo capacity | "50 entries" (§1.1) | "30 entries" (§M2, §1.1) | ✅ Corrected — actual code uses 30 |
| Phase completion markers | None | `~~Phase 1~~ ✓ COMPLETE`, Phase 2 with frozen items, Phase 3 with Glide UI deferred | ✅ Critical tracking |
| Pre-Phase 4 section | Not present | Full P4-0 through P4-21 stability patches | ✅ Major addition |
| Phase 4.1.5 | Not present | Segment-evaluator unification (Hermite→Bezier-ready) | ✅ Good addition |
| Phase 5.0 | Not present | NodeOverrideMap + undo extension prerequisite for paint tool | ✅ Good addition |
| Recording v2 sampling | "sample armed-track param values at 30Hz" | "sample `appliedParams` from **worker responses** (not raw `physicsParams`)" | ✅ Critical correction |
| `applyingKeyframe` | Lists as "dead code" (§4.1) | Lists as "dead code" (§4.1, line 501) | ❌ **Both wrong** — still used |
| `physicsBlendActiveRef` | §3.5 says "remove when worker glide ships" | Same | ✅ Correct, and verified removed |
| Pulse handling | §3.3 says "keep, don't break" | P4-0 says "remove" (LFO supersedes) | ✅ Correct evolution — pulse removed |
| Phase 4 extraction | Lists `usePhysicsBlend`, `useCameraFlyTo`, etc. | Lists `usePhysicsWorkerSync` (renamed), `useCameraFlyTo`, etc. | ✅ Name refinement |
| Phase 4 line target | "< 800" | "≤ 800 lines OR ≤400 with logic in network3d/*" | ✅ More nuanced |
| Bloom spike gate | Not present | "If spike fails: ship extraction only; defer bloom" | ✅ Risk mitigation |

---

## 3. Contradictions Found

### ❌ C1: `applyingKeyframe` — BOTH docs say it's dead code; it's NOT

| Source | Claim |
|--------|-------|
| Handover §4.1 | "Remove dead code: `applyingKeyframe` (set never read)" |
| plan-timeline-update.md §4.1 line 501 | Same: "Remove dead code: `applyingKeyframe` (set never read)" |
| **Actual code** | [Network3D.tsx:1128](file:///Users/christoph/Documents/Code/wortnetzui/src/app/components/Network3D.tsx#L1128): `let applyingKeyframe = false;` — set at [L1542](file:///Users/christoph/Documents/Code/wortnetzui/src/app/components/Network3D.tsx#L1542) and **read** at [L1130](file:///Users/christoph/Documents/Code/wortnetzui/src/app/components/Network3D.tsx#L1130) to gate `onCameraChangeRef.current?.()` during programmatic camera moves |

**Verdict**: **Do NOT delete.** Both docs are wrong. It's a local variable inside the effect closure — the audit tools probably missed it because it's not a ref. It prevents infinite feedback loops when `applyCameraKeyframes` moves the camera.

---

### ❌ C2: Undo capacity — Handover says 50, amended plan says 30, code says 30

| Source | Capacity |
|--------|----------|
| Handover §1.1 | 50 |
| make-thorough-plan §1.1 Commit A | 50 |
| plan-timeline-update.md §M2, §1.1 | 30 |
| [useUndoStack.ts:17](file:///Users/christoph/Documents/Code/wortnetzui/src/app/hooks/useUndoStack.ts#L17) | `capacity = 30` |

**Verdict**: Code and amended plan agree on 30. Handover and snappy-hopcroft are stale. No action needed in code.

---

### ❌ C3: `handleSetValue` bug description differs

| Source | Description |
|--------|-------------|
| Handover §1.2, Context bullet 3 | "never calls `pushHistory` — graph value drags are not undoable" |
| plan-timeline-update.md §1.2 (A1) | "never mutates physics state — physics tracks fall through the camera-only branch silently" |

The Handover identifies a **symptom** (no undo). The amended plan identifies the **root cause** (A1 defect — physics branch was a no-op). The A1 fix was implemented. Both are stale descriptions of a fixed issue.

---

### ❌ C4: COLOR map — plan says sweep incomplete, code confirms

| Source | Claim |
|--------|-------|
| Handover §1.5 | Lists only `--wn-timeline-marker-fill`, `--wn-timeline-playhead`, `--wn-timeline-recording` |
| plan-timeline-update.md §1.5 | **Also** explicitly says "sweep COLOR map in types.ts — `dot` and `border` fields still contain raw Tailwind" |
| Code ([types.ts:125-126](file:///Users/christoph/Documents/Code/wortnetzui/src/app/components/timeline/types.ts#L125-L126)) | `bg-blue-500`, `border-l-blue-500/60`, `bg-blue-950/10`, `bg-orange-500`, `border-l-orange-500/60`, `bg-orange-950/10` — **still raw Tailwind** |

**Verdict**: The amended plan correctly identified this. It was not completed during Phase 1 implementation. My audit caught the same thing. **Must fix.**

---

### ❌ C5: Phase 2 frozen gaps vs Handover's Phase 2

The Handover lists Phase 2 features as all-planned. The amended plan marks several as ❄️ frozen:
- Shift-drag axis lock (2.3)
- Alt+background pan (2.3)
- Time-reverse selection (2.4)
- Easing click-cycle (2.7)

Additionally, some items are marked "To implement" (not frozen, not done):
- Snap-to-playhead during drag (2.3)
- Alt-drag = duplicate (2.3)
- GraphEditor tangent handle hit detection (2.6)

**Verdict**: The Handover doesn't distinguish. The amended plan's status tracking is accurate. No action needed for my immediate work.

---

### ❌ C6: Plan says `useRecordingHistory` should be deleted; it's already gone

Both plans say delete it. `grep -rn 'useRecordingHistory' src/app/` → 0 matches. ✅ Already done.

---

### ❌ C7: Plan says delete `useTimelineHistory.ts`; it's already gone

Both plans say delete it. `test -f src/app/hooks/useTimelineHistory.ts` → DELETED. ✅ Already done.

---

## 4. Stale Claims in Living Documents

> [!WARNING]
> These are factual errors in docs that reference the current codebase but describe a state that no longer exists.

| ID | Document | Line | Stale Claim | Reality |
|----|----------|------|-------------|---------|
| S-1 | Handover Context | L7 | "TimelineAtoms.tsx exports only 2 atoms" | Now exports 8+ atoms (TrackLabel, TimelineTransportButton, PlayheadLine, RecordButton, RecordingIndicator, SceneMarkerHandle, TrackValueChip, TrackKeyframeToggle) |
| S-2 | Handover Context | L8 | "`useTimelineHistory.ts` exists but is unused" | File deleted |
| S-3 | Handover Context | L9 | "`handleSetValue` never calls `pushHistory`" | A1 defect fixed |
| S-4 | Handover Context | L10 | "Recording is broken: the button toggles but no code samples" | Recording v2 fully implemented in `Recorder.ts` |
| S-5 | Handover Context | L11 | "Hardcoded colors: `text-purple-400`, `bg-red-500`" | `text-purple-400`, `bg-red-500` migrated to CSS vars; `bg-blue-500`, `bg-orange-500` remain (see C4) |
| S-6 | Handover Context | L13 | "`Network3D.tsx` (1973 lines)... dead `applyingKeyframe`/`frameCount`" | `frameCount` removed ✅; `applyingKeyframe` is NOT dead (see C1) |
| S-7 | Handover Context | L15 | "Existing `pulse` parameter" | Pulse removed per P4-0 ✅ |
| S-8 | plan-timeline-update.md L5 | "Doc status" | Says "next active section is **Pre-Phase 4**" | Pre-Phase 4 is **complete** (P4-0 through P4-21 committed). Next active is Phase 4. |
| S-9 | plan-timeline-update.md L501 | Phase 4.1 dead code | "Remove dead code: `applyingKeyframe` (set never read)" | **Wrong** — see C1 |
| S-10 | [ARCHITECTURE.md:57](file:///Users/christoph/Documents/Code/wortnetzui/ARCHITECTURE.md#L57) | §2.2 title | "`useTimelineHistory`" | Should be `useUndoStack` |
| S-11 | [ARCHITECTURE.md:57](file:///Users/christoph/Documents/Code/wortnetzui/ARCHITECTURE.md#L57) | §2.2 body | "capped stack (max 50)", "debounced commit strategy" | Capacity is 30; debounce is `setTimeout`-based, not the fictional description |
| S-12 | [PROJECT.md:41](file:///Users/christoph/Documents/Code/wortnetzui/PROJECT.md#L41) | File map | References `PRE-PHASE5-REMEDIATION.md` | File doesn't exist |
| S-13 | [AGENTS.md:31](file:///Users/christoph/Documents/Code/wortnetzui/AGENTS.md#L31) | i18n locale guidance | "see PRE-PHASE5-REMEDIATION.md §I18N gates" | File doesn't exist |

---

## 5. Zombie/Dead Exports in TimelineAtoms

The plan-timeline-update.md §1.4 explicitly calls out **C1–C3**: `TrackValueChip`, `TrackEditableNumber`, `TrackKeyframeToggle` are "exported but have zero consumers outside TimelineAtoms.tsx."

**Current state verified**:
- `TrackValueChip` — exported, **zero consumers** outside TimelineAtoms.tsx
- `TrackKeyframeToggle` — exported, **zero consumers** outside TimelineAtoms.tsx
- `TrackEditableNumber` — **not even exported** (doesn't exist in TimelineAtoms.tsx)

These are ready-built atoms waiting to be wired into `TimelineTracks.tsx`. Not dead code per se — they're Phase 1.4 deferred work (the atoms exist, the consumer wiring doesn't). But they do bloat the export surface and create a false impression of completeness.

---

## 6. Logic Errors in the Plans

### L-1: `plan-timeline-update.md` Pre-Phase 4 exit gate is INCOMPLETE

The exit gate at line 458-467 checks for `pulse` removal and manual smoke tests, but does NOT include the P1-tier allocation hygiene items (P4-11 through P4-18) as gate criteria. This means some P1 fixes could be silently skipped and the gate would still pass.

**Assessment**: Minor. The implementation order (line 436-446) lists them, and they're small single-commit items. But the gate should ideally verify they're done.

### L-2: `plan-timeline-update.md` Phase 4 references `usePhysicsBlend` extraction

The Handover §4.1 lists `usePhysicsBlend` as an extraction target. The amended plan §4.1 lists `usePhysicsWorkerSync` instead. But the "param blend region" ([Network3D.tsx:1421-1492](src/app/components/Network3D.tsx#L1421-L1492)) described in both docs **no longer exists in the form they describe** — Phase 3 moved Hermite evaluation to the worker, so the "blend region" is now just the jolt mechanism + worker message packing. The hook name and scope need to be re-evaluated at Phase 4 time.

### L-3: Handover Context is stale enough to be misleading

Every "Context" bullet (L7-L18) describes a state that has been partially or fully fixed. New contributors reading this document would get a wrong mental model. It should either be clearly marked as historical or deleted.

---

## Merged Implementation Plan

Given all the above, here's what actually needs doing **right now**, in priority order. I'm excluding everything that's already complete and everything that belongs to future phases (4, 5, 6).

### Phase ① — Documentation Corrections (zero code risk)

> [!TIP]
> All doc-only. Can be done in a single commit or split for clarity.

#### Commit 1.1: Fix ARCHITECTURE.md §2.2
- **Title**: `useTimelineHistory` → `useUndoStack`
- **Capacity**: 50 → 30
- **Description**: Replace fictional "debounced commit strategy" with actual implementation: `structuredClone` snapshots, `preDragStateRef` drag bracketing, `pushDebounced(ms)` via setTimeout
- **Scope**: Add `trackMeta` (glide/modulator) to tracked state description

#### Commit 1.2: Fix PROJECT.md file map
- Remove `PRE-PHASE5-REMEDIATION.md` row (file doesn't exist)
- Add `src/app/animation/` directory entries (evaluateTracks, interpolatePhysicsParam, Track, Modulator, Recorder)
- Add `src/app/context/WortnetzContextConstants.ts` and `WortnetzContextTypes.ts`

#### Commit 1.3: Fix AGENTS.md stale reference
- Remove "see PRE-PHASE5-REMEDIATION.md §I18N gates"
- Replace with inline parity check: `node -e "const d=Object.keys(require('./src/app/i18n/locales/de.json'));const e=Object.keys(require('./src/app/i18n/locales/en.json'));const dm=d.filter(k=>!e.includes(k));const em=e.filter(k=>!d.includes(k));if(dm.length||em.length){console.error('Missing:',{de:dm,en:em});process.exit(1)}"`

#### Commit 1.4: Update ROADMAP.md
- Mark Phases 1-3 (timeline/animation) as complete
- Mark Pre-Phase 4 (stability) as complete
- Set Phase 4 (Network3D extraction) as next active
- Document frozen Phase 2 gaps and deferred Glide UI

#### Commit 1.5: Update plan-timeline-update.md status header
- Change "next active section is **Pre-Phase 4**" to "Pre-Phase 4 is complete. Next active section is **Phase 4**."
- Fix §4.1 line 501: remove `applyingKeyframe` from dead code list with a note explaining it IS live

---

### Phase ② — Code Fixes (low-risk, isolated)

#### Commit 2.1: Migrate remaining COLOR map to CSS vars (plan §1.5 completion)

**Files**: [types.ts](file:///Users/christoph/Documents/Code/wortnetzui/src/app/components/timeline/types.ts), CSS tokens

Add CSS custom properties:
- `--wn-timeline-cyan-dot` → `#3b82f6` (blue-500)
- `--wn-timeline-cyan-border` → `rgba(59, 130, 246, 0.6)` (blue-500/60)
- `--wn-timeline-cyan-track-bg` → `rgba(23, 37, 84, 0.1)` (blue-950/10)
- `--wn-timeline-orange-dot` → `#f97316` (orange-500)
- `--wn-timeline-orange-border` → `rgba(249, 115, 22, 0.6)` (orange-500/60)
- `--wn-timeline-orange-track-bg` → `rgba(67, 20, 7, 0.1)` (orange-950/10)

Update `COLOR` map in `types.ts` to reference these vars instead of Tailwind utilities. Update consumer components (`TimelineTracks.tsx`, `Timeline.tsx`) to apply via inline `style` using `var(--wn-timeline-*)`.

**Verification**: `grep -rE '(text|bg|fill|border)-(red|purple|blue|orange|emerald|indigo)-[0-9]' src/app/components/timeline/` → 0 matches

#### Commit 2.2: Fix i18n violations in Network3D.tsx (AGENTS.md §3)

**Files**: [Network3D.tsx](file:///Users/christoph/Documents/Code/wortnetzui/src/app/components/Network3D.tsx), `de.json`, `en.json`

4 hardcoded strings to fix:
- L1934: `CAMERA LOCKED` → `t('network3d.camera.locked')`
- L1942: `UNLOCK` → `t('network3d.camera.unlock')`
- L1959: `Center View` → `t('network3d.contextMenu.centerView')`
- L1986: `Lock Camera to Node` → `t('network3d.contextMenu.lockCamera')`

Network3D is a `forwardRef` component. Use `i18n.t()` via singleton import (per AGENTS.md §3, following [ErrorBoundary.tsx](file:///Users/christoph/Documents/Code/wortnetzui/src/app/components/ErrorBoundary.tsx) pattern).

Add to both locale files:
```json
// en.json
"network3d.camera.locked": "Camera locked",
"network3d.camera.unlock": "Unlock",
"network3d.contextMenu.centerView": "Center view",
"network3d.contextMenu.lockCamera": "Lock camera to node"

// de.json
"network3d.camera.locked": "Kamera gesperrt",
"network3d.camera.unlock": "Entsperren",
"network3d.contextMenu.centerView": "Ansicht zentrieren",
"network3d.contextMenu.lockCamera": "Kamera auf Knoten sperren"
```

#### Commit 2.3: Remove dead gizmo code from Network3D.tsx

Delete ~150 lines:
- `getGizmoAxisAtPoint` function (L1780-1813, zero callers)
- Commented-out `handleGizmoMouseDown/Move/Up` (L1816-1884)
- Commented-out `handleZoomSlider` (L1770-1778)
- Commented-out gizmo JSX in render (L1901-1928)
- Commented-out gizmo block in animate loop (L1597-1601)
- Unused refs: `gizmoCanvasRef`, `zoomSliderRef`, `gizmoDragRef`, `gizmoHoverRef`, `gizmoActiveRef`
- Unused imports if any become orphaned (e.g. `distToSliderVal`, `sliderValToDist` if only used by gizmo)

**Verification**: Build clean, tests pass, `wc -l Network3D.tsx` ≈ 1844

#### Commit 2.4: Slim App.tsx to ≤150 lines

Currently 160 lines. Extract the `PathAnimatorUI` conditional block (L71-77) into a tiny `PathAnimatorOverlay` component or inline-collapse some JSX wrapper nesting.

**Verification**: `wc -l src/app/App.tsx` ≤ 150

---

### Phase ③ — Verification Gate

After all commits:
- [ ] `npm run test` → 81+ tests, 0 failures
- [ ] `npm run build` → clean
- [ ] `wc -l src/app/App.tsx` ≤ 150
- [ ] `grep -rE '(text|bg|fill|border)-(red|purple|blue|orange|emerald|indigo)-[0-9]' src/app/components/timeline/` → 0
- [ ] No hardcoded user-facing strings in Network3D.tsx JSX
- [ ] All doc files reference only existing files
- [ ] ROADMAP.md reflects actual project state
- [ ] i18n parity check passes (de.json and en.json key sets match)

---

## Explicitly NOT Doing (deferred items with rationale)

| Item | Why deferred | When |
|------|-------------|------|
| Wire zombie atoms (TrackValueChip, TrackKeyframeToggle into TimelineTracks) | Phase 1.4 continuation — requires touching consumer layout logic | Phase 4 prep |
| Phase 2 frozen gaps (shift-drag, Alt-pan, time-reverse, easing cycle) | Explicitly frozen in amended plan | Phase 2 resume after Phase 4 |
| Phase 2 "To implement" (snap-to-playhead, alt-drag duplicate, tangent hit detection) | Not frozen but not blocking Phase 4 | Phase 2 resume |
| Glide UI | Deferred per §3.6 until LFO UI design resolves layout question | Post-Phase 4 |
| Network3D extraction (hooks, modules) | Phase 4.1 | Next major phase |
| EffectComposer / bloom | Phase 4.2, spike-gated | After 4.1 |
| Segment-evaluator unification | Phase 4.1.5 | After 4.1 |
| `applyingKeyframe` deletion | **Never** — it's live code, not dead | Remove from dead code lists |
| P4-14 Object.assign optimization | Low priority, no functional impact | Phase 4 if time permits |
| Stale Handover document cleanup | The Handover Context is historical; marking its Phase 1-3 Context section as historical snapshot is enough | Commit 1.5 or separate |

---

## Open Questions

> [!IMPORTANT]
> **Q1**: The `COLOR` map in `types.ts` uses `dot`/`border`/`trackBg` as Tailwind class strings that get applied via `className`. Migrating to CSS vars means these consumers need to switch from `className={COLOR[tone].dot}` to `style={{ backgroundColor: 'var(--wn-timeline-cyan-dot)' }}`. This is a mild pattern break from how the other COLOR fields work. Should I:
> - (a) Convert all 6 fields to CSS vars and update consumers to use inline styles, OR
> - (b) Convert to CSS vars but create thin wrapper classes in the CSS file (`.wn-timeline-dot-cyan { background-color: var(--wn-timeline-cyan-dot) }`) so consumers can still use `className`?

> [!IMPORTANT]
> **Q2**: App.tsx is 160 lines (10 over mandate). The quickest fix is collapsing wrapper divs. The alternative is extracting the PathAnimatorUI conditional into a child component. Which approach do you prefer?
