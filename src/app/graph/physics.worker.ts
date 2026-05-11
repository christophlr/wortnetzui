// Physics simulation running off the main thread.
// Operates on a flat Float64Array layout: [x, y, z, vx, vy, vz] × n
// Receives transferable buffers from the main thread to avoid copies.

interface PhysicsParams {
  repulsion: number;
  springK: number;
  damping: number;
  minSpeed: number;
  linkDistance: number;
  gravity: number;
  turbulence: number;
  verticalOrder: number;
  pulse: number;
}

interface InitMessage {
  type: 'init';
  edgeIndices: Int32Array;    // [a0, b0, a1, b1, ...] node-index pairs
  wordCounts: Int32Array;     // wordCount per node (stable ordering matches nodeArray)
  sharedPairMatrix: Uint8Array;
  nodeCount: number;
}

interface StepMessage {
  type: 'step';
  posVel: Float64Array;       // [x,y,z,vx,vy,vz] × nodeCount — transferred
  params: PhysicsParams;
  is2D: boolean;
}

interface SettleMessage {
  type: 'settle';
  posVel: Float64Array;       // initial positions from node arrangement — transferred
  params: PhysicsParams;
  maxIterations: number;
}

let edgeIndices: Int32Array;
let wordCounts: Int32Array;
let sharedMatrix: Uint8Array;
let nodeCount = 0;

