import * as React from 'react';
import { Circle, Dices, RectangleHorizontal, Square, Plus, Minus, Eye, EyeOff, SlidersHorizontal, Paintbrush, Triangle, Hexagon, Octagon, Star } from 'lucide-react';
import { useWortnetz } from '../../../context/WortnetzContext';
import { DEFAULT_STAR_SHAPE, normalizeNodeShape, type NodeShape, type NodeShapeKind } from '../../../networkTheme';
import {
  SidebarCenteredPicker,
  SidebarColorRow,
  SidebarGroup,
  SidebarSection,
  SidebarSectionActionButton,
  SidebarScrubberRow,
  SidebarTabContent,
  SidebarToggleRow,
  SidebarVisibilityToggle,
  SidebarKeyframeToggle,
  SidebarModulatorButton,
  SidebarReorderRow,
} from '../SidebarAtoms';
import { useT } from '../../../i18n/useT';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '../../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

import { LfoControlsBody, depthMaxFor } from '../../timeline/LfoControls';
import type { TrackMeta } from '../../../animation/Track';
import type { Modulator } from '../../../animation/Modulator';
import { DEFAULT_MODULATOR } from '../../../animation/Modulator';

function hslToHex(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

type EffectType = 'bloom' | 'glitch' | 'vignette' | 'chromatic-aberration' | 'film-grain' | 'pixelate';

const EFFECT_TYPES: EffectType[] = ['bloom', 'glitch', 'vignette', 'chromatic-aberration', 'film-grain', 'pixelate'];
const SHAPE_KINDS: NodeShapeKind[] = ['rectangle', 'rounded-rectangle', 'ellipse', 'triangle', 'hexagon', 'octagon', 'star'];
const SHAPE_ICONS: Record<NodeShapeKind, React.ComponentType<{ size?: number; className?: string }>> = {
  rectangle: Square,
  'rounded-rectangle': RectangleHorizontal,
  ellipse: Circle,
  triangle: Triangle,
  hexagon: Hexagon,
  octagon: Octagon,
  star: Star,
};

/* ── Reusable slider with optional keyframe diamond + modulator popover ── */

function TrackScrubber({
  label,
  trackId,
  paramKey,
  value,
  min, max, step,
  format,
  onChange,
  onCommit,
  currentTime,
  physicsKeyframes,
  onTogglePhysicsKeyframe,
  trackMeta,
  onSetTrackModulator,
  onSetTrackGlide,
  description,
  t,
}: {
  label: string;
  trackId: string;
  paramKey: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  onCommit: (v: number) => void;
  currentTime?: number;
  physicsKeyframes?: Record<string, any[]>;
  onTogglePhysicsKeyframe?: (trackId: string, value: number) => void;
  trackMeta?: Record<string, TrackMeta>;
  onSetTrackModulator?: (trackId: string, modulator: Modulator | null) => void;
  onSetTrackGlide?: (trackId: string, seconds: number) => void;
  description?: string;
  t: (key: string) => string;
}) {
  const kfs = physicsKeyframes?.[trackId] ?? [];
  const kfActive = currentTime !== undefined && kfs.some(kf => Math.abs(kf.time - currentTime) < 0.1);
  const mod = trackMeta?.[trackId]?.modulator ?? null;
  const glide = trackMeta?.[trackId]?.glide ?? 0;
  const isModActive = mod !== null || glide > 0;

  const handleModToggle = () => {
    if (!isModActive) {
      const maxD = depthMaxFor(paramKey);
      onSetTrackModulator?.(trackId, { ...DEFAULT_MODULATOR, depth: maxD * 0.2 });
      onSetTrackGlide?.(trackId, 0);
    }
  };

  const hasModControls = trackMeta && onSetTrackModulator && onSetTrackGlide;
  const hasKfControls = onTogglePhysicsKeyframe;

  return (
    <Popover>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <SidebarScrubberRow
            label={label}
            value={value}
            min={min}
            max={max}
            step={step}
            format={format}
            onValueChange={onChange}
            onCommit={onCommit}
            description={description}
            accessory={
              <>
                {hasModControls ? (
                  <PopoverTrigger asChild>
                    <SidebarModulatorButton
                      active={isModActive}
                      title={t('timeline.track.tuning')}
                      onClick={handleModToggle}
                    />
                  </PopoverTrigger>
                ) : null}
                {hasKfControls ? (
                  <SidebarKeyframeToggle
                    active={kfActive}
                    onClick={() => onTogglePhysicsKeyframe(trackId, value)}
                  />
                ) : null}
              </>
            }
          />
        </div>
      </PopoverAnchor>
      {hasModControls && (
        <PopoverContent side="left" align="start" sideOffset={0} className="bg-popover/95 backdrop-blur-sm p-3 w-64 space-y-3 z-50">
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-foreground border-b border-wn-divider pb-1">
              {t('timeline.track.tuning')}
            </div>
            <div className="space-y-4">
              <SidebarToggleRow
                label={t('timeline.lfo.enable')}
                checked={isModActive}
                onCheckedChange={(checked) => {
                  if (checked) {
                    const maxD = depthMaxFor(paramKey);
                    onSetTrackModulator?.(trackId, { ...DEFAULT_MODULATOR, depth: maxD * 0.2 });
                  } else {
                    onSetTrackModulator?.(trackId, null);
                    onSetTrackGlide?.(trackId, 0);
                  }
                }}
              />
              {isModActive && (
                <>
                  <SidebarScrubberRow
                    label={t('timeline.glide.label')}
                    value={glide}
                    min={0}
                    max={5}
                    step={0.05}
                    format={(v) => `${v.toFixed(2)} ${t('timeline.glide.unit')}`}
                    onValueChange={(v) => onSetTrackGlide!(trackId, v)}
                    onCommit={(v) => onSetTrackGlide!(trackId, Math.max(0, v))}
                    description={t('timeline.glide.description')}
                  />
                  <LfoControlsBody
                    paramKey={paramKey}
                    trackId={trackId}
                    value={mod}
                    onChange={(m) => onSetTrackModulator!(trackId, m)}
                  />
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

export function VisualTab({
  styleSettings,
  visualSettings,
  onStyleChange,
  onVisualSettingsChange,
  currentTime,
  physicsKeyframes,
  onTogglePhysicsKeyframe,
  trackMeta,
  onSetTrackModulator,
  onSetTrackGlide,
  isDark = true,
}: {
  styleSettings: any;
  visualSettings: any;
  onStyleChange: (settings: any) => void;
  onVisualSettingsChange?: (settings: any) => void;
  currentTime?: number;
  physicsKeyframes?: Record<string, any[]>;
  onTogglePhysicsKeyframe?: (trackId: string, value: number) => void;
  trackMeta?: Record<string, TrackMeta>;
  onSetTrackModulator?: (trackId: string, modulator: Modulator | null) => void;
  onSetTrackGlide?: (trackId: string, seconds: number) => void;
  isDark?: boolean;
}) {
  const { t } = useT();
  const { paintedOverrides, clearPaintedOverrides } = useWortnetz();

  const setVisual = (patch: Record<string, unknown>) =>
    onVisualSettingsChange?.({ ...visualSettings, ...patch });

  const [lastColor, setLastColor] = React.useState(
    visualSettings.backgroundColor || (isDark ? '#09090b' : '#f8fafc')
  );

  const handleColorChange = (value: string) => {
    setLastColor(value);
    setVisual({ backgroundColor: value });
  };

  const handleToggleBackground = () => {
    if (visualSettings.backgroundColor) {
      setVisual({ backgroundColor: '' });
    } else {
      setVisual({ backgroundColor: lastColor });
    }
  };

  // Shared props for TrackScrubber wiring
  const trackProps = {
    currentTime,
    physicsKeyframes,
    onTogglePhysicsKeyframe,
    trackMeta,
    onSetTrackModulator,
    onSetTrackGlide,
    t,
  };

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const clampInt = (value: number, min: number, max: number) => Math.round(clamp(value, min, max));
  const currentShape = React.useMemo(
    () => normalizeNodeShape(styleSettings.nodeShape),
    [styleSettings.nodeShape],
  );
  const shapeKind = currentShape.kind;
  const lastStarRef = React.useRef<NodeShape>(DEFAULT_STAR_SHAPE);

  React.useEffect(() => {
    if (currentShape.kind === 'star') {
      lastStarRef.current = currentShape;
    }
  }, [currentShape]);

  const setShapeKind = (kind: NodeShapeKind) => {
    if (kind === 'star') {
      onStyleChange({ nodeShape: { ...lastStarRef.current, kind: 'star' } });
      return;
    }
    onStyleChange({ nodeShape: { kind } });
  };

  const updateStarShape = (patch: Partial<Pick<Extract<NodeShape, { kind: 'star' }>, 'arms' | 'innerRatio'>>) => {
    const base = currentShape.kind === 'star' ? currentShape : lastStarRef.current;
    const next = {
      kind: 'star' as const,
      arms: clampInt(patch.arms ?? base.arms, 3, 12),
      innerRatio: clamp(patch.innerRatio ?? base.innerRatio, 0.2, 0.8),
    };
    onStyleChange({ nodeShape: next });
  };

  const shapeOptions = SHAPE_KINDS.map((id) => ({
    id,
    icon: SHAPE_ICONS[id],
    label: t(`sidebar.tab.visual.shape.${id}`),
  }));
  const starShape = currentShape.kind === 'star' ? currentShape : lastStarRef.current;

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

        <TrackScrubber
          label={t('sidebar.tab.visual.slider.hueShift')}
          trackId="fx-hue-shift"
          paramKey="gradientHueShift"
          value={visualSettings.gradientHueShift ?? 0}
          min={0} max={360} step={1}
          format={(v) => `${Math.round(v)}°`}
          onChange={(val) => setVisual({ gradientHueShift: val })}
          onCommit={(val) => setVisual({ gradientHueShift: val })}
          {...trackProps}
        />

        {Object.keys(paintedOverrides).length > 0 && (() => {
          const visible = visualSettings.showPaintedOverrides !== false;
          return (
            <div className="flex items-center gap-1.5 p-1 bg-wn-control-bg border border-wn-divider rounded-md w-full">
              <div className="p-1 rounded-md text-muted-foreground shrink-0">
                <Paintbrush size={13} />
              </div>
              <div className="flex-1 min-w-0 text-[11px] text-foreground font-medium px-1">
                {t('sidebar.tab.visual.group.brushEdits')}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setVisual({ showPaintedOverrides: !visible })}
                  title={t('sidebar.tab.visual.action.toggleBrushEdits')}
                  className={`p-1 transition-colors rounded hover:bg-wn-control-hover ${visible ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {visible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button
                  type="button"
                  onClick={clearPaintedOverrides}
                  title={t('sidebar.tab.visual.action.clearBrushEdits')}
                  className="p-1 text-muted-foreground hover:text-destructive rounded hover:bg-wn-control-hover transition-colors"
                >
                  <Minus size={13} />
                </button>
              </div>
            </div>
          );
        })()}

        <SidebarGroup title={t('sidebar.tab.visual.group.shape')} stack="snug">
          <div className="p-1 bg-wn-control-bg border border-wn-divider rounded-md w-full">
            <SidebarCenteredPicker<NodeShapeKind>
              value={shapeKind}
              options={shapeOptions}
              onChange={setShapeKind}
              ariaLabel={t('sidebar.tab.visual.group.shape')}
              variant="ghost"
            />
          </div>
          {shapeKind === 'star' && (
            <div className="space-y-2 pt-2">
              <SidebarScrubberRow
                label={t('sidebar.tab.visual.shape.arms')}
                value={starShape.arms}
                min={3}
                max={12}
                step={1}
                format={(v) => `${Math.round(v)}`}
                onValueChange={(val) => updateStarShape({ arms: Math.round(val) })}
                onCommit={(val) => updateStarShape({ arms: val })}
              />
              <SidebarScrubberRow
                label={t('sidebar.tab.visual.shape.innerRatio')}
                value={starShape.innerRatio}
                min={0.2}
                max={0.8}
                step={0.01}
                format={(v) => v.toFixed(2)}
                onValueChange={(val) => updateStarShape({ innerRatio: val })}
                onCommit={(val) => updateStarShape({ innerRatio: val })}
              />
            </div>
          )}
        </SidebarGroup>

        <TrackScrubber
          label={t('sidebar.tab.visual.slider.baseScale')}
          trackId="fx-node-scale"
          paramKey="nodeScale"
          value={styleSettings.nodeScale ?? 1}
          min={0} max={2.5} step={0.05}
          format={(v) => `${v.toFixed(1)}x`}
          onChange={(val) => onStyleChange({ nodeScale: val })}
          onCommit={(val) => onStyleChange({ nodeScale: val })}
          {...trackProps}
        />

        <TrackScrubber
          label={t('sidebar.tab.visual.slider.radialBias')}
          trackId="fx-rad-bias"
          paramKey="radialBiasScale"
          value={visualSettings.radialBiasScale}
          min={-1} max={1} step={0.01}
          onChange={(val) => setVisual({ radialBiasScale: val })}
          onCommit={(val) => setVisual({ radialBiasScale: val })}
          description={t('sidebar.tab.visual.description.radialBias')}
          {...trackProps}
        />

        <SidebarGroup
          title={t('sidebar.tab.visual.group.canvasBackground')}
          stack="snug"
          actions={
            <SidebarVisibilityToggle
              visible={!!visualSettings.backgroundColor}
              onToggle={handleToggleBackground}
              title={t('sidebar.tab.visual.action.toggleBackground')}
            />
          }
        >
          <div className={!visualSettings.backgroundColor ? 'opacity-40 pointer-events-none' : ''}>
            <SidebarColorRow
              label={t('sidebar.tab.visual.color.background')}
              value={visualSettings.backgroundColor || (isDark ? '#09090b' : '#f8fafc')}
              onChange={handleColorChange}
            />
          </div>
        </SidebarGroup>
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
        <TrackScrubber
          label={t('sidebar.tab.visual.slider.globalOpacity')}
          trackId="fx-edge-opacity"
          paramKey="edgeOpacity"
          value={Math.round((styleSettings.edgeOpacity ?? 0) * 100)}
          min={0} max={100} step={1}
          format={(v) => `${Math.round(v)}%`}
          onChange={(val) => onStyleChange({ edgeOpacity: val / 100 })}
          onCommit={(val) => onStyleChange({ edgeOpacity: val / 100 })}
          {...trackProps}
        />
      </SidebarSection>

      <SidebarSection
        title={t('sidebar.tab.visual.fx.title')}
        actions={
          <SidebarSectionActionButton
            icon={Plus}
            title={t('sidebar.tab.visual.fx.add')}
            disabled={(visualSettings.effectsList ?? []).length >= 6}
            className={(visualSettings.effectsList ?? []).length >= 6 ? 'opacity-30 pointer-events-none' : ''}
            onClick={() => {
              const currentList = visualSettings.effectsList ?? [];
              const nextEffect = EFFECT_TYPES.find((fx) => !currentList.includes(fx));
              if (nextEffect) {
                const patch: Record<string, any> = {
                  effectsList: [...currentList, nextEffect]
                };
                if (nextEffect === 'bloom') patch.bloomEnabled = true;
                else if (nextEffect === 'glitch') patch.glitchActive = true;
                else if (nextEffect === 'vignette') patch.vignetteEnabled = true;
                else if (nextEffect === 'chromatic-aberration') patch.chromaEnabled = true;
                else if (nextEffect === 'film-grain') patch.grainEnabled = true;
                else if (nextEffect === 'pixelate') patch.pixelateEnabled = true;
                setVisual(patch);
              }
            }}
          />
        }
      >
        {!(visualSettings.effectsList ?? []).length ? (
          <div className="text-[10px] text-muted-foreground italic py-1">
            {t('sidebar.tab.visual.fx.noEffects')}
          </div>
        ) : (
          <div className="space-y-2">
            {(visualSettings.effectsList ?? []).map((effectType: EffectType, index: number) => {
              const isBloom = effectType === 'bloom';
              const isGlitch = effectType === 'glitch';
              const isVignette = effectType === 'vignette';
              const isChroma = effectType === 'chromatic-aberration';
              const isGrain = effectType === 'film-grain';
              const isPixelate = effectType === 'pixelate';

              const isVisible = 
                isBloom ? (visualSettings.bloomEnabled ?? false) :
                isGlitch ? (visualSettings.glitchActive ?? false) :
                isVignette ? (visualSettings.vignetteEnabled ?? false) :
                isChroma ? (visualSettings.chromaEnabled ?? false) :
                isGrain ? (visualSettings.grainEnabled ?? false) :
                (visualSettings.pixelateEnabled ?? false);
              
              const toggleVisibility = () => {
                if (isBloom) setVisual({ bloomEnabled: !visualSettings.bloomEnabled });
                else if (isGlitch) setVisual({ glitchActive: !visualSettings.glitchActive });
                else if (isVignette) setVisual({ vignetteEnabled: !visualSettings.vignetteEnabled });
                else if (isChroma) setVisual({ chromaEnabled: !visualSettings.chromaEnabled });
                else if (isGrain) setVisual({ grainEnabled: !visualSettings.grainEnabled });
                else if (isPixelate) setVisual({ pixelateEnabled: !visualSettings.pixelateEnabled });
              };

              const removeEffect = () => {
                const nextList = (visualSettings.effectsList ?? []).filter((_: any, i: number) => i !== index);
                const patch: Record<string, any> = { effectsList: nextList };
                if (isBloom) patch.bloomEnabled = false;
                else if (isGlitch) patch.glitchActive = false;
                else if (isVignette) patch.vignetteEnabled = false;
                else if (isChroma) patch.chromaEnabled = false;
                else if (isGrain) patch.grainEnabled = false;
                else if (isPixelate) patch.pixelateEnabled = false;
                setVisual(patch);
              };

              const handleTypeChange = (newType: EffectType) => {
                const nextList = [...(visualSettings.effectsList ?? [])];
                nextList[index] = newType;
                const patch: Record<string, any> = { effectsList: nextList };
                
                // Disable old type
                if (isBloom) patch.bloomEnabled = false;
                else if (isGlitch) patch.glitchActive = false;
                else if (isVignette) patch.vignetteEnabled = false;
                else if (isChroma) patch.chromaEnabled = false;
                else if (isGrain) patch.grainEnabled = false;
                else if (isPixelate) patch.pixelateEnabled = false;

                // Enable new type
                if (newType === 'bloom') patch.bloomEnabled = true;
                else if (newType === 'glitch') patch.glitchActive = true;
                else if (newType === 'vignette') patch.vignetteEnabled = true;
                else if (newType === 'chromatic-aberration') patch.chromaEnabled = true;
                else if (newType === 'film-grain') patch.grainEnabled = true;
                else if (newType === 'pixelate') patch.pixelateEnabled = true;

                setVisual(patch);
              };

              const usedEffects = visualSettings.effectsList ?? [];
              const effectOptions = EFFECT_TYPES.map((fx) => ({
                id: fx,
                label: t(`sidebar.tab.visual.fx.${fx}`),
                disabled: usedEffects.includes(fx) && fx !== effectType,
              }));

              const reorderEffect = (fromIndex: number, toIndex: number) => {
                const list = [...(visualSettings.effectsList ?? [])];
                const clamped = Math.max(0, Math.min(toIndex, list.length - 1));
                if (fromIndex === clamped) return;
                const [moved] = list.splice(fromIndex, 1);
                list.splice(clamped, 0, moved);
                setVisual({ effectsList: list });
              };

              return (
                <SidebarReorderRow
                  key={`${effectType}-${index}`}
                  index={index}
                  onReorder={reorderEffect}
                  ariaLabel={t('sidebar.tab.visual.action.reorderEffect')}
                >
                <Popover>
                  <PopoverAnchor asChild>
                    <div className="flex items-center gap-1.5 p-1 bg-wn-control-bg border border-wn-divider rounded-md w-full">
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          title={t(`sidebar.tab.visual.fx.${effectType}Settings`)}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-wn-control-hover transition-colors shrink-0"
                        >
                          <SlidersHorizontal size={13} />
                        </button>
                      </PopoverTrigger>

                      <div className="flex-1 min-w-0">
                        <SidebarCenteredPicker<EffectType>
                          value={effectType}
                          options={effectOptions}
                          onChange={handleTypeChange}
                          ariaLabel={t('sidebar.tab.visual.fx.title')}
                          variant="ghost"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          className={`p-1 transition-colors rounded hover:bg-wn-control-hover ${isVisible ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={removeEffect}
                          className="p-1 text-muted-foreground hover:text-destructive rounded hover:bg-wn-control-hover transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                      </div>
                    </div>
                  </PopoverAnchor>
                  <PopoverContent
                    side="left"
                    align="start"
                    sideOffset={0}
                    className="bg-popover/95 backdrop-blur-sm p-3 w-64 space-y-3 z-50"
                  >
                    <div className="text-[11px] font-semibold text-foreground border-b border-wn-divider pb-1 mb-2">
                      {t(`sidebar.tab.visual.fx.${effectType}`)}
                    </div>
                    
                    {isBloom && (
                      <div className="space-y-4">
                        {/* Bloom Intensity */}
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.bloomIntensity')}
                          trackId="fx-blm"
                          paramKey="bloomIntensity"
                          value={visualSettings.bloomIntensity ?? 0.15}
                          min={0} max={2} step={0.01}
                          format={(v) => v.toFixed(2)}
                          onChange={(val) => setVisual({ bloomIntensity: val })}
                          onCommit={(val) => setVisual({ bloomIntensity: val })}
                          {...trackProps}
                        />

                        {/* Bloom Radius */}
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.bloomRadius')}
                          trackId="fx-blm-rad"
                          paramKey="bloomRadius"
                          value={visualSettings.bloomRadius ?? 0.4}
                          min={0} max={1.5} step={0.01}
                          format={(v) => v.toFixed(2)}
                          onChange={(val) => setVisual({ bloomRadius: val })}
                          onCommit={(val) => setVisual({ bloomRadius: val })}
                          {...trackProps}
                        />

                        {/* Bloom Threshold */}
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.bloomThreshold')}
                          trackId="fx-blm-thr"
                          paramKey="bloomThreshold"
                          value={visualSettings.bloomThreshold ?? 0.85}
                          min={0} max={1} step={0.01}
                          format={(v) => v.toFixed(2)}
                          onChange={(val) => setVisual({ bloomThreshold: val })}
                          onCommit={(val) => setVisual({ bloomThreshold: val })}
                          {...trackProps}
                        />

                        {/* ── Selective Bloom ── */}
                        <div className="border-t border-wn-divider pt-2 space-y-3">
                          <SidebarToggleRow
                            label={t('sidebar.tab.visual.toggle.selectiveBloom')}
                            checked={visualSettings.bloomSelective ?? false}
                            onCheckedChange={(checked) => setVisual({ bloomSelective: checked })}
                          />

                          {visualSettings.bloomSelective && (
                            <>
                              {/* Glow Mode selector */}
                              <div className="space-y-1">
                                <div className="text-[10px] text-muted-foreground">{t('sidebar.tab.visual.fx.glowMode')}</div>
                                <Select
                                  value={visualSettings.bloomGlowMode ?? 'deterministic'}
                                  onValueChange={(v) => setVisual({ bloomGlowMode: v })}
                                >
                                  <SelectTrigger size="sm" className="h-6 w-full text-[11px] py-0 px-2 border-wn-divider bg-wn-control-bg text-foreground">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover border border-wn-divider z-50">
                                    <SelectItem value="deterministic">{t('sidebar.tab.visual.fx.glowModeDeterministic')}</SelectItem>
                                    <SelectItem value="flicker">{t('sidebar.tab.visual.fx.glowModeFlicker')}</SelectItem>
                                    <SelectItem value="index">{t('sidebar.tab.visual.fx.glowModeIndex')}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Selective Ratio */}
                              <TrackScrubber
                                label={t('sidebar.tab.visual.slider.selectiveRatio')}
                                trackId="fx-blm-sel"
                                paramKey="bloomSelectiveRatio"
                                value={visualSettings.bloomSelectiveRatio ?? 0.5}
                                min={0} max={1} step={0.01}
                                format={(v) => `${Math.round(v * 100)}%`}
                                onChange={(val) => setVisual({ bloomSelectiveRatio: val })}
                                onCommit={(val) => setVisual({ bloomSelectiveRatio: val })}
                                {...trackProps}
                              />

                              {/* Flicker Speed (only in flicker mode) */}
                              {(visualSettings.bloomGlowMode === 'flicker') && (
                                <TrackScrubber
                                  label={t('sidebar.tab.visual.slider.flickerSpeed')}
                                  trackId="fx-blm-flk-spd"
                                  paramKey="bloomFlickerSpeed"
                                  value={visualSettings.bloomFlickerSpeed ?? 1.0}
                                  min={0} max={10} step={0.1}
                                  format={(v) => v.toFixed(1)}
                                  onChange={(val) => setVisual({ bloomFlickerSpeed: val })}
                                  onCommit={(val) => setVisual({ bloomFlickerSpeed: val })}
                                  {...trackProps}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {isGlitch && (
                      <div className="space-y-4">
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.brushRadius')}
                          trackId="fx-glc-rad"
                          paramKey="glitchBrushRadius"
                          value={visualSettings.glitchBrushRadius ?? 100}
                          min={0} max={500} step={5}
                          format={(v) => `${Math.round(v)}px`}
                          onChange={(val) => setVisual({ glitchBrushRadius: Math.round(val) })}
                          onCommit={(val) => setVisual({ glitchBrushRadius: Math.round(val) })}
                          {...trackProps}
                        />
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.feather')}
                          trackId="fx-glc-fth"
                          paramKey="glitchFeather"
                          value={visualSettings.glitchFeather ?? 0.5}
                          min={0} max={1} step={0.01}
                          onChange={(val) => setVisual({ glitchFeather: val })}
                          onCommit={(val) => setVisual({ glitchFeather: val })}
                          {...trackProps}
                        />
                      </div>
                    )}

                    {isVignette && (
                      <div className="space-y-4">
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.vignetteDarkness')}
                          trackId="fx-vig-drk"
                          paramKey="vignetteDarkness"
                          value={visualSettings.vignetteDarkness ?? 0.0}
                          min={0} max={2} step={0.01}
                          format={(v) => v.toFixed(2)}
                          onChange={(val) => setVisual({ vignetteDarkness: val })}
                          onCommit={(val) => setVisual({ vignetteDarkness: val })}
                          {...trackProps}
                        />
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.vignetteOffset')}
                          trackId=""
                          paramKey="vignetteOffset"
                          value={visualSettings.vignetteOffset ?? 1.0}
                          min={0} max={2} step={0.01}
                          format={(v) => v.toFixed(2)}
                          onChange={(val) => setVisual({ vignetteOffset: val })}
                          onCommit={(val) => setVisual({ vignetteOffset: val })}
                          {...trackProps}
                        />
                      </div>
                    )}

                    {isChroma && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="text-[10px] text-muted-foreground">{t('sidebar.tab.visual.fx.chromaMode')}</div>
                          <Select
                            value={visualSettings.chromaMode ?? 'radial'}
                            onValueChange={(v) => setVisual({ chromaMode: v as any })}
                          >
                            <SelectTrigger size="sm" className="h-6 w-full text-[11px] py-0 px-2 border-wn-divider bg-wn-control-bg text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border border-wn-divider z-50">
                              <SelectItem value="radial">{t('sidebar.tab.visual.fx.chromaModeRadial')}</SelectItem>
                              <SelectItem value="horizontal">{t('sidebar.tab.visual.fx.chromaModeHorizontal')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.chromaOffset')}
                          trackId="fx-chr-off"
                          paramKey="chromaOffset"
                          value={visualSettings.chromaOffset ?? 0.0}
                          min={0} max={0.05} step={0.001}
                          format={(v) => v.toFixed(3)}
                          onChange={(val) => setVisual({ chromaOffset: val })}
                          onCommit={(val) => setVisual({ chromaOffset: val })}
                          {...trackProps}
                        />
                      </div>
                    )}

                    {isGrain && (
                      <div className="space-y-4">
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.grainIntensity')}
                          trackId="fx-grn-int"
                          paramKey="grainIntensity"
                          value={visualSettings.grainIntensity ?? 0.0}
                          min={0} max={1} step={0.01}
                          format={(v) => v.toFixed(2)}
                          onChange={(val) => setVisual({ grainIntensity: val })}
                          onCommit={(val) => setVisual({ grainIntensity: val })}
                          {...trackProps}
                        />

                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.grainSpeed')}
                          trackId=""
                          paramKey="grainSpeed"
                          value={visualSettings.grainSpeed ?? 1.0}
                          min={0} max={10} step={0.1}
                          format={(v) => v.toFixed(1)}
                          onChange={(val) => setVisual({ grainSpeed: val })}
                          onCommit={(val) => setVisual({ grainSpeed: val })}
                          {...trackProps}
                        />

                        <SidebarToggleRow
                          label={t('sidebar.tab.visual.toggle.grainColored')}
                          checked={visualSettings.grainColored ?? false}
                          onCheckedChange={(checked) => setVisual({ grainColored: checked })}
                        />
                      </div>
                    )}

                    {isPixelate && (
                      <div className="space-y-4">
                        <TrackScrubber
                          label={t('sidebar.tab.visual.slider.pixelSize')}
                          trackId="fx-pxl-sz"
                          paramKey="pixelSize"
                          value={visualSettings.pixelSize ?? 1}
                          min={1} max={64} step={1}
                          format={(v) => `${Math.round(v)}px`}
                          onChange={(val) => setVisual({ pixelSize: Math.round(val) })}
                          onCommit={(val) => setVisual({ pixelSize: Math.round(val) })}
                          {...trackProps}
                        />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                </SidebarReorderRow>
              );
            })}
          </div>
        )}
      </SidebarSection>

      <SidebarSection title={t('sidebar.tab.visual.section.pathAnimator')}>
        <SidebarToggleRow
          label={t('sidebar.tab.visual.toggle.cameraFollow')}
          checked={visualSettings.pathCameraFollow}
          onCheckedChange={(checked) => setVisual({ pathCameraFollow: checked })}
        />

        <SidebarToggleRow
          label={t('sidebar.tab.visual.toggle.pathLoop')}
          checked={visualSettings.pathLoop}
          onCheckedChange={(checked) => setVisual({ pathLoop: checked })}
        />

        <TrackScrubber
          label={t('sidebar.tab.visual.slider.smoothness')}
          trackId="fx-pth-sm"
          paramKey="pathSmoothness"
          value={visualSettings.pathSmoothness}
          min={0} max={1} step={0.01}
          onChange={(val) => setVisual({ pathSmoothness: val })}
          onCommit={(val) => setVisual({ pathSmoothness: val })}
          {...trackProps}
        />
      </SidebarSection>
    </SidebarTabContent>
  );
}
