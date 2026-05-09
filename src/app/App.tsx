import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Timeline } from './components/Timeline';
import type { Network3DHandle } from './components/Network3D';
import { defaultGradientSettings, defaultNodeAppearance, defaultEdgeAppearance, type GradientSettings, type NodeShape, type NodeAppearanceSettings, type EdgeAppearanceSettings } from './networkTheme';
import { TIMELINE_DURATION } from './constants';
import { solveBezierEasing, computeAutoWeights } from './easing';

type Keyframe = { time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };
type PhysicsKeyframe = { time: number; value: number; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };
export type SceneMarker = { time: number; label: string };
type TimelineState = { cameraKeyframes: Keyframe[]; physicsKeyframes: Record<string, PhysicsKeyframe[]>; sceneMarkers: SceneMarker[] };

const EMPTY_PHYSICS_KFS = { 'phys-rep': [] as PhysicsKeyframe[], 'phys-spk': [] as PhysicsKeyframe[], 'phys-dmp': [] as PhysicsKeyframe[] };
const DEFAULT_INSPECTOR_WIDTH = 300;
const DEFAULT_TIMELINE_HEIGHT = 280;
const PHYS_TRACK_PARAM: Record<string, string> = { 'phys-rep': 'repulsion', 'phys-spk': 'springK', 'phys-dmp': 'damping' };

