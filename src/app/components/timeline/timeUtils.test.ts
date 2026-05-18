import { describe, it, expect } from 'vitest';
import {
  MUTATION_EPSILON,
  SELECTION_EPSILON,
  SNAP_EPSILON,
  sameTime,
  differentTime,
  withinSelection,
  withinSnap,
} from './timeUtils';

describe('time epsilon constants', () => {
  it('MUTATION_EPSILON is 0.1', () => {
    expect(MUTATION_EPSILON).toBe(0.1);
  });

  it('SELECTION_EPSILON is 0.01', () => {
    expect(SELECTION_EPSILON).toBe(0.01);
  });

  it('SNAP_EPSILON is 0.001', () => {
    expect(SNAP_EPSILON).toBe(0.001);
  });
});

describe('sameTime', () => {
  it('returns true for identical values', () => {
    expect(sameTime(1.0, 1.0)).toBe(true);
  });

  it('returns true when difference equals MUTATION_EPSILON', () => {
    expect(sameTime(0, 0.1)).toBe(true);
  });

  it('returns false when difference exceeds MUTATION_EPSILON', () => {
    expect(sameTime(0, 0.11)).toBe(false);
  });

  it('is symmetric', () => {
    expect(sameTime(5.0, 5.05)).toBe(sameTime(5.05, 5.0));
  });
});

describe('differentTime', () => {
  it('returns false for identical values', () => {
    expect(differentTime(2.0, 2.0)).toBe(false);
  });

  it('returns false when difference equals MUTATION_EPSILON (boundary is "same")', () => {
    expect(differentTime(0, 0.1)).toBe(false);
  });

  it('returns true when difference exceeds MUTATION_EPSILON', () => {
    expect(differentTime(0, 0.101)).toBe(true);
  });

  it('is the logical inverse of sameTime', () => {
    const pairs: [number, number][] = [[0, 0], [0, 0.05], [0, 0.1], [0, 0.15]];
    for (const [a, b] of pairs) {
      expect(differentTime(a, b)).toBe(!sameTime(a, b));
    }
  });
});

describe('withinSelection', () => {
  it('returns true when difference is strictly below SELECTION_EPSILON', () => {
    expect(withinSelection(0, 0.009)).toBe(true);
  });

  it('returns false when difference equals SELECTION_EPSILON (strictly less than)', () => {
    expect(withinSelection(0, 0.01)).toBe(false);
  });

  it('returns true for identical values', () => {
    expect(withinSelection(3.5, 3.5)).toBe(true);
  });

  it('returns false for values separated by MUTATION_EPSILON', () => {
    expect(withinSelection(0, 0.1)).toBe(false);
  });
});

describe('withinSnap', () => {
  it('returns true when difference is strictly below SNAP_EPSILON', () => {
    expect(withinSnap(0, 0.0009)).toBe(true);
  });

  it('returns false when difference equals SNAP_EPSILON (strictly less than)', () => {
    expect(withinSnap(0, 0.001)).toBe(false);
  });

  it('returns true for identical values', () => {
    expect(withinSnap(10.0, 10.0)).toBe(true);
  });

  it('correctly identifies major ruler ticks (modular arithmetic)', () => {
    // t=0.25, majorStep=0.25 → t % majorStep = 0 → within snap → major tick
    expect(withinSnap(0.25 % 0.25, 0)).toBe(true);
    // t=0.13, majorStep=0.25 → remainder 0.13 → NOT within snap → minor tick
    expect(withinSnap(0.13 % 0.25, 0)).toBe(false);
  });
});
