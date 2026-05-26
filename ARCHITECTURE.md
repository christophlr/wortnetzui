# Wortnetzui — Architecture & Design Specification

> **🤖 AI INSTRUCTION:** Read this file before touching the 3D engine, physics, rendering, or data flow. For visual appearance rules, always consult [STYLE_GUIDE.md](./STYLE_GUIDE.md).

## 1. 3D Rendering Architecture — `Network3D.tsx`

### 1.1 Rendering Pipeline

    Text input
      → parsing.ts (n-gram extraction)      [main thread]
      → arrangeNodesCone3D / scatterNodes2D [main thread, initial layout only]
      → physics.worker.ts 'settle' pass     [worker thread, async]
      ← 'settled' response → syncGraphVisuals
      → animate() RAF loop
          ├── physicsWorker 'step'          [worker, transferable buffer]
          ├── applyCameraKeyframes          [main thread]
          ├── zoomAnim / cameraFly lerp     [main thread]
          ├── OrbitControls.update()        [main thread]
          ├── handleResize                  [main thread]
          └── renderer.render()             [GPU]

### 1.2 Node Rendering — 🔒 SPRITES ARE INTENTIONAL
Nodes are rendered as **`THREE.Sprite`** objects. This is a deliberate, locked choice.
- Sprites are **camera-aligned billboards by default**.
- **Z-ordering**: We use `depthTest: true`, `depthWrite: true`, and `alphaTest: 0.1`. Sprites use `renderOrder: 1` while edges use `renderOrder: 0`.
- The sprite texture is a `THREE.CanvasTexture` from a standard `HTMLCanvasElement` for perfect anti-aliased text.

### 1.3 Edge Rendering
All edges are rendered as a **single `THREE.LineSegments`** object with `renderOrder: 0`. Edge materials keep `depthTest: true` but must use `depthWrite: false` so they never win over node sprites in the depth buffer. 1 draw call for all edges.

### 1.4 Texture Cache — 3-State per Node
Each node label has 3 cached `THREE.CanvasTexture` entries: `normal`, `highlighted`, `selected`. `swapSpriteTexture()` swaps them.

### 1.5 Physics System
Runs every frame off the main thread via `physics.worker.ts`. Uses transferable `Float64Array(nodeCount × 6)`.
**Physics "Jolt" Effect**: High parameter change velocity decreases friction temporarily for snappiness.
**Glitch Paint**: Smoothstep reveal based on `uMousePos`.
**Self-Healing & Parameter Sanitization**: Node positions and velocities are scanned in the worker per step; any detected `NaN` or non-finite coordinate values are immediately self-healed by resetting them to a small random center offset with zero velocity. Evaluated parameter values from the animation tracks are sanitized back to user-adjusted sliders or defaults to block mathematical pollution.

### 1.6 Camera System
- 3D: `PerspectiveCamera` with OrbitControls.
- 2D: `OrthographicCamera` (pan + zoom only).
- Hermite splines for keyframe animation. Gizmo is deactivated.

## 2. Data Flow & State Architecture

`WortnetzContext.tsx` is the **Single Source of Truth**. App.tsx is just a composer.
`Network3D` does not hold React state for anything that needs to persist.

### 2.1 State (WortnetzContext slices)
The global state is divided into logical slices inside the context provider.
- `text` & `parseMode`: Drive the n-gram extraction and node generation.
- `visualSettings`: Global appearance parameters (e.g., node sizing, edge opacity).
- `physicsParams`: Active force parameters.
- `timeline`: Playback state, current time, duration.
- `tracks` & `keyframes`: The actual animation data.

### 2.2 Undo/Redo (`useUndoStack`)
- **Scope**: Tracks timeline state: camera keyframes, physics keyframes, scene markers, and track metadata (glide, modulators). Does not track text input or global visual settings.
- **Implementation**: Capped stack (max 30) of `structuredClone` snapshots. Drag gestures are bracketed via `preDragStateRef` / `handleDragStart` / `handleDragEnd` so each gesture commits exactly once. High-frequency slider mutations use `pushDebounced(ms)` (setTimeout-based coalescing) to avoid stack flooding.

### 2.3 Save/Load (`useWorkspaceIO`)
- **Serialization**: Packages the current text, settings, layout mode, and all keyframe data into a unified JSON structure (`.wortnetz` file).
- **Hydration**: Validates the loaded file structure before applying it to the context, handling legacy formats if necessary.

### 2.4 Keyframe interpolation (Hermite splines)
- **Why Hermite?**: We use cubic Hermite splines (via `easing.ts`) instead of simple linear interpolation or basic bezier curves because Hermite splines provide continuous velocity (C1 continuity) across multiple keyframes. This prevents jarring, abrupt changes in camera motion or physics parameters when passing through an intermediate keyframe.
- **How it works**: It uses the surrounding keyframes to calculate entry and exit tangents, resulting in a smooth, continuous curve.
- **NaN Guarding**: Tangent calculations use loose checks (`== null` and `!= null`) to ensure that `undefined` or `null` keyframe handle boundaries never trigger `NaN` mathematical results.

### 2.5 Camera system internal state
- The camera's active position, target, and rotation are owned by `Network3D` imperatively for performance, but **keyframes are owned by the context**.
- During playback, `Network3D` pulls interpolated values from the context and applies them directly to the Three.js camera. When paused, user interaction updates the imperative camera, and clicking "add keyframe" pushes the current imperative state back into the React context.

## 3. UI Composition Cascade

The user interface is built following a strict atomic hierarchy, ensuring consistency and reusability across the application. Visual constraints and rules for this cascade are detailed in [STYLE_GUIDE.md](./STYLE_GUIDE.md).

`AppShell`
  ↳ `ResizablePanelGroup` (Horizontal)
      ↳ `ResizablePanel` (Workspace)
          ↳ `ResizablePanelGroup` (Vertical)
              ↳ `ResizablePanel` (Canvas Viewport)
                  ↳ `AppCanvas`
                      ↳ `Preview` (3D scene + dot grid background + AspectRatioGuide overlay)
                      ↳ `Toolbar` & `TopBar` (floating UI overlays)
              ↳ `ResizablePanel` (Timeline)
                  ↳ `Timeline` (Dopesheet & Graph Editor)
      ↳ `ResizablePanel` (Sidebar)
          ↳ `AppSidebar`
              ↳ `Sidebar` (Component)
                  ↳ `SidebarTabHeader` (h1 - uppercase tab title)
                  ↳ `SidebarSection` (h2 - major functional area)
                      ↳ `SidebarGroup` (h3 - used ONLY for a true subgroup of 2+ related controls)
                          ↳ `SidebarRow` (e.g. `SidebarSliderRow`, `SidebarToggleRow`)
                              ↳ **Atomic control** (`SidebarEditableNumber`, `SidebarSliderTrack`, `Switch`)