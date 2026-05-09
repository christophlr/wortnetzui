import { Network3D, type Network3DHandle } from './Network3D';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { VERSION, BUILD_DATE, BUILD_NUMBER, LAST_COMMIT_HASH, LAST_COMMIT_DATE } from '../../version';

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
    <div ref={previewRef} className="flex-1 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        {mounted && (
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
        )}
      </div>

      {/* Loading overlay — shown while scene is rebuilding */}
      {!isNetworkReady && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-muted border-t-foreground/60 animate-spin" />
        </div>
      )}

      {/* Top-left anchor (fixed to preview) */}
      {rect && (
        <div
          className="pointer-events-none z-50"
          style={{ position: 'fixed', left: rect.left + 12, top: rect.top + 12 }}
        >
          <div className="flex items-center gap-1.5" />
        </div>
      )}

      {/* Top-right: playing indicator - visible in both modes */}
      {isPlaying && rect && (
        <div
          className="pointer-events-none z-50"
          style={{ position: 'fixed', left: rect.right - 12 - 120, top: rect.top + 12 }}
        >
          <div className="flex items-center gap-1.5 px-2 py-1 rounded border bg-red-950/40 border-red-800/40">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-red-400 font-medium tracking-wide">LIVE</span>
          </div>
        </div>
      )}

      {/* Version indicator (bottom-left) in format v0.cc.bb and date without seconds */}
      {rect && (
        <div
          className="pointer-events-none z-50"
          style={{ position: 'fixed', left: rect.left + 12, top: rect.bottom - 12 - 48 }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-muted-foreground/80">v{BUILD_NUMBER}</span>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {new Date(LAST_COMMIT_DATE).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}{' '}
              {new Date(LAST_COMMIT_DATE).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      )}

      {/* Camera info overlay (bottom-right) - visible in both modes */}
      {rect && (
        <div
          className="pointer-events-none z-50"
          style={{ position: 'fixed', left: rect.right - 12 - 160, top: rect.bottom - 12 - 54 }}
        >
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] font-mono text-muted-foreground">CAM · POS 0 / 0 / 500</span>
            <span className="text-[9px] font-mono text-muted-foreground">ROT 0° / 0° / 0°</span>
            <span className="text-[9px] font-mono text-muted-foreground">ZOOM 800px</span>
          </div>
        </div>
      )}
    </div>
  );
});
