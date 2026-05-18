/** Tolerance for keyframe mutation/dedup: two keyframes within this window are considered the same. */
export const MUTATION_EPSILON = 0.1;

/** Tolerance for selection hit-testing: a click within this window selects the keyframe. */
export const SELECTION_EPSILON = 0.01;

/** Tolerance for ruler tick/snap alignment. */
export const SNAP_EPSILON = 0.001;

/** Two times are "the same" for mutation/dedup purposes. */
export const sameTime = (a: number, b: number): boolean =>
  Math.abs(a - b) <= MUTATION_EPSILON;

/** Two times are "different" for mutation/dedup purposes. */
export const differentTime = (a: number, b: number): boolean =>
  Math.abs(a - b) > MUTATION_EPSILON;

/** Point `a` is within selection hit distance of `b`. */
export const withinSelection = (a: number, b: number): boolean =>
  Math.abs(a - b) < SELECTION_EPSILON;

/** Point `a` is within snap/ruler alignment distance of `b`. */
export const withinSnap = (a: number, b: number): boolean =>
  Math.abs(a - b) < SNAP_EPSILON;
