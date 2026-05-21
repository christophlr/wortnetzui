import {
  SidebarKeyframeToggle,
  SidebarSection,
  SidebarSliderRow,
  SidebarSliderTrack,
  SidebarTabContent,
} from '../SidebarAtoms';
import { useT } from '../../../i18n/useT';

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
}: {
  effectivePhysicsParams?: any;
  physKfActive: Record<string, boolean>;
  onPhysicsChange: (params: any) => void;
  onTogglePhysicsKeyframe: (id: string, value: number) => void;
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
        { id: 'phys-pls', paramKey: 'pulse',        key: 'pulse',        value: effectivePhysicsParams?.pulse        ?? 0,    max: 1,    step: 0.01 },
      ],
    },
    {
      sectionKey: 'order',
      params: [
        { id: 'phys-vto', paramKey: 'verticalOrder',key: 'verticalOrder',value: effectivePhysicsParams?.verticalOrder?? 0,    max: 10,   step: 0.1 },
      ],
    },
  ];

  const paramLabel = (paramKey: string): string => {
    const name = t(`sidebar.tab.physics.param.${paramKey}.name`);
    const hint = t(`sidebar.tab.physics.param.${paramKey}.hint`);
    return hint ? `${name} (${hint})` : name;
  };

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
            return (
              <SidebarSliderRow
                key={p.id}
                label={paramLabel(p.paramKey)}
                value={p.value}
                onCommit={(val) => onPhysicsChange({ [p.key]: val })}
                min={min}
                max={p.max}
                description={t(`sidebar.tab.physics.param.${p.paramKey}.desc`)}
                accessory={
                  <SidebarKeyframeToggle
                    active={active}
                    onClick={() => onTogglePhysicsKeyframe(p.id, p.value)}
                    title={active ? t('sidebar.tab.physics.keyframe.remove') : t('sidebar.tab.physics.keyframe.set')}
                  />
                }
                slider={
                  <SidebarSliderTrack
                    value={[p.value]}
                    min={min}
                    max={p.max}
                    step={p.step}
                    onValueChange={([val]) => onPhysicsChange({ [p.key]: val })}
                  />
                }
              />
            );
          })}
        </SidebarSection>
      ))}
    </SidebarTabContent>
  );
}
