# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # install dependencies
npm run dev    # start Vite dev server
npm run build  # production build
```

No lint, format, or test commands exist in this project.

## Architecture

**Wortnetzui** is a media-timeline editor with a 3D word-network visualization, built from a Figma design. It is a single-page React + TypeScript + Vite app with no routing (react-router is installed but unused).

### Component tree

```
App                  # root state owner (playback, theme, view mode, file save/load)
├── TopBar           # header: logo, file menu, theme toggle, 2D/3D switch
├── Inspector        # left sidebar: text input, physics params, color/style settings
├── Preview          # main canvas area; switches between 2D SVG and 3D (forwardRef)
│   └── Network3D    # Three.js scene with physics word-graph (forwardRef)
└── Timeline         # bottom bar: playback controls, keyframe tracks, timecode
```

All state lives in `App` and is passed down as props + callbacks — no Context or global store.

### Key patterns

- **forwardRef + useImperativeHandle** — `Preview` and `Network3D` expose imperative methods (e.g., `getCameraSnapshot()`) so `App` can trigger actions without lifting more state.
- **Co-located helpers** — small sub-components (`KfDiamond`, `NumInput`, `ParamRow`, `SliderParam`) are defined inside the same file as the feature component that uses them; there are no barrel `index.ts` files.
- **shadcn/ui** — 50 pre-built components live in `src/app/components/ui/`. These are Radix UI primitives wrapped with Tailwind + `cva` variants. Extend them with a `className` prop; do not edit the base files.
- **Icons** — use `lucide-react`; MUI icons are also available but Lucide is the established pattern.
- **`cn()` utility** — use for conditional classname merging (re-exported from `src/app/components/ui/`).

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. No CSS-in-JS (Emotion is installed but unused).

- **Theme** — light/dark via CSS custom properties in `src/styles/theme.css`. Variables use `oklch()` color space. Toggle applied as `.dark` class on `<html>`.
- **Colors** — Azure/cyan palette overrides Tailwind's cyan scale (`src/styles/azure-colors.css`).
- **Radius** — `0.625rem` base.
- Never write raw hex/rgb colors for semantic values; use the CSS variable tokens (`bg-background`, `text-foreground`, `border`, etc.).

### 3D visualization (`Network3D.tsx`)

- Three.js scene with `OrbitControls`. Physics simulation runs in `requestAnimationFrame` loop inside the component.
- Graph nodes (`GraphNode`) carry `position`, `velocity`, and a Three.js `Mesh`. Edges (`GraphEdge`) drive spring forces.
- Word co-occurrence is computed from the text input in `Inspector` and re-triggers graph rebuild.
- Camera state is serialized into timeline keyframes via `getCameraSnapshot()`.

### Vite config

- Alias `@` → `./src`.
- Custom plugin `figmaAssetResolver()` resolves `figma:asset/<id>` imports to `src/assets/`.
- Raw imports: `.svg` and `.csv` files are treated as assets.
