// TrackTuningPanel — Modulator controls for a single physics track.
// Renders below the GraphEditor when the user expands a track. Composes from
// SidebarAtoms only (atom contract).

import type { Modulator } from '../../animation/Modulator';
import type { TrackMeta } from '../../animation/Track';
import { LfoControls } from './LfoControls';
import { useState } from 'react';
import { LABEL_W } from './types';

export function TrackTuningPanel({
  trackId,
  paramKey,
  meta,
  onSetModulator,
}: {
  trackId: string;
  paramKey: string;
  meta: TrackMeta;
  onSetModulator: (m: Modulator | null) => void;
}) {
  const [lfoExpanded, setLfoExpanded] = useState(false);
  return (
    <div className="flex border-b border-border/50">
      {/* Empty label column matches the rest of the timeline grid */}
      <div style={{ width: LABEL_W }} className="shrink-0 bg-background border-r border-border" />
      <div className="flex-1 px-4 py-3 space-y-4 bg-wn-info-bg/30">
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
