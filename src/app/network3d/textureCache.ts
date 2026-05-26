import * as THREE from 'three';
import { getNetworkLabelStyle, normalizeNodeShape, serializeNodeShape, type NodeShape, SCENE_COLORS } from '../networkTheme';
import type { GraphNode } from '../graph';

export interface LayoutMetrics {
  logicalWidth: number;
  logicalHeight: number;
  words: string[];
}

export interface TextureCacheEntry {
  normal: THREE.Texture;
  highlighted?: THREE.Texture;
  selected?: THREE.Texture;
  baseScale: number;
  aspectRatio: number;
  layout: LayoutMetrics;
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
const SHAPE_KEY_SEPARATOR = '::';

const SHAPE_AREA_SCALE: Record<NodeShape['kind'], number> = {
  rectangle: 1,
  'rounded-rectangle': 1,
  ellipse: 1,
  triangle: 1.05,
  hexagon: 1.03,
  octagon: 1.03,
  star: 1.15,
};

export function getTextureCacheKey(label: string, shape: NodeShape): string {
  return `${label}${SHAPE_KEY_SEPARATOR}${serializeNodeShape(shape)}`;
}

export function getTextureCacheLabel(key: string): string {
  const splitIndex = key.indexOf(SHAPE_KEY_SEPARATOR);
  return splitIndex === -1 ? key : key.slice(0, splitIndex);
}

function drawPolygonPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  sides: number,
  rotation = -Math.PI / 2,
) {
  const step = (Math.PI * 2) / sides;
  ctx.moveTo(cx + Math.cos(rotation) * rx, cy + Math.sin(rotation) * ry);
  for (let i = 1; i < sides; i++) {
    const angle = rotation + step * i;
    ctx.lineTo(cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry);
  }
  ctx.closePath();
}

