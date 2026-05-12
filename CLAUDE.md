# Project Context

Read `PROJECT.md` before every task — it contains standing orders and the file map.

Conditionally read based on task scope:
- `ARCHITECTURE.md` — if touching engine, physics, rendering, or data flow
- `STYLE_GUIDE.md` — if touching UI components or visual appearance
- `ROADMAP.md` — if planning new features or closing known gaps

**After completing any task that changes code, update the appropriate doc:**
- Added/removed/moved a component or state → `PROJECT.md` (file map)
- Changed engine, physics, or rendering → `ARCHITECTURE.md`
- Changed any visual appearance, colour, spacing, or UI pattern → `STYLE_GUIDE.md`
- Completed a known gap or added a planned feature → `ROADMAP.md`

If the change is purely internal (bug fix with no behavioural change), no doc update needed.
**Architecture Note**: The project follows a modular architecture. Use `WortnetzContext` for global state
and `AppShell` / `AppSidebar` / `AppCanvas` for layout. Do not revert to the monolithic
`App.tsx` pattern.
