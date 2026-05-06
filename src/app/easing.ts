export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'strongIn' | 'strongOut' | 'bounce' | 'hold';

export interface EasingPreset {
  id: EasingType;
  label: string;
  color: string;
}

export const EASING_PRESETS: EasingPreset[] = [
  { id: 'linear',    label: 'Linear',     color: '#9ca3af' },
  { id: 'easeIn',    label: 'Ease In',    color: '#60a5fa' },
  { id: 'easeOut',   label: 'Ease Out',   color: '#a78bfa' },
  { id: 'easeInOut', label: 'Smooth',     color: '#22d3ee' },
  { id: 'strongIn',  label: 'Strong In',  color: '#fbbf24' },
  { id: 'strongOut', label: 'Strong Out', color: '#34d399' },
  { id: 'bounce',    label: 'Bounce',     color: '#fb923c' },
  { id: 'hold',      label: 'Hold',       color: '#f87171' },
];

export function applyEasing(t: number, type: EasingType = 'easeInOut'): number {
  switch (type) {
    case 'linear':    return t;
    case 'easeIn':    return t * t;
    case 'easeOut':   return 1 - (1 - t) * (1 - t);
    case 'easeInOut': return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
    case 'strongIn':  return t * t * t;
    case 'strongOut': return 1 - Math.pow(1 - t, 3);
    case 'bounce': {
      if (t < 1/2.75) return 7.5625*t*t;
      if (t < 2/2.75) { const u = t - 1.5/2.75; return 7.5625*u*u + 0.75; }
      if (t < 2.5/2.75) { const u = t - 2.25/2.75; return 7.5625*u*u + 0.9375; }
      const u = t - 2.625/2.75; return 7.5625*u*u + 0.984375;
    }
    case 'hold': return t >= 1 ? 1 : 0;
    default:          return t;
  }
}

export function easingCurvePath(type: EasingType, w: number, h: number): string {
  const pad = h * 0.12;
  if (type === 'hold') {
    const y0 = (h - pad).toFixed(1);
    const y1 = pad.toFixed(1);
    return `M 0 ${y0} L ${w} ${y0} L ${w} ${y1}`;
  }
  const pts = 32;
  let d = '';
  for (let i = 0; i <= pts; i++) {
    const t = i / pts;
    const v = applyEasing(t, type);
    const x = (t * w).toFixed(1);
    const y = (h - pad - v * (h - 2 * pad)).toFixed(1);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}
