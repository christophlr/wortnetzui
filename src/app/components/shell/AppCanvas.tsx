import React, { ReactNode } from 'react';

export function AppCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 relative overflow-hidden h-full bg-zinc-100">
      {children}
    </div>
  );
}
