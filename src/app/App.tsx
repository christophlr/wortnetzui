import { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Timeline } from './components/Timeline';
import type { Network3DHandle } from './components/Network3D';
import { defaultNetworkColorSettings } from './networkTheme';
import { TIMELINE_DURATION } from './constants';

type Keyframe = { time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };
type PhysicsKeyframe = { time: number; value: number; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };
type TimelineState = { cameraKeyframes: Keyframe[]; physicsKeyframes: Record<string, PhysicsKeyframe[]> };

const EMPTY_PHYSICS_KFS = { 'phys-rep': [] as PhysicsKeyframe[], 'phys-spk': [] as PhysicsKeyframe[], 'phys-dmp': [] as PhysicsKeyframe[] };
const PHYS_TRACK_PARAM: Record<string, string> = { 'phys-rep': 'repulsion', 'phys-spk': 'springK', 'phys-dmp': 'damping' };

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [selectedKeyframe, setSelectedKeyframe] = useState<{ track: string; time: number } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [inputText, setInputText] = useState(`Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes far away up the hill. It was 3am that day cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write I write like a ritual over and over. The more exist the more I go I fly they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`);
  const [colorSettings, setColorSettings] = useState(defaultNetworkColorSettings);
  const [styleSettings, setStyleSettings] = useState({ edgeOpacity: 0.35, edgeWidth: 2, nodeScale: 1 });
  const [physicsParams, setPhysicsParams] = useState({ repulsion: 1500, springK: 0.06, damping: 0.88, minSpeed: 0.5, linkDistance: 80, gravity: 0, turbulence: 0 });
  const [cameraKeyframes, setCameraKeyframes] = useState<Keyframe[]>([]);
  const [physicsKeyframes, setPhysicsKeyframes] = useState<Record<string, PhysicsKeyframe[]>>(EMPTY_PHYSICS_KFS);
  const [inspectorWidth, setInspectorWidth] = useState(268);
  const [timelineHeight, setTimelineHeight] = useState(240);

  // Undo/redo history — tracks the full timeline state (camera + physics keyframes)
  const [keyframeHistory, setKeyframeHistory] = useState<TimelineState[]>([{ cameraKeyframes: [], physicsKeyframes: EMPTY_PHYSICS_KFS }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const physicsKeyframesRef = useRef(physicsKeyframes);
  useEffect(() => { physicsKeyframesRef.current = physicsKeyframes; }, [physicsKeyframes]);

  const preDragStateRef = useRef<TimelineState | null>(null);

  const getTimelineState = useCallback((): TimelineState => ({
    cameraKeyframes: cameraKeyframesRef.current,
    physicsKeyframes: physicsKeyframesRef.current,
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
    setHistoryIndex(i => i - 1);
  }, [historyIndex, keyframeHistory]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= keyframeHistory.length - 1) return;
    const entry = keyframeHistory[historyIndex + 1];
    setCameraKeyframes(entry.cameraKeyframes ?? []);
    setPhysicsKeyframes(entry.physicsKeyframes ?? EMPTY_PHYSICS_KFS);
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

  const handleCaptureKeyframe = useCallback(() => {
    const prev = getTimelineState();
    const currentTime = playheadRef.current;

    // Compute next physics kfs synchronously from current physicsParams
    const nextPhysKfs: Record<string, PhysicsKeyframe[]> = { ...physicsKeyframesRef.current };
    for (const trackId of Object.keys(PHYS_TRACK_PARAM)) {
      const param = PHYS_TRACK_PARAM[trackId] as keyof typeof physicsParams;
      const filtered = (nextPhysKfs[trackId] ?? []).filter(k => Math.abs(k.time - currentTime) > 0.1);
      nextPhysKfs[trackId] = [...filtered, { time: currentTime, value: physicsParams[param] }].sort((a, b) => a.time - b.time);
    }
    physicsKeyframesRef.current = nextPhysKfs;
    setPhysicsKeyframes(nextPhysKfs);

    if (viewMode !== '3D') {
      pushHistory(prev, { cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: nextPhysKfs });
      return;
    }

    const keyframe = network3DRef.current?.getCameraKeyframe();
    if (!keyframe) {
      pushHistory(prev, { cameraKeyframes: cameraKeyframesRef.current, physicsKeyframes: nextPhysKfs });
      return;
    }

    const filteredCkfs = cameraKeyframesRef.current.filter(s => Math.abs(s.time - currentTime) > 0.1);
    const nextCkfs = [...filteredCkfs, { ...keyframe, time: currentTime }].sort((a, b) => a.time - b.time);
    cameraKeyframesRef.current = nextCkfs;
    setCameraKeyframes(nextCkfs);
    pushHistory(prev, { cameraKeyframes: nextCkfs, physicsKeyframes: nextPhysKfs });
  }, [viewMode, pushHistory, getTimelineState, physicsParams]);

  const handleCameraChange = useCallback(() => {
    if (viewMode !== '3D') return;
    const currentTime = playheadRef.current;
    if (!cameraKeyframesRef.current.some(s => Math.abs(s.time - currentTime) < 0.1)) return;
    const keyframe = network3DRef.current?.getCameraKeyframe();
    if (!keyframe) return;
    setCameraKeyframes(prev => {
      const filtered = prev.filter(s => Math.abs(s.time - currentTime) > 0.1);
      return [...filtered, { ...keyframe, time: currentTime }].sort((a, b) => a.time - b.time);
    });
  }, [viewMode]);

  const handleMoveKeyframe = useCallback((trackId: string, oldTime: number, newTime: number) => {
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
      setSelectedKeyframe(sel => sel?.track === trackId && Math.abs(sel.time - time) < 0.1 ? null : sel);
    } else if (trackId in PHYS_TRACK_PARAM) {
      setPhysicsKeyframes(prevPkfs => {
        const kfs = (prevPkfs[trackId] ?? []).filter(k => Math.abs(k.time - time) > 0.1);
        const next = { ...prevPkfs, [trackId]: kfs };
        physicsKeyframesRef.current = next;
        pushHistory(prev, { ...prev, physicsKeyframes: next });
        return next;
      });
      setSelectedKeyframe(sel => sel?.track === trackId && Math.abs(sel.time - time) < 0.1 ? null : sel);
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

  const startInspectorResize = useCallback((e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = inspectorWidth;
    const onMove = (ev: MouseEvent) => setInspectorWidth(Math.max(180, Math.min(520, startWidth + ev.clientX - startX)));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [inspectorWidth]);

  const startTimelineResize = useCallback((e: React.MouseEvent) => {
    const startY = e.clientY;
    const startHeight = timelineHeight;
    const onMove = (ev: MouseEvent) => setTimelineHeight(Math.max(100, Math.min(600, startHeight - (ev.clientY - startY))));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timelineHeight]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (t: typeof theme, sysDark: boolean) =>
      document.documentElement.classList.toggle('dark', t === 'dark' || (t === 'system' && sysDark));
    applyTheme(theme, mql.matches);
    if (theme === 'system') {
      const handler = (e: MediaQueryListEvent) => applyTheme('system', e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <div className="size-full flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar
        viewMode={viewMode} onViewModeChange={setViewMode}
        theme={theme} onThemeChange={setTheme}
        onSaveState={() => {
          const state = { inputText, colorSettings, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes };
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
                  if (s.colorSettings) setColorSettings(s.colorSettings);
                  if (s.styleSettings) setStyleSettings(s.styleSettings);
                  if (s.physicsParams) setPhysicsParams(s.physicsParams);
                  if (s.viewMode) setViewMode(s.viewMode);
                  if (s.cameraKeyframes) setCameraKeyframes(s.cameraKeyframes);
                  if (s.physicsKeyframes) setPhysicsKeyframes(s.physicsKeyframes);
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
          onPhysicsChange={setPhysicsParams} onTextChange={setInputText}
          onColorChange={setColorSettings} onStyleChange={setStyleSettings}
          currentTime={playheadPosition} cameraKeyframes={cameraKeyframes}
          width={inspectorWidth}
          onDeleteKeyframe={(time) => {
            handleDeleteKeyframe('camera-keyframes', time);
          }}
        />
        <div
          className="w-1 shrink-0 cursor-col-resize bg-border/30 hover:bg-interactive/40 transition-colors"
          onMouseDown={startInspectorResize}
        />
        <Preview
          ref={network3DRef} viewMode={viewMode} physicsEnabled={true}
          isPlaying={isPlaying} playheadPosition={playheadPosition}
          physicsParams={physicsParams} inputText={inputText}
          colorSettings={colorSettings} styleSettings={styleSettings}
          cameraKeyframes={cameraKeyframes} onCameraChange={handleCameraChange}
          physicsKeyframes={physicsKeyframes}
          theme={theme}
        />
      </div>
      <div
        className="h-1 shrink-0 cursor-row-resize bg-border/30 hover:bg-interactive/40 transition-colors"
        onMouseDown={startTimelineResize}
      />
      <Timeline
        isPlaying={isPlaying} onPlayPause={handlePlayPause} onStop={handleStop}
        playheadPosition={playheadPosition}
        onPlayheadChange={pos => { setPlayheadPosition(pos); if (isPlaying) setIsPlaying(false); }}
        selectedKeyframe={selectedKeyframe}
        onKeyframeSelect={(track, time) => setSelectedKeyframe({ track, time })}
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
      />
    </div>
  );
}
