# Wortnetze — Roadmap

This document outlines the current status of features, planned work, and known technical debt.

## Active

- **Phase 5: Documentation overhaul & cleanup**
  - Rewriting standing orders, style guides, and architecture documentation to reflect the post-Phase-4 atomic structure.
  - Deleting orphaned files, lockfile cleanup, and auditing unused UI components.

## Planned

- **Phase 6 / Future Work**
  - **Auto-Detect Language Activation**: Enable the browser language detector feature behind an opt-in toggle so that the application can automatically select between English and German.
  - **App.tsx Size Reduction**: Achieve the stretch goal of `wc -l src/app/App.tsx ≤ 100` by fully abstracting any remaining layout logic.
  - **Shadcn Pruning**: Physically delete all unused Shadcn UI components from the codebase to reduce bloat.

## Known Gaps

- **Timeline Context Menu Localization**: Ensure deeply nested context menus fully adopt the i18n keys instead of localized English strings.
- **PathAnimatorUI**: Currently relies on legacy class structures. While not immediately planned for an atom pack, it remains an outlier from the global style system.
- **Component File Overrides**: We must ensure that absolutely no tabs or surfaces are overriding atom class names.

## Completed

- **Phase 1: Rename & Hierarchy Fix**
  - Replaced the old "Inspector" with "Sidebar".
  - Standardized the component cascade (`SidebarSection` → `SidebarGroup` → `SidebarRow`).
- **Phase 2: Atomic Composition & Shell**
  - Successfully moved all five sidebar tabs onto the `SidebarAtoms` foundation.
  - Implemented semantic `--wn-*` CSS variables to remove hardcoded hex and Tailwind color strings.
  - Abstracted the main window layout into `AppShell`, `AppCanvas`, and `AppSidebar`.
- **Phase 3: Extended Atom Packs**
  - Built atomic components for the TopBar, Toolbar, Timeline, Preview, and Dialogs.
  - Executed a global sweep to remove remaining legacy color variables.
- **Phase 4: Internationalization (i18n)**
  - Replaced all hardcoded German UI text with `i18next` translation keys.
  - Established English as the code source-of-truth and German as the displayed default.
  - Created a language switcher in the TopBar and persisted user preference.