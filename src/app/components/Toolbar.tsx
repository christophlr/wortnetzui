import { MousePointer2, Hand, Paintbrush, View, Wand2, Route, Play, Square } from 'lucide-react';
import {
  ToolButton,
  ToolbarDivider,
  ToolbarShell,
  ToolbarSegmentedPicker,
  ToolbarPopoverRow,
  ToolbarPopoverHeader,
  ToolbarPathItem,
  ToolbarActionButton
} from './toolbar/ToolbarAtoms';
import { useT } from '../i18n/useT';
import { useWortnetz } from '../context/WortnetzContext';
import { Popover, PopoverContent, PopoverAnchor } from './ui/popover';
import { Scrubber } from './ui/scrubber';
import { Button } from './ui/button';
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerHueSlider,
  ColorPickerPresets,
  ColorPickerSwatch,
  ColorPickerTrigger,
  ColorPickerArea,
} from './ui/color-picker';

export type ToolId = 'pointer' | 'pan' | 'paint' | 'zoom' | 'glitch' | 'path';

interface ToolbarProps {
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  className?: string;
}

const TOOL_ICONS = {
  pointer: MousePointer2,
  pan: Hand,
  paint: Paintbrush,
  zoom: View,
  glitch: Wand2,
  path: Route,
} as const satisfies Record<ToolId, unknown>;


function toolLabel(t: (key: string) => string, id: ToolId): string {
  return `${t(`toolbar.tool.${id}`)} (${t(`toolbar.shortcut.${id}`)})`;
}

