// Pure per-frame parameter evaluation. Used by the physics worker; extracted
// here so it can be unit-tested without spinning up a worker.
//
// For each param key in `sliderParams`, computes a target value:
//   target = (track.keyframes ⇒ Hermite eval) ?? sliderParams[key]   (+ LFO if modulator present)
// Then glides toward the target:
//   applied[key] = applied[key] + (target − applied[key]) · min(1, dt / glide)
//   (or applied[key] = target  when glide ≤ 0).
//
// `applied` is mutated in place AND returned so the worker can keep a stable
// reference and avoid per-frame allocation.

import { interpolatePhysicsParam } from './interpolatePhysicsParam';
import { evalLfo, type Modulator } from './Modulator';
import type { PhysicsKeyframe } from '../components/timeline/types';

export interface WorkerTrack {
  trackId: string;             // forwarded to interpolatePhysicsParam (gravity exception)
  keyframes: PhysicsKeyframe[];
  glide: number;
  modulator?: Modulator;
}

export type PhysicsParamsLike = Record<string, number>;

export function evaluateTracks(
  tracks: Record<string, WorkerTrack | undefined>,
  sliderParams: PhysicsParamsLike,
  time: number,
  dt: number,
  applied: PhysicsParamsLike,
  wallTime: number = 0,
): PhysicsParamsLike {
  for (const key of Object.keys(sliderParams)) {
    const tr = tracks[key];
    const slider = sliderParams[key];
    const interp = tr && tr.keyframes.length > 0
      ? interpolatePhysicsParam(tr.keyframes, time, tr.trackId)
      : null;
    const base = interp !== null ? interp : slider;
    const target = tr?.modulator ? base + evalLfo(tr.modulator, wallTime) : base;
    const glide = tr?.glide ?? 0;
    if (glide > 0) {
      const blend = Math.min(1, dt / glide);
      const cur = applied[key] ?? slider;
      applied[key] = cur + (target - cur) * blend;
    } else {
      applied[key] = target;
    }
  }
  return applied;
}
