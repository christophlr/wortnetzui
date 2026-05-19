import { describe, it, expect } from 'vitest';
import { evaluateTracks, type WorkerTrack } from './evaluateTracks';

const SLIDER = {
  repulsion: 1500,
  springK: 0.06,
  damping: 0.88,
  minSpeed: 0.5,
  linkDistance: 80,
  gravity: 0,
  turbulence: 0,
  verticalOrder: 0,
  pulse: 0,
};

function fresh() {
  return { ...SLIDER };
}

describe('evaluateTracks — no tracks', () => {
  it('falls back to sliderParams when tracks map is empty', () => {
    const applied = fresh();
    evaluateTracks({}, SLIDER, 1.0, 0.016, applied);
    expect(applied).toEqual(SLIDER);
  });

  it('falls back to sliderParams when a track has no keyframes', () => {
    const tr: WorkerTrack = { trackId: 'phys-rep', keyframes: [], glide: 0 };
    const applied = fresh();
    evaluateTracks({ repulsion: tr }, SLIDER, 1.0, 0.016, applied);
    expect(applied.repulsion).toBe(1500);
  });
});

describe('evaluateTracks — keyframe override', () => {
  it('uses interpolated keyframe value when present', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-rep',
      keyframes: [{ time: 0, value: 1000 }, { time: 2, value: 3000 }],
      glide: 0,
    };
    const applied = fresh();
    evaluateTracks({ repulsion: tr }, SLIDER, 1.0, 0.016, applied);
    // Hermite at midpoint between two keyframes ≈ 2000
    expect(applied.repulsion).toBeGreaterThan(1500);
    expect(applied.repulsion).toBeLessThan(3000);
  });

  it('clamps non-gravity tracks to non-negative', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-spk',
      keyframes: [{ time: 0, value: -100 }, { time: 2, value: -100 }],
      glide: 0,
    };
    const applied = fresh();
    evaluateTracks({ springK: tr }, SLIDER, 1.0, 0.016, applied);
    expect(applied.springK).toBe(0);
  });

  it('allows gravity to be negative (gravity exception)', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-grv',
      keyframes: [{ time: 0, value: -3 }, { time: 2, value: -3 }],
      glide: 0,
    };
    const applied = fresh();
    evaluateTracks({ gravity: tr }, SLIDER, 1.0, 0.016, applied);
    expect(applied.gravity).toBe(-3);
  });
});

describe('evaluateTracks — glide', () => {
  it('with glide=0, snaps instantly to target', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-rep',
      keyframes: [{ time: 0, value: 3000 }, { time: 2, value: 3000 }],
      glide: 0,
    };
    const applied = { ...SLIDER, repulsion: 0 };
    evaluateTracks({ repulsion: tr }, SLIDER, 1.0, 0.016, applied);
    expect(applied.repulsion).toBeCloseTo(3000, 6);
  });

  it('with glide=1s and dt=0.5s, advances halfway to target', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-rep',
      keyframes: [{ time: 0, value: 2000 }, { time: 2, value: 2000 }],
      glide: 1,
    };
    const applied = { ...SLIDER, repulsion: 1000 };
    evaluateTracks({ repulsion: tr }, SLIDER, 1.0, 0.5, applied);
    expect(applied.repulsion).toBeCloseTo(1500, 6); // 1000 + (2000-1000) * (0.5/1)
  });

  it('with glide<dt, clamps blend to 1 (no overshoot)', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-rep',
      keyframes: [{ time: 0, value: 2000 }, { time: 2, value: 2000 }],
      glide: 0.1,
    };
    const applied = { ...SLIDER, repulsion: 1000 };
    evaluateTracks({ repulsion: tr }, SLIDER, 1.0, 0.5, applied);
    expect(applied.repulsion).toBeCloseTo(2000, 6); // snap, no overshoot
  });
});

describe('evaluateTracks — modulator', () => {
  it('adds LFO output to the target (wallTime drives the LFO, not playhead time)', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-rep',
      keyframes: [],
      glide: 0,
      modulator: { waveform: 'sine', rate: 1, depth: 100, phase: 0 },
    };
    const applied = fresh();
    // playhead time=0 (paused), wallTime=0.25 → sine peaks at +1 → +100
    evaluateTracks({ repulsion: tr }, SLIDER, 0, 0.016, applied, 0.25);
    // sine at wallTime=0.25, rate=1, phase=0 → +1 → +100
    expect(applied.repulsion).toBeCloseTo(1500 + 100, 6);
  });

  it('is unaffected by playhead time when wallTime is provided', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-rep',
      keyframes: [],
      glide: 0,
      modulator: { waveform: 'sine', rate: 1, depth: 100, phase: 0 },
    };
    const applied1 = fresh();
    const applied2 = fresh();
    // Same wallTime but different playhead times → same LFO output
    evaluateTracks({ repulsion: tr }, SLIDER, 0, 0.016, applied1, 0.25);
    evaluateTracks({ repulsion: tr }, SLIDER, 5, 0.016, applied2, 0.25);
    expect(applied1.repulsion).toBeCloseTo(applied2.repulsion, 6);
  });

  it('BPM-sync: rate=1 at 120 BPM gives 2 Hz effective rate', () => {
    const tr: WorkerTrack = {
      trackId: 'phys-rep',
      keyframes: [],
      glide: 0,
      modulator: { waveform: 'sine', rate: 1, depth: 100, phase: 0, bpm: 120 },
    };
    const applied = fresh();
    // 120 BPM * 1 cycle/beat / 60 = 2 Hz → quarter period = 0.125 s → peak at wallTime=0.125
    evaluateTracks({ repulsion: tr }, SLIDER, 0, 0.016, applied, 0.125);
    expect(applied.repulsion).toBeCloseTo(1500 + 100, 5);
  });
});
