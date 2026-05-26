import type { ReactNode, RefObject } from 'react';
import type { Modulator } from '../../animation/Modulator';
import type { TrackMeta } from '../../animation/Track';

/* ── Shared timeline types ── */

export type KeyframeInterpolation = 'auto' | 'linear' | 'hold';

export type PhysicsKeyframe = {
  time: number;
  value: number;
  handleIn?: number;
  handleOut?: number;
  handleInTime?: number;
  handleOutTime?: number;
  mode?: 'aligned' | 'broken';
  interpolation?: KeyframeInterpolation;
};

export type SceneMarker = { time: number; label: string };

export interface ViewWindow {
  start: number;
  end: number;
}

/* ── Easing type (inferred from handle data, NOT stored) ── */

export type EasingType = 'auto' | 'linear' | 'hold' | 'easyEase' | 'easeIn' | 'easeOut' | 'custom';

/**
 * Infer the easing type from a keyframe's handle data.
 * This is a UI-only concept — the actual interpolation uses the raw handle values.
 * The easing type drives which keyframe icon shape is rendered.
 */
export function inferEasingType(kf: {
  handleIn?: number;
  handleOut?: number;
  handleInTime?: number;
  handleOutTime?: number;
  interpolation?: KeyframeInterpolation;
}, prevKf?: { time: number; value?: number } | null, nextKf?: { time: number; value?: number } | null, curValue?: number): EasingType {
  if (kf.interpolation === 'linear' || kf.interpolation === 'hold') return kf.interpolation;
  if (kf.interpolation === 'auto') return 'auto';
  const hasIn = kf.handleIn !== undefined;
  const hasOut = kf.handleOut !== undefined;

  // No handles set → Auto (Catmull-Rom auto-tangents)
  if (!hasIn && !hasOut) return 'auto';

  const slopeIn = kf.handleIn ?? 0;
  const slopeOut = kf.handleOut ?? 0;
  const eps = 0.001;

  // Both handles explicitly flat → Easy Ease
  if (hasIn && hasOut && Math.abs(slopeIn) < eps && Math.abs(slopeOut) < eps) {
    return 'easyEase';
  }

  // Only in-handle flat → Ease In (slow arrival)
  if (hasIn && Math.abs(slopeIn) < eps && !hasOut) {
    return 'easeIn';
  }

  // Only out-handle flat → Ease Out (slow departure)
  if (hasOut && Math.abs(slopeOut) < eps && !hasIn) {
    return 'easeOut';
  }

  // Check for linear: handles match the chord slope
  if (hasIn && hasOut && prevKf && nextKf && curValue !== undefined) {
    const chordIn = prevKf.value !== undefined
      ? (curValue - prevKf.value) / (1 /* normalized — we just check if slopes match */)
      : null;
    const chordOut = nextKf.value !== undefined
      ? (nextKf.value - curValue) / (1)
      : null;
    // This is approximate — linear detection is tricky with Hermite
    // For now, if both handles are set and non-zero, call it custom
  }

  return 'custom';
}

/* ── Layout constants ── */

export const LABEL_W = 224;
export const TRACK_H = 26;
export const GRAPH_H = 120;
export const EASING_H = 56;      // value graph height
export const MINI_CURVE_H = 18;  // mini-curve height inside dopesheet track

/* ── Track groups ── */

/**
 * Track-group metadata. `groupKey` resolves to `timeline.track.<groupKey>`.
 * Physics tracks carry a `paramKey` that maps to the param's display name
 * via `sidebar.tab.physics.param.<paramKey>.name`. Camera tracks use
 * `groupKey` directly (`timeline.track.keyframes`).
 */
export const TRACK_GROUPS = [
  {
    id: 'camera', groupKey: 'camera', color: 'cyan' as const,
    tracks: [
      { id: 'camera-keyframes', trackKey: 'keyframes', kfs: [] as number[], graph: false },
    ],
  },
  {
    id: 'physics', groupKey: 'physics', color: 'orange' as const,
    tracks: [
      { id: 'phys-rep', paramKey: 'repulsion',    kfs: [] as number[], graph: false },
      { id: 'phys-spk', paramKey: 'springK',      kfs: [] as number[], graph: false },
      { id: 'phys-dmp', paramKey: 'damping',      kfs: [] as number[], graph: false },
      { id: 'phys-lnk', paramKey: 'linkDistance', kfs: [] as number[], graph: false },
      { id: 'phys-grv', paramKey: 'gravity',      kfs: [] as number[], graph: false },
      { id: 'phys-trb', paramKey: 'turbulence',   kfs: [] as number[], graph: false },
      { id: 'phys-vto', paramKey: 'verticalOrder',kfs: [] as number[], graph: false },
    ],
  },
  {
    id: 'effects', groupKey: 'effects', color: 'purple' as const,
    tracks: [
      { id: 'fx-blm',         paramKey: 'bloomIntensity',    kfs: [] as number[], graph: false },
      { id: 'fx-blm-rad',     paramKey: 'bloomRadius',       kfs: [] as number[], graph: false },
      { id: 'fx-blm-thr',     paramKey: 'bloomThreshold',    kfs: [] as number[], graph: false },
      { id: 'fx-blm-sel',     paramKey: 'selectiveRatio',    kfs: [] as number[], graph: false },
      { id: 'fx-blm-flk-spd', paramKey: 'flickerSpeed',      kfs: [] as number[], graph: false },
      { id: 'fx-node-scale',  paramKey: 'nodeScale',         kfs: [] as number[], graph: false },
      { id: 'fx-edge-opacity',paramKey: 'edgeOpacity',       kfs: [] as number[], graph: false },
      { id: 'fx-rad-bias',    paramKey: 'radialBias',        kfs: [] as number[], graph: false },
      { id: 'fx-glc-rad',     paramKey: 'glitchBrushRadius', kfs: [] as number[], graph: false },
      { id: 'fx-glc-fth',     paramKey: 'glitchFeather',     kfs: [] as number[], graph: false },
      { id: 'fx-pth-sm',      paramKey: 'pathSmoothness',    kfs: [] as number[], graph: false },
      { id: 'fx-hue-shift',   paramKey: 'hueShift',          kfs: [] as number[], graph: false },
    ],
  },
];

