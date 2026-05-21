import { EdgeAppearanceSettings, NodeShape } from '../networkTheme';
import { ToolId } from '../components/Toolbar';
import type { Network3DHandle } from '../components/Network3D';
import type { Modulator } from '../animation/Modulator';
import type { TrackMeta } from '../animation/Track';

export type { Modulator } from '../animation/Modulator';
export type { Track, TrackMeta } from '../animation/Track';

export type Keyframe = {
  time: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  handleInPos?: { x: number; y: number; z: number };
  handleOutPos?: { x: number; y: number; z: number };
  handleInTgt?: { x: number; y: number; z: number };
  handleOutTgt?: { x: number; y: number; z: number };
  mode?: 'aligned' | 'broken';
  tension?: number;
  tensionHandleIn?: number;
  tensionHandleOut?: number;
  tensionHandleInTime?: number;
  tensionHandleOutTime?: number;
};

export type PhysicsKeyframe = {
  time: number;
  value: number;
  handleIn?: number;
  handleOut?: number;
  handleInTime?: number;
  handleOutTime?: number;
  mode?: 'aligned' | 'broken';
};

export type SceneMarker = { time: number; label: string };

export type TimelineState = {
  cameraKeyframes: Keyframe[];
  physicsKeyframes: Record<string, PhysicsKeyframe[]>;
  sceneMarkers: SceneMarker[];
  trackMeta: Record<string, TrackMeta>;
};

export interface WortnetzContextType {
  // App State
  viewMode: '2D' | '3D';
  setViewMode: (mode: '2D' | '3D') => void;
  themeMode: 'light' | 'hybrid' | 'dark';
  setThemeMode: (mode: 'light' | 'hybrid' | 'dark') => void;
  themeAuto: boolean;
  setThemeAuto: (auto: boolean) => void;

  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
  canvasAspectRatio: string;
  setCanvasAspectRatio: (ratio: string) => void;
  zoomValue: number;
  setZoomValue: (val: number) => void;
  
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  timelineHeight: number;
  setTimelineHeight: (height: number) => void;
  
  isNetworkReady: boolean;
  setIsNetworkReady: (ready: boolean) => void;
  initProgress: number;
  setInitProgress: (prog: number | ((p: number) => number)) => void;

