---
name: "Sidebar Violations Review"
description: "Review sidebar tabs and output only violations plus acceptance checklist status. Use for atomic sidebar audits with no refactor prose."
argument-hint: "Files or tab names to audit (optional), e.g. PhysicsTab.tsx, CanvasTab.tsx"
agent: "Sidebar Atom Maintenance Agent"
tools: [read, search]
---
Run a strict sidebar compliance review.

Scope:
- Prefer requested files first; if none provided, review all sidebar tabs under src/app/components/sidebar/tabs/ plus src/app/components/Sidebar.tsx.

Rules to validate:
1. Semantic hierarchy:
- h1 top tab header in Sidebar.tsx via SidebarTabHeader
- h2 via SidebarSection
- h3 via SidebarGroup
2. Atomic usage:
- Use SidebarTabHeader, SidebarSection, SidebarGroup, SidebarRow, SidebarValueChip, SidebarEditableNumber
- Avoid repeated ad-hoc class stacks where atoms should be used
3. Control behavior:
- Slider rows follow the pattern (left cluster value + keyframe, right flex-1 slider)
- Numeric slider values are interactive buttons, not static spans
4. Spacing/style safety:
- No ad-hoc per-tab indent hacks
- No hardcoded UI colors where tokenized styles are expected
5. Language and safety:
- German UI labels/tooltips remain default (via i18n JSON)
- No global composition changes outside sidebar scope

Output format (strict, and only this):

Violations
- [severity] file:line - rule - concise issue

Acceptance Checklist
- h1 in Sidebar.tsx (SidebarTabHeader): PASS|PARTIAL|FAIL
- h2 via SidebarSection: PASS|PARTIAL|FAIL
- h3 via SidebarGroup: PASS|PARTIAL|FAIL
- Atomic controls (labels/chips/subgroups): PASS|PARTIAL|FAIL
- Slider layout parity: PASS|PARTIAL|FAIL
- Numeric slider value button behavior: PASS|PARTIAL|FAIL
- No ad-hoc indent/style hacks in reviewed files: PASS|PARTIAL|FAIL
- German UI defaults preserved: PASS|PARTIAL|FAIL

If no violations are found, output exactly:
Violations
- none

Acceptance Checklist
- all reviewed checks: PASS
