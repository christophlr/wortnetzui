import { MousePointer2, Hand, Paintbrush, View, Wand2, Route } from 'lucide-react';
import { ToolButton, ToolbarDivider, ToolbarShell } from './toolbar/ToolbarAtoms';
import { useT } from '../i18n/useT';
import { useWortnetz } from '../context/WortnetzContext';
import { Popover, PopoverContent, PopoverAnchor } from './ui/popover';
import { Slider } from './ui/slider';
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
    paintMode, setPaintMode,
    clearPaintedOverrides,
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
                    className={`text-[10px] font-medium py-1 px-1.5 rounded-md transition-colors ${
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
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-foreground">
                    {t('toolbar.brush.color')}
                  </span>
                </div>
                <ColorPicker value={paintColor} onValueChange={setPaintColor}>
                  <ColorPickerTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 rounded-md border border-wn-divider hover:bg-wn-control-bg w-full bg-wn-info-bg cursor-pointer">
                      <ColorPickerSwatch className="size-4 rounded-sm" />
                      <span className="text-[11px] font-mono text-muted-foreground">{paintColor}</span>
                    </button>
                  </ColorPickerTrigger>
                  <ColorPickerContent align="center" side="right" className="space-y-3 p-3 w-64 bg-popover border border-wn-divider rounded-xl">
                    <ColorPickerArea />
                    <ColorPickerHueSlider />
                  </ColorPickerContent>
                </ColorPicker>
              </div>
            )}

            {paintMode === 'scale' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-foreground">
                    {t('toolbar.brush.scale')}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {paintScale.toFixed(2)}x
                  </span>
                </div>
                <Slider
                  min={0.1}
                  max={3.0}
                  step={0.05}
                  value={[paintScale]}
                  onValueChange={([val]) => setPaintScale(val)}
                  className="py-1"
                />
              </div>
            )}

            {paintMode === 'opacity' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-foreground">
                    {t('toolbar.brush.opacity')}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {Math.round(paintOpacity * 100)}%
                  </span>
                </div>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={[paintOpacity]}
                  onValueChange={([val]) => setPaintOpacity(val)}
                  className="py-1"
                />
              </div>
            )}

            {/* Brush Radius Row */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-foreground">
                  {t('toolbar.brush.radius')}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {brushRadius}px
                </span>
              </div>
              <Slider
                min={10}
                max={300}
                step={5}
                value={[brushRadius]}
                onValueChange={([val]) => setBrushRadius(val)}
                className="py-1"
              />
            </div>

            {/* Clear paint actions */}
            <div className="pt-2 border-t border-wn-divider flex justify-end">
              <button
                type="button"
                onClick={clearPaintedOverrides}
                className="text-[10px] font-semibold py-1.5 px-3 rounded-md border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                {t('toolbar.brush.clearAll')}
              </button>
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
