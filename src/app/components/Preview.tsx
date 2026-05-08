import { Network3D, type Network3DHandle } from './Network3D';
import { forwardRef } from 'react';
import { VERSION, BUILD_DATE } from '../../version';

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
  return (
    <div className="flex-1 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
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
      </div>

      {/* Loading overlay — shown while scene is rebuilding */}
      {!isNetworkReady && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-muted border-t-foreground/60 animate-spin" />
        </div>
      )}

      {/* Top-left badges - visible in both modes */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none z-10">


      </div>

      {/* Top-right: playing indicator - visible in both modes */}
      {isPlaying && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded border bg-red-950/40 border-red-800/40 pointer-events-none z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-red-400 font-medium tracking-wide">LIVE</span>
        </div>
      )}

      {/* Version indicator (bottom-left) */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-0.5 pointer-events-none z-10">
        <span className="text-[9px] font-mono text-muted-foreground">v{VERSION}</span>
        <span className="text-[9px] font-mono text-muted-foreground">{new Date(BUILD_DATE).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {new Date(BUILD_DATE).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Camera info overlay (bottom-right) - visible in both modes */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-0.5 pointer-events-none z-10">
        <span className="text-[9px] font-mono text-muted-foreground">CAM · POS 0 / 0 / 500</span>
        <span className="text-[9px] font-mono text-muted-foreground">ROT 0° / 0° / 0°</span>
        <span className="text-[9px] font-mono text-muted-foreground">ZOOM 800px</span>
      </div>
    </div>
  );
});
