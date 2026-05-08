export type NetworkThemeBackground = {
  hex: string;
  threeColor: number;
};

export type NetworkLabelStyle = {
  backgroundHex: string;
};

export type NetworkColorSettings = {
  hueStart: number;
  hueEnd: number;
  saturation: number;
  lightness: number;
};

export const defaultNetworkColorSettings: NetworkColorSettings = {
  hueStart: 180,
  hueEnd: 120,
  saturation: 75,
  lightness: 65,
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

  return { hex: '#d5d5d5', threeColor: 0xd5d5d5 };
}

export function getNetworkLabelStyle(isDark?: boolean): NetworkLabelStyle {
  const dark = isDark !== undefined ? isDark : document.documentElement.classList.contains('dark');
  if (dark) {
    return { backgroundHex: '#0a0b0d' };
  }

  return { backgroundHex: '#ffffff' };
}
