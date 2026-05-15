import * as React from 'react';
import { Eye, EyeOff, Plus, Minus, Dices, Square, RectangleHorizontal, Circle } from 'lucide-react';
import type { NodeShape } from '../../../networkTheme';
import { Switch } from '../../ui/switch';
import { cn } from '../../ui/utils';
import {
  InspectorControlLabel,
  InspectorPanelSection,
  InspectorSectionHeader,
  InspectorSliderControl,
  InspectorSliderTrack,
  InspectorSubgroup,
  InspectorSubgroupTitle,
} from '../../inspector/InspectorAtoms';

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
      <InspectorPanelSection>
        <InspectorSectionHeader
          title="Knoten"
          actions={
          <button
            className={cn(
              "ml-auto p-0 transition-colors",
              visualSettings.nodesVisible ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, nodesVisible: !visualSettings.nodesVisible })}
          >
            {visualSettings.nodesVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
          }
        />

        <InspectorSubgroup className="space-y-3.5">
          <InspectorSubgroupTitle>Form</InspectorSubgroupTitle>
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
        </InspectorSubgroup>

        <InspectorSubgroup>
          <InspectorSliderControl
            label="Basis-Skalierung"
            value={`${(styleSettings.nodeScale ?? 1).toFixed(1)}x`}
            slider={
              <InspectorSliderTrack
                value={[(styleSettings.nodeScale ?? 1) * 100]}
                max={250}
                step={5}
                onValueChange={([val]) => onStyleChange({ nodeScale: val / 100 })}
              />
            }
          />
        </InspectorSubgroup>

        <InspectorSubgroup className="pt-1">
          <InspectorSliderControl
            label="Radialer Bias"
            value={visualSettings.radialBiasScale.toFixed(2)}
            slider={
              <InspectorSliderTrack
                value={[visualSettings.radialBiasScale * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, radialBiasScale: val / 100 })}
              />
            }
            description="Scale = Basis + (Bias × Dist)"
          />
        </InspectorSubgroup>
      </InspectorPanelSection>

      <InspectorPanelSection>
        <InspectorSectionHeader
          title="Beschriftung"
          actions={
          <button
            className={cn(
              "ml-auto p-0 transition-colors",
              visualSettings.labelsVisible ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, labelsVisible: !visualSettings.labelsVisible })}
          >
            {visualSettings.labelsVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
          }
        />

        <InspectorSubgroup>
          <InspectorSliderControl
            label="Weight-Mapping"
            value={visualSettings.labelWeightMapping.toFixed(2)}
            slider={
              <InspectorSliderTrack
                value={[visualSettings.labelWeightMapping * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, labelWeightMapping: val / 100 })}
              />
            }
          />
        </InspectorSubgroup>
      </InspectorPanelSection>

      <InspectorPanelSection>
        <InspectorSectionHeader
          title="Verbindungen"
          actions={
          <button
            className={cn(
              "ml-auto p-0 transition-colors",
              visualSettings.edgesVisible ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
            onClick={() => onVisualSettingsChange?.({ ...visualSettings, edgesVisible: !visualSettings.edgesVisible })}
          >
            {visualSettings.edgesVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
          }
        />

        <InspectorSubgroup>
          <div className="flex items-center justify-between">
            <InspectorControlLabel>Flow Animation</InspectorControlLabel>
            <Switch
              checked={visualSettings.edgeFlowAnimation}
              onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, edgeFlowAnimation: checked })}
              className="scale-90 data-[state=checked]:bg-zinc-900"
            />
          </div>
        </InspectorSubgroup>

        <InspectorSubgroup>
          <InspectorSliderControl
            label="Global Opacity"
            value={`${Math.round(((styleSettings.edgeOpacity ?? 0) * 100))}%`}
            slider={
              <InspectorSliderTrack
                value={[(styleSettings.edgeOpacity ?? 0) * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => onStyleChange({ edgeOpacity: val / 100 })}
              />
            }
          />
        </InspectorSubgroup>
      </InspectorPanelSection>

      <InspectorPanelSection>
        <InspectorSectionHeader
          title="Umgebung"
          actions={
          <>
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
          </>
          }
        />

        <InspectorSubgroup className="space-y-3.5">
          <InspectorSubgroupTitle className="text-zinc-700 dark:text-zinc-300 text-[11px]">Atmosphäre-Gradient</InspectorSubgroupTitle>
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
        </InspectorSubgroup>
      </InspectorPanelSection>

      <InspectorPanelSection>
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
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Glitch Paint</span>
              <Switch
                className="scale-90 data-[state=checked]:bg-indigo-600"
                checked={visualSettings.glitchActive}
                onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, glitchActive: checked })}
              />
            </div>

            {visualSettings.glitchActive && (
              <>
                <InspectorSubgroup>
                  <InspectorSliderControl
                    label="Brush Radius"
                    value={`${visualSettings.glitchBrushRadius}px`}
                    slider={
                      <InspectorSliderTrack
                        value={[visualSettings.glitchBrushRadius]}
                        max={500}
                        step={5}
                        onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, glitchBrushRadius: val })}
                      />
                    }
                  />
                </InspectorSubgroup>

                <InspectorSubgroup>
                  <InspectorSliderControl
                    label="Feather"
                    value={visualSettings.glitchFeather.toFixed(2)}
                    slider={
                      <InspectorSliderTrack
                        value={[visualSettings.glitchFeather * 100]}
                        max={100}
                        step={1}
                        onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, glitchFeather: val / 100 })}
                      />
                    }
                  />
                </InspectorSubgroup>
              </>
            )}
          </div>
        )}
      </InspectorPanelSection>

      <InspectorPanelSection>
        <InspectorSectionHeader title="Path Animator" />

        <InspectorSubgroup>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200">Camera Follow</span>
            <Switch
              checked={visualSettings.pathCameraFollow}
              onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, pathCameraFollow: checked })}
              className="scale-90 data-[state=checked]:bg-emerald-600"
            />
          </div>
        </InspectorSubgroup>

        <InspectorSubgroup>
          <InspectorSliderControl
            label="Smoothness"
            value={visualSettings.pathSmoothness.toFixed(2)}
            slider={
              <InspectorSliderTrack
                value={[visualSettings.pathSmoothness * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, pathSmoothness: val / 100 })}
              />
            }
          />
        </InspectorSubgroup>
      </InspectorPanelSection>
    </div>
  );
}
