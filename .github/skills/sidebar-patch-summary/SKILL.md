---
name: sidebar-patch-summary
description: 'Auto-generate per-file before/after patch summaries for sidebar refactors, including semantic hierarchy, atom usage, slider/control behavior, risks, and checklist impact.'
argument-hint: 'Changed sidebar files or diff scope (optional)'
user-invocable: true
---
# Sidebar Patch Summary

Generate concise, per-file before/after summaries for sidebar refactor patches.

## When To Use
- After preparing or applying sidebar refactor patches
- During review to explain exactly what changed per file
- Before approval in confirm mode to provide a compact impact view

## Inputs
- Preferred: staged/unstaged diff for sidebar files
- Optional: explicit file list from user
- Optional: acceptance checklist target for this refactor batch

## Procedure
1. Collect changed files in scope:
- src/app/components/Sidebar.tsx
- src/app/components/sidebar/**/*.tsx

2. Check if there are meaningful diffs. If no diff detected, exit cleanly with a short message indicating "No changes detected."

3. For each changed file, identify before/after deltas in these buckets:
- Semantic headings (h1/h2/h3)
- Sidebar atom usage (section/group/row/value chip/editable number)
- Control-row behavior (slider/value button/keyframe layout)
- Spacing/style constraints (no ad-hoc hacks, token-safe styling)
- German label/tooltips preservation

4. Produce a per-file summary block using this template:

File: <path>
- Before: <1-3 concise bullets>
- After: <1-3 concise bullets>
- Risk: Low|Medium|High - <brief reason>
- Checklist impact: <which acceptance checks moved toward PASS>

5. Produce a final rollup:
- Files summarized: <count>
- Net behavior change: None|Minor|Material
- Outstanding violations: <count or none>
- Suggested next verification: build, typecheck, visual parity screenshots

## Output Rules
- Keep each file block compact and factual.
- Do not include unrelated architectural commentary.
- Do not invent changes; summarize only observable diffs.
- If a file has no meaningful diff, omit it.
- **No diff detected → exit cleanly**.

## Example Invocations
- /sidebar-patch-summary PhysicsTab.tsx CanvasTab.tsx
- /sidebar-patch-summary summarize current unstaged sidebar diffs