function interpolatePhysicsParam(sorted: PhysicsKeyframe[], time: number): number | null {
  if (sorted.length === 0) return null;
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const segDur = b.time - a.time;
      const tRaw = (time - a.time) / segDur;
      const isAuto = a.interpolation === 'auto' || b.interpolation === 'auto';
      let outW: number;
      let inW: number;
      if (isAuto) {
        const prevDur = i > 0 ? a.time - sorted[i - 1].time : null;
        const nextDur = i + 2 < sorted.length ? sorted[i + 2].time - b.time : null;
        ({ outWeight: outW, inWeight: inW } = computeAutoWeights(segDur, prevDur, nextDur));
      } else {
        outW = a.outWeight ?? 0;
        inW = b.inWeight ?? 0;
      }
      const easedT = solveBezierEasing(tRaw, outW, inW);
      return a.value + (b.value - a.value) * easedT;
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
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
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
  const [physicsParams, setPhysicsParams] = useState({ repulsion: 1500, springK: 0.06, damping: 0.88, minSpeed: 0.5, linkDistance: 80, gravity: 0, turbulence: 0 });
  const [cameraKeyframes, setCameraKeyframes] = useState<Keyframe[]>([]);
  const [physicsKeyframes, setPhysicsKeyframes] = useState<Record<string, PhysicsKeyframe[]>>(EMPTY_PHYSICS_KFS);
  const [inspectorWidth, setInspectorWidth] = useState(DEFAULT_INSPECTOR_WIDTH);
  const [timelineHeight, setTimelineHeight] = useState(DEFAULT_TIMELINE_HEIGHT);
  const [isNetworkReady, setIsNetworkReady] = useState(false);
  const [renderMode, setRenderMode] = useState<'edit' | 'render'>('edit');
  const [nodeAppearance, setNodeAppearance] = useState<NodeAppearanceSettings>(defaultNodeAppearance);
  const [edgeAppearance, setEdgeAppearance] = useState<EdgeAppearanceSettings>(defaultEdgeAppearance);

  // Undo/redo history — tracks the full timeline state
  const [keyframeHistory, setKeyframeHistory] = useState<TimelineState[]>([{ cameraKeyframes: [], physicsKeyframes: EMPTY_PHYSICS_KFS, sceneMarkers: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const physicsKeyframesRef = useRef(physicsKeyframes);
  useEffect(() => { physicsKeyframesRef.current = physicsKeyframes; }, [physicsKeyframes]);

  const sceneMarkersRef = useRef(sceneMarkers);
  useEffect(() => { sceneMarkersRef.current = sceneMarkers; }, [sceneMarkers]);

  const selectedKeyframesRef = useRef(selectedKeyframes);
  useEffect(() => { selectedKeyframesRef.current = selectedKeyframes; }, [selectedKeyframes]);

  const preDragStateRef = useRef<TimelineState | null>(null);

  const getTimelineState = useCallback((): TimelineState => ({
    cameraKeyframes: cameraKeyframesRef.current,
    physicsKeyframes: physicsKeyframesRef.current,
    sceneMarkers: sceneMarkersRef.current,
  }), []);

  const pushHistory = useCallback((prev: TimelineState, next: TimelineState) => {
    setKeyframeHistory(h => [...h.slice(0, historyIndex + 1), prev, next].slice(-50));
    setHistoryIndex(i => Math.min(i + 1, 49));
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
    pushHistory(preDragStateRef.current, getTimelineState());
    preDragStateRef.current = null;
  }, [pushHistory, getTimelineState]);

  const network3DRef = useRef<Network3DHandle>(null);
  const playheadRef = useRef(playheadPosition);
  const cameraKeyframesRef = useRef(cameraKeyframes);
  useEffect(() => { playheadRef.current = playheadPosition; }, [playheadPosition]);
  useEffect(() => { cameraKeyframesRef.current = cameraKeyframes; }, [cameraKeyframes]);

  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
      const v = interpolatePhysicsParam(sorted, playheadPosition);
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
        ? { outWeight: existingK.outWeight, inWeight: existingK.inWeight, interpolation: existingK.interpolation }
        : { interpolation: 'auto' as const };
      nextPhysKfs[trackId] = [...filtered, { time: currentTime, value: effectivePhysics[param], ...easingProps }]
        .sort((a, b) => a.time - b.time);
    }
    physicsKeyframesRef.current = nextPhysKfs;
    setPhysicsKeyframes(nextPhysKfs);

    if (viewMode !== '3D') {
      pushHistory(prev, { ...prev, physicsKeyframes: nextPhysKfs });
      return;
    }

    const keyframe = network3DRef.current?.getCameraKeyframe();
    if (!keyframe) {
      pushHistory(prev, { ...prev, physicsKeyframes: nextPhysKfs });
      return;
    }

    // Preserve existing easing for camera keyframes; default new ones to auto
    const existingCK = cameraKeyframesRef.current.find(s => Math.abs(s.time - currentTime) <= 0.1);
    const filteredCkfs = cameraKeyframesRef.current.filter(s => Math.abs(s.time - currentTime) > 0.1);
    const cameraEasingProps = existingCK
      ? { outWeight: existingCK.outWeight, inWeight: existingCK.inWeight, interpolation: existingCK.interpolation }
      : { interpolation: 'auto' as const };
    const nextCkfs = [...filteredCkfs, { ...keyframe, ...cameraEasingProps, time: currentTime }]
      .sort((a, b) => a.time - b.time);
    cameraKeyframesRef.current = nextCkfs;
    setCameraKeyframes(nextCkfs);
    pushHistory(prev, { ...prev, cameraKeyframes: nextCkfs, physicsKeyframes: nextPhysKfs });
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
        ? { outWeight: existingCK.outWeight, inWeight: existingCK.inWeight, interpolation: existingCK.interpolation }
        : { interpolation: 'auto' as const };
      const next = [...filtered, { ...keyframe, ...easingProps, time: currentTime }].sort((a, b) => a.time - b.time);
      cameraKeyframesRef.current = next;
      return next;
    });
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
    const clamped = Math.max(0, Math.min(1, weight));
    const key = side === 'out' ? 'outWeight' : 'inWeight';
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const next = prev.map(s => Math.abs(s.time - time) < 0.01 ? { ...s, [key]: clamped } : s);
        cameraKeyframesRef.current = next;
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prev => {
        const kfs = (prev[trackId] ?? []).map(k => Math.abs(k.time - time) < 0.01 ? { ...k, [key]: clamped } : k);
        const next = { ...prev, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        return next;
      });
    }
  }, []);

  const handleSetInterpolation = useCallback((trackId: string, time: number, mode: 'auto' | 'manual') => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const next = prevCkfs.map(s => Math.abs(s.time - time) < 0.01 ? { ...s, interpolation: mode } : s);
        cameraKeyframesRef.current = next;
        pushHistory(prev, { ...prev, cameraKeyframes: next });
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const kfs = (prevPkfs[trackId] ?? []).map(k => Math.abs(k.time - time) < 0.01 ? { ...k, interpolation: mode } : k);
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        pushHistory(prev, { ...prev, physicsKeyframes: next });
        return next;
      });
    }
  }, [getTimelineState, pushHistory]);

  const handleDeleteKeyframe = useCallback((trackId: string, time: number) => {
    const prev = getTimelineState();
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prevCkfs => {
        const next = prevCkfs.filter(s => Math.abs(s.time - time) > 0.1);
        cameraKeyframesRef.current = next;
        pushHistory(prev, { ...prev, cameraKeyframes: next });
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && Math.abs(s.time - time) < 0.1)));
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const kfs = (prevPkfs[trackId] ?? []).filter(k => Math.abs(k.time - time) > 0.1);
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        pushHistory(prev, { ...prev, physicsKeyframes: next });
        return next;
      });
      setSelectedKeyframes(sel => sel.filter(s => !(s.track === trackId && Math.abs(s.time - time) < 0.1)));
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
        pushHistory(prev, { ...prev, cameraKeyframes: next });
        return next;
      });
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const src = (prevPkfs[trackId] ?? []).find(k => Math.abs(k.time - srcTime) < 0.01);
        if (!src) return prevPkfs;
        const filtered = (prevPkfs[trackId] ?? []).filter(k => Math.abs(k.time - destTime) > 0.1);
        const kfs = [...filtered, { ...src, time: destTime }].sort((a, b) => a.time - b.time);
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        pushHistory(prev, { ...prev, physicsKeyframes: next });
        return next;
      });
    }
  }, [getTimelineState, pushHistory]);

  /* ── Scene marker handlers ── */

  const handleAddSceneMarker = useCallback((time: number) => {
    const prev = getTimelineState();
    const label = `Scene ${sceneMarkersRef.current.length + 1}`;
    const next = [...sceneMarkersRef.current, { time, label }].sort((a, b) => a.time - b.time);
    sceneMarkersRef.current = next;
    setSceneMarkers(next);
    pushHistory(prev, { ...prev, sceneMarkers: next });
  }, [getTimelineState, pushHistory]);

  const handleMoveSceneMarker = useCallback((oldTime: number, newTime: number) => {
    const delta = newTime - oldTime;
    const TOLERANCE = 0.1;
    const nextMarkers = sceneMarkersRef.current.map(m =>
      Math.abs(m.time - oldTime) < 0.01 ? { ...m, time: newTime } : m
    ).sort((a, b) => a.time - b.time);
    sceneMarkersRef.current = nextMarkers;
    setSceneMarkers(nextMarkers);
    setCameraKeyframes(prev => {
      const next = prev.map(k =>
        Math.abs(k.time - oldTime) < TOLERANCE
          ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) }
          : k
      ).sort((a, b) => a.time - b.time);
      cameraKeyframesRef.current = next;
      return next;
    });
    setPhysicsKeyframes(prev => {
      const next: Record<string, PhysicsKeyframe[]> = { ...prev };
      for (const tid of Object.keys(prev)) {
        next[tid] = (prev[tid] ?? []).map(k =>
          Math.abs(k.time - oldTime) < TOLERANCE
            ? { ...k, time: Math.max(0, Math.min(TIMELINE_DURATION, k.time + delta)) }
            : k
        ).sort((a, b) => a.time - b.time);
      }
      physicsKeyframesRef.current = next;
      return next;
    });
  }, []);

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
    if (additive) {
      setSelectedKeyframes(prev => {
        const already = prev.some(s => s.track === track && Math.abs(s.time - time) < 0.01);
        return already
          ? prev.filter(s => !(s.track === track && Math.abs(s.time - time) < 0.01))
          : [...prev, { track, time }];
      });
    } else {
      setSelectedKeyframes([{ track, time }]);
    }
  }, []);

  const handleSelectKeyframes = useCallback((kfs: { track: string; time: number }[]) => {
    setSelectedKeyframes(kfs);
  }, []);

  const handlePhysicsChange = useCallback((params: typeof physicsParams) => {
    setPhysicsParams(params);
    // When a keyframe exists at the current time, update its value so the
    // slider change takes effect (keyframe interpolation overrides physicsParams).
    const currentTime = playheadRef.current;
    setPhysicsKeyframes(prevKfs => {
      let changed = false;
      const nextKfs = { ...prevKfs };
      for (const [trackId, paramName] of Object.entries(PHYS_TRACK_PARAM)) {
        const track = prevKfs[trackId] ?? [];
        const kfIdx = track.findIndex(k => Math.abs(k.time - currentTime) <= 0.1);
        if (kfIdx >= 0) {
          const newVal = (params as Record<string, number>)[paramName];
          if (newVal !== track[kfIdx].value) {
            nextKfs[trackId] = track.map((k, i) => i === kfIdx ? { ...k, value: newVal } : k);
            changed = true;
          }
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
        : { ...prevKfs, [trackId]: [...track, { time: currentTime, value, interpolation: 'auto' as const }].sort((a, b) => a.time - b.time) };
      physicsKeyframesRef.current = next;
      pushHistory(prev, { ...prev, physicsKeyframes: next });
      return next;
    });
  }, [getTimelineState, pushHistory]);

  const startInspectorResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = inspectorWidth;
    const onMove = (ev: MouseEvent) => setInspectorWidth(Math.max(180, Math.min(520, startWidth + ev.clientX - startX)));
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

  const [sysDark, setSysDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const isDark = theme === 'dark' || (theme === 'system' && sysDark);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSysDark(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  // Mark network as not ready whenever a heavy rebuild is triggered
  useEffect(() => {
    setIsNetworkReady(false);
  }, [inputText, viewMode, parseMode]);

  return (
    <div className="size-full flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar
        viewMode={viewMode} onViewModeChange={(mode) => {
          setViewMode(mode);
          setPhysicsParams(p => ({ ...p, gravity: mode === '2D' ? 3 : 0 }));
        }}
        theme={theme} onThemeChange={setTheme}
        renderMode={renderMode} onRenderModeChange={setRenderMode}
        onSaveState={() => {
          const state = { inputText, parseMode, gradientSettings, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers };
          const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob); const a = document.createElement('a');
          a.href = url; a.download = `sprachvernetzungen-${Date.now()}.json`; a.click();
          URL.revokeObjectURL(url);
        }}
        onLoadState={() => {
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
                  if (s.physicsParams) setPhysicsParams(s.physicsParams);
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
        }}
      />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Inspector
          onPhysicsChange={handlePhysicsChange} onTextChange={setInputText}
          onParsingChange={setParseMode}
          onGradientChange={setGradientSettings} onStyleChange={setStyleSettings}
          onNodeAppearanceChange={setNodeAppearance} onEdgeAppearanceChange={setEdgeAppearance}
          effectivePhysicsParams={effectivePhysicsParams}
          currentTime={playheadPosition} cameraKeyframes={cameraKeyframes}
          physicsKeyframes={physicsKeyframes}
          onTogglePhysicsKeyframe={handleTogglePhysicsKeyframe}
          width={inspectorWidth} viewMode={viewMode}
          onDeleteKeyframe={(time) => {
            handleDeleteKeyframe('camera-keyframes', time);
          }}
        />
        <div
          className="w-1 shrink-0 cursor-col-resize bg-border/30 hover:bg-accent/40 transition-[color,background-color,box-shadow]"
          onMouseDown={startInspectorResize}
          onDoubleClick={() => setInspectorWidth(DEFAULT_INSPECTOR_WIDTH)}
        />
        <Preview
          ref={network3DRef} viewMode={viewMode} physicsEnabled={true}
          isPlaying={isPlaying} playheadPosition={playheadPosition}
          physicsParams={physicsParams} inputText={inputText} parseMode={parseMode}
          gradientSettings={gradientSettings} styleSettings={styleSettings}
          cameraKeyframes={cameraKeyframes} onCameraChange={handleCameraChange}
          physicsKeyframes={physicsKeyframes}
          theme={theme} isDark={isDark}
          isNetworkReady={isNetworkReady} onNetworkReady={() => setIsNetworkReady(true)}
          renderMode={renderMode}
          nodeAppearance={nodeAppearance} edgeAppearance={edgeAppearance}
        />
      </div>
      <div
        className="h-1 shrink-0 cursor-row-resize bg-border/30 hover:bg-accent/40 transition-[color,background-color,box-shadow]"
        onMouseDown={startTimelineResize}
        onDoubleClick={() => setTimelineHeight(DEFAULT_TIMELINE_HEIGHT)}
      />
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
        onSetInterpolation={handleSetInterpolation}
        onDeleteKeyframe={handleDeleteKeyframe} onDuplicateKeyframe={handleDuplicateKeyframe}
        onDragStart={handleDragStart} onDragEnd={handleDragEnd}
        timecode={timecode} onUndo={handleUndo} onRedo={handleRedo}
        canUndo={historyIndex > 0} canRedo={historyIndex < keyframeHistory.length - 1}
        height={timelineHeight}
        sceneMarkers={sceneMarkers}
        onAddSceneMarker={handleAddSceneMarker}
        onMoveSceneMarker={handleMoveSceneMarker}
        onDeleteSceneMarker={handleDeleteSceneMarker}
        onRenameSceneMarker={handleRenameSceneMarker}
      />
    </div>
  );
}
