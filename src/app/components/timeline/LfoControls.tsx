// LfoControls — collapsed-by-default per-track modulator panel. Lives inside
// the GraphEditor expansion alongside the Glide slider. Hint text appears on
// the repulsion track to point users to the analogous Pulse sidebar knob.
//
// Atom contract: composes from SidebarAtoms only; no raw className passed in.

import { useT } from '../../i18n/useT';
import type { Modulator, ModulatorWaveform } from '../../animation/Modulator';
import { DEFAULT_MODULATOR } from '../../animation/Modulator';
import {
  SidebarCollapsiblePanel,
  SidebarSliderRow,
  SidebarSliderTrack,
  SidebarToggleRow,
  SidebarDescription,
} from '../sidebar/SidebarAtoms';
import { cn } from '../ui/utils';

const TWO_PI = Math.PI * 2;

const WAVEFORMS: ModulatorWaveform[] = ['sine', 'triangle', 'square'];

function WaveformPicker({
  value,
  onChange,
}: {
  value: ModulatorWaveform;
  onChange: (w: ModulatorWaveform) => void;
}) {
  const { t } = useT();
  return (
    <div className="flex gap-1">
      {WAVEFORMS.map(w => (
        <button
          key={w}
          type="button"
          onClick={() => onChange(w)}
          className={cn(
            'flex-1 h-7 rounded-sm text-[11px] font-medium border transition-colors',
            value === w
              ? 'bg-wn-accent-soft border-wn-accent text-foreground'
              : 'border-wn-divider text-muted-foreground hover:text-foreground',
          )}
          title={t(`timeline.lfo.wave.${w}`)}
        >
          {w === 'sine' ? '∼' : w === 'triangle' ? '△' : '▢'}
        </button>
      ))}
    </div>
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
      <SidebarToggleRow
        label={t('timeline.lfo.enable')}
        checked={enabled}
        onCheckedChange={(v) => onChange(v ? { ...DEFAULT_MODULATOR, depth: 1 } : null)}
        tone="accent"
      />
      {enabled ? (
        <>
          <SidebarSliderRow
            label={t('timeline.lfo.waveform')}
            slider={<WaveformPicker value={current.waveform} onChange={(w) => onChange({ ...current, waveform: w })} />}
          />
          <SidebarSliderRow
            label={t('timeline.lfo.rate')}
            value={current.rate}
            onCommit={(v) => onChange({ ...current, rate: Math.max(0.1, Math.min(10, v)) })}
            min={0.1}
            max={10}
            slider={
              <SidebarSliderTrack
                value={[current.rate]}
                min={0.1}
                max={10}
                step={0.1}
                onValueChange={([v]) => onChange({ ...current, rate: v })}
              />
            }
          />
          <SidebarSliderRow
            label={t('timeline.lfo.depth')}
            value={current.depth}
            onCommit={(v) => onChange({ ...current, depth: Math.max(0, v) })}
            min={0}
            slider={
              <SidebarSliderTrack
                value={[current.depth]}
                min={0}
                max={depthMaxFor(paramKey)}
                step={depthStepFor(paramKey)}
                onValueChange={([v]) => onChange({ ...current, depth: v })}
              />
            }
          />
          <SidebarSliderRow
            label={t('timeline.lfo.phase')}
            value={current.phase}
            onCommit={(v) => onChange({ ...current, phase: ((v % TWO_PI) + TWO_PI) % TWO_PI })}
            min={0}
            max={TWO_PI}
            slider={
              <SidebarSliderTrack
                value={[current.phase]}
                min={0}
                max={TWO_PI}
                step={TWO_PI / 32}
                onValueChange={([v]) => onChange({ ...current, phase: v })}
              />
            }
          />
          {trackId === 'phys-rep' ? (
            <SidebarDescription>{t('timeline.lfo.hint')}</SidebarDescription>
          ) : null}
        </>
      ) : null}
    </SidebarCollapsiblePanel>
  );
}

// Depth max scales to the param's native range so the slider feels useful.
// Numbers chosen to roughly match the typical sidebar slider span — fine-tuned
// later if specific tracks feel cramped.
function depthMaxFor(paramKey: string): number {
  switch (paramKey) {
    case 'repulsion':    return 1500;
    case 'springK':      return 0.5;
    case 'damping':      return 0.1;
    case 'minSpeed':     return 1;
    case 'linkDistance': return 100;
    case 'gravity':      return 5;
    case 'turbulence':   return 5;
    case 'verticalOrder':return 5;
    case 'pulse':        return 0.5;
    default:             return 1;
  }
}

function depthStepFor(paramKey: string): number {
  return depthMaxFor(paramKey) / 100;
}
