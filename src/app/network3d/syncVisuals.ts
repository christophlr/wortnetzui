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
  bloomSelective: boolean;
  bloomSelectiveRatio: number;
  bloomGlowMode: 'deterministic' | 'flicker' | 'index';
  bloomFlickerSpeed: number;
  bloomIntensity: number;
  gradientHueShift: number;
}

export interface SyncStyleSettings {
  nodeScale: number;
  edgeOpacity: number;
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
  /** Current time in seconds (performance.now() / 1000). Used for flicker mode. */
  time?: number;
  paintedOverrides?: Record<string, { color?: string; scale?: number; opacity?: number }>;
}

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _scratchColor = new THREE.Color();
const _scratchColor2 = new THREE.Color();
const _scratchVec1 = new THREE.Vector3();
const _scratchVec2 = new THREE.Vector3();
const _hslA = { h: 0, s: 0, l: 0 };
const _hslB = { h: 0, s: 0, l: 0 };

export function syncGraphVisuals(args: SyncVisualsArgs): void {
  const { nodes, edges, nodeArr, visualSettings: vs, styleSettings: ss, camera, mousePos, edgeLines, time = 0, paintedOverrides } = args;
  const arr = nodeArr ?? Array.from(nodes.values());

  // Apply hue shift to gradient colors
  _colorA.set(vs.gradientOrigin);
  _colorB.set(vs.gradientPeriphery);
  if (vs.gradientHueShift !== 0) {
    const shift = vs.gradientHueShift / 360;
    _colorA.getHSL(_hslA);
    _colorA.setHSL((_hslA.h + shift) % 1, _hslA.s, _hslA.l);
    _colorB.getHSL(_hslB);
    _colorB.setHSL((_hslB.h + shift) % 1, _hslB.s, _hslB.l);
  }

  let maxDistSq = 0;
  for (let i = 0; i < arr.length; i++) {
    const n = arr[i];
    const dSq = n.x * n.x + n.y * n.y + n.z * n.z;
    if (dSq > maxDistSq) maxDistSq = dSq;
  }
  const invMaxDistSq = 1 / (maxDistSq || 1);

  const falloffMagnitude = vs.radialBiasScale * vs.radialBiasScale * 8;
  const totalNodes = arr.length || 1;

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

      let overrideScale = node.scaleOverride;
      if (paintedOverrides && paintedOverrides[node.label]?.scale !== undefined) {
        overrideScale = paintedOverrides[node.label].scale;
      }
      let finalScale = baseScale * scaleIntensity;
      if (overrideScale !== undefined) {
        finalScale = node.textSprite.userData.baseScale * overrideScale;
      }

      node.textSprite.scale.set(finalScale, finalScale * aspectRatio, 1);

      let overrideOpacity = node.opacityOverride;
      if (paintedOverrides && paintedOverrides[node.label]?.opacity !== undefined) {
        overrideOpacity = paintedOverrides[node.label].opacity;
      }
      let finalOpacity = Math.max(0.0, 1.0 - (vs.radialBiasOpacity * normDistSq));
      if (overrideOpacity !== undefined) {
        finalOpacity = overrideOpacity;
      }
      node.textSprite.material.opacity = finalOpacity;

      let overrideColor = node.colorOverride;
      let overrideColorBlend = 0.0;
      if (paintedOverrides && paintedOverrides[node.label]?.color !== undefined) {
        overrideColor = paintedOverrides[node.label].color;
        overrideColorBlend = paintedOverrides[node.label].colorBlend ?? 0.0;
      }
      const nodeColor = _scratchColor;
      nodeColor.lerpColors(_colorA, _colorB, normDistSq);
      if (overrideColor !== undefined) {
        _scratchColor2.set(overrideColor);
        nodeColor.lerp(_scratchColor2, 1.0 - overrideColorBlend);
      }

      // Selective bloom: boost selected nodes' colors above 1.0 so they exceed the bloom threshold
      if (vs.bloomSelective) {
        let isGlowing = false;
        const ratio = vs.bloomSelectiveRatio;
        switch (vs.bloomGlowMode) {
          case 'deterministic': {
            const seed = node.glowSeed ?? 0;
            isGlowing = seed <= ratio;
            break;
          }
          case 'flicker': {
            const seed = node.glowSeed ?? 0;
            const phase = seed * 100 + time * vs.bloomFlickerSpeed * Math.PI * 2;
            const wave = (Math.sin(phase) + 1) / 2; // 0..1
            isGlowing = wave <= ratio;
            break;
          }
          case 'index': {
            const idx = node.nodeIndex ?? i;
            isGlowing = (idx / totalNodes) <= ratio;
            break;
          }
        }
        if (isGlowing) {
          // Calculate relative luminance of the base node color (Rec. 709)
          const L_base = 0.2126 * nodeColor.r + 0.7152 * nodeColor.g + 0.0722 * nodeColor.b;
          // Target luminance scaled relative to selective threshold (0.95) based on bloomIntensity
          const targetLuminance = 0.95 + Math.max(0.07, vs.bloomIntensity * 1.5);
          // Scale base color by the ratio of target relative luminance to current relative luminance
          const boost = targetLuminance / Math.max(0.01, L_base);
          const safeBoost = Math.min(12.0, boost);
          nodeColor.multiplyScalar(safeBoost);
        }
      }

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
    // Dynamic edge opacity
    const mat = edgeLines.material as THREE.LineBasicMaterial;
    mat.opacity = ss.edgeOpacity;
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