function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  arms: number,
  innerRatio: number,
  rotation = -Math.PI / 2,
) {
  const totalPoints = arms * 2;
  const step = Math.PI / arms;
  for (let i = 0; i < totalPoints; i++) {
    const isOuter = i % 2 === 0;
    const scale = isOuter ? 1 : innerRatio;
    const angle = rotation + i * step;
    const x = cx + Math.cos(angle) * rx * scale;
    const y = cy + Math.sin(angle) * ry * scale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawShapePath(
  ctx: CanvasRenderingContext2D,
  shape: NodeShape,
  cx: number,
  cy: number,
  width: number,
  height: number,
  cornerRadius = 0,
) {
  if (shape.kind === 'ellipse') {
    ctx.ellipse(cx, cy, width / 2, height / 2, 0, 0, Math.PI * 2);
    return;
  }
  if (shape.kind === 'rounded-rectangle') {
    ctx.roundRect(cx - width / 2, cy - height / 2, width, height, cornerRadius);
    return;
  }
  if (shape.kind === 'rectangle') {
    if (cornerRadius > 0) {
      ctx.roundRect(cx - width / 2, cy - height / 2, width, height, cornerRadius);
      return;
    }
    ctx.rect(cx - width / 2, cy - height / 2, width, height);
    return;
  }
  if (shape.kind === 'triangle') {
    drawPolygonPath(ctx, cx, cy, width / 2, height / 2, 3);
    return;
  }
  if (shape.kind === 'hexagon') {
    drawPolygonPath(ctx, cx, cy, width / 2, height / 2, 6);
    return;
  }
  if (shape.kind === 'octagon') {
    drawPolygonPath(ctx, cx, cy, width / 2, height / 2, 8);
    return;
  }
  drawStarPath(ctx, cx, cy, width / 2, height / 2, shape.arms, shape.innerRatio);
}

function computeLayout(text: string): LayoutMetrics {
  const words = text.split(' ');
  const fontSize = 28;
  const lineHeight = fontSize * 1.2;
  const padding = 14;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  const maxWidth = Math.max(...words.map(w => context.measureText(w).width));
  return {
    logicalWidth: maxWidth + padding * 2,
    logicalHeight: words.length * lineHeight + padding * 2,
    words,
  };
}

export function createCanvasTextureFromLayout(
  layout: LayoutMetrics,
  highlighted: boolean,
  selected: boolean,
  opts: TextureBuildOptions,
): { texture: THREE.Texture; baseScale: number; aspectRatio: number } {
  const { dark, nodeShape, nodeBorderWidth } = opts;
  const shape = normalizeNodeShape(nodeShape);
  const effectiveBorderColor = EDIT_NODE_COLOR;
  const effectiveTextColor = EDIT_NODE_COLOR;

  const { logicalWidth, logicalHeight, words } = layout;
  const fontSize = 28;
  const lineHeight = fontSize * 1.2;
  const padding = 14;
  const pixelRatio = 3;
  const shapeScale = SHAPE_AREA_SCALE[shape.kind] ?? 1;
  const shapeWidth = logicalWidth * shapeScale;
  const shapeHeight = logicalHeight * shapeScale;

  const canvasLogicalWidth = shapeWidth + OUTLINE_MARGIN * 2;
  const canvasLogicalHeight = shapeHeight + OUTLINE_MARGIN * 2;

  const canvas = document.createElement('canvas');
  canvas.width = canvasLogicalWidth * pixelRatio;
  canvas.height = canvasLogicalHeight * pixelRatio;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.scale(pixelRatio, pixelRatio);

  const bw = nodeBorderWidth;
  const fillColor = getNetworkLabelStyle(dark).backgroundHex;
  const cx = OUTLINE_MARGIN + shapeWidth / 2;
  const cy = OUTLINE_MARGIN + shapeHeight / 2;
  const textOffsetY = OUTLINE_MARGIN + (shapeHeight - logicalHeight) / 2;
  const fillRadius = shape.kind === 'rounded-rectangle' ? 6 : 0;

  context.save();
  context.beginPath();
  drawShapePath(context, shape, cx, cy, shapeWidth, shapeHeight, fillRadius);
  context.clip();

  context.fillStyle = fillColor;
  context.beginPath();
  drawShapePath(context, shape, cx, cy, shapeWidth, shapeHeight, fillRadius);
  context.fill();
  context.restore();

  if (!highlighted && !selected) {
    if (bw > 0) {
      context.strokeStyle = effectiveBorderColor;
      context.lineWidth = bw;
      context.beginPath();
      const borderRadius = shape.kind === 'rectangle' ? 3 + bw / 2 : 6;
      drawShapePath(context, shape, cx, cy, shapeWidth + bw, shapeHeight + bw, borderRadius);
      context.stroke();
    }
  } else {
    const pathW = shapeWidth + 2 * (OUTLINE_GAP + OUTLINE_STROKE / 2);
    const pathH = shapeHeight + 2 * (OUTLINE_GAP + OUTLINE_STROKE / 2);
    context.strokeStyle = SCENE_COLORS.selectionOutline;
    context.lineWidth = OUTLINE_STROKE;
    context.beginPath();
    const outlineRadius = shape.kind === 'rectangle' ? 5 : 8;
    drawShapePath(context, shape, cx, cy, pathW, pathH, outlineRadius);
    context.stroke();
  }

  context.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  context.fillStyle = effectiveTextColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  words.forEach((word, i) => {
    const y = textOffsetY + padding + lineHeight / 2 + i * lineHeight;
    context.fillText(word, cx, y);
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

export function createCanvasTexture(
  text: string,
  highlighted: boolean,
  selected: boolean,
  opts: TextureBuildOptions,
): { texture: THREE.Texture; baseScale: number; aspectRatio: number; layout: LayoutMetrics } {
  const layout = computeLayout(text);
  const { texture, baseScale, aspectRatio } = createCanvasTextureFromLayout(layout, highlighted, selected, opts);
  return { texture, baseScale, aspectRatio, layout };
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
    cache.set(getTextureCacheKey(node.label, opts.nodeShape), {
      normal: n.texture,
      baseScale: n.baseScale,
      aspectRatio: n.aspectRatio,
      layout: n.layout,
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
  const cached = cache.get(getTextureCacheKey(node.label, opts.nodeShape));
  if (!cached) return;

  let tex = cached.normal;
  if (selected) {
    if (!cached.selected) {
      cached.selected = createCanvasTextureFromLayout(cached.layout, false, true, opts).texture;
    }
    tex = cached.selected;
  } else if (highlighted) {
    if (!cached.highlighted) {
      cached.highlighted = createCanvasTextureFromLayout(cached.layout, true, false, opts).texture;
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
        cached.selected = createCanvasTextureFromLayout(cached.layout, false, true, opts).texture;
      }
      tex = cached.selected;
    } else if (isHovered) {
      if (!cached.highlighted) {
        cached.highlighted = createCanvasTextureFromLayout(cached.layout, true, false, opts).texture;
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
