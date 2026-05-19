import { describe, it, expect } from 'vitest';
import { serializeTrackMeta } from './useWorkspaceIO';

describe('serializeTrackMeta', () => {
  it('returns undefined when input is undefined', () => {
    expect(serializeTrackMeta(undefined)).toBeUndefined();
  });

  it('returns undefined when every entry is default (glide=0, no modulator)', () => {
    expect(serializeTrackMeta({
      'phys-rep': { glide: 0 },
      'phys-spk': { glide: 0 },
    })).toBeUndefined();
  });

  it('persists non-zero glide', () => {
    expect(serializeTrackMeta({
      'phys-rep': { glide: 0.5 },
      'phys-spk': { glide: 0 },
    })).toEqual({ 'phys-rep': { glide: 0.5 } });
  });

  it('persists modulator-only entries (glide=0)', () => {
    const m = { waveform: 'sine' as const, rate: 1, depth: 100, phase: 0 };
    expect(serializeTrackMeta({
      'phys-rep': { glide: 0, modulator: m },
    })).toEqual({ 'phys-rep': { modulator: m } });
  });

  it('persists combined glide + modulator', () => {
    const m = { waveform: 'triangle' as const, rate: 2, depth: 50, phase: 0 };
    expect(serializeTrackMeta({
      'phys-rep': { glide: 1.5, modulator: m },
    })).toEqual({ 'phys-rep': { glide: 1.5, modulator: m } });
  });
});
