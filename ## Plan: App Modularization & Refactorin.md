## Plan: App Modularization & Refactoring

Phase 1 (Bug fixes & Camera prep) is complete. We need to sequentially refactor the largest monolithic components to avoid AI context limits and improve code maintainability. We will proceed methodically, committing/building after each hook/component extraction.

**Steps**
1. **Phase 2: App.tsx Hooks Extraction** ✅ COMPLETE
   - Created `useShortcuts.ts` to manage keyboard commands and dialog state. 
   - Created `useWorkspaceIO.ts` to handle save/load logic.
   - App.tsx now ~1156 lines instead of 890+ fragmented; builds successfully.

2. **Phase 3: Inspector Refactoring** IN PROGRESS
   - Created `src/app/components/inspector/ContentTab.tsx` (Input text + Parse mode).
   - Created stub components: `VisualTab.tsx`, `PhysicsTab.tsx`, `CameraTab.tsx`, `CanvasTab.tsx`.
   - Updated `Inspector.tsx` to import and use `ContentTab` — builds successfully.
   - Next: Populate remaining tabs (Visual, Physics, Camera, Canvas) and update Inspector to use them.

3. **Phase 4: Network3D Breakdown**
   - Extract camera tracking and controls logic into `useCameraControls.ts` and `Network3D.tsx`.
   - Extract the node/edge rendering loop definitions.
   - *Independent Verification*: Build the project, ensuring `Three.js` interactions, graph forces, and WebWorker updates all fire seamlessly.

**Relevant files**
- `src/app/App.tsx` — extract to `src/app/hooks/useShortcuts.ts` & `src/app/hooks/useWorkspaceIO.ts`
- `src/app/components/Inspector.tsx` — extract to `src/app/components/inspector/*.tsx`
- `src/app/components/Network3D.tsx` — extract internal Three.js lifecycle into hooks.

**Verification**
1. Run `npm run build` after every single extraction step to verify no regressions in bundle resolution or symbol duplication.
2. In the UI, verify shortcuts (e.g., Space to play/pause).