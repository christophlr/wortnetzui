// Cubic bezier easing with draggable handles.
// Each keyframe stores outWeight (ease-out) and inWeight (ease-in), both in [0, 0.5].
// 0 = linear, 0.33 = standard smooth, 0.5 = maximum ease.
//
// The bezier is cubic-bezier(outWeight, 0, 1-inWeight, 1):
//   P0=(0,0)  P1=(outWeight,0)  P2=(1-inWeight,1)  P3=(1,1)
// Y simplifies to smoothstep(s); X is solved for s via binary search.

function _bezierX(s: number, x1: number, x2: number): number {
  const inv = 1 - s;
  return 3 * inv * inv * s * x1 + 3 * inv * s * s * x2 + s * s * s;
}

export function solveBezierEasing(t: number, outWeight: number, inWeight: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const x1 = Math.max(0, Math.min(0.5, outWeight));
  const x2 = Math.max(0.5, Math.min(1, 1 - inWeight));
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (_bezierX(mid, x1, x2) < t) lo = mid; else hi = mid;
  }
  const s = (lo + hi) / 2;
  return s * s * (3 - 2 * s); // smoothstep
}

// SVG cubic-bezier path for the easing track.
// w/h are the segment viewBox dimensions.
// outW = outWeight of the left keyframe, inW = inWeight of the right keyframe.
export function segmentBezierPath(outW: number, inW: number, w: number, h: number): string {
  const ow = Math.max(0, Math.min(0.5, outW)) * w;
  const iw = (1 - Math.max(0, Math.min(0.5, inW))) * w;
  return `M 0 ${h} C ${ow} ${h} ${iw} 0 ${w} 0`;
}
