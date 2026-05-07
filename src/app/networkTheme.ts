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
  hueStart: 30,
  hueEnd: 0,
  saturation: 100,
  lightness: 65,
};

export function getNetworkThemeBackground(): NetworkThemeBackground {
  if (document.documentElement.classList.contains('dark')) {
    return { hex: '#1a1a1a', threeColor: 0x1a1a1a };
  }

  return { hex: '#d5d5d5', threeColor: 0xd5d5d5 };
}

export function getNetworkLabelStyle(): NetworkLabelStyle {
  if (document.documentElement.classList.contains('dark')) {
    return { backgroundHex: '#0a0b0d' };
  }

  return { backgroundHex: '#ffffff' };
}
