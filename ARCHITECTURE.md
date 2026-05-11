# Wortnetzui — Architecture & Design Specification

> **For AI coding assistants (Claude, Gemini, GitHub Copilot, etc.)**
> Read this file in full before making any changes. It documents deliberate architectural
> and visual decisions. Violating any rule marked **🔒 LOCKED** requires an explicit override
> from the project owner.

> 🔒 **VISUAL FREEZE**: Do NOT change any visual appearance (colors, fonts, spacing, node
> rendering style, edge style, background, gradients, opacity, shadows, border-radius, icon
> choices, layout proportions, or animation curves) unless the user's message **explicitly
> asks for a visual change**. Fixing a bug or adding a feature must never silently alter
> how anything looks. When in doubt, preserve the existing visual.

---

## 1. What This Project Is

**Wortnetzui** is a 3D/2D interactive word-network visualizer and animation tool. It takes
free-form German (or any) text, parses it into linguistic n-gram nodes and inclusion-based
edges, lays them out with a force-directed physics engine, and lets the user animate the
scene over a keyframe timeline — all in the browser, with no server.

**The UI is German by default**, as the primary audience is German-speaking.

The UX target is a **professional creative tool** (think After Effects + Figma for word
networks), not a dashboard or data explorer. Every design decision should be evaluated
against that target. **Physics interaction should feel "snappy" and "bouncy"**, similar to
high-end motion graphics transitions, reacting energetically to user input via the
"Jolt" mechanism.

---

## 2. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 18 + Vite | `npm run dev` to start |
| Language | TypeScript (strict) | No `any` without a comment explaining why |
| 3D Engine | Three.js (WebGL, via `three` npm) | No R3F / react-three-fiber — Three.js is used imperatively inside `useEffect` |
| 2D/3D Controls | `three/examples/jsm/controls/OrbitControls` | |
| UI Components | shadcn/ui (Radix primitives + Tailwind) | Always reach for a shadcn component before writing a custom one |
| CSS | Tailwind + CSS variables (shadcn theming) | No hardcoded hex in UI. Use `hsl(var(--...))` tokens |
| Physics | Web Worker (`physics.worker.ts`) | Off-main-thread, transferable `Float64Array` buffers |
| Font | Space Grotesk (Google Fonts, loaded globally) | Used in both UI text **and** 3D node canvas textures |

---

## 3. Repository Layout

```
src/
  app/
    App.tsx              — slim composer; wraps the app in `WortnetzProvider`
    context/
      WortnetzContext.tsx — **SINGLE SOURCE OF TRUTH**; owns all React state/handlers
    hooks/
      useHistory.ts      — undo/redo logic
      useProject.ts      — save/load logic
    components/
      shell/             — layout components: `AppShell`, `AppSidebar`, `AppCanvas`
      Network3D.tsx      — the 3D/2D scene (Three.js, imperative)
      Inspector.tsx      — right sidebar panels (consumes context)
      Preview.tsx        — artboard wrapper around Network3D (consumes context)
      timeline/          — animation workspace (consumes context)
      TopBar.tsx         — floating menu/action pills (consumes context)
      Toolbar.tsx        — vertical tool picker
    graph/
      types.ts           — GraphNode, GraphEdge, PhysicsParams, DEFAULT_PHYSICS
      parsing.ts         — text → nodes + edges (n-gram extraction)
      physics.ts         — main-thread physics (used only as a reference / fallback)
      physics.worker.ts  — off-thread worker; receives transferable Float64Arrays
      index.ts           — re-exports
    networkTheme.ts      — color tokens for the 3D scene (not the UI)
    easing.ts            — Catmull-Rom + Hermite spline helpers
    constants.ts         — TIMELINE_DURATION
  styles/               — global CSS
guidelines/
  Guidelines.md         — Copilot/cursor-level style rules (auto-loaded by some IDEs)
CLAUDE.md               — Claude-specific conventions (UI scale, SliderParam rules, versioning)
ARCHITECTURE.md         — THIS FILE — canonical spec for all AI assistants
```

