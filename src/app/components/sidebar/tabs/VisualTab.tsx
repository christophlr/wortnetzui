import * as React from 'react';
import { Circle, Dices, RectangleHorizontal, Square } from 'lucide-react';
import type { NodeShape } from '../../../networkTheme';
import {
  SidebarButtonGroupRow,
  SidebarCollapsiblePanel,
  SidebarColorRow,
  SidebarGroup,
  SidebarSection,
  SidebarSectionActionButton,
  SidebarScrubberRow,
  SidebarTabContent,
  SidebarToggleRow,
  SidebarVisibilityToggle,
} from '../SidebarAtoms';
import { useT } from '../../../i18n/useT';

function hslToHex(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const SHAPE_IDS: NodeShape[] = ['rectangle', 'rounded-rectangle', 'ellipse'];
const SHAPE_ICONS: Record<NodeShape, React.ComponentType<{ size?: number; className?: string }>> = {
  rectangle: Square,
  'rounded-rectangle': RectangleHorizontal,
  ellipse: Circle,
};

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

  const randomizeGradient = () => {
    const hue = Math.random() * 360;
    const complement = (hue + 120 + Math.random() * 120) % 360;
    setVisual({
      gradientOrigin: hslToHex(hue, 0.65, 0.55),
      gradientPeriphery: hslToHex(complement, 0.55, 0.55),
    });
  };

  return (
    <SidebarTabContent>
      <SidebarSection
        title={t('sidebar.tab.visual.section.nodes')}
        actions={
          <SidebarVisibilityToggle
            visible={visualSettings.nodesVisible}
            onToggle={() => setVisual({ nodesVisible: !visualSettings.nodesVisible })}
          />
        }
      >
        <SidebarGroup
          title={t('sidebar.tab.visual.group.atmosphereGradient')}
          stack="snug"
          actions={
            <SidebarSectionActionButton
              icon={Dices}
              title={t('sidebar.tab.visual.action.randomizeGradient')}
              onClick={randomizeGradient}
            />
          }
        >
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

        <SidebarGroup title={t('sidebar.tab.visual.group.shape')} stack="snug">
          <SidebarButtonGroupRow<NodeShape>
            value={styleSettings.nodeShape}
            onChange={(id) => onStyleChange({ nodeShape: id })}
            options={shapeOptions}
          />
        </SidebarGroup>

        <SidebarScrubberRow
          label={t('sidebar.tab.visual.slider.baseScale')}
          value={styleSettings.nodeScale ?? 1}
          min={0}
          max={2.5}
          step={0.05}
          format={(v) => `${v.toFixed(1)}x`}
          onValueChange={(val) => onStyleChange({ nodeScale: val })}
          onCommit={(val) => onStyleChange({ nodeScale: val })}
        />

        <SidebarScrubberRow
          label={t('sidebar.tab.visual.slider.radialBias')}
          value={visualSettings.radialBiasScale}
          min={-1}
          max={1}
          step={0.01}
          onValueChange={(val) => setVisual({ radialBiasScale: val })}
          onCommit={(val) => setVisual({ radialBiasScale: val })}
          description={t('sidebar.tab.visual.description.radialBias')}
        />
      </SidebarSection>

<SidebarSection
        title={t('sidebar.tab.visual.section.edges')}
        actions={
          <SidebarVisibilityToggle
            visible={visualSettings.edgesVisible}
            onToggle={() => setVisual({ edgesVisible: !visualSettings.edgesVisible })}
          />
        }
      >
        <SidebarScrubberRow
          label={t('sidebar.tab.visual.slider.globalOpacity')}
          value={Math.round((styleSettings.edgeOpacity ?? 0) * 100)}
          min={0}
          max={100}
          step={1}
          format={(v) => `${Math.round(v)}%`}
          onValueChange={(val) => onStyleChange({ edgeOpacity: val / 100 })}
          onCommit={(val) => onStyleChange({ edgeOpacity: val / 100 })}
        />
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
            checked={visualSettings.glitchActive}
            onCheckedChange={(checked) => setVisual({ glitchActive: checked })}
          />

          {visualSettings.glitchActive && (
            <>
              <SidebarScrubberRow
                label={t('sidebar.tab.visual.slider.brushRadius')}
                value={visualSettings.glitchBrushRadius}
                min={0}
                max={500}
                step={5}
                format={(v) => `${Math.round(v)}px`}
                onValueChange={(val) => setVisual({ glitchBrushRadius: Math.round(val) })}
                onCommit={(val) => setVisual({ glitchBrushRadius: Math.round(val) })}
              />
              <SidebarScrubberRow
                label={t('sidebar.tab.visual.slider.feather')}
                value={visualSettings.glitchFeather}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(val) => setVisual({ glitchFeather: val })}
                onCommit={(val) => setVisual({ glitchFeather: val })}
              />
            </>
          )}
        </SidebarCollapsiblePanel>
      </SidebarSection>

      <SidebarSection title={t('sidebar.tab.visual.section.pathAnimator')}>
        <SidebarToggleRow
          label={t('sidebar.tab.visual.toggle.cameraFollow')}
          checked={visualSettings.pathCameraFollow}
          onCheckedChange={(checked) => setVisual({ pathCameraFollow: checked })}
        />

        <SidebarScrubberRow
          label={t('sidebar.tab.visual.slider.smoothness')}
          value={visualSettings.pathSmoothness}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(val) => setVisual({ pathSmoothness: val })}
          onCommit={(val) => setVisual({ pathSmoothness: val })}
        />
      </SidebarSection>
    </SidebarTabContent>
  );
}
