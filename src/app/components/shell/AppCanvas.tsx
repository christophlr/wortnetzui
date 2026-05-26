import React, { ReactNode } from 'react';

export function AppCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {children}
    </div>
  );
}
