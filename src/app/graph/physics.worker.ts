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

let edgeIndices: Int32Array;
let wordCounts: Int32Array;
let sharedMatrix: Uint8Array;
let nodeCount = 0;

self.onmessage = (e: MessageEvent<InitMessage | StepMessage>) => {
  const msg = e.data;

  if (msg.type === 'init') {
    edgeIndices  = msg.edgeIndices;
    wordCounts   = msg.wordCounts;
    sharedMatrix = msg.sharedPairMatrix;
    nodeCount    = msg.nodeCount;
    return;
  }

  // ── STEP ──
  const { posVel, params, is2D } = msg;
  const { repulsion, springK, damping, minSpeed, linkDistance, gravity, turbulence } = params;
  const n = nodeCount;

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
  }

  // Repulsion O(n²)
  for (let i = 0; i < n; i++) {
    const bi = i * 6;
    for (let j = i + 1; j < n; j++) {
      const bj = j * 6;
      const dx = posVel[bi]     - posVel[bj];
      const dy = posVel[bi + 1] - posVel[bj + 1];
      const dz = posVel[bi + 2] - posVel[bj + 2];
      const distSq = dx * dx + dy * dy + dz * dz + 1;
      const dist   = Math.sqrt(distSq);

      const sentenceMod    = sharedMatrix[i * n + j] === 1 ? 0.6 : 1.5;
      const diff           = Math.abs(wordCounts[i] - wordCounts[j]);
      const differenceFactor = 1 + diff * 0.15;

      const force  = Math.min((repulsion * sentenceMod * differenceFactor) / distSq, 40);
      const invDist = 1 / dist;
      const fx = dx * invDist * force;
      const fy = dy * invDist * force;
      const fz = dz * invDist * force;

      posVel[bi + 3] += fx;  posVel[bi + 4] += fy;  posVel[bi + 5] += fz;
      posVel[bj + 3] -= fx;  posVel[bj + 4] -= fy;  posVel[bj + 5] -= fz;
    }
  }

  // Spring attraction along edges with rest-length
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
    const forceMag = (dist - linkDistance) * springK;
    const fx = (dx / dist) * forceMag;
    const fy = (dy / dist) * forceMag;
    const fz = (dz / dist) * forceMag;

    posVel[ba + 3] += fx;  posVel[ba + 4] += fy;  posVel[ba + 5] += fz;
    posVel[bb + 3] -= fx;  posVel[bb + 4] -= fy;  posVel[bb + 5] -= fz;
  }

  // Integrate positions + track movement
  const maxSpeed = 20;
  let totalMovement = 0;

  for (let i = 0; i < n; i++) {
    const b = i * 6;
    let vx = posVel[b + 3];
    let vy = posVel[b + 4];
    let vz = posVel[b + 5];
    const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);

    if (speed > maxSpeed) {
      const inv = maxSpeed / speed;
      vx *= inv; vy *= inv; vz *= inv;
      posVel[b + 3] = vx;
      posVel[b + 4] = vy;
      posVel[b + 5] = vz;
    }

    if (speed > minSpeed) {
      posVel[b]     += vx;
      posVel[b + 1] += vy;
      posVel[b + 2] += vz;
      totalMovement += speed;
    }

    // Enforce 2D plane in worker so caller doesn't need to iterate again
    if (is2D) {
      posVel[b + 2] = 0;
      posVel[b + 5] = 0;
    }
  }

  (self as unknown as Worker).postMessage(
    { posVel, avgMovement: totalMovement / Math.max(n, 1) },
    [posVel.buffer]
  );
};
