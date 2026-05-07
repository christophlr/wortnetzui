import { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Timeline } from './components/Timeline';
import type { Network3DHandle } from './components/Network3D';
import { defaultNetworkColorSettings } from './networkTheme';
import { TIMELINE_DURATION } from './constants';
type Keyframe = { time: number; position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };

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
  const [inspectorWidth, setInspectorWidth] = useState(268);
  const [timelineHeight, setTimelineHeight] = useState(240);

  // Undo/redo history
  const [keyframeHistory, setKeyframeHistory] = useState<Keyframe[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((prev: Keyframe[], next: Keyframe[]) => {
    setKeyframeHistory(h => [...h.slice(0, historyIndex + 1), prev, next].slice(-50));
    setHistoryIndex(i => Math.min(i + 1, 49));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    setCameraKeyframes(keyframeHistory[historyIndex - 1] ?? []);
    setHistoryIndex(i => i - 1);
  }, [historyIndex, keyframeHistory]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= keyframeHistory.length - 1) return;
    setCameraKeyframes(keyframeHistory[historyIndex + 1]);
    setHistoryIndex(i => i + 1);
  }, [historyIndex, keyframeHistory]);

  const network3DRef = useRef<Network3DHandle>(null);
  const playheadRef = useRef(playheadPosition);
  const cameraKeyframesRef = useRef(cameraKeyframes);
  useEffect(() => { playheadRef.current = playheadPosition; }, [playheadPosition]);
  useEffect(() => { cameraKeyframesRef.current = cameraKeyframes; }, [cameraKeyframes]);

  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef(0);

  // Spacebar toggles play/pause globally
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

  // Playback animation
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

  // Timecode update
  useEffect(() => {
    const total = Math.floor(playheadPosition);
    const frames = Math.floor((playheadPosition - total) * 30);
    const s = total % 60; const m = Math.floor(total / 60) % 60; const h = Math.floor(total / 3600);
    setTimecode(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(frames).padStart(2,'0')}`);
  }, [playheadPosition]);

  const handlePlayPause = () => setIsPlaying(p => !p);
  const handleStop = () => { setIsPlaying(false); setPlayheadPosition(0); };

  const handleCaptureKeyframe = useCallback(() => {
    if (viewMode !== '3D') return;
    const keyframe = network3DRef.current?.getCameraKeyframe();
    if (!keyframe) return;
    const currentTime = playheadRef.current;
    setCameraKeyframes(prev => {
      const filtered = prev.filter(s => Math.abs(s.time - currentTime) > 0.1);
      const next = [...filtered, { ...keyframe, time: currentTime }].sort((a, b) => a.time - b.time);
      pushHistory(prev, next);
      return next;
    });
  }, [viewMode, pushHistory]);

  // Auto-update keyframe when camera rotates while playhead sits on one
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
      setCameraKeyframes(prev =>
        prev.map(s => Math.abs(s.time - oldTime) < 0.01 ? { ...s, time: newTime } : s)
          .sort((a, b) => a.time - b.time)
      );
    }
  }, []);

  const handleSetHandle = useCallback((time: number, side: 'out' | 'in', weight: number) => {
    setCameraKeyframes(prev =>
      prev.map(s => Math.abs(s.time - time) < 0.01
        ? { ...s, [side === 'out' ? 'outWeight' : 'inWeight']: Math.max(0, Math.min(0.5, weight)) }
        : s)
    );
  }, []);

  const handleSetInterpolation = useCallback((time: number, mode: 'auto' | 'manual') => {
    setCameraKeyframes(prev =>
      prev.map(s => Math.abs(s.time - time) < 0.01 ? { ...s, interpolation: mode } : s)
    );
  }, []);

  const handleDeleteKeyframe = useCallback((trackId: string, time: number) => {
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const next = prev.filter(s => Math.abs(s.time - time) > 0.1);
        pushHistory(prev, next);
        return next;
      });
      setSelectedKeyframe(prev =>
        prev?.track === trackId && Math.abs(prev.time - time) < 0.1 ? null : prev
      );
    }
  }, [pushHistory]);

  const handleDuplicateKeyframe = useCallback((trackId: string, srcTime: number, destTime: number) => {
    if (trackId === 'camera-keyframes') {
      setCameraKeyframes(prev => {
        const src = prev.find(s => Math.abs(s.time - srcTime) < 0.01);
        if (!src) return prev;
        const filtered = prev.filter(s => Math.abs(s.time - destTime) > 0.1);
        const next = [...filtered, { ...src, time: destTime }].sort((a, b) => a.time - b.time);
        pushHistory(prev, next);
        return next;
      });
    }
  }, [pushHistory]);

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

  // Theme: class-based, respects system preference
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
          const state = { inputText, colorSettings, styleSettings, physicsParams, viewMode, cameraKeyframes };
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
            setCameraKeyframes(prev => {
              const next = prev.filter(s => Math.abs(s.time - time) > 0.1);
              pushHistory(prev, next); return next;
            });
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
        onMoveKeyframe={handleMoveKeyframe} onSetHandle={handleSetHandle}
        onSetInterpolation={handleSetInterpolation}
        onDeleteKeyframe={handleDeleteKeyframe} onDuplicateKeyframe={handleDuplicateKeyframe}
        timecode={timecode} onUndo={handleUndo} onRedo={handleRedo}
        canUndo={historyIndex > 0} canRedo={historyIndex < keyframeHistory.length - 1}
        height={timelineHeight}
      />
    </div>
  );
}