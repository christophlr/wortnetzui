import { useState, useCallback, useRef, useEffect } from 'react';

export interface UndoStackOptions {
  capacity?: number;
}

export function useUndoStack<T>(
  getState: () => T,
  applyState: (state: T) => void,
  options: UndoStackOptions = {}
) {
  const { capacity = 50 } = options;
  const [history, setHistory] = useState<T[]>(() => [getState()]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    
    setHistory(h => {
      const nextH = [...h.slice(0, currentIndex + 1), nextState].slice(-capacity);
      return nextH;
    });
    setCurrentIndex(i => Math.min(i + 1, capacity - 1));
  }, [currentIndex, capacity]);

  const pushDebounced = useCallback((ms: number) => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = window.setTimeout(() => {
      push(getState());
      debounceTimerRef.current = null;
    }, ms);
  }, [push, getState]);

  const undo = useCallback(() => {
    if (currentIndex <= 0) return;
    
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const prevIndex = currentIndex - 1;
    applyState(history[prevIndex]);
    setCurrentIndex(prevIndex);
  }, [currentIndex, history, applyState]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return;

    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const nextIndex = currentIndex + 1;
    applyState(history[nextIndex]);
    setCurrentIndex(nextIndex);
  }, [currentIndex, history, applyState]);

  return {
    push,
    pushDebounced,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
