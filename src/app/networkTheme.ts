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

export function getNetworkThemeBackground(isDark?: boolean): NetworkThemeBackground {
  const dark = isDark !== undefined ? isDark : document.documentElement.classList.contains('dark');
  if (dark) {
    return { hex: '#1a1a1a', threeColor: 0x1a1a1a };
  }

  return { hex: '#c8c8c8', threeColor: 0xc8c8c8 };
}

export function getNetworkLabelStyle(isDark?: boolean): NetworkLabelStyle {
  const dark = isDark !== undefined ? isDark : document.documentElement.classList.contains('dark');
  if (dark) {
    return { backgroundHex: '#0a0b0d' };
  }

  return { backgroundHex: '#ffffff' };
}
