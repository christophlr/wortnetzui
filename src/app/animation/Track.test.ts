import { describe, it, expect } from 'vitest';
import { createTrack, isDefaultTrack, DEFAULT_TRACK_META } from './Track';
import { DEFAULT_MODULATOR } from './Modulator';

describe('createTrack', () => {
  it('creates a track with empty keyframes by default', () => {
    const t = createTrack('phys-rep', 'repulsion');
    expect(t.id).toBe('phys-rep');
    expect(t.paramKey).toBe('repulsion');
    expect(t.keyframes).toEqual([]);
    expect(t.glide).toBe(0);
    expect(t.modulator).toBeUndefined();
  });

  it('accepts initial keyframes', () => {
    const kfs = [{ time: 0, value: 1000 }, { time: 2, value: 2000 }];
    const t = createTrack('phys-rep', 'repulsion', kfs);
    expect(t.keyframes).toEqual(kfs);
  });
});

describe('isDefaultTrack', () => {
  it('returns true for newly created tracks', () => {
    expect(isDefaultTrack(createTrack('phys-rep', 'repulsion'))).toBe(true);
  });

  it('returns false when glide is non-zero', () => {
    const t = { ...createTrack('phys-rep', 'repulsion'), glide: 0.5 };
    expect(isDefaultTrack(t)).toBe(false);
  });

  it('returns false when a modulator is present', () => {
    const t = { ...createTrack('phys-rep', 'repulsion'), modulator: { ...DEFAULT_MODULATOR, depth: 100 } };
    expect(isDefaultTrack(t)).toBe(false);
  });
});

describe('DEFAULT_TRACK_META', () => {
  it('is glide=0 and no modulator', () => {
    expect(DEFAULT_TRACK_META).toEqual({ glide: 0 });
  });
});
