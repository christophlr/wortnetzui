export function evaluateHermite(t: number, p0: number, m0: number, p1: number, m1: number, duration: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  
  return h00 * p0 + h10 * duration * m0 + h01 * p1 + h11 * duration * m1;
}

export function computeCatmullRomTangent(
  prevTime: number | null, prevVal: number | null,
  currTime: number, currVal: number,
  nextTime: number | null, nextVal: number | null
): number {
  if (prevTime === null && nextTime === null) return 0;
  
  if (prevTime === null && nextTime !== null && nextVal !== null) {
    if (nextTime === currTime) return 0;
    return (nextVal - currVal) / (nextTime - currTime);
  }
  
  if (nextTime === null && prevTime !== null && prevVal !== null) {
    if (currTime === prevTime) return 0;
    return (currVal - prevVal) / (currTime - prevTime);
  }
  
  if (prevTime !== null && prevVal !== null && nextTime !== null && nextVal !== null) {
    if (nextTime === prevTime) return 0;
    return (nextVal - prevVal) / (nextTime - prevTime);
  }
  
  return 0;
}

// Cubic bezier easing (used by Network3D camera/physics keyframes).
// outWeight/inWeight in [0,1]: 0 = linear, 0.33 = standard, 1 = extreme.
function _bezierX(s: number, x1: number, x2: number): number {
  const inv = 1 - s;
  return 3 * inv * inv * s * x1 + 3 * inv * s * s * x2 + s * s * s;
}

export function solveBezierEasing(t: number, outWeight: number, inWeight: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const x1 = Math.max(0, Math.min(1, outWeight));
  const x2 = Math.max(0, Math.min(1, 1 - inWeight));
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (_bezierX(mid, x1, x2) < t) lo = mid; else hi = mid;
  }
  const s = (lo + hi) / 2;
  return s * s * (3 - 2 * s);
}

export function computeAutoWeights(
  currDur: number,
  prevDur: number | null,
  nextDur: number | null
): { outWeight: number; inWeight: number } {
  const outWeight = prevDur === null ? 0.33 : 0.33 * Math.min(1, currDur / prevDur);
  const inWeight  = nextDur === null ? 0.33 : 0.33 * Math.min(1, nextDur  / currDur);
  return { outWeight, inWeight };
}

export function segmentBezierPath(outW: number, inW: number, w: number, h: number): string {
  const ow = Math.max(0, Math.min(1, outW)) * w;
  const iw = (1 - Math.max(0, Math.min(1, inW))) * w;
  return `M 0 ${h} C ${ow} ${h} ${iw} 0 ${w} 0`;
}

// Standard easing functions (0-1 normalized time)
export function applyEasing(t: number, type: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut'): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  
  switch (type) {
    case 'linear':
      return t;
    case 'easeInOut':
      // Smooth cubic ease-in-out
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    case 'easeIn':
      // Cubic ease-in
      return t * t * t;
    case 'easeOut':
      // Cubic ease-out
      return 1 - Math.pow(1 - t, 3);
    default:
      return t;
  }
}
