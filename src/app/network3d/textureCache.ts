import * as THREE from 'three';
import { getNetworkLabelStyle, type NodeShape, SCENE_COLORS } from '../networkTheme';
import type { GraphNode } from '../graph';

export interface TextureCacheEntry {
  normal: THREE.Texture;
  highlighted?: THREE.Texture;
  selected?: THREE.Texture;
  baseScale: number;
  aspectRatio: number;
}

export type TextureCache = Map<string, TextureCacheEntry>;

export interface TextureBuildOptions {
  dark: boolean;
  nodeShape: NodeShape;
  nodeBorderWidth: number;
}

export interface DepthStyle {
  depthSizeEnabled?: boolean;
  depthSizeStrength?: number;
}

export interface SpriteScaleStyle extends DepthStyle {
  nodeScale: number;
}

const EDIT_NODE_COLOR = SCENE_COLORS.editNodeColor;
const OUTLINE_STROKE = 3;
const OUTLINE_GAP = 2;
const OUTLINE_MARGIN = OUTLINE_STROKE + OUTLINE_GAP;

export function createCanvasTexture(
  text: string,
  highlighted: boolean,
  selected: boolean,
  opts: TextureBuildOptions,
): { texture: THREE.Texture; baseScale: number; aspectRatio: number } {
  const { dark, nodeShape, nodeBorderWidth } = opts;
  const effectiveBorderColor = EDIT_NODE_COLOR;
  const effectiveTextColor = EDIT_NODE_COLOR;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  const words = text.split(' ');
  const fontSize = 28;
  const lineHeight = fontSize * 1.2;
  const padding = 14;
  const pixelRatio = 3;

  context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  const maxWidth = Math.max(...words.map(w => context.measureText(w).width));
  const logicalWidth = maxWidth + padding * 2;
  const logicalHeight = words.length * lineHeight + padding * 2;

  const canvasLogicalWidth = logicalWidth + OUTLINE_MARGIN * 2;
  const canvasLogicalHeight = logicalHeight + OUTLINE_MARGIN * 2;

  canvas.width = canvasLogicalWidth * pixelRatio;
  canvas.height = canvasLogicalHeight * pixelRatio;
  context.scale(pixelRatio, pixelRatio);

  const bw = nodeBorderWidth;
  const fillColor = getNetworkLabelStyle(dark).backgroundHex;
  const cx = OUTLINE_MARGIN + logicalWidth / 2;
  const cy = OUTLINE_MARGIN + logicalHeight / 2;

  context.save();
  context.beginPath();
  if (nodeShape === 'ellipse') {
    context.ellipse(cx, cy, logicalWidth / 2, logicalHeight / 2, 0, 0, Math.PI * 2);
  } else if (nodeShape === 'rounded-rectangle') {
    context.roundRect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight, 6);
  } else {
    context.rect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight);
  }
  context.clip();

  context.fillStyle = fillColor;
  if (nodeShape === 'ellipse') {
    context.beginPath();
    context.ellipse(cx, cy, logicalWidth / 2, logicalHeight / 2, 0, 0, Math.PI * 2);
    context.fill();
  } else if (nodeShape === 'rounded-rectangle') {
    context.beginPath();
    context.roundRect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight, 6);
    context.fill();
  } else {
    context.fillRect(OUTLINE_MARGIN, OUTLINE_MARGIN, logicalWidth, logicalHeight);
  }
  context.restore();

  if (!highlighted && !selected) {
    if (bw > 0) {
      context.strokeStyle = effectiveBorderColor;
      context.lineWidth = bw;
      context.beginPath();
      if (nodeShape === 'ellipse') {
        context.ellipse(cx, cy, logicalWidth / 2 + bw / 2, logicalHeight / 2 + bw / 2, 0, 0, Math.PI * 2);
      } else if (nodeShape === 'rounded-rectangle') {
        context.roundRect(OUTLINE_MARGIN - bw / 2, OUTLINE_MARGIN - bw / 2, logicalWidth + bw, logicalHeight + bw, 6);
      } else {
        context.roundRect(OUTLINE_MARGIN - bw / 2, OUTLINE_MARGIN - bw / 2, logicalWidth + bw, logicalHeight + bw, 3 + bw / 2);
      }
      context.stroke();
    }
  } else {
    const pathOff = OUTLINE_MARGIN - OUTLINE_GAP - OUTLINE_STROKE / 2;
    const pathW = logicalWidth + 2 * (OUTLINE_GAP + OUTLINE_STROKE / 2);
    const pathH = logicalHeight + 2 * (OUTLINE_GAP + OUTLINE_STROKE / 2);
    context.strokeStyle = SCENE_COLORS.selectionOutline;
    context.lineWidth = OUTLINE_STROKE;
    context.beginPath();
    if (nodeShape === 'ellipse') {
      context.ellipse(cx, cy, pathW / 2, pathH / 2, 0, 0, Math.PI * 2);
    } else if (nodeShape === 'rounded-rectangle') {
      context.roundRect(pathOff, pathOff, pathW, pathH, 8);
    } else {
      context.roundRect(pathOff, pathOff, pathW, pathH, 5);
    }
    context.stroke();
  }

  context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  context.fillStyle = effectiveTextColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  words.forEach((word, i) => {
    const y = OUTLINE_MARGIN + padding + lineHeight / 2 + i * lineHeight;
    context.fillText(word, OUTLINE_MARGIN + logicalWidth / 2, y);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const wordCount = words.length;
  const scaleFactor = Math.max(0.4, 1 - (wordCount * 0.05));
  const baseScale = (Math.max(canvasLogicalWidth, canvasLogicalHeight) / 2.5) * scaleFactor;
  const aspectRatio = canvasLogicalHeight / canvasLogicalWidth;

  return { texture, baseScale, aspectRatio };
}

export function createSpriteFromTexture(
  texture: THREE.Texture,
  label: string,
  baseScale: number,
  aspectRatio: number,
  nodeScale: number,
): THREE.Sprite {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: true,
    alphaTest: 0.1,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.renderOrder = 1;
  sprite.userData.label = label;
  sprite.userData.baseScale = baseScale;
  sprite.userData.aspectRatio = aspectRatio;
  sprite.scale.set(baseScale * nodeScale, baseScale * nodeScale * aspectRatio, 1);
  return sprite;
}

export function buildTextureCache(
  nodes: Map<string, GraphNode>,
  opts: TextureBuildOptions,
): TextureCache {
  const cache: TextureCache = new Map();
  nodes.forEach(node => {
    const n = createCanvasTexture(node.label, false, false, opts);
    cache.set(node.label, {
      normal: n.texture,
      baseScale: n.baseScale,
      aspectRatio: n.aspectRatio,
    });
  });
  return cache;
}

export function disposeTextureCache(cache: TextureCache): void {
  cache.forEach(entry => {
    entry.normal.dispose();
    entry.highlighted?.dispose();
    entry.selected?.dispose();
  });
}

export function swapSpriteTexture(
  node: GraphNode,
  highlighted: boolean,
  selected: boolean,
  cache: TextureCache,
  opts: TextureBuildOptions,
): void {
  if (!node.textSprite) return;
  const cached = cache.get(node.label);
  if (!cached) return;

  let tex = cached.normal;
  if (selected) {
    if (!cached.selected) {
      const s = createCanvasTexture(node.label, false, true, opts);
      cached.selected = s.texture;
    }
    tex = cached.selected;
  } else if (highlighted) {
    if (!cached.highlighted) {
      const h = createCanvasTexture(node.label, true, false, opts);
      cached.highlighted = h.texture;
    }
    tex = cached.highlighted;
  }

  node.textSprite.material.map = tex;
  node.textSprite.material.needsUpdate = true;
}

export function getDepthFactor(
  wordCount: number,
  minW: number,
  maxW: number,
  style: DepthStyle,
): number {
  if (!style.depthSizeEnabled) return 1;
  const depthT = maxW !== minW ? (wordCount - minW) / (maxW - minW) : 0.5;
  const strength = (style.depthSizeStrength ?? 50) / 100;
  return 1 + strength * 0.5 * (1 - 2 * depthT);
}

export function refreshAllSpriteTextures(
  nodes: Map<string, GraphNode>,
  cache: TextureCache,
  hoveredLabel: string | null,
  selectedLabel: string | null,
  style: SpriteScaleStyle,
  minWords: number,
  maxWords: number,
  opts: TextureBuildOptions,
): void {
  nodes.forEach(node => {
    if (!node.textSprite) return;
    const cached = cache.get(node.label);
    if (!cached) return;
    const isHovered = hoveredLabel === node.label;
    const isSelected = selectedLabel === node.label;

    let tex = cached.normal;
    if (isSelected) {
      if (!cached.selected) {
        const s = createCanvasTexture(node.label, false, true, opts);
        cached.selected = s.texture;
      }
      tex = cached.selected;
    } else if (isHovered) {
      if (!cached.highlighted) {
        const h = createCanvasTexture(node.label, true, false, opts);
        cached.highlighted = h.texture;
      }
      tex = cached.highlighted;
    }

    node.textSprite.material.map = tex;
    node.textSprite.material.needsUpdate = true;
    node.textSprite.userData.baseScale = cached.baseScale;
    node.textSprite.userData.aspectRatio = cached.aspectRatio;
    const depthFactor = getDepthFactor(node.wordCount, minWords, maxWords, style);
    node.textSprite.scale.set(
      cached.baseScale * style.nodeScale * depthFactor,
      cached.baseScale * style.nodeScale * depthFactor * cached.aspectRatio,
      1,
    );
  });
}
