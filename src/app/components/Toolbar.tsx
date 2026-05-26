import { MousePointer2, Hand, Paintbrush, View, Wand2, Route, Play, Square, Trash2, GripVertical } from 'lucide-react';
import { ToolButton, ToolbarDivider, ToolbarShell } from './toolbar/ToolbarAtoms';
import { useT } from '../i18n/useT';
import { useWortnetz } from '../context/WortnetzContext';
import { Popover, PopoverContent, PopoverAnchor } from './ui/popover';
import { Scrubber } from './ui/scrubber';
import { Button } from './ui/button';
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerHueSlider,
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

const PRESET_SWATCHES = [
  '#4f46e5', // Indigo
  '#7c3aed', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#eab308', // Yellow
  '#f97316', // Orange
  '#f43f5e', // Rose
  '#ffffff', // White
  '#09090b', // Charcoal
];

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
    pathNodes, isPathPlaying, setIsPathPlaying, removePathNode, clearPath
  } = useWortnetz();

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
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t('toolbar.brush.mode')}
              </h4>
              <div className="grid grid-cols-4 gap-1 bg-wn-control-bg p-0.5 rounded-lg border border-wn-divider">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaintMode(m.id)}
                    className={`text-[10px] font-medium py-1 px-1.5 rounded-md transition-colors cursor-pointer ${
                      paintMode === m.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-wn-control-bg/60'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Value Row based on Paint Mode */}
            {paintMode === 'color' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-foreground">
                      {t('toolbar.brush.color')}
                    </span>
                  </div>
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
                      {/* Swatches preset grid */}
                      <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-wn-divider">
                        {PRESET_SWATCHES.map((swatch) => (
                          <button
                            key={swatch}
                            type="button"
                            onClick={() => setPaintColor(swatch)}
                            className="size-5 rounded-full border border-black/10 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            style={{ backgroundColor: swatch }}
                          />
                        ))}
                      </div>
                    </ColorPickerContent>
                  </ColorPicker>
                </div>

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

            {/* Clear paint actions */}
            <div className="pt-2 border-t border-wn-divider">
              <Button
                variant="outline"
                onClick={clearPaintedOverrides}
                className="w-full h-7 text-[10px] bg-card border-border hover:bg-wn-control-hover hover:text-foreground font-medium"
              >
                {t('toolbar.brush.clearAll')}
              </Button>
            </div>
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
            <div className="p-3 border-b border-wn-divider bg-wn-control-bg/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route size={14} className="text-wn-accent" />
                <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  {t('sidebar.tab.visual.section.pathAnimator')}
                </h3>
              </div>
              {pathNodes.length > 0 && (
                <button
                  type="button"
                  onClick={clearPath}
                  className="text-[9px] font-semibold text-destructive hover:underline cursor-pointer"
                >
                  {t('toolbar.brush.clearAll')}
                </button>
              )}
            </div>

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
                  <div
                    key={`${node.id}-${index}`}
                    className="group flex items-center gap-2 p-1.5 bg-wn-control-bg border border-wn-divider rounded-lg hover:border-wn-accent/50 transition-all shadow-sm"
                  >
                    <div className="text-muted-foreground/40">
                      <GripVertical size={11} />
                    </div>
                    <div className="size-4 rounded-full bg-wn-accent/10 border border-wn-accent/20 flex items-center justify-center text-[8px] font-bold text-wn-accent shrink-0">
                      {index + 1}
                    </div>
                    <span className="flex-1 text-[10px] font-medium text-foreground truncate">{node.label}</span>
                    <button
                      type="button"
                      onClick={() => removePathNode(index)}
                      className="p-0.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Playback action block */}
            <div className="p-3 bg-wn-control-bg/40 border-t border-wn-divider space-y-2">
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
