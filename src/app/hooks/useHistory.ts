import { useCallback, useState, useRef } from 'react';
import { useWortnetz, type TimelineState, EMPTY_PHYSICS_KFS } from '../context/WortnetzContext';

export function useHistory() {
  const {
    cameraKeyframes, setCameraKeyframes,
    physicsKeyframes, setPhysicsKeyframes,
    sceneMarkers, setSceneMarkers,
    cameraKeyframesRef, physicsKeyframesRef, sceneMarkersRef
  } = useWortnetz();

  const [keyframeHistory, setKeyframeHistory] = useState<TimelineState[]>([{ 
    cameraKeyframes: [], 
    physicsKeyframes: EMPTY_PHYSICS_KFS, 
    sceneMarkers: [] 
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const getTimelineState = useCallback((): TimelineState => ({
    cameraKeyframes: cameraKeyframesRef.current,
    physicsKeyframes: physicsKeyframesRef.current,
    sceneMarkers: sceneMarkersRef.current,
  }), [cameraKeyframesRef, physicsKeyframesRef, sceneMarkersRef]);

  const pushHistory = useCallback((next: TimelineState) => {
    setKeyframeHistory(h => {
      const newHistory = [...h.slice(0, historyIndex + 1), next].slice(-50);
      return newHistory;
    });
    setHistoryIndex(i => {
      const nextIndex = Math.min(i + 1, 49);
      return nextIndex;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const entry = keyframeHistory[historyIndex - 1];
    setCameraKeyframes(entry.cameraKeyframes ?? []);
    setPhysicsKeyframes(entry.physicsKeyframes ?? EMPTY_PHYSICS_KFS);
    setSceneMarkers(entry.sceneMarkers ?? []);
    setHistoryIndex(i => i - 1);
  }, [historyIndex, keyframeHistory, setCameraKeyframes, setPhysicsKeyframes, setSceneMarkers]);

  const redo = useCallback(() => {
    if (historyIndex >= keyframeHistory.length - 1) return;
    const entry = keyframeHistory[historyIndex + 1];
    setCameraKeyframes(entry.cameraKeyframes ?? []);
    setPhysicsKeyframes(entry.physicsKeyframes ?? EMPTY_PHYSICS_KFS);
    setSceneMarkers(entry.sceneMarkers ?? []);
    setHistoryIndex(i => i + 1);
  }, [historyIndex, keyframeHistory, setCameraKeyframes, setPhysicsKeyframes, setSceneMarkers]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < keyframeHistory.length - 1;

  return {
    undo,
    redo,
    pushHistory,
    getTimelineState,
    canUndo,
    canRedo,
    historyIndex,
    keyframeHistory
  };
}
