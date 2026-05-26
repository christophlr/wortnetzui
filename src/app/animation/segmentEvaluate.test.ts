import { describe, it, expect } from 'vitest';
import { evaluateKeyframeSegment } from './segmentEvaluate';

describe('segmentEvaluate — boundary conditions', () => {
  it('returns null on empty keyframes', () => {
    expect(evaluateKeyframeSegment([], 1.0, { val: kf => (kf as any).v })).toBeNull();
  });

  it('clamps to first value before start time', () => {
    const kfs = [{ time: 1.0, v: 100 }, { time: 3.0, v: 200 }];
    expect(evaluateKeyframeSegment(kfs, 0.0, { val: kf => kf.v })).toBe(100);
  });

  it('clamps to last value after end time', () => {
    const kfs = [{ time: 1.0, v: 100 }, { time: 3.0, v: 200 }];
    expect(evaluateKeyframeSegment(kfs, 4.0, { val: kf => kf.v })).toBe(200);
  });
});

describe('segmentEvaluate — interpolation modes', () => {
  const kfs = [
    { time: 0, v: 10, interpolation: 'linear' as const },
    { time: 2, v: 30, interpolation: 'hold' as const },
    { time: 4, v: 40 }
  ];

  it('handles linear mode', () => {
    const val = evaluateKeyframeSegment(kfs, 1.0, {
      val: kf => kf.v,
      interpolation: kf => kf.interpolation
    });
    expect(val).toBeCloseTo(20);
  });

  it('handles hold mode', () => {
    const val = evaluateKeyframeSegment(kfs, 3.0, {
      val: kf => kf.v,
      interpolation: kf => kf.interpolation
    });
    expect(val).toBe(30);
  });
});

describe('segmentEvaluate — Hermite & tension', () => {
  it('uses tension factors to scale tangents', () => {
    const kfs = [
      { time: 0, v: 0, tension: 0.5 },
      { time: 2, v: 10, tension: 0.5 }
    ];
    // With custom tangents at 0, 0
    const val = evaluateKeyframeSegment(kfs, 1.0, {
      val: kf => kf.v,
      handleOut: () => 10,
      handleIn: () => 10,
      tension: kf => kf.tension
    });
    // Expected tangent scales by 0.5 → m0=5, m1=5
    // hermite(0.5, 0, 5, 10, 5, 2)
    // h00 = 2(0.125) - 3(0.25) + 1 = 0.5
    // h10 = 0.125 - 2(0.25) + 0.5 = 0.125
    // h01 = -2(0.125) + 3(0.25) = 0.5
    // h11 = 0.125 - 0.25 = -0.125
    // result = 0.5 * 0 + 0.125 * 2 * 5 + 0.5 * 10 + (-0.125) * 2 * 5 = 5.0
    expect(val).toBeCloseTo(5.0);
  });
});
