// Recorder — samples worker-applied parameter values at ~30 Hz while
// recording, then downsamples to a sparse keyframe set on stop.
//
// Sampling rate may dip below 30 Hz when the worker is slow; downsample
// handles non-uniform spacing by keeping per-paramKey deltas above
// `epsilon` and always retaining the boundary samples.

import type { PhysicsKeyframe } from '../components/timeline/types';
import type { PhysicsParams } from '../graph';

export type Sample = { t: number; values: PhysicsParams };

export interface RecorderResult {
  range: [number, number];
  perTrack: Record<string, PhysicsKeyframe[]>;  // keyed by paramKey
}

const INTERVAL_S = 1 / 30; // ~33ms — target 30 Hz

export class Recorder {
  private samples: Sample[] = [];
  private startTime: number | null = null;
  private lastSampleTime = -Infinity;

  start(t: number) {
    this.samples = [];
    this.startTime = t;
    this.lastSampleTime = -Infinity;
  }

  sample(t: number, applied: PhysicsParams) {
    if (this.startTime === null) return;
    if (t - this.lastSampleTime < INTERVAL_S) return;
    this.samples.push({ t, values: { ...applied } });
    this.lastSampleTime = t;
  }

  /**
   * Stop recording and return per-paramKey keyframes covering [recordStart, lastSampleTime].
   * Returns null if start was never called or no samples were collected.
   */
  stop(): RecorderResult | null {
    if (this.startTime === null || this.samples.length === 0) {
      this.reset();
      return null;
    }
    const range: [number, number] = [this.startTime, this.samples[this.samples.length - 1].t];
    const perTrack: Record<string, PhysicsKeyframe[]> = {};
    const paramKeys = Object.keys(this.samples[0].values) as Array<keyof PhysicsParams>;
    for (const key of paramKeys) {
      perTrack[key as string] = downsample(this.samples, key as string);
    }
    this.reset();
    return { range, perTrack };
  }

  isActive(): boolean {
    return this.startTime !== null;
  }

  private reset() {
    this.samples = [];
    this.startTime = null;
    this.lastSampleTime = -Infinity;
  }
}

/**
 * Greedy threshold downsample. Keeps the first sample, drops subsequent samples
 * whose value differs from the last-kept by less than `epsilon`, always keeps
 * the last sample. Output is sorted by time (input is assumed sorted too).
 */
export function downsample(
  samples: Sample[],
  paramKey: string,
  epsilon = 0.01,
): PhysicsKeyframe[] {
  if (samples.length === 0) return [];
  const out: PhysicsKeyframe[] = [];
  let lastKept = -Infinity;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const v = (s.values as unknown as Record<string, number>)[paramKey];
    if (i === 0 || i === samples.length - 1 || Math.abs(v - lastKept) >= epsilon) {
      out.push({ time: s.t, value: v });
      lastKept = v;
    }
  }
  return out;
}
