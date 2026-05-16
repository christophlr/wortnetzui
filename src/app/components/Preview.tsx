import { Network3D, type Network3DHandle } from './Network3D';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { VERSION, BUILD_DATE, BUILD_NUMBER, LAST_COMMIT_HASH, LAST_COMMIT_DATE } from '../../version';
import { type PhysicsKeyframe, type SceneMarker, type TimelineState } from '../context/WortnetzContextTypes';
import { type NodeAppearanceSettings, type GradientSettings, type EdgeAppearanceSettings } from '../networkTheme';
import { type PhysicsParams } from '../graph';
import { Artboard, LoadingOverlay, OverlayBadge } from './preview/PreviewAtoms';

interface PreviewProps {
  viewMode: '2D' | '3D';
  physicsEnabled: boolean;
  isPlaying: boolean;
  playheadPosition: number;
  physicsParams?: PhysicsParams;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  inputText?: string;
  parseMode?: 'sentence' | 'word' | 'both';
  gradientSettings?: GradientSettings;
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape: any; nodeBorderWidth?: number; depthSizeEnabled?: boolean; depthSizeStrength?: number };
  cameraKeyframes?: Array<{ time: number; position: any; target: any }>;
  onCameraChange?: () => void;
  isDark?: boolean;
  isNetworkReady?: boolean;
  onNetworkReady?: () => void;
  onNetworkProgress?: (progress: number) => void;
  renderMode?: 'edit' | 'render';
  nodeAppearance?: NodeAppearanceSettings;
  edgeAppearance?: EdgeAppearanceSettings;
  canvasAspectRatio?: string;
  initProgress?: number;
  cameraInfo?: { pos: number[], rot: number[], zoom: number };
  visualSettings?: any;
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

      {mounted && (
        <Artboard
          aspectRatio={canvasAspectRatio}
          isReady={!!isNetworkReady}
          themeHybrid={document.documentElement.classList.contains('theme-hybrid')}
          primary={
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
          }
        >
          <OverlayBadge position="bottom-left">
            <span className="text-[10px] font-mono text-muted-foreground/80">v{BUILD_NUMBER}</span>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {new Date(LAST_COMMIT_DATE).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}{' '}
              {new Date(LAST_COMMIT_DATE).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </OverlayBadge>

          <OverlayBadge position="bottom-right">
            <span className="text-[9px] font-mono text-muted-foreground">CAM · POS {cameraInfo?.pos.join(' / ') ?? '0 / 0 / 0'}</span>
            <span className="text-[9px] font-mono text-muted-foreground">ROT {cameraInfo?.rot.join('° / ') ?? '0° / 0° / 0'}°</span>
            <span className="text-[9px] font-mono text-muted-foreground">ZOOM {cameraInfo?.zoom ?? 0}px</span>
          </OverlayBadge>
        </Artboard>
      )}

      {!isNetworkReady && <LoadingOverlay progress={initProgress} />}
    </div>
  );
});
