import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { defaultEdgeAppearance, type NodeShape, type EdgeAppearanceSettings } from '../networkTheme';
import { ToolId } from '../components/Toolbar';
import { TIMELINE_DURATION, DEFAULT_TEXT } from '../constants';
import type { Network3DHandle } from '../components/Network3D';

import { 
  Keyframe, 
  PhysicsKeyframe, 
  SceneMarker, 
  TimelineState, 
  WortnetzContextType 
} from './WortnetzContextTypes';

import { EMPTY_PHYSICS_KFS, PHYS_TRACK_PARAM } from './WortnetzContextConstants';
import useWorkspaceIO from '../hooks/useWorkspaceIO';
import { useUndoStack } from '../hooks/useUndoStack';
import { interpolatePhysicsParam } from '../animation/interpolatePhysicsParam';
import { THEME_STORAGE_KEY, THEME_AUTO_KEY, resolveSystemTheme } from '../theme/tokens';
import { sameTime, differentTime } from '../components/timeline/timeUtils';

const WortnetzContext = createContext<WortnetzContextType | undefined>(undefined);

export function WortnetzProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [selectedKeyframes, setSelectedKeyframes] = useState<{ track: string; time: number }[]>([]);
  const [sceneMarkers, setSceneMarkers] = useState<SceneMarker[]>([]);
  const [themeAuto, setThemeAuto] = useState<boolean>(() =>
    typeof window !== 'undefined' && localStorage.getItem(THEME_AUTO_KEY) === 'true'
  );
  const [themeMode, setThemeMode] = useState<'light' | 'hybrid' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    if (localStorage.getItem(THEME_AUTO_KEY) === 'true') return resolveSystemTheme();
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'hybrid') return stored;
    return 'light';
  });
  const [inputText, setInputText] = useState(DEFAULT_TEXT);
  const [parseMode, setParseMode] = useState<'sentence' | 'word' | 'both'>('word');
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
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [timelineHeight, setTimelineHeight] = useState(320);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNetworkReady, setIsNetworkReady] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState<string>('full');
  const [activeTool, setActiveTool] = useState<ToolId>('pointer');
  const [zoomValue, setZoomValue] = useState(50);
  const [visualSettings, setVisualSettings] = useState({
    nodesVisible: true, edgesVisible: true,
    radialBiasScale: 0, radialBiasOpacity: 0.5, gradientOrigin: '#4f46e5', gradientPeriphery: '#10b981',
    glitchActive: false, glitchBrushRadius: 100, glitchFeather: 0.5,
    pathSmoothness: 0.5, pathCameraFollow: true
  });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [edgeAppearance, setEdgeAppearance] = useState<EdgeAppearanceSettings>(defaultEdgeAppearance);

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

  const getTimelineState = useCallback(() => ({
    cameraKeyframes: cameraKeyframesRef.current,
    physicsKeyframes: physicsKeyframesRef.current,
    sceneMarkers: sceneMarkersRef.current
  }), []);

  const applyTimelineState = useCallback((state: TimelineState) => {
    setCameraKeyframes(state.cameraKeyframes ?? []);
    setPhysicsKeyframes(state.physicsKeyframes ?? EMPTY_PHYSICS_KFS);
    setSceneMarkers(state.sceneMarkers ?? []);
  }, []);

  const { push: pushHistory, pushDebounced: pushHistoryDebounced, undo, redo, canUndo, canRedo } = useUndoStack<TimelineState>(
    getTimelineState,
    applyTimelineState,
    { capacity: 30 }
  );

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

  const { handleSave: ioSave, handleLoad: ioLoad } = useWorkspaceIO(
    useCallback(() => ({
      inputText, parseMode, styleSettings, physicsParams,
      viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers
    }), [inputText, parseMode, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers]),
    useCallback((s) => {
      if (s.inputText) setInputText(s.inputText);
      if (s.parseMode) setParseMode(s.parseMode);
      if (s.styleSettings) setStyleSettings(s.styleSettings);
      if (s.physicsParams) setPhysicsParams(prev => ({ ...prev, ...s.physicsParams, verticalOrder: s.physicsParams.verticalOrder ?? 0, pulse: s.physicsParams.pulse ?? 0 }));
      if (s.viewMode) setViewMode(s.viewMode);
      if (s.cameraKeyframes) setCameraKeyframes(s.cameraKeyframes);
      if (s.physicsKeyframes) setPhysicsKeyframes(s.physicsKeyframes);
      if (s.sceneMarkers) setSceneMarkers(s.sceneMarkers);
    }, [])
  );

  const handleSave = useCallback(() => ioSave(), [ioSave]);
  const handleLoad = useCallback(() => ioLoad(), [ioLoad]);

  // Handlers
  const handleCaptureKeyframe = useCallback((atTime?: number) => {
    const prev = getTimelineState();
    // Scene markers are time bookmarks, not state snapshots — when a marker triggers
    // bulk capture, we use the marker's time. Otherwise capture at the playhead.
    const currentTime = typeof atTime === 'number' ? atTime : playheadRef.current;
    const effectivePhysics = network3DRef.current?.getEffectivePhysicsParams() ?? physicsParams;

    const nextPhysKfs: Record<string, PhysicsKeyframe[]> = { ...physicsKeyframesRef.current };
    for (const trackId of Object.keys(PHYS_TRACK_PARAM)) {
      const param = PHYS_TRACK_PARAM[trackId] as keyof typeof effectivePhysics;
      const existingK = (nextPhysKfs[trackId] ?? []).find(k => sameTime(k.time, currentTime));
      const filtered = (nextPhysKfs[trackId] ?? []).filter(k => differentTime(k.time, currentTime));
      const easingProps = existingK
        ? { handleOut: existingK.handleOut, handleIn: existingK.handleIn, handleOutTime: existingK.handleOutTime, handleInTime: existingK.handleInTime, mode: existingK.mode }
        : { mode: 'aligned' as const };
      nextPhysKfs[trackId] = [...filtered, { time: currentTime, value: effectivePhysics[param], ...easingProps }]
        .sort((a, b) => a.time - b.time);
    }
    physicsKeyframesRef.current = nextPhysKfs;
    setPhysicsKeyframes(nextPhysKfs);

    if (viewMode !== '3D') {
      let nextMarkers2D = sceneMarkersRef.current;
      const markerExists2D = nextMarkers2D.some(m => sameTime(m.time, currentTime));
      if (!markerExists2D) {
        const label = `Scene ${nextMarkers2D.length + 1}`;
        nextMarkers2D = [...nextMarkers2D, { time: currentTime, label }].sort((a, b) => a.time - b.time);
        sceneMarkersRef.current = nextMarkers2D;
        setSceneMarkers(nextMarkers2D);
      }
      pushHistory({ ...prev, physicsKeyframes: nextPhysKfs, sceneMarkers: nextMarkers2D });
      return;
    }

    const keyframe = network3DRef.current?.getCameraKeyframe();
    if (!keyframe) {
      pushHistory({ ...prev, physicsKeyframes: nextPhysKfs });
      return;
    }

    const existingCK = cameraKeyframesRef.current.find(s => sameTime(s.time, currentTime));
    const filteredCkfs = cameraKeyframesRef.current.filter(s => differentTime(s.time, currentTime));
    const cameraEasingProps = existingCK
      ? { handleOutPos: existingCK.handleOutPos, handleInPos: existingCK.handleInPos, handleOutTgt: existingCK.handleOutTgt, handleInTgt: existingCK.handleInTgt, mode: existingCK.mode, tension: existingCK.tension, tensionHandleIn: existingCK.tensionHandleIn, tensionHandleOut: existingCK.tensionHandleOut, tensionHandleInTime: existingCK.tensionHandleInTime, tensionHandleOutTime: existingCK.tensionHandleOutTime }
      : { mode: 'aligned' as const };
    const nextCkfs = [...filteredCkfs, { ...keyframe, ...cameraEasingProps, time: currentTime }]
      .sort((a, b) => a.time - b.time);
    cameraKeyframesRef.current = nextCkfs;
    setCameraKeyframes(nextCkfs);

    let nextMarkers = sceneMarkersRef.current;
    const markerExists = nextMarkers.some(m => sameTime(m.time, currentTime));
    if (!markerExists) {
      const label = `Scene ${nextMarkers.length + 1}`;
      nextMarkers = [...nextMarkers, { time: currentTime, label }].sort((a, b) => a.time - b.time);
      sceneMarkersRef.current = nextMarkers;
      setSceneMarkers(nextMarkers);
    }
    setSelectedKeyframes([]);
    pushHistory({ cameraKeyframes: nextCkfs, physicsKeyframes: nextPhysKfs, sceneMarkers: nextMarkers });
  }, [viewMode, pushHistory, getTimelineState, physicsParams]);

  const handleCreateKeyframesAtMarker = useCallback((time: number) => {
    handleCaptureKeyframe(time);
  }, [handleCaptureKeyframe]);

  const handleCameraChange = useCallback(() => {
    if (viewMode !== '3D') return;
    const currentTime = playheadRef.current;
    if (!cameraKeyframesRef.current.some(s => sameTime(s.time, currentTime))) return;
    const keyframe = network3DRef.current?.getCameraKeyframe();
    if (!keyframe) return;
    setCameraKeyframes(prev => {
      const existingCK = prev.find(s => sameTime(s.time, currentTime));
      const filtered = prev.filter(s => differentTime(s.time, currentTime));
      const easingProps = existingCK
        ? { handleOutPos: existingCK.handleOutPos, handleInPos: existingCK.handleInPos, handleOutTgt: existingCK.handleOutTgt, handleInTgt: existingCK.handleInTgt, mode: existingCK.mode, tension: existingCK.tension, tensionHandleIn: existingCK.tensionHandleIn, tensionHandleOut: existingCK.tensionHandleOut }
        : { mode: 'aligned' as const };
      const next = [...filtered, { ...keyframe, ...easingProps, time: currentTime }].sort((a, b) => a.time - b.time);
      cameraKeyframesRef.current = next;
      return next;
    });
    
    const zoom = network3DRef.current?.getZoom();
    if (zoom !== undefined) setZoomValue(zoom);
  }, [viewMode]);

  const handleMoveKeyframe = useCallback((trackId: string, oldTime: number, newTime: number) => {
    const delta = newTime - oldTime;
    const sel = selectedKeyframesRef.current;
    const isMultiDrag = sel.length > 1 && sel.some(s => s.track === trackId && sameTime(s.time, oldTime));

    if (isMultiDrag) {
      setCameraKeyframes(prev => {
        const selectedTimes = new Set(sel.filter(s => s.track === 'camera-keyframes').map(s => s.time));
        const moved = prev.map(s => selectedTimes.has(s.time)
          ? { ...s, time: Math.max(0, Math.min(TIMELINE_DURATION, s.time + delta)) }
          : s
        );
        // Dedup: keep first occurrence when two keyframes land on the same time.
        const deduped = moved.filter((s, i) => moved.findIndex(x => sameTime(x.time, s.time)) === i);
        const next = deduped.sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      setPhysicsKeyframes(prev => {
        const nextKfs: Record<string, PhysicsKeyframe[]> = { ...prev };
        for (const tid of Object.keys(PHYS_TRACK_PARAM)) {
          const selectedTimes = new Set(sel.filter(s => s.track === tid).map(s => s.time));
          const moved = (prev[tid] ?? []).map(k => selectedTimes.has(k.time)
            ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) }
            : k
          );
          const deduped = moved.filter((k, i) => moved.findIndex(x => sameTime(x.time, k.time)) === i);
          nextKfs[tid] = deduped.sort((a, b) => a.time - b.time);
        }
        physicsKeyframesRef.current = nextKfs;
        return nextKfs;
      });
      setSceneMarkers(prev => {
        const selectedTimes = new Set(sel.filter(s => s.track === 'scene-markers').map(s => s.time));
        const moved = prev.map(m => selectedTimes.has(m.time)
          ? { ...m, time: Math.max(0, Math.min(TIMELINE_DURATION, m.time + delta)) }
          : m
        );
        const deduped = moved.filter((m, i) => moved.findIndex(x => sameTime(x.time, m.time)) === i);
        const next = deduped.sort((a, b) => a.time - b.time);
        sceneMarkersRef.current = next;
        return next;
      });
      setSelectedKeyframes(prev => prev.map(s => ({
        ...s, time: Math.max(0, Math.min(TIMELINE_DURATION, s.time + delta)),
      })));
    } else {
      if (trackId === 'camera-keyframes') {
        setCameraKeyframes(prev => {
          // Move, then dedup: remove any OTHER keyframe within TIME_EPSILON of newTime.
          const moved = prev.map(s => sameTime(s.time, oldTime) ? { ...s, time: newTime } : s);
          const deduped = moved.filter((s, i) => !(differentTime(s.time, newTime) === false && !sameTime(s.time, oldTime) && moved.findIndex(x => sameTime(x.time, newTime)) !== i));
          const next = deduped.sort((a, b) => a.time - b.time);
          cameraKeyframesRef.current = next;
          return next;
        });
      } else if (trackId in PHYS_TRACK_PARAM) {
        setPhysicsKeyframes(prev => {
          // Move, then dedup: remove any OTHER keyframe within TIME_EPSILON of newTime.
          const track = prev[trackId] ?? [];
          const moved = track.map(k => sameTime(k.time, oldTime) ? { ...k, time: newTime } : k);
          const deduped = moved.filter((k, i) => moved.findIndex(x => sameTime(x.time, k.time)) === i);
          const next = { ...prev, [trackId]: deduped.sort((a, b) => a.time - b.time) };
          physicsKeyframesRef.current = next;
          return next;
        });
      }
    }
  }, []);

  const handleDeleteKeyframe = useCallback((trackId: string, time: number) => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const next = prevCkfs.filter(s => differentTime(s.time, time));
        cameraKeyframesRef.current = next;
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && sameTime(s.time, time))));
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const kfs = (prevPkfs[trackId] ?? []).filter(k => differentTime(k.time, time));
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && sameTime(s.time, time))));
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  /**
   * Ripple-delete: removes the keyframe at `time` AND shifts every later keyframe
   * on the same track left by the gap to the previous keyframe (or to 0 if none).
   * Mirrors the Premiere/Avid "ripple delete" convention applied to point events.
   */
  const handleRippleDeleteKeyframe = useCallback((trackId: string, time: number) => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const sorted = [...prevCkfs].sort((a, b) => a.time - b.time);
        const idx = sorted.findIndex(k => sameTime(k.time, time));
        if (idx === -1) return prevCkfs;
        const prevTime = idx > 0 ? sorted[idx - 1].time : 0;
        const gap = sorted[idx].time - prevTime;
        const next = sorted
          .filter((_, i) => i !== idx)
          .map(k => k.time > time ? { ...k, time: Math.max(0, k.time - gap) } : k);
        cameraKeyframesRef.current = next;
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && sameTime(s.time, time))));
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const arr = [...(prevPkfs[trackId] ?? [])].sort((a, b) => a.time - b.time);
        const idx = arr.findIndex(k => sameTime(k.time, time));
        if (idx === -1) return prevPkfs;
        const prevTime = idx > 0 ? arr[idx - 1].time : 0;
        const gap = arr[idx].time - prevTime;
        const kfs = arr
          .filter((_, i) => i !== idx)
          .map(k => k.time > time ? { ...k, time: Math.max(0, k.time - gap) } : k);
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && sameTime(s.time, time))));
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  /** Clear all keyframes on a single track (used by track-header right-click "Reset to default"). */
  const handleResetTrack = useCallback((trackId: string) => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      cameraKeyframesRef.current = [];
      setCameraKeyframes([]);
      setSelectedKeyframes(sel => sel.filter(s => s.track !== trackId));
      pushHistory({ ...prev, cameraKeyframes: [] });
    } else if (trackId in PHYS_TRACK_PARAM) {
      const next = { ...physicsKeyframesRef.current, [trackId]: [] };
      physicsKeyframesRef.current = next;
      setPhysicsKeyframes(next);
      setSelectedKeyframes(sel => sel.filter(s => s.track !== trackId));
      pushHistory({ ...prev, physicsKeyframes: next });
    }
  }, [getTimelineState, pushHistory]);

  const handleSetHandle = useCallback((trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset = 0.33) => {
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const next = prev.map(s => {
          if (differentTime(s.time, time)) return s;
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
          if (differentTime(k.time, time)) return k;
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
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const next = prevCkfs.map(s => {
          if (differentTime(s.time, time)) return s;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { tensionHandleIn: _a, tensionHandleOut: _b, tensionHandleInTime: _c, tensionHandleOutTime: _d, ...rest } = s;
          return rest;
        });
        cameraKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const kfs = (prevPkfs[trackId] ?? []).map(k => {
          if (differentTime(k.time, time)) return k;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { handleIn: _a, handleOut: _b, handleInTime: _c, handleOutTime: _d, ...rest } = k;
          return rest;
        });
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  const handleSetInterpolation = useCallback((trackId: string, time: number, mode: 'aligned' | 'broken') => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const next = prevCkfs.map(s => {
          if (differentTime(s.time, time)) return s;
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
          if (differentTime(k.time, time)) return k;
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
        const src = prevCkfs.find(s => sameTime(s.time, srcTime));
        if (!src) return prevCkfs;
        const next = [...prevCkfs.filter(s => differentTime(s.time, destTime)), { ...src, time: destTime }].sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const src = (prevPkfs[trackId] ?? []).find(k => sameTime(k.time, srcTime));
        if (!src) return prevPkfs;
        const next = { ...prevPkfs, [trackId]: [...(prevPkfs[trackId] ?? []).filter(k => differentTime(k.time, destTime)), { ...src, time: destTime }].sort((a, b) => a.time - b.time) };
        physicsKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  const handleAddSceneMarker = useCallback((time: number, label: string = 'Marker') => {
    const prev = getTimelineState();
    const next = [...sceneMarkersRef.current, { time, label }].sort((a, b) => a.time - b.time);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory({ ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  const handleRenameSceneMarker = useCallback((time: number, label?: string) => {
    if (!label) return;
    const prev = getTimelineState();
    const next = sceneMarkersRef.current.map(m => sameTime(m.time, time) ? { ...m, label } : m);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory({ ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  const handleMoveSceneMarker = useCallback((oldTime: number, newTime: number) => {
    const delta = newTime - oldTime;
    // Marker drag shifts the marker AND all keyframes pinned at that time.
    const nextMarkers = sceneMarkersRef.current
      .map(m => sameTime(m.time, oldTime) ? { ...m, time: newTime } : m)
      .sort((a, b) => a.time - b.time);
    sceneMarkersRef.current = nextMarkers;
    setSceneMarkers(nextMarkers);

    setCameraKeyframes(prev => {
      const next = prev
        .map(s => sameTime(s.time, oldTime) ? { ...s, time: Math.max(0, Math.min(TIMELINE_DURATION, s.time + delta)) } : s)
        .sort((a, b) => a.time - b.time);
      cameraKeyframesRef.current = next;
      return next;
    });
    setPhysicsKeyframes(prev => {
      const nextKfs: Record<string, PhysicsKeyframe[]> = {};
      for (const tid of Object.keys(PHYS_TRACK_PARAM)) {
        nextKfs[tid] = (prev[tid] ?? [])
          .map(k => sameTime(k.time, oldTime) ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) } : k)
          .sort((a, b) => a.time - b.time);
      }
      physicsKeyframesRef.current = nextKfs;
      return nextKfs;
    });
  }, []);

  // Called once on drag-end; commits the final marker position to undo history.
  const handleDropSceneMarker = useCallback((_fromTime: number, _toTime: number) => {
    pushHistory(getTimelineState());
  }, [getTimelineState, pushHistory]);

  const handleDeleteSceneMarker = useCallback((time: number) => {
    const prev = getTimelineState();
    const next = sceneMarkersRef.current.filter(m => differentTime(m.time, time));
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory({ ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  const handleSetValue = useCallback((trackId: string, time: number, value: number) => {
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const next = prev.map(s => differentTime(s.time, time) ? s : { ...s, tension: Math.max(0, value) });
        cameraKeyframesRef.current = next;
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevKfs => {
        const track = prevKfs[trackId] ?? [];
        const next = {
          ...prevKfs,
          [trackId]: track.map(k => differentTime(k.time, time) ? k : { ...k, value: Math.max(0, value) }),
        };
        physicsKeyframesRef.current = next;
        return next;
      });
    }
    // Value drags are bracketed by handleDragStart/handleDragEnd; no push needed here.
  }, []);

  const handleTogglePhysicsKeyframe = useCallback((trackId: string, value: number) => {
    const prev = getTimelineState();
    const currentTime = playheadRef.current;
    setPhysicsKeyframes(prevKfs => {
      const track = prevKfs[trackId] ?? [];
      const hasKf = track.some(k => sameTime(k.time, currentTime));
      const next = hasKf
        ? { ...prevKfs, [trackId]: track.filter(k => differentTime(k.time, currentTime)) }
        : { ...prevKfs, [trackId]: [...track, { time: currentTime, value, mode: 'aligned' as const }].sort((a, b) => a.time - b.time) };
      physicsKeyframesRef.current = next;
      pushHistory({ ...prev, physicsKeyframes: next });
      return next;
    });
  }, [getTimelineState, pushHistory]);

  const handleSetHandle2D = handleSetHandle; // Map for compatibility

  // color helper to derive light fill
  const handleKeyframeSelect = useCallback((track: string, time: number, additive: boolean) => {
    setSelectedKeyframes(prev => {
      const already = prev.some(s => s.track === track && sameTime(s.time, time));
      if (additive) {
        return already
          ? prev.filter(s => !(s.track === track && sameTime(s.time, time)))
          : [...prev, { track, time }];
      } else {
        return already ? prev : [{ track, time }];
      }
    });
  }, []);

  const handleSelectKeyframes = useCallback((kfs: { track: string; time: number }[]) => {
    setSelectedKeyframes(kfs);
  }, []);

  const handlePhysicsChange = useCallback((params: Partial<typeof physicsParams>) => {
    setPhysicsParams(prev => ({ ...prev, ...params }));

    const currentTime = playheadRef.current;
    setPhysicsKeyframes(prevKfs => {
      let changed = false;
      const nextKfs = { ...prevKfs };

      for (const [trackId, paramName] of Object.entries(PHYS_TRACK_PARAM)) {
        const newVal = (params as Record<string, number>)[paramName];
        if (newVal === undefined) continue;

        const track = prevKfs[trackId] ?? [];
        const isRecordingLocal = isRecordingRef.current;
        if (track.length === 0 && !isRecordingLocal) continue;

        const kfIdx = track.findIndex(k => sameTime(k.time, currentTime));
        if (kfIdx >= 0) {
          if (newVal !== track[kfIdx].value) {
            nextKfs[trackId] = track.map((k, i) => i === kfIdx ? { ...k, value: newVal } : k);
            changed = true;
          }
        } else {
          const nextTrack = [...track, { time: currentTime, value: newVal, mode: 'aligned' as const }].sort((a, b) => a.time - b.time);
          nextKfs[trackId] = nextTrack;
          changed = true;
        }
      }

      if (!changed) return prevKfs;
      physicsKeyframesRef.current = nextKfs;
      return nextKfs;
    });
    // Debounce-commit: slider drags have no explicit start/end bracket, so we push
    // a snapshot 500 ms after the last change so undo captures one entry per gesture.
    pushHistoryDebounced(500);
  }, [pushHistoryDebounced]);

  const preDragStateRef = useRef<TimelineState | null>(null);

  const handleDragStart = useCallback(() => {
    preDragStateRef.current = getTimelineState();
  }, [getTimelineState]);

  const handleDragEnd = useCallback(() => {
    if (preDragStateRef.current) {
      pushHistory(getTimelineState());
      preDragStateRef.current = null;
    }
  }, [pushHistory, getTimelineState]);

  /** Cancel an in-progress drag: restore the pre-drag snapshot without pushing history. */
  const handleCancelDrag = useCallback(() => {
    const snapshot = preDragStateRef.current;
    if (!snapshot) return;
    setCameraKeyframes(snapshot.cameraKeyframes);
    cameraKeyframesRef.current = snapshot.cameraKeyframes;
    setPhysicsKeyframes(snapshot.physicsKeyframes);
    physicsKeyframesRef.current = snapshot.physicsKeyframes;
    setSceneMarkers(snapshot.sceneMarkers);
    sceneMarkersRef.current = snapshot.sceneMarkers;
    preDragStateRef.current = null;
  }, []);

  return (
    <WortnetzContext.Provider value={{
      viewMode, setViewMode, themeMode, setThemeMode, themeAuto, setThemeAuto,
      activeTool, setActiveTool, canvasAspectRatio, setCanvasAspectRatio, zoomValue, setZoomValue,
      isSidebarOpen, setIsSidebarOpen, sidebarWidth, setSidebarWidth, timelineHeight, setTimelineHeight,
      isNetworkReady, setIsNetworkReady, initProgress, setInitProgress,
      inputText, setInputText, parseMode, setParseMode,
      styleSettings, setStyleSettings, physicsParams, setPhysicsParams, visualSettings, setVisualSettings,
      edgeAppearance, setEdgeAppearance,
      isPlaying, setIsPlaying, isRecording, setIsRecording, playheadPosition, setPlayheadPosition, timecode, setTimecode,
      cameraKeyframes, setCameraKeyframes, physicsKeyframes, setPhysicsKeyframes, sceneMarkers, setSceneMarkers,
      selectedKeyframes, setSelectedKeyframes, selectedNode, setSelectedNode,
      network3DRef, cameraKeyframesRef, physicsKeyframesRef, sceneMarkersRef, selectedKeyframesRef, playheadRef, isRecordingRef,
      effectivePhysicsParams, previewIsDark, uiIsDark,
      handleCaptureKeyframe, handleCreateKeyframesAtMarker, handleMoveKeyframe, handleDeleteKeyframe, handleRippleDeleteKeyframe, handleResetTrack,
      handleSetHandle, handleClearHandle, handleSetInterpolation, handleDuplicateKeyframe,
      handleAddSceneMarker, handleRenameSceneMarker, handleMoveSceneMarker, handleDropSceneMarker, handleDeleteSceneMarker,
      handleSetValue, handleSetHandle2D, handleCameraChange,
      handleTogglePhysicsKeyframe,
      handleKeyframeSelect, handleSelectKeyframes, handlePhysicsChange,
      handleDragStart, handleDragEnd, handleCancelDrag,
      pushHistory, getTimelineState, undo, redo, canUndo, canRedo,
      handleSave, handleLoad
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
