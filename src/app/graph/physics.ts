import type { GraphNode, GraphEdge, PhysicsParams } from './types';

/**
 * Build a shared-sentence lookup matrix for O(1) pair queries during physics.
 * Returns a flat array and the node array (stable ordering for matrix indices).
 */
export function rebuildPhysicsCache(nodes: Map<string, GraphNode>): {
  nodeArray: GraphNode[];
  sharedPairMatrix: Uint8Array;
} {
  const arr = Array.from(nodes.values());
  const n = arr.length;
  // Fallback to avoid OOM on large datasets (> 2000 nodes).
  if (n >= 2000) {
    return { nodeArray: arr, sharedPairMatrix: new Uint8Array(0) };
  }
  const matrix = new Uint8Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (const id of arr[i].sentenceIds) {
        if (arr[j].sentenceIds.has(id)) {
          matrix[i * n + j] = 1;
          matrix[j * n + i] = 1;
          break;
        }
      }
    }
  }
  return { nodeArray: arr, sharedPairMatrix: matrix };
}

/**
 * Run one step of force-directed physics simulation.
 * Works for both 2D and 3D — caller zeroes z/vz for 2D after this returns.
 * Returns average movement (used for auto-stop heuristic).
 */
export function applyPhysics(
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  params: PhysicsParams,
  nodeArr?: GraphNode[],
  sharedMatrix?: Uint8Array
): number {
  const nodeArray = nodeArr ?? Array.from(nodes.values());
  const { repulsion, springK, damping, minSpeed, linkDistance, gravity, turbulence } = params;

  // Reset forces
  nodeArray.forEach(node => {
    node.vx *= damping;
    node.vy *= damping;
    node.vz *= damping;

    // Gravity toward origin
    if (gravity > 0) {
      node.vx -= node.x * gravity * 0.001;
      node.vy -= node.y * gravity * 0.001;
      node.vz -= node.z * gravity * 0.001;
    }

    // Turbulence: random impulse each frame
    if (turbulence > 0) {
      node.vx += (Math.random() - 0.5) * turbulence * 0.5;
      node.vy += (Math.random() - 0.5) * turbulence * 0.5;
      node.vz += (Math.random() - 0.5) * turbulence * 0.5;
    }
  });

  // Repulsion
  const n = nodeArray.length;
  if (n >= 2000) {
    const CELL_SIZE = 150;
    const grid = new Map<string, number[]>();

    for (let i = 0; i < n; i++) {
      const node = nodeArray[i];
      const cx = Math.floor(node.x / CELL_SIZE);
      const cy = Math.floor(node.y / CELL_SIZE);
      const cz = Math.floor(node.z / CELL_SIZE);
      const key = `${cx},${cy},${cz}`;
      let cell = grid.get(key);
      if (!cell) { cell = []; grid.set(key, cell); }
      cell.push(i);
    }

    for (let i = 0; i < n; i++) {
      const a = nodeArray[i];
      const cx = Math.floor(a.x / CELL_SIZE);
      const cy = Math.floor(a.y / CELL_SIZE);
      const cz = Math.floor(a.z / CELL_SIZE);

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
              const b = nodeArray[j];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const dz = a.z - b.z;
              const distSq = dx * dx + dy * dy + dz * dz + 1;

              const diff = Math.abs(a.wordCount - b.wordCount);
              const differenceFactor = 1 + diff * 0.15;
              const force = Math.min((repulsion * 1.5 * differenceFactor) / distSq, 40);
              const invDist = 1 / Math.sqrt(distSq);

              fx += dx * invDist * force;
              fy += dy * invDist * force;
              fz += dz * invDist * force;
            }
          }
        }
      }
      a.vx += fx;
      a.vy += fy;
      a.vz += fz;
    }
  } else {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = nodeArray[i];
        const b = nodeArray[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const distSq = dx * dx + dy * dy + dz * dz + 1;
        const dist = Math.sqrt(distSq);

        // Use precomputed matrix when available, else fall back to set iteration
        let sharedSentence: boolean;
        if (sharedMatrix && sharedMatrix.length > 0) {
          sharedSentence = sharedMatrix[i * n + j] === 1;
        } else {
          sharedSentence = false;
          for (const id of a.sentenceIds) {
            if (b.sentenceIds.has(id)) { sharedSentence = true; break; }
          }
        }

        // Modulation: 0.6 if shared, 1.5 otherwise (less extreme)
        const sentenceMod = sharedSentence ? 0.6 : 1.5;

        // Difference factor based on word count difference (reduced impact)
        const diff = Math.abs(a.wordCount - b.wordCount);
        const differenceFactor = 1 + diff * 0.15;

        // Calculate force — fused magnitude + direction to save a division per pair
        const force = Math.min((repulsion * sentenceMod * differenceFactor) / distSq, 40);
        const invDist = 1 / dist;
        const fx = dx * invDist * force;
        const fy = dy * invDist * force;
        const fz = dz * invDist * force;

        a.vx += fx;
        a.vy += fy;
        a.vz += fz;
        b.vx -= fx;
        b.vy -= fy;
        b.vz -= fz;
      }
    }
  }

  // Spring attraction along edges with rest-length
  edges.forEach(edge => {
    const dx = edge.b.x - edge.a.x;
    const dy = edge.b.y - edge.a.y;
    const dz = edge.b.z - edge.a.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;

    // Displacement from rest length
    const displacement = dist - linkDistance;
    const forceMag = displacement * springK;

    const fx = (dx / dist) * forceMag;
    const fy = (dy / dist) * forceMag;
    const fz = (dz / dist) * forceMag;

    edge.a.vx += fx;
    edge.a.vy += fy;
    edge.a.vz += fz;
    edge.b.vx -= fx;
    edge.b.vy -= fy;
    edge.b.vz -= fz;
  });

  // Apply velocity with speed limit and track total movement
  const maxSpeed = 20;
  let totalMovement = 0;

  nodeArray.forEach(node => {
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy + node.vz * node.vz);

    if (speed > maxSpeed) {
      node.vx = (node.vx / speed) * maxSpeed;
      node.vy = (node.vy / speed) * maxSpeed;
      node.vz = (node.vz / speed) * maxSpeed;
    }

    // Apply minimum speed threshold
    if (speed > minSpeed) {
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;
      totalMovement += speed;
    }
  });

  return totalMovement / nodeArray.length; // Average movement
}
