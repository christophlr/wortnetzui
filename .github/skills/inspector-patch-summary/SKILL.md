---
name: inspector-patch-summary
description: 'Auto-generate per-file before/after patch summaries for inspector refactors, including semantic hierarchy, atom usage, slider/control behavior, risks, and checklist impact.'
argument-hint: 'Changed inspector files or diff scope (optional)'
user-invocable: true
---
# Inspector Patch Summary

Generate concise, per-file before/after summaries for inspector refactor patches.

## When To Use
- After preparing or applying inspector refactor patches
- During review to explain exactly what changed per file
- Before approval in confirm mode to provide a compact impact view

## Inputs
- Preferred: staged/unstaged diff for inspector files
- Optional: explicit file list from user
- Optional: acceptance checklist target for this refactor batch

## Procedure
1. Collect changed files in scope:
- src/app/components/Inspector.tsx
- src/app/components/inspector/**/*.tsx

2. For each changed file, identify before/after deltas in these buckets:
- Semantic headings (h1/h2/h3)
- Inspector atom usage (section/subgroup/label/value chip)
- Control-row behavior (slider/value button/keyframe layout)
- Spacing/style constraints (no ad-hoc hacks, token-safe styling)
- German label/tooltips preservation

3. Produce a per-file summary block using this template:

File: <path>
- Before: <1-3 concise bullets>
- After: <1-3 concise bullets>
- Risk: Low|Medium|High - <brief reason>
- Checklist impact: <which acceptance checks moved toward PASS>

4. Produce a final rollup:
- Files summarized: <count>
- Net behavior change: None|Minor|Material
- Outstanding violations: <count or none>
- Suggested next verification: build, typecheck, visual parity screenshots

## Output Rules
- Keep each file block compact and factual.
- Do not include unrelated architectural commentary.
- Do not invent changes; summarize only observable diffs.
- If a file has no meaningful diff, omit it.

## Example Invocations
- /inspector-patch-summary PhysicsTab.tsx CanvasTab.tsx
- /inspector-patch-summary summarize current unstaged inspector diffs