---

## 4. 3D Rendering Architecture — `Network3D.tsx`

### 4.1 Rendering Pipeline

```
Text input
  → parsing.ts (n-gram extraction)      [main thread]
  → arrangeNodesCone3D / scatterNodes2D [main thread, initial layout only]
  → physics.worker.ts 'settle' pass     [worker thread, async]
  ← 'settled' response → syncGraphVisuals
  → animate() RAF loop
      ├── physicsWorker 'step' (if physics active)   [worker, transferable buffer]
      ├── applyCameraKeyframes (Hermite spline)       [main thread]
      ├── zoomAnim / cameraFly lerp                  [main thread]
      ├── OrbitControls.update() (damping)            [main thread]
      ├── handleResize (ResizeObserver)               [main thread, updates renderer + camera]
      └── renderer.render(scene, camera)              [GPU]
```

### 4.2 Node Rendering — 🔒 SPRITES ARE INTENTIONAL

Nodes are rendered as **`THREE.Sprite`** objects — this is a deliberate, locked design choice.

**Why sprites, not InstancedMesh or quads?**
- Sprites in Three.js are **camera-aligned billboards by default** — they always face the
  camera with zero extra code. This is the core visual requirement: nodes are always-facing
  rectangles with text, never tilted in 3D space.
- **Z-ordering & Fluttering**: To prevent "fluttering" (z-fighting) between dense clusters of nodes, we use `depthTest: true`, `depthWrite: true`, and `alphaTest: 0.1`. The `alphaTest` ensures transparent corners do not block background nodes, while the depth buffer handles stable intersection. To ensure nodes always visually occlude connecting lines, sprites use `renderOrder: 1` while edges use `renderOrder: 0`.
- The sprite texture is a `THREE.CanvasTexture` created from a standard `HTMLCanvasElement`, allowing
  pixel-perfect anti-aliased text at exactly the font and style used in the UI (Space Grotesk).
  We specifically avoid `OffscreenCanvas` to prevent Safari from crashing due to strict WebKit context limits,
  and we avoid `DataTexture` with `getImageData` to prevent synchronous main-thread pipeline stalls during initialization. Using `CanvasTexture` also ensures correct orientation (flipY) without manual mirroring.

**Do NOT:**
- Replace sprites with `InstancedMesh` — it breaks both the billboard effect and z-ordering.
- Replace sprites with `THREE.PlaneGeometry` manually managing quaternion alignment — adds
  complexity for the same visual result.
- Use `troika-three-text` for replacing the existing canvas texture pipeline — it was
  evaluated and would require a complete rewrite of the hover/select state machine which
  depends on the 3-state texture cache (normal / highlighted / selected).

**Scaling at >2000 nodes (future consideration):**
If the scene grows beyond what individual sprites can handle, the correct path is:
1. Keep the `THREE.Sprite` + DataTexture pipeline for nodes in the "viewport" (visible area).
2. Use a spatial index (e.g., octree in a Rust/Wasm module) to cull non-visible sprites
   each frame before raycasting and texture swaps — not a renderer change.

### 4.3 Edge Rendering

All edges are rendered as a **single `THREE.LineSegments`** object with one shared
`THREE.LineBasicMaterial` (`transparent: true`). Each edge occupies 2 vertices in a flat
`Float32Array` position buffer, updated every frame in `syncGraphVisuals`. This gives
**1 draw call for all edges** regardless of edge count.

The `LineSegments` object uses `renderOrder: 0` (default), so sprites at `renderOrder: 1`
always render on top.

**🔒 Lines must never visually appear on top of node sprites.** If you change edge code,
verify this invariant holds. The correct fix for any z-fighting is adjusting `renderOrder`,
not depth buffer manipulation.

### 4.4 Texture Cache — 3-State per Node

Each node label has up to 3 cached `THREE.Texture` (specifically `CanvasTexture`) entries:
- `normal` — built eagerly at scene init
- `highlighted` — built on-demand on first hover
- `selected` — built on-demand on first click

