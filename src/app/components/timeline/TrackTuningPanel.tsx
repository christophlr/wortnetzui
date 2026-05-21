// TrackTuningPanel — Glide slider + LfoControls for a single physics track.
// Renders below the GraphEditor when the user expands a track. Composes from
// SidebarAtoms only (atom contract).

import type { Modulator } from '../../animation/Modulator';
import type { TrackMeta } from '../../animation/Track';
import { LfoControls } from './LfoControls';
import { SidebarGroup, SidebarSliderRow, SidebarSliderTrack } from '../sidebar/SidebarAtoms';
import { useT } from '../../i18n/useT';
import { useState } from 'react';
import { TrackLabel } from './TimelineAtoms';
import { LABEL_W } from './types';

export function TrackTuningPanel({
  trackId,
  paramKey,
  meta,
  onSetGlide,
  onSetModulator,
}: {
  trackId: string;
  paramKey: string;
  meta: TrackMeta;
  onSetGlide: (seconds: number) => void;
  onSetModulator: (m: Modulator | null) => void;
}) {
  const { t } = useT();
  const [lfoExpanded, setLfoExpanded] = useState(false);
  return (
    <div className="flex border-b border-border/50">
      {/* Empty label column matches the rest of the timeline grid */}
      <div style={{ width: LABEL_W }} className="shrink-0 bg-background border-r border-border" />
      <div className="flex-1 px-4 py-3 space-y-4 bg-wn-info-bg/30">
        <SidebarGroup stack="snug">
          <SidebarSliderRow
            label={t('timeline.glide.label')}
            value={meta.glide}
            onCommit={onSetGlide}
            min={0}
            max={5}
            slider={
              <SidebarSliderTrack
                value={[meta.glide]}
                min={0}
                max={5}
                step={0.05}
                onValueChange={([v]) => onSetGlide(v)}
              />
            }
            description={t('timeline.glide.description')}
          />
        </SidebarGroup>
        <LfoControls
          paramKey={paramKey}
          trackId={trackId}
          expanded={lfoExpanded}
          onToggleExpanded={() => setLfoExpanded(e => !e)}
          value={meta.modulator ?? null}
          onChange={onSetModulator}
        />
      </div>
    </div>
  );
}
