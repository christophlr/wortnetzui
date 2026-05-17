import { useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { Preview } from './components/Preview';
import { Timeline } from './components/timeline/Timeline';
import { AppCanvas } from './components/shell/AppCanvas';
import { AppSidebar } from './components/shell/AppSidebar';
import { ShortcutsDialog } from './components/ShortcutsDialog';
import { Toolbar } from './components/Toolbar';
import { PathAnimatorUI } from './components/PathAnimatorUI';
import { DEFAULT_TIMELINE_HEIGHT } from './constants';
import { useShortcuts } from './hooks/useShortcuts';
import { useWortnetz } from './context/WortnetzContext';
import {
  useOverlayBandOffsets, useThemeClass, useSystemThemeSync, useInitProgressTick,
  useRecordingHistory, usePlayAnimation, useTimecode, useTimelineResize,
} from './hooks/useAppEffects';

export default function App() {
  const wn = useWortnetz();

  const { offsets, topBarRef, timelineRef } = useOverlayBandOffsets();
  useThemeClass(wn.themeMode);
  useSystemThemeSync(wn.themeAuto, wn.setThemeMode);
  useInitProgressTick(wn.isNetworkReady, wn.setInitProgress);
  useRecordingHistory(wn.isRecording, wn.getTimelineState, wn.pushHistory);
  usePlayAnimation(wn.isPlaying, wn.setIsPlaying, wn.setPlayheadPosition, wn.playheadRef);
  useTimecode(wn.playheadPosition, wn.setTimecode);
  const startTimelineResize = useTimelineResize(wn.timelineHeight, wn.setTimelineHeight);

  const { isShortcutsOpen, setIsShortcutsOpen, shortcuts, addShortcut, removeShortcut } = useShortcuts(useMemo(() => ({
    onSave: wn.handleSave, onLoad: wn.handleLoad, onUndo: wn.undo, onRedo: wn.redo,
    onTogglePlay: () => wn.setIsPlaying((p: boolean) => !p),
    onToggleRecord: () => wn.setIsRecording((p: boolean) => !p),
    onToggleSidebar: () => wn.setIsSidebarOpen(!wn.isSidebarOpen),
  }), [wn.handleSave, wn.handleLoad, wn.undo, wn.redo, wn.setIsPlaying, wn.setIsRecording, wn.setIsSidebarOpen, wn.isSidebarOpen]));

  return (
    <>
      <div className="flex-1 flex flex-row overflow-hidden min-h-0 relative">
        <AppCanvas>
          <div className="absolute left-0 right-0 z-0" style={{ top: offsets.top, bottom: offsets.bottom }}>
            <Preview
              ref={wn.network3DRef} viewMode={wn.viewMode} physicsEnabled={true}
              isPlaying={wn.isPlaying} playheadPosition={wn.playheadPosition}
              physicsParams={wn.physicsParams} inputText={wn.inputText} parseMode={wn.parseMode}
              styleSettings={wn.styleSettings}
              cameraKeyframes={wn.cameraKeyframes} onCameraChange={wn.handleCameraChange}
              physicsKeyframes={wn.physicsKeyframes} isDark={wn.previewIsDark}
              isNetworkReady={wn.isNetworkReady} onNetworkReady={() => wn.setIsNetworkReady(true)}
              edgeAppearance={wn.edgeAppearance}
              canvasAspectRatio={wn.canvasAspectRatio} initProgress={wn.initProgress}
              visualSettings={wn.visualSettings} onNodeSelect={wn.setSelectedNode}
            />
          </div>

          <div className="absolute left-6 z-50 flex items-center pointer-events-none"
               style={{ top: offsets.top + 12, bottom: offsets.bottom + 12 }}>
            <div className="pointer-events-auto">
              <Toolbar activeTool={wn.activeTool} onToolChange={wn.setActiveTool} />
            </div>
          </div>

          {wn.activeTool === 'path' && (
            <div className="absolute left-20 z-[60] pointer-events-none" style={{ top: offsets.top + 96 }}>
              <div className="pointer-events-auto">
                <PathAnimatorUI nodes={[]} onReorder={() => {}} onRemove={() => {}} onClose={() => wn.setActiveTool('pointer')} />
              </div>
            </div>
          )}

          <div ref={topBarRef} className="absolute top-0 left-0 right-0 z-50 pointer-events-none p-2">
            <TopBar
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
            />
          </div>

          <div ref={timelineRef} className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col">
            <div className="h-1 shrink-0 cursor-row-resize bg-white/10 hover:bg-white/30 transition-colors pointer-events-auto"
                 onMouseDown={startTimelineResize}
                 onDoubleClick={() => wn.setTimelineHeight(DEFAULT_TIMELINE_HEIGHT)} />
            <div className="pointer-events-auto">
              <Timeline
                isPlaying={wn.isPlaying} onPlayPause={() => wn.setIsPlaying(p => !p)}
                onStop={() => { wn.setIsPlaying(false); wn.setPlayheadPosition(0); }}
                playheadPosition={wn.playheadPosition}
                onPlayheadChange={pos => { wn.setPlayheadPosition(pos); if (wn.isPlaying) wn.setIsPlaying(false); }}
                selectedKeyframes={wn.selectedKeyframes}
                onKeyframeSelect={wn.handleKeyframeSelect} onSelectKeyframes={wn.handleSelectKeyframes}
                cameraKeyframes={wn.cameraKeyframes} onCaptureKeyframe={wn.handleCaptureKeyframe}
                physicsKeyframes={wn.physicsKeyframes} onMoveKeyframe={wn.handleMoveKeyframe}
                onSetHandle={wn.handleSetHandle} onSetHandle2D={wn.handleSetHandle2D}
                onSetValue={wn.handleSetValue} onClearHandle={wn.handleClearHandle} onSetInterpolation={wn.handleSetInterpolation}
                onDeleteKeyframe={wn.handleDeleteKeyframe} onDuplicateKeyframe={wn.handleDuplicateKeyframe}
                onDragStart={wn.handleDragStart} onDragEnd={wn.handleDragEnd}
                timecode={wn.timecode} onUndo={wn.undo} onRedo={wn.redo}
                canUndo={wn.canUndo} canRedo={wn.canRedo} height={wn.timelineHeight}
                sceneMarkers={wn.sceneMarkers} onAddSceneMarker={wn.handleAddSceneMarker}
                onRenameSceneMarker={wn.handleRenameSceneMarker} onMoveSceneMarker={wn.handleMoveSceneMarker}
                isRecording={wn.isRecording} onToggleRecording={() => wn.setIsRecording(!wn.isRecording)}
              />
            </div>
          </div>
        </AppCanvas>

        <AppSidebar>
          <Sidebar
            onPhysicsChange={wn.handlePhysicsChange} onTextChange={wn.setInputText}
            inputText={wn.inputText} parseMode={wn.parseMode} onParsingChange={wn.setParseMode}
            onStyleChange={(patch) => wn.setStyleSettings(prev => ({ ...prev, ...patch }))}
            styleSettings={wn.styleSettings}
            onEdgeAppearanceChange={wn.setEdgeAppearance}
            effectivePhysicsParams={wn.effectivePhysicsParams}
            canvasAspectRatio={wn.canvasAspectRatio} onCanvasAspectRatioChange={wn.setCanvasAspectRatio}
            currentTime={wn.playheadPosition} cameraKeyframes={wn.cameraKeyframes}
            physicsKeyframes={wn.physicsKeyframes} onTogglePhysicsKeyframe={wn.handleTogglePhysicsKeyframe}
            viewMode={wn.viewMode}
            onDeleteKeyframe={(time) => wn.handleDeleteKeyframe('camera-keyframes', time)}
            onCollapse={() => wn.setIsSidebarOpen(!wn.isSidebarOpen)}
            isSidebarOpen={wn.isSidebarOpen} onToggleSidebar={() => wn.setIsSidebarOpen(!wn.isSidebarOpen)}
            onPanView={(dx, dy) => wn.network3DRef.current?.panView(dx, dy)}
            onRotateView={(dt, dp) => wn.network3DRef.current?.rotateView(dt, dp)}
            onSetRotation={(t, p) => wn.network3DRef.current?.setRotation(t, p)}
            onResetView={() => wn.network3DRef.current?.resetView()}
            onZoomChange={(val) => { wn.setZoomValue(val); wn.network3DRef.current?.setZoom(val); }}
            zoomValue={wn.zoomValue}
            visualSettings={wn.visualSettings} onVisualSettingsChange={wn.setVisualSettings}
            selectedNode={wn.selectedNode}
          />
        </AppSidebar>
      </div>

      <ShortcutsDialog
        isOpen={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
        shortcuts={shortcuts}
        onAddShortcut={addShortcut}
        onRemoveShortcut={removeShortcut}
      />
    </>
  );
}
