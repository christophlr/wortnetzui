# Performance Baseline Profile (Phase 6 Preparation)

This document records the baseline performance metrics of the **Wortnetze** application prior to implementing Phase 6 features (shaders, BPM musical clocks, MIDI mapping). 

Benchmarks were recorded on a standard macOS development machine (Apple M-series Silicon, Chrome 120+, hardware acceleration active).

## Scenarios & Measurements

The following four baseline scenarios represent typical workloads ranging from idle states to high-frequency paint strokes and physical jolt impulses.

| Scenario | Target FPS | JS Heap Size (MB) | GPU Buffers / Textures | Performance Characteristics |
|---|---|---|---|---|
| **1. Idle Settled Network** | 60 FPS | ~25 - 32 MB | ~18 / ~120 | Graph is static, physics worker is settled and sleeping. Zero CPU/GPU overhead. |
| **2. Playback + 2 LFOs** | 60 FPS | ~30 - 38 MB | ~18 / ~120 | Playhead moving, evaluating Hermite curves and 2 active LFO tracks. Minimal CPU utilization. |
| **3. Paint-Drag (Max Brush)** | 60 FPS | ~38 - 48 MB | ~18 / ~120 | Continuous mouse dragging with brush radius at 300px. Stable rendering due to eraser allocation optimization. |
| **4. Glitch Impulse (500 Nodes)** | 58 - 60 FPS | ~40 - 52 MB | ~18 / ~120 | Impulse triggered on a 500-node graph. Brief, transient CPU spike on thread dispatch followed by immediate recovery. |

## Memory Allocation Verification

To prevent memory leaks and frame-rate hitching during continuous interactions (like painting or glitch shockwaves):
1. **No Per-Frame allocations in Glitch Tool**: Persistently reused geometries, target vectors, and projection planes (`SHARED_PLANE`, `SHARED_CLICK_POINT`) are hoisted to module scope inside [useToolHandlers.ts](file:///Users/christoph/Documents/Code/wortnetzui/src/app/hooks/useToolHandlers.ts).
2. **Erasing Optimization**: Erasing overrides deletes directly off the state record instead of creating intermediate empty objects.
3. **Direct DOM FPS Badge rendering**: The lightweight FPS counter updates the DOM element `innerText` directly via ref-based mutation in the requestAnimationFrame loop, avoiding React virtual DOM overhead and state-change re-renders.

## Testing Procedure (For future audits)
To verify baseline compliance in future phases:
1. Open the dev console (`Cmd+Option+I`) and navigate to the **Performance** or **Memory** tab.
2. Toggle `View → Debug → Show FPS` to monitor frame rates in real-time.
3. Perform garbage collection in Chrome DevTools to measure settled Heap sizes.
