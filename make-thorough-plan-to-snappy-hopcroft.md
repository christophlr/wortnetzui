# Phase 1 — Timeline correctness + atomization

## Context

The sidebar atomic refactor has shipped. The next target is the timeline subsystem, where audits surfaced concrete issues: a dead-but-imported undo hook, an inline duplicate undo stack in `WortnetzContext`, history-commit gaps in value/handle/clear-handle handlers, a broken "record" button, hardcoded `red/purple` Tailwind colors, a thin `TimelineAtoms.tsx` (2 atoms vs. the sidebar's 13+), and an unused `TimelineContextMenu` custom-portal function. Phase 1 is the mechanical, smallest of the roadmap's five phases — it lands the corrections that unblock Phases 2 and 3 (epsilon helper for the dedup bug; atoms for keyframe variants; undo hook for recording v2).

**Outcome:** unified undo via a real hook, every parameter mutation undoable as a single drag-gesture step, honest WIP record button, expanded `TimelineAtoms.tsx`, zero hardcoded `red/purple/blue/emerald/indigo` Tailwind utilities under `src/app/components/timeline`. No visual change — token hexes match the literals they replace.

## Decisions (from clarifying questions)

- **Record button:** disable + use the existing `title` prop on `TimelineTransportButton` (renders as native browser tooltip). No new Tooltip-component wrapping.
- **Audit cadence:** `npm run build` + `npx tsc --noEmit` + focused smoke test **after every commit**. Slow but safe — failures bisect to a single small diff.

## Approach summary

Six sub-steps, ~15 commits total. Each commit modifies a small, coherent slice; verification runs before the next commit. Sub-steps mostly independent; ordering chosen so that helpers land before their consumers:

1. **1.6a — `timeUtils.ts`** (one commit, first because cheap and unblocks others): extract `TIME_EPSILON = 0.1` + `sameTime(a, b)`. Replace inline `Math.abs(... - ...) <= 0.1` and `< 0.01` occurrences in `WortnetzContext.tsx` *only where the threshold is genuinely about "same time"* — leave drag-sensitivity (`0.001` at `TimelineTracks.tsx:208`) untouched. **Caveat:** 6 of the 10 occurrences use `< 0.01` (selection match, move detection). The audit found Phase 2.1 is the actual bug fix for that threshold mismatch — for Phase 1, **only standardize the `0.1` cluster** (capture tolerance, lines ~196, 209, 226, 251, 255, 511). Leave `0.01` callsites alone with a `// Phase 2.1: epsilon mismatch (intentional)` comment beside one of them so we don't forget.

2. **1.1 — `useUndoStack.ts`**:
   - **Commit A**: Create `src/app/hooks/useUndoStack.ts` with signature `useUndoStack(getState, applyState, { capacity = 50 })` returning `{ push, pushDebounced, undo, redo, canUndo, canRedo }`. Re-implement the inline pattern verbatim; add `pushDebounced(ms)` via a single `setTimeout` ref. Capped at 50.
   - **Commit B**: Swap `WortnetzContext.tsx` lines 97–127 to call into the hook. `getTimelineState` already exists in the file; reuse it. Apply-fn is the three setters bundled. All existing call sites (`pushHistory(...)`) keep their identical signature.
   - **Commit C**: Delete `src/app/hooks/useTimelineHistory.ts` (audit confirmed zero references). Update `PROJECT.md` "Reverse Index" row to point undo/redo at the new file.

3. **1.2 — Missing history commits**: one commit per handler.
   - **Commit A**: `handleSetValue` ([WortnetzContext.tsx:496–504]) — wrap via the `preDragStateRef` / `handleDragStart` / `handleDragEnd` pattern already in place at lines 578–587. Caller in `GraphEditor.tsx` (value-drag start/end) already calls `handleDragStart` / `handleDragEnd` for keyframe drags; verify it also calls them for tension drags (if not, wire those mouse handlers).
   - **Commit B**: `handleSetHandle` (lines 348–387) — same pattern.
   - **Commit C**: `handleSetHandle2D` is an alias for `handleSetHandle` per audit — no separate commit needed; covered by B. Note in commit message.
   - **Commit D**: `handleClearHandle` (lines 389–414) — clear is a single discrete action, not a drag; push directly *after* the state change.

4. **1.3 — Disable recording**: single commit.
   - In `Timeline.tsx` (audit found it at `src/app/components/timeline/Timeline.tsx`, lines 303–311), pass `disabled` to the `TimelineTransportButton` and set `title={t('timeline.recordComingSoon')}`. Add the i18n key to both `de.json` ("Aufnahme wird in einer kommenden Version verfügbar sein") and `en.json` ("Recording will be available in a future version"). Keep `isRecording` state in context (Phase 3 reuses it).
   - Same commit: remove `useRecordingHistory` from `useAppEffects.ts` and its import + call site.

5. **1.4 — TimelineAtoms expansion**: one commit per atom. Order: cheapest → hardest, so a failure mid-way leaves a working app at any boundary.
   - **Commit A — `PlayheadLine`**: extract the duplicated `bg-red-500` playhead at `Timeline.tsx:347` and `:506`. Signature `{ x: number; height?: 'full' | number }`. Uses `--wn-timeline-playhead` from sub-step 1.5 — so sequence-wise, do **1.5 first** if `PlayheadLine` should already consume the token. Decision: **do 1.5 before 1.4-A**.
   - **Commit B — `RecordingIndicator`**: thin wrapper around the `Circle` icon at `Timeline.tsx:310`. Signature `{ isActive: boolean }`. Uses `--wn-timeline-recording` token from 1.5.
   - **Commit C — `SceneMarkerHandle`**: extract from `TimelineTracks.tsx:75, 91–92`. Signature `{ marker, isSelected, onClick, onDrag }`. Uses `--wn-timeline-marker-fill` (already present in tokens per audit) — verify it's the right hex.
   - **Commit D — `TrackValueChip`**: signature `{ value: number; format?: (v) => string }`. Mirrors `SidebarValueChip` — composes it where possible.
   - **Commit E — `TrackEditableNumber`**: mirrors `SidebarEditableNumber` directly (audit showed signature). Same commit-on-Enter/Tab/blur, cancel-on-Esc, clamp behavior. Reuse `SidebarEditableNumber` if styling matches; otherwise duplicate and diverge later.
   - **Commit F — `TrackKeyframeToggle`**: extract from `Timeline.tsx:303–307` (the keyframe capture/delete diamond). Signature `{ hasKeyframe, onCapture, onDelete, state?: 'normal' | 'recorded' }`. Variant only — no `className` overrides accepted.
   - **Commit G — `GraphEditorHeader`**: extract from `GraphEditor.tsx:203–221`. Signature `{ title: string; actions?: ReactNode }`. Keep min/max value display inside (it's intrinsic to the header).
   - **Commit H — `TrackGroup`**: replace `TimelineTracks.tsx:305–324`. Signature `{ title, colorTone, isCollapsed, onToggle, actions?, children }`.
   - **Commit I — `TrackRow`** (hardest, last): replace `TimelineTracks.tsx:220–283`. Signature `{ trackId, label, colorTone, isHovered?, isExpanded?, onToggleGraph?, children }`. The conditional className for the graph-editor toggle button → encode as `state` variant inside the atom. Children = the track area (keyframes/curve), still rendered by the consumer.

6. **1.5 — Hardcoded color sweep**: one commit. Sequenced **before 1.4** so the new atoms consume tokens, not literals.
   - Add to `theme.css` + `CssVarName` union in `theme/tokens.ts`:
     - `--wn-timeline-marker-fill` → hex for `purple-400` (`#c084fc`).
     - `--wn-timeline-playhead` → hex for `red-500` (`#ef4444`).
     - `--wn-timeline-recording` → hex for `red-500` (`#ef4444`).
   - Replace the four literal call sites:
     - `TimelineTracks.tsx:75` — `text-purple-400` + `fill="currentColor"`.
     - `Timeline.tsx:347` — `bg-red-500` (ruler playhead).
     - `Timeline.tsx:506` — `bg-red-500` (track playhead).
     - `Timeline.tsx:310` — `text-red-500 fill-red-500`.
   - Audit: `--wn-timeline-marker-fill` already exists in the `CssVarName` union (per Explore). Confirm whether it's defined in `theme.css` — if yes, only add the two new ones; if no, add all three.

7. **1.6b — Cleanup tail**: one commit.
   - Delete unused `TimelineContextMenu` function ([ContextMenu.tsx:135–150]) — audit confirmed the active path is `TimelineContextMenuContent` via Radix.
   - **Note:** The plan's third 1.6 bullet ("Remove the custom fixed-position portal pattern in `Timeline.tsx:518`") refers to the same `TimelineContextMenu` function — Explore confirmed `Timeline.tsx:517–527` is already Radix-native. So the third bullet is **redundant** with bullet 1; no separate action needed.

## Final sequence (commit-by-commit)

```
1.  1.6a  timeUtils.ts + standardize 0.1 epsilon callsites
2.  1.1A  useUndoStack.ts (new hook, not yet wired)
3.  1.1B  WortnetzContext swaps to useUndoStack
4.  1.1C  delete useTimelineHistory.ts (+ PROJECT.md update)
5.  1.2A  handleSetValue history commit
6.  1.2B  handleSetHandle history commit (covers handleSetHandle2D)
7.  1.2D  handleClearHandle history commit
8.  1.3   disable record button + remove useRecordingHistory
9.  1.5   color sweep (tokens + literal replacements)
10. 1.4A  PlayheadLine atom
11. 1.4B  RecordingIndicator atom
12. 1.4C  SceneMarkerHandle atom
13. 1.4D  TrackValueChip atom
14. 1.4E  TrackEditableNumber atom
15. 1.4F  TrackKeyframeToggle atom
16. 1.4G  GraphEditorHeader atom
17. 1.4H  TrackGroup atom
18. 1.4I  TrackRow atom
19. 1.6b  delete TimelineContextMenu
```

19 commits. Each ≤ ~100 lines diff. If a commit grows past that, split.

## Per-commit verification (every single commit)

1. `npm run build` exits 0.
2. `npx tsc --noEmit` exits 0.
3. Focused manual smoke test: open `npm run dev`, exercise the surface the commit touched (e.g. for 1.2A → drag a tension handle, undo, confirm one step).
4. For commits touching `theme.css` / tokens: visually compare the affected element pre/post — hexes match, no shift.

If any step fails, fix forward in the same working tree before the next commit. Never `--amend` (per CLAUDE.md guidance).

## Roadmap doc update (additional commit)

After commit 19, add one final commit that edits the parent roadmap file `/Users/christoph/.claude/plans/read-project-md-architecture-md-style-gu-proud-sedgewick.md`:

- In the **"Verification gates (per phase)"** section near the bottom, strengthen the wording from "Each phase commits sub-step by sub-step. Per commit:" to make it explicit that **the audit cadence is per-commit, not per-sub-step**: build + tsc + smoke test run after every individual commit, and a failure blocks the next commit.
- Add a one-line note at the top of the "Per commit" list: *"Audit cadence is per-commit. If a check fails, fix forward in the same working tree — never `--amend` past a published commit."*
- Mirror the same rule into each later phase's verification section so Phase 2–5 inherit the same discipline.

This is a documentation-only commit; no code changes. Verification is just a re-read of the diff.

## End-of-Phase-1 gate

- `grep -rE "(text|bg|fill)-(red|purple|blue|emerald|indigo)-[0-9]" src/app/components/timeline` → 0 matches.
- Record button is `disabled` and shows native tooltip on hover.
- Drag a value in `GraphEditor` → undo once → value reverts to pre-drag.
- Drag a keyframe in the dopesheet → undo once → keyframe returns to original time.
- Rapid scrubs don't blow the 50-entry stack (manual: drag 80 times, then undo — stack still functional).
- `src/app/hooks/useTimelineHistory.ts` does not exist.
- `src/app/hooks/useUndoStack.ts` exists; `useRecordingHistory` not exported anywhere.
- 5 sidebar tabs render unchanged; 8 physics tracks render unchanged.

## Critical files

**Modified:**
- `src/app/components/timeline/Timeline.tsx`
- `src/app/components/timeline/TimelineAtoms.tsx`
- `src/app/components/timeline/TimelineTracks.tsx`
- `src/app/components/timeline/GraphEditor.tsx`
- `src/app/components/timeline/ContextMenu.tsx`
- `src/app/context/WortnetzContext.tsx`
- `src/app/hooks/useAppEffects.ts`
- `src/app/theme/tokens.ts` (+ corresponding `theme.css`)
- `src/app/i18n/locales/de.json` + `en.json`
- `PROJECT.md` (Reverse Index row for undo/redo)

**Deleted:**
- `src/app/hooks/useTimelineHistory.ts`

**Created:**
- `src/app/hooks/useUndoStack.ts`
- `src/app/components/timeline/timeUtils.ts`

## Reuse (don't re-invent)

- `SidebarEditableNumber` ([SidebarAtoms.tsx:281–349]) — pattern for `TrackEditableNumber`. Reuse directly if styling acceptable.
- `SidebarValueChip` ([SidebarAtoms.tsx:217–230]) — `TrackValueChip` should compose or directly re-export with a thin alias.
- `getTimelineState` (already in `WortnetzContext.tsx`) — feed to `useUndoStack`.
- `preDragStateRef` / `handleDragStart` / `handleDragEnd` ([WortnetzContext.tsx:576–587]) — pattern to apply to `handleSetValue` and `handleSetHandle`.
- `themeVar()` helper in `theme/tokens.ts` — use for any new token references in TS.
- Existing `--wn-timeline-marker-fill` / `--wn-timeline-playhead` slots in `CssVarName` union — confirm `theme.css` definitions before adding duplicates.

## Open risks / things to watch

- **`SidebarEditableNumber` reuse vs. fork**: if the timeline value-chip has a different visual baseline (smaller font, no border), forking is correct. Check styling against current `TrackRow` value display before deciding; default is to compose if possible.
- **`handleSetValue` drag wiring**: audit said `handleDragStart` / `handleDragEnd` are already called by `GraphEditor` for keyframe drags. For tension-value drags specifically (which is what `handleSetValue` touches), verify the mouse handlers call those bookends. If not, Commit 1.2A also wires them.
- **Token hex match**: Tailwind's `red-500` is `#ef4444` and `purple-400` is `#c084fc`. Confirm by checking `tailwind.config.*` / Tailwind v4 theme before committing.
- **`TrackRow` and `TrackGroup` are the riskiest commits.** If smoke-test shows broken styling, revert the single commit; the preceding atoms still ship value.
