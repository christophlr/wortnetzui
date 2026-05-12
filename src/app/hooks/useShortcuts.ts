import { useState, useEffect } from 'react';

type ShortcutActionDefinitions = {
  onSave: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePlay: () => void;
  onToggleRecord: () => void;
  onToggleSidebar: () => void;
};

export function useShortcuts(actions: ShortcutActionDefinitions) {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState([
    { id: '1', command: 'Speichern', key: 's' },
    { id: '2', command: 'Laden', key: 'o' },
    { id: '3', command: 'Rückgängig', key: 'z' },
    { id: '4', command: 'Wiederholen', key: 'Z' }, // shift+z
    { id: '5', command: 'Abspielen/Pause', key: ' ' },
    { id: '6', command: 'Aufnahme', key: 'r' },
  ]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInput) return;

      const isMod = e.metaKey || e.ctrlKey;
      
      const match = shortcuts.find(s => {
        if (s.key === ' ' && e.code === 'Space') return true;
        if (s.key.toLowerCase() === 'r' && e.key.toLowerCase() === 'r' && !isMod) return true;
        if (s.key === 'Z' && e.key === 'Z' && isMod && e.shiftKey) return true;
        if (s.key === 'z' && e.key === 'z' && isMod && !e.shiftKey) return true;
        return isMod && e.key.toLowerCase() === s.key.toLowerCase() && !e.shiftKey;
      });

      if (match) {
        e.preventDefault();
        switch (match.command) {
          case 'Speichern': actions.onSave(); break;
          case 'Laden': actions.onLoad(); break;
          case 'Rückgängig': actions.onUndo(); break;
          case 'Wiederholen': actions.onRedo(); break;
          case 'Abspielen/Pause': actions.onTogglePlay(); break;
          case 'Aufnahme': actions.onToggleRecord(); break;
          case 'Sidebar umschalten': actions.onToggleSidebar(); break;
        }
      } else if (isMod && e.key === 'y') {
        e.preventDefault();
        actions.onRedo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts, actions]);

  const addShortcut = (command: string, key: string) => {
    setShortcuts(prev => [...prev, { id: Date.now().toString(), command, key }]);
  };

  const removeShortcut = (id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  return { isShortcutsOpen, setIsShortcutsOpen, shortcuts, addShortcut, removeShortcut };
}
