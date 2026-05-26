export type NetworkThemeBackground = {
  hex: string;
  threeColor: number;
};

export type NetworkLabelStyle = {
  backgroundHex: string;
};

export type NodeShapeKind =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'ellipse'
  | 'triangle'
  | 'hexagon'
  | 'octagon'
  | 'star';

export type NodeShape =
  | { kind: 'rectangle' }
  | { kind: 'rounded-rectangle' }
  | { kind: 'ellipse' }
  | { kind: 'triangle' }
  | { kind: 'hexagon' }
  | { kind: 'octagon' }
  | { kind: 'star'; arms: number; innerRatio: number };

export const DEFAULT_STAR_SHAPE: NodeShape = { kind: 'star', arms: 5, innerRatio: 0.4 };
export const DEFAULT_NODE_SHAPE: NodeShape = { kind: 'rectangle' };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const clampInt = (value: number, min: number, max: number) => Math.round(clamp(value, min, max));

export function normalizeNodeShape(shape?: NodeShape | NodeShapeKind | null): NodeShape {
  if (!shape) return DEFAULT_NODE_SHAPE;
  if (typeof shape === 'string') {
    if (shape === 'star') return { ...DEFAULT_STAR_SHAPE };
    return { kind: shape };
  }
  if (shape.kind === 'star') {
    return {
      kind: 'star',
      arms: clampInt(shape.arms ?? DEFAULT_STAR_SHAPE.arms, 3, 12),
      innerRatio: clamp(shape.innerRatio ?? DEFAULT_STAR_SHAPE.innerRatio, 0.2, 0.8),
    };
  }
  return { kind: shape.kind };
}

export function serializeNodeShape(shape: NodeShape): string {
  return JSON.stringify(normalizeNodeShape(shape));
}

export type EdgeAppearanceSettings = {
  color: 'auto' | string;
};

export const defaultEdgeAppearance: EdgeAppearanceSettings = {
  color: 'auto',
};

export interface GizmoAxisColors { pos: string; neg: string }

export const GIZMO_COLORS: Record<'x' | 'y' | 'z', GizmoAxisColors> = {
  x: { pos: '#ef4444', neg: 'rgba(239,68,68,0.38)' },
  y: { pos: '#22c55e', neg: 'rgba(34,197,94,0.38)' },
  z: { pos: '#60a5fa', neg: 'rgba(96,165,250,0.38)' },
};

export const SCENE_COLORS = {
  editNodeColor: '#6b7280',
  selectionOutline: '#2563eb',
};

export function getNetworkThemeBackground(isDark?: boolean): NetworkThemeBackground {
  const dark = isDark !== undefined ? isDark : document.documentElement.classList.contains('dark');
  if (dark) {
    return { hex: '#09090b', threeColor: 0x09090b };
  }

  return { hex: '#f8fafc', threeColor: 0xf8fafc };
}

export function getNetworkLabelStyle(isDark?: boolean): NetworkLabelStyle {
  // Always return '#ffffff' to ensure node shapes are filled with the vibrant gradient color when tinted on the GPU
  return { backgroundHex: '#ffffff' };
}
