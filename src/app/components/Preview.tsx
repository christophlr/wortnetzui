import { Network3D, type Network3DHandle } from './Network3D';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { VERSION, BUILD_DATE, BUILD_NUMBER, LAST_COMMIT_HASH, LAST_COMMIT_DATE } from '../../version';
import { Progress } from './ui/progress';

type PhysicsKeyframe = { time: number; value: number; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };

interface PreviewProps {
  viewMode: '2D' | '3D';
  physicsEnabled: boolean;
  isPlaying: boolean;
  playheadPosition: number;
  physicsParams?: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
  };
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  inputText?: string;
  parseMode?: 'sentence' | 'word' | 'both';
  gradientSettings?: { mode: 'solid' | 'gradient'; innerColor: string; outerColor: string };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape?: string; nodeBorderWidth?: number; depthSizeEnabled?: boolean; depthSizeStrength?: number };
  cameraKeyframes?: Array<{ time: number; position: any; target: any }>;
  onCameraChange?: () => void;
  isDark?: boolean;
  isNetworkReady?: boolean;
  onNetworkReady?: () => void;
  onNetworkProgress?: (progress: number) => void;
  renderMode?: 'edit' | 'render';
  nodeAppearance?: { borderColor: 'auto' | string; fillColor: 'auto' | string; textColor: 'auto' | string };
  edgeAppearance?: { color: 'auto' | string };
  canvasAspectRatio?: string;
  initProgress?: number;
  cameraInfo?: { pos: number[], rot: number[], zoom: number };
  visualSettings?: {
    nodesVisible: boolean;
    labelsVisible: boolean;
    edgesVisible: boolean;
    envVisible: boolean;
    radialBiasScale: number;
    radialBiasOpacity: number;
    gradientOrigin: string;
    gradientPeriphery: string;
  };
  onNodeSelect?: (node: any) => void;
}

export const Preview = forwardRef<Network3DHandle, PreviewProps>(function Preview({
  viewMode,
  physicsEnabled,
  isPlaying,
  playheadPosition,
  physicsParams,
  physicsKeyframes,
  inputText,
  parseMode,
  gradientSettings,
  styleSettings,
  cameraKeyframes,
  onCameraChange,
  isDark,
  isNetworkReady,
  onNetworkReady,
  onNetworkProgress,
  renderMode,
  nodeAppearance,
  edgeAppearance,
  canvasAspectRatio = 'full',
  initProgress,
  cameraInfo,
  visualSettings,
  onNodeSelect,
}: PreviewProps, ref) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [lastHmr, setLastHmr] = useState<Date>(() => new Date(BUILD_DATE));

  useEffect(() => {
    const handler = (payload: { updates: Array<{ timestamp: number }> }) => {
      setLastHmr(new Date(payload.updates?.[0]?.timestamp ?? Date.now()));
    };

    import.meta.hot?.on('vite:afterUpdate', handler);
    return () => { import.meta.hot?.off('vite:afterUpdate', handler); };
  }, []);

  const previewRef = useRef<HTMLDivElement | null>(null);

  // We'll measure the preview bounding rect and position overlays fixed to viewport
  const [rect, setRect] = useState<{ left: number; top: number; right: number; bottom: number; width: number; height: number } | null>(null);
  useEffect(() => {
    const node = previewRef?.current ?? null;
    if (!node) return;
    const measure = () => setRect(node.getBoundingClientRect());
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      ro.disconnect();
    };
  }, [previewRef]);

  useEffect(() => {
    // Debug hook to force HMR updates and help diagnose overlay positioning
    // eslint-disable-next-line no-console
    console.debug('Preview rect updated', rect);
  }, [rect]);

  return (
    <div ref={previewRef} className="w-full h-full relative overflow-hidden bg-[var(--shell-background)] transition-colors duration-500">
      {/* Pasteboard Backdrop (Grid) - Visible only in edit mode (preview not enabled) */}
      <div 
        className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 ${renderMode === 'edit' ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `
          linear-gradient(to right, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px),
          linear-gradient(to bottom, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)
        `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-500 ${canvasAspectRatio === 'full' ? 'p-0' : 'p-8 sm:p-12 lg:p-16'}`}>
        {mounted && (
          <div 
            className={`relative transition-all duration-500 ease-in-out overflow-hidden border border-zinc-300 dark:border-white/10 rounded-[2px] ${
              document.documentElement.classList.contains('theme-hybrid') ? 'preview-portal shadow-2xl' : 'shadow-[0_30px_90px_rgba(0,0,0,0.4)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.6)]'
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
                onCameraChange={onCameraChange}
                isDark={isDark}
                onReady={onNetworkReady}
                onProgress={onNetworkProgress}
                renderMode={renderMode}
                nodeAppearance={nodeAppearance}
                edgeAppearance={edgeAppearance}
                visualSettings={visualSettings}
                onNodeSelect={onNodeSelect}
              />
            </div>
            
            {/* Artboard edge indicator - subtle internal border */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none z-10" />

            {/* Version indicator (bottom-left) - now inside artboard */}
            <div className="absolute left-3 bottom-3 z-50 pointer-events-none">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-muted-foreground/80">v{BUILD_NUMBER}</span>
                <span className="text-[10px] font-mono text-muted-foreground/60">
                  {new Date(LAST_COMMIT_DATE).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}{' '}
                  {new Date(LAST_COMMIT_DATE).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Camera info overlay (bottom-right) - now inside artboard */}
            <div className="absolute right-3 bottom-3 z-50 pointer-events-none">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-mono text-muted-foreground">CAM · POS {cameraInfo?.pos.join(' / ') ?? '0 / 0 / 0'}</span>
                <span className="text-[9px] font-mono text-muted-foreground">ROT {cameraInfo?.rot.join('° / ') ?? '0° / 0° / 0'}°</span>
                <span className="text-[9px] font-mono text-muted-foreground">ZOOM {cameraInfo?.zoom ?? 0}px</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Initializing Loading Indicator - Centered to preview */}
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
