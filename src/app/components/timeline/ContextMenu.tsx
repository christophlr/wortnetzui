import * as React from 'react';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuLabel,
} from '../ui/context-menu';
import { KeyframeIcon } from './KeyframeIcon';
import type { EasingType } from './types';

export type ContextMenuTarget =
  | { mode: 'background'; time: number }
  | { mode: 'keyframe'; track: string; time: number; easingType?: EasingType }
  | { mode: 'scene-marker'; time: number; label: string };

interface TimelineContextMenuProps {
  target: ContextMenuTarget;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onAddSceneMarker?: (time: number) => void;
  onSetEasing?: (type: EasingType) => void;
  onClose: () => void;
  x?: number;
  y?: number;
}

/**
 * Re-usable menu content that uses Shadcn UI components.
 * This is rendered inside the ContextMenuContent portal in Timeline.tsx.
 */
export function TimelineContextMenuContent({
  target, onCopy, onCut, onPaste, onDelete,
  onAddSceneMarker, onSetEasing, onClose,
}: TimelineContextMenuProps) {
  
  const easingPresets: { type: EasingType; label: string }[] = [
    { type: 'auto',     label: 'Auto (Smooth)' },
    { type: 'linear',   label: 'Linear' },
    { type: 'hold',     label: 'Hold (Step)' },
    { type: 'easyEase', label: 'Easy Ease' },
    { type: 'easeIn',   label: 'Ease In' },
    { type: 'easeOut',  label: 'Ease Out' },
  ];

  return (
    <ContextMenuContent className="w-56">
      {target.mode === 'background' && (
        <>
          <ContextMenuItem onClick={() => onAddSceneMarker?.(target.time)}>
            Add Scene Marker
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
            Paste at Playhead
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}

      {target.mode === 'keyframe' && (
        <>
          <ContextMenuItem onClick={onCopy}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onCut}>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
            Paste at Playhead
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          <ContextMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Keyframe Easing
          </ContextMenuLabel>
          
          {easingPresets.map(({ type, label }) => (
            <ContextMenuItem 
              key={type} 
              onClick={() => onSetEasing?.(type)}
              className={target.easingType === type ? "bg-accent text-accent-foreground" : ""}
            >
              <KeyframeIcon 
                type={type} 
                size={12} 
                fill={target.easingType === type ? 'currentColor' : 'var(--muted-foreground)'} 
                stroke={target.easingType === type ? 'currentColor' : 'var(--muted-foreground)'} 
              />
              <span className="flex-1 ml-1">{label}</span>
              {target.easingType === type && <span className="text-xs">✓</span>}
            </ContextMenuItem>
          ))}
          
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onDelete} variant="destructive">
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}

      {target.mode === 'scene-marker' && (
        <>
          <ContextMenuItem onClick={onCopy}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onCut}>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
            Paste at Playhead
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onDelete} variant="destructive">
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  );
}

export function TimelineContextMenu({ x = 0, y = 0, onClose, ...props }: TimelineContextMenuProps) {
  React.useEffect(() => {
    const handleUp = () => onClose();
    window.addEventListener('mouseup', handleUp, { capture: true, once: true });
    return () => window.removeEventListener('mouseup', handleUp, { capture: true });
  }, [onClose]);

  return (
    <div 
      style={{ position: 'fixed', left: x, top: y, zIndex: 9999 }} 
      onContextMenu={e => e.preventDefault()}
    >
      <TimelineContextMenuContent onClose={onClose} {...props} />
    </div>
  );
}
