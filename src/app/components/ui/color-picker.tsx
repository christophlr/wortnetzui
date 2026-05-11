"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "./utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  trigger?: React.ReactNode;
}

export function ColorPicker({ color, onChange, className, trigger }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            className={cn(
              "w-[100px] h-8 justify-start text-left font-normal px-2 py-1 shrink-0",
              className
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <div
                className="size-4 rounded-sm border border-zinc-200 shrink-0"
                style={{ backgroundColor: color === 'auto' ? 'transparent' : color }}
              >
                {color === 'auto' && (
                  <div className="w-full h-full bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_50%,#ccc_50%,#ccc_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                )}
              </div>
              <span className="truncate text-[10px] uppercase font-mono">
                {color === 'auto' ? 'AUTO' : color}
              </span>
            </div>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3" align="end" side="left">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Hex Color
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={color === 'auto' ? '#' : color}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 text-[11px] font-mono"
              />
              <div className="relative size-8 shrink-0">
                <input
                  type="color"
                  value={color === 'auto' || !color.startsWith('#') ? '#000000' : color}
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="w-full h-full rounded border border-zinc-200"
                  style={{ backgroundColor: color === 'auto' ? '#000000' : color }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
             {['auto', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ffffff', '#000000'].map((c) => (
               <button
                 key={c}
                 onClick={() => {
                   onChange(c);
                   setOpen(false);
                 }}
                 className={cn(
                   "size-6 rounded-sm border border-zinc-200 hover:scale-110 transition-transform",
                   color === c && "ring-2 ring-zinc-900 ring-offset-1"
                 )}
                 style={{ backgroundColor: c === 'auto' ? 'transparent' : c }}
                 title={c}
               >
                 {c === 'auto' && (
                    <div className="w-full h-full bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_50%,#ccc_50%,#ccc_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                 )}
               </button>
             ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