function runStep(posVel: Float64Array, params: PhysicsParams, is2D: boolean): number {
  const n = nodeCount;
  
  // Sanitize parameters to prevent numerical instability
  const repulsion = Math.max(0, Math.min(params.repulsion, 5000));
  const springK = Math.max(0, Math.min(params.springK, 0.8));
  // Ensure damping doesn't go too low (prevents runaway velocities)
  const damping = Math.max(0.5, Math.min(params.damping, 0.99));
  const minSpeed = Math.max(0.01, Math.min(params.minSpeed, 5));
  const linkDistance = Math.max(10, Math.min(params.linkDistance, 500));
  const gravity = Math.max(-5, Math.min(params.gravity, 10));
  const turbulence = Math.max(0, Math.min(params.turbulence, 10));
  const verticalOrder = params.verticalOrder ?? 0;
  
  // Adaptive force cap based on repulsion strength to prevent explosion/freeze cycles
  const forceCapBase = 40;
  const forceCap = forceCapBase + (repulsion / 5000) * 80; // Scale: 40-120

  // Damping, gravity, turbulence
  for (let i = 0; i < n; i++) {
    const b = i * 6;
    posVel[b + 3] *= damping;
    posVel[b + 4] *= damping;
    posVel[b + 5] *= damping;

    if (gravity > 0) {
      posVel[b + 3] -= posVel[b]     * gravity * 0.001;
      posVel[b + 4] -= posVel[b + 1] * gravity * 0.001;
      posVel[b + 5] -= posVel[b + 2] * gravity * 0.001;
    }

    if (turbulence > 0) {
      posVel[b + 3] += (Math.random() - 0.5) * turbulence * 0.5;
      posVel[b + 4] += (Math.random() - 0.5) * turbulence * 0.5;
      posVel[b + 5] += (Math.random() - 0.5) * turbulence * 0.5;
    }

    if (verticalOrder !== 0) {
      // Shorter words (e.g. 1) float higher (+y), longer words sink lower (-y).
      // We apply a gentle spring force pulling them toward a stratified Y level.
      const targetY = (3 - wordCounts[i]) * 15 * verticalOrder;
      const distY = targetY - posVel[b + 1];
      posVel[b + 4] += distY * 0.001 * verticalOrder;
    }
  }

  // Repulsion
  if (n >= 2000) {
    // Spatial hash grid (O(n)) for large graphs
    const CELL_SIZE = 150;
    const grid = new Map<string, number[]>();

    for (let i = 0; i < n; i++) {
      const b = i * 6;
      const cx = Math.floor(posVel[b] / CELL_SIZE);
      const cy = Math.floor(posVel[b + 1] / CELL_SIZE);
      const cz = Math.floor(posVel[b + 2] / CELL_SIZE);
      const key = `${cx},${cy},${cz}`;
      let cell = grid.get(key);
      if (!cell) { cell = []; grid.set(key, cell); }
      cell.push(i);
    }

    for (let i = 0; i < n; i++) {
      const bi = i * 6;
      const x = posVel[bi];
      const y = posVel[bi + 1];
      const z = posVel[bi + 2];
      const cx = Math.floor(x / CELL_SIZE);
      const cy = Math.floor(y / CELL_SIZE);
      const cz = Math.floor(z / CELL_SIZE);

      let fx = 0, fy = 0, fz = 0;

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          for (let oz = -1; oz <= 1; oz++) {
            const key = `${cx + ox},${cy + oy},${cz + oz}`;
            const cell = grid.get(key);
            if (!cell) continue;

            for (let cIdx = 0; cIdx < cell.length; cIdx++) {
              const j = cell[cIdx];
              if (i === j) continue;
              const bj = j * 6;
              const dx = x - posVel[bj];
              const dy = y - posVel[bj + 1];
              const dz = z - posVel[bj + 2];
              const distSq = dx * dx + dy * dy + dz * dz + 1;

              // Sentence modifier is 1.5 because we don't have the matrix for large n
              const diff = Math.abs(wordCounts[i] - wordCounts[j]);
              const differenceFactor = 1 + diff * 0.15;
              const force = Math.min((repulsion * 1.5 * differenceFactor) / distSq, forceCap);
              const invDist = 1 / Math.sqrt(distSq);
              
              fx += dx * invDist * force;
              fy += dy * invDist * force;
              fz += dz * invDist * force;
            }
          }
        }
      }
      posVel[bi + 3] += fx;
      posVel[bi + 4] += fy;
      posVel[bi + 5] += fz;
    }
  } else {
    // Exact Repulsion O(n²) for smaller graphs
    for (let i = 0; i < n; i++) {
      const bi = i * 6;
      for (let j = i + 1; j < n; j++) {
        const bj = j * 6;
        const dx = posVel[bi]     - posVel[bj];
        const dy = posVel[bi + 1] - posVel[bj + 1];
        const dz = posVel[bi + 2] - posVel[bj + 2];
        const distSq = dx * dx + dy * dy + dz * dz + 1;
        const dist   = Math.sqrt(distSq);

        const sentenceMod    = sharedMatrix.length > 0 && sharedMatrix[i * n + j] === 1 ? 0.6 : 1.5;
        const diff           = Math.abs(wordCounts[i] - wordCounts[j]);
        const differenceFactor = 1 + diff * 0.15;

        const force  = Math.min((repulsion * sentenceMod * differenceFactor) / distSq, forceCap);
        const invDist = 1 / dist;
        const fx = dx * invDist * force;
        const fy = dy * invDist * force;
        const fz = dz * invDist * force;

        posVel[bi + 3] += fx;  posVel[bi + 4] += fy;  posVel[bi + 5] += fz;
        posVel[bj + 3] -= fx;  posVel[bj + 4] -= fy;  posVel[bj + 5] -= fz;
      }
    }
  }

  // Spring attraction along edges with rest-length
  // Use critical damping factor to prevent oscillation at high springK values
  const springForceCap = 15 + springK * 30; // Scale cap with spring strength: 15-39
  const edgeCount = edgeIndices.length >> 1;
  for (let e = 0; e < edgeCount; e++) {
    const ai = edgeIndices[e * 2];
    const bi = edgeIndices[e * 2 + 1];
    const ba = ai * 6;
    const bb = bi * 6;
    const dx = posVel[bb]     - posVel[ba];
    const dy = posVel[bb + 1] - posVel[ba + 1];
    const dz = posVel[bb + 2] - posVel[ba + 2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
    const displacement = dist - linkDistance;
    
    // Cap the force magnitude to prevent oscillation/wobble at extreme values
    const rawForceMag = displacement * springK;
    const forceMag = Math.sign(rawForceMag) * Math.min(Math.abs(rawForceMag), springForceCap);
    
    // Apply velocity-based damping to reduce oscillation (critical damping)
    const relVx = posVel[bb + 3] - posVel[ba + 3];
    const relVy = posVel[bb + 4] - posVel[ba + 4];
    const relVz = posVel[bb + 5] - posVel[ba + 5];
    const relVelAlongSpring = (relVx * dx + relVy * dy + relVz * dz) / dist;
    const springDamping = 2 * Math.sqrt(springK) * 0.5; // Critical damping coefficient
    const dampingForce = relVelAlongSpring * springDamping;
    
    const totalForce = forceMag + dampingForce;
    const fx = (dx / dist) * totalForce;
    const fy = (dy / dist) * totalForce;
    const fz = (dz / dist) * totalForce;

    posVel[ba + 3] += fx;  posVel[ba + 4] += fy;  posVel[ba + 5] += fz;
    posVel[bb + 3] -= fx;  posVel[bb + 4] -= fy;  posVel[bb + 5] -= fz;
  }

  // Integrate positions + track movement
  const maxSpeed = 45;
  const positionBound = 5000; // Prevent nodes from flying to infinity
  let totalMovement = 0;

  for (let i = 0; i < n; i++) {
    const b = i * 6;
    let vx = posVel[b + 3];
    let vy = posVel[b + 4];
    let vz = posVel[b + 5];
    
    // NaN/Infinity recovery: reset to small random position if corrupted
    if (!Number.isFinite(vx) || !Number.isFinite(vy) || !Number.isFinite(vz) ||
        !Number.isFinite(posVel[b]) || !Number.isFinite(posVel[b + 1]) || !Number.isFinite(posVel[b + 2])) {
      posVel[b] = (Math.random() - 0.5) * 100;
      posVel[b + 1] = (Math.random() - 0.5) * 100;
      posVel[b + 2] = (Math.random() - 0.5) * 100;
      posVel[b + 3] = 0;
      posVel[b + 4] = 0;
      posVel[b + 5] = 0;
      continue;
    }
    
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);

    if (speed > maxSpeed) {
      const inv = maxSpeed / speed;
      vx *= inv; vy *= inv; vz *= inv;
      posVel[b + 3] = vx;
      posVel[b + 4] = vy;
      posVel[b + 5] = vz;
    }

    // Always update position (remove minSpeed freeze behavior that causes stuck nodes)
    // Instead, use minSpeed as a threshold for counting "settled" movement
    posVel[b]     += vx;
    posVel[b + 1] += vy;
    posVel[b + 2] += vz;
    
    if (speed > minSpeed) {
      totalMovement += speed;
    }
    
    // Position bounds: soft clamp with velocity dampening at edges
    for (let axis = 0; axis < 3; axis++) {
      const pos = posVel[b + axis];
      if (Math.abs(pos) > positionBound) {
        // Clamp position and reverse/dampen velocity
        posVel[b + axis] = Math.sign(pos) * positionBound;
        posVel[b + 3 + axis] *= -0.3; // Bounce back gently
      }
    }

    // Enforce 2D plane in worker so caller doesn't need to iterate again
    if (is2D) {
      posVel[b + 2] = 0;
      posVel[b + 5] = 0;
    }
  }

  return totalMovement / Math.max(n, 1);
}