`swapSpriteTexture()` swaps `sprite.material.map` between these states. This is O(1) per
interaction and avoids canvas redraws on hover. **Do not change the texture swap mechanism
without benchmarking — it replaced a system that caused 10–30ms jank per hover.**

### 4.5 Physics System

| Path | Purpose |
|---|---|
| `physics.worker.ts` | Primary — runs every frame off the main thread |
| `physics.ts` | Reference / fallback — not called in the main loop |

**Worker protocol:**
1. `init` → sends stable `Int32Array` edge indices, `Int32Array` word counts, `Uint8Array`
   shared-sentence matrix, and node count. Sent once per graph rebuild.
2. `settle` → sends initial positions as a transferred `Float64Array(nodeCount × 6)`,
   runs up to 500 iterations synchronously in the worker, returns `settled`.
3. `step` → main thread packs `[x,y,z,vx,vy,vz] × n` into the reusable
   `workerPosVelRef` buffer and **transfers** it (`[pv.buffer]`). Worker returns it
   with updated values. Zero allocations per frame once the buffer is created.
   
**Physics "Jolt" Effect**:
To make the UI feel responsive, parameter changes (e.g. dragging a slider) compute a "velocity" of change. If this velocity is high, a temporary "jolt" is sent to the worker by decreasing friction (increasing `damping` temporarily toward 0.92). This causes the network to react instantly and energetically to user input before decaying back to the stable parameter values.

**Glitch Paint Interaction**:
A specialized visual reveal mode where nodes are "glitched" into visibility based on their distance from the mouse pointer. The engine tracks `uMousePos` (mapped [-1, 1] coordinates) and applies a `smoothstep` reveal curve in the `syncGraphVisuals` loop. This is designed for artistic "searchlight" interactions and cinematic reveals.

**🔒 Do not make the worker synchronous or move the physics loop back to the main thread.**
The RAF loop must remain free for Three.js rendering.

### 4.6 Camera System

| Mode | Camera type | Controls |
|---|---|---|
| 3D | `PerspectiveCamera(fov=50)` | Full OrbitControls (rotate + pan + zoom) |
| 2D | `OrthographicCamera` (1:1 px) | Pan + zoom only (rotate disabled) |

Camera animation uses Cubic Hermite splines with Catmull-Rom tangent auto-computation
(see `easing.ts`). Keyframe handles can be 'aligned' or 'broken' modes, matching standard
DCCs like After Effects and Blender.

The gizmo canvas (`drawGizmoCanvas`) and the manual pan/fit-to-view UI controls are deactivated and removed from the UI.

Camera zoom and navigation are now controlled via mouse/trackpad interaction (OrbitControls) and the dedicated controls in the **Inspector > Camera** tab.

---

## 5. Data Flow & State Architecture

```
WortnetzContext.tsx (Single Source of Truth)
  ├── inputText, parseMode         → Network3D: triggers full scene rebuild
  ├── physicsParams                → Network3D: blended transition
  ├── physicsKeyframes             → Network3D: per-frame interpolation
  ├── cameraKeyframes              → Network3D: Hermite interpolation
  ├── gradientSettings             → Network3D: triggers texture cache rebuild
  ├── styleSettings                → Network3D: edge opacity/width, node scale/shape
  ├── visualSettings               → Network3D: radial bias, mesh gradients, glitch paint
  ├── nodeAppearance               → Network3D: fill/border/text color overrides
  ├── edgeAppearance               → Network3D: edge color override
  ├── renderMode ('edit'|'render') → Network3D: scene background + node color mode
  ├── viewMode ('2D'|'3D')        → Network3D: full scene rebuild
  └── themeMode                    → CSS class on <html> + isDark prop

Components (Inspector, Timeline, TopBar, etc.) consume this context via the `useWortnetz` hook.
All Network3D props are mirrored into refs inside the component to avoid stale closures.
```

