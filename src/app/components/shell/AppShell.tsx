import React, { ReactNode } from 'react';
import { useWortnetz } from '../../context/WortnetzContext';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div 
      className="app-shell flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden select-none"
    >
      {children}
    </div>
  );
}
