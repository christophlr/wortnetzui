# Wortnetze — Master AI Context (AGENTS.md)

**Important:** This project uses shared documentation across multiple AI tools (Gemini, Claude, Copilot). This is the single source of truth for standing orders.

<critical_constraints>
  <constraint>Always read PROJECT.md before beginning any task to understand the file map and core goals.</constraint>
  <constraint>Always use WortnetzContext for global state management. App.tsx must remain a slim layout composer. Verification: `wc -l src/app/App.tsx` ≤ 150.</constraint>
  <constraint>User-facing text is loaded via `useTranslation()`. The displayed default is German; English is the source-of-truth in code (identifiers, JSON keys, comments).</constraint>
  <constraint>Always ask for clarification if you are unsure about the scope of a task; do not guess or over-deliver.</constraint>
  <constraint>Always update the appropriate markdown file (PROJECT.md, ARCHITECTURE.md, STYLE_GUIDE.md, or ROADMAP.md) after completing a code change that alters architecture, UI, or feature status.</constraint>
</critical_constraints>

## Required Reading Routing
Read these files conditionally based on your current task:
1. **`PROJECT.md`**: File map and core project description.
2. **`ARCHITECTURE.md`**: Engine constraints (Three.js imperative, Web Worker physics, node rendering pipeline). 
3. **`STYLE_GUIDE.md`**: Locked visual baseline, UI component rules (shadcn/ui), and CSS conventions. 
4. **`ROADMAP.md`**: Known gaps, planned features, and migrations.
5. **`VOCABULARY.md`**: Code identifier ↔ UI display string mapping (EN + DE).
6. **`ONBOARDING.md`**: Start-here guide for new human or AI contributors.

**Note:** `CLAUDE.md` and `GEMINI.md` are harness-required redirect files, NOT independent guidance. `AGENTS.md` is the only standing-orders doc.

## §3 — Internationalisation (i18n)

All user-facing strings **must** go through i18next. Never hardcode display text directly in components.

- **Hook**: `useT()` from `src/app/i18n/useT.ts` — use this in every functional component. Never import `useTranslation` from `react-i18next` directly.
- **Class components**: call `i18n.t()` via the singleton (`import i18n from '../i18n'`). `ErrorBoundary.tsx` is the canonical reference.
- **Default language**: German (`de`). English (`en`) is the fallback.
- **Locale files**: `src/app/i18n/locales/de.json` and `en.json`. Keys must be in parity — run the parity check after any edit: `node -e "..."` (see PRE-PHASE5-REMEDIATION.md §I18N gates).
- **Language normalisation**: use `normalizeLanguage()` from `src/app/i18n/index.ts` whenever reading `i18n.language` or `i18n.resolvedLanguage` — it strips BCP-47 suffixes (`de-DE` → `de`) and returns a `SupportedLanguage`.
- **Golden reference** for a fully-wired functional component: `src/app/components/Sidebar.tsx` (formerly `Inspector.tsx`).