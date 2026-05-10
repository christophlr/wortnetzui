import { useRef, useEffect, useCallback } from 'react';

/**
 * Unified drag lifecycle hook. Replaces the ~6 independent useState+useEffect
 * drag patterns scattered across TrackRow, ValueGraphTrack, SceneMarkerLane, etc.
 *
 * Usage:
 *   const { startDrag, isDragging } = usePointerDrag({
 *     onStart: (e) => ({ startX: e.clientX, ... }),  // return state or null to cancel
 *     onMove: (e, state) => { ... },
 *     onEnd: (e, state) => { ... },
 *   });
 *
 *   <div onMouseDown={(e) => startDrag(e)} />
 */
interface PointerDragOpts<T> {
  onStart?: (e: React.MouseEvent) => T | null;
  onMove: (e: MouseEvent, state: T) => void;
  onEnd?: (e: MouseEvent, state: T) => void;
}

export function usePointerDrag<T>(opts: PointerDragOpts<T>) {
  const stateRef = useRef<T | null>(null);
  const isDraggingRef = useRef(false);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || stateRef.current === null) return;
      optsRef.current.onMove(e, stateRef.current);
    };

    const handleUp = (e: MouseEvent) => {
      if (!isDraggingRef.current || stateRef.current === null) return;
      optsRef.current.onEnd?.(e, stateRef.current);
      isDraggingRef.current = false;
      stateRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  const startDrag = useCallback((e: React.MouseEvent) => {
    const state = optsRef.current.onStart?.(e) ?? null;
    if (state === null) return;
    stateRef.current = state;
    isDraggingRef.current = true;
  }, []);

  return { startDrag, isDragging: isDraggingRef.current };
}
