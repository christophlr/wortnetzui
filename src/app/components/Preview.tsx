import { Network3D, type Network3DHandle } from './Network3D';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { VERSION, BUILD_DATE, BUILD_NUMBER, LAST_COMMIT_HASH, LAST_COMMIT_DATE } from '../../version';
import { type PhysicsKeyframe, type SceneMarker, type TimelineState, type TrackMeta } from '../context/WortnetzContextTypes';
import { type EdgeAppearanceSettings } from '../networkTheme';
import { type PhysicsParams } from '../graph';
import { LoadingOverlay, OverlayBadge } from './preview/PreviewAtoms';
import { useT } from '../i18n/useT';
import { cn } from './ui/utils';

interface PreviewProps {
  viewMode: '2D' | '3D';
  physicsEnabled: boolean;
  isPlaying: boolean;
  playheadPosition: number;
  physicsParams?: PhysicsParams;
  physicsKeyframes?: Record<string, PhysicsKeyframe[]>;
  trackMeta?: Record<string, TrackMeta>;
  inputText?: string;
  parseMode?: 'sentence' | 'word' | 'both';
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape: any; nodeBorderWidth?: number; depthSizeEnabled?: boolean; depthSizeStrength?: number };
  cameraKeyframes?: Array<{ time: number; position: any; target: any }>;
  onCameraChange?: () => void;
  isDark?: boolean;
  isNetworkReady?: boolean;
  onNetworkReady?: () => void;
  onNetworkProgress?: (progress: number) => void;
  edgeAppearance?: EdgeAppearanceSettings;
  canvasAspectRatio?: string;
  initProgress?: number;
  cameraInfo?: { pos: number[], rot: number[], zoom: number };
  visualSettings?: any;
  onNodeSelect?: (node: any) => void;
  pathNodes?: { id: string; label: string }[];
  isPathPlaying?: boolean;
  onPathPlaybackFinished?: () => void;
}

function AspectRatioGuide({
  aspectRatio,
  rect,
  children,
}: {
  aspectRatio: string;
  rect: { width: number; height: number } | null;
  children: React.ReactNode;
}) {
  if (aspectRatio === 'full') return <>{children}</>;

  let ratioNum = 16 / 9;
  switch (aspectRatio) {
    case '4:3': ratioNum = 4 / 3; break;
    case '3:2': ratioNum = 3 / 2; break;
    case 'din': ratioNum = 1.414; break;
    default: ratioNum = 16 / 9;
  }

  let width = '100%';
  let height = '100%';

  if (rect) {
    const containerRatio = rect.width / rect.height;
    if (containerRatio > ratioNum) {
      // Height-constrained
      height = `${rect.height}px`;
      width = `${rect.height * ratioNum}px`;
    } else {
      // Width-constrained
      width = `${rect.width}px`;
      height = `${rect.width / ratioNum}px`;
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
      {/* Underlying content */}
      <div 
        className="absolute z-0 pointer-events-auto flex items-center justify-center transition-all duration-300"
        style={{
          width,
          height,
        }}
      >
        {children}
      </div>

      {/* Dashed overlay box with heavy shadow letterbox */}
      <div
        className="relative border border-dashed border-zinc-500/30 dark:border-white/20 shadow-[0_0_0_9999px_rgba(9,9,11,0.6)] flex items-center justify-center transition-all duration-300 select-none pointer-events-none"
        style={{
          width,
          height,
        }}
      >
        <div className="absolute top-2 left-2 text-[9px] font-mono text-zinc-500/80 dark:text-white/40 uppercase tracking-widest">
          {aspectRatio}
        </div>
      </div>
    </div>
  );
}

export const Preview = forwardRef<Network3DHandle, PreviewProps>(function Preview({
  viewMode,
  physicsEnabled,
  isPlaying,
  playheadPosition,
  physicsParams,
  physicsKeyframes,
  trackMeta,
  inputText,
  parseMode,
  styleSettings,
  cameraKeyframes,
  onCameraChange,
  isDark,
  isNetworkReady,
  onNetworkReady,
  onNetworkProgress,
  edgeAppearance,
  canvasAspectRatio = 'full',
  initProgress,
  cameraInfo,
  visualSettings,
  onNodeSelect,
  pathNodes = [],
  isPathPlaying = false,
  onPathPlaybackFinished,
}: PreviewProps, ref) {
  const { t, language } = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [lastHmr, setLastHmr] = useState<Date>(() => new Date(BUILD_DATE));

  useEffect(() => {
    const handler = (payload: { updates: Array<{ timestamp: number }> }) => {
      setLastHmr(new Date(payload.updates?.[0]?.timestamp ?? Date.now()));
    };

    (import.meta as any).hot?.on('vite:afterUpdate', handler);
    return () => { (import.meta as any).hot?.off('vite:afterUpdate', handler); };
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
    <div 
      ref={previewRef} 
      className="w-full h-full relative overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: visualSettings?.backgroundColor || 'var(--preview-background)'
      }}
    >
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'} 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {mounted && (
        <AspectRatioGuide aspectRatio={canvasAspectRatio} rect={rect}>
          <div className={cn(
            'w-full h-full transition-opacity duration-1000',
            isNetworkReady ? 'opacity-100' : 'opacity-0',
          )}>
            <Network3D
              ref={ref}
              viewMode={viewMode}
              isPlaying={isPlaying}
              playheadPosition={playheadPosition}
              physicsParams={physicsParams}
              physicsKeyframes={physicsKeyframes}
              trackMeta={trackMeta}
              inputText={inputText}
              parseMode={parseMode}
              styleSettings={styleSettings}
              cameraKeyframes={cameraKeyframes}
              onCameraChange={onCameraChange}
              isDark={isDark}
              onReady={onNetworkReady}
              onProgress={onNetworkProgress}
              edgeAppearance={edgeAppearance}
              canvasAspectRatio={canvasAspectRatio} initProgress={initProgress}
              visualSettings={visualSettings} onNodeSelect={onNodeSelect}
              pathNodes={pathNodes} isPathPlaying={isPathPlaying}
              onPathPlaybackFinished={onPathPlaybackFinished}
            />
          </div>
        </AspectRatioGuide>
      )}

      {/* Viewport corner badges */}
      <OverlayBadge position="bottom-left">
        <span className="text-[10px] font-mono text-muted-foreground/80">v{BUILD_NUMBER}</span>
        <span className="text-[10px] font-mono text-muted-foreground/60">
          {new Date(LAST_COMMIT_DATE).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: 'short' })}{' '}
          {new Date(LAST_COMMIT_DATE).toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </OverlayBadge>

      <OverlayBadge position="bottom-right">
        <span className="text-[9px] font-mono text-muted-foreground">CAM · POS {cameraInfo?.pos.join(' / ') ?? '0 / 0 / 0'}</span>
        <span className="text-[9px] font-mono text-muted-foreground">ROT {cameraInfo?.rot.join('° / ') ?? '0° / 0° / 0'}°</span>
        <span className="text-[9px] font-mono text-muted-foreground">ZOOM {cameraInfo?.zoom ?? 0}px</span>
      </OverlayBadge>

      {!isNetworkReady && <LoadingOverlay label={t('preview.loading.label')} progress={initProgress} />}
    </div>
  );
});
