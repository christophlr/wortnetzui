import React, { ReactNode, useCallback } from 'react';
import { useWortnetz } from '../../context/WortnetzContext';

export function AppSidebar({ children }: { children: ReactNode }) {
  const { 
    isSidebarOpen, 
    sidebarWidth, 
    setSidebarWidth 
  } = useWortnetz();

  const startSidebarResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const onMove = (ev: MouseEvent) => setSidebarWidth(Math.max(360, Math.min(600, startWidth + (startX - ev.clientX))));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [sidebarWidth, setSidebarWidth]);

  return (
    <div 
      className="relative h-full flex flex-row border-l border-border bg-sidebar/80 backdrop-blur-md z-40 transition-all duration-300 ease-in-out"
      style={{ width: isSidebarOpen ? sidebarWidth : 48 }}
    >
      {/* Resize handle (left edge of sidebar) */}
      {isSidebarOpen && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-50"
          onMouseDown={startSidebarResize}
        />
      )}
      {children}
    </div>
  );
}
