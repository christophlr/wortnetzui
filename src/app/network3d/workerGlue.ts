import type { GraphNode, GraphEdge, PhysicsParams } from '../graph';

export interface WorkerInitPayload {
  type: 'init';
  edgeIndices: Int32Array;
  wordCounts: Int32Array;
  sharedPairMatrix: Uint8Array;
  nodeCount: number;
}

export function buildInitPayload(
  nodeArr: GraphNode[],
  edges: GraphEdge[],
  sharedPairMatrix: Uint8Array,
): WorkerInitPayload {
  const labelToIdx = new Map<string, number>();
  nodeArr.forEach((node, i) => labelToIdx.set(node.label, i));

  const edgeIndices = new Int32Array(edges.length * 2);
  edges.forEach((edge, ei) => {
    edgeIndices[ei * 2]     = labelToIdx.get(edge.a.label)!;
    edgeIndices[ei * 2 + 1] = labelToIdx.get(edge.b.label)!;
  });

  const wordCounts = new Int32Array(nodeArr.map(n => n.wordCount));

  return {
    type: 'init',
    edgeIndices,
    wordCounts,
    sharedPairMatrix,
    nodeCount: nodeArr.length,
  };
}

export interface WorkerSettlePayload {
  type: 'settle';
  posVel: Float64Array;
  params: PhysicsParams;
  maxIterations: number;
}

export function buildSettlePayload(
  nodeArr: GraphNode[],
  params: PhysicsParams,
  maxIterations: number,
): WorkerSettlePayload {
  const posVel = new Float64Array(nodeArr.length * 6);
  for (let i = 0; i < nodeArr.length; i++) {
    posVel[i * 6]     = nodeArr[i].x;
    posVel[i * 6 + 1] = nodeArr[i].y;
    posVel[i * 6 + 2] = nodeArr[i].z;
  }
  return { type: 'settle', posVel, params, maxIterations };
}

/** Pack live positions + velocities into the reusable transfer buffer. */
export function packStepBuffer(buffer: Float64Array, nodeArr: GraphNode[]): void {
  for (let i = 0; i < nodeArr.length; i++) {
    const b = i * 6;
    buffer[b]     = nodeArr[i].x;
    buffer[b + 1] = nodeArr[i].y;
    buffer[b + 2] = nodeArr[i].z;
    buffer[b + 3] = nodeArr[i].vx;
    buffer[b + 4] = nodeArr[i].vy;
    buffer[b + 5] = nodeArr[i].vz;
  }
}

/** Apply step response (positions + velocities). */
export function unpackStepBuffer(buffer: Float64Array, nodeArr: GraphNode[]): void {
  for (let i = 0; i < nodeArr.length; i++) {
    const b = i * 6;
    nodeArr[i].x  = buffer[b];
    nodeArr[i].y  = buffer[b + 1];
    nodeArr[i].z  = buffer[b + 2];
    nodeArr[i].vx = buffer[b + 3];
    nodeArr[i].vy = buffer[b + 4];
    nodeArr[i].vz = buffer[b + 5];
  }
}

/** Apply settle response (positions only; velocities zeroed). */
export function unpackSettleBuffer(buffer: Float64Array, nodeArr: GraphNode[]): void {
  for (let i = 0; i < nodeArr.length; i++) {
    const b = i * 6;
    nodeArr[i].x  = buffer[b];
    nodeArr[i].y  = buffer[b + 1];
    nodeArr[i].z  = buffer[b + 2];
    nodeArr[i].vx = 0;
    nodeArr[i].vy = 0;
    nodeArr[i].vz = 0;
  }
}

/**
 * 2D sprite-based overlap separation (runs on main thread — reads sprite
 * scales). Returns the worst overlap distance observed across all passes.
 * Pass count scales down with graph size: 4 passes ≤150 nodes, 2 passes
 * ≤300, 1 pass otherwise.
 */
export function applyOverlapSeparation(nodeArr: GraphNode[]): number {
  let maxOverlap = 0;
  const n = nodeArr.length;
  const maxPasses = n > 300 ? 1 : (n > 150 ? 2 : 4);
  for (let pass = 0; pass < maxPasses; pass++) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = nodeArr[i], b2 = nodeArr[j];
        const dx = a.x - b2.x, dy = a.y - b2.y;
        const distSep = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const rA = a.textSprite ? (a.textSprite.scale.x + a.textSprite.scale.y) / 4 : 30;
        const rB = b2.textSprite ? (b2.textSprite.scale.x + b2.textSprite.scale.y) / 4 : 30;
        const minSep = rA + rB + 6;
        if (distSep < minSep) {
          const overlap = minSep - distSep;
          if (overlap > maxOverlap) maxOverlap = overlap;
          const push = overlap * 0.5 / distSep;
          a.x += dx * push;   a.y += dy * push;
          b2.x -= dx * push;  b2.y -= dy * push;
        }
      }
    }
  }
  return maxOverlap;
}
