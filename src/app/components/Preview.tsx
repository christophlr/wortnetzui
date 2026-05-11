import { Network3D, type Network3DHandle } from './Network3D';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { BUILD_NUMBER, LAST_COMMIT_DATE } from '../../version';
import { Progress } from './ui/progress';
import { useWortnetz } from '../context/WortnetzContext';

export const Preview = forwardRef<Network3DHandle, {}>(function Preview(_, ref) {
  const {
    viewMode,
    isPlaying,
    playheadPosition,
    physicsParams,
    physicsKeyframes,
    inputText,
    parseMode,
    gradientSettings,
    styleSettings,
    cameraKeyframes,
    previewIsDark,
    isNetworkReady,
    setIsNetworkReady,
    renderMode,
    nodeAppearance,
    edgeAppearance,
    canvasAspectRatio,
    initProgress,
    visualSettings,
    setSelectedNode,
    timelineHeight,
    inspectorWidth,
    isSidebarOpen
  } = useWortnetz();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const previewRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={previewRef} className="w-full h-full relative overflow-hidden bg-[var(--shell-background)] transition-colors duration-500">
      {/* Pasteboard Backdrop (Grid) - Visible only in edit mode */}
      <div 
        className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 ${renderMode === 'edit' ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `
          linear-gradient(to right, ${previewIsDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px),
          linear-gradient(to bottom, ${previewIsDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)
        `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Canvas Area with Letterboxing - Centered in visible space */}
      <div 
        className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-500 ${canvasAspectRatio === 'full' ? 'p-0' : 'p-8 sm:p-12 lg:p-16'}`}
        style={{
          paddingRight: isSidebarOpen ? inspectorWidth : 48,
          paddingBottom: timelineHeight,
          paddingTop: 60, // TopBar height + padding
        }}
      >
        {mounted && (
          <div 
            className={`relative transition-all duration-500 ease-in-out overflow-hidden border border-zinc-300 dark:border-white/10 rounded-[2px] ${
              'shadow-[0_30px_90px_rgba(0,0,0,0.4)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.6)]'
            }`}
            style={{
              width: canvasAspectRatio === 'full' ? '100%' : 'auto',
              height: canvasAspectRatio === 'full' ? '100%' : 'auto',
              aspectRatio: canvasAspectRatio === 'din' ? '1.414/1' : 
                          canvasAspectRatio === '16:9' ? '16/9' :
                          canvasAspectRatio === '4:3' ? '4:3' :
                          canvasAspectRatio === '3:2' ? '3/2' : 'auto',
              background: 'var(--preview-background)'
            }}
          >
            <div className={`w-full h-full transition-opacity duration-1000 ${isNetworkReady ? 'opacity-100' : 'opacity-0'}`}>
              <Network3D
                ref={ref}
                viewMode={viewMode}
                isPlaying={isPlaying}
                playheadPosition={playheadPosition}
                physicsParams={physicsParams}
                physicsKeyframes={physicsKeyframes}
                inputText={inputText}
                parseMode={parseMode}
                gradientSettings={gradientSettings}
                styleSettings={styleSettings}
                cameraKeyframes={cameraKeyframes}
                onCameraChange={() => {}} // Handle cam change in context if needed
                isDark={previewIsDark}
                onReady={() => setIsNetworkReady(true)}
                renderMode={renderMode}
                nodeAppearance={nodeAppearance}
                edgeAppearance={edgeAppearance}
                visualSettings={visualSettings}
                onNodeSelect={setSelectedNode}
              />
            </div>
            
            {/* Artboard edge indicator */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none z-10" />

            {/* Version indicator (bottom-left) */}
            <div className="absolute left-3 bottom-3 z-50 pointer-events-none">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-muted-foreground/80">v{BUILD_NUMBER}</span>
                <span className="text-[10px] font-mono text-muted-foreground/60">
                  {new Date(LAST_COMMIT_DATE).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}{' '}
                  {new Date(LAST_COMMIT_DATE).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Camera info overlay placeholder */}
            <div className="absolute right-3 bottom-3 z-50 pointer-events-none">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-mono text-muted-foreground">CAM · ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Initializing Loading Indicator */}
      {!isNetworkReady && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/40 dark:bg-black/40 animate-in fade-in duration-700">
          <div className="w-64 flex flex-col items-center gap-4">
            <div className="w-full space-y-3">
              <div className="flex justify-center items-center">
                <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 tracking-tight">Initialisierung</span>
              </div>
              <Progress value={initProgress} className="h-1 bg-zinc-200/80 dark:bg-zinc-800/80 overflow-hidden" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
