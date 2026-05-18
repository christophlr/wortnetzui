import type { ViewWindow } from './types';
import { withinSnap } from './timeUtils';

/**
 * Adaptive tick ruler for the timeline.
 * Tick density scales with zoom level — from 10s steps at zoom=1 to 0.1s at zoom=200.
 */
export function TimelineRuler({
  zoom,
  duration,
  viewWindow,
}: {
  zoom: number;
  duration: number;
  viewWindow: ViewWindow;
}) {
  const visibleDuration = viewWindow.end - viewWindow.start;
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
