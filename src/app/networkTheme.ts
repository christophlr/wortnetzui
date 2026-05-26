export type NetworkThemeBackground = {
  hex: string;
  threeColor: number;
};

export type NetworkLabelStyle = {
  backgroundHex: string;
};

export type NodeShape = 'rectangle' | 'rounded-rectangle' | 'ellipse';

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
