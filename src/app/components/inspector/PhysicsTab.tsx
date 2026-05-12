import * as React from 'react';
import { Input } from '../ui/input';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '../ui/sidebar';

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
  const params = [
    { id: 'phys-rep', label: 'Streuung (Abstoßung)', desc: 'Wie stark Elemente sich gegenseitig verdrängen.', value: effectivePhysicsParams?.repulsion ?? 1500, max: 5000, step: 10, key: 'repulsion' },
    { id: 'phys-spk', label: 'Spannung (Tension)', desc: 'Wie straff Verbindungen die Elemente zusammenziehen. Höher = snappier.', value: effectivePhysicsParams?.springK ?? 0.2, max: 0.8, step: 0.01, key: 'springK' },
    { id: 'phys-dmp', label: 'Reibung (Friction)', desc: 'Wie schnell Bewegungen abbremsen. Niedriger = bouncier.', value: effectivePhysicsParams?.damping ?? 0.85, max: 1, step: 0.01, key: 'damping' },
    { id: 'phys-lnk', label: 'Abstand (Distance)', desc: 'Die gewünschte Grundlänge aller Verbindungen.', value: effectivePhysicsParams?.linkDistance ?? 80, max: 500, step: 1, key: 'linkDistance' },
    { id: 'phys-grv', label: 'Schwerkraft (Gravity)', desc: 'Zieht alle Elemente zur Mitte des Canvas.', value: effectivePhysicsParams?.gravity ?? 0, min: -5, max: 10, step: 0.1, key: 'gravity' },
    { id: 'phys-trb', label: 'Bewegung (Wobble)', desc: 'Erzeugt eine stetige, organische Unruhe.', value: effectivePhysicsParams?.turbulence ?? 0, max: 10, step: 0.1, key: 'turbulence' },
    { id: 'phys-vto', label: 'Vertikale Ordnung', desc: 'Sortiert Knoten nach Textlänge (kurz oben, lang unten).', value: effectivePhysicsParams?.verticalOrder ?? 0, max: 10, step: 0.1, key: 'verticalOrder' },
    { id: 'phys-pls', label: 'Lebendigkeit (Pulse)', desc: 'Organisches Atmen der Knotenabstände.', value: effectivePhysicsParams?.pulse ?? 0, max: 1, step: 0.01, key: 'pulse' },
  ];

  return (
    <SidebarGroup className="py-4 pb-6 mt-2">
      <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3 mt-2">Physik-Steuerung</SidebarGroupLabel>
      <SidebarGroupContent className="px-3 space-y-7">
        {params.map((p) => (
          <div key={p.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">{p.label}</span>
                <span className="text-[9px] text-zinc-400 mt-0.5 leading-tight pr-2">{p.desc}</span>
              </div>
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
                  className={`size-5 rounded-full flex items-center justify-center transition-colors ${physKfActive[p.id] ? 'text-indigo-500 bg-indigo-50 border border-indigo-200' : 'text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100'}`}
                />
              </div>
            </div>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
