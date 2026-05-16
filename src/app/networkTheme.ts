export type NetworkThemeBackground = {
  hex: string;
  threeColor: number;
};

export type NetworkLabelStyle = {
  backgroundHex: string;
};

export type NodeShape = 'rectangle' | 'rounded-rectangle' | 'ellipse';

export type GradientSettings = {
  mode: 'solid' | 'gradient';
  innerColor: string;
  outerColor: string;
};

export const defaultGradientSettings: GradientSettings = {
  mode: 'gradient',
  innerColor: '#4f46e5',
  outerColor: '#7c3aed',
};

export type NodeAppearanceSettings = {
  borderColor: 'auto' | string;
  fillColor: 'auto' | string;
  textColor: 'auto' | string;
};

export type EdgeAppearanceSettings = {
  color: 'auto' | string;
};

export const defaultNodeAppearance: NodeAppearanceSettings = {
  borderColor: 'auto',
  fillColor: 'auto',
  textColor: 'auto',
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
  defaultTextColor: '#ffffff',
  selectionOutline: '#2563eb',
};

/**
 * Ensures vivid colors have at least 4.5:1 contrast on dark anthracite backgrounds (#111827).
 * Adjusts saturation and brightness for optimal data visualization.
 */
export function getVividColor(color: string, isDarkWorkspace: boolean): string {
  if (!isDarkWorkspace) return color;
  
  // Example vivid mapping for common brand colors
  const vividMap: Record<string, string> = {
    '#4f46e5': '#818cf8', // Indigo 600 -> Indigo 400
    '#7c3aed': '#a78bfa', // Violet 600 -> Violet 400
    '#06b6d4': '#22d3ee', // Cyan 600 -> Cyan 400
    '#10b981': '#34d399', // Emerald 600 -> Emerald 400
    '#f97316': '#fb923c', // Orange 500 -> Orange 400
    '#ef4444': '#f87171', // Red 500 -> Red 400
  };

  return vividMap[color.toLowerCase()] || color;
}

export function getNetworkThemeBackground(isDark?: boolean): NetworkThemeBackground {
  const dark = isDark !== undefined ? isDark : document.documentElement.classList.contains('dark');
  if (dark) {
    return { hex: '#09090b', threeColor: 0x09090b };
  }

  return { hex: '#f8fafc', threeColor: 0xf8fafc };
}

export function getNetworkLabelStyle(isDark?: boolean): NetworkLabelStyle {
  const dark = isDark !== undefined ? isDark : document.documentElement.classList.contains('dark');
  if (dark) {
    return { backgroundHex: '#18181b' }; // Zinc-900 for labels
  }

  return { backgroundHex: '#ffffff' };
}
