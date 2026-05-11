import { useWortnetz } from '../context/WortnetzContext';

export function useHistory() {
  const {
    undo,
    redo,
    pushHistory,
    getTimelineState,
    canUndo,
    canRedo
  } = useWortnetz();

  return {
    undo,
    redo,
    pushHistory,
    getTimelineState,
    canUndo,
    canRedo
  };
}