/* ── Color maps ── */

export const COLOR = {
  cyan:   { dot: 'bg-wn-timeline-cyan-dot',   border: 'border-l-wn-timeline-cyan-border',   kfFill: 'var(--wn-timeline-cyan-kf-fill)',   trackBg: 'bg-wn-timeline-cyan-track-bg',   graphStroke: 'var(--wn-timeline-cyan-graph-stroke)',   miniCurve: 'rgba(59, 130, 246, 0.25)' },
  orange: { dot: 'bg-wn-timeline-orange-dot', border: 'border-l-wn-timeline-orange-border', kfFill: 'var(--wn-timeline-orange-kf-fill)', trackBg: 'bg-wn-timeline-orange-track-bg', graphStroke: 'var(--wn-timeline-orange-graph-stroke)', miniCurve: 'rgba(249, 115, 22, 0.25)' },
  purple: { dot: 'bg-wn-timeline-purple-dot', border: 'border-l-wn-timeline-purple-border', kfFill: 'var(--wn-timeline-purple-kf-fill)', trackBg: 'bg-wn-timeline-purple-track-bg', graphStroke: 'var(--wn-timeline-purple-graph-stroke)', miniCurve: 'rgba(168, 85, 247, 0.25)' },
};

/* ── Timeline props ── */

export interface TimelineProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop?: () => void;
  playheadPosition: number;
  onPlayheadChange: (pos: number) => void;
  selectedKeyframes: { track: string; time: number }[];
  onKeyframeSelect: (track: string, time: number, additive: boolean) => void;
  onSelectKeyframes?: (kfs: { track: string; time: number }[]) => void;
  cameraKeyframes?: Array<{
    time: number;
    position: any;
    target: any;
    handleInPos?: any;
    handleOutPos?: any;
    handleInTgt?: any;
    handleOutTgt?: any;
    mode?: 'aligned' | 'broken';
    tension?: number;
    tensionHandleIn?: number;
    tensionHandleOut?: number;
    tensionHandleInTime?: number;
    tensionHandleOutTime?: number;
    interpolation?: KeyframeInterpolation;
  }>;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  onCaptureKeyframe?: () => void;
  onMoveKeyframe?: (trackId: string, oldTime: number, newTime: number) => void;
  onSetHandle?: (trackId: string, time: number, side: 'out' | 'in', weight: number) => void;
  onSetHandle2D?: (trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset?: number) => void;
  onClearHandle?: (trackId: string, time: number) => void;
  onSetValue?: (trackId: string, time: number, value: number) => void;
  onSetInterpolation?: (trackId: string, time: number, mode: 'aligned' | 'broken') => void;
  onSetKeyframeEasing?: (trackId: string, time: number, easing: KeyframeInterpolation) => void;
  onDeleteKeyframe?: (trackId: string, time: number) => void;
  onRippleDeleteKeyframe?: (trackId: string, time: number) => void;
  onResetTrack?: (trackId: string) => void;
  onDuplicateKeyframe?: (trackId: string, srcTime: number, destTime: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  timecode?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  height?: number;
  sceneMarkers?: SceneMarker[];
  onAddSceneMarker?: (time: number) => void;
  onMoveSceneMarker?: (oldTime: number, newTime: number) => void;
  onDropSceneMarker?: (fromTime: number, toTime: number) => void;
  onDeleteSceneMarker?: (time: number) => void;
  onRenameSceneMarker?: (time: number, label?: string) => void;
  onCreateKeyframesAtMarker?: (time: number) => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  onCancelDrag?: () => void;

  // Per-track LFO (Phase 3.4)
  trackMeta?: Record<string, TrackMeta>;
  onSetTrackModulator?: (trackId: string, modulator: Modulator | null) => void;

  // Per-track recording arm (Phase 3.5)
  armedTracks?: ReadonlySet<string>;
  onToggleTrackArm?: (trackId: string) => void;
}
