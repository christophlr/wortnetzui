import { MousePointer2, Hand, Paintbrush, View, Scale3D, Wand2, Route } from 'lucide-react';
import { ToolButton, ToolbarDivider, ToolbarShell } from './toolbar/ToolbarAtoms';

export type ToolId = 'pointer' | 'pan' | 'paint' | 'zoom' | 'scale' | 'glitch' | 'path';

interface ToolbarProps {
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  className?: string;
}

export function Toolbar({ activeTool, onToolChange, className }: ToolbarProps) {
  return (
    <ToolbarShell className={className}>
      <ToolButton id="pointer" activeId={activeTool} onSelect={onToolChange} icon={MousePointer2} label="Auswahl (V)" />
      <ToolButton id="pan" activeId={activeTool} onSelect={onToolChange} icon={Hand} label="Hand (H)" />
      <ToolButton id="paint" activeId={activeTool} onSelect={onToolChange} icon={Paintbrush} label="Pinsel (B)" />
      <ToolButton id="zoom" activeId={activeTool} onSelect={onToolChange} icon={View} label="Zoom (Z)" />
      <ToolButton id="scale" activeId={activeTool} onSelect={onToolChange} icon={Scale3D} label="Skalieren (S)" />
      <ToolbarDivider />
      <ToolButton id="glitch" activeId={activeTool} onSelect={onToolChange} icon={Wand2} label="Glitch-Pinsel (G)" />
      <ToolButton id="path" activeId={activeTool} onSelect={onToolChange} icon={Route} label="Pfad-Animator (P)" />
    </ToolbarShell>
  );
}
