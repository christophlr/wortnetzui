import { evaluateHermite, computeCatmullRomTangent } from '../easing';
import type { PhysicsKeyframe } from '../components/timeline/types';

/**
 * Evaluate a physics parameter at `time` from pre-sorted keyframes using
 * Cubic Hermite splines. Returns null when the track has no keyframes.
 *
 * Canonical version — used by WortnetzContext (main thread) and the physics
 * worker (Phase 3). The Network3D local copy was removed in favour of this.
 *
 * Null-guard: prevTime/nextTime are null at segment endpoints; the guard
 * returns tangent 0 in those cases rather than passing null into
 * computeCatmullRomTangent (which would produce NaN).
 */
export function interpolatePhysicsParam(
  sorted: PhysicsKeyframe[],
  time: number,
  trackId?: string,
): number | null {
  if (sorted.length === 0) return null;
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const segDur = b.time - a.time;
      if (segDur === 0) return a.value;
      const tRaw = (time - a.time) / segDur;

      const prevTime = i > 0 ? sorted[i - 1].time : null;
      const prevVal = i > 0 ? sorted[i - 1].value : null;
      const nextTime = i + 2 < sorted.length ? sorted[i + 2].time : null;
      const nextVal = i + 2 < sorted.length ? sorted[i + 2].value : null;

      // Null guard: endpoint tangents default to 0, not NaN.
      const m0 = a.handleOut ?? (prevTime === null ? 0 : computeCatmullRomTangent(prevTime, prevVal, a.time, a.value, b.time, b.value));
      const m1 = b.handleIn ?? (nextTime === null ? 0 : computeCatmullRomTangent(a.time, a.value, b.time, b.value, nextTime, nextVal));

      const val = evaluateHermite(tRaw, a.value, m0, b.value, m1, segDur);
      // Gravity (phys-grv) can be negative; all other physics params are non-negative.
      return trackId === 'phys-grv' ? val : Math.max(0, val);
    }
  }
  return null;
}
