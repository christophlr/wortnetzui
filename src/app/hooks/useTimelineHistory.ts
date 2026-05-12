import { useCallback, useRef, useState, useEffect } from 'react';

type Keyframe = {
  time: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
};
type PhysicsKeyframe = { time: number; value: number };
export type SceneMarker = { time: number; label: string };
type TimelineState = { cameraKeyframes: Keyframe[]; physicsKeyframes: Record<string, PhysicsKeyframe[]>; sceneMarkers: SceneMarker[] };

export default function useTimelineHistory(getTimelineState: () => TimelineState, applyEntry: (entry: TimelineState) => void, opts?: { maxEntries?: number }) {
  const maxEntries = opts?.maxEntries ?? 50;
  const [history, setHistory] = useState<TimelineState[]>([getTimelineState()]);
  const [index, setIndex] = useState(0);

  const historyRef = useRef(history);
  const indexRef = useRef(index);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { indexRef.current = index; }, [index]);

  const pushHistory = useCallback((maybePrevOrNext?: TimelineState | ((prev: TimelineState) => TimelineState), maybeNext?: TimelineState) => {
    const next: TimelineState = ((): TimelineState => {
      if (maybeNext) return maybeNext;
      if (maybePrevOrNext && typeof maybePrevOrNext === 'object' && 'cameraKeyframes' in maybePrevOrNext) return maybePrevOrNext as TimelineState;
      return getTimelineState();
    })();

    setHistory(h => {
      const newHistory = [...h.slice(0, indexRef.current + 1), next].slice(-maxEntries);
      return newHistory;
    });
    setIndex(i => Math.min(i + 1, maxEntries - 1));
  }, [getTimelineState, maxEntries]);

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return;
    const entry = historyRef.current[indexRef.current - 1];
    if (!entry) return;
    applyEntry(entry);
    setIndex(i => i - 1);
  }, [applyEntry]);

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    const entry = historyRef.current[indexRef.current + 1];
    if (!entry) return;
    applyEntry(entry);
    setIndex(i => i + 1);
  }, [applyEntry]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { pushHistory, undo, redo, canUndo, canRedo, history, index };
}