**🔒 WortnetzContext.tsx is the single source of truth.** App.tsx is a composer.
Network3D does not hold React state for anything that needs to persist beyond a scene rebuild.
If you need to surface data from Network3D, use the `network3DRef` imperative handle.

### 5.1 Undo/Redo

Only **timeline state** (camera keyframes + physics keyframes + scene markers) is
undoable. Physics params, text, style settings, etc. are not in the undo stack.
History is capped at 50 entries. `preDragStateRef` is captured on `handleDragStart`
and pushed in `handleDragEnd` so continuous drag doesn't flood the stack.

### 5.2 Save/Load Format

`handleSave` serializes to JSON: `{ inputText, parseMode, gradientSettings, styleSettings,
physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers }`.
Files are saved as `sprachvernetzungen-<timestamp>.json`.

---

## 6. Graph Parsing — `parsing.ts`

Three parse modes:

| Mode | What it does |
|---|---|
| `sentence` | Extracts all word n-grams (substrings) from each sentence. Edges = inclusion (longer phrase → contained shorter phrase). |
| `word` | Extracts all character n-grams from each unique word. Edges = inclusion. |
| `both` | Runs both layers. |

Text is normalized to uppercase, punctuation stripped, split on `.!?`. Node identity is the
normalized substring string (the label). Word count = number of words in the substring
(1 for single words). Nodes accumulate `sentenceIds` — the set of sentence indices they
appear in — used to compute the `sharedPairMatrix` for physics modulation.

**This parsing is the conceptual core of the project.** The linguistic structure of the
network (overlapping substrings as a hierarchy) is the *art*, not a technical detail.
Do not simplify or change the parsing logic without an explicit request.

---

## 7. UI Conventions — `CLAUDE.md` + Extensions

### 7.1 Scale Baseline

`h-6` (24px) is the standard height for all inline controls:
- ToggleGroup items, icon buttons, label buttons, accordion headers, inline inputs.
- **Exception**: The main action button in an Inspector section (e.g., "Anwenden") may be
  full-width and taller.

Text sizes: `text-[11px]` for labels/captions/control text. `text-xs` for accordion content.
`text-sm` only for body/description in larger content areas.

### 7.2 SliderParam

Every numeric slider **must** have click-to-type on the value display:
- Rendered as `<button>` → opens inline `<input>` on click.
- Commit on Enter / Tab / blur. Cancel on Escape. Always clamp to `[min, max]`.
- If the displayed value is scaled (e.g. ×10), pass `parseInput` to invert the scale.
- **Never** use a `<span>` for a numeric slider value.

### 7.3 Theme System

**themeMode**: `light` | `dark`.
- `light`: white UI + light 3D background (`#f8fafc`).
- `dark`: dark UI + dark 3D background (`#09090b`).

The `previewIsDark` flag in `WortnetzContext` tracks this based on the active `themeMode`.

**Never hardcode background colors in UI components.** Use `hsl(var(--background))`,
`hsl(var(--foreground))`, etc. 3D scene colors go through `networkTheme.ts`.

### 7.4 Layout Structure

```
┌──────────────────────── TopBar (h-[36px]) ──────────────────────────┐
│                                                                       │
│  ┌──── Toolbar (vertical, floating left) ────┐                       │
│  │ pointer / pan / paint / zoom              │                       │
│  └───────────────────────────────────────────┘                       │
│                                                                       │
│  ┌─── Preview / Canvas (pasteboard) ───┐  ┌─── Inspector (sidebar)──┤
│  │  artboard (centered, shadowed)      │  │  Tabs: Text | Style |   │
│  │  Network3D renders here             │  │  Physics | Camera | FX  │
│  └─────────────────────────────────────┘  └────────────────────────-┤
│                                                                       │
├──────────────────── Timeline (collapsible, bottom) ─────────────────┤
```

- Inspector is a **docked vertical sidebar** on the right, not a floating panel.
- Sidebar toggle is in the top-left of the sidebar's activity bar, not the TopBar.
- Overlay elements (loading spinner, etc.) must be positioned relative to the Preview
  viewport, not the full browser window.

