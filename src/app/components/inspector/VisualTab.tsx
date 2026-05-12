import * as React from 'react';
import { Eye, EyeOff, Plus, Minus, Dices, Square, RectangleHorizontal, Circle } from 'lucide-react';
import type { NodeShape } from '../../networkTheme';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { cn } from '../ui/utils';

// Placeholder component for gradient color field
function GradientColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-semibold text-zinc-600">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded cursor-pointer"
      />
    </div>
  );
}

export function VisualTab({
  styleSettings,
  visualSettings,
  onStyleChange,
  onVisualSettingsChange,
}: {
  styleSettings: any;
  visualSettings: any;
  onStyleChange: (settings: any) => void;
  onVisualSettingsChange?: (settings: any) => void;
}) {
  const [isFxExpanded, setIsFxExpanded] = React.useState(false);

  return (
    <div className="divide-y divide-zinc-300/80 dark:divide-zinc-800">
      <section className="px-5 py-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">Knoten</span>
          <button
            className={cn(
              "ml-auto p-0 transition-colors",
              visualSettings.nodesVisible ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, nodesVisible: !visualSettings.nodesVisible })}
          >
            {visualSettings.nodesVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>

        <div className="space-y-3.5 pl-5">
          <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100">Form</span>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-300 dark:border-zinc-700">
            {[
              { id: 'rectangle', icon: Square, label: 'Rect' },
              { id: 'rounded-rectangle', icon: RectangleHorizontal, label: 'Rounded' },
              { id: 'ellipse', icon: Circle, label: 'Ellipse' },
            ].map((shape) => (
              <button
                key={shape.id}
                onClick={() => onStyleChange({ nodeShape: shape.id as NodeShape })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md transition-all text-[9px] font-medium",
                  styleSettings.nodeShape === shape.id
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                )}
                title={shape.label}
              >
                <shape.icon size={12} />
                <span>{shape.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pl-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Basis-Skalierung</span>
            <span className="font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded">
              {(styleSettings.nodeScale ?? 1).toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[(styleSettings.nodeScale ?? 1) * 100]}
            max={250}
            step={5}
            onValueChange={([val]) => onStyleChange({ nodeScale: val / 100 })}
            className="py-2"
          />
        </div>

        <div className="space-y-3 pl-5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Radialer Bias</span>
            <span className="font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded">
              {visualSettings.radialBiasScale.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[visualSettings.radialBiasScale * 100]}
            max={100}
            step={1}
            onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, radialBiasScale: val / 100 })}
            className="py-2"
          />
          <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">Scale = Basis + (Bias × Dist)</p>
        </div>
      </section>

      <section className="px-5 py-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">Beschriftung</span>
          <button
            className={cn(
              "ml-auto p-0 transition-colors",
              visualSettings.labelsVisible ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, labelsVisible: !visualSettings.labelsVisible })}
          >
            {visualSettings.labelsVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>

        <div className="space-y-3 pl-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Weight-Mapping</span>
            <span className="font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded">
              {visualSettings.labelWeightMapping.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[visualSettings.labelWeightMapping * 100]}
            max={100}
            step={1}
            onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, labelWeightMapping: val / 100 })}
            className="py-2"
          />
        </div>
      </section>

      <section className="px-5 py-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">Verbindungen</span>
          <button
            className={cn(
              "ml-auto p-0 transition-colors",
              visualSettings.edgesVisible ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, edgesVisible: !visualSettings.edgesVisible })}
          >
            {visualSettings.edgesVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>

        <div className="flex items-center justify-between pl-5">
          <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Flow Animation</span>
          <Switch
            checked={visualSettings.edgeFlowAnimation}
            onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, edgeFlowAnimation: checked })}
            className="scale-90 data-[state=checked]:bg-zinc-900"
          />
        </div>

        <div className="space-y-3 pl-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Global Opacity</span>
            <span className="font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded">
              {Math.round(styleSettings.edgeOpacity * 100)}%
            </span>
          </div>
          <Slider
            value={[styleSettings.edgeOpacity * 100]}
            max={100}
            step={1}
            onValueChange={([val]) => onStyleChange({ edgeOpacity: val / 100 })}
            className="py-2"
          />
        </div>
      </section>

      <section className="px-5 py-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">Umgebung</span>
          <button
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, envAtmosphereSeed: Math.random() * 1000 })}
            className="ml-auto p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
            title="Shuffle Atmosphere"
          >
            <Dices size={13} />
          </button>
          <button
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, envVisible: !visualSettings.envVisible })}
            className={cn(
              "p-0 transition-colors",
              visualSettings.envVisible
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
          >
            {visualSettings.envVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>

        <div className="space-y-3.5 pl-5">
          <span className="text-zinc-700 dark:text-zinc-300 text-[11px] font-semibold tracking-[0.03em]">Atmosphäre-Gradient</span>
          <div className="grid gap-4 md:grid-cols-2">
            <GradientColorField
              label="Origin"
              value={visualSettings.gradientOrigin}
              onChange={(value) => onVisualSettingsChange?.({ ...visualSettings, gradientOrigin: value })}
            />
            <GradientColorField
              label="Periphery"
              value={visualSettings.gradientPeriphery}
              onChange={(value) => onVisualSettingsChange?.({ ...visualSettings, gradientPeriphery: value })}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-5 space-y-5">
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
          onClick={() => setIsFxExpanded((current) => !current)}
        >
          <span className="text-zinc-800 dark:text-zinc-200 text-[12px] font-semibold tracking-[0.03em]">Fx</span>
          <span className="text-[10px] text-zinc-500">{visualSettings.glitchActive ? 'Aktiv' : 'Keine Effekte'}</span>
          <span className="ml-auto text-zinc-500">{isFxExpanded || visualSettings.glitchActive ? <Minus size={13} /> : <Plus size={13} />}</span>
        </button>

        {(isFxExpanded || visualSettings.glitchActive) && (
          <div className="space-y-4 rounded-lg border border-zinc-300/80 bg-zinc-50/85 p-3.5 dark:border-zinc-700 dark:bg-zinc-900/20">
            <div className="flex items-center justify-between pl-2">
              <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Glitch Paint</span>
              <Switch
                className="scale-90 data-[state=checked]:bg-indigo-600"
                checked={visualSettings.glitchActive}
                onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, glitchActive: checked })}
              />
            </div>

            {visualSettings.glitchActive && (
              <>
                <div className="space-y-3 pl-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Brush Radius</span>
                    <span className="font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded">
                      {visualSettings.glitchBrushRadius}px
                    </span>
                  </div>
                  <Slider
                    value={[visualSettings.glitchBrushRadius]}
                    max={500}
                    step={5}
                    onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, glitchBrushRadius: val })}
                    className="py-2"
                  />
                </div>

                <div className="space-y-3 pl-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Feather</span>
                    <span className="font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded">
                      {visualSettings.glitchFeather.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[visualSettings.glitchFeather * 100]}
                    max={100}
                    step={1}
                    onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, glitchFeather: val / 100 })}
                    className="py-2"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <section className="px-5 py-5 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-[0.08em] text-[11px]">Path Animator</span>
        </div>

        <div className="flex items-center justify-between pl-5">
          <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Camera Follow</span>
          <Switch
            checked={visualSettings.pathCameraFollow}
            onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, pathCameraFollow: checked })}
            className="scale-90 data-[state=checked]:bg-emerald-600"
          />
        </div>

        <div className="space-y-3 pl-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Smoothness</span>
            <span className="font-mono text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 rounded">
              {visualSettings.pathSmoothness.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[visualSettings.pathSmoothness * 100]}
            max={100}
            step={1}
            onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, pathSmoothness: val / 100 })}
            className="py-2"
          />
        </div>
      </section>
    </div>
  );
}
