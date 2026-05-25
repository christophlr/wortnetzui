import * as THREE from 'three';
import type { GraphNode, GraphEdge } from '../graph';

export interface SyncVisualSettings {
  nodesVisible: boolean;
  edgesVisible: boolean;
  radialBiasScale: number;
  radialBiasOpacity: number;
  gradientOrigin: string;
  gradientPeriphery: string;
  glitchActive: boolean;
  glitchBrushRadius: number;
  glitchFeather: number;
}

export interface SyncStyleSettings {
  nodeScale: number;
}

export interface SyncVisualsArgs {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  nodeArr?: GraphNode[];
  visualSettings: SyncVisualSettings;
  styleSettings: SyncStyleSettings;
  camera: THREE.Camera | null;
  mousePos: THREE.Vector2;
  edgeLines: THREE.LineSegments | null;
}

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _scratchColor = new THREE.Color();
const _scratchVec1 = new THREE.Vector3();
const _scratchVec2 = new THREE.Vector3();

export function syncGraphVisuals(args: SyncVisualsArgs): void {
  const { nodes, edges, nodeArr, visualSettings: vs, styleSettings: ss, camera, mousePos, edgeLines } = args;
  const arr = nodeArr ?? Array.from(nodes.values());

  _colorA.set(vs.gradientOrigin);
  _colorB.set(vs.gradientPeriphery);

  let maxDistSq = 0;
  for (let i = 0; i < arr.length; i++) {
    const n = arr[i];
    const dSq = n.x * n.x + n.y * n.y + n.z * n.z;
    if (dSq > maxDistSq) maxDistSq = dSq;
  }
  const invMaxDistSq = 1 / (maxDistSq || 1);

  const falloffMagnitude = vs.radialBiasScale * vs.radialBiasScale * 8;

  for (let i = 0; i < arr.length; i++) {
    const node = arr[i];
    if (node.textSprite) {
      node.textSprite.position.set(node.x, node.y, node.z);

      node.textSprite.visible = vs.nodesVisible;

      const distSq = node.x * node.x + node.y * node.y + node.z * node.z;
      const normDistSq = distSq * invMaxDistSq;

      const baseScale = node.textSprite.userData.baseScale * ss.nodeScale;
      const t = vs.radialBiasScale >= 0 ? normDistSq : 1.0 - normDistSq;
      const distCurve = t * t * t;
      const scaleIntensity = 1.0 + (falloffMagnitude * distCurve);
      const aspectRatio = node.textSprite.userData.aspectRatio;

      let finalScale = baseScale * scaleIntensity;
      if (node.unlinkedScale && node.scaleOverride !== undefined) {
        finalScale = node.textSprite.userData.baseScale * node.scaleOverride;
      }

      node.textSprite.scale.set(finalScale, finalScale * aspectRatio, 1);

      let finalOpacity = Math.max(0.0, 1.0 - (vs.radialBiasOpacity * normDistSq));
      if (node.unlinkedOpacity && node.opacityOverride !== undefined) {
        finalOpacity = node.opacityOverride;
      }
      node.textSprite.material.opacity = finalOpacity;

      const nodeColor = _scratchColor.lerpColors(_colorA, _colorB, normDistSq);
      node.textSprite.material.color.copy(nodeColor);

      if (vs.glitchActive && camera) {
        _scratchVec1.copy(node.textSprite.position).project(camera);
        _scratchVec2.set(mousePos.x, mousePos.y, _scratchVec1.z);
        const mouseDist = _scratchVec1.distanceTo(_scratchVec2);

        const brushRadiusNorm = vs.glitchBrushRadius / 500;
        const feather = vs.glitchFeather;

        const reveal = 1.0 - THREE.MathUtils.smoothstep(mouseDist, brushRadiusNorm * (1 - feather), brushRadiusNorm);
        node.textSprite.material.opacity *= reveal;
      }
    }
  }

  if (edgeLines) {
    edgeLines.visible = vs.edgesVisible;
    const pos = edgeLines.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const idx = i * 2;
      pos.setXYZ(idx, edge.a.x, edge.a.y, edge.a.z);
      pos.setXYZ(idx + 1, edge.b.x, edge.b.y, edge.b.z);
    }
    pos.needsUpdate = true;
  }
}
