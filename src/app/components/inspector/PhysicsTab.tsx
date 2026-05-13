import * as React from 'react';
import { Input } from '../ui/input';

import { Slider } from '../ui/slider';
import { Diamond } from 'lucide-react';
import { InspectorPanelSection, InspectorSectionHeader, InspectorSubgroup, InspectorSubgroupTitle } from './InspectorAtoms';

function SliderValue({ value, onCommit, min, max, format = (v: number) => v.toFixed(2) }: { value: number; onCommit: (v: number) => void; min?: number; max?: number; format?: (v: number) => string }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value.toString());

  const commitValue = (valStr: string) => {
    let val = parseFloat(valStr);
    if (!isNaN(val)) {
      if (min !== undefined) val = Math.max(min, val);
      if (max !== undefined) val = Math.min(max, val);
      onCommit(val);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        type="number"
        autoFocus
        className="w-12 h-6 text-[10px] px-1 py-0 text-center border-zinc-200"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commitValue(localValue);
          } else if (e.key === 'Escape') {
            setIsEditing(false);
            setLocalValue(value.toString());
          }
        }}
        onBlur={() => commitValue(localValue)}
      />
    );
  }

  return (
    <button 
      onClick={() => {
        setIsEditing(true);
        setLocalValue(value.toString());
      }}
      className="text-[10px] font-mono text-zinc-400 hover:text-zinc-900 transition-colors"
    >
      {format(value)}
    </button>
  );
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
            <InspectorSubgroup key={p.id} className="space-y-2.5">
              <InspectorSubgroupTitle>{p.label}</InspectorSubgroupTitle>
              <div className="text-[9px] text-zinc-400 leading-tight pr-2">{p.desc}</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <SliderValue
                    value={p.value}
                    min={p.min ?? 0}
                    max={p.max}
                    onCommit={(val) => onPhysicsChange({ [p.key]: val })}
                    format={(v) => typeof v === 'number' ? v.toFixed(2) : v}
                  />
                  <button
                    onClick={() => onTogglePhysicsKeyframe(p.id, p.value)}
                    className={`size-5 rounded-full flex items-center justify-center transition-colors ${physKfActive[p.id] ? 'text-indigo-500 bg-indigo-50 border border-indigo-200 shadow-sm' : 'text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100'}`}
                    title={physKfActive[p.id] ? 'Keyframe entfernen' : 'Keyframe setzen'}
                  >
                    <Diamond className={`size-2.5 ${physKfActive[p.id] ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <Slider
                  value={[p.value]}
                  min={p.min ?? 0}
                  max={p.max}
                  step={p.step}
                  onValueChange={([val]) => onPhysicsChange({ [p.key]: val })}
                  className="flex-1 py-1"
                />
              </div>
            </InspectorSubgroup>
          ))}
        </InspectorPanelSection>
      ))}
    </div>
  );
}

