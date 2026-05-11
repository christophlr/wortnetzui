import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { defaultGradientSettings, defaultNodeAppearance, defaultEdgeAppearance, type GradientSettings, type NodeShape, type NodeAppearanceSettings, type EdgeAppearanceSettings } from '../networkTheme';
import { ToolId } from '../components/Toolbar';
import { TIMELINE_DURATION } from '../constants';
import { evaluateHermite, computeCatmullRomTangent } from '../easing';
import type { Network3DHandle } from '../components/Network3D';

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
export type TimelineState = { cameraKeyframes: Keyframe[]; physicsKeyframes: Record<string, PhysicsKeyframe[]>; sceneMarkers: SceneMarker[] };

export const EMPTY_PHYSICS_KFS = { 
  'phys-rep': [] as PhysicsKeyframe[], 
  'phys-spk': [] as PhysicsKeyframe[], 
  'phys-dmp': [] as PhysicsKeyframe[],
  'phys-min': [] as PhysicsKeyframe[],
  'phys-lnk': [] as PhysicsKeyframe[],
  'phys-grv': [] as PhysicsKeyframe[],
  'phys-trb': [] as PhysicsKeyframe[],
  'phys-vto': [] as PhysicsKeyframe[],
  'phys-pls': [] as PhysicsKeyframe[]
};

export const PHYS_TRACK_PARAM: Record<string, string> = { 
  'phys-rep': 'repulsion', 
  'phys-spk': 'springK', 
  'phys-dmp': 'damping',
  'phys-min': 'minSpeed',
  'phys-lnk': 'linkDistance',
  'phys-grv': 'gravity',
  'phys-trb': 'turbulence',
  'phys-vto': 'verticalOrder',
  'phys-pls': 'pulse'
};

export function interpolatePhysicsParam(sorted: PhysicsKeyframe[], time: number, trackId?: string): number | null {
  if (sorted.length === 0) return null;
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const segDur = b.time - a.time;
      if (segDur === 0) return a.value;
      const tRaw = (time - a.time) / segDur;
      
      const prevTime = i > 0 ? sorted[i - 1].time : null;
      const prevVal = i > 0 ? sorted[i - 1].value : null;
      const nextTime = i + 2 < sorted.length ? sorted[i + 2].time : null;
      const nextVal = i + 2 < sorted.length ? sorted[i + 2].value : null;

      const m0 = a.handleOut ?? (prevTime === null ? 0 : computeCatmullRomTangent(prevTime, prevVal, a.time, a.value, b.time, b.value));
      const m1 = b.handleIn ?? (nextTime === null ? 0 : computeCatmullRomTangent(a.time, a.value, b.time, b.value, nextTime, nextVal));

      const val = evaluateHermite(tRaw, a.value, m0, b.value, m1, segDur);
      
      return trackId === 'phys-grv' ? val : Math.max(0, val);
    }
  }
  return null;
}

export interface WortnetzContextType {
  // App State
  viewMode: '2D' | '3D';
  setViewMode: (mode: '2D' | '3D') => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  renderMode: 'edit' | 'render';
  setRenderMode: (mode: 'edit' | 'render') => void;
  
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
  canvasAspectRatio: string;
  setCanvasAspectRatio: (ratio: string) => void;
  zoomValue: number;
  setZoomValue: (val: number) => void;
  
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  inspectorWidth: number;
  setInspectorWidth: (width: number) => void;
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
  gradientSettings: GradientSettings;
  setGradientSettings: (settings: GradientSettings) => void;
  styleSettings: any;
  setStyleSettings: (updater: any) => void;
  physicsParams: any;
  setPhysicsParams: (updater: any) => void;
  visualSettings: any;
  setVisualSettings: (settings: any) => void;
  nodeAppearance: NodeAppearanceSettings;
  setNodeAppearance: (app: NodeAppearanceSettings) => void;
  edgeAppearance: EdgeAppearanceSettings;
  setEdgeAppearance: (app: EdgeAppearanceSettings) => void;
  lastAppliedPreset: 'outline'|'filled'|null;
  setLastAppliedPreset: (preset: 'outline'|'filled'|null) => void;

