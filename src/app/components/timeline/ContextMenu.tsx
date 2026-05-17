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
import { useT } from '../../i18n/useT';

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
  const { t } = useT();

  const easingPresets: { type: EasingType; labelKey: string }[] = [
    { type: 'auto',     labelKey: 'timeline.contextMenu.easing.auto' },
    { type: 'linear',   labelKey: 'timeline.contextMenu.easing.linear' },
    { type: 'hold',     labelKey: 'timeline.contextMenu.easing.hold' },
    { type: 'easyEase', labelKey: 'timeline.contextMenu.easing.easyEase' },
    { type: 'easeIn',   labelKey: 'timeline.contextMenu.easing.easeIn' },
    { type: 'easeOut',  labelKey: 'timeline.contextMenu.easing.easeOut' },
  ];

  return (
    <ContextMenuContent className="w-56">
      {target.mode === 'background' && (
        <>
          <ContextMenuItem onClick={() => onAddSceneMarker?.(target.time)}>
            {t('timeline.contextMenu.addSceneMarker')}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
            {t('timeline.contextMenu.pasteAtPlayhead')}
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}

      {target.mode === 'keyframe' && (
        <>
          <ContextMenuItem onClick={onCopy}>
            {t('timeline.contextMenu.copy')}
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onCut}>
            {t('timeline.contextMenu.cut')}
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
            {t('timeline.contextMenu.pasteAtPlayhead')}
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />
          <ContextMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {t('timeline.contextMenu.keyframeEasing')}
          </ContextMenuLabel>

          {easingPresets.map(({ type, labelKey }) => (
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
              <span className="flex-1 ml-1">{t(labelKey)}</span>
              {target.easingType === type && <span className="text-xs">✓</span>}
            </ContextMenuItem>
          ))}

          <ContextMenuSeparator />
          <ContextMenuItem onClick={onDelete} variant="destructive">
            {t('timeline.contextMenu.delete')}
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}

      {target.mode === 'scene-marker' && (
        <>
          <ContextMenuItem onClick={onCopy}>
            {t('timeline.contextMenu.copy')}
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onCut}>
            {t('timeline.contextMenu.cut')}
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
            {t('timeline.contextMenu.pasteAtPlayhead')}
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onDelete} variant="destructive">
            {t('timeline.contextMenu.delete')}
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
