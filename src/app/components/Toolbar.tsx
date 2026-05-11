import * as React from 'react';
import { MousePointer2, Hand, Paintbrush, View, Scale3D, Wand2, Route } from 'lucide-react';
import { cn } from './ui/utils';

export type ToolId = 'pointer' | 'pan' | 'paint' | 'zoom' | 'scale' | 'glitch' | 'path';

interface ToolbarProps {
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  className?: string;
}

interface ToolButtonProps {
  id: ToolId;
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  icon: React.ElementType;
  label: string;
}

function ToolButton({ id, activeTool, onToolChange, icon: Icon, label }: ToolButtonProps) {
  const isActive = activeTool === id;
  
  return (
    <button
      onClick={() => onToolChange(id)}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
        isActive 
          ? "bg-zinc-900 text-white shadow-sm" 
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
      )}
      title={label}
    >
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive ? "scale-105" : "scale-100 group-hover:scale-110")} />
      
      {/* Tooltip or Label could go here if needed, but standard software usually just uses title */}
    </button>
  );
}

export function Toolbar({ activeTool, onToolChange, className }: ToolbarProps) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-1.5 p-1.5 bg-zinc-50/90 backdrop-blur-md border border-zinc-200 shadow-xl rounded-2xl pointer-events-auto",
      className
    )}>
      <ToolButton 
        id="pointer" 
        activeTool={activeTool} 
        onToolChange={onToolChange} 
        icon={MousePointer2} 
        label="Auswahl (V)" 
      />
      <ToolButton 
        id="pan" 
        activeTool={activeTool} 
        onToolChange={onToolChange} 
        icon={Hand} 
        label="Hand (H)" 
      />
      <ToolButton 
        id="paint" 
        activeTool={activeTool} 
        onToolChange={onToolChange} 
        icon={Paintbrush} 
        label="Pinsel (B)" 
      />
      <ToolButton 
        id="zoom" 
        activeTool={activeTool} 
        onToolChange={onToolChange} 
        icon={View} 
        label="Zoom (Z)" 
      />
      <ToolButton 
        id="scale" 
        activeTool={activeTool} 
        onToolChange={onToolChange} 
        icon={Scale3D} 
        label="Skalieren (S)" 
      />
      <div className="w-6 h-[1px] bg-zinc-200/60 my-0.5" />
      <ToolButton 
        id="glitch" 
        activeTool={activeTool} 
        onToolChange={onToolChange} 
        icon={Wand2} 
        label="Glitch-Pinsel (G)" 
      />
      <ToolButton 
        id="path" 
        activeTool={activeTool} 
        onToolChange={onToolChange} 
        icon={Route} 
        label="Pfad-Animator (P)" 
      />
    </div>
  );
}
