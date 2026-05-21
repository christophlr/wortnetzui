import { describe, it, expect } from 'vitest';
import { evalLfo, DEFAULT_MODULATOR, isDefaultModulator } from './Modulator';

describe('evalLfo', () => {
  it('returns 0 when depth is 0', () => {
    expect(evalLfo({ ...DEFAULT_MODULATOR, depth: 0 }, 0)).toBe(0);
    expect(evalLfo({ ...DEFAULT_MODULATOR, depth: 0 }, 12.3)).toBe(0);
  });

  describe('sine waveform', () => {
    const m = { waveform: 'sine' as const, rate: 1, depth: 1, phase: 0 };
    it('starts at 0', () => {
      expect(evalLfo(m, 0)).toBeCloseTo(0, 10);
    });
    it('peaks at +depth at t = 1/(4·rate)', () => {
      expect(evalLfo(m, 0.25)).toBeCloseTo(1, 10);
    });
    it('crosses 0 at t = 1/(2·rate)', () => {
      expect(evalLfo(m, 0.5)).toBeCloseTo(0, 10);
    });
    it('troughs at −depth at t = 3/(4·rate)', () => {
      expect(evalLfo(m, 0.75)).toBeCloseTo(-1, 10);
    });
    it('scales by depth', () => {
      const m2 = { ...m, depth: 200 };
      expect(evalLfo(m2, 0.25)).toBeCloseTo(200, 8);
    });
  });

  describe('triangle waveform', () => {
    const m = { waveform: 'triangle' as const, rate: 1, depth: 1, phase: 0 };
    it('peaks at +depth at t = 1/(4·rate)', () => {
      expect(evalLfo(m, 0.25)).toBeCloseTo(1, 10);
    });
    it('crosses 0 at t = 1/(2·rate)', () => {
      expect(evalLfo(m, 0.5)).toBeCloseTo(0, 10);
    });
    it('troughs at −depth at t = 3/(4·rate)', () => {
      expect(evalLfo(m, 0.75)).toBeCloseTo(-1, 10);
    });
    it('starts at 0 at phase=0 (sine-aligned)', () => {
      expect(evalLfo(m, 0)).toBeCloseTo(0, 10);
    });
  });

  describe('square waveform', () => {
    const m = { waveform: 'square' as const, rate: 1, depth: 1, phase: 0 };
    it('is +depth in first half of period', () => {
      expect(evalLfo(m, 0.1)).toBe(1);
      expect(evalLfo(m, 0.4)).toBe(1);
    });
    it('is −depth in second half of period', () => {
      expect(evalLfo(m, 0.6)).toBe(-1);
      expect(evalLfo(m, 0.9)).toBe(-1);
    });
  });

  it('respects phase offset', () => {
    const m = { waveform: 'sine' as const, rate: 1, depth: 1, phase: Math.PI / 2 };
    expect(evalLfo(m, 0)).toBeCloseTo(1, 10);
  });
});

describe('isDefaultModulator', () => {
  it('treats undefined and null as default', () => {
    expect(isDefaultModulator(undefined)).toBe(true);
    expect(isDefaultModulator(null)).toBe(true);
  });
  it('treats depth=0 as default', () => {
    expect(isDefaultModulator({ ...DEFAULT_MODULATOR, depth: 0 })).toBe(true);
  });
  it('treats non-zero depth as non-default', () => {
    expect(isDefaultModulator({ ...DEFAULT_MODULATOR, depth: 0.1 })).toBe(false);
  });
});