  // Timeline / Playback
  isPlaying: boolean;
  setIsPlaying: (val: boolean | ((p: boolean) => boolean)) => void;
  isRecording: boolean;
  setIsRecording: (val: boolean | ((p: boolean) => boolean)) => void;
  playheadPosition: number;
  setPlayheadPosition: (val: number) => void;
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

  // Refs
  network3DRef: React.RefObject<Network3DHandle>;
  cameraKeyframesRef: React.MutableRefObject<Keyframe[]>;
  physicsKeyframesRef: React.MutableRefObject<Record<string, PhysicsKeyframe[]>>;
  sceneMarkersRef: React.MutableRefObject<SceneMarker[]>;
  selectedKeyframesRef: React.MutableRefObject<{ track: string; time: number }[]>;
  playheadRef: React.MutableRefObject<number>;
  isRecordingRef: React.MutableRefObject<boolean>;

  selectedNode: any;
  setSelectedNode: (node: any) => void;
  
  // Derived
  effectivePhysicsParams: any;
  previewIsDark: boolean;
  uiIsDark: boolean;
  handleCaptureKeyframe: () => void;
  handleMoveKeyframe: (trackId: string, oldTime: number, newTime: number) => void;
  handleDeleteKeyframe: (trackId: string, time: number) => void;
  handleSetHandle: (trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset?: number) => void;
  handleClearHandle: (trackId: string, time: number) => void;
  handleSetInterpolation: (trackId: string, time: number, mode: 'aligned' | 'broken') => void;
  handleDuplicateKeyframe: (trackId: string, srcTime: number, destTime: number) => void;
  handleAddSceneMarker: (time: number, label: string) => void;
  handleRenameSceneMarker: (time: number, label: string) => void;
  handleMoveSceneMarker: (oldTime: number, newTime: number) => void;
  pushHistory: (next: TimelineState) => void;
  getTimelineState: () => TimelineState;
}

const WortnetzContext = createContext<WortnetzContextType | undefined>(undefined);