### 7.5 Version Display

The version, build number, and build timestamp are displayed in the **bottom-left of the
Preview component**. They are auto-derived from git commit count via `vite.config.ts`.
**Do not touch this display unless explicitly asked. Never hardcode a version string.**

---

## 8. Node Appearance System

Nodes have three layers of color control, applied in this priority order:

1. **Edit mode** (`renderMode === 'edit'`): All nodes use `EDIT_NODE_COLOR` (`#6b7280`,
   neutral gray) regardless of any other setting.
2. **NodeAppearance overrides** (`nodeAppearance.borderColor/fillColor/textColor`):
   When not `'auto'`, these override the gradient-derived color for border, fill, or text.
3. **Gradient** (`gradientSettings`): `mode === 'solid'` uses `innerColor` for all nodes.
   `mode === 'gradient'` lerps from `innerColor` (low word count) to `outerColor`
   (high word count) linearly in hex space.

Node shapes: `'rectangle'` | `'rounded-rectangle'` | `'ellipse'`.
The shape affects the Canvas 2D clip path, border stroke path, and outline glow path.
All three states (normal, highlighted, selected) must use identical canvas dimensions
(enforced via `OUTLINE_MARGIN` padding) so the texture swap doesn't resize the sprite.

**🔒 The 3-state texture size invariant must be preserved.** If you modify `createCanvasTexture`,
ensure all three states produce canvases of identical pixel dimensions for a given node label.

---

## 9. Animation & Timeline System

- Timeline duration: `TIMELINE_DURATION` (from `constants.ts`, currently 30s).
- Playhead unit: seconds (float). Framerate for timecode display: 30fps.
- Physics and camera keyframes are interpolated per-frame using **Cubic Hermite splines**
  with Catmull-Rom tangent auto-computation at interior keyframes.
- Keyframe UX Paradigm: The timeline uses progressive disclosure and standardized Shadcn context menus.
  - **Dopesheet Mode** (default): Shows keyframes as icons whose shape indicates inferred easing type (Auto, Linear, Hold, Easy Ease). Physics tracks show Ableton-style mini-curves.
  - **Graph Editor Mode**: Toggled on demand. Shows full interactive Hermite curves. Handles are hidden until keyframe is selected to reduce clutter.
- **Snapping**: The timeline supports snapping to scene markers and the frame grid (30fps). Snapping is active during playhead scrubbing, keyframe dragging, and marker creation.
- **Multi-Selection & Dragging**:
  - Multiple keyframes and scene markers can be selected (Marquee or Shift-click).
  - Dragging any selected item moves the entire selection across all tracks, maintaining relative timing.
  - Clicking an already-selected item without modifiers preserves the selection for dragging, rather than clearing it.
- **Context Menus**: Standardized across Timeline and Preview using **Shadcn/Radix**. Right-click interactions are managed via the design system for consistent shadows, blurs, and hover states.
- Keyframe handles: each keyframe has `handleIn` / `handleOut` (value-space tangents for
  physics) or `handleInPos` / `handleOutPos` / `handleInTgt` / `handleOutTgt` (3D vectors
  for camera). Mode is `'aligned'` (handles mirror each other) or `'broken'` (independent).
- Scene markers group keyframes: moving a marker cascades child keyframes within
  `±0.1s`. Colliding markers swap positions. Moving a selected marker with a multi-selection of other items shifts all items by the same delta.

---

## 10. Performance Architecture

### Current Optimizations (Do Not Regress)

