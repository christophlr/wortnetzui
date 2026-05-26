// LfoControls — collapsed-by-default per-track modulator panel. Lives inside
// the GraphEditor expansion. Hint text appears on the repulsion track to point
// users to the analogous Pulse sidebar knob.
//
// Atom contract: composes from SidebarAtoms only; no raw className passed in.

import { useT } from '../../i18n/useT';
import type { Modulator, ModulatorWaveform } from '../../animation/Modulator';
import { DEFAULT_MODULATOR } from '../../animation/Modulator';
import {
  SidebarCollapsiblePanel,
  SidebarScrubberRow,
  SidebarSegmentedPicker,
  SidebarSliderRow,
  SidebarToggleRow,
  SidebarDescription,
} from '../sidebar/SidebarAtoms';
import { Spline, Triangle, Square, TrendingUp, TrendingDown, Dice5, Waves } from 'lucide-react';

const TWO_PI = Math.PI * 2;

const WAVEFORMS: ModulatorWaveform[] = [
  'sine',
  'triangle',
  'sawtooth',
  'sawtoothDown',
  'square',
  'random',
  'noise',
];

const WAVEFORM_ICONS: Record<ModulatorWaveform, React.ComponentType<{ className?: string }>> = {
  sine: Spline,
  triangle: Triangle,
  sawtooth: TrendingUp,
  sawtoothDown: TrendingDown,
  square: Square,
  random: Dice5,
  noise: Waves,
};

// cycles-per-beat values for standard musical subdivisions.
// Rate=2 at 120 BPM → 2 * 120/60 = 4 Hz (8th note).
const BPM_SUB_ITEMS: { label: string; value: number }[] = [
  { label: '1/8', value: 2    },
  { label: '1/4', value: 1    },
  { label: '1/2', value: 0.5  },
  { label: '1',   value: 0.25 },
  { label: '2',   value: 0.125 },
];

const DEFAULT_BPM = 120;
const DEFAULT_BPM_RATE = 1; // quarter note

export function LfoControlsBody({
  paramKey,
  trackId,
  value,
  onChange,
}: {
  paramKey: string;
  trackId: string;
  value: Modulator | null;
  onChange: (m: Modulator | null) => void;
}) {
  const { t } = useT();
  const current: Modulator = value ?? { ...DEFAULT_MODULATOR, depth: depthMaxFor(paramKey) * 0.1 };
  const bpmEnabled = current.bpm != null;
  const waveformItems = WAVEFORMS.map(w => {
    const Icon = WAVEFORM_ICONS[w];
    return {
      label: <Icon className="size-3.5" />,
      value: w,
      title: t(`timeline.lfo.wave.${w}`),
    };
  });

  return (
    <>
      <SidebarSliderRow
        label={t('timeline.lfo.waveform')}
        slider={
          <SidebarSegmentedPicker
            items={waveformItems}
            value={current.waveform}
            onChange={(w) => onChange({ ...current, waveform: w })}
          />
        }
      />
      <SidebarToggleRow
        label={t('timeline.lfo.bpmSync')}
        checked={bpmEnabled}
        onCheckedChange={(v) => onChange(
          v
            ? { ...current, bpm: DEFAULT_BPM, rate: DEFAULT_BPM_RATE }
            : { ...current, bpm: undefined, rate: 1 },
        )}
      />
      {bpmEnabled ? (
        <>
          <SidebarScrubberRow
            label={t('timeline.lfo.bpm')}
            value={current.bpm!}
            min={20}
            max={300}
            step={1}
            decimals={0}
            format={(v) => String(Math.round(v))}
            onValueChange={(v) => onChange({ ...current, bpm: Math.round(v) })}
            onCommit={(v) => onChange({ ...current, bpm: Math.round(Math.max(20, Math.min(300, v))) })}
          />
          <SidebarSliderRow
            label={t('timeline.lfo.subdivision')}
            slider={
              <SidebarSegmentedPicker
                items={BPM_SUB_ITEMS}
                value={current.rate}
                onChange={(r) => onChange({ ...current, rate: r })}
              />
            }
          />
        </>
      ) : (
        <SidebarScrubberRow
          label={t('timeline.lfo.rate')}
          value={current.rate}
          min={0.1}
          max={10}
          step={0.1}
          onValueChange={(v) => onChange({ ...current, rate: v })}
          onCommit={(v) => onChange({ ...current, rate: Math.max(0.1, Math.min(10, v)) })}
        />
      )}
      <SidebarScrubberRow
        label={t('timeline.lfo.depth')}
        value={current.depth}
        min={0}
        max={depthMaxFor(paramKey)}
        step={depthStepFor(paramKey)}
        onValueChange={(v) => onChange({ ...current, depth: v })}
        onCommit={(v) => onChange({ ...current, depth: Math.max(0, v) })}
      />
      <SidebarScrubberRow
        label={t('timeline.lfo.phase')}
        value={current.phase}
        min={0}
        max={TWO_PI}
        step={TWO_PI / 32}
        onValueChange={(v) => onChange({ ...current, phase: v })}
        onCommit={(v) => onChange({ ...current, phase: ((v % TWO_PI) + TWO_PI) % TWO_PI })}
      />
      {trackId === 'phys-rep' ? (
        <SidebarDescription>{t('timeline.lfo.hint')}</SidebarDescription>
      ) : null}
    </>
  );
}

export function LfoControls({
  paramKey,
  trackId,
  expanded,
  onToggleExpanded,
  value,
  onChange,
}: {
  paramKey: string;
  trackId: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  value: Modulator | null;
  onChange: (m: Modulator | null) => void;
}) {
  const { t } = useT();
  const enabled = value !== null;
  const current: Modulator = value ?? DEFAULT_MODULATOR;
  return (
    <SidebarCollapsiblePanel
      title={t('timeline.lfo.title')}
      status={enabled ? t(`timeline.lfo.wave.${current.waveform}`) : undefined}
      expanded={expanded}
      onToggle={onToggleExpanded}
    >
      <LfoControlsBody
        paramKey={paramKey}
        trackId={trackId}
        value={value}
        onChange={onChange}
      />
    </SidebarCollapsiblePanel>
  );
}

// Depth max scales to the param's native range so the slider feels useful.
// Numbers chosen to roughly match the typical sidebar slider span — fine-tuned
// later if specific tracks feel cramped.
export function depthMaxFor(paramKey: string): number {
  switch (paramKey) {
    case 'repulsion':    return 1500;
    case 'springK':      return 0.5;
    case 'damping':      return 0.1;
    case 'minSpeed':     return 1;
    case 'linkDistance': return 100;
    case 'gravity':      return 5;
    case 'turbulence':   return 5;
    case 'verticalOrder':return 5;
    case 'bloomIntensity': return 2;
    case 'bloomRadius':    return 1.5;
    case 'bloomThreshold': return 1;
    case 'bloomSelectiveRatio':
    case 'selectiveRatio': return 1;
    case 'bloomFlickerSpeed':
    case 'flickerSpeed':   return 5;
    case 'nodeScale':      return 2.5;
    case 'edgeOpacity':    return 1;
    case 'radialBiasScale':
    case 'radialBias':     return 1;
    case 'glitchBrushRadius': return 500;
    case 'glitchFeather':  return 1;
    case 'pathSmoothness': return 1;
    case 'gradientHueShift':
    case 'hueShift':       return 360;
    default:             return 1;
  }
}

export function depthStepFor(paramKey: string): number {
  return depthMaxFor(paramKey) / 100;
}
