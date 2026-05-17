import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, SkipBack, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut, Magnet, Trash2, Diamond, Circle, Square } from 'lucide-react';
import { TIMELINE_DURATION } from '../../constants';
import { useTimelineView } from './useTimelineView';
import { TimelineRuler } from './TimelineRuler';
import { SceneMarkerLane, TrackRow, TrackGroup } from './TimelineTracks';
import { GraphEditor } from './GraphEditor';
import { ContextMenu, ContextMenuTrigger } from '../ui/context-menu';
import { TimelineContextMenuContent, type ContextMenuTarget } from './ContextMenu';
import { TrackLabel, TimelineTransportButton, PlayheadLine, RecordButton } from './TimelineAtoms';
import { inferEasingType, LABEL_W, TRACK_H, TRACK_GROUPS, type TimelineProps, type EasingType } from './types';
import { useT } from '../../i18n/useT';

/* ── Small helper components ── */

function TCDisplay({ value }: { value: string }) {
  return (
    <span className="font-mono text-xs tabular-nums text-foreground select-none whitespace-nowrap">
      {value}
    </span>
  );
}

/* ── Main Timeline Component ── */

export function Timeline(props: TimelineProps) {
  const {
    isPlaying, onPlayPause, onStop,
    playheadPosition, onPlayheadChange,
    selectedKeyframes, onKeyframeSelect, onSelectKeyframes,
    cameraKeyframes = [], physicsKeyframes = {},
    onCaptureKeyframe, onMoveKeyframe,
    onSetHandle, onSetHandle2D, onSetValue, onClearHandle, onSetInterpolation,
    onDeleteKeyframe, onDuplicateKeyframe,
    onDragStart, onDragEnd,
    timecode = '00:00:00:00',
    onUndo, onRedo, canUndo, canRedo,
    height = 260,
    sceneMarkers = [],
    onAddSceneMarker, onMoveSceneMarker, onDropSceneMarker, onDeleteSceneMarker,
    onRenameSceneMarker,
    isRecording,
    onToggleRecording,
    onCancelDrag,
  } = props;

  const { t } = useT();
  const contentRef = useRef<HTMLDivElement>(null);
  const view = useTimelineView(TIMELINE_DURATION);
  const { viewWindow, zoom, snap, setSnap, timeFromClientX, handleWheel, zoomIn, zoomOut, zoomReset, autoExtendDuration } = view;

  // Graph editor toggle
  const [expandedGraphTracks, setExpandedGraphTracks] = useState<Set<string>>(new Set());

  // Context menu target state (synced with Radix open state)
  const [contextMenuTarget, setContextMenuTarget] = useState<ContextMenuTarget | null>(null);

  // Clipboard
  const [clipboard, setClipboard] = useState<{ track: string; kfData: any } | null>(null);

  // Drag-select (marquee)
  const [dragSelect, setDragSelect] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);


  const onDeleteSelected = useCallback(() => {
    selectedKeyframes.forEach(s => {
      if (s.track === 'scene-markers') onDeleteSceneMarker?.(s.time);
      else onDeleteKeyframe?.(s.track, s.time);
    });
    onSelectKeyframes?.([]);
  }, [selectedKeyframes, onDeleteKeyframe, onDeleteSceneMarker, onSelectKeyframes]);

  // Clipboard operations
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
    onDuplicateKeyframe?.(clipboard.track, clipboard.kfData.time, playheadPosition);
  }, [clipboard, playheadPosition, onDuplicateKeyframe]);

  // Context menu handlers
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

    if (type === 'auto' || type === 'linear' || type === 'hold') {
      onClearHandle?.(track, time);
      return;
    }

    const weight = 0.33;
    if (type === 'easyEase') {
      onSetHandle?.(track, time, 'in', weight);
      onSetHandle?.(track, time, 'out', weight);
    } else if (type === 'easeIn') {
      onSetHandle?.(track, time, 'in', weight);
      onClearHandle?.(track, time); // Clear out to ensure only in is eased
    } else if (type === 'easeOut') {
      onSetHandle?.(track, time, 'out', weight);
      onClearHandle?.(track, time); // Clear in to ensure only out is eased
    }
  }, [contextMenuTarget, onSetHandle, onClearHandle]);

  // Playhead scrub
  const handleRulerMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const updatePlayhead = (clientX: number) => {
      const t = timeFromClientX(clientX, contentRef.current, sceneMarkers.map(m => m.time));
      if (t !== null) onPlayheadChange(t);
    };

    updatePlayhead(e.clientX);
    const onMove = (ev: MouseEvent) => updatePlayhead(ev.clientX);
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timeFromClientX, onPlayheadChange, onSelectKeyframes]);

  // Drag-select
  const handleTrackAreaMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    const startX = e.clientX;
    const startY = e.clientY;
    setDragSelect({ startX, startY, endX: startX, endY: startY });

    const updatePlayhead = (clientX: number) => {
      const t = timeFromClientX(clientX, contentRef.current, sceneMarkers.map(m => m.time));
      if (t !== null) onPlayheadChange(t);
    };
    updatePlayhead(startX);

    const onMove = (ev: MouseEvent) => {
      updatePlayhead(ev.clientX);
      setDragSelect(prev => prev ? { ...prev, endX: ev.clientX, endY: ev.clientY } : null);
    };
    const onUp = (ev: MouseEvent) => {
      if (contentRef.current) {
        const t1 = timeFromClientX(Math.min(startX, ev.clientX), contentRef.current) ?? 0;
        const t2 = timeFromClientX(Math.max(startX, ev.clientX), contentRef.current) ?? TIMELINE_DURATION;

        const sel: { track: string; time: number }[] = [];
        cameraKeyframes.forEach(k => {
          if (k.time >= t1 && k.time <= t2) sel.push({ track: 'camera-keyframes', time: k.time });
        });
        Object.entries(physicsKeyframes).forEach(([tid, kfs]) => {
          (kfs ?? []).forEach(k => {
            if (k.time >= t1 && k.time <= t2) sel.push({ track: tid, time: k.time });
          });
        });
        sceneMarkers.forEach(m => {
          if (m.time >= t1 && m.time <= t2) sel.push({ track: 'scene-markers', time: m.time });
        });
        onSelectKeyframes?.(sel);
      }
      setDragSelect(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timeFromClientX, cameraKeyframes, physicsKeyframes, sceneMarkers, onSelectKeyframes]);

  // Auto-extend duration check
  useEffect(() => {
    const allTimes = [
      ...cameraKeyframes.map(k => k.time),
      ...Object.values(physicsKeyframes).flatMap(arr => (arr ?? []).map(k => k.time)),
      ...sceneMarkers.map(m => m.time),
    ];
    if (allTimes.length > 0) autoExtendDuration(Math.max(...allTimes));
  }, [cameraKeyframes, physicsKeyframes, sceneMarkers, autoExtendDuration]);

  // Wheel handler
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => handleWheel(e, el);
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [handleWheel]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        onDeleteSelected();
        e.preventDefault();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') { handleCopy(); e.preventDefault(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'x') { handleCut(); e.preventDefault(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') { handlePaste(); e.preventDefault(); }
      if (e.key === 'Escape') {
        // Cancel any in-progress drag and clear selection.
        onCancelDrag?.();
        onSelectKeyframes?.([]);
        e.preventDefault();
      }

      // Cmd-A / Ctrl-A — select all keyframes across all tracks.
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        const all: { track: string; time: number }[] = [];
        cameraKeyframes.forEach(k => all.push({ track: 'camera-keyframes', time: k.time }));
        Object.entries(physicsKeyframes).forEach(([tid, kfs]) =>
          (kfs ?? []).forEach(k => all.push({ track: tid, time: k.time }))
        );
        sceneMarkers.forEach(m => all.push({ track: 'scene-markers', time: m.time }));
        onSelectKeyframes?.(all);
      }

      // Arrow-key nudge — ±1 frame (1/30s), Shift = ±10 frames.
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && selectedKeyframes.length > 0) {
        e.preventDefault();
        const frameSize = 1 / 30;
        const delta = (e.key === 'ArrowRight' ? 1 : -1) * frameSize * (e.shiftKey ? 10 : 1);
        onDragStart?.();
        selectedKeyframes.forEach(s => {
          if (s.track !== 'scene-markers') {
            onMoveKeyframe?.(s.track, s.time, Math.max(0, s.time + delta));
          }
        });
        onDragEnd?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedKeyframes, cameraKeyframes, physicsKeyframes, sceneMarkers, onDeleteSelected, handleCopy, handleCut, handlePaste, onMoveKeyframe, onDragStart, onDragEnd, onSelectKeyframes]);

  // Playhead position as CSS
  const visibleDuration = viewWindow.end - viewWindow.start;
  const playheadRatio = (playheadPosition - viewWindow.start) / visibleDuration;
  const playheadVisible = playheadRatio >= -0.01 && playheadRatio <= 1.01;

  // Check if any keyframe exists at playhead
  const hasKfAtPlayhead = useMemo(() => {
    const thresh = 0.01;
    if (cameraKeyframes.some(k => Math.abs(k.time - playheadPosition) <= thresh)) return true;
    if (sceneMarkers.some(m => Math.abs(m.time - playheadPosition) <= thresh)) return true;
    for (const trackKfs of Object.values(physicsKeyframes)) {
      if (trackKfs.some(k => Math.abs(k.time - playheadPosition) <= thresh)) return true;
    }
    return false;
  }, [cameraKeyframes, physicsKeyframes, sceneMarkers, playheadPosition]);

  return (
    <div className="flex flex-col bg-background border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pointer-events-auto" style={{ height }}>
      <ContextMenu onOpenChange={(open) => { if (!open) setContextMenuTarget(null); }}>
        <ContextMenuTrigger asChild>
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Toolbar */}
            <div className="flex items-center px-4 border-b border-border bg-background shrink-0 select-none" style={{ height: 40 }}>
              {/* Left: Search/Filter */}
              <div className="w-48 flex items-center shrink-0">
                <span className="text-sm font-semibold text-foreground">{t('timeline.label')}</span>
              </div>

              {/* Right: Graph Editor + Zoom + Snap */}
              <TimelineTransportButton onClick={onDeleteSelected} disabled={selectedKeyframes.length === 0} title={t('timeline.action.deleteSelected')}>
                <Trash2 className="w-3 h-3" />
              </TimelineTransportButton>
              <div className="w-px h-4 bg-border mx-0.5" />
              <TimelineTransportButton onClick={onUndo} disabled={!canUndo} title={t('timeline.action.undo')}><Undo2 className="w-3 h-3" /></TimelineTransportButton>
              <TimelineTransportButton onClick={onRedo} disabled={!canRedo} title={t('timeline.action.redo')}><Redo2 className="w-3 h-3" /></TimelineTransportButton>

              {/* Center: Timecode + Transport */}
              <div className="flex-1 flex items-center justify-center gap-2">
                <TimelineTransportButton onClick={onStop} title={t('timeline.action.stop')}><Square className="w-3 h-3 fill-current" /></TimelineTransportButton>
                <TimelineTransportButton onClick={() => onPlayheadChange(0)} title={t('timeline.action.gotoStart')}><SkipBack className="w-3 h-3" /></TimelineTransportButton>
                <TimelineTransportButton onClick={() => onPlayheadChange(Math.max(0, playheadPosition - 1 / 30))} title={t('timeline.action.prevFrame')}>
                  <ChevronLeft className="w-3 h-3" />
                </TimelineTransportButton>
                <TCDisplay value={timecode} />
                <TimelineTransportButton onClick={onPlayPause} title={isPlaying ? t('timeline.action.pause') : t('timeline.action.play')}>
                  {isPlaying ? <Pause className="w-3 h-3" fill="currentColor" /> : <Play className="w-3 h-3" fill="currentColor" />}
                </TimelineTransportButton>
                <TimelineTransportButton onClick={() => onPlayheadChange(playheadPosition + 1 / 30)} title={t('timeline.action.nextFrame')}>
                  <ChevronLeft className="w-3 h-3 rotate-180" />
                </TimelineTransportButton>
                <div className="w-px h-4 bg-border mx-0.5" />
                <TimelineTransportButton
                  onClick={onCaptureKeyframe}
                  title={t('timeline.action.captureKeyframe')}
                  active={hasKfAtPlayhead}
                >
                  <Diamond className={`w-3 h-3 ${hasKfAtPlayhead ? 'text-wn-timeline-transport-active fill-wn-timeline-transport-active' : ''}`} />
                </TimelineTransportButton>
                <RecordButton
                  isRecording={isRecording}
                  onToggleRecording={onToggleRecording}
                  title={t('timeline.recordComingSoon')}
                />
              </div>

              <div className="w-px h-4 bg-border mx-0.5" />
              <TimelineTransportButton onClick={zoomOut} title={t('timeline.action.zoomOut')}><ZoomOut className="w-3 h-3" /></TimelineTransportButton>
              <button
                className="text-[9px] tabular-nums text-muted-foreground hover:text-foreground px-1 transition-colors"
                onClick={zoomReset}
                title={t('timeline.action.zoomReset')}
              >
                {zoom.toFixed(zoom >= 10 ? 0 : 1)}×
              </button>
              <TimelineTransportButton onClick={zoomIn} title={t('timeline.action.zoomIn')}><ZoomIn className="w-3 h-3" /></TimelineTransportButton>
              <div className="w-px h-4 bg-border mx-0.5" />
              <TimelineTransportButton onClick={() => setSnap(!snap)} active={snap} title={t('timeline.action.snap')}>
                <Magnet className="w-3 h-3" />
              </TimelineTransportButton>
            </div>

            {/* Scrollable Tracks Area */}
            <div 
              ref={contentRef} 
              className="flex-1 overflow-y-auto overflow-x-hidden relative select-none"
              onMouseDown={handleTrackAreaMouseDown}
              onContextMenu={handleBackgroundContextMenu}
            >
              {/* Ruler */}
              <div className="flex border-b border-border shrink-0 cursor-pointer sticky top-0 z-60 bg-background" style={{ height: 24 }} onMouseDown={handleRulerMouseDown}>
                <TrackLabel />
                <div className="flex-1 relative">
                  {/* Pass absolute zoom (zoom * 12) to ruler for tick density */}
                  <TimelineRuler zoom={zoom * 12} duration={view.duration} viewWindow={viewWindow} />
                  
                  {/* Playhead Marker (Triangle + Ruler Line segment) */}
                  {playheadVisible && (
                    <PlayheadLine ratio={playheadRatio} withTriangle />
                  )}
                </div>
              </div>

              {/* Scene Markers */}
              <SceneMarkerLane
                markers={sceneMarkers}
                viewWindow={viewWindow}
                selectedKeyframes={selectedKeyframes}
                onAddMarker={onAddSceneMarker}
                onMoveMarker={onMoveSceneMarker}
                onDropMarker={onDropSceneMarker}
                onDeleteMarker={onDeleteSceneMarker}
                onSelect={onKeyframeSelect}
                onContextMenu={handleMarkerContextMenu}
                timeFromClientX={timeFromClientX}
                contentRef={contentRef}
              />

              {/* Drag-select marquee (rendered locally to be clipped by timeline) */}
              {dragSelect && contentRef.current && (() => {
                const rect = contentRef.current.getBoundingClientRect();
                const scrollT = contentRef.current.scrollTop;
                const left = Math.min(dragSelect.startX, dragSelect.endX) - rect.left;
                const top = Math.min(dragSelect.startY, dragSelect.endY) - rect.top + scrollT;
                const width = Math.abs(dragSelect.endX - dragSelect.startX);
                const height = Math.abs(dragSelect.endY - dragSelect.startY);
                return (
                  <div
                    className="absolute border border-wn-timeline-transport-active/60 bg-wn-timeline-drag-select pointer-events-none z-[9999]"
                    style={{ left, top, width, height }}
                  />
                );
              })()}

            {/* Camera track group */}
            <TrackGroup
              id="camera" name={t('timeline.track.camera')} color="cyan"
            >
              <TrackRow
                trackId="camera-keyframes"
                name={t('timeline.track.keyframes')}
                color="cyan"
                keyframeData={cameraKeyframes.map(k => ({
                  time: k.time,
                  handleIn: k.tensionHandleIn,
                  handleOut: k.tensionHandleOut,
                  handleInTime: k.tensionHandleInTime,
                  handleOutTime: k.tensionHandleOutTime,
                  mode: k.mode,
                }))}
                viewWindow={viewWindow}
                selectedKeyframes={selectedKeyframes}
                isGraphEditorVisible={expandedGraphTracks.has('camera')}
                onToggleGraphEditor={() => setExpandedGraphTracks(prev => { const n = new Set(prev); if (n.has('camera')) n.delete('camera'); else n.add('camera'); return n; })}
                onSelect={onKeyframeSelect}
                onMoveKeyframe={onMoveKeyframe}
                onContextMenu={handleKeyframeContextMenu}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                timeFromClientX={timeFromClientX}
                contentRef={contentRef}
                sceneMarkers={sceneMarkers}
              />
              {/* Camera graph editor (tension curve) */}
              {expandedGraphTracks.has('camera') && (
                <GraphEditor
                  trackId="camera-keyframes"
                  color="cyan"
                  keyframeData={cameraKeyframes.map(k => ({
                    time: k.time,
                    tension: k.tension,
                    handleIn: k.tensionHandleIn,
                    handleOut: k.tensionHandleOut,
                    handleInTime: k.tensionHandleInTime,
                    handleOutTime: k.tensionHandleOutTime,
                    mode: k.mode,
                  }))}
                  viewWindow={viewWindow}
                  onSetHandle={onSetHandle}
                  onSetHandle2D={onSetHandle2D}
                  onClearHandle={onClearHandle}
                  onSetInterpolation={onSetInterpolation}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onContextMenu={handleKeyframeContextMenu}
                  selectedKeyframes={selectedKeyframes}
                />
              )}
            </TrackGroup>

            {/* Physics track group */}
            <TrackGroup
              id="physics" name={t('timeline.track.physics')} color="orange"
            >
              {TRACK_GROUPS[1].tracks.map(track => {
                const kfArr = physicsKeyframes[track.id] ?? [];
                const trackName = 'paramKey' in track && track.paramKey
                  ? t(`sidebar.tab.physics.param.${track.paramKey}.name`)
                  : track.id;
                return (
                  <div key={track.id}>
                    <TrackRow
                      trackId={track.id}
                      name={trackName}
                      color="orange"
                      keyframeData={kfArr}
                      viewWindow={viewWindow}
                      selectedKeyframes={selectedKeyframes}
                      isGraphEditorVisible={expandedGraphTracks.has(track.id)}
                      onToggleGraphEditor={() => setExpandedGraphTracks(prev => { const n = new Set(prev); if (n.has(track.id)) n.delete(track.id); else n.add(track.id); return n; })}
                      onSelect={onKeyframeSelect}
                      onMoveKeyframe={onMoveKeyframe}
                      onContextMenu={handleKeyframeContextMenu}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      timeFromClientX={timeFromClientX}
                      contentRef={contentRef}
                      sceneMarkers={sceneMarkers}
                    />
                    {/* Per-track graph editor */}
                    {expandedGraphTracks.has(track.id) && (
                      <GraphEditor
                        trackId={track.id}
                        color="orange"
                        keyframeData={kfArr}
                        viewWindow={viewWindow}
                        onSetHandle={onSetHandle}
                        onSetHandle2D={onSetHandle2D}
                        onSetValue={onSetValue}
                        onClearHandle={onClearHandle}
                        onSetInterpolation={onSetInterpolation}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onContextMenu={handleKeyframeContextMenu}
                        selectedKeyframes={selectedKeyframes}
                      />
                    )}
                  </div>
                );
              })}
            </TrackGroup>

            {/* Playhead Line */}
            {playheadVisible && (
              <div 
                className="absolute top-[24px] bottom-0 right-0 pointer-events-none z-50 overflow-hidden"
                style={{ left: LABEL_W }}
              >
                <PlayheadLine ratio={playheadRatio} />
              </div>
            )}

          </div>
        </div>
      </ContextMenuTrigger>

        {/* The Actual Menu Content (portal rendered by Radix) */}
        {contextMenuTarget && (
          <TimelineContextMenuContent
            target={contextMenuTarget}
            onClose={() => setContextMenuTarget(null)}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={clipboard ? handlePaste : undefined}
            onDelete={onDeleteSelected}
            onAddSceneMarker={onAddSceneMarker}
            onSetEasing={handleSetEasing}
          />
        )}
      </ContextMenu>
    </div>
  );
}
