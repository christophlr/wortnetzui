import { evaluateHermite, computeCatmullRomTangent } from '../easing';

export interface KeyframeExtractors<T> {
  val: (kf: T) => number;
  handleIn?: (kf: T) => number | undefined;
  handleOut?: (kf: T) => number | undefined;
  tension?: (kf: T) => number;
  interpolation?: (kf: T) => 'auto' | 'linear' | 'hold' | undefined;
  clampNonNegative?: boolean;
}

/**
 * Evaluate a generic keyframe segment at `time` from pre-sorted keyframes.
 * Supports cubic Hermite splines (with tension), linear, and hold interpolation.
 */
export function evaluateKeyframeSegment<T>(
  sorted: T[],
  time: number,
  extract: KeyframeExtractors<T>,
): number | null {
  if (sorted.length === 0) return null;

  // Extract time since it is a universal keyframe property
  const getTime = (kf: T): number => {
    if (kf && typeof kf === 'object' && 'time' in kf) {
      return (kf as any).time as number;
    }
    return 0;
  };

  const t0 = getTime(sorted[0]);
  if (time <= t0) {
    const aVal = extract.val(sorted[0]);
    return extract.clampNonNegative ? Math.max(0, aVal) : aVal;
  }

  const tLast = getTime(sorted[sorted.length - 1]);
  if (time >= tLast) {
    const lastVal = extract.val(sorted[sorted.length - 1]);
    return extract.clampNonNegative ? Math.max(0, lastVal) : lastVal;
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const ta = getTime(a);
    const tb = getTime(b);

    if (time >= ta && time <= tb) {
      const segDur = tb - ta;
      if (segDur === 0) {
        const aVal = extract.val(a);
        return extract.clampNonNegative ? Math.max(0, aVal) : aVal;
      }
      const tRaw = (time - ta) / segDur;

      const aVal = extract.val(a);
      const bVal = extract.val(b);

      const interp = extract.interpolation?.(a) ?? 'auto';

      if (interp === 'hold') {
        return extract.clampNonNegative ? Math.max(0, aVal) : aVal;
      }

      if (interp === 'linear') {
        const val = aVal + (bVal - aVal) * tRaw;
        return extract.clampNonNegative ? Math.max(0, val) : val;
      }

      // Auto / Hermite interpolation
      const prevTime = i > 0 ? getTime(sorted[i - 1]) : null;
      const prevVal = i > 0 ? extract.val(sorted[i - 1]) : null;
      const nextTime = i + 2 < sorted.length ? getTime(sorted[i + 2]) : null;
      const nextVal = i + 2 < sorted.length ? extract.val(sorted[i + 2]) : null;

      const m0Raw = extract.handleOut?.(a) ?? (prevTime === null ? 0 : computeCatmullRomTangent(prevTime, prevVal, ta, aVal, tb, bVal));
      const m1Raw = extract.handleIn?.(b) ?? (nextTime === null ? 0 : computeCatmullRomTangent(ta, aVal, tb, bVal, nextTime, nextVal));

      const tensionA = extract.tension?.(a) ?? 1;
      const tensionB = extract.tension?.(b) ?? 1;

      const m0 = m0Raw * tensionA;
      const m1 = m1Raw * tensionB;

      const val = evaluateHermite(tRaw, aVal, m0, bVal, m1, segDur);
      return extract.clampNonNegative ? Math.max(0, val) : val;
    }
  }
  return null;
}
