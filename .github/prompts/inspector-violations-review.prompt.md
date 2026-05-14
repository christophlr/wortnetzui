---
name: "Inspector Violations Review"
description: "Review inspector tabs and output only violations plus acceptance checklist status. Use for atomic inspector audits with no refactor prose."
argument-hint: "Files or tab names to audit (optional), e.g. PhysicsTab.tsx, CanvasTab.tsx"
agent: "Inspector Atom Maintenance Agent"
tools: [read, search]
---
Run a strict inspector compliance review.

Scope:
- Prefer requested files first; if none provided, review all inspector tabs under src/app/components/inspector/ plus src/app/components/Inspector.tsx.

Rules to validate:
1. Semantic hierarchy:
- h1 top tab header in Inspector.tsx
- h2 via InspectorSectionHeader
- h3 via InspectorSubgroupTitle
2. Atomic usage:
- Use InspectorPanelSection, InspectorSectionHeader, InspectorSubgroup, InspectorSubgroupTitle, InspectorControlLabel, InspectorValueChip
- Avoid repeated ad-hoc class stacks where atoms should be used
3. Control behavior:
- Slider rows follow VisualTab pattern (left cluster value + keyframe, right flex-1 slider)
- Numeric slider values are interactive buttons, not static spans
4. Spacing/style safety:
- No ad-hoc per-tab indent hacks
- No hardcoded UI colors where tokenized styles are expected
5. Language and safety:
- German UI labels/tooltips remain default
- No global composition changes outside inspector scope

Output format (strict, and only this):

Violations
- [severity] file:line - rule - concise issue

Acceptance Checklist
- h1 in Inspector.tsx: PASS|FAIL
- h2 via InspectorSectionHeader: PASS|FAIL
- h3 via InspectorSubgroupTitle: PASS|FAIL
- Atomic controls (labels/chips/subgroups): PASS|FAIL
- Slider layout parity with VisualTab: PASS|FAIL
- Numeric slider value button behavior: PASS|FAIL
- No ad-hoc indent/style hacks in reviewed files: PASS|FAIL
- German UI defaults preserved: PASS|FAIL

If no violations are found, output exactly:
Violations
- none

Acceptance Checklist
- all reviewed checks: PASS
