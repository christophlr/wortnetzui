import {
  Save, FolderOpen, Sun, Moon, Undo2, Redo2, Download,
  Square, Box, MonitorPlay,
  Keyboard
} from 'lucide-react';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarGroup, MenubarItem, MenubarSeparator, MenubarShortcut, MenubarRadioGroup, MenubarRadioItem, MenubarLabel } from './ui/menubar';
import { Button } from './ui/button';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { useWortnetz } from '../context/WortnetzContext';
import { useHistory } from '../hooks/useHistory';
import { useProject } from '../hooks/useProject';

function NetworkLogo() {
  return (
    <svg width="20.4" height="20.4" viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="8.5" r="2.5" fill="#3b9eff" />
      <circle cx="2" cy="3" r="1.4" fill="#3b9eff" opacity="0.5" />
      <circle cx="15" cy="3" r="1.4" fill="#3b9eff" opacity="0.5" />
      <circle cx="2.5" cy="14" r="1.4" fill="#3b9eff" opacity="0.5" />
      <circle cx="15" cy="14" r="1.4" fill="#3b9eff" opacity="0.5" />
      <circle cx="15.5" cy="8.5" r="1.2" fill="#3b9eff" opacity="0.35" />
      <line x1="8.5" y1="8.5" x2="2" y2="3" stroke="#3b9eff" strokeOpacity="0.28" strokeWidth="0.8" />
      <line x1="8.5" y1="8.5" x2="15" y2="3" stroke="#3b9eff" strokeOpacity="0.28" strokeWidth="0.8" />
      <line x1="8.5" y1="8.5" x2="2.5" y2="14" stroke="#3b9eff" strokeOpacity="0.28" strokeWidth="0.8" />
      <line x1="8.5" y1="8.5" x2="15" y2="14" stroke="#3b9eff" strokeOpacity="0.28" strokeWidth="0.8" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="8.5" stroke="#3b9eff" strokeOpacity="0.22" strokeWidth="0.8" />
      <line x1="2" y1="3" x2="15" y2="3" stroke="#3b9eff" strokeOpacity="0.12" strokeWidth="0.5" />
      <line x1="2.5" y1="14" x2="15" y2="14" stroke="#3b9eff" strokeOpacity="0.12" strokeWidth="0.5" />
    </svg>
  );
}

interface TopBarProps {
  onOpenShortcuts?: () => void;
  onExport?: () => void;
  onApplyNodeStylePreset?: (preset: 'outline' | 'filled' | 'reset') => void;
}

export function TopBar({
  onOpenShortcuts,
  onExport,
  onApplyNodeStylePreset
}: TopBarProps) {
  const { 
    viewMode, setViewMode, 
    themeMode, setThemeMode, 
    renderMode, setRenderMode,
    setPhysicsParams
  } = useWortnetz();
  
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { handleSave, handleLoad } = useProject();

  const handleViewModeChange = (mode: '2D' | '3D') => {
    setViewMode(mode);
    setPhysicsParams((p: any) => ({ ...p, gravity: mode === '2D' ? 3 : 0 }));
  };

  return (
    <div className="flex items-start justify-between w-full pointer-events-none select-none">
      {/* Left Pill: Logo & Menubar */}
      <div className="flex items-center gap-2 px-3 h-11 bg-sidebar border border-sidebar-border shadow-sm rounded-xl pointer-events-auto">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <NetworkLogo />
          <span className="text-[12px] font-medium text-foreground tracking-tight whitespace-nowrap">Wortnetze</span>
        </div>

        <div className="h-4 w-px bg-border/50 mx-1 shrink-0" />

        {/* Menubar */}
        <div className="flex items-center shrink-0">
          <Menubar className="bg-transparent border-none shadow-none h-auto p-0">
            <MenubarMenu>
              <MenubarTrigger className="h-8 hover:bg-accent/50 data-[state=open]:bg-accent/50">Datei</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem onSelect={handleSave}>
                    <Save size={12} />
                    Speichern
                    <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onSelect={handleLoad}>
                    <FolderOpen size={12} />
                    Laden
                    <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="h-8 hover:bg-accent/50 data-[state=open]:bg-accent/50">Bearbeiten</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem onSelect={undo} disabled={!canUndo}>
                    <Undo2 size={12} />
                    Rückgängig
                    <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onSelect={redo} disabled={!canRedo}>
                    <Redo2 size={12} />
                    Wiederholen
                    <MenubarShortcut>⌘⇧Z</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem onSelect={onOpenShortcuts}>
                    <Keyboard size={12} />
                    Tastaturkürzel...
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="h-8 hover:bg-accent/50 data-[state=open]:bg-accent/50">Ansicht</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarLabel>Modus</MenubarLabel>
                  <MenubarItem onSelect={() => setRenderMode(renderMode === 'edit' ? 'render' : 'edit')}>
                    <MonitorPlay size={12} strokeWidth={2} className={renderMode === 'render' ? 'text-blue-600' : 'text-muted-foreground'} />
                    Preview
                    <MenubarShortcut>{renderMode === 'render' ? 'AN' : 'AUS'}</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarLabel>Design</MenubarLabel>
                  <MenubarRadioGroup value={themeMode} onValueChange={(v) => setThemeMode(v as any)}>
                    <MenubarRadioItem value="light"><Sun size={12} strokeWidth={2} />Hell</MenubarRadioItem>
                    <MenubarRadioItem value="dark"><Moon size={12} strokeWidth={2} />Dunkel</MenubarRadioItem>
                  </MenubarRadioGroup>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      {/* Right Pill: Toggles & Actions */}
      <div className="flex items-center gap-3 px-3 h-11 bg-sidebar border border-sidebar-border shadow-sm rounded-xl pointer-events-auto">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && handleViewModeChange(v as '2D' | '3D')}
          className="h-7 gap-0 border border-zinc-200 rounded-md overflow-hidden bg-background/50"
        >
          <ToggleGroupItem value="2D" className="h-7 w-8 p-0 text-[11px] hover:bg-accent/50 data-[state=on]:bg-primary/10" title="2D Ansicht">
            <Square size={13} strokeWidth={2.5} fill={viewMode === '2D' ? 'currentColor' : 'none'} fillOpacity={0.12} />
          </ToggleGroupItem>
          <ToggleGroupItem value="3D" className="h-7 w-8 p-0 text-[11px] border-l border-zinc-200 hover:bg-accent/50 data-[state=on]:bg-primary/10" title="3D Ansicht">
            <Box size={13} strokeWidth={2.5} fill={viewMode === '3D' ? 'currentColor' : 'none'} fillOpacity={0.12} />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant="outline"
          size="sm"
          className={`h-7 px-3 text-[11px] font-medium transition-all duration-200 ${
            renderMode === 'render' 
              ? 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20 hover:text-blue-700' 
              : 'text-zinc-600 hover:bg-zinc-100 border-zinc-200'
          }`}
          onClick={() => setRenderMode(renderMode === 'edit' ? 'render' : 'edit')}
        >
          <MonitorPlay 
            size={12} 
            strokeWidth={2.5} 
            className={`mr-1.5 transition-transform duration-300 ${renderMode === 'render' ? 'scale-110' : 'opacity-70'}`}
          />
          Vorschau
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 px-3 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 border-zinc-200 transition-all duration-200" 
          onClick={onExport}
        >
          <Download size={12} strokeWidth={2.5} className="mr-1.5 opacity-70" />
          Exportieren
        </Button>
      </div>
    </div>
  );
}