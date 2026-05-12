# Wortnetze — Master AI Context (AGENTS.md)

**Important:** This project uses shared documentation across multiple AI tools (Gemini, Claude, Copilot). This is the single source of truth for standing orders.

<critical_constraints>
  <constraint>Always read PROJECT.md before beginning any task to understand the file map and core goals.</constraint>
  <constraint>Always use WortnetzContext for global state management. App.tsx must remain a slim layout composer.</constraint>
  <constraint>Always maintain the German language as the default for all UI labels, tooltips, and descriptions.</constraint>
  <constraint>Always ask for clarification if you are unsure about the scope of a task; do not guess or over-deliver.</constraint>
  <constraint>Always update the appropriate markdown file (PROJECT.md, ARCHITECTURE.md, STYLE_GUIDE.md, or ROADMAP.md) after completing a code change that alters architecture, UI, or feature status.</constraint>
</critical_constraints>

## Required Reading Routing
Read these files conditionally based on your current task:
1. **`PROJECT.md`**: File map and core project description.
2. **`ARCHITECTURE.md`**: Engine constraints (Three.js imperative, Web Worker physics, node rendering pipeline). 
3. **`STYLE_GUIDE.md`**: Locked visual baseline, UI component rules (shadcn/ui), and CSS conventions. 
4. **`ROADMAP.md`**: Known gaps, planned features, and migrations.