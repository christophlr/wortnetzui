import { useState, useEffect, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Timeline } from './components/Timeline';
import type { Network3DHandle } from './components/Network3D';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [selectedKeyframe, setSelectedKeyframe] = useState<{ track: string; time: number } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [inputText, setInputText] = useState(`Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes far away up the hill. It was 3am that day cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write I write like a ritual over and over. The more exist the more I go I fly they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`);
  const [colorSettings, setColorSettings] = useState({ hueStart: 180, hueEnd: 120, saturation: 75, lightness: 65 });
  const [styleSettings, setStyleSettings] = useState({ edgeOpacity: 0.85, edgeWidth: 2, nodeScale: 1 });
  const [physicsParams, setPhysicsParams] = useState({
    repulsion: 1500,
    springK: 0.06,
    damping: 0.88,
    minSpeed: 0.5
  });
  const [cameraSnapshots, setCameraSnapshots] = useState<Array<{
    time: number;
    position: { x: number; y: number; z: number };
    target: { x: number; y: number; z: number };
  }>>([]);

  // Direct ref to Network3D via Preview forwardRef
  const network3DRef = useRef<Network3DHandle>(null);

  // Keep playheadPosition current in a ref for snapshot handler
  const playheadRef = useRef(playheadPosition);
  useEffect(() => {
    playheadRef.current = playheadPosition;
  }, [playheadPosition]);

  const animationRef = useRef<number>();
  const startTimeRef = useRef(0);
  const startPosRef = useRef(0);

  /* Playback animation */
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now();
      startPosRef.current = playheadPosition;

      const animate = () => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newPos = startPosRef.current + elapsed;

        if (newPos >= 30) {
          setPlayheadPosition(30);
          setIsPlaying(false);
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

  /* Timecode update */
  useEffect(() => {
    const total = Math.floor(playheadPosition);
    const frames = Math.floor((playheadPosition - total) * 30);
    const s = total % 60;
    const m = Math.floor(total / 60) % 60;
    const h = Math.floor(total / 3600);
    setTimecode(
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(frames).padStart(2, '0')}`
    );
  }, [playheadPosition]);

  const handlePlayPause = () => setIsPlaying(p => !p);
  const handleStop = () => { setIsPlaying(false); setPlayheadPosition(0); };

  // Direct snapshot capture — no custom events needed
  const handleCaptureSnapshot = () => {
    console.log('[Snapshot] click. viewMode=', viewMode, 'ref=', network3DRef.current);
    if (viewMode !== '3D') { console.warn('[Snapshot] aborted: not 3D'); return; }
    const snapshot = network3DRef.current?.getCameraSnapshot();
    console.log('[Snapshot] got snapshot=', snapshot);
    if (!snapshot) return;
    const currentTime = playheadRef.current;
    setCameraSnapshots(prev => {
      const filtered = prev.filter(s => Math.abs(s.time - currentTime) > 0.1);
      return [...filtered, { ...snapshot, time: currentTime }].sort((a, b) => a.time - b.time);
    });
  };

  // Move keyframe handler - only for camera-snapshots track
  const handleMoveKeyframe = (trackId: string, oldTime: number, newTime: number) => {
    if (trackId === 'camera-snapshots') {
      setCameraSnapshots(prev => {
        return prev.map(snapshot => 
          Math.abs(snapshot.time - oldTime) < 0.01
            ? { ...snapshot, time: newTime }
            : snapshot
        ).sort((a, b) => a.time - b.time);
      });
    }
  };

  // Apply theme to document root, respecting system preference when in 'system' mode
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme: typeof theme, systemDark: boolean) => {
      const isDark =
        currentTheme === 'dark' || (currentTheme === 'system' && systemDark);
      document.documentElement.classList.toggle('dark', isDark);
    };

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
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        playheadPosition={playheadPosition}
        onPlayheadChange={pos => { setPlayheadPosition(pos); if (isPlaying) setIsPlaying(false); }}
        theme={theme}
        onThemeChange={setTheme}
        onSaveState={() => {
          const state = {
            inputText,
            colorSettings,
            styleSettings,
            physicsParams,
            viewMode,
            cameraSnapshots,
          };
          const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sprachvernetzungen-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        onLoadState={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const state = JSON.parse(event.target?.result as string);
                  if (state.inputText) setInputText(state.inputText);
                  if (state.colorSettings) setColorSettings(state.colorSettings);
                  if (state.styleSettings) setStyleSettings(state.styleSettings);
                  if (state.physicsParams) setPhysicsParams(state.physicsParams);
                  if (state.viewMode) setViewMode(state.viewMode);
                  if (state.cameraSnapshots) setCameraSnapshots(state.cameraSnapshots);
                } catch (err) {
                  console.error('Failed to load state:', err);
                }
              };
              reader.readAsText(file);
            }
          };
          input.click();
        }}
      />

      <div className="flex-1 flex overflow-hidden min-h-0">
        <Inspector
          onPhysicsChange={setPhysicsParams}
          onTextChange={setInputText}
          onColorChange={setColorSettings}
          onStyleChange={setStyleSettings}
          currentTime={playheadPosition}
          cameraSnapshots={cameraSnapshots}
          onDeleteSnapshot={(time) => {
            setCameraSnapshots(prev => prev.filter(s => Math.abs(s.time - time) > 0.1));
          }}
        />
        <Preview
          ref={network3DRef}
          viewMode={viewMode}
          physicsEnabled={true}
          isPlaying={isPlaying}
          playheadPosition={playheadPosition}
          physicsParams={physicsParams}
          inputText={inputText}
          colorSettings={colorSettings}
          styleSettings={styleSettings}
          cameraSnapshots={cameraSnapshots}
        />
      </div>

      <Timeline
        playheadPosition={playheadPosition}
        onPlayheadChange={pos => { setPlayheadPosition(pos); if (isPlaying) setIsPlaying(false); }}
        selectedKeyframe={selectedKeyframe}
        onKeyframeSelect={(track, time) => setSelectedKeyframe({ track, time })}
        cameraSnapshots={cameraSnapshots}
        onCaptureSnapshot={handleCaptureSnapshot}
        onMoveKeyframe={handleMoveKeyframe}
        timecode={timecode}
      />
    </div>
  );
}