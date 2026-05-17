export const TIME_EPSILON = 0.1;

export const sameTime = (a: number, b: number): boolean =>
  Math.abs(a - b) <= TIME_EPSILON;

export const differentTime = (a: number, b: number): boolean =>
  Math.abs(a - b) > TIME_EPSILON;
