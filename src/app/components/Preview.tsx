import { Network3D, type Network3DHandle } from './Network3D';
import { Network2D } from './Network2D';
import { forwardRef } from 'react';

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
  inputText?: string;
  colorSettings?: { hueStart: number; hueEnd: number; saturation: number; lightness: number };
  styleSettings?: { edgeOpacity: number; edgeWidth: number; nodeScale: number };
  cameraKeyframes?: Array<{ time: number; position: any; target: any }>;
  onCameraChange?: () => void;
}

export const Preview = forwardRef<Network3DHandle, PreviewProps>(function Preview({
  viewMode,
  physicsEnabled,
  isPlaying,
  playheadPosition,
  physicsParams,
  inputText,
  colorSettings,
  styleSettings,
  cameraKeyframes,
  onCameraChange,
  theme,
}: PreviewProps, ref) {
  return (
    <div className="flex-1 bg-background relative overflow-hidden">
      {viewMode === '2D' ? (
        <div className="absolute inset-0">
          <Network2D
            inputText={inputText}
            colorSettings={colorSettings}
            styleSettings={styleSettings}
            physicsParams={physicsParams}
            theme={theme}
          />
        </div>
      ) : (
        /* 3D View */
        <div className="absolute inset-0">
          <Network3D
            ref={ref}
            isPlaying={isPlaying}
            playheadPosition={playheadPosition}
            physicsParams={physicsParams}
            inputText={inputText}
            colorSettings={colorSettings}
            styleSettings={styleSettings}
            cameraKeyframes={cameraKeyframes}
            onCameraChange={onCameraChange}
            theme={theme}
          />
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

      {/* Camera info overlay (bottom-right) - visible in both modes */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-0.5 pointer-events-none z-10">
        <span className="text-[9px] font-mono text-muted-foreground">CAM · POS 0 / 0 / 500</span>
        <span className="text-[9px] font-mono text-muted-foreground">ROT 0° / 0° / 0°</span>
        <span className="text-[9px] font-mono text-muted-foreground">ZOOM 800px</span>
      </div>
    </div>
  );
});