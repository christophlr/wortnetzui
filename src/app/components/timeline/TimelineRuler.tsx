import type { ViewWindow } from './types';
import { withinSnap } from './timeUtils';

export type RulerBeatOptions = {
  bpm: number;
  gridSubdivision?: number; // cycles-per-beat, e.g. 1=quarter, 2=8th, 4=16th, 0.25=whole
  beatsPerBar?: number;     // defaults to 4 (4/4 meter)
};

/**
 * Adaptive tick ruler for the timeline.
 * Tick density scales with zoom — 10s steps at zoom=1 down to 0.1s at zoom=200.
 * In beat mode, ticks fall on musical subdivisions and labels read as Bar.Beat.
 */
export function TimelineRuler({
  zoom,
  duration,
  viewWindow,
  beatMode,
}: {
  zoom: number;
  duration: number;
  viewWindow: ViewWindow;
  beatMode?: RulerBeatOptions;
}) {
  const visibleDuration = viewWindow.end - viewWindow.start;

  if (beatMode && beatMode.bpm > 0) {
    const beatsPerBar = beatMode.beatsPerBar ?? 4;
    const beatDuration = 60 / beatMode.bpm; // seconds per beat
    const visibleBeats = visibleDuration / beatDuration;

    // Major ticks: bar boundaries (multiples of beatsPerBar).
    // Scale up when zoomed out to avoid crowding.
    let majorStepBeats = beatsPerBar;
    while (visibleBeats / majorStepBeats > 64) majorStepBeats *= 2;

    // Minor ticks: follow the chosen grid subdivision when it fits.
    // gridSubdivision = cycles-per-beat → stepBeats = 1/gridSubdivision.
    const subDivision = beatMode.gridSubdivision ?? 1;
    const desiredMinorBeats = 1 / subDivision;
    const maxMinorTicks = 300;
    const minorStepBeats = visibleBeats / desiredMinorBeats <= maxMinorTicks
      ? desiredMinorBeats
      : majorStepBeats / 4;

    const minorStep = minorStepBeats * beatDuration;
    const majorStep = majorStepBeats * beatDuration;

    const ticks: { t: number; major: boolean; leftPct: number }[] = [];
    const firstTick = Math.floor(viewWindow.start / minorStep) * minorStep;
    const tickCount = Math.ceil(visibleDuration / minorStep) + 3;

    for (let i = 0; i < tickCount; i++) {
      const t = parseFloat((firstTick + i * minorStep).toFixed(6));
      if (t < 0 || t > duration) continue;
      const leftPct = ((t - viewWindow.start) / visibleDuration) * 100;
      if (leftPct < -1 || leftPct > 101) continue;
      // Use round-trip check to avoid float-modulo precision errors.
      const major = Math.abs(t - Math.round(t / majorStep) * majorStep) < 0.5 * minorStep;
      ticks.push({ t, major, leftPct });
    }

    const formatBeat = (t: number) => {
      const beats = t / beatDuration;
      const bar = Math.floor(beats / beatsPerBar) + 1;
      const beatInBar = beats - (bar - 1) * beatsPerBar;
      const beatIdx = Math.floor(beatInBar) + 1;
      const frac = beatInBar - Math.floor(beatInBar);
      if (frac < 1e-3) return `${bar}.${beatIdx}`;
      return `${bar}.${beatIdx}.${Math.round(frac * 100).toString().padStart(2, '0')}`;
    };

    return (
      <div className="relative w-full h-full">
        {ticks.map(({ t, major, leftPct }) => (
          <div
            key={t}
            className="absolute top-0 flex flex-col items-start"
            style={{ left: `${leftPct}%` }}
          >
            <div className={`w-px ${major ? 'h-3.5 bg-muted-foreground' : 'h-2 bg-muted-foreground/60'}`} />
            {major && (
              <span className="text-[9px] font-mono text-muted-foreground ml-0.5 mt-0.5 leading-none">
                {formatBeat(t)}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  const majorStep =
    zoom >= 100 ? 0.1  :
    zoom >= 50  ? 0.25 :
    zoom >= 20  ? 0.5  :
    zoom >= 10  ? 1    :
    zoom >= 5   ? 2    :
    zoom >= 2   ? 5    :
    visibleDuration > 60 ? 10 : 5;
  const minorStep = majorStep / 5;

  const ticks: { t: number; major: boolean; leftPct: number }[] = [];
  const firstTick = Math.floor(viewWindow.start / minorStep) * minorStep;
  const tickCount = Math.ceil(visibleDuration / minorStep) + 3;

  for (let i = 0; i < tickCount; i++) {
    const t = parseFloat((firstTick + i * minorStep).toFixed(4));
    if (t < 0 || t > duration) continue;
    const leftPct = ((t - viewWindow.start) / visibleDuration) * 100;
    if (leftPct < -1 || leftPct > 101) continue;
    ticks.push({ t, major: withinSnap(t % majorStep, 0), leftPct });
  }

  const formatTime = (t: number) => {
    if (t >= 60) {
      const m = Math.floor(t / 60);
      const s = t % 60;
      return s > 0 ? `${m}m${s.toFixed(s % 1 !== 0 ? 2 : 0)}s` : `${m}m`;
    }
    return t % 1 !== 0 ? `${t.toFixed(2)}s` : `${t}s`;
  };

  return (
    <div className="relative w-full h-full">
      {ticks.map(({ t, major, leftPct }) => (
        <div
          key={t}
          className="absolute top-0 flex flex-col items-start"
          style={{ left: `${leftPct}%` }}
        >
          <div className={`w-px ${major ? 'h-3.5 bg-muted-foreground' : 'h-2 bg-muted-foreground/60'}`} />
          {major && (
            <span className="text-[9px] font-mono text-muted-foreground ml-0.5 mt-0.5 leading-none">
              {formatTime(t)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
