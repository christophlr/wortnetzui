"use client";

import * as React from 'react';
import { GripVertical, X, Play, Plus, Route, Trash2 } from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';

interface PathNode {
  id: string;
  label: string;
}

interface PathAnimatorUIProps {
  nodes: PathNode[];
  onReorder: (newNodes: PathNode[]) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function PathAnimatorUI({ nodes, onReorder, onRemove, onClose }: PathAnimatorUIProps) {
  return (
    <div className="absolute left-20 top-24 w-64 bg-zinc-50/95 backdrop-blur-xl border border-zinc-200 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300 pointer-events-auto">
      <div className="p-3 border-b border-zinc-200 bg-zinc-100/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route size={14} className="text-indigo-600" />
          <h3 className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">Pfad-Animator</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="p-2 max-h-[320px] overflow-auto space-y-1">
        {nodes.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className="text-[10px] text-zinc-400 italic">Klicke Knoten in der Vorschau an, um einen Pfad zu erstellen.</p>
          </div>
        ) : (
          nodes.map((node, index) => (
            <div 
              key={`${node.id}-${index}`}
              className="group flex items-center gap-2 p-2 bg-white border border-zinc-200 rounded-lg hover:border-indigo-300 transition-all shadow-sm"
            >
              <div className="cursor-grab active:cursor-grabbing text-zinc-300 group-hover:text-zinc-400">
                <GripVertical size={12} />
              </div>
              <div className="size-4 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[8px] font-bold text-indigo-600 shrink-0">
                {index + 1}
              </div>
              <span className="flex-1 text-[11px] font-medium text-zinc-600 truncate">{node.label}</span>
              <button 
                onClick={() => onRemove(node.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-zinc-100/30 border-t border-zinc-200 space-y-2">
        <Button size="sm" className="w-full h-8 text-[11px] gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100">
          <Play size={12} fill="currentColor" />
          Sequenz abspielen
        </Button>
        <p className="text-[9px] text-zinc-400 text-center italic">
          Knoten werden mittels Catmull-Rom interpoliert.
        </p>
      </div>
    </div>
  );
}
