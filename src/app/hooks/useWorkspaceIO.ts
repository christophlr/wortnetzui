import { useCallback } from 'react';
import type { TimelineState } from './useTimelineHistory';
import type { GradientSettings, NodeAppearanceSettings, EdgeAppearanceSettings } from '../networkTheme';

type WorkspaceState = {
  inputText: string;
  parseMode: 'sentence' | 'word' | 'both';
  gradientSettings: GradientSettings;
  styleSettings: any;
  physicsParams: any;
  viewMode: '2D' | '3D';
  cameraKeyframes: any[];
  physicsKeyframes: Record<string, any[]>;
  sceneMarkers: any[];
};

export default function useWorkspaceIO(
  getWorkspaceState: () => WorkspaceState,
  loadWorkspaceState: (state: Partial<WorkspaceState>) => void
) {
  const handleSave = useCallback(() => {
    const state = getWorkspaceState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a');
    a.href = url; a.download = `sprachvernetzungen-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }, [getWorkspaceState]);

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
            loadWorkspaceState(s);
          } catch (err) { console.error('Failed to load state:', err); }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [loadWorkspaceState]);

  return { handleSave, handleLoad };
}
