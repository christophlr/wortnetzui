import { Network3D, type Network3DHandle } from './Network3D';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { VERSION, BUILD_DATE, BUILD_NUMBER, LAST_COMMIT_HASH, LAST_COMMIT_DATE } from '../../version';
import { Progress } from './ui/progress';
import { Toolbar } from './Toolbar';

type PhysicsKeyframe = { time: number; value: number; outWeight?: number; inWeight?: number; interpolation?: 'auto' | 'manual' };

interface PreviewProps {
  viewMode: '2D' | '3D';
  physicsEnabled: boolean;
  isPlaying: boolean;
  playheadPosition: number;
  theme?: 'light' | 'dark' | 'system';
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
  renderMode?: 'edit' | 'render';
  nodeAppearance?: { borderColor: 'auto' | string; fillColor: 'auto' | string; textColor: 'auto' | string };
  edgeAppearance?: { color: 'auto' | string };
  canvasAspectRatio?: string;
  initProgress?: number;
  activeTool?: any;
  onToolChange?: (tool: any) => void;
  overlayTopOffset?: number;
  overlayBottomOffset?: number;
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
  theme,
  isDark,
  isNetworkReady,
  onNetworkReady,
  renderMode,
  nodeAppearance,
  edgeAppearance,
  canvasAspectRatio = 'full',
  initProgress,
  activeTool,
  onToolChange,
  overlayTopOffset = 0,
  overlayBottomOffset = 0,
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
    <div ref={previewRef} className="w-full h-full relative overflow-hidden bg-zinc-100 dark:bg-[#0c0c0e]">
      {/* Pasteboard Backdrop (Grid) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          color: isDark ? '#ffffff' : '#000000'
        }}
      />

      <div className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-500 ${canvasAspectRatio === 'full' ? 'p-0' : 'p-8 sm:p-12 lg:p-16'}`}>
        {mounted && (
          <div 
            className="relative transition-all duration-500 ease-in-out shadow-[0_30px_90px_rgba(0,0,0,0.4)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden border border-zinc-300 dark:border-white/10 rounded-[2px]"
            style={{
              width: canvasAspectRatio === 'full' ? '100%' : 'auto',
              height: canvasAspectRatio === 'full' ? '100%' : 'auto',
              aspectRatio: canvasAspectRatio === 'din' ? '1.414/1' : 
                          canvasAspectRatio === '16:9' ? '16/9' :
                          canvasAspectRatio === '4:3' ? '4:3' :
                          canvasAspectRatio === '3:2' ? '3/2' : 'auto',
              maxHeight: '100%',
              maxWidth: '100%',
              background: isDark 
                ? 'radial-gradient(circle at 50% 50%, #003d7a 0%, #000a14 100%)' 
                : 'radial-gradient(circle at 50% 50%, #f0f7ff 0%, #cce5ff 100%)'
            }}
          >
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
              theme={theme}
              isDark={isDark}
              onReady={onNetworkReady}
              renderMode={renderMode}
              nodeAppearance={nodeAppearance}
              edgeAppearance={edgeAppearance}
            />
            
            {/* Toolbar - Centered to Artboard */}
            {activeTool && onToolChange && (
              <div
                className="absolute left-4 z-50 flex items-center pointer-events-none"
                style={{ top: overlayTopOffset, bottom: overlayBottomOffset }}
              >
                <Toolbar 
                  activeTool={activeTool} 
                  onToolChange={onToolChange} 
                />
              </div>
            )}
            
            {/* Artboard edge indicator - subtle internal border */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none z-10" />

            {/* Version indicator (bottom-left) - now inside artboard */}
            <div className="absolute left-3 bottom-3 z-50 pointer-events-none">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-muted-foreground/80">v{BUILD_NUMBER}</span>
                <span className="text-[10px] font-mono text-muted-foreground/60">
                  {new Date(LAST_COMMIT_DATE).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}{' '}
                  {new Date(LAST_COMMIT_DATE).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Camera info overlay (bottom-right) - now inside artboard */}
            <div className="absolute right-3 bottom-3 z-50 pointer-events-none">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-mono text-muted-foreground">CAM · POS 0 / 0 / 500</span>
                <span className="text-[9px] font-mono text-muted-foreground">ROT 0° / 0° / 0°</span>
                <span className="text-[9px] font-mono text-muted-foreground">ZOOM 800px</span>
              </div>
            </div>

            {/* Initializing Loading Indicator - Centered to artboard */}
            {!isNetworkReady && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-sm animate-in fade-in duration-700">
                <div className="w-64 flex flex-col items-center gap-4">
                  <div className="w-full space-y-3">
                    <div className="flex justify-center items-center">
                      <span className="text-[13px] font-medium text-zinc-700 tracking-tight">Initialisierung</span>
                    </div>
                    <Progress value={initProgress} className="h-1 bg-zinc-200/80 overflow-hidden" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
