// LFO modulator types + evaluation. Used by the physics worker to layer
// periodic offsets onto track-evaluated parameter values, and by the
// timeline UI (LfoControls) to let users configure a modulator per track.
//
// `depth` is the additive amplitude in the param's native units (e.g. for
// repulsion: 0..3000 range, a depth of 200 means ±200 around the target).
// Scaling to a 0..1 normalized UI slider is the consumer's responsibility.
//
// `evalLfo` takes wallTime (real-clock seconds), NOT playhead time, so the
// LFO always oscillates even when playback is paused.

export type ModulatorWaveform = 'sine' | 'triangle' | 'sawtooth' | 'sawtoothDown' | 'square' | 'random' | 'noise';

export type Modulator = {
  waveform: ModulatorWaveform;
  // Free mode: rate in Hz. BPM mode (bpm set): rate in cycles-per-beat.
  rate: number;
  depth: number;  // additive amplitude in param-native units
  phase: number;  // radians, [0, 2π)
  bpm?: number;   // when set, enables BPM-sync mode; rate becomes cycles-per-beat
};

export const DEFAULT_MODULATOR: Modulator = {
  waveform: 'sine',
  rate: 1,
  depth: 0,
  phase: 0,
};

const TWO_PI = Math.PI * 2;

// Simple deterministic float generator seeded by an integer. Returns value in [0, 1).
function hash(x: number): number {
  const sin = Math.sin(x) * 43758.5453123;
  return sin - Math.floor(sin);
}

// wallTime must be real-clock seconds (performance.now()/1000), not playhead time.
export function evalLfo(m: Modulator, wallTime: number): number {
  if (m.depth === 0) return 0;
  const effectiveRate = m.bpm != null ? m.rate * m.bpm / 60 : m.rate;
  const phase = m.phase + TWO_PI * effectiveRate * wallTime;
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
    case 'sawtooth': {
      const u = ((phase / TWO_PI) % 1 + 1) % 1;
      raw = 2 * u - 1;
      break;
    }
    case 'sawtoothDown': {
      const u = ((phase / TWO_PI) % 1 + 1) % 1;
      raw = 1 - 2 * u;
      break;
    }
    case 'square':
      raw = Math.sin(phase) >= 0 ? 1 : -1;
      break;
    case 'random': {
      const cycle = Math.floor(phase / TWO_PI);
      raw = hash(cycle) * 2 - 1;
      break;
    }
    case 'noise': {
      const tVal = phase / TWO_PI;
      const cycle = Math.floor(tVal);
      const frac = tVal - cycle;
      const y0 = hash(cycle) * 2 - 1;
      const y1 = hash(cycle + 1) * 2 - 1;
      // Cosine interpolation
      const smoothFrac = (1 - Math.cos(frac * Math.PI)) / 2;
      raw = y0 + (y1 - y0) * smoothFrac;
      break;
    }
  }
  return raw * m.depth;
}

export function isDefaultModulator(m: Modulator | undefined | null): boolean {
  if (!m) return true;
  return m.depth === 0;
}
