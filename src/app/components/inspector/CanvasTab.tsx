import * as React from 'react';
import { Fullscreen, MonitorPlay, Tv, Image, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '../ui/sidebar';

export function CanvasTab({
  canvasAspectRatio,
  onCanvasAspectRatioChange,
}: {
  canvasAspectRatio: string;
  onCanvasAspectRatioChange?: (ratio: string) => void;
}) {
  return (
    <div>
      <SidebarGroup className="py-4 pb-6 mt-2">
        <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">Canvas Layout</SidebarGroupLabel>
        <SidebarGroupContent className="px-3 space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 mb-3 block">Seitenverhältnis</span>
              <RadioGroup 
                value={canvasAspectRatio} 
                onValueChange={(v) => onCanvasAspectRatioChange?.(v)}
                className="grid grid-cols-2 gap-2"
              >
                {[
                  { id: 'full', label: 'Vollbild', icon: Fullscreen },
                  { id: '16:9', label: '16:9 Cinema', icon: MonitorPlay },
                  { id: '4:3', label: '4:3 Standard', icon: Tv },
                  { id: '3:2', label: '3:2 Classic', icon: Image },
                  { id: 'din', label: 'DIN Landscape', icon: FileText },
                ].map((ratio) => {
                  const IconComponent = ratio.icon;
                  return (
                  <div key={ratio.id}>
                    <RadioGroupItem
                      value={ratio.id}
                      id={`ratio-${ratio.id}`}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`ratio-${ratio.id}`}
                      className="flex flex-col items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/50 p-2 hover:bg-zinc-100 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50/50 cursor-pointer transition-all"
                    >
                      <span className="mb-1 flex h-4 items-center justify-center">
                        <IconComponent size={16} className="text-zinc-600" />
                      </span>
                      <span className="text-[10px] font-medium">{ratio.label}</span>
                    </label>
                  </div>
                );
                })}
              </RadioGroup>
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <div className="px-3 pt-2">
        <p className="text-[10px] text-zinc-400 leading-relaxed italic border-t border-zinc-100 pt-4">
          Hinweis: Die Seitenverhältnis-Einstellungen wenden einen Letterbox-Effekt auf das Viewport an, um Komposition und Bildausschnitt zu steuern.
        </p>
      </div>
    </div>
  );
}
