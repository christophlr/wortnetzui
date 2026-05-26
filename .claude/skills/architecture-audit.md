---
name: architecture-audit
description: Interactive architecture and performance audit. Runs pre-flight questions with option pickers, delegates the heavy investigation to the architecture-auditor subagent, then runs post-flight follow-up questions. Use when the user says "audit", "architecture audit", "find drift", "check for AI mistakes", or wants a structural/performance review.
---

## How to run this skill

### Phase 1 — pre-flight questions

Call AskUserQuestion with these four questions in a single call. Use the exact options listed.

Question 1 — header: "Trigger"
"What triggered this audit?"
Options:
- "Just merged a feature" — focus on what changed recently
- "General drift feeling" — broad sweep across the whole codebase
- "Scheduled check" — routine maintenance pass
- "Something specific feels wrong" — I'll ask what after

Question 2 — header: "Depth"
"How deep should I go?"
Options:
- "Recent changes only — fast pass" — scoped to last month of commits
- "Full codebase sweep" — thorough, takes longer
- "Specific area — I'll tell you which" — targeted, I'll ask for details after

Question 3 — header: "Scope"
"Include performance analysis?" (React render costs, Three.js hotpaths, Worker payloads, bundle bloat)
Options:
- "Yes — snappiness and performance too"
- "No — structural and correctness only"

Question 4 — header: "Output"
"Output style?"
Options:
- "Terse punch-list — just the findings"
- "Detailed — reasoning and context per finding"

Wait for answers. If the user picked "Something specific feels wrong" or "Specific area", ask a quick follow-up before proceeding.

### Phase 2 — run the agent

Spawn the `architecture-auditor` subagent via the Agent tool. In the prompt, pass:
- The user's answers from Phase 1 as explicit context at the top
- Instruction to skip its own question phase (already handled)
- Any specific area or concern the user flagged

Example prompt prefix to include:
"Context from pre-flight: trigger=[answer], depth=[answer], performance=[answer], style=[answer]. Skip your Step 1 question phase — context already gathered. Begin from Step 2."

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
- "Yes — help me plan the P0s"
- "Yes — start implementing now"
- "Not now — just cataloguing"

Question 3 — header: "Feedback"
"How was the report for next time?"
Options:
- "Good as-is"
- "Too verbose — terser next time"
- "Too terse — more context please"
- "Wrong priorities — needs calibrating"

Act on the answers: offer to plan fixes, dig deeper, or note format feedback for future runs.
