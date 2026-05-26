import { useState, useEffect } from 'react';
import type { ToolId } from '../components/Toolbar';

type ShortcutActionDefinitions = {
  onSave: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePlay: () => void;
  onToggleRecord: () => void;
  onToggleSidebar: () => void;
  onSelectTool?: (tool: ToolId) => void;
  onIncreaseBrushSize?: () => void;
  onDecreaseBrushSize?: () => void;
  activeTool?: ToolId;
};

export function useShortcuts(actions: ShortcutActionDefinitions) {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState([
    { id: '1', command: 'Speichern',       key: 's', tKey: 'dialogs.shortcuts.command.save' },
    { id: '2', command: 'Laden',           key: 'o', tKey: 'dialogs.shortcuts.command.load' },
    { id: '3', command: 'Rückgängig',      key: 'z', tKey: 'dialogs.shortcuts.command.undo' },
    { id: '4', command: 'Wiederholen',     key: 'Z', tKey: 'dialogs.shortcuts.command.redo' },
    { id: '5', command: 'Abspielen/Pause', key: ' ', tKey: 'dialogs.shortcuts.command.playPause' },
    { id: '6', command: 'Aufnahme',        key: 'r', tKey: 'dialogs.shortcuts.command.record' },
    { id: '7', command: 'Auswahl-Werkzeug', key: 'v', tKey: 'dialogs.shortcuts.command.toolPointer', noMod: true },
    { id: '8', command: 'Hand-Werkzeug',    key: 'h', tKey: 'dialogs.shortcuts.command.toolPan', noMod: true },
    { id: '9', command: 'Pinsel-Werkzeug',  key: 'b', tKey: 'dialogs.shortcuts.command.toolPaint', noMod: true },
    { id: '10', command: 'Zoom-Werkzeug',    key: 'z', tKey: 'dialogs.shortcuts.command.toolZoom', noMod: true },
    { id: '11', command: 'Glitch-Werkzeug',  key: 'g', tKey: 'dialogs.shortcuts.command.toolGlitch', noMod: true },
    { id: '12', command: 'Pfad-Werkzeug',    key: 'p', tKey: 'dialogs.shortcuts.command.toolPath', noMod: true },
    { id: '13', command: 'Pinsel verkleinern', key: '[', tKey: 'dialogs.shortcuts.command.brushDecrease', noMod: true },
    { id: '14', command: 'Pinsel vergrößern', key: ']', tKey: 'dialogs.shortcuts.command.brushIncrease', noMod: true },
  ]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target instanceof HTMLElement && e.target.getAttribute('contenteditable') === 'true');
      if (isInput) return;

      const isMod = e.metaKey || e.ctrlKey;
      
      // 1. Mod key shortcuts (Save, Load, Undo, Redo)
      if (isMod) {
        if (e.key === 's') { e.preventDefault(); actions.onSave(); return; }
        if (e.key === 'o') { e.preventDefault(); actions.onLoad(); return; }
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) actions.onRedo();
          else actions.onUndo();
          return;
        }
        if (e.key === 'y') { e.preventDefault(); actions.onRedo(); return; }
        return;
      }

      // 2. Single-key shortcuts
      if (e.key === ' ') { e.preventDefault(); actions.onTogglePlay(); return; }
      if (e.key.toLowerCase() === 'r') { e.preventDefault(); actions.onToggleRecord(); return; }
      
      // Brush size adjustments: only when activeTool is 'paint'
      if (actions.activeTool === 'paint') {
        if (e.key === '[') {
          e.preventDefault();
          actions.onDecreaseBrushSize?.();
          return;
        }
        if (e.key === ']') {
          e.preventDefault();
          actions.onIncreaseBrushSize?.();
          return;
        }
      }

      if (actions.onSelectTool) {
        const key = e.key.toLowerCase();
        if (key === 'v') { e.preventDefault(); actions.onSelectTool('pointer'); return; }
        if (key === 'h') { e.preventDefault(); actions.onSelectTool('pan'); return; }
        if (key === 'b') { e.preventDefault(); actions.onSelectTool('paint'); return; }
        if (key === 'z') { e.preventDefault(); actions.onSelectTool('zoom'); return; }
        if (key === 'g') { e.preventDefault(); actions.onSelectTool('glitch'); return; }
        if (key === 'p') { e.preventDefault(); actions.onSelectTool('path'); return; }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);

  const addShortcut = (command: string, key: string) => {
    setShortcuts(prev => [...prev, { id: Date.now().toString(), command, key }]);
  };

  const removeShortcut = (id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  return { isShortcutsOpen, setIsShortcutsOpen, shortcuts, addShortcut, removeShortcut };
}
