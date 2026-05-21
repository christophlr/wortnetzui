// Track<T> — the canonical timeline animation primitive.
//
// A track owns keyframes for a single parameter, plus per-track tuning:
// `glide` (seconds to settle toward the target after a keyframe transition)
// and an optional `modulator` (LFO). The worker reads these per-step to
// compute the param's `applied` value; the main thread keeps `physicsKeyframes`
// shape unchanged (load-bearing across handlers), so this type wraps them
// at the worker-protocol + serialization boundary.
//
// Generic on T for Phase 6 (camera vectors, color). Phase 3 only uses T=number.

import type { PhysicsKeyframe } from '../components/timeline/types';
import type { Modulator } from './Modulator';

export type Track<T = number> = {
  id: string;
  paramKey: string;
  keyframes: PhysicsKeyframe[];
  glide: number;            // seconds; 0 = instant snap (default)
  modulator?: Modulator;
};

export function createTrack(id: string, paramKey: string, keyframes: PhysicsKeyframe[] = []): Track {
  return { id, paramKey, keyframes, glide: 0 };
}

export function isDefaultTrack(t: Track): boolean {
  return t.glide === 0 && t.modulator === undefined;
}

export type TrackMeta = { glide: number; modulator?: Modulator };

export const DEFAULT_TRACK_META: TrackMeta = { glide: 0 };
