import React, { ReactNode } from 'react';

export function AppSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex flex-row bg-card z-40 shadow-2xl">
      {children}
    </div>
  );
}