export function Toolbar({ activeTool, onToolChange, className }: ToolbarProps) {
  const { t } = useT();
  const {
    brushRadius, setBrushRadius,
    paintColor, setPaintColor,
    paintScale, setPaintScale,
    paintOpacity, setPaintOpacity,
    paintBlend, setPaintBlend,
    paintMode, setPaintMode,
    clearPaintedOverrides,
    pathNodes, isPathPlaying, setIsPathPlaying, reorderPathNodes, removePathNode, clearPath,
    visualSettings, setVisualSettings
  } = useWortnetz();

  const handleReorderPathNodes = (fromIndex: number, toIndex: number) => {
    const next = [...pathNodes];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    reorderPathNodes(next);
  };

  const primary: ToolId[] = ['pointer', 'pan', 'paint', 'zoom'];
  const advanced: ToolId[] = ['glitch', 'path'];

  const renderButton = (id: ToolId) => {
    const btn = (
      <ToolButton
        id={id}
        activeId={activeTool}
        onSelect={onToolChange}
        icon={TOOL_ICONS[id]}
        label={toolLabel(t, id)}
      />
    );

    if (id === 'paint') {
      const modes = [
        { id: 'color', label: t('toolbar.brush.modeColor') },
        { id: 'scale', label: t('toolbar.brush.modeScale') },
        { id: 'opacity', label: t('toolbar.brush.modeOpacity') },
        { id: 'erase', label: t('toolbar.brush.modeErase') },
      ] as const;

      return (
        <Popover key={id} open={activeTool === 'paint'}>
          <PopoverAnchor asChild>
            <div className="relative">
              {btn}
            </div>
          </PopoverAnchor>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={12}
            className="bg-popover/95 backdrop-blur-sm p-4 w-72 space-y-4 z-50 shadow-xl border border-wn-divider rounded-xl select-none pointer-events-auto"
          >
            <ToolbarSegmentedPicker
              label={t('toolbar.brush.mode')}
              options={modes}
              value={paintMode}
              onChange={setPaintMode}
            />

            {/* Dynamic Value Row based on Paint Mode */}
            {paintMode === 'color' && (
              <div className="space-y-3">
                <ToolbarPopoverRow label={t('toolbar.brush.color')}>
                  <ColorPicker value={paintColor} onValueChange={setPaintColor}>
                    <ColorPickerTrigger asChild>
                      <button className="flex items-center gap-2 p-1.5 rounded-md border border-wn-divider hover:bg-wn-control-hover w-full bg-wn-control-bg cursor-pointer text-left h-7">
                        <ColorPickerSwatch className="size-4 rounded-sm border border-black/10" />
                        <span className="text-[11px] font-mono text-muted-foreground">{paintColor}</span>
                      </button>
                    </ColorPickerTrigger>
                    <ColorPickerContent align="center" side="right">
                      <ColorPickerArea />
                      <ColorPickerHueSlider />
                      <ColorPickerPresets />
                    </ColorPickerContent>
                  </ColorPicker>
                </ToolbarPopoverRow>

                <Scrubber
                  label={t('toolbar.brush.blend')}
                  value={paintBlend}
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  decimals={2}
                  format={(v) => `${Math.round(v * 100)}%`}
                  onValueChange={setPaintBlend}
                  onCommit={setPaintBlend}
                />
              </div>
            )}

            {paintMode === 'scale' && (
              <Scrubber
                label={t('toolbar.brush.scale')}
                value={paintScale}
                min={0.1}
                max={3.0}
                step={0.05}
                decimals={2}
                format={(v) => `${v.toFixed(2)}x`}
                onValueChange={setPaintScale}
                onCommit={setPaintScale}
              />
            )}

            {paintMode === 'opacity' && (
              <Scrubber
                label={t('toolbar.brush.opacity')}
                value={paintOpacity}
                min={0.0}
                max={1.0}
                step={0.05}
                decimals={2}
                format={(v) => `${Math.round(v * 100)}%`}
                onValueChange={setPaintOpacity}
                onCommit={setPaintOpacity}
              />
            )}

            {/* Brush Radius Row */}
            <Scrubber
              label={t('toolbar.brush.radius')}
              value={brushRadius}
              min={10}
              max={300}
              step={5}
              decimals={0}
              format={(v) => `${Math.round(v)}px`}
              onValueChange={setBrushRadius}
              onCommit={setBrushRadius}
            />

            {/* Clear paint action button */}
            <ToolbarActionButton
              onClick={clearPaintedOverrides}
              label={t('toolbar.brush.clearAll')}
            />
          </PopoverContent>
        </Popover>
      );
    }

    if (id === 'path') {
      return (
        <Popover key={id} open={activeTool === 'path'}>
          <PopoverAnchor asChild>
            <div className="relative">
              {btn}
            </div>
          </PopoverAnchor>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={12}
            className="bg-popover/95 backdrop-blur-sm p-0 w-64 z-50 shadow-xl border border-wn-divider rounded-xl select-none pointer-events-auto overflow-hidden flex flex-col"
          >
            {/* Header */}
            <ToolbarPopoverHeader
              title={t('sidebar.tab.visual.section.pathAnimator')}
              icon={Route}
              actionLabel={pathNodes.length > 0 ? t('toolbar.brush.clearAll') : undefined}
              onAction={clearPath}
            />

            {/* Waypoints List */}
            <div className="p-2 max-h-[220px] overflow-y-auto space-y-1 bg-wn-canvas-dot-grid/10">
              {pathNodes.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    {t('sidebar.tab.visual.pathAnimator.emptyHint')}
                  </p>
                </div>
              ) : (
                pathNodes.map((node, index) => (
                  <ToolbarPathItem
                    key={`${node.id}-${index}`}
                    index={index}
                    label={node.label}
                    onRemove={() => removePathNode(index)}
                    onReorder={handleReorderPathNodes}
                  />
                ))
              )}
            </div>

            {/* Playback action block */}
            <div className="p-3 bg-wn-control-bg/40 border-t border-wn-divider space-y-2">
              <div className="flex items-center justify-between px-1 py-0.5">
                <span className="text-[10px] font-medium text-foreground">
                  {t('sidebar.tab.visual.toggle.pathLoop')}
                </span>
                <input
                  type="checkbox"
                  checked={visualSettings.pathLoop}
                  onChange={(e) => setVisualSettings(prev => ({ ...prev, pathLoop: e.target.checked }))}
                  className="scale-90 accent-wn-accent cursor-pointer"
                />
              </div>
              <Button 
                size="sm" 
                onClick={() => setIsPathPlaying(p => !p)}
                disabled={pathNodes.length < 2}
                className="w-full h-7 text-[10px] gap-1.5 bg-wn-accent hover:bg-wn-accent/90 text-white shadow-sm cursor-pointer"
              >
                {isPathPlaying ? (
                  <>
                    <Square size={10} fill="currentColor" />
                    {t('sidebar.tab.visual.pathAnimator.stopSequence')}
                  </>
                ) : (
                  <>
                    <Play size={10} fill="currentColor" />
                    {t('sidebar.tab.visual.pathAnimator.playSequence')}
                  </>
                )}
              </Button>
              <p className="text-[9px] text-muted-foreground text-center italic">
                {t('sidebar.tab.visual.pathAnimator.interpolationNote')}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return btn;
  };

  return (
    <ToolbarShell className={className}>
      {primary.map(renderButton)}
      <ToolbarDivider />
      {advanced.map(renderButton)}
    </ToolbarShell>
  );
}
