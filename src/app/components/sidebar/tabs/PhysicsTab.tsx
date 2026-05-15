import * as React from 'react';
import { Diamond } from 'lucide-react';
import { InspectorPanelSection, InspectorSectionHeader, InspectorSliderControl, InspectorSliderTrack } from '../../inspector/InspectorAtoms';

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
  const groups = [
    {
      title: 'Kräfte',
      params: [
        { id: 'phys-rep', label: 'Streuung (Abstoßung)', desc: 'Wie stark Elemente sich gegenseitig verdrängen.', value: effectivePhysicsParams?.repulsion ?? 1500, max: 5000, step: 10, key: 'repulsion' },
        { id: 'phys-spk', label: 'Spannung (Tension)', desc: 'Wie straff Verbindungen die Elemente zusammenziehen. Höher = snappier.', value: effectivePhysicsParams?.springK ?? 0.2, max: 0.8, step: 0.01, key: 'springK' },
        { id: 'phys-dmp', label: 'Reibung (Friction)', desc: 'Wie schnell Bewegungen abbremsen. Niedriger = bouncier.', value: effectivePhysicsParams?.damping ?? 0.85, max: 1, step: 0.01, key: 'damping' },
        { id: 'phys-lnk', label: 'Abstand (Distance)', desc: 'Die gewünschte Grundlänge aller Verbindungen.', value: effectivePhysicsParams?.linkDistance ?? 80, max: 500, step: 1, key: 'linkDistance' },
        { id: 'phys-grv', label: 'Schwerkraft (Gravity)', desc: 'Zieht alle Elemente zur Mitte des Canvas.', value: effectivePhysicsParams?.gravity ?? 0, min: -5, max: 10, step: 0.1, key: 'gravity' },
      ],
    },
    {
      title: 'Dynamik',
      params: [
        { id: 'phys-trb', label: 'Bewegung (Wobble)', desc: 'Erzeugt eine stetige, organische Unruhe.', value: effectivePhysicsParams?.turbulence ?? 0, max: 10, step: 0.1, key: 'turbulence' },
        { id: 'phys-pls', label: 'Lebendigkeit (Pulse)', desc: 'Organisches Atmen der Knotenabstände.', value: effectivePhysicsParams?.pulse ?? 0, max: 1, step: 0.01, key: 'pulse' },
      ],
    },
    {
      title: 'Ordnung',
      params: [
        { id: 'phys-vto', label: 'Vertikale Ordnung', desc: 'Sortiert Knoten nach Textlänge (kurz oben, lang unten).', value: effectivePhysicsParams?.verticalOrder ?? 0, max: 10, step: 0.1, key: 'verticalOrder' },
      ],
    },
  ];

  return (
    <div className="divide-y divide-zinc-300/80 dark:divide-zinc-800">
      {groups.map((group) => (
        <InspectorPanelSection key={group.title} className="space-y-4">
          <InspectorSectionHeader title={group.title} />
          {group.params.map((p) => (
            <InspectorSliderControl
              key={p.id}
              label={p.label}
              value={typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
              description={p.desc}
              accessory={
                <button
                  onClick={() => onTogglePhysicsKeyframe(p.id, p.value)}
                  className={`size-5 rounded-full flex items-center justify-center transition-colors ${physKfActive[p.id] ? 'text-indigo-500 bg-indigo-50 border border-indigo-200 shadow-sm' : 'text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100'}`}
                  title={physKfActive[p.id] ? 'Keyframe entfernen' : 'Keyframe setzen'}
                >
                  <Diamond className={`size-2.5 ${physKfActive[p.id] ? 'fill-current' : ''}`} />
                </button>
              }
              slider={
                <InspectorSliderTrack
                  value={[p.value]}
                  min={p.min ?? 0}
                  max={p.max}
                  step={p.step}
                  onValueChange={([val]) => onPhysicsChange({ [p.key]: val })}
                />
              }
            />
          ))}
        </InspectorPanelSection>
      ))}
    </div>
  );
}