  // Project State
  inputText: string;
  setInputText: (text: string) => void;
  parseMode: 'sentence' | 'word' | 'both';
  setParseMode: (mode: 'sentence' | 'word' | 'both') => void;
  styleSettings: {
    edgeOpacity: number;
    edgeWidth: number;
    nodeScale: number;
    nodeShape: NodeShape;
    nodeBorderWidth: number;
    depthSizeEnabled: boolean;
    depthSizeStrength: number;
  };
  setStyleSettings: React.Dispatch<React.SetStateAction<{
    edgeOpacity: number;
    edgeWidth: number;
    nodeScale: number;
    nodeShape: NodeShape;
    nodeBorderWidth: number;
    depthSizeEnabled: boolean;
    depthSizeStrength: number;
  }>>;
  physicsParams: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
    verticalOrder: number;
    pulse: number;
  };
  setPhysicsParams: React.Dispatch<React.SetStateAction<{
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
    verticalOrder: number;
    pulse: number;
  }>>;
  visualSettings: {
    nodesVisible: boolean;
    edgesVisible: boolean;
    radialBiasScale: number;
    radialBiasOpacity: number;
    gradientOrigin: string;
    gradientPeriphery: string;
    glitchActive: boolean;
    glitchBrushRadius: number;
    glitchFeather: number;
    pathSmoothness: number;
    pathCameraFollow: boolean;
  };
  setVisualSettings: React.Dispatch<React.SetStateAction<{
    nodesVisible: boolean;
    edgesVisible: boolean;
    radialBiasScale: number;
    radialBiasOpacity: number;
    gradientOrigin: string;
    gradientPeriphery: string;
    glitchActive: boolean;
    glitchBrushRadius: number;
    glitchFeather: number;
    pathSmoothness: number;
    pathCameraFollow: boolean;
  }>>;
  edgeAppearance: EdgeAppearanceSettings;
  setEdgeAppearance: (app: EdgeAppearanceSettings) => void;

  // Timeline / Playback
  isPlaying: boolean;
  setIsPlaying: (val: boolean | ((p: boolean) => boolean)) => void;
  isRecording: boolean;
  setIsRecording: (val: boolean | ((p: boolean) => boolean)) => void;
  playheadPosition: number;
  setPlayheadPosition: React.Dispatch<React.SetStateAction<number>>;
  timecode: string;
  setTimecode: (val: string) => void;
  
  cameraKeyframes: Keyframe[];
  setCameraKeyframes: React.Dispatch<React.SetStateAction<Keyframe[]>>;
  physicsKeyframes: Record<string, PhysicsKeyframe[]>;
  setPhysicsKeyframes: React.Dispatch<React.SetStateAction<Record<string, PhysicsKeyframe[]>>>;
  sceneMarkers: SceneMarker[];
  setSceneMarkers: React.Dispatch<React.SetStateAction<SceneMarker[]>>;
  selectedKeyframes: { track: string; time: number }[];
  setSelectedKeyframes: React.Dispatch<React.SetStateAction<{ track: string; time: number }[]>>;

  // Track-level animation tuning (Phase 3).
  // Keyed by trackId (PHYS_TRACK_PARAM key, e.g. 'phys-rep'). Defaults to glide=0, no modulator.
  trackMeta: Record<string, TrackMeta>;
  setTrackMeta: React.Dispatch<React.SetStateAction<Record<string, TrackMeta>>>;
  handleSetTrackGlide: (trackId: string, seconds: number) => void;
  handleSetTrackModulator: (trackId: string, modulator: Modulator | null) => void;

  // Per-track recording arm (Phase 3.5). Defaults to all tracks armed.
  armedTracks: ReadonlySet<string>;
  handleToggleTrackArm: (trackId: string) => void;
  handleCommitRecording: (result: import('../animation/Recorder').RecorderResult) => void;

  // Refs
  network3DRef: React.RefObject<Network3DHandle | null>;
  cameraKeyframesRef: React.MutableRefObject<Keyframe[]>;
  physicsKeyframesRef: React.MutableRefObject<Record<string, PhysicsKeyframe[]>>;
  sceneMarkersRef: React.MutableRefObject<SceneMarker[]>;
  selectedKeyframesRef: React.MutableRefObject<{ track: string; time: number }[]>;
  playheadRef: React.MutableRefObject<number>;
  isRecordingRef: React.MutableRefObject<boolean>;
  trackMetaRef: React.MutableRefObject<Record<string, TrackMeta>>;
  armedTracksRef: React.MutableRefObject<ReadonlySet<string>>;

  selectedNode: any;
  setSelectedNode: (node: any) => void;
  
  // Derived
  effectivePhysicsParams: any;
  previewIsDark: boolean;
  uiIsDark: boolean;
  
  // Actions
  handleCaptureKeyframe: (atTime?: number) => void;
  handleCreateKeyframesAtMarker: (time: number) => void;
  handleMoveKeyframe: (trackId: string, oldTime: number, newTime: number) => void;
  handleDeleteKeyframe: (trackId: string, time: number) => void;
  handleRippleDeleteKeyframe: (trackId: string, time: number) => void;
  handleResetTrack: (trackId: string) => void;
  handleSetHandle: (trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset?: number) => void;
  handleClearHandle: (trackId: string, time: number) => void;
  handleSetInterpolation: (trackId: string, time: number, mode: 'aligned' | 'broken') => void;
  handleDuplicateKeyframe: (trackId: string, srcTime: number, destTime: number) => void;
  handleAddSceneMarker: (time: number, label?: string) => void;
  handleRenameSceneMarker: (time: number, label?: string) => void;
  handleMoveSceneMarker: (oldTime: number, newTime: number) => void;
  handleDropSceneMarker: (fromTime: number, toTime: number) => void;
  handleDeleteSceneMarker: (time: number) => void;

  handleSetValue: (trackId: string, time: number, value: number) => void;
  handleSetHandle2D: (trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset?: number) => void;
  handleCameraChange: () => void;
  handleTogglePhysicsKeyframe: (trackId: string, value: number) => void;
  handleKeyframeSelect: (track: string, time: number, additive: boolean) => void;
  handleSelectKeyframes: (kfs: { track: string; time: number }[]) => void;
  handlePhysicsChange: (params: Partial<WortnetzContextType['physicsParams']>) => void;
  handleDragStart: () => void;
  handleDragEnd: () => void;
  handleCancelDrag: () => void;
  
  // History
  pushHistory: (next: TimelineState) => void;
  getTimelineState: () => TimelineState;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Workspace
  handleSave: () => void;
  handleLoad: () => void;
}
