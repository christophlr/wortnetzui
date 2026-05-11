import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Timeline } from './components/timeline/Timeline';
import { Progress } from './components/ui/progress';
import type { Network3DHandle } from './components/Network3D';
import { defaultGradientSettings, defaultNodeAppearance, defaultEdgeAppearance, type GradientSettings, type NodeShape, type NodeAppearanceSettings, type EdgeAppearanceSettings } from './networkTheme';
import { TIMELINE_DURATION } from './constants';
import { evaluateHermite, computeCatmullRomTangent } from './easing';
import { ShortcutsDialog } from './components/ShortcutsDialog';
import { Toolbar, type ToolId } from './components/Toolbar';
import { PathAnimatorUI } from './components/PathAnimatorUI';

type Keyframe = {
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
type PhysicsKeyframe = {
  time: number;
  value: number;
  handleIn?: number;
  handleOut?: number;
  handleInTime?: number;
  handleOutTime?: number;
  mode?: 'aligned' | 'broken';
};
export type SceneMarker = { time: number; label: string };
type TimelineState = { cameraKeyframes: Keyframe[]; physicsKeyframes: Record<string, PhysicsKeyframe[]>; sceneMarkers: SceneMarker[] };

const EMPTY_PHYSICS_KFS = { 
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
const DEFAULT_INSPECTOR_WIDTH = 360;
const DEFAULT_TIMELINE_HEIGHT = 320;
const PHYS_TRACK_PARAM: Record<string, string> = { 
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

function interpolatePhysicsParam(sorted: PhysicsKeyframe[], time: number, trackId?: string): number | null {
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
      
      // Prevent negative values for all params except gravity
      return trackId === 'phys-grv' ? val : Math.max(0, val);
    }
  }
  return null;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [selectedKeyframes, setSelectedKeyframes] = useState<{ track: string; time: number }[]>([]);
  const [sceneMarkers, setSceneMarkers] = useState<SceneMarker[]>([]);
  const [themeMode, setThemeMode] = useState<'light' | 'hybrid' | 'dark'>('light');
  const [inputText, setInputText] = useState(`Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes far away up the hill. It was 3am that day cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write I write like a ritual over and over. The more exist the more I go I fly they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`);
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
  const [inspectorWidth, setInspectorWidth] = useState(DEFAULT_INSPECTOR_WIDTH);
  const [timelineHeight, setTimelineHeight] = useState(DEFAULT_TIMELINE_HEIGHT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNetworkReady, setIsNetworkReady] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState<string>('full');
  const [activeTool, setActiveTool] = useState<ToolId>('pointer');
  const [overlayBandOffsets, setOverlayBandOffsets] = useState({ top: 0, bottom: 0 });
  const [zoomValue, setZoomValue] = useState(50);
  const [visualSettings, setVisualSettings] = useState({
    nodesVisible: true,
    labelsVisible: true,
    edgesVisible: true,
    envVisible: true,
    radialBiasScale: 0.5,
    radialBiasOpacity: 0.5,
    gradientOrigin: '#4f46e5',
    gradientPeriphery: '#10b981',
    colorMode: 'gradient' as const,
    clusterPalette: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'],
    labelWeightMapping: 0.5,
    edgeFlowAnimation: false,
    envAtmosphereSeed: 123,
    glitchActive: false,
    glitchBrushRadius: 100,
    glitchFeather: 0.5,
    pathSmoothness: 0.5,
    pathCameraFollow: true
  });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isNetworkReady) {
      setInitProgress(0);
      const interval = setInterval(() => {
        setInitProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setInitProgress(100);
    }
  }, [isNetworkReady]);
  const [renderMode, setRenderMode] = useState<'edit' | 'render'>('edit');
  const [nodeAppearance, setNodeAppearance] = useState<NodeAppearanceSettings>(defaultNodeAppearance);
  const [lastAppliedPreset, setLastAppliedPreset] = useState<'outline'|'filled'|null>(null);
  const [edgeAppearance, setEdgeAppearance] = useState<EdgeAppearanceSettings>(defaultEdgeAppearance);

  // Undo/redo history — tracks the full timeline state
  const [keyframeHistory, setKeyframeHistory] = useState<TimelineState[]>([{ cameraKeyframes: [], physicsKeyframes: EMPTY_PHYSICS_KFS, sceneMarkers: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState([
    { id: '1', command: 'Speichern', key: 's' },
    { id: '2', command: 'Laden', key: 'o' },
    { id: '3', command: 'Rückgängig', key: 'z' },
    { id: '4', command: 'Wiederholen', key: 'Z' }, // shift+z
    { id: '5', command: 'Abspielen/Pause', key: ' ' },
    { id: '6', command: 'Aufnahme', key: 'r' },
  ]);

  const physicsKeyframesRef = useRef(physicsKeyframes);
  useEffect(() => { physicsKeyframesRef.current = physicsKeyframes; }, [physicsKeyframes]);

  const sceneMarkersRef = useRef(sceneMarkers);
  useEffect(() => { sceneMarkersRef.current = sceneMarkers; }, [sceneMarkers]);

  const selectedKeyframesRef = useRef(selectedKeyframes);
  useEffect(() => { selectedKeyframesRef.current = selectedKeyframes; }, [selectedKeyframes]);
  
  const isRecordingRef = useRef(isRecording);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  const preDragStateRef = useRef<TimelineState | null>(null);

  const getTimelineState = useCallback((): TimelineState => ({
    cameraKeyframes: cameraKeyframesRef.current,
    physicsKeyframes: physicsKeyframesRef.current,
    sceneMarkers: sceneMarkersRef.current,
  }), []);

  const preRecordStateRef = useRef<TimelineState | null>(null);

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

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const entry = keyframeHistory[historyIndex - 1];
    setCameraKeyframes(entry.cameraKeyframes ?? []);
    setPhysicsKeyframes(entry.physicsKeyframes ?? EMPTY_PHYSICS_KFS);
    setSceneMarkers(entry.sceneMarkers ?? []);
    setHistoryIndex(i => i - 1);
  }, [historyIndex, keyframeHistory]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= keyframeHistory.length - 1) return;
    const entry = keyframeHistory[historyIndex + 1];
    setCameraKeyframes(entry.cameraKeyframes ?? []);
    setPhysicsKeyframes(entry.physicsKeyframes ?? EMPTY_PHYSICS_KFS);
    setSceneMarkers(entry.sceneMarkers ?? []);
    setHistoryIndex(i => i + 1);
  }, [historyIndex, keyframeHistory]);

  // Drag-bracket callbacks: snapshot before drag, push history after
  const handleDragStart = useCallback(() => {
    preDragStateRef.current = getTimelineState();
  }, [getTimelineState]);

  const handleDragEnd = useCallback(() => {
    if (!preDragStateRef.current) return;
    pushHistory(getTimelineState());
    preDragStateRef.current = null;
  }, [pushHistory, getTimelineState]);

  const network3DRef = useRef<Network3DHandle>(null);
  const playheadRef = useRef(playheadPosition);
  const cameraKeyframesRef = useRef(cameraKeyframes);
  useEffect(() => { playheadRef.current = playheadPosition; }, [playheadPosition]);
  useEffect(() => { cameraKeyframesRef.current = cameraKeyframes; }, [cameraKeyframes]);

  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef(0);
  const topBarContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const top = topBarContainerRef.current?.getBoundingClientRect().height ?? 0;
      const bottom = timelineContainerRef.current?.getBoundingClientRect().height ?? 0;
      setOverlayBandOffsets(prev => (
        prev.top === top && prev.bottom === bottom ? prev : { top, bottom }
      ));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (topBarContainerRef.current) ro.observe(topBarContainerRef.current);
    if (timelineContainerRef.current) ro.observe(timelineContainerRef.current);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [timelineHeight]);

  const handleSave = useCallback(() => {
    const state = { inputText, parseMode, gradientSettings, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `sprachvernetzungen-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }, [inputText, parseMode, gradientSettings, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const s = JSON.parse(ev.target?.result as string);
            if (s.inputText) setInputText(s.inputText);
            if (s.parseMode) setParseMode(s.parseMode);
            if (s.gradientSettings) setGradientSettings(s.gradientSettings);
            if (s.styleSettings) setStyleSettings(s.styleSettings);
            if (s.physicsParams) setPhysicsParams(prev => ({ ...prev, ...s.physicsParams, verticalOrder: s.physicsParams.verticalOrder ?? 0, pulse: s.physicsParams.pulse ?? 0 }));
            if (s.viewMode) setViewMode(s.viewMode);
            if (s.cameraKeyframes) setCameraKeyframes(s.cameraKeyframes);
            if (s.physicsKeyframes) setPhysicsKeyframes(s.physicsKeyframes);
            if (s.sceneMarkers) setSceneMarkers(s.sceneMarkers);
          } catch (err) { console.error('Failed to load state:', err); }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'theme-hybrid');
    
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'hybrid') {
      root.classList.add('theme-hybrid');
    } else {
      root.classList.add('light');
    }
  }, [themeMode]);

  useEffect(() => {
    if (isRecording) {
      preRecordStateRef.current = getTimelineState();
    } else if (preRecordStateRef.current) {
      pushHistory(getTimelineState());
      preRecordStateRef.current = null;
    }
  }, [isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  const uiIsDark = themeMode === 'dark';
  const previewIsDark = themeMode === 'dark' || themeMode === 'hybrid';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInput) return;

      const isMod = e.metaKey || e.ctrlKey;
      
      // Find matching shortcut
      const match = shortcuts.find(s => {
        if (s.key === ' ' && e.code === 'Space') return true;
        if (s.key.toLowerCase() === 'r' && e.key.toLowerCase() === 'r' && !isMod) return true;
        
        // Exact match for Shift+Z to prevent it being caught by Cmd+Z
        if (s.key === 'Z' && e.key === 'Z' && isMod && e.shiftKey) return true;
        if (s.key === 'z' && e.key === 'z' && isMod && !e.shiftKey) return true;
        
        // General case for other shortcuts
        return isMod && e.key.toLowerCase() === s.key.toLowerCase() && !e.shiftKey;
      });

      if (match) {
        e.preventDefault();
        switch (match.command) {
          case 'Speichern': handleSave(); break;
          case 'Laden': handleLoad(); break;
          case 'Rückgängig': handleUndo(); break;
          case 'Wiederholen': handleRedo(); break;
          case 'Abspielen/Pause': setIsPlaying(p => !p); break;
          case 'Aufnahme': setIsRecording(p => !p); break;
          case 'Sidebar umschalten': setIsSidebarOpen(p => !p); break;
          default: 
            console.log('Action not implemented:', match.command);
        }
      } else if (isMod && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave, handleLoad, handleUndo, handleRedo, shortcuts]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - playheadRef.current * 1000;
      const animate = () => {
        const newPos = (Date.now() - startTimeRef.current) / 1000;
        if (newPos >= TIMELINE_DURATION) {
          setPlayheadPosition(TIMELINE_DURATION); setIsPlaying(false);
        } else {
          setPlayheadPosition(newPos);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const total = Math.floor(playheadPosition);
    const frames = Math.floor((playheadPosition - total) * 30);
    const s = total % 60; const m = Math.floor(total / 60) % 60; const h = Math.floor(total / 3600);
    setTimecode(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(frames).padStart(2,'0')}`);
  }, [playheadPosition]);

  const handlePlayPause = () => setIsPlaying(p => !p);
  const handleStop = () => { setIsPlaying(false); setPlayheadPosition(0); };

  const effectivePhysicsParams = useMemo(() => {
    const next = { ...physicsParams };
    for (const [trackId, param] of Object.entries(PHYS_TRACK_PARAM)) {
      const sorted = [...(physicsKeyframes[trackId] ?? [])].sort((a, b) => a.time - b.time);
      const v = interpolatePhysicsParam(sorted, playheadPosition, trackId);
      if (v !== null) (next as Record<string, number>)[param] = v;
    }
    return next;
  }, [physicsParams, physicsKeyframes, playheadPosition]);

  const handleCaptureKeyframe = useCallback(() => {
    const prev = getTimelineState();
    const currentTime = playheadRef.current;
    const effectivePhysics = network3DRef.current?.getEffectivePhysicsParams() ?? physicsParams;

    // Compute next physics kfs — preserve existing easing, default new ones to auto
    const nextPhysKfs: Record<string, PhysicsKeyframe[]> = { ...physicsKeyframesRef.current };
    for (const trackId of Object.keys(PHYS_TRACK_PARAM)) {
      const param = PHYS_TRACK_PARAM[trackId] as keyof typeof effectivePhysics;
      const existingK = (nextPhysKfs[trackId] ?? []).find(k => Math.abs(k.time - currentTime) <= 0.1);
      const filtered = (nextPhysKfs[trackId] ?? []).filter(k => Math.abs(k.time - currentTime) > 0.1);
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
      const markerExists2D = nextMarkers2D.some(m => Math.abs(m.time - currentTime) <= 0.1);
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

    // Preserve existing easing for camera keyframes; default new ones to auto
    const existingCK = cameraKeyframesRef.current.find(s => Math.abs(s.time - currentTime) <= 0.1);
    const filteredCkfs = cameraKeyframesRef.current.filter(s => Math.abs(s.time - currentTime) > 0.1);
    const cameraEasingProps = existingCK
      ? { handleOutPos: existingCK.handleOutPos, handleInPos: existingCK.handleInPos, handleOutTgt: existingCK.handleOutTgt, handleInTgt: existingCK.handleInTgt, mode: existingCK.mode, tension: existingCK.tension, tensionHandleIn: existingCK.tensionHandleIn, tensionHandleOut: existingCK.tensionHandleOut, tensionHandleInTime: existingCK.tensionHandleInTime, tensionHandleOutTime: existingCK.tensionHandleOutTime }
      : { mode: 'aligned' as const };
    const nextCkfs = [...filteredCkfs, { ...keyframe, ...cameraEasingProps, time: currentTime }]
      .sort((a, b) => a.time - b.time);
    cameraKeyframesRef.current = nextCkfs;
    setCameraKeyframes(nextCkfs);

    // Auto-add scene marker at this time if none exists
    let nextMarkers = sceneMarkersRef.current;
    const markerExists = nextMarkers.some(m => Math.abs(m.time - currentTime) <= 0.1);
    if (!markerExists) {
      const label = `Scene ${nextMarkers.length + 1}`;
      nextMarkers = [...nextMarkers, { time: currentTime, label }].sort((a, b) => a.time - b.time);
      sceneMarkersRef.current = nextMarkers;
      setSceneMarkers(nextMarkers);
    }
    setSelectedKeyframes([]);
    pushHistory({ cameraKeyframes: nextCkfs, physicsKeyframes: nextPhysKfs, sceneMarkers: nextMarkers });
  }, [viewMode, pushHistory, getTimelineState, physicsParams]);

  const handleCameraChange = useCallback(() => {
    if (viewMode !== '3D') return;
    const currentTime = playheadRef.current;
    if (!cameraKeyframesRef.current.some(s => Math.abs(s.time - currentTime) < 0.1)) return;
    const keyframe = network3DRef.current?.getCameraKeyframe();
    if (!keyframe) return;
    setCameraKeyframes(prev => {
      const existingCK = prev.find(s => Math.abs(s.time - currentTime) < 0.1);
      const filtered = prev.filter(s => Math.abs(s.time - currentTime) > 0.1);
      const easingProps = existingCK
        ? { handleOutPos: existingCK.handleOutPos, handleInPos: existingCK.handleInPos, handleOutTgt: existingCK.handleOutTgt, handleInTgt: existingCK.handleInTgt, mode: existingCK.mode, tension: existingCK.tension, tensionHandleIn: existingCK.tensionHandleIn, tensionHandleOut: existingCK.tensionHandleOut }
        : { mode: 'aligned' as const };
      const next = [...filtered, { ...keyframe, ...easingProps, time: currentTime }].sort((a, b) => a.time - b.time);
      cameraKeyframesRef.current = next;
      return next;
    });
    
    // Sync zoom value
    const zoom = network3DRef.current?.getZoom();
    if (zoom !== undefined) setZoomValue(zoom);
  }, [viewMode]);

  const handleMoveKeyframe = useCallback((trackId: string, oldTime: number, newTime: number) => {
    const delta = newTime - oldTime;
    const sel = selectedKeyframesRef.current;
    const isMultiDrag = sel.length > 1 && sel.some(s => s.track === trackId && Math.abs(s.time - oldTime) < 0.01);

    if (isMultiDrag) {
      setCameraKeyframes(prev => {
        const selectedTimes = new Set(sel.filter(s => s.track === 'camera-keyframes').map(s => s.time));
        const next = prev.map(s => selectedTimes.has(s.time)
          ? { ...s, time: Math.max(0, Math.min(TIMELINE_DURATION, s.time + delta)) }
          : s
        ).sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      setPhysicsKeyframes(prev => {
        const nextKfs: Record<string, PhysicsKeyframe[]> = { ...prev };
        for (const tid of Object.keys(PHYS_TRACK_PARAM)) {
          const selectedTimes = new Set(sel.filter(s => s.track === tid).map(s => s.time));
          nextKfs[tid] = (prev[tid] ?? []).map(k => selectedTimes.has(k.time)
            ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) }
            : k
          ).sort((a, b) => a.time - b.time);
        }
        physicsKeyframesRef.current = nextKfs;
        return nextKfs;
      });
      setSceneMarkers(prev => {
        const selectedTimes = new Set(sel.filter(s => s.track === 'scene-markers').map(s => s.time));
        const next = prev.map(m => selectedTimes.has(m.time)
          ? { ...m, time: Math.max(0, Math.min(TIMELINE_DURATION, m.time + delta)) }
          : m
        ).sort((a, b) => a.time - b.time);
        sceneMarkersRef.current = next;
        return next;
      });
      setSelectedKeyframes(prev => prev.map(s => ({
        ...s, time: Math.max(0, Math.min(TIMELINE_DURATION, s.time + delta)),
      })));
    } else {
      if (trackId === 'camera-keyframes') {
        setCameraKeyframes(prev => {
          const next = prev.map(s => Math.abs(s.time - oldTime) < 0.01 ? { ...s, time: newTime } : s).sort((a, b) => a.time - b.time);
          cameraKeyframesRef.current = next;
          return next;
        });
      } else if (trackId in PHYS_TRACK_PARAM) {
        setPhysicsKeyframes(prev => {
          const kfs = (prev[trackId] ?? []).map(k => Math.abs(k.time - oldTime) < 0.01 ? { ...k, time: newTime } : k).sort((a, b) => a.time - b.time);
          const next = { ...prev, [trackId]: kfs };
          physicsKeyframesRef.current = next;
          return next;
        });
      }
    }
  }, []);

  const handleSetHandle = useCallback((trackId: string, time: number, side: 'out' | 'in', weight: number) => {
    const key = side === 'out' ? 'handleOut' : 'handleIn';
    if (trackId === 'camera-keyframes') {
      const tensionKey = side === 'out' ? 'tensionHandleOut' : 'tensionHandleIn';
      setCameraKeyframes(prev => {
        const next = prev.map(s => {
          if (Math.abs(s.time - time) >= 0.01) return s;
          const updated: Keyframe = { ...s, [tensionKey]: weight };
          if (updated.mode !== 'broken') {
            const oppKey = side === 'out' ? 'tensionHandleIn' : 'tensionHandleOut';
            (updated as Record<string, unknown>)[oppKey] = weight;
          }
          return updated;
        });
        cameraKeyframesRef.current = next;
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prev => {
        const kfs = (prev[trackId] ?? []).map(k => {
          if (Math.abs(k.time - time) >= 0.01) return k;
          const nextKf = { ...k, [key]: weight };
          // Apply aligned mode constraint
          if (nextKf.mode !== 'broken') {
            const oppKey = side === 'out' ? 'handleIn' : 'handleOut';
            nextKf[oppKey] = weight;
          }
          return nextKf;
        });
        const next = { ...prev, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
    }
  }, []);

  const handleSetValue = useCallback((trackId: string, time: number, value: number) => {
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const next = prev.map(s => Math.abs(s.time - time) >= 0.01 ? s : { ...s, tension: Math.max(0, value) });
        cameraKeyframesRef.current = next;
        return next;
      });
    }
  }, []);

  const handleSetHandle2D = useCallback((trackId: string, time: number, side: 'in' | 'out', slope: number, timeOffset: number) => {
    if (trackId === 'camera-keyframes') {
      const slopeKey = side === 'out' ? 'tensionHandleOut' : 'tensionHandleIn';
      const timeKey = side === 'out' ? 'tensionHandleOutTime' : 'tensionHandleInTime';
      setCameraKeyframes(prev => {
        const next = prev.map(s => {
          if (Math.abs(s.time - time) >= 0.01) return s;
          const updated: Keyframe = { ...s, [slopeKey]: slope, [timeKey]: timeOffset };
          if (updated.mode !== 'broken') {
            const oppSlope = side === 'out' ? 'tensionHandleIn' : 'tensionHandleOut';
            const oppTime = side === 'out' ? 'tensionHandleInTime' : 'tensionHandleOutTime';
            (updated as Record<string, unknown>)[oppSlope] = slope;
            (updated as Record<string, unknown>)[oppTime] = timeOffset;
          }
          return updated;
        });
        cameraKeyframesRef.current = next;
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      const slopeKey = side === 'out' ? 'handleOut' : 'handleIn';
      const timeKey = side === 'out' ? 'handleOutTime' : 'handleInTime';
      setPhysicsKeyframes(prev => {
        const kfs = (prev[trackId] ?? []).map(k => {
          if (Math.abs(k.time - time) >= 0.01) return k;
          const nextKf = { ...k, [slopeKey]: slope, [timeKey]: timeOffset };
          if (nextKf.mode !== 'broken') {
            const oppSlope = side === 'out' ? 'handleIn' : 'handleOut';
            const oppTime = side === 'out' ? 'handleInTime' : 'handleOutTime';
            (nextKf as Record<string, unknown>)[oppSlope] = slope;
            (nextKf as Record<string, unknown>)[oppTime] = timeOffset;
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
          if (mode === 'aligned' && nextKf.handleOutPos) nextKf.handleInPos = { ...nextKf.handleOutPos };
          if (mode === 'aligned' && nextKf.handleOutTgt) nextKf.handleInTgt = { ...nextKf.handleOutTgt };
          if (mode === 'aligned' && nextKf.tensionHandleOut !== undefined) nextKf.tensionHandleIn = nextKf.tensionHandleOut;
          if (mode === 'aligned' && nextKf.tensionHandleOutTime !== undefined) nextKf.tensionHandleInTime = nextKf.tensionHandleOutTime;
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
          }
          if (mode === 'aligned' && nextKf.handleOutTime !== undefined) {
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

  const handleDeleteKeyframe = useCallback((trackId: string, time: number) => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const next = prevCkfs.filter(s => Math.abs(s.time - time) > 0.1);
        cameraKeyframesRef.current = next;
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && Math.abs(s.time - time) < 0.1)));
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const kfs = (prevPkfs[trackId] ?? []).filter(k => Math.abs(k.time - time) > 0.1);
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && Math.abs(s.time - time) < 0.1)));
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  const handleDuplicateKeyframe = useCallback((trackId: string, srcTime: number, destTime: number) => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const src = prevCkfs.find(s => Math.abs(s.time - srcTime) < 0.01);
        if (!src) return prevCkfs;
        const filtered = prevCkfs.filter(s => Math.abs(s.time - destTime) > 0.1);
        const next = [...filtered, { ...src, time: destTime }].sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, cameraKeyframes: cameraKeyframesRef.current });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const src = (prevPkfs[trackId] ?? []).find(k => Math.abs(k.time - srcTime) < 0.01);
        if (!src) return prevPkfs;
        const filtered = (prevPkfs[trackId] ?? []).filter(k => Math.abs(k.time - destTime) > 0.1);
        const kfs = [...filtered, { ...src, time: destTime }].sort((a, b) => a.time - b.time);
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
      pushHistory({ ...prev, physicsKeyframes: physicsKeyframesRef.current });
    }
  }, [getTimelineState, pushHistory]);

  // color helper to derive light fill
  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const bigint = parseInt(full, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  };
  const lightenHex = (hex: string, percent: number) => {
    const { r, g, b } = hexToRgb(hex);
    const p = Math.max(0, Math.min(100, percent)) / 100;
    const nr = Math.round(r + (255 - r) * p);
    const ng = Math.round(g + (255 - g) * p);
    const nb = Math.round(b + (255 - b) * p);
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
  };

  const handleApplyNodeStylePreset = useCallback((preset: 'outline' | 'filled' | 'reset') => {
    if (preset === 'reset') {
      setNodeAppearance(defaultNodeAppearance);
      setLastAppliedPreset(null);
      return;
    }
    const inner = gradientSettings.innerColor ?? defaultGradientSettings.innerColor;
    if (preset === 'outline') {
      setNodeAppearance({ borderColor: inner, fillColor: lightenHex(inner, 0.8), textColor: inner });
      setLastAppliedPreset('outline');
    } else if (preset === 'filled') {
      setNodeAppearance({ borderColor: '#FFFFFFCC', fillColor: inner, textColor: '#ffffff' });
      setLastAppliedPreset('filled');
    }
  }, [gradientSettings]);

  /* ── Scene marker handlers ── */

  const handleAddSceneMarker = useCallback((time: number) => {
    const prev = getTimelineState();
    const next = [...sceneMarkersRef.current, { time, label }].sort((a, b) => a.time - b.time);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory({ ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  // Lightweight: only moves the marker position during drag (no cascade, no swap, no history).
  const handleMoveSceneMarker = useCallback((oldTime: number, newTime: number) => {
    const delta = newTime - oldTime;
    const sel = selectedKeyframesRef.current;
    const isMultiDrag = sel.length > 1 && sel.some(s => s.track === 'scene-markers' && Math.abs(s.time - oldTime) < 0.01);

    if (isMultiDrag) {
      // Use common multi-move logic (same as handleMoveKeyframe)
      setCameraKeyframes(prev => {
        const selectedTimes = new Set(sel.filter(s => s.track === 'camera-keyframes').map(s => s.time));
        const next = prev.map(s => selectedTimes.has(s.time)
          ? { ...s, time: Math.max(0, Math.min(TIMELINE_DURATION, s.time + delta)) }
          : s
        ).sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      setPhysicsKeyframes(prev => {
        const nextKfs: Record<string, PhysicsKeyframe[]> = { ...prev };
        for (const tid of Object.keys(PHYS_TRACK_PARAM)) {
          const selectedTimes = new Set(sel.filter(s => s.track === tid).map(s => s.time));
          nextKfs[tid] = (prev[tid] ?? []).map(k => selectedTimes.has(k.time)
            ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) }
            : k
          ).sort((a, b) => a.time - b.time);
        }
        physicsKeyframesRef.current = nextKfs;
        return nextKfs;
      });
      setSceneMarkers(prev => {
        const selectedTimes = new Set(sel.filter(s => s.track === 'scene-markers').map(s => s.time));
        const next = prev.map(m => selectedTimes.has(m.time)
          ? { ...m, time: Math.max(0, Math.min(TIMELINE_DURATION, m.time + delta)) }
          : m
        ).sort((a, b) => a.time - b.time);
        sceneMarkersRef.current = next;
        return next;
      });
      setSelectedKeyframes(prev => prev.map(s => ({
        ...s, time: Math.max(0, Math.min(TIMELINE_DURATION, s.time + delta)),
      })));
    } else {
      const nextMarkers = sceneMarkersRef.current.map(m =>
        Math.abs(m.time - oldTime) < 0.01 ? { ...m, time: newTime } : m
      ).sort((a, b) => a.time - b.time);
      sceneMarkersRef.current = nextMarkers;
      setSceneMarkers(nextMarkers);
    }
  }, []);

  // Full commit on drop: cascade children + collision-swap + push history.
  const handleDropSceneMarker = useCallback((fromTime: number, toTime: number) => {
    if (Math.abs(fromTime - toTime) < 0.001) return;
    const prev = getTimelineState();
    const CHILD_TOLERANCE = 0.1;
    const SWAP_THRESHOLD = 0.5;
    const colliding = sceneMarkersRef.current.find(
      m => Math.abs(m.time - fromTime) > 0.01 && Math.abs(m.time - toTime) < SWAP_THRESHOLD
    );

    if (colliding) {
      const collidingTime = colliding.time;
      const nextMarkers = sceneMarkersRef.current.map(m => {
        if (Math.abs(m.time - toTime) < 0.01) return { ...m, time: toTime };
        if (Math.abs(m.time - collidingTime) < 0.01) return { ...m, time: fromTime };
        return m;
      }).sort((a, b) => a.time - b.time);
      sceneMarkersRef.current = nextMarkers;
      setSceneMarkers(nextMarkers);
      setCameraKeyframes(ckfs => {
        const next = ckfs.map(k => {
          if (Math.abs(k.time - fromTime) <= CHILD_TOLERANCE) return { ...k, time: toTime };
          if (Math.abs(k.time - collidingTime) <= CHILD_TOLERANCE) return { ...k, time: fromTime };
          return k;
        }).sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      setPhysicsKeyframes(pkfs => {
        const next: Record<string, PhysicsKeyframe[]> = { ...pkfs };
        for (const tid of Object.keys(pkfs)) {
          next[tid] = (pkfs[tid] ?? []).map(k => {
            if (Math.abs(k.time - fromTime) <= CHILD_TOLERANCE) return { ...k, time: toTime };
            if (Math.abs(k.time - collidingTime) <= CHILD_TOLERANCE) return { ...k, time: fromTime };
            return k;
          }).sort((a, b) => a.time - b.time);
        }
        physicsKeyframesRef.current = next;
        return next;
      });
      pushHistory(prev, { ...getTimelineState(), sceneMarkers: nextMarkers });
    } else {
      const delta = toTime - fromTime;
      const nextMarkers = sceneMarkersRef.current.map(m =>
        Math.abs(m.time - toTime) < 0.01 ? { ...m, time: toTime } : m
      ).sort((a, b) => a.time - b.time);
      sceneMarkersRef.current = nextMarkers;
      setSceneMarkers(nextMarkers);
      setCameraKeyframes(ckfs => {
        const next = ckfs.map(k =>
          Math.abs(k.time - fromTime) < CHILD_TOLERANCE
            ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) }
            : k
        ).sort((a, b) => a.time - b.time);
        cameraKeyframesRef.current = next;
        return next;
      });
      setPhysicsKeyframes(pkfs => {
        const next: Record<string, PhysicsKeyframe[]> = { ...pkfs };
        for (const tid of Object.keys(pkfs)) {
          next[tid] = (pkfs[tid] ?? []).map(k =>
            Math.abs(k.time - fromTime) < CHILD_TOLERANCE
              ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) }
              : k
          ).sort((a, b) => a.time - b.time);
        }
        physicsKeyframesRef.current = next;
        return next;
      });
      pushHistory(prev, { ...getTimelineState(), sceneMarkers: nextMarkers });
    }
  }, [getTimelineState, pushHistory]);

  const handleDeleteSceneMarker = useCallback((time: number) => {
    const prev = getTimelineState();
    const next = sceneMarkersRef.current.filter(m => Math.abs(m.time - time) > 0.01);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory(prev, { ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  const handleRenameSceneMarker = useCallback((time: number, label: string) => {
    const prev = getTimelineState();
    const next = sceneMarkersRef.current.map(m => Math.abs(m.time - time) < 0.01 ? { ...m, label } : m);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory(prev, { ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  /* ── Selection ── */

  const handleKeyframeSelect = useCallback((track: string, time: number, additive: boolean) => {
    setSelectedKeyframes(prev => {
      const already = prev.some(s => s.track === track && Math.abs(s.time - time) < 0.01);
      if (additive) {
        return already
          ? prev.filter(s => !(s.track === track && Math.abs(s.time - time) < 0.01))
          : [...prev, { track, time }];
      } else {
        // If already selected, keep selection for potential multi-drag.
        // If not selected, clear and select only this one.
        return already ? prev : [{ track, time }];
      }
    });
  }, []);

  const handleSelectKeyframes = useCallback((kfs: { track: string; time: number }[]) => {
    setSelectedKeyframes(kfs);
  }, []);

  const handlePhysicsChange = useCallback((params: Partial<typeof physicsParams>) => {
    setPhysicsParams(prev => ({ ...prev, ...params }));
    
    // When a track has keyframes, slider changes should update the keyframe at the current time
    // or auto-create a new one. Otherwise the slider rubber-bands to the interpolated value.
    const currentTime = playheadRef.current;
    setPhysicsKeyframes(prevKfs => {
      let changed = false;
      const nextKfs = { ...prevKfs };
      
      for (const [trackId, paramName] of Object.entries(PHYS_TRACK_PARAM)) {
        const newVal = (params as Record<string, number>)[paramName];
        if (newVal === undefined) continue;

        const track = prevKfs[trackId] ?? [];
        const isRecordingLocal = isRecordingRef.current;
        if (track.length === 0 && !isRecordingLocal) continue; // No keyframes and not recording
        
        const kfIdx = track.findIndex(k => Math.abs(k.time - currentTime) <= 0.1);
        if (kfIdx >= 0) {
          if (newVal !== track[kfIdx].value) {
            nextKfs[trackId] = track.map((k, i) => i === kfIdx ? { ...k, value: newVal } : k);
            changed = true;
          }
        } else {
          // Auto-key or Recording
          const nextTrack = [...track, { time: currentTime, value: newVal, mode: 'aligned' as const }].sort((a, b) => a.time - b.time);
          nextKfs[trackId] = nextTrack;
          changed = true;
        }
      }
      
      if (!changed) return prevKfs;
      physicsKeyframesRef.current = nextKfs;
      return nextKfs;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTogglePhysicsKeyframe = useCallback((trackId: string, value: number) => {
    const prev = getTimelineState();
    const currentTime = playheadRef.current;
    setPhysicsKeyframes(prevKfs => {
      const track = prevKfs[trackId] ?? [];
      const hasKf = track.some(k => Math.abs(k.time - currentTime) <= 0.1);
      const next = hasKf
        ? { ...prevKfs, [trackId]: track.filter(k => Math.abs(k.time - currentTime) > 0.1) }
        : { ...prevKfs, [trackId]: [...track, { time: currentTime, value, mode: 'aligned' as const }].sort((a, b) => a.time - b.time) };
      physicsKeyframesRef.current = next;
      pushHistory(prev, { ...prev, physicsKeyframes: next });
      return next;
    });
  }, [getTimelineState, pushHistory]);

  const startInspectorResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = inspectorWidth;
    const onMove = (ev: MouseEvent) => setInspectorWidth(Math.max(DEFAULT_INSPECTOR_WIDTH, Math.min(600, startWidth + (startX - ev.clientX))));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [inspectorWidth]);

  const startTimelineResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = timelineHeight;
    const onMove = (ev: MouseEvent) => setTimelineHeight(Math.max(100, Math.min(600, startHeight - (ev.clientY - startY))));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timelineHeight]);


  // Mark network as not ready whenever a heavy rebuild is triggered
  useEffect(() => {
    setIsNetworkReady(false);
  }, [inputText, viewMode, parseMode]);

  return (
    <div 
      className="app-shell flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden select-none"
      style={{ 
        cursor: activeTool === 'pan' ? 'grab' : 
                activeTool === 'paint' ? 'crosshair' : 
                activeTool === 'zoom' ? 'zoom-in' : 
                activeTool === 'scale' ? 'nwse-resize' : 'default' 
      }}
    >
      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-row overflow-hidden min-h-0 relative">
        {/* Main Viewport Area */}
        <div className="flex-1 relative overflow-hidden h-full">
          {/* Background Canvas - positioned absolutely between measured UI bands */}
          <div 
            className="absolute left-0 right-0 z-0"
            style={{ 
              top: overlayBandOffsets.top, 
              bottom: overlayBandOffsets.bottom 
            }}
          >
            <Preview
              ref={network3DRef} viewMode={viewMode} physicsEnabled={true}
              isPlaying={isPlaying} playheadPosition={playheadPosition}
              physicsParams={physicsParams} inputText={inputText} parseMode={parseMode}
              gradientSettings={gradientSettings} styleSettings={styleSettings}
              cameraKeyframes={cameraKeyframes} onCameraChange={handleCameraChange}
              physicsKeyframes={physicsKeyframes}
              isDark={previewIsDark}
              isNetworkReady={isNetworkReady} onNetworkReady={() => setIsNetworkReady(true)}
              renderMode={renderMode}
              nodeAppearance={nodeAppearance} edgeAppearance={edgeAppearance}
              canvasAspectRatio={canvasAspectRatio}
              initProgress={initProgress}
              visualSettings={visualSettings}
              onNodeSelect={setSelectedNode}
            />
          </div>

          {/* Toolbar - Floating Left inside artboard, respects UI bands */}
          <div 
            className="absolute left-6 z-50 flex items-center pointer-events-none"
            style={{ 
              top: overlayBandOffsets.top + 12, 
              bottom: overlayBandOffsets.bottom + 12 
            }}
          >
            <div className="pointer-events-auto">
              <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
            </div>
          </div>

          {/* Floating Path Animator UI - only when tool is active */}
          {activeTool === 'path' && (
            <div 
              className="absolute left-20 z-[60] pointer-events-none"
              style={{ top: overlayBandOffsets.top + 96 }}
            >
              <div className="pointer-events-auto">
                <PathAnimatorUI 
                  nodes={[]} 
                  onReorder={() => {}} 
                  onRemove={() => {}} 
                  onClose={() => setActiveTool('pointer')} 
                />
              </div>
            </div>
          )}

          {/* Floating TopBar - now part of absolute viewport layout as per STYLE_GUIDE */}
          <div ref={topBarContainerRef} className="absolute top-0 left-0 right-0 z-50 pointer-events-none p-2">
            <TopBar
              viewMode={viewMode} onViewModeChange={(mode) => {
                setViewMode(mode);
                setPhysicsParams(p => ({ ...p, gravity: mode === '2D' ? 3 : 0 }));
              }}
              themeMode={themeMode} onThemeModeChange={setThemeMode}
              renderMode={renderMode} onRenderModeChange={setRenderMode}
              onSaveState={handleSave}
              onLoadState={handleLoad}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < keyframeHistory.length - 1}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onApplyNodeStylePreset={handleApplyNodeStylePreset}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
            />
          </div>

          <ShortcutsDialog
            isOpen={isShortcutsOpen}
            onOpenChange={setIsShortcutsOpen}
            shortcuts={shortcuts}
            onAddShortcut={(command, key) => setShortcuts(prev => [...prev, { id: Date.now().toString(), command, key }])}
            onRemoveShortcut={(id) => setShortcuts(prev => prev.filter(s => s.id !== id))}
          />

          {/* Floating Timeline - stays absolute to viewport bottom as per STYLE_GUIDE */}
          <div ref={timelineContainerRef} className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col">
            <div 
              className="h-1 shrink-0 cursor-row-resize bg-white/10 hover:bg-white/30 transition-colors pointer-events-auto"
              onMouseDown={startTimelineResize}
              onDoubleClick={() => setTimelineHeight(DEFAULT_TIMELINE_HEIGHT)}
            />

            <div className="pointer-events-auto">
              <Timeline
                isPlaying={isPlaying} onPlayPause={handlePlayPause} onStop={handleStop}
                playheadPosition={playheadPosition}
                onPlayheadChange={pos => { setPlayheadPosition(pos); if (isPlaying) setIsPlaying(false); }}
                selectedKeyframes={selectedKeyframes}
                onKeyframeSelect={handleKeyframeSelect}
                onSelectKeyframes={handleSelectKeyframes}
                cameraKeyframes={cameraKeyframes} onCaptureKeyframe={handleCaptureKeyframe}
                physicsKeyframes={physicsKeyframes}
                onMoveKeyframe={handleMoveKeyframe}
                onSetHandle={handleSetHandle}
                onSetHandle2D={handleSetHandle2D}
                onSetValue={handleSetValue}
                onClearHandle={handleClearHandle}
                onSetInterpolation={handleSetInterpolation}
                onDeleteKeyframe={handleDeleteKeyframe} onDuplicateKeyframe={handleDuplicateKeyframe}
                onDragStart={handleDragStart} onDragEnd={handleDragEnd}
                timecode={timecode} onUndo={handleUndo} onRedo={handleRedo}
                canUndo={historyIndex > 0} canRedo={historyIndex < keyframeHistory.length - 1}
                height={timelineHeight}
                sceneMarkers={sceneMarkers}
                onAddSceneMarker={handleAddSceneMarker}
                onMoveSceneMarker={handleMoveSceneMarker}
                onDropSceneMarker={handleDropSceneMarker}
                onDeleteSceneMarker={handleDeleteSceneMarker}
                onRenameSceneMarker={handleRenameSceneMarker}
                isRecording={isRecording}
                onToggleRecording={() => setIsRecording(!isRecording)}
              />
            </div>
          </div>
        </div>

        {/* Docked Inspector Sidebar */}
        <div 
          className="relative h-full flex flex-row border-l border-zinc-200 bg-zinc-50 z-40 transition-all duration-300 ease-in-out"
          style={{ width: isSidebarOpen ? inspectorWidth : 48 }}
        >
          {/* Resize handle (left edge of sidebar) */}
          {isSidebarOpen && (
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-50"
              onMouseDown={startInspectorResize}
              onDoubleClick={() => setInspectorWidth(DEFAULT_INSPECTOR_WIDTH)}
            />
          )}

          <Inspector
            onPhysicsChange={handlePhysicsChange} onTextChange={setInputText}
            inputText={inputText}
            onParsingChange={setParseMode}
            onGradientChange={setGradientSettings}
            onStyleChange={(partial) => setStyleSettings(prev => ({ ...prev, ...partial }))}
            styleSettings={styleSettings}
            onNodeAppearanceChange={setNodeAppearance} onEdgeAppearanceChange={setEdgeAppearance}
            nodeAppearance={nodeAppearance} appliedNodePreset={lastAppliedPreset}
            effectivePhysicsParams={effectivePhysicsParams}
            canvasAspectRatio={canvasAspectRatio}
            onCanvasAspectRatioChange={setCanvasAspectRatio}
            currentTime={playheadPosition} cameraKeyframes={cameraKeyframes}
            physicsKeyframes={physicsKeyframes}
            onTogglePhysicsKeyframe={handleTogglePhysicsKeyframe}
            width={inspectorWidth} viewMode={viewMode}
            onDeleteKeyframe={(time) => {
              handleDeleteKeyframe('camera-keyframes', time);
            }}
            onCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onPanView={(dx, dy) => network3DRef.current?.panView(dx, dy)}
            onRotateView={(dt, dp) => network3DRef.current?.rotateView(dt, dp)}
            onSetRotation={(t, p) => network3DRef.current?.setRotation(t, p)}
            onResetView={() => network3DRef.current?.resetView()}
            onZoomChange={(val) => {
              setZoomValue(val);
              network3DRef.current?.setZoom(val);
            }}
            zoomValue={zoomValue}
            visualSettings={visualSettings}
            onVisualSettingsChange={setVisualSettings}
            selectedNode={selectedNode}
          />
        </div>
      </div>
    </div>
  );
}





