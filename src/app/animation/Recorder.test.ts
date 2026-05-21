import { describe, it, expect } from 'vitest';
import { Recorder, downsample, type Sample } from './Recorder';

const PHYS = {
  repulsion: 1500, springK: 0.06, damping: 0.88, minSpeed: 0.5,
  linkDistance: 80, gravity: 0, turbulence: 0, verticalOrder: 0,
};

describe('downsample', () => {
  it('returns empty array for no samples', () => {
    expect(downsample([], 'repulsion')).toEqual([]);
  });

  it('keeps first and last samples even if values are identical', () => {
    const samples: Sample[] = [
      { t: 0, values: { ...PHYS, repulsion: 1000 } },
      { t: 1, values: { ...PHYS, repulsion: 1000 } },
      { t: 2, values: { ...PHYS, repulsion: 1000 } },
    ];
    const kfs = downsample(samples, 'repulsion');
    expect(kfs).toHaveLength(2);
    expect(kfs[0].time).toBe(0);
    expect(kfs[1].time).toBe(2);
  });

  it('drops middle samples within epsilon', () => {
    const samples: Sample[] = [
      { t: 0, values: { ...PHYS, repulsion: 1000 } },
      { t: 0.1, values: { ...PHYS, repulsion: 1000.001 } },
      { t: 0.2, values: { ...PHYS, repulsion: 1000.002 } },
      { t: 1.0, values: { ...PHYS, repulsion: 2000 } },
    ];
    const kfs = downsample(samples, 'repulsion', 0.01);
    expect(kfs.map(k => k.time)).toEqual([0, 1.0]);
  });

  it('keeps samples that exceed epsilon delta', () => {
    const samples: Sample[] = [
      { t: 0, values: { ...PHYS, repulsion: 1000 } },
      { t: 0.5, values: { ...PHYS, repulsion: 1500 } },
      { t: 1.0, values: { ...PHYS, repulsion: 2000 } },
    ];
    const kfs = downsample(samples, 'repulsion');
    expect(kfs).toHaveLength(3);
  });
});

describe('Recorder', () => {
  it('start + sample + stop produces per-paramKey keyframes covering the range', () => {
    const r = new Recorder();
    r.start(2.0);
    expect(r.isActive()).toBe(true);
    r.sample(2.0, { ...PHYS, repulsion: 1000 });
    r.sample(2.5, { ...PHYS, repulsion: 2000 });   // >epsilon → kept
    r.sample(3.0, { ...PHYS, repulsion: 2000.001 }); // within epsilon → dropped
    r.sample(3.5, { ...PHYS, repulsion: 3000 });
    const result = r.stop();
    expect(result).not.toBeNull();
    expect(result!.range).toEqual([2.0, 3.5]);
    expect(result!.perTrack.repulsion.length).toBeGreaterThanOrEqual(3);
    expect(r.isActive()).toBe(false);
  });

  it('stop returns null when start was never called', () => {
    const r = new Recorder();
    expect(r.stop()).toBeNull();
  });

  it('stop returns null when no samples collected', () => {
    const r = new Recorder();
    r.start(0);
    expect(r.stop()).toBeNull();
  });

  it('drops samples that arrive too close together (sub-30 Hz)', () => {
    const r = new Recorder();
    r.start(0);
    r.sample(0.000, { ...PHYS, repulsion: 1000 });
    r.sample(0.001, { ...PHYS, repulsion: 2000 }); // 1ms after — dropped
    r.sample(0.034, { ...PHYS, repulsion: 3000 }); // ~33ms — kept
    const result = r.stop();
    expect(result!.perTrack.repulsion.length).toBe(2);
    expect(result!.perTrack.repulsion[0].value).toBe(1000);
    expect(result!.perTrack.repulsion[1].value).toBe(3000);
  });
});
