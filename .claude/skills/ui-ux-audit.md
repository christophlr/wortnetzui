---
name: ui-ux-audit
description: Interactive UI/UX audit. Runs pre-flight questions with option pickers, delegates the heavy investigation to the ui-ux-auditor subagent, then runs post-flight follow-up questions. Use when the user says "UI audit", "find UI drift", "check components", "standardize the UI", "atomic component review", or wants UX/design-system feedback.
---

## How to run this skill

### Phase 1 — pre-flight questions

Call AskUserQuestion with these four questions in a single call. Use the exact options listed.

Question 1 — header: "Trigger"
"What prompted this audit?"
Options:
- "Just added new UI" — focus on what changed recently
- "General drift feeling" — broad sweep across all components
- "Scheduled check" — routine maintenance pass
- "Something specific looks off" — I'll ask what after

Question 2 — header: "Scope"
"What scope?"
Options:
- "Everything — full component sweep"
- "Specific component area — I'll name it"
- "Specific feature area — I'll name it"

Question 3 — header: "Focus"
"Primary focus?"
Options:
- "Visual consistency and design tokens"
- "Accessibility"
- "UX patterns and interaction flows"
- "All equally"

Question 4 — header: "Output"
"Output style?"
Options:
- "Terse punch-list — just the findings"
- "Detailed — reasoning and context per finding"

Wait for answers. If the user picked "Something specific looks off", "Specific component area", or "Specific feature area", ask a quick follow-up before proceeding.

### Phase 2 — run the agent

Spawn the `ui-ux-auditor` subagent via the Agent tool. In the prompt, pass:
- The user's answers from Phase 1 as explicit context at the top
- Instruction to skip its own question phase (already handled)
- Any specific area or concern the user flagged

Example prompt prefix to include:
"Context from pre-flight: trigger=[answer], scope=[answer], focus=[answer], style=[answer]. Skip your Step 1 question phase — context already gathered. Begin from Step 2."

### Phase 3 — present the report

Present the agent's full report to the user. Do not summarise or truncate it.

### Phase 4 — post-flight questions

After presenting the report, call AskUserQuestion with these three questions in a single call.

Question 1 — header: "Follow-up"
"Any findings you want to explore further?"
Options:
- "No — the report is clear"
- "Yes — let's dig into specific ones"

Question 2 — header: "Next step"
"Ready to start fixing?"
Options:
- "Yes — help me plan the priority items"
- "Yes — start implementing now"
- "Not now — just cataloguing"

Question 3 — header: "Feedback"
"How was the report for next time?"
Options:
- "Good as-is"
- "Too verbose — terser next time"
- "Too terse — more context please"
- "Wrong priorities — needs calibrating"

Act on the answers: offer to plan fixes, dig deeper on specific findings, or note format feedback for future runs.
