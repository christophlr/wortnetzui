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

  describe('sawtooth waveform', () => {
    const m = { waveform: 'sawtooth' as const, rate: 1, depth: 1, phase: 0 };
    it('starts at -depth', () => {
      expect(evalLfo(m, 0)).toBeCloseTo(-1, 10);
    });
    it('rises linearly', () => {
      expect(evalLfo(m, 0.25)).toBeCloseTo(-0.5, 10);
      expect(evalLfo(m, 0.5)).toBeCloseTo(0, 10);
      expect(evalLfo(m, 0.75)).toBeCloseTo(0.5, 10);
    });
    it('peaks and resets at cycle boundary', () => {
      expect(evalLfo(m, 0.999)).toBeCloseTo(0.998, 3);
      expect(evalLfo(m, 1.0)).toBeCloseTo(-1, 10);
    });
  });

  describe('sawtoothDown waveform', () => {
    const m = { waveform: 'sawtoothDown' as const, rate: 1, depth: 1, phase: 0 };
    it('starts at +depth', () => {
      expect(evalLfo(m, 0)).toBeCloseTo(1, 10);
    });
    it('falls linearly', () => {
      expect(evalLfo(m, 0.25)).toBeCloseTo(0.5, 10);
      expect(evalLfo(m, 0.5)).toBeCloseTo(0, 10);
      expect(evalLfo(m, 0.75)).toBeCloseTo(-0.5, 10);
    });
    it('troughs and resets at cycle boundary', () => {
      expect(evalLfo(m, 0.999)).toBeCloseTo(-0.998, 3);
      expect(evalLfo(m, 1.0)).toBeCloseTo(1, 10);
    });
  });

  describe('random waveform', () => {
    const m = { waveform: 'random' as const, rate: 1, depth: 1, phase: 0 };
    it('is constant within a cycle', () => {
      const v1 = evalLfo(m, 0.1);
      const v2 = evalLfo(m, 0.4);
      expect(v1).toBe(v2);
      expect(v1).toBeGreaterThanOrEqual(-1);
      expect(v1).toBeLessThanOrEqual(1);
    });
    it('changes across cycles and is deterministic', () => {
      const v1 = evalLfo(m, 0.2);
      const v2 = evalLfo(m, 1.2);
      expect(v1).not.toBe(v2);

      // Determinism check
      expect(evalLfo(m, 0.2)).toBe(v1);
      expect(evalLfo(m, 1.2)).toBe(v2);
    });
  });

  describe('noise waveform', () => {
    const m = { waveform: 'noise' as const, rate: 1, depth: 1, phase: 0 };
    it('interpolates smoothly between cycle boundaries', () => {
      const vStart = evalLfo(m, 0.0);
      const vMid = evalLfo(m, 0.5);
      const vEnd = evalLfo(m, 1.0);

      expect(vStart).toBeCloseTo(evalLfo({ waveform: 'random' as const, rate: 1, depth: 1, phase: 0 }, 0), 10);
      expect(vEnd).toBeCloseTo(evalLfo({ waveform: 'random' as const, rate: 1, depth: 1, phase: 0 }, 1), 10);
      expect(vMid).toBeCloseTo((vStart + vEnd) / 2, 10);

      // Determinism check
      expect(evalLfo(m, 0.5)).toBe(vMid);
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