self.onmessage = (e: MessageEvent<InitMessage | StepMessage | SettleMessage>) => {
  const msg = e.data;

  if (msg.type === 'init') {
    edgeIndices  = msg.edgeIndices;
    wordCounts   = msg.wordCounts;
    sharedMatrix = msg.sharedPairMatrix;
    nodeCount    = msg.nodeCount;
    return;
  }

  if (msg.type === 'settle') {
    const { posVel, params, maxIterations } = msg;
    let stillCount = 0;
    for (let i = 0; i < maxIterations; i++) {
      const avgMovement = runStep(posVel, params, false);
      if (avgMovement < 0.5) {
        if (++stillCount >= 10) break;
      } else {
        stillCount = 0;
      }
    }
    // Zero velocities for a clean handoff
    for (let i = 0; i < nodeCount; i++) {
      posVel[i * 6 + 3] = 0;
      posVel[i * 6 + 4] = 0;
      posVel[i * 6 + 5] = 0;
    }
    (self as unknown as Worker).postMessage({ type: 'settled', posVel }, [posVel.buffer]);
    return;
  }

  // ── STEP ──
  const { posVel, params, is2D } = msg;
  const avgMovement = runStep(posVel, params, is2D);

  (self as unknown as Worker).postMessage(
    { type: 'step', posVel, avgMovement },
    [posVel.buffer]
  );
};
