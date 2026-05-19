import { describe, it, expect } from 'vitest';
import { interpolatePhysicsParam } from './interpolatePhysicsParam';
import type { PhysicsKeyframe } from '../components/timeline/types';

const kf = (time: number, value: number, opts: Partial<PhysicsKeyframe> = {}): PhysicsKeyframe =>
  ({ time, value, mode: 'aligned', ...opts });

describe('interpolatePhysicsParam — boundary conditions', () => {
  it('returns null for an empty keyframe array', () => {
    expect(interpolatePhysicsParam([], 1.0)).toBeNull();
  });

  it('clamps to first value when time is before first keyframe', () => {
    const kfs = [kf(2, 100), kf(4, 200)];
    expect(interpolatePhysicsParam(kfs, 0)).toBe(100);
  });

  it('clamps to first value when time equals first keyframe', () => {
    const kfs = [kf(2, 100), kf(4, 200)];
    expect(interpolatePhysicsParam(kfs, 2)).toBe(100);
  });

  it('clamps to last value when time is after last keyframe', () => {
    const kfs = [kf(2, 100), kf(4, 200)];
    expect(interpolatePhysicsParam(kfs, 10)).toBe(200);
  });

  it('clamps to last value when time equals last keyframe', () => {
    const kfs = [kf(2, 100), kf(4, 200)];
    expect(interpolatePhysicsParam(kfs, 4)).toBe(200);
  });

  it('returns first value for a single keyframe regardless of time', () => {
    const kfs = [kf(5, 42)];
    expect(interpolatePhysicsParam(kfs, 0)).toBe(42);
    expect(interpolatePhysicsParam(kfs, 5)).toBe(42);
    expect(interpolatePhysicsParam(kfs, 100)).toBe(42);
  });
});

describe('interpolatePhysicsParam — interpolation', () => {
  it('interpolates between two keyframes at the midpoint', () => {
    // Linear case: Catmull-Rom tangent with only 2 points gives 0 slope at endpoints
    // so Hermite degenerates to smooth S-curve but midpoint is roughly (a+b)/2
    const kfs = [kf(0, 0), kf(2, 2)];
    const result = interpolatePhysicsParam(kfs, 1);
    expect(result).not.toBeNull();
    // Hermite mid-value with zero tangents: evaluateHermite(0.5, 0, 0, 2, 0, 2) = 1.0
    expect(result!).toBeCloseTo(1.0, 5);
  });

  it('returns exact boundary values at keyframe times', () => {
    const kfs = [kf(0, 10), kf(1, 20), kf(2, 30)];
    expect(interpolatePhysicsParam(kfs, 0)).toBe(10);
    expect(interpolatePhysicsParam(kfs, 2)).toBe(30);
  });

  it('honors hold interpolation', () => {
    const kfs = [kf(0, 10, { interpolation: 'hold' }), kf(2, 30)];
    expect(interpolatePhysicsParam(kfs, 1)).toBe(10);
  });

  it('honors linear interpolation', () => {
    const kfs = [kf(0, 10, { interpolation: 'linear' }), kf(2, 30)];
    expect(interpolatePhysicsParam(kfs, 1)).toBe(20);
  });
});

describe('interpolatePhysicsParam — null guard (A5 bug fix)', () => {
  it('does NOT produce NaN when evaluating at segment endpoints (null tangent guard)', () => {
    // Two keyframes: first segment has prevTime=null, last segment has nextTime=null.
    // The buggy Network3D copy passed null into computeCatmullRomTangent → NaN.
    const kfs = [kf(0, 100), kf(5, 200)];
    const result = interpolatePhysicsParam(kfs, 2.5);
    expect(result).not.toBeNull();
    expect(Number.isNaN(result!)).toBe(false);
    expect(Number.isFinite(result!)).toBe(true);
  });

  it('does NOT produce NaN for a three-keyframe middle segment', () => {
    const kfs = [kf(0, 0), kf(1, 10), kf(2, 5)];
    const result = interpolatePhysicsParam(kfs, 0.5);
    expect(result).not.toBeNull();
    expect(Number.isNaN(result!)).toBe(false);
  });

  it('respects explicit handleOut/handleIn overrides', () => {
    // With handleOut=0, handleIn=0 the segment should be flat (linear Hermite = straight line)
    const kfs = [kf(0, 0, { handleOut: 0 }), kf(2, 2, { handleIn: 0 })];
    const result = interpolatePhysicsParam(kfs, 1);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(1.0, 5);
  });
});

describe('interpolatePhysicsParam — value clamping', () => {
  it('clamps negative Hermite results to 0 for non-gravity tracks', () => {
    // Force an undershoot below zero using explicit handles (same curve as gravity test).
    const kfs = [kf(0, 5, { handleOut: -60 }), kf(1, 5)];
    for (let t = 0; t <= 1; t += 0.05) {
      const v = interpolatePhysicsParam(kfs, t);
      if (v !== null) {
        expect(v).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('allows negative values for the gravity track (phys-grv)', () => {
    // Force an undershoot below zero: strong negative handleOut from a non-zero value
    // causes the cubic Hermite to dip below 0 before returning to the endpoint value.
    // handleOut=-60 on a 1s segment means value drops ~8.9 units at the cubic's nadir.
    const kfs = [kf(0, 5, { handleOut: -60 }), kf(1, 5)];
    let sawNegative = false;
    for (let t = 0.1; t < 1; t += 0.05) {
      const v = interpolatePhysicsParam(kfs, t, 'phys-grv');
      if (v !== null && v < 0) sawNegative = true;
    }
    expect(sawNegative).toBe(true);
  });

  it('does not clamp non-gravity tracks even when named differently', () => {
    // phys-dmp (damping), phys-rep (repulsion) etc should all clamp to 0.
    const kfs = [kf(0, 5, { handleOut: -60 }), kf(1, 5)];
    for (const trackId of ['phys-dmp', 'phys-rep', 'phys-lnk', undefined]) {
      for (let t = 0.05; t < 1; t += 0.1) {
        const v = interpolatePhysicsParam(kfs, t, trackId);
        if (v !== null) {
          expect(v).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
