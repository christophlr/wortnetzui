import React, { ReactNode } from 'react';
import { useWortnetz } from '../../context/WortnetzContext';

export function AppShell({ children }: { children: ReactNode }) {
  const { activeTool } = useWortnetz();
  
  const getCursor = () => {
    switch (activeTool) {
      case 'pan': return 'grab';
      case 'paint': return 'crosshair';
      case 'zoom': return 'zoom-in';
      case 'scale': return 'nwse-resize';
      default: return 'default';
    }
  };

  return (
    <div 
      className="app-shell flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden select-none"
      style={{ cursor: getCursor() }}
    >
      {children}
    </div>
  );
}
