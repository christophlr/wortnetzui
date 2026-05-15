import * as React from 'react';
import { Circle, Dices, Eye, EyeOff, RectangleHorizontal, Square } from 'lucide-react';
import type { NodeShape } from '../../../networkTheme';
import { cn } from '../../ui/utils';
import {
  SidebarButtonGroupRow,
  SidebarCollapsiblePanel,
  SidebarColorRow,
  SidebarGroup,
  SidebarSection,
  SidebarSliderRow,
  SidebarSliderTrack,
  SidebarTabContent,
  SidebarToggleRow,
} from '../SidebarAtoms';

const SHAPE_OPTIONS: Array<{
  id: NodeShape;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: 'rectangle', icon: Square, label: 'Rect' },
  { id: 'rounded-rectangle', icon: RectangleHorizontal, label: 'Rounded' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse' },
];

function VisibilityToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'p-0 transition-colors',
        visible
          ? 'text-zinc-900 dark:text-zinc-100'
          : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300',
      )}
    >
      {visible ? <Eye size={13} /> : <EyeOff size={13} />}
    </button>
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

  const setVisual = (patch: Record<string, unknown>) =>
    onVisualSettingsChange?.({ ...visualSettings, ...patch });

  return (
    <SidebarTabContent>
      <SidebarSection
        title="Knoten"
        actions={
          <VisibilityToggle
            visible={visualSettings.nodesVisible}
            onToggle={() => setVisual({ nodesVisible: !visualSettings.nodesVisible })}
          />
        }
      >
        <SidebarGroup title="Form" className="space-y-3.5">
          <SidebarButtonGroupRow<NodeShape>
            value={styleSettings.nodeShape}
            onChange={(id) => onStyleChange({ nodeShape: id })}
            options={SHAPE_OPTIONS}
          />
        </SidebarGroup>

        <SidebarSliderRow
          label="Basis-Skalierung"
          value={`${(styleSettings.nodeScale ?? 1).toFixed(1)}x`}
          slider={
            <SidebarSliderTrack
              value={[(styleSettings.nodeScale ?? 1) * 100]}
              max={250}
              step={5}
              onValueChange={([val]) => onStyleChange({ nodeScale: val / 100 })}
            />
          }
        />

        <SidebarSliderRow
          label="Radialer Bias"
          value={visualSettings.radialBiasScale.toFixed(2)}
          slider={
            <SidebarSliderTrack
              value={[visualSettings.radialBiasScale * 100]}
              max={100}
              step={1}
              onValueChange={([val]) => setVisual({ radialBiasScale: val / 100 })}
            />
          }
          description="Scale = Basis + (Bias × Dist)"
        />
      </SidebarSection>

      <SidebarSection
        title="Beschriftung"
        actions={
          <VisibilityToggle
            visible={visualSettings.labelsVisible}
            onToggle={() => setVisual({ labelsVisible: !visualSettings.labelsVisible })}
          />
        }
      >
        <SidebarSliderRow
          label="Weight-Mapping"
          value={visualSettings.labelWeightMapping.toFixed(2)}
          slider={
            <SidebarSliderTrack
              value={[visualSettings.labelWeightMapping * 100]}
              max={100}
              step={1}
              onValueChange={([val]) => setVisual({ labelWeightMapping: val / 100 })}
            />
          }
        />
      </SidebarSection>

      <SidebarSection
        title="Verbindungen"
        actions={
          <VisibilityToggle
            visible={visualSettings.edgesVisible}
            onToggle={() => setVisual({ edgesVisible: !visualSettings.edgesVisible })}
          />
        }
      >
        <SidebarToggleRow
          label="Flow Animation"
          tone="neutral"
          checked={visualSettings.edgeFlowAnimation}
          onCheckedChange={(checked) => setVisual({ edgeFlowAnimation: checked })}
        />

        <SidebarSliderRow
          label="Global Opacity"
          value={`${Math.round((styleSettings.edgeOpacity ?? 0) * 100)}%`}
          slider={
            <SidebarSliderTrack
              value={[(styleSettings.edgeOpacity ?? 0) * 100]}
              max={100}
              step={1}
              onValueChange={([val]) => onStyleChange({ edgeOpacity: val / 100 })}
            />
          }
        />
      </SidebarSection>

      <SidebarSection
        title="Umgebung"
        actions={
          <>
            <button
              type="button"
              onClick={() => setVisual({ envAtmosphereSeed: Math.random() * 1000 })}
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
              title="Shuffle Atmosphere"
            >
              <Dices size={13} />
            </button>
            <VisibilityToggle
              visible={visualSettings.envVisible}
              onToggle={() => setVisual({ envVisible: !visualSettings.envVisible })}
            />
          </>
        }
      >
        <SidebarGroup title="Atmosphäre-Gradient" className="space-y-3.5">
          <div className="grid gap-4 md:grid-cols-2">
            <SidebarColorRow
              label="Origin"
              value={visualSettings.gradientOrigin}
              onChange={(value) => setVisual({ gradientOrigin: value })}
            />
            <SidebarColorRow
              label="Periphery"
              value={visualSettings.gradientPeriphery}
              onChange={(value) => setVisual({ gradientPeriphery: value })}
            />
          </div>
        </SidebarGroup>
      </SidebarSection>

      <SidebarSection>
        <SidebarCollapsiblePanel
          title="Fx"
          status={visualSettings.glitchActive ? 'Aktiv' : 'Keine Effekte'}
          expanded={isFxExpanded}
          forceOpen={visualSettings.glitchActive}
          onToggle={() => setIsFxExpanded((current) => !current)}
        >
          <SidebarToggleRow
            label="Glitch Paint"
            tone="accent"
            checked={visualSettings.glitchActive}
            onCheckedChange={(checked) => setVisual({ glitchActive: checked })}
          />

          {visualSettings.glitchActive && (
            <>
              <SidebarSliderRow
                label="Brush Radius"
                value={`${visualSettings.glitchBrushRadius}px`}
                slider={
                  <SidebarSliderTrack
                    value={[visualSettings.glitchBrushRadius]}
                    max={500}
                    step={5}
                    onValueChange={([val]) => setVisual({ glitchBrushRadius: val })}
                  />
                }
              />
              <SidebarSliderRow
                label="Feather"
                value={visualSettings.glitchFeather.toFixed(2)}
                slider={
                  <SidebarSliderTrack
                    value={[visualSettings.glitchFeather * 100]}
                    max={100}
                    step={1}
                    onValueChange={([val]) => setVisual({ glitchFeather: val / 100 })}
                  />
                }
              />
            </>
          )}
        </SidebarCollapsiblePanel>
      </SidebarSection>

      <SidebarSection title="Path Animator">
        <SidebarToggleRow
          label="Camera Follow"
          tone="accent"
          checked={visualSettings.pathCameraFollow}
          onCheckedChange={(checked) => setVisual({ pathCameraFollow: checked })}
        />

        <SidebarSliderRow
          label="Smoothness"
          value={visualSettings.pathSmoothness.toFixed(2)}
          slider={
            <SidebarSliderTrack
              value={[visualSettings.pathSmoothness * 100]}
              max={100}
              step={1}
              onValueChange={([val]) => setVisual({ pathSmoothness: val / 100 })}
            />
          }
        />
      </SidebarSection>
    </SidebarTabContent>
  );
}
