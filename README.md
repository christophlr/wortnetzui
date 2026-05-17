# Wortnetze 

> **🤖 FOR AI CODING ASSISTANTS:** > Do not generate code based on this README. You must establish your system context by reading `./AGENTS.md` before taking any action.

## For Contributors
Start at [AGENTS.md](./AGENTS.md). Architecture in [ARCHITECTURE.md](./ARCHITECTURE.md). Visual rules in [STYLE_GUIDE.md](./STYLE_GUIDE.md).

## Running the code
Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
  
Alternatively, to ensure the dev server always uses port 5173 (and to avoid accidental multiple instances), run:
- `pnpm dev -- --port 5173` or `npm run dev -- --port 5173`
- or use the provided wrapper: `npm run dev:fixed` (refuses to start if 5173 is already in use)