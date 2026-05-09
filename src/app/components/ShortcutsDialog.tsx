import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, Command } from 'lucide-react';

interface Shortcut {
  id: string;
  command: string;
  key: string;
}

interface ShortcutsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: Shortcut[];
  onAddShortcut: (command: string, key: string) => void;
  onRemoveShortcut: (id: string) => void;
}

export function ShortcutsDialog({
  isOpen,
  onOpenChange,
  shortcuts,
  onAddShortcut,
  onRemoveShortcut,
}: ShortcutsDialogProps) {
  const [newCommand, setNewCommand] = useState('');
  const [newKey, setNewKey] = useState('');

  const handleAdd = () => {
    if (newCommand && newKey) {
      onAddShortcut(newCommand, newKey);
      setNewCommand('');
      setNewKey('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tastaturkürzel verwalten</DialogTitle>
          <DialogDescription>
            Hier kannst du Tastaturkürzel einsehen und neue hinzufügen.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            {shortcuts.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-md bg-accent/20 border border-border/50">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{s.command}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Command size={10} /> {s.key}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onRemoveShortcut(s.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 items-end pt-2 border-t">
            <div className="col-span-3 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Aktion</span>
              <Input 
                placeholder="z.B. Speichern" 
                value={newCommand} 
                onChange={(e) => setNewCommand(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-3 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Taste</span>
              <Input 
                placeholder="z.B. s" 
                value={newKey} 
                onChange={(e) => setNewKey(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <Button size="icon" className="h-8 w-8" onClick={handleAdd} disabled={!newCommand || !newKey}>
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fertig</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
