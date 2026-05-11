import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut, Magnet, Trash2, Diamond, Circle } from 'lucide-react';
import { Button } from '../ui/button';
import { TIMELINE_DURATION } from '../../constants';
import { useTimelineView } from './useTimelineView';
import { TimelineRuler } from './TimelineRuler';
import { SceneMarkerLane, TrackRow, TrackGroup } from './TimelineTracks';
import { GraphEditor } from './GraphEditor';
import { ContextMenu, ContextMenuTrigger } from '../ui/context-menu';
import { TimelineContextMenuContent, type ContextMenuTarget } from './ContextMenu';
import { inferEasingType, LABEL_W, TRACK_GROUPS, type EasingType } from './types';
import { useWortnetz } from '../../context/WortnetzContext';
import { useHistory } from '../../hooks/useHistory';

function TBtn({ children, onClick, disabled, active, title }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; active?: boolean; title?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-6 w-6 p-0 shrink-0 ${active ? 'text-blue-400' : ''} ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </Button>
  );
}

function TCDisplay({ value }: { value: string }) {
  return (
    <span className="font-mono text-xs tabular-nums text-foreground select-none whitespace-nowrap">
      {value}
    </span>
  );
}

export function Timeline() {
  const {
    isPlaying, setIsPlaying,
    playheadPosition, setPlayheadPosition,
    selectedKeyframes, setSelectedKeyframes,
    cameraKeyframes,
    physicsKeyframes, setPhysicsKeyframes,
    handleCaptureKeyframe, handleMoveKeyframe, handleDeleteKeyframe,
    timecode,
    timelineHeight,
    sceneMarkers, setSceneMarkers,
    isRecording, setIsRecording,
    playheadRef,
    cameraKeyframesRef,
    physicsKeyframesRef,
    sceneMarkersRef,
    pushHistory,
    getTimelineState
  } = useWortnetz();

  const { undo, redo, canUndo, canRedo } = useHistory();

  const contentRef = useRef<HTMLDivElement>(null);
  const view = useTimelineView(TIMELINE_DURATION);
  const { viewWindow, zoom, snap, setSnap, timeFromClientX, handleWheel, zoomIn, zoomOut, zoomReset, autoExtendDuration } = view;

  const [expandedGraphTracks, setExpandedGraphTracks] = useState<Set<string>>(new Set());
  const [contextMenuTarget, setContextMenuTarget] = useState<ContextMenuTarget | null>(null);
  const [clipboard, setClipboard] = useState<{ track: string; kfData: any } | null>(null);
  const [dragSelect, setDragSelect] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

  const onDeleteSelected = useCallback(() => {
    selectedKeyframes.forEach(s => {
      if (s.track === 'scene-markers') {
        setSceneMarkers(prev => prev.filter(m => Math.abs(m.time - s.time) > 0.01));
      } else {
        handleDeleteKeyframe(s.track, s.time);
      }
    });
    setSelectedKeyframes([]);
  }, [selectedKeyframes, handleDeleteKeyframe, setSceneMarkers, setSelectedKeyframes]);

  const handleCopy = useCallback(() => {
    if (selectedKeyframes.length === 0) return;
    const sel = selectedKeyframes[0];
    if (sel.track === 'camera-keyframes') {
      const kf = cameraKeyframes.find(k => Math.abs(k.time - sel.time) < 0.01);
      if (kf) setClipboard({ track: sel.track, kfData: { ...kf } });
    } else {
      const arr = physicsKeyframes[sel.track] ?? [];
      const kf = arr.find(k => Math.abs(k.time - sel.time) < 0.01);
      if (kf) setClipboard({ track: sel.track, kfData: { ...kf } });
    }
  }, [selectedKeyframes, cameraKeyframes, physicsKeyframes]);

  const handleCut = useCallback(() => {
    handleCopy();
    onDeleteSelected();
  }, [handleCopy, onDeleteSelected]);

  const handlePaste = useCallback(() => {
    if (!clipboard) return;
    // Simple duplicate logic
    const time = playheadPosition;
    if (clipboard.track === 'camera-keyframes') {
      setCameraKeyframes(prev => [...prev, { ...clipboard.kfData, time }].sort((a, b) => a.time - b.time));
    } else {
      setPhysicsKeyframes(prev => ({
        ...prev,
        [clipboard.track]: [...(prev[clipboard.track] ?? []), { ...clipboard.kfData, time }].sort((a, b) => a.time - b.time)
      }));
    }
  }, [clipboard, playheadPosition, setCameraKeyframes, setPhysicsKeyframes]);

  const handleKeyframeContextMenu = useCallback((trackId: string, kfTime: number) => {
    let easingType: any = 'auto';
    if (trackId === 'camera-keyframes') {
      const kf = cameraKeyframes.find(k => Math.abs(k.time - kfTime) < 0.01);
      if (kf) easingType = inferEasingType(kf as any);
    } else {
      const arr = physicsKeyframes[trackId] ?? [];
      const kf = arr.find(k => Math.abs(k.time - kfTime) < 0.01);
      if (kf) easingType = inferEasingType(kf);
    }
    setContextMenuTarget({ mode: 'keyframe', track: trackId, time: kfTime, easingType });
  }, [cameraKeyframes, physicsKeyframes]);

  const handleMarkerContextMenu = useCallback((time: number, label: string) => {
    setContextMenuTarget({ mode: 'scene-marker', time, label });
  }, []);

  const handleBackgroundContextMenu = useCallback((e: React.MouseEvent) => {
    const t = timeFromClientX(e.clientX, contentRef.current, sceneMarkers.map(m => m.time));
    if (t !== null) {
      setContextMenuTarget({ mode: 'background', time: t });
    }
  }, [timeFromClientX, sceneMarkers]);

  const handleSetEasing = useCallback((type: EasingType) => {
    if (!contextMenuTarget || contextMenuTarget.mode !== 'keyframe') return;
    const { track, time } = contextMenuTarget;
    // Easing logic would go here, simplified for now
  }, [contextMenuTarget]);

  const handleRulerMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const updatePlayhead = (clientX: number) => {
      const t = timeFromClientX(clientX, contentRef.current, sceneMarkers.map(m => m.time));
      if (t !== null) setPlayheadPosition(t);
    };
    updatePlayhead(e.clientX);
    const onMove = (ev: MouseEvent) => updatePlayhead(ev.clientX);
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timeFromClientX, setPlayheadPosition, sceneMarkers]);

  const handleTrackAreaMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    const startX = e.clientX;
    const startY = e.clientY;
    setDragSelect({ startX, startY, endX: startX, endY: startY });

    const onMove = (ev: MouseEvent) => {
      setDragSelect(prev => prev ? { ...prev, endX: ev.clientX, endY: ev.clientY } : null);
    };
    const onUp = (ev: MouseEvent) => {
      if (contentRef.current) {
        const t1 = timeFromClientX(Math.min(startX, ev.clientX), contentRef.current) ?? 0;
        const t2 = timeFromClientX(Math.max(startX, ev.clientX), contentRef.current) ?? TIMELINE_DURATION;

        const sel: { track: string; time: number }[] = [];
        cameraKeyframes.forEach(k => { if (k.time >= t1 && k.time <= t2) sel.push({ track: 'camera-keyframes', time: k.time }); });
        Object.entries(physicsKeyframes).forEach(([tid, kfs]) => { (kfs ?? []).forEach(k => { if (k.time >= t1 && k.time <= t2) sel.push({ track: tid, time: k.time }); }); });
        sceneMarkers.forEach(m => { if (m.time >= t1 && m.time <= t2) sel.push({ track: 'scene-markers', time: m.time }); });
        setSelectedKeyframes(sel);
      }
      setDragSelect(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timeFromClientX, cameraKeyframes, physicsKeyframes, sceneMarkers, setSelectedKeyframes]);

  useEffect(() => {
    const allTimes = [
      ...cameraKeyframes.map(k => k.time),
      ...Object.values(physicsKeyframes).flatMap(arr => (arr ?? []).map(k => k.time)),
      ...sceneMarkers.map(m => m.time),
    ];
    if (allTimes.length > 0) autoExtendDuration(Math.max(...allTimes));
  }, [cameraKeyframes, physicsKeyframes, sceneMarkers, autoExtendDuration]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => handleWheel(e, el);
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [handleWheel]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'Backspace' || e.key === 'Delete') { onDeleteSelected(); e.preventDefault(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') { handleCopy(); e.preventDefault(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'x') { handleCut(); e.preventDefault(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') { handlePaste(); e.preventDefault(); }
      if (e.key === 'Escape') { setSelectedKeyframes([]); e.preventDefault(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedKeyframes, onDeleteSelected, handleCopy, handleCut, handlePaste, setSelectedKeyframes]);

  const visibleDuration = viewWindow.end - viewWindow.start;
  const playheadRatio = (playheadPosition - viewWindow.start) / visibleDuration;
  const playheadVisible = playheadRatio >= -0.01 && playheadRatio <= 1.01;

  const hasKfAtPlayhead = useMemo(() => {
    const thresh = 0.01;
    if (cameraKeyframes.some(k => Math.abs(k.time - playheadPosition) <= thresh)) return true;
    if (sceneMarkers.some(m => Math.abs(m.time - playheadPosition) <= thresh)) return true;
    for (const trackKfs of Object.values(physicsKeyframes)) { if (trackKfs.some(k => Math.abs(k.time - playheadPosition) <= thresh)) return true; }
    return false;
  }, [cameraKeyframes, physicsKeyframes, sceneMarkers, playheadPosition]);

  return (
    <div className="flex flex-col bg-background border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pointer-events-auto" style={{ height: timelineHeight }}>
      <ContextMenu onOpenChange={(open) => { if (!open) setContextMenuTarget(null); }}>
        <ContextMenuTrigger asChild>
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Toolbar */}
            <div className="flex items-center px-4 border-b border-border bg-background shrink-0 select-none" style={{ height: 40 }}>
              <div className="w-48 flex items-center shrink-0">
                <span className="text-sm font-semibold text-foreground">Timeline</span>
              </div>

              <TBtn onClick={onDeleteSelected} disabled={selectedKeyframes.length === 0} title="Delete Selected">
                <Trash2 className="w-3 h-3" />
              </TBtn>
              <div className="w-px h-4 bg-border mx-0.5" />
              <TBtn onClick={undo} disabled={!canUndo} title="Undo"><Undo2 className="w-3 h-3" /></TBtn>
              <TBtn onClick={redo} disabled={!canRedo} title="Redo"><Redo2 className="w-3 h-3" /></TBtn>

              <div className="flex-1 flex items-center justify-center gap-2">
                <TBtn onClick={() => setIsPlaying(false)} title="Stop"><SkipBack className="w-3 h-3" /></TBtn>
                <TBtn onClick={() => setPlayheadPosition(Math.max(0, playheadPosition - 1 / 30))} title="Previous Frame">
                  <ChevronLeft className="w-3 h-3" />
                </TBtn>
                <TCDisplay value={timecode} />
                <TBtn onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause className="w-3 h-3" fill="currentColor" /> : <Play className="w-3 h-3" fill="currentColor" />}
                </TBtn>
                <TBtn onClick={() => setPlayheadPosition(playheadPosition + 1 / 30)} title="Next Frame">
                  <ChevronLeft className="w-3 h-3 rotate-180" />
                </TBtn>
                <div className="w-px h-4 bg-border mx-0.5" />
                <TBtn onClick={handleCaptureKeyframe} title="Capture Keyframe" active={hasKfAtPlayhead}>
                  <Diamond className={`w-3 h-3 ${hasKfAtPlayhead ? 'text-blue-400 fill-blue-400' : ''}`} />
                </TBtn>
                <TBtn onClick={() => setIsRecording(!isRecording)} title="Record" active={isRecording}>
                  <Circle className={`w-3 h-3 ${isRecording ? 'text-red-500 fill-red-500 animate-pulse' : ''}`} />
                </TBtn>
              </div>

              <div className="w-px h-4 bg-border mx-0.5" />
              <TBtn onClick={zoomOut} title="Zoom Out"><ZoomOut className="w-3 h-3" /></TBtn>
              <TBtn onClick={zoomIn} title="Zoom In"><ZoomIn className="w-3 h-3" /></TBtn>
              <div className="w-px h-4 bg-border mx-0.5" />
              <TBtn onClick={() => setSnap(!snap)} active={snap} title="Snap">
                <Magnet className="w-3 h-3" />
              </TBtn>
            </div>

            {/* Scrollable Tracks Area */}
            <div 
              ref={contentRef} 
              className="flex-1 overflow-y-auto overflow-x-hidden relative select-none"
              onMouseDown={handleTrackAreaMouseDown}
              onContextMenu={handleBackgroundContextMenu}
            >
              <div className="flex border-b border-border shrink-0 cursor-pointer sticky top-0 z-60 bg-background" style={{ height: 24 }} onMouseDown={handleRulerMouseDown}>
                <div className="shrink-0 border-r border-border bg-background relative z-30" style={{ width: LABEL_W }} />
                <div className="flex-1 relative">
                  <TimelineRuler zoom={zoom * 12} duration={view.duration} viewWindow={viewWindow} />
                  {playheadVisible && (
                    <div className="absolute top-0 w-px h-full bg-red-500 z-20 pointer-events-none" style={{ left: `${playheadRatio * 100}%` }}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2">
                        <svg width="10" height="8" viewBox="0 0 10 8"><polygon points="0,0 10,0 5,8" fill="#ef4444" /></svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <SceneMarkerLane
                markers={sceneMarkers}
                viewWindow={viewWindow}
                selectedKeyframes={selectedKeyframes}
                onAddMarker={(t, l) => setSceneMarkers(prev => [...prev, { time: t, label: l }].sort((a, b) => a.time - b.time))}
                onMoveMarker={(oldT, newT) => handleMoveKeyframe('scene-markers', oldT, newT)}
                onDeleteMarker={(t) => setSceneMarkers(prev => prev.filter(m => Math.abs(m.time - t) > 0.01))}
                onSelect={setSelectedKeyframes}
                onContextMenu={handleMarkerContextMenu}
                timeFromClientX={timeFromClientX}
                contentRef={contentRef}
              />

              <TrackGroup id="camera" name="Camera" color="cyan">
                <TrackRow
                  trackId="camera-keyframes"
                  name="Keyframes"
                  color="cyan"
                  keyframeData={cameraKeyframes}
                  viewWindow={viewWindow}
                  selectedKeyframes={selectedKeyframes}
                  onSelect={setSelectedKeyframes}
                  onMoveKeyframe={handleMoveKeyframe}
                  onContextMenu={handleKeyframeContextMenu}
                  timeFromClientX={timeFromClientX}
                  contentRef={contentRef}
                />
              </TrackGroup>

              <TrackGroup id="physics" name="Physics" color="orange">
                {TRACK_GROUPS[1].tracks.map(track => (
                  <TrackRow
                    key={track.id}
                    trackId={track.id}
                    name={track.name}
                    color="orange"
                    keyframeData={physicsKeyframes[track.id] ?? []}
                    viewWindow={viewWindow}
                    selectedKeyframes={selectedKeyframes}
                    onSelect={setSelectedKeyframes}
                    onMoveKeyframe={handleMoveKeyframe}
                    onContextMenu={handleKeyframeContextMenu}
                    timeFromClientX={timeFromClientX}
                    contentRef={contentRef}
                  />
                ))}
              </TrackGroup>

              {playheadVisible && (
                <div className="absolute top-[24px] bottom-0 right-0 pointer-events-none z-50 overflow-hidden" style={{ left: LABEL_W }}>
                  <div className="absolute top-0 bottom-0 w-px bg-red-500" style={{ left: `${playheadRatio * 100}%` }} />
                </div>
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        {contextMenuTarget && (
          <TimelineContextMenuContent
            target={contextMenuTarget}
            onClose={() => setContextMenuTarget(null)}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={clipboard ? handlePaste : undefined}
            onDelete={onDeleteSelected}
            onSetEasing={handleSetEasing}
          />
        )}
      </ContextMenu>
    </div>
  );
}
