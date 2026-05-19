// LFO modulator types + evaluation. Used by the physics worker to layer
// periodic offsets onto track-evaluated parameter values, and by the
// timeline UI (LfoControls) to let users configure a modulator per track.
//
// `depth` is the additive amplitude in the param's native units (e.g. for
// repulsion: 0..3000 range, a depth of 200 means ±200 around the target).
// Scaling to a 0..1 normalized UI slider is the consumer's responsibility.

export type ModulatorWaveform = 'sine' | 'triangle' | 'square';

export type Modulator = {
  waveform: ModulatorWaveform;
  rate: number;   // Hz; range 0.1..10 in the default UI
  depth: number;  // additive amplitude in param-native units
  phase: number;  // radians, [0, 2π)
};

export const DEFAULT_MODULATOR: Modulator = {
  waveform: 'sine',
  rate: 1,
  depth: 0,
  phase: 0,
};

const TWO_PI = Math.PI * 2;

export function evalLfo(m: Modulator, time: number): number {
  if (m.depth === 0) return 0;
  const phase = m.phase + TWO_PI * m.rate * time;
  let raw: number;
  switch (m.waveform) {
    case 'sine':
      raw = Math.sin(phase);
      break;
    case 'triangle': {
      // Phase-aligned with sine: 0 at u=0, +1 at u=0.25, 0 at u=0.5, −1 at u=0.75.
      const u = ((phase / TWO_PI) % 1 + 1) % 1;
      raw = 1 - 4 * Math.abs(((u + 0.25) % 1) - 0.5);
      break;
    }
    case 'square':
      raw = Math.sin(phase) >= 0 ? 1 : -1;
      break;
  }
  return raw * m.depth;
}

export function isDefaultModulator(m: Modulator | undefined | null): boolean {
  if (!m) return true;
  return m.depth === 0;
}
