import React, { ReactNode, useCallback } from 'react';
import { useWortnetz } from '../../context/WortnetzContext';
import { DEFAULT_SIDEBAR_WIDTH } from '../../constants';

export function AppSidebar({ children }: { children: ReactNode }) {
  const { isSidebarOpen, sidebarWidth, setSidebarWidth } = useWortnetz();

  const startSidebarResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const onMove = (ev: MouseEvent) =>
      setSidebarWidth(
        Math.max(DEFAULT_SIDEBAR_WIDTH, Math.min(600, startWidth + (startX - ev.clientX))),
      );
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [sidebarWidth, setSidebarWidth]);

  return (
    <div
      className="relative h-full flex flex-row border-l border-border bg-card z-40 transition-all duration-300 ease-in-out shadow-2xl"
      style={{ width: isSidebarOpen ? sidebarWidth : 48 }}
    >
      {isSidebarOpen && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-50"
          onMouseDown={startSidebarResize}
          onDoubleClick={() => setSidebarWidth(DEFAULT_SIDEBAR_WIDTH)}
        />
      )}
      {children}
    </div>
  );
}