export function WortnetzProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [selectedKeyframes, setSelectedKeyframes] = useState<{ track: string; time: number }[]>([]);
  const [sceneMarkers, setSceneMarkers] = useState<SceneMarker[]>([]);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [inputText, setInputText] = useState(`Blue watched as a word or phrase materialised in scintillating sparks...`);
  const [parseMode, setParseMode] = useState<'sentence' | 'word' | 'both'>('sentence');
  const [gradientSettings, setGradientSettings] = useState<GradientSettings>(defaultGradientSettings);
  const [styleSettings, setStyleSettings] = useState({
    edgeOpacity: 0.35, edgeWidth: 2, nodeScale: 1,
    nodeShape: 'rectangle' as NodeShape,
    nodeBorderWidth: 2,
    depthSizeEnabled: false,
    depthSizeStrength: 50,
  });
  const [physicsParams, setPhysicsParams] = useState({ repulsion: 1500, springK: 0.06, damping: 0.88, minSpeed: 0.5, linkDistance: 80, gravity: 0, turbulence: 0, verticalOrder: 0, pulse: 0 });
  const [cameraKeyframes, setCameraKeyframes] = useState<Keyframe[]>([]);
  const [physicsKeyframes, setPhysicsKeyframes] = useState<Record<string, PhysicsKeyframe[]>>(EMPTY_PHYSICS_KFS);
  const [inspectorWidth, setInspectorWidth] = useState(360);
  const [timelineHeight, setTimelineHeight] = useState(320);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNetworkReady, setIsNetworkReady] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState<string>('full');
  const [activeTool, setActiveTool] = useState<ToolId>('pointer');
  const [zoomValue, setZoomValue] = useState(50);
  const [visualSettings, setVisualSettings] = useState({
    nodesVisible: true, labelsVisible: true, edgesVisible: true, envVisible: true,
    radialBiasScale: 0.5, radialBiasOpacity: 0.5, gradientOrigin: '#4f46e5', gradientPeriphery: '#10b981',
    labelWeightMapping: 0.5, edgeFlowAnimation: false, envAtmosphereSeed: 123,
    glitchActive: false, glitchBrushRadius: 100, glitchFeather: 0.5,
    pathSmoothness: 0.5, pathCameraFollow: true
  });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [renderMode, setRenderMode] = useState<'edit' | 'render'>('edit');
  const [nodeAppearance, setNodeAppearance] = useState<NodeAppearanceSettings>(defaultNodeAppearance);
  const [lastAppliedPreset, setLastAppliedPreset] = useState<'outline'|'filled'|null>(null);
  const [edgeAppearance, setEdgeAppearance] = useState<EdgeAppearanceSettings>(defaultEdgeAppearance);

  const [keyframeHistory, setKeyframeHistory] = useState<TimelineState[]>([{ cameraKeyframes: [], physicsKeyframes: EMPTY_PHYSICS_KFS, sceneMarkers: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((next: TimelineState) => {
    setKeyframeHistory(h => {
      const newHistory = [...h.slice(0, historyIndex + 1), next].slice(-50);
      return newHistory;
    });
    setHistoryIndex(i => Math.min(i + 1, 49));
  }, [historyIndex]);

  const getTimelineState = useCallback(() => ({
    cameraKeyframes: cameraKeyframesRef.current,
    physicsKeyframes: physicsKeyframesRef.current,
    sceneMarkers: sceneMarkersRef.current
  }), []);

  const physicsKeyframesRef = useRef(physicsKeyframes);
  useEffect(() => { physicsKeyframesRef.current = physicsKeyframes; }, [physicsKeyframes]);

  const sceneMarkersRef = useRef(sceneMarkers);
  useEffect(() => { sceneMarkersRef.current = sceneMarkers; }, [sceneMarkers]);

  const selectedKeyframesRef = useRef(selectedKeyframes);
  useEffect(() => { selectedKeyframesRef.current = selectedKeyframes; }, [selectedKeyframes]);
  
  const isRecordingRef = useRef(isRecording);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  const cameraKeyframesRef = useRef(cameraKeyframes);
  useEffect(() => { cameraKeyframesRef.current = cameraKeyframes; }, [cameraKeyframes]);

  const network3DRef = useRef<Network3DHandle>(null);
  const playheadRef = useRef(playheadPosition);
  useEffect(() => { playheadRef.current = playheadPosition; }, [playheadPosition]);

  const effectivePhysicsParams = useMemo(() => {
    const next = { ...physicsParams };
    for (const [trackId, param] of Object.entries(PHYS_TRACK_PARAM)) {
      const sorted = [...(physicsKeyframes[trackId] ?? [])].sort((a, b) => a.time - b.time);
      const v = interpolatePhysicsParam(sorted, playheadPosition, trackId);
      if (v !== null) (next as Record<string, number>)[param] = v;
    }
    return next;
  }, [physicsParams, physicsKeyframes, playheadPosition]);

  const uiIsDark = themeMode === 'dark';
  const previewIsDark = themeMode === 'dark';

  // Handlers
  const handleCaptureKeyframe = useCallback(() => {
    const time = playheadRef.current;
    const prev = { cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: physicsKeyframesRef.current, sceneMarkers: sceneMarkersRef.current };
    
    // Capture camera
    const cam = network3DRef.current?.getCameraState();
    if (cam) {
      setCameraKeyframes(prevKfs => {
        const next = [...prevKfs.filter(k => Math.abs(k.time - time) > 0.01), { time, ...cam, mode: 'aligned' }].sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
    }

    // Capture all physics
    setPhysicsKeyframes(prevKfs => {
      const next = { ...prevKfs };
      for (const [trackId, param] of Object.entries(PHYS_TRACK_PARAM)) {
        const val = (physicsParams as any)[param];
        next[trackId] = [...(prevKfs[trackId] ?? []).filter(k => Math.abs(k.time - time) > 0.01), { time, value: val, mode: 'aligned' }].sort((a, b) => a.time - b.time);
      }
      physicsKeyframesRef.current = next;
      return next;
    });

    pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: physicsKeyframesRef.current });
  }, [physicsParams, pushHistory]);

  const handleMoveKeyframe = useCallback((trackId: string, oldTime: number, newTime: number) => {
    const prev = { cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: physicsKeyframesRef.current, sceneMarkers: sceneMarkersRef.current };
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevKfs => {
        const kf = prevKfs.find(k => Math.abs(k.time - oldTime) < 0.01);
        if (!kf) return prevKfs;
        const next = [...prevKfs.filter(k => Math.abs(k.time - oldTime) > 0.01), { ...kf, time: newTime }].sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
    } else if (trackId === 'scene-markers') {
      setSceneMarkers(prevMarkers => {
        const m = prevMarkers.find(k => Math.abs(k.time - oldTime) < 0.01);
        if (!m) return prevMarkers;
        const next = [...prevMarkers.filter(k => Math.abs(k.time - oldTime) > 0.01), { ...m, time: newTime }].sort((a, b) => a.time - b.time);
        sceneMarkersRef.current = next;
        return next;
      });
    } else {
      setPhysicsKeyframes(prevKfs => {
        const track = prevKfs[trackId] ?? [];
        const kf = track.find(k => Math.abs(k.time - oldTime) < 0.01);
        if (!kf) return prevKfs;
        const next = { ...prevKfs, [trackId]: [...track.filter(k => Math.abs(k.time - oldTime) > 0.01), { ...kf, time: newTime }].sort((a, b) => a.time - b.time) };
        physicsKeyframesRef.current = next;
        return next;
      });
    }
    pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: physicsKeyframesRef.current, sceneMarkers: sceneMarkersRef.current });
  }, [pushHistory]);

  const handleDeleteKeyframe = useCallback((trackId: string, time: number) => {
    const prev = { cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: physicsKeyframesRef.current, sceneMarkers: sceneMarkersRef.current };
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevKfs => {
        const next = prevKfs.filter(k => Math.abs(k.time - time) > 0.01);
        cameraKeyframesRef.current = next;
        return next;
      });
    } else {
      setPhysicsKeyframes(prevKfs => {
        const next = { ...prevKfs, [trackId]: (prevKfs[trackId] ?? []).filter(k => Math.abs(k.time - time) > 0.01) };
        physicsKeyframesRef.current = next;
        return next;
      });
    }
    pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: physicsKeyframesRef.current });
  }, [pushHistory]);

  const handleSetHandle = useCallback((trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset = 0.33) => {
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const next = prev.map(s => {
          if (Math.abs(s.time - time) >= 0.01) return s;
          const slopeKey = side === 'out' ? 'tensionHandleOut' : 'tensionHandleIn';
          const timeKey = side === 'out' ? 'tensionHandleOutTime' : 'tensionHandleInTime';
          const nextKf = { ...s, [slopeKey]: slope, [timeKey]: timeOffset };
          if (nextKf.mode !== 'broken') {
            nextKf.tensionHandleIn = slope;
            nextKf.tensionHandleInTime = timeOffset;
            nextKf.tensionHandleOut = slope;
            nextKf.tensionHandleOutTime = timeOffset;
          }
          return nextKf;
        });
        cameraKeyframesRef.current = next;
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prev => {
        const kfs = (prev[trackId] ?? []).map(k => {
          if (Math.abs(k.time - time) >= 0.01) return k;
          const slopeKey = side === 'out' ? 'handleOut' : 'handleIn';
          const timeKey = side === 'out' ? 'handleOutTime' : 'handleInTime';
          const nextKf = { ...k, [slopeKey]: slope, [timeKey]: timeOffset };
          if (nextKf.mode !== 'broken') {
            nextKf.handleIn = slope;
            nextKf.handleInTime = timeOffset;
            nextKf.handleOut = slope;
            nextKf.handleOutTime = timeOffset;
          }
          return nextKf;
        });
        const next = { ...prev, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
    }
  }, []);

  const handleClearHandle = useCallback((trackId: string, time: number) => {
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const next = prev.map(s => {
          if (Math.abs(s.time - time) >= 0.01) return s;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { tensionHandleIn: _a, tensionHandleOut: _b, tensionHandleInTime: _c, tensionHandleOutTime: _d, ...rest } = s;
          return rest;
        });
        cameraKeyframesRef.current = next;
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prev => {
        const kfs = (prev[trackId] ?? []).map(k => {
          if (Math.abs(k.time - time) >= 0.01) return k;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { handleIn: _a, handleOut: _b, handleInTime: _c, handleOutTime: _d, ...rest } = k;
          return rest;
        });
        const next = { ...prev, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
    }
  }, []);

  const handleSetInterpolation = useCallback((trackId: string, time: number, mode: 'aligned' | 'broken') => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const next = prevCkfs.map(s => {
          if (Math.abs(s.time - time) >= 0.01) return s;
          const nextKf = { ...s, mode };
          if (mode === 'aligned' && nextKf.tensionHandleOut !== undefined) {
            nextKf.tensionHandleIn = nextKf.tensionHandleOut;
            nextKf.tensionHandleInTime = nextKf.tensionHandleOutTime;
          }
          return nextKf;
        });
        cameraKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const kfs = (prevPkfs[trackId] ?? []).map(k => {
          if (Math.abs(k.time - time) >= 0.01) return k;
          const nextKf = { ...k, mode };
          if (mode === 'aligned' && nextKf.handleOut !== undefined) {
            nextKf.handleIn = nextKf.handleOut;
            nextKf.handleInTime = nextKf.handleOutTime;
          }
          return nextKf;
        });
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  const handleDuplicateKeyframe = useCallback((trackId: string, srcTime: number, destTime: number) => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const src = prevCkfs.find(s => Math.abs(s.time - srcTime) < 0.01);
        if (!src) return prevCkfs;
        const next = [...prevCkfs.filter(s => Math.abs(s.time - destTime) > 0.1), { ...src, time: destTime }].sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const src = (prevPkfs[trackId] ?? []).find(k => Math.abs(k.time - srcTime) < 0.01);
        if (!src) return prevPkfs;
        const next = { ...prevPkfs, [trackId]: [...(prevPkfs[trackId] ?? []).filter(k => Math.abs(k.time - destTime) > 0.1), { ...src, time: destTime }].sort((a, b) => a.time - b.time) };
        physicsKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  const handleAddSceneMarker = useCallback((time: number, label: string) => {
    const prev = getTimelineState();
    const next = [...sceneMarkersRef.current, { time, label }].sort((a, b) => a.time - b.time);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory({ ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  const handleRenameSceneMarker = useCallback((time: number, label: string) => {
    const prev = getTimelineState();
    const next = sceneMarkersRef.current.map(m => Math.abs(m.time - time) < 0.01 ? { ...m, label } : m);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory({ ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  const handleMoveSceneMarker = useCallback((oldTime: number, newTime: number) => {
    setSceneMarkers(prev => prev.map(m => Math.abs(m.time - oldTime) < 0.01 ? { ...m, time: newTime } : m).sort((a, b) => a.time - b.time));
  }, []);

  return (
    <WortnetzContext.Provider value={{
      viewMode, setViewMode, themeMode, setThemeMode, renderMode, setRenderMode,
      activeTool, setActiveTool, canvasAspectRatio, setCanvasAspectRatio, zoomValue, setZoomValue,
      isSidebarOpen, setIsSidebarOpen, inspectorWidth, setInspectorWidth, timelineHeight, setTimelineHeight,
      isNetworkReady, setIsNetworkReady, initProgress, setInitProgress,
      inputText, setInputText, parseMode, setParseMode, gradientSettings, setGradientSettings,
      styleSettings, setStyleSettings, physicsParams, setPhysicsParams, visualSettings, setVisualSettings,
      nodeAppearance, setNodeAppearance, edgeAppearance, setEdgeAppearance, lastAppliedPreset, setLastAppliedPreset,
      isPlaying, setIsPlaying, isRecording, setIsRecording, playheadPosition, setPlayheadPosition, timecode, setTimecode,
      cameraKeyframes, setCameraKeyframes, physicsKeyframes, setPhysicsKeyframes, sceneMarkers, setSceneMarkers,
      selectedKeyframes, setSelectedKeyframes, selectedNode, setSelectedNode,
      network3DRef, cameraKeyframesRef, physicsKeyframesRef, sceneMarkersRef, selectedKeyframesRef, playheadRef, isRecordingRef,
      effectivePhysicsParams, previewIsDark, uiIsDark,
      handleCaptureKeyframe, handleMoveKeyframe, handleDeleteKeyframe,
      handleSetHandle, handleClearHandle, handleSetInterpolation, handleDuplicateKeyframe,
      handleAddSceneMarker, handleRenameSceneMarker, handleMoveSceneMarker,
      pushHistory, getTimelineState
    }}>
      {children}
    </WortnetzContext.Provider>
  );
}

export function useWortnetz() {
  const context = useContext(WortnetzContext);
  if (context === undefined) {
    throw new Error('useWortnetz must be used within a WortnetzProvider');
  }
  return context;
}
