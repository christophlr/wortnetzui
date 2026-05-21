import { useRef, useCallback, useReducer, useEffect } from 'react';

export interface UndoStackOptions {
  capacity?: number;
}

interface UndoState<T> {
  history: T[];
  index: number;
}

export function useUndoStack<T>(
  getState: () => T,
  applyState: (state: T) => void,
  options: UndoStackOptions = {}
) {
  const { capacity = 30 } = options;

  // Refs hold the canonical state so push/undo/redo never read stale closures.
  const stateRef = useRef<UndoState<T>>({ history: [structuredClone(getState())], index: 0 });
  // Trigger re-renders so canUndo/canRedo stay reactive.
  const [, forceRender] = useReducer((n: number) => n + 1, 0);

  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const push = useCallback((nextState: T) => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const { history, index } = stateRef.current;
    const truncated = history.slice(0, index + 1);
    const next = [...truncated, structuredClone(nextState)].slice(-capacity);
    stateRef.current = { history: next, index: next.length - 1 };
    forceRender();
  }, [capacity]);

  const pushDebounced = useCallback((ms: number, nextState?: T) => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }
    const snapshot = nextState !== undefined ? structuredClone(nextState) : null;
    debounceTimerRef.current = window.setTimeout(() => {
      const s = snapshot ?? structuredClone(getState());
      const { history, index } = stateRef.current;
      const truncated = history.slice(0, index + 1);
      const next = [...truncated, s].slice(-capacity);
      stateRef.current = { history: next, index: next.length - 1 };
      forceRender();
      debounceTimerRef.current = null;
    }, ms);
  }, [getState, capacity]);

  const undo = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const { history, index } = stateRef.current;
    if (index <= 0) return;
    const newIndex = index - 1;
    stateRef.current = { history, index: newIndex };
    applyState(structuredClone(history[newIndex]));
    forceRender();
  }, [applyState]);

  const redo = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const { history, index } = stateRef.current;
    if (index >= history.length - 1) return;
    const newIndex = index + 1;
    stateRef.current = { history, index: newIndex };
    applyState(structuredClone(history[newIndex]));
    forceRender();
  }, [applyState]);

  const { index, history } = stateRef.current;

  return {
    push,
    pushDebounced,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
}
