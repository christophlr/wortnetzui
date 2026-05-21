# Wortnetze — Onboarding Guide

Welcome to **Wortnetze**! This document provides a quick overview for new contributors (both human and AI).

## What this project is
**Wortnetze** ("word networks") is a browser-based creative tool for visualizing the linguistic structure of text as an animated 3D/2D network graph. It is designed as an art and research instrument, aiming for a professional, premium aesthetic akin to Figma or After Effects.

## Where the code lives
- **Main React Composer:** `src/app/App.tsx` (a slim shell)
- **Global State:** `src/app/context/WortnetzContext.tsx` (the single source of truth)
- **3D Engine:** `src/app/components/Network3D.tsx` (Three.js imperative logic)
- **Physics Engine:** `src/app/graph/physics.worker.ts` (runs off-thread using Web Workers and transferable arrays)
- **UI Components:** `src/app/components/` (divided into specific areas like `sidebar/`, `topbar/`, `timeline/`)
- **Internationalization:** `src/app/i18n/` (English source-of-truth, German displayed default)

For a complete map, see [PROJECT.md](./PROJECT.md).

## How to run it
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. If you want to ensure the server always uses port 5173 (and avoid multiple instances), use: `npm run dev:fixed`

## The atomic-component contract
Wortnetze follows a strict "Atom-first rule" for UI composition:
- Every major UI surface (Sidebar, TopBar, Toolbar, Timeline, Preview, Dialogs) composes from its own `*Atoms.tsx` file.
- **Never** hand-roll `className` stacks with raw colors (like `bg-zinc-100`) directly inside business-logic components.
- Always use the provided CSS variable tokens (`--wn-accent`, `--wn-control-bg`, etc.) via `hsl(var(--...))`.
- See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for the visual baseline and rules.

## Documentation cascade
When writing code or making architectural decisions, follow this reading order:
1. **[AGENTS.md](./AGENTS.md)**: Standing orders and critical constraints.
2. **[PROJECT.md](./PROJECT.md)**: File map and reverse index.
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical design and engine limitations.
4. **[STYLE_GUIDE.md](./STYLE_GUIDE.md)**: Visual rules and CSS standards.

## Where to ask
If you are an AI assistant, refer to your system context or ask the user for clarification before making assumptions, especially regarding visual baselines or Three.js engine mechanics.
If you are a human contributor, refer to the GitHub repository's issue tracker or ask the project maintainer.
