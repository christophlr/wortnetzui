import { evaluateKeyframeSegment } from './segmentEvaluate';
import type { PhysicsKeyframe } from '../components/timeline/types';

/**
 * Evaluate a physics parameter at `time` from pre-sorted keyframes using
 * Cubic Hermite splines. Returns null when the track has no keyframes.
 *
 * Delegates to the unified evaluateKeyframeSegment helper.
 */
export function interpolatePhysicsParam(
  sorted: PhysicsKeyframe[],
  time: number,
  trackId?: string,
): number | null {
  return evaluateKeyframeSegment(sorted, time, {
    val: kf => kf.value,
    handleIn: kf => kf.handleIn,
    handleOut: kf => kf.handleOut,
    interpolation: kf => kf.interpolation,
    clampNonNegative: trackId !== 'phys-grv',
  });
}