| Area | What's in place |
|---|---|
| Physics | Web Worker + transferable Float64Array — zero GC per frame |
| Physics Jolt | Dynamic friction reduction on rapid parameter changes for snappiness |
| Repulsion | O(n²) for n<2000; spatial hash grid (cell=150) for n≥2000 |
| Shared-sentence lookup | Uint8Array matrix for n<2000 (O(1) per pair) |
| Texture cache | Pre-built at scene init; hover/select states built on first use |
| Keyframe pre-sort | Physics keyframes sorted once on change, not per-frame |
| Sprite raycasting | `spritesArrayRef` — flat array updated only on scene rebuild; throttled to ~30fps |
| Physics auto-stop | 60 still frames → `physicsEnabledRef = false` (RAF keeps running) |
| Overlap separation | 4-pass in-place, only for 2D mode, in worker message callback |
| Edge draw calls | All edges merged into a single `THREE.LineSegments` — 1 draw call |
| Z-stability | `depthTest: true` + `alphaTest: 0.1` + `renderOrder: 1` |
| Build | Manual chunking for heavy deps (@mui, recharts, motion) + raised 500kB limit for three.js |


### JavaScript Ceiling Risks (Known, Not Yet Addressed)

These are documented for future work. **Do not attempt to fix these without a full discussion:**

1. **Texture memory at scale**: 1000+ nodes = 1000+ GPU textures. Future mitigation:
   texture atlas + UV-mapped quads (requires abandoning sprites — see §4.2 constraints).
2. **Raycasting cost at scale**: `raycaster.intersectObjects(spritesArray)` is O(n) per
   mouse move. Future mitigation: spatial index (BVH or octree) in a Wasm module.
3. **Canvas texture creation jank**: `buildTextureCache` is synchronous on the main thread.
   For large graphs, this should be moved to an `OffscreenCanvas` in a Worker.

### Future Architecture Notes (WebGPU / Wasm path)

If the project moves toward WebGPU:
- Compute shaders are the right home for the N-body repulsion calculation (replaces worker).
- GPU storage buffers for node positions would allow the vertex shader to read positions
  directly without a CPU round-trip — true zero-copy between physics and render.
- The sprite/billboard approach can be preserved in WebGPU via a vertex shader that
  applies a camera-aligned rotation to a quad, combined with a texture array.

If Rust/Wasm is added:
- The highest-value extraction is the raycasting BVH for hover detection.
- Second-highest: the shared-sentence matrix builder (`rebuildPhysicsCache`) for large n.
- The Worker physics loop is already well-structured for a Wasm port — the `runStep`
  function maps directly to a Rust function operating on a `&mut [f64]` slice.

---

## 11. Visual Baseline

See `STYLE_GUIDE.md` for the full locked visual baseline table and UI conventions.
Do not duplicate those values here.

---

## 12. What AI Assistants Must NOT Do

See the Standing Orders in `PROJECT.md` for universal rules.
Additional engine-specific constraints:
2. **Replace `THREE.Sprite` with `InstancedMesh`** — breaks billboard effect and z-ordering.
3. **Move physics back to the main thread** — causes frame drops.
4. **Remove the 3-state texture cache** — rebuilding on hover causes jank.
5. **Hardcode colors in UI components** — use CSS variables / shadcn tokens.
6. **Make controls taller than `h-6`** (except primary action buttons).
7. **Render a plain `<span>` for slider numeric values** — must be a `<button>` → `<input>`.
8. **Hardcode version strings** — version is injected by Vite from git history.
9. **Add `renderOrder` values below 0 to sprites or above 0 to lines** without understanding
   the z-ordering contract in §4.3.
10. **Make App.tsx hold state** — state belongs in `WortnetzContext.tsx`.
    Scene-local transient state (camera position, node positions) belongs in `useRef`
    inside `Network3D.tsx`.
11. **Change the text parsing logic** (n-gram extraction, edge building) without an explicit
    request — the parsing is the conceptual core of the art project.

---

## 13. Checklist Before Submitting Any Change

See `STYLE_GUIDE.md` for UI-specific checks. Engine-level invariants to always verify:

- [ ] Does the node billboard effect still work (nodes always face the camera)?
- [ ] Do connecting lines render behind (below) node sprites at all camera angles?
- [ ] Is the 3-state texture size invariant maintained for all node shapes?
- [ ] Is the physics worker still receiving transferable buffers (not structured-clone copies)?

