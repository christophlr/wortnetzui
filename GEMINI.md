# Wortnetze (Wortnetzui) - AI Agent Context

**Important:** This project uses shared documentation across multiple AI tools (Gemini, Claude, Copilot, Cursor). To maintain a single source of truth, the core rules are kept in the project's root Markdown files rather than duplicated here.

## Required Reading (Standing Orders)

Before beginning *any* task or proposing architectural changes, you **MUST** read the following canonical project files:

1. **`PROJECT.md`**: Contains the standing orders for all AI agents, file map, and core conceptual goals. **(READ THIS FIRST BEFORE EVERY TASK)**
2. **`ARCHITECTURE.md`**: Contains the strict engine constraints (Three.js imperative, Web Worker physics, node rendering pipeline). Violating these rules will break the application's performance and design invariants.
3. **`STYLE_GUIDE.md`**: Contains the locked visual baseline, UI component rules (shadcn/ui), and CSS conventions. Do not alter visuals without explicitly consulting this.
4. **`ROADMAP.md`**: Contains known gaps, planned features, and migrations.

## Quick Start Commands
- **Install:** `npm i`
- **Dev Server:** `npm run dev` or `npm run dev:fixed` (enforces port 5173)
- **Build:** `npm run build`

*Note for Agents: If a user asks to establish a new standing order or convention for this codebase, update the appropriate markdown file (`PROJECT.md`, `ARCHITECTURE.md`, etc.) rather than this file, so that all AI assistants stay synchronized.*