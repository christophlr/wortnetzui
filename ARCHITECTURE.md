# Wortnetzui — Architecture & Design Specification

> **🤖 AI INSTRUCTION:** Read this file before touching the 3D engine, physics, rendering, or data flow.

<visual_freeze>
  <constraint>Preserve all existing visual appearances (colors, fonts, spacing, node styles, gradients, shadows) exactly as they are.</constraint>
  <constraint>Apply visual changes ONLY if the user's prompt explicitly requests a change to the UI or rendering style.</constraint>
</visual_freeze>

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

### 1.6 Camera System
- 3D: `PerspectiveCamera` with OrbitControls.
- 2D: `OrthographicCamera` (pan + zoom only).
- Hermite splines for keyframe animation. Gizmo is deactivated.

## 2. Data Flow & State Architecture

`WortnetzContext.tsx` is the **Single Source of Truth**. App.tsx is just a composer.
`Network3D` does not hold React state for anything that needs to persist.

### 2.1 Undo/Redo & Save
- **Undo**: Timeline state only (camera/physics keyframes, markers). Capped at 50.
- **Save**: Serializes text, settings,