import { useCallback } from 'react';
import type { Modulator } from '../animation/Modulator';

export type WorkspaceState = {
  // Schema version. Absent → v0 (pre-Phase 3). Current writer is v1.
  // New fields are added optional + non-breaking; readers fall back to defaults.
  version?: 1;
  inputText: string;
  parseMode: 'sentence' | 'word' | 'both';
  styleSettings: any;
  physicsParams: any;
  viewMode: '2D' | '3D';
  cameraKeyframes: any[];
  physicsKeyframes: Record<string, any[]>;
  sceneMarkers: any[];
  // Phase 3: per-track Glide + Modulator. Only non-default entries are persisted.
  trackMeta?: Record<string, { glide?: number; modulator?: Modulator }>;
};

export function serializeTrackMeta(meta: Record<string, { glide: number; modulator?: Modulator }> | undefined) {
  if (!meta) return undefined;
  const out: Record<string, { glide?: number; modulator?: Modulator }> = {};
  for (const [trackId, m] of Object.entries(meta)) {
    const entry: { glide?: number; modulator?: Modulator } = {};
    if (m.glide && m.glide > 0) entry.glide = m.glide;
    if (m.modulator) entry.modulator = m.modulator;
    if (Object.keys(entry).length > 0) out[trackId] = entry;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export default function useWorkspaceIO(
  getWorkspaceState: () => WorkspaceState,
  loadWorkspaceState: (state: Partial<WorkspaceState>) => void
) {
  const handleSave = useCallback(() => {
    const state = getWorkspaceState();
    const persisted: WorkspaceState = {
      ...state,
      version: 1,
      trackMeta: serializeTrackMeta(state.trackMeta as Record<string, { glide: number; modulator?: Modulator }> | undefined),
    };
    const blob = new Blob([JSON.stringify(persisted, null, 2)], { type: 'application/json' });
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
