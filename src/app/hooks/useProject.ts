import { useCallback } from 'react';
import { useWortnetz } from '../context/WortnetzContext';

export function useProject() {
  const {
    inputText, setInputText,
    parseMode, setParseMode,
    styleSettings, setStyleSettings,
    physicsParams, setPhysicsParams,
    viewMode, setViewMode,
    cameraKeyframes, setCameraKeyframes,
    physicsKeyframes, setPhysicsKeyframes,
    sceneMarkers, setSceneMarkers
  } = useWortnetz();

  const handleSave = useCallback(() => {
    const state = {
      inputText,
      parseMode,
      styleSettings,
      physicsParams,
      viewMode,
      cameraKeyframes,
      physicsKeyframes,
      sceneMarkers
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprachvernetzungen-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [inputText, parseMode, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const s = JSON.parse(ev.target?.result as string);
            if (s.inputText) setInputText(s.inputText);
            if (s.parseMode) setParseMode(s.parseMode);
            if (s.styleSettings) setStyleSettings(s.styleSettings);
            if (s.physicsParams) {
              setPhysicsParams((prev: any) => ({
                ...prev,
                ...s.physicsParams,
                verticalOrder: s.physicsParams.verticalOrder ?? 0,
                pulse: s.physicsParams.pulse ?? 0
              }));
            }
            if (s.viewMode) setViewMode(s.viewMode);
            if (s.cameraKeyframes) setCameraKeyframes(s.cameraKeyframes);
            if (s.physicsKeyframes) setPhysicsKeyframes(s.physicsKeyframes);
            if (s.sceneMarkers) setSceneMarkers(s.sceneMarkers);
          } catch (err) {
            console.error('Failed to load state:', err);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setInputText, setParseMode, setStyleSettings, setPhysicsParams, setViewMode, setCameraKeyframes, setPhysicsKeyframes, setSceneMarkers]);

  return {
    handleSave,
    handleLoad
  };
}
