# Antigravity Agent Setup Brief — wortnetzui

You are being asked to design and implement the native Antigravity agent configuration for this project. Read this brief fully, then read the project docs listed below, then decide and act.

## What exists already

This project uses a multi-tool AI setup:
- **AGENTS.md** — single source of truth for all AI tools (you should already be reading this)
- **GEMINI.md** — redirects to AGENTS.md (Antigravity/Gemini entry point)
- **CLAUDE.md** — redirects to AGENTS.md (Claude entry point)
- **`.claude/agents/`** — two Claude Code subagents already built:
  - `architecture-auditor` — deep structural audit: drift, dead code, AI residue, performance, contradictions. Uses Opus. Read-only, returns a prioritized punch-list.
  - `ui-ux-auditor` — UI/UX cohesion audit: atomic-component health, design token drift, i18n parity, accessibility, UX gaps. Uses Opus. Read-only, returns a prioritized punch-list.

## Project docs to read before deciding anything

1. `AGENTS.md` — standing orders, critical constraints, i18n rules
2. `PROJECT.md` — file map and core goals
3. `ARCHITECTURE.md` — Three.js imperative, Web Worker physics, node rendering pipeline
4. `STYLE_GUIDE.md` — locked visual baseline, shadcn/ui rules, CSS conventions
5. `ROADMAP.md` — known gaps and planned features
6. `VOCABULARY.md` — code identifier <-> UI display string mapping

## How to work — question-first approach

**Before you plan anything**, ask the human a batch of clarifying questions. Cover at minimum:
- How often they expect to run audits (informs whether scheduling makes sense)
- Whether they want Antigravity agents to be able to make edits or stay read-only like the Claude ones
- Which Antigravity features they actually use (Agent Manager, scheduled tasks, parallel agents)
- Whether they want Gemini to complement Claude or partially replace it for certain tasks
- Any workflows they find painful right now that an agent could automate
- Their preference on verbosity: terse punch-lists vs. detailed explanations in audit output

Ask these as a numbered list in a single message. Wait for answers before reading any project docs or planning anything.

**After implementing**, ask another batch of questions before closing:
- Does the structure match what they imagined, or should anything be reorganised?
- Are there tasks they do repeatedly (docs, changelogs, i18n sync, ROADMAP updates) that should become scheduled agents?
- Which of the new agents do they want to try first, so you can walk them through invoking it?
- Is there anything about the Claude Code agents they'd like mirrored differently in Antigravity?
- Any naming, grouping, or persona decisions they'd change?

The goal is that the human leaves this session with exactly the setup they want, not the setup you assumed they wanted.

## Your task

Decide — based on your planning questions, the project docs, and your understanding of Antigravity's native agent system — how to best set up Antigravity-native agents for this project. Then implement it.

**Core questions to resolve during planning:**

1. Which of the two Claude audit agents (architecture-auditor, ui-ux-auditor) make sense to port to Antigravity native agents? Consider: Gemini Flash 3.5 strengths vs. what Opus is better at for deep multi-file reasoning. Be honest about tradeoffs.

2. Should these be native agents or skills? Consider: do they benefit from Antigravity's Agent Manager (parallelization, scheduling), or are they better as skills that the primary Gemini agent calls on demand?

3. Are there additional agents or skills that would be valuable specifically in the Antigravity context that Claude Code does not already cover? (e.g. scheduled tasks, doc-sync routines, Gemini-native web research workflows)

4. What other .agents/ configuration (rules, skills, personas) would make working in this project better from inside Antigravity?

**Constraints:**
- Read AGENTS.md standing orders before writing anything — those constraints apply to all AI tools
- Do not duplicate what Claude Code already handles well; complement it
- Keep i18n rules (useT() hook, de.json/en.json parity) in any agent that touches UI code
- Any agent that touches code must be read-only unless explicitly asked to edit
- Reference the existing project docs rather than restating their content inline

## After deciding, implement

Create the appropriate .agents/ directory structure, write the agent/skill files, and explain your decisions briefly. Then ask the post-implementation questions listed above.
