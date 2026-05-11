import { useState, useCallback, useEffect } from 'react';
import { WortnetzProvider, useWortnetz } from './context/WortnetzContext';
import { AppShell } from './components/shell/AppShell';
import { AppCanvas } from './components/shell/AppCanvas';
import { AppSidebar } from './components/shell/AppSidebar';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { TopBar } from './components/TopBar';
import { Timeline } from './components/timeline/Timeline';
import { Inspector } from './components/Inspector';
import { ShortcutsDialog } from './components/ShortcutsDialog';
import { PathAnimatorUI } from './components/PathAnimatorUI';
import { TIMELINE_DURATION } from './constants';

function AppContent() {
  const {
    activeTool, setActiveTool,
    viewMode,
    network3DRef,
    isNetworkReady,
    setIsNetworkReady,
    inputText,
    parseMode,
    playheadPosition, setPlayheadPosition,
    isPlaying, setIsPlaying,
    setTimecode,
    setNodeAppearance, setLastAppliedPreset,
    timelineHeight, setTimelineHeight,
    isRecording
  } = useWortnetz();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState([
    { id: '1', command: 'Undo', key: '⌘Z' },
    { id: '2', command: 'Redo', key: '⌘⇧Z' },
    { id: '3', command: 'Play/Pause', key: 'Space' },
    { id: '4', command: 'Stop', key: 'S' },
    { id: '5', command: 'Capture Keyframe', key: 'K' },
    { id: '6', command: 'Toggle Preview', key: 'P' },
  ]);

  // Sync network ready state
  useEffect(() => {
    setIsNetworkReady(false);
  }, [inputText, viewMode, parseMode, setIsNetworkReady]);

  // Timecode formatting
  useEffect(() => {
    const totalFrames = Math.floor(playheadPosition * 30);
    const frames = totalFrames % 30;
    const totalSecs = Math.floor(totalFrames / 30);
    const secs = totalSecs % 60;
    const mins = Math.floor(totalSecs / 60) % 60;
    const hours = Math.floor(totalSecs / 3600);
    const format = (v: number) => v.toString().padStart(2, '0');
    setTimecode(`${format(hours)}:${format(mins)}:${format(secs)}:${format(frames)}`);
  }, [playheadPosition, setTimecode]);

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    const frame = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setPlayheadPosition(prev => {
        const next = prev + dt;
        if (next >= TIMELINE_DURATION) {
          setIsPlaying(false);
          return TIMELINE_DURATION;
        }
        return next;
      });
      requestAnimationFrame(frame);
    };
    const req = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(req);
  }, [isPlaying, setPlayheadPosition, setIsPlaying]);

  const handleApplyNodeStylePreset = useCallback((preset: 'outline' | 'filled' | 'reset') => {
    if (preset === 'reset') {
      setNodeAppearance({ borderColor: 'auto', fillColor: 'auto', textColor: 'auto' });
      setLastAppliedPreset(null);
    } else if (preset === 'outline') {
      setNodeAppearance({ borderColor: 'auto', fillColor: 'rgba(255,255,255,0.05)', textColor: 'auto' });
      setLastAppliedPreset('outline');
    } else {
      setNodeAppearance({ borderColor: 'rgba(0,0,0,0.1)', fillColor: 'auto', textColor: 'rgba(255,255,255,0.9)' });
      setLastAppliedPreset('filled');
    }
  }, [setNodeAppearance, setLastAppliedPreset]);

  return (
    <AppShell>
      {/* Background Layer: Preview fills the whole shell */}
      <div className="absolute inset-0 z-0">
        <Preview ref={network3DRef} />
      </div>

      {/* UI Overlay Layer */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Top Section */}
        <div className="p-2 pointer-events-auto shrink-0">
          <TopBar 
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onApplyNodeStylePreset={handleApplyNodeStylePreset}
            onExport={() => network3DRef.current?.exportPNG()}
          />
        </div>

        {/* Main Content Area: Horizontal split between (Preview+Timeline) and Sidebar */}
        <div className="flex-1 flex flex-row min-h-0 relative overflow-hidden">
          
          {/* Left Column: Preview space and Timeline */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            <div className="flex-1 relative">
              {/* Floating Toolbar - Centered in workspace gap */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto z-30">
                <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
              </div>

              {/* Floating Path Animator UI */}
              {activeTool === 'path' && (
                <div className="absolute left-20 top-24 pointer-events-auto z-40">
                  <PathAnimatorUI 
                    nodes={[]} 
                    onReorder={() => {}} 
                    onRemove={() => {}} 
                    onClose={() => setActiveTool('pointer')} 
                  />
                </div>
              )}
            </div>

            {/* Bottom Section (Timeline) */}
            <div className="relative shrink-0 pointer-events-auto">
              <div 
                className="h-1 shrink-0 cursor-row-resize bg-white/5 hover:bg-white/20 transition-colors z-50"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startY = e.clientY;
                  const startHeight = timelineHeight;
                  const onMove = (ev: MouseEvent) => setTimelineHeight(Math.max(100, Math.min(600, startHeight - (ev.clientY - startY))));
                  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
              />
              <Timeline />
            </div>
          </div>

          {/* Right Column: Sidebar (Full Height) */}
          <div className="pointer-events-auto h-full flex flex-row shrink-0 relative z-20">
            <AppSidebar>
              <Inspector />
            </AppSidebar>
          </div>

        </div>
      </div>

      <ShortcutsDialog
        isOpen={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
        shortcuts={shortcuts}
        onAddShortcut={(command, key) => setShortcuts(prev => [...prev, { id: Date.now().toString(), command, key }])}
        onRemoveShortcut={(id) => setShortcuts(prev => prev.filter(s => s.id !== id))}
      />
    </AppShell>
  );
}

export default function App() {
  return (
    <WortnetzProvider>
      <AppContent />
    </WortnetzProvider>
  );
}
