import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Timeline } from './components/timeline/Timeline';
import { Progress } from './components/ui/progress';
import type { Network3DHandle } from './components/Network3D';
import { defaultGradientSettings, defaultNodeAppearance, defaultEdgeAppearance, type GradientSettings, type NodeShape, type NodeAppearanceSettings, type EdgeAppearanceSettings } from './networkTheme';
import { TIMELINE_DURATION, DEFAULT_INSPECTOR_WIDTH, DEFAULT_TIMELINE_HEIGHT } from './constants';
import { evaluateHermite, computeCatmullRomTangent } from './easing';
import { ShortcutsDialog } from './components/ShortcutsDialog';
import { Toolbar, type ToolId } from './components/Toolbar';
import { PathAnimatorUI } from './components/PathAnimatorUI';
import useTimelineHistory from './hooks/useTimelineHistory';
import useWorkspaceIO from './hooks/useWorkspaceIO';
import { useShortcuts } from './hooks/useShortcuts';
import { useWortnetz } from './context/WortnetzContext';
import { SceneMarker, TimelineState } from './context/WortnetzContextTypes';
import { EMPTY_PHYSICS_KFS, PHYS_TRACK_PARAM } from './context/WortnetzContextConstants';


export default function App() {
  const {
    viewMode, setViewMode,
    themeMode, setThemeMode,
    isPlaying, setIsPlaying,
    playheadPosition, setPlayheadPosition,
    timecode, setTimecode,
    selectedKeyframes, setSelectedKeyframes,
    sceneMarkers, setSceneMarkers,
    inputText, setInputText,
    parseMode, setParseMode,
    gradientSettings, setGradientSettings,
    styleSettings, setStyleSettings,
    physicsParams, setPhysicsParams,
    cameraKeyframes, setCameraKeyframes,
    physicsKeyframes, setPhysicsKeyframes,
    inspectorWidth, setInspectorWidth,
    timelineHeight, setTimelineHeight,
    isSidebarOpen, setIsSidebarOpen,
    isNetworkReady, setIsNetworkReady,
    initProgress, setInitProgress,
    canvasAspectRatio, setCanvasAspectRatio,
    activeTool, setActiveTool,
    zoomValue, setZoomValue,
    visualSettings, setVisualSettings,
    selectedNode, setSelectedNode,
    isRecording, setIsRecording,
    renderMode, setRenderMode,
    nodeAppearance, setNodeAppearance,
    edgeAppearance, setEdgeAppearance,
    lastAppliedPreset, setLastAppliedPreset,
    network3DRef,
    cameraKeyframesRef,
    physicsKeyframesRef,
    sceneMarkersRef,
    selectedKeyframesRef,
    playheadRef,
    isRecordingRef,
    undo: handleUndo,
    redo: handleRedo,
    pushHistory,
    getTimelineState,
    handleSave,
    handleLoad,
    effectivePhysicsParams,
    handleCaptureKeyframe,
    handleMoveKeyframe,
    handleDeleteKeyframe,
    handleSetHandle,
    handleClearHandle,
    handleSetInterpolation,
    handleDuplicateKeyframe,
    handleAddSceneMarker,
    handleRenameSceneMarker,
    handleMoveSceneMarker,
    handleSetValue,
    handleSetHandle2D,
    handleCameraChange,
    handleApplyNodeStylePreset,
    handleTogglePhysicsKeyframe,
    handleKeyframeSelect,
    handleSelectKeyframes,
    handlePhysicsChange,
    handleDragStart,
    handleDragEnd,
    previewIsDark,
    uiIsDark,
    canUndo,
    canRedo
  } = useWortnetz();

  const [overlayBandOffsets, setOverlayBandOffsets] = useState({ top: 0, bottom: 0 });
  const topBarContainerRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measure = () => {
      setOverlayBandOffsets({
        top: topBarContainerRef.current?.offsetHeight ?? 0,
        bottom: timelineContainerRef.current?.offsetHeight ?? 0
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (topBarContainerRef.current) observer.observe(topBarContainerRef.current);
    if (timelineContainerRef.current) observer.observe(timelineContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const preDragStateRef = useRef<TimelineState | null>(null);
  const preRecordStateRef = useRef<TimelineState | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isNetworkReady) {
      setInitProgress(0);
      const interval = setInterval(() => {
        setInitProgress(prev => {
          if (typeof prev !== 'number') return 0;
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setInitProgress(100);
    }
  }, [isNetworkReady, setInitProgress]);

  // Undo/redo history — tracks the full timeline state
  // history state managed by useTimelineHistory

  
  // Redundant hooks and state effects are now managed in WortnetzContext.

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

  const shortcutState = useShortcuts(useMemo(() => ({
    onSave: handleSave,
    onLoad: handleLoad,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onTogglePlay: () => setIsPlaying((p: boolean) => !p),
    onToggleRecord: () => setIsRecording((p: boolean) => !p),
    onToggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
  }), [handleSave, handleLoad, handleUndo, handleRedo, setIsPlaying, setIsRecording, setIsSidebarOpen, isSidebarOpen]));

  const { 
    isShortcutsOpen: isShortcutsVisible, 
    setIsShortcutsOpen: setIsShortcutsVisible, 
    shortcuts: appShortcutsList, 
    addShortcut: addAppShortcut, 
    removeShortcut: removeAppShortcut 
  } = shortcutState;

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




  /* ── Selection ── */


  const startInspectorResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = inspectorWidth;
    const onMove = (ev: MouseEvent) => setInspectorWidth(Math.max(DEFAULT_INSPECTOR_WIDTH, Math.min(600, startWidth + (startX - ev.clientX))));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [inspectorWidth, setInspectorWidth]);

  const startTimelineResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = timelineHeight;
    const onMove = (ev: MouseEvent) => setTimelineHeight(Math.max(100, Math.min(600, startHeight - (ev.clientY - startY))));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timelineHeight, setTimelineHeight]);

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
      <div className="flex-1 flex flex-row overflow-hidden min-h-0 relative">
        <div className="flex-1 relative overflow-hidden h-full">
          <div 
            className="absolute left-0 right-0 z-0"
            style={{ top: overlayBandOffsets.top, bottom: overlayBandOffsets.bottom }}
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

          <div className="absolute left-6 z-50 flex items-center pointer-events-none"
               style={{ top: overlayBandOffsets.top + 12, bottom: overlayBandOffsets.bottom + 12 }}>
            <div className="pointer-events-auto">
              <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
            </div>
          </div>

          {activeTool === 'path' && (
            <div className="absolute left-20 z-[60] pointer-events-none" style={{ top: overlayBandOffsets.top + 96 }}>
              <div className="pointer-events-auto">
                <PathAnimatorUI nodes={[]} onReorder={() => {}} onRemove={() => {}} onClose={() => setActiveTool('pointer')} />
              </div>
            </div>
          )}

          <div ref={topBarContainerRef} className="absolute top-0 left-0 right-0 z-50 pointer-events-none p-2">
            <TopBar
              onApplyNodeStylePreset={handleApplyNodeStylePreset}
              onOpenShortcuts={() => setIsShortcutsVisible(true)}
            />
          </div>

          <div ref={timelineContainerRef} className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col">
            <div 
              className="h-1 shrink-0 cursor-row-resize bg-white/10 hover:bg-white/30 transition-colors pointer-events-auto"
              onMouseDown={startTimelineResize}
              onDoubleClick={() => setTimelineHeight(DEFAULT_TIMELINE_HEIGHT)}
            />
            <div className="pointer-events-auto">
              <Timeline
                isPlaying={isPlaying} onPlayPause={() => setIsPlaying(p => !p)} onStop={() => { setIsPlaying(false); setPlayheadPosition(0); }}
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
                canUndo={canUndo} canRedo={canRedo}
                height={timelineHeight}
                sceneMarkers={sceneMarkers}
                onAddSceneMarker={handleAddSceneMarker}
                onRenameSceneMarker={handleRenameSceneMarker}
                onMoveSceneMarker={handleMoveSceneMarker}
                isRecording={isRecording}
                onToggleRecording={() => setIsRecording(!isRecording)}
              />
            </div>
          </div>
        </div>

        <div 
          className="relative h-full flex flex-row border-l border-border bg-card z-40 transition-all duration-300 ease-in-out shadow-2xl"
          style={{ width: isSidebarOpen ? inspectorWidth : 48 }}
        >
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
            onStyleChange={setStyleSettings}
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
            onDeleteKeyframe={(time) => handleDeleteKeyframe('camera-keyframes', time)}
            onCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onPanView={(dx, dy) => network3DRef.current?.panView(dx, dy)}
            onRotateView={(dt, dp) => network3DRef.current?.rotateView(dt, dp)}
            onSetRotation={(t, p) => network3DRef.current?.setRotation(t, p)}
            onResetView={() => network3DRef.current?.resetView()}
            onZoomChange={(val) => { setZoomValue(val); network3DRef.current?.setZoom(val); }}
            zoomValue={zoomValue}
            visualSettings={visualSettings}
            onVisualSettingsChange={setVisualSettings}
            selectedNode={selectedNode}
          />
        </div>
      </div>

      <ShortcutsDialog 
        isOpen={isShortcutsVisible} 
        onOpenChange={setIsShortcutsVisible} 
        shortcuts={appShortcutsList}
        onAddShortcut={addAppShortcut}
        onRemoveShortcut={removeAppShortcut}
      />
    </div>
  );
}





