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
import { useT } from '../../../i18n/useT';

const SHAPE_IDS: NodeShape[] = ['rectangle', 'rounded-rectangle', 'ellipse'];
const SHAPE_ICONS: Record<NodeShape, React.ComponentType<{ size?: number; className?: string }>> = {
  rectangle: Square,
  'rounded-rectangle': RectangleHorizontal,
  ellipse: Circle,
};

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
  const { t } = useT();
  const [isFxExpanded, setIsFxExpanded] = React.useState(false);

  const setVisual = (patch: Record<string, unknown>) =>
    onVisualSettingsChange?.({ ...visualSettings, ...patch });

  const shapeOptions = SHAPE_IDS.map((id) => ({
    id,
    icon: SHAPE_ICONS[id],
    label: t(`sidebar.tab.visual.shape.${id}`),
  }));

  return (
    <SidebarTabContent>
      <SidebarSection
        title={t('sidebar.tab.visual.section.nodes')}
        actions={
          <VisibilityToggle
            visible={visualSettings.nodesVisible}
            onToggle={() => setVisual({ nodesVisible: !visualSettings.nodesVisible })}
          />
        }
      >
        <SidebarGroup title={t('sidebar.tab.visual.group.shape')} stack="snug">
          <SidebarButtonGroupRow<NodeShape>
            value={styleSettings.nodeShape}
            onChange={(id) => onStyleChange({ nodeShape: id })}
            options={shapeOptions}
          />
        </SidebarGroup>

        <SidebarSliderRow
          label={t('sidebar.tab.visual.slider.baseScale')}
          value={styleSettings.nodeScale ?? 1}
          onCommit={(val) => onStyleChange({ nodeScale: val })}
          min={0}
          max={2.5}
          format={(v) => `${v.toFixed(1)}x`}
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
          label={t('sidebar.tab.visual.slider.radialBias')}
          value={visualSettings.radialBiasScale}
          onCommit={(val) => setVisual({ radialBiasScale: val })}
          min={0}
          max={1}
          slider={
            <SidebarSliderTrack
              value={[visualSettings.radialBiasScale * 100]}
              max={100}
              step={1}
              onValueChange={([val]) => setVisual({ radialBiasScale: val / 100 })}
            />
          }
          description={t('sidebar.tab.visual.description.radialBias')}
        />
      </SidebarSection>

      <SidebarSection
        title={t('sidebar.tab.visual.section.labels')}
        actions={
          <VisibilityToggle
            visible={visualSettings.labelsVisible}
            onToggle={() => setVisual({ labelsVisible: !visualSettings.labelsVisible })}
          />
        }
      >
        <SidebarSliderRow
          label={t('sidebar.tab.visual.slider.weightMapping')}
          value={visualSettings.labelWeightMapping}
          onCommit={(val) => setVisual({ labelWeightMapping: val })}
          min={0}
          max={1}
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
        title={t('sidebar.tab.visual.section.edges')}
        actions={
          <VisibilityToggle
            visible={visualSettings.edgesVisible}
            onToggle={() => setVisual({ edgesVisible: !visualSettings.edgesVisible })}
          />
        }
      >
        <SidebarToggleRow
          label={t('sidebar.tab.visual.toggle.flowAnimation')}
          tone="neutral"
          checked={visualSettings.edgeFlowAnimation}
          onCheckedChange={(checked) => setVisual({ edgeFlowAnimation: checked })}
        />

        <SidebarSliderRow
          label={t('sidebar.tab.visual.slider.globalOpacity')}
          value={(styleSettings.edgeOpacity ?? 0) * 100}
          onCommit={(val) => onStyleChange({ edgeOpacity: val / 100 })}
          min={0}
          max={100}
          format={(v) => `${Math.round(v)}%`}
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
        title={t('sidebar.tab.visual.section.environment')}
        actions={
          <>
            <button
              type="button"
              onClick={() => setVisual({ envAtmosphereSeed: Math.random() * 1000 })}
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
              title={t('sidebar.tab.visual.action.shuffleAtmosphere')}
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
        <SidebarGroup title={t('sidebar.tab.visual.group.atmosphereGradient')} stack="snug">
          <div className="grid gap-4 md:grid-cols-2">
            <SidebarColorRow
              label={t('sidebar.tab.visual.color.origin')}
              value={visualSettings.gradientOrigin}
              onChange={(value) => setVisual({ gradientOrigin: value })}
            />
            <SidebarColorRow
              label={t('sidebar.tab.visual.color.periphery')}
              value={visualSettings.gradientPeriphery}
              onChange={(value) => setVisual({ gradientPeriphery: value })}
            />
          </div>
        </SidebarGroup>
      </SidebarSection>

      <SidebarSection>
        <SidebarCollapsiblePanel
          title={t('sidebar.tab.visual.fx.title')}
          status={visualSettings.glitchActive ? t('sidebar.tab.visual.fx.active') : t('sidebar.tab.visual.fx.inactive')}
          expanded={isFxExpanded}
          forceOpen={visualSettings.glitchActive}
          onToggle={() => setIsFxExpanded((current) => !current)}
        >
          <SidebarToggleRow
            label={t('sidebar.tab.visual.toggle.glitchPaint')}
            tone="accent"
            checked={visualSettings.glitchActive}
            onCheckedChange={(checked) => setVisual({ glitchActive: checked })}
          />

          {visualSettings.glitchActive && (
            <>
              <SidebarSliderRow
                label={t('sidebar.tab.visual.slider.brushRadius')}
                value={visualSettings.glitchBrushRadius}
                onCommit={(val) => setVisual({ glitchBrushRadius: Math.round(val) })}
                min={0}
                max={500}
                format={(v) => `${Math.round(v)}px`}
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
                label={t('sidebar.tab.visual.slider.feather')}
                value={visualSettings.glitchFeather}
                onCommit={(val) => setVisual({ glitchFeather: val })}
                min={0}
                max={1}
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

      <SidebarSection title={t('sidebar.tab.visual.section.pathAnimator')}>
        <SidebarToggleRow
          label={t('sidebar.tab.visual.toggle.cameraFollow')}
          tone="accent"
          checked={visualSettings.pathCameraFollow}
          onCheckedChange={(checked) => setVisual({ pathCameraFollow: checked })}
        />

        <SidebarSliderRow
          label={t('sidebar.tab.visual.slider.smoothness')}
          value={visualSettings.pathSmoothness}
          onCommit={(val) => setVisual({ pathSmoothness: val })}
          min={0}
          max={1}
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
