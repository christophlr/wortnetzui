import * as React from 'react';
import { MoreHorizontal, Move } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { SidebarGroup, SidebarGroupContent } from '../ui/sidebar';
import { cn } from '../ui/utils';

export function CameraTab({
  onSetRotation,
  onResetView,
  onPanView,
  onZoomChange,
  zoomValue,
}: {
  onSetRotation: (phi: number, theta: number) => void;
  onResetView: () => void;
  onPanView: (dx: number, dy: number) => void;
  onZoomChange: (value: number) => void;
  zoomValue: number;
}) {
  const [puckPos, setPuckPos] = React.useState({ x: 0, y: 0 });
  const [isDraggingPuck, setIsDraggingPuck] = React.useState(false);
  const [panPuckPos, setPanPuckPos] = React.useState({ x: 0, y: 0 });
  const [isDraggingPanPuck, setIsDraggingPanPuck] = React.useState(false);
  const [zoomPuckPos, setZoomPuckPos] = React.useState({ x: 0, y: 0 });
  const [isDraggingZoomPuck, setIsDraggingZoomPuck] = React.useState(false);

  return (
    <SidebarGroup className="py-4 pb-6 mt-2">
      <SidebarGroupContent className="px-3 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Rotation (Orbit)</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div 
              className="relative w-full h-40 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden"
              onMouseDown={(e) => {
                setIsDraggingPuck(true);
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const onMove = (ev: MouseEvent) => {
                  const relX = ev.clientX - centerX;
                  const relY = ev.clientY - centerY;
                  
                  const scale = 0.01;
                  onSetRotation(relX * scale, relY * scale);
                  
                  const limitX = rect.width / 2 - 24;
                  const limitY = rect.height / 2 - 24;
                  
                  setPuckPos({ 
                    x: Math.max(-limitX, Math.min(limitX, relX)), 
                    y: Math.max(-limitY, Math.min(limitY, relY)) 
                  });
                };
                const onUp = () => {
                  setIsDraggingPuck(false);
                  setPuckPos({ x: 0, y: 0 });
                  document.body.style.cursor = 'default';
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                document.body.style.cursor = 'grabbing';
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-[0.05]">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-zinc-900" />
                ))}
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-zinc-300" />
                <div className="h-full w-[1px] bg-zinc-300" />
                <div className="absolute w-full h-[1px] bg-zinc-300/20 rotate-[31deg]" />
                <div className="absolute w-full h-[1px] bg-zinc-300/20 -rotate-[31deg]" />
              </div>

              <div className="absolute inset-0 p-4 flex flex-col justify-between items-center pointer-events-none">
                <button 
                  className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                  onClick={() => onSetRotation(0, 0)}
                  title="Top View (Y)"
                >Y</button>
                <div className="flex justify-between w-full items-center">
                  <button 
                    className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                    onClick={() => onSetRotation(-Math.PI/2, Math.PI/2)}
                    title="Left View (-X)"
                  >-X</button>
                  
                  <div 
                    className={cn(
                      "size-8 rounded-full bg-white border border-zinc-300 shadow-md flex items-center justify-center text-zinc-400 z-10",
                      !isDraggingPuck && "transition-transform duration-300 ease-out"
                    )}
                    style={{ 
                      transform: `translate(${puckPos.x}px, ${puckPos.y}px)` 
                    }}
                  >
                    <MoreHorizontal size={14} className="rotate-90" />
                  </div>

                  <button 
                    className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                    onClick={() => onSetRotation(Math.PI/2, Math.PI/2)}
                    title="Right View (X)"
                  >X</button>
                </div>
                <button 
                  className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                  onClick={() => onSetRotation(Math.PI, 0)}
                  title="Bottom View (-Y)"
                >-Y</button>
              </div>
              
              <button onClick={() => onSetRotation(Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute top-2 left-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 1" />
              <button onClick={() => onSetRotation(-Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute top-2 right-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 2" />
              <button onClick={() => onSetRotation(3*Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute bottom-2 left-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 3" />
              <button onClick={() => onSetRotation(-3*Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute bottom-2 right-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 4" />
            </div>
            
            <div className="flex justify-between w-full px-1">
               <span className="text-[10px] text-zinc-400 italic">Orbit: Ziehen / Klicken zum Einrasten</span>
               <button 
                 onClick={() => onResetView()}
                 className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium underline-offset-2 hover:underline"
               >
                 Reset
               </button>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-200/40" />

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Ansicht verschieben (Pan)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div 
              className="relative w-full h-32 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden"
              onDoubleClick={() => {
                onResetView();
                setPanPuckPos({ x: 0, y: 0 });
              }}
              onMouseDown={(e) => {
                setIsDraggingPanPuck(true);
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const onMove = (ev: MouseEvent) => {
                  const scale = 5;
                  onPanView(ev.movementX * scale, -ev.movementY * scale);

                  const relX = ev.clientX - centerX;
                  const relY = ev.clientY - centerY;
                  
                  const limitX = rect.width / 2 - 16;
                  const limitY = rect.height / 2 - 16;
                  
                  setPanPuckPos({ 
                    x: Math.max(-limitX, Math.min(limitX, relX)), 
                    y: Math.max(-limitY, Math.min(limitY, relY)) 
                  });
                };
                const onUp = () => {
                  setIsDraggingPanPuck(false);
                  setPanPuckPos({ x: 0, y: 0 });
                  document.body.style.cursor = 'default';
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                document.body.style.cursor = 'grabbing';
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-3 pointer-events-none opacity-[0.05]">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-zinc-900" />
                ))}
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-zinc-300" />
                <div className="h-full w-[1px] bg-zinc-300" />
              </div>

              <div 
                className={cn(
                  "size-8 rounded-lg bg-white border border-zinc-300 shadow-sm flex items-center justify-center text-zinc-400 z-10 transition-colors",
                  isDraggingPanPuck ? "border-blue-500 text-blue-500 shadow-md" : "group-hover:border-zinc-400",
                  !isDraggingPanPuck && "transition-transform duration-300 ease-out"
                )}
                style={{ 
                  transform: `translate(${panPuckPos.x}px, ${panPuckPos.y}px)` 
                }}
              >
                <Move size={14} />
              </div>
            </div>
            <span className="text-[9px] text-zinc-400 italic">Ziehen zum Verschieben</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Zoom</span>
            <span className="text-[10px] font-mono text-zinc-400">{zoomValue.toFixed(1)}%</span>
          </div>
          
          <div className="relative h-6 flex items-center px-1 group">
            <div className="absolute inset-x-1 h-1.5 bg-zinc-200 rounded-full" />
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-3 bg-zinc-300 z-0" />
            
            <div 
              className={cn(
                "absolute size-4 rounded-full bg-white border border-zinc-300 shadow-sm z-10 cursor-grab active:cursor-grabbing hover:border-zinc-400 transition-colors flex items-center justify-center",
                isDraggingZoomPuck && "border-blue-500 shadow-md",
                !isDraggingZoomPuck && "transition-all duration-300 ease-out"
              )}
              style={{ 
                left: `calc(50% + ${zoomPuckPos.x}px)`,
                transform: 'translateX(-50%)'
              }}
              onMouseDown={(e) => {
                setIsDraggingZoomPuck(true);
                const startX = e.clientX;
                const startPuckX = zoomPuckPos.x;

                const onMove = (ev: MouseEvent) => {
                  const dx = ev.clientX - startX;
                  const newPuckX = startPuckX + dx;
                  
                  const limit = 100;
                  const clampedX = Math.max(-limit, Math.min(limit, newPuckX));
                  setZoomPuckPos({ x: clampedX, y: 0 });

                  const scale = 0.05;
                  const delta = clampedX * scale;
                  onZoomChange(Math.max(0, Math.min(100, zoomValue + delta)));
                };
                const onUp = () => {
                  setIsDraggingZoomPuck(false);
                  setZoomPuckPos({ x: 0, y: 0 });
                  document.body.style.cursor = 'default';
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                document.body.style.cursor = 'grabbing';
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <div className="size-1 rounded-full bg-zinc-300" />
            </div>
          </div>
          <div className="flex justify-between px-1">
            <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-tight">-</span>
            <span className="text-[9px] text-zinc-400 italic">Schieben zum Zoomen (Relativ)</span>
            <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-tight">+</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full h-8 text-[11px] bg-white border-zinc-200 mt-4"
          onClick={() => {
            onResetView();
            setPanPuckPos({ x: 0, y: 0 });
            onZoomChange(50);
          }}
        >
          Kamera zurücksetzen
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
