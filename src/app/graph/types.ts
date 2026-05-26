import type * as THREE from 'three';

export interface GraphNode {
  label: string;
  wordCount: number;
  sentenceIds: Set<number>;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  mesh?: THREE.Mesh;
  textSprite?: THREE.Sprite;
  textObj?: any; // troika-three-text Text
  width?: number;
  height?: number;
  instanceId?: number;
  unlinkedScale?: boolean;
  scaleOverride?: number;
  unlinkedOpacity?: boolean;
  opacityOverride?: number;
  /** Stable random seed [0,1) for selective bloom (deterministic + flicker modes). */
  glowSeed?: number;
  /** Integer index in the node array for index-based selective bloom. */
  nodeIndex?: number;
}

export interface GraphEdge {
  a: GraphNode;
  b: GraphNode;
  line?: THREE.Line;
}

export interface PhysicsParams {
  repulsion: number;
  springK: number;
  damping: number;
  minSpeed: number;
  linkDistance: number;
  gravity: number;
  turbulence: number;
  verticalOrder: number;
}

export const DEFAULT_PHYSICS: PhysicsParams = {
  repulsion: 1500,
  springK: 0.2,
  damping: 0.85,
  minSpeed: 0.5,
  linkDistance: 80,
  gravity: 0,
  turbulence: 0,
  verticalOrder: 0,
};
