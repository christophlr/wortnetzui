import {
  SidebarKeyframeToggle,
  SidebarModulatorButton,
  SidebarScrubberRow,
  SidebarSection,
  SidebarTabContent,
} from '../SidebarAtoms';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { LfoControlsBody } from '../../timeline/LfoControls';
import { useT } from '../../../i18n/useT';
import type { TrackMeta } from '../../../animation/Track';
import type { Modulator } from '../../../animation/Modulator';

interface PhysicsParam {
  id: string;
  /** i18n key under `sidebar.tab.physics.param.<paramKey>`. */
  paramKey: string;
  /** Engine state key. */
  key: string;
  value: number;
  min?: number;
  max: number;
  step: number;
}

interface PhysicsGroup {
  /** i18n key under `sidebar.tab.physics.section.<sectionKey>`. */
  sectionKey: string;
  params: PhysicsParam[];
}

export function PhysicsTab({
  effectivePhysicsParams,
  physKfActive,
  onPhysicsChange,
  onTogglePhysicsKeyframe,
  trackMeta,
  onSetTrackModulator,
}: {
  effectivePhysicsParams?: any;
  physKfActive: Record<string, boolean>;
  onPhysicsChange: (params: any) => void;
  onTogglePhysicsKeyframe: (id: string, value: number) => void;
  trackMeta?: Record<string, TrackMeta>;
  onSetTrackModulator?: (trackId: string, modulator: Modulator | null) => void;
}) {
  const { t } = useT();

  const groups: PhysicsGroup[] = [
    {
      sectionKey: 'forces',
      params: [
        { id: 'phys-rep', paramKey: 'repulsion',    key: 'repulsion',    value: effectivePhysicsParams?.repulsion    ?? 1500, max: 5000, step: 10 },
        { id: 'phys-spk', paramKey: 'springK',      key: 'springK',      value: effectivePhysicsParams?.springK      ?? 0.2,  max: 0.8,  step: 0.01 },
        { id: 'phys-dmp', paramKey: 'damping',      key: 'damping',      value: effectivePhysicsParams?.damping      ?? 0.85, max: 1,    step: 0.01 },
        { id: 'phys-lnk', paramKey: 'linkDistance', key: 'linkDistance', value: effectivePhysicsParams?.linkDistance ?? 80,   max: 500,  step: 1 },
        { id: 'phys-grv', paramKey: 'gravity',      key: 'gravity',      value: effectivePhysicsParams?.gravity      ?? 0,    min: -5, max: 10, step: 0.1 },
      ],
    },
    {
      sectionKey: 'dynamics',
      params: [
        { id: 'phys-trb', paramKey: 'turbulence',   key: 'turbulence',   value: effectivePhysicsParams?.turbulence   ?? 0,    max: 10,   step: 0.1 },
      ],
    },
    {
      sectionKey: 'order',
      params: [
        { id: 'phys-vto', paramKey: 'verticalOrder',key: 'verticalOrder',value: effectivePhysicsParams?.verticalOrder?? 0,    max: 10,   step: 0.1 },
      ],
    },
  ];

  return (
    <SidebarTabContent>
      {groups.map((group) => (
        <SidebarSection
          key={group.sectionKey}
          title={t(`sidebar.tab.physics.section.${group.sectionKey}`)}
          stack="snug"
        >
          {group.params.map((p) => {
            const active = physKfActive[p.id] ?? false;
            const min = p.min ?? 0;
            const modulator = trackMeta?.[p.id]?.modulator ?? null;
            return (
              <SidebarScrubberRow
                key={p.id}
                label={t(`sidebar.tab.physics.param.${p.paramKey}.name`)}
                value={p.value}
                min={min}
                max={p.max}
                step={p.step}
                onValueChange={(val) => onPhysicsChange({ [p.key]: val })}
                onCommit={(val) => onPhysicsChange({ [p.key]: val })}
                description={t(`sidebar.tab.physics.param.${p.paramKey}.desc`)}
                accessory={
                  <>
                    {trackMeta && onSetTrackModulator ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <SidebarModulatorButton
                            active={modulator !== null}
                            title={t('timeline.lfo.title')}
                            aria-label={t('timeline.lfo.title')}
                          />
                        </PopoverTrigger>
                        <PopoverContent
                          side="left"
                          align="end"
                          className="bg-popover/95 backdrop-blur-sm p-3"
                        >
                          <div className="space-y-3">
                            <div className="text-[11px] font-semibold text-foreground">
                              {t('timeline.lfo.title')}
                            </div>
                            <div className="space-y-4">
                              <LfoControlsBody
                                paramKey={p.paramKey}
                                trackId={p.id}
                                value={modulator}
                                onChange={(m) => onSetTrackModulator(p.id, m)}
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : null}
                    <SidebarKeyframeToggle
                      active={active}
                      onClick={() => onTogglePhysicsKeyframe(p.id, p.value)}
                      title={active ? t('sidebar.tab.physics.keyframe.remove') : t('sidebar.tab.physics.keyframe.set')}
                    />
                  </>
                }
              />
            );
          })}
        </SidebarSection>
      ))}
    </SidebarTabContent>
  );
}
