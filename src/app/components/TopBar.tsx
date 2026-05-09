import {
  Settings, Save, FolderOpen, Sun, Moon, Monitor, Undo2, Redo2, Download,
  Square, Cuboid, PencilLine, MonitorPlay, CircleDashed, CircleDotDashed, RotateCcw
} from 'lucide-react';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarGroup, MenubarItem, MenubarSeparator, MenubarShortcut, MenubarRadioGroup, MenubarRadioItem, MenubarLabel } from './ui/menubar';
import { Button } from './ui/button';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

interface TopBarProps {
  viewMode: '2D' | '3D';
  onViewModeChange: (mode: '2D' | '3D') => void;
  onSaveState?: () => void;
  onLoadState?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  renderMode?: 'edit' | 'render';
  onRenderModeChange?: (mode: 'edit' | 'render') => void;
  onApplyNodeStylePreset?: (preset: 'outline' | 'filled' | 'reset') => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onExport?: () => void;
}

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


export function TopBar({
  viewMode, onViewModeChange,
  onSaveState, onLoadState, theme = 'system', onThemeChange,
  renderMode = 'edit', onRenderModeChange,
  onApplyNodeStylePreset,
  onUndo, onRedo, canUndo = false, canRedo = false,
  onExport,
}: TopBarProps) {
  const cycleTheme = () => {
    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    onThemeChange?.(next);
  };

  const themeTitle =
    theme === 'system' ? 'System (automatisch)' :
    theme === 'light'  ? 'Hell' : 'Dunkel';

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <div className="h-11 bg-background border-b border-border flex items-center px-3 gap-2 select-none shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <NetworkLogo />
        <span className="text-[12px] font-medium text-foreground tracking-tight whitespace-nowrap">Wortnetze</span>
      </div>

      {/* Menubar */}
      <div className="flex items-center shrink-0">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Datei</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem onSelect={() => onSaveState?.()}>
                  <Save size={12} />
                  Speichern
                  <MenubarShortcut>⌘S</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onSelect={() => onLoadState?.()}>
                  <FolderOpen size={12} />
                  Laden
                  <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Bearbeiten</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem onSelect={() => onUndo?.()} disabled={!canUndo}>
                  <Undo2 size={12} />
                  Rückgängig
                  <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onSelect={() => onRedo?.()} disabled={!canRedo}>
                  <Redo2 size={12} />
                  Wiederholen
                  <MenubarShortcut>⌘⇧Z</MenubarShortcut>
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Ansicht</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel>Darstellung</MenubarLabel>
                <MenubarRadioGroup value={viewMode} onValueChange={(v) => onViewModeChange(v as '2D' | '3D')}>
                  <MenubarRadioItem value="2D"><Square size={12} strokeWidth={2} fill={viewMode === '2D' ? 'currentColor' : 'none'} fillOpacity={0.12} />2D</MenubarRadioItem>
                  <MenubarRadioItem value="3D"><Cuboid size={12} strokeWidth={2} fill={viewMode === '3D' ? 'currentColor' : 'none'} fillOpacity={0.12} />3D</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarLabel>Modus</MenubarLabel>
                <MenubarRadioGroup value={renderMode ?? 'edit'} onValueChange={(v) => onRenderModeChange?.(v as 'edit' | 'render')}>
                  <MenubarRadioItem value="edit"><PencilLine size={12} strokeWidth={2} fill={renderMode === 'edit' ? 'currentColor' : 'none'} fillOpacity={0.12} />Bearbeiten</MenubarRadioItem>
                  <MenubarRadioItem value="render"><MonitorPlay size={12} strokeWidth={2} fill={renderMode === 'render' ? 'currentColor' : 'none'} fillOpacity={0.12} />Rendern</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarLabel>Design</MenubarLabel>
                <MenubarRadioGroup value={theme ?? 'system'} onValueChange={(v) => onThemeChange?.(v as 'light' | 'dark' | 'system')}>
                  <MenubarRadioItem value="light"><Sun size={12} strokeWidth={2} fill={theme === 'light' ? 'currentColor' : 'none'} fillOpacity={0.12} />Hell</MenubarRadioItem>
                  <MenubarRadioItem value="dark"><Moon size={12} strokeWidth={2} fill={theme === 'dark' ? 'currentColor' : 'none'} fillOpacity={0.12} />Dunkel</MenubarRadioItem>
                  <MenubarRadioItem value="system"><Monitor size={12} strokeWidth={2} fill={theme === 'system' ? 'currentColor' : 'none'} fillOpacity={0.12} />System</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Style</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem onSelect={() => onApplyNodeStylePreset?.('outline')}>
                  <CircleDashed size={12} />
                  Outline
                </MenubarItem>
                <MenubarItem onSelect={() => onApplyNodeStylePreset?.('filled')}>
                  <CircleDotDashed size={12} />
                  Filled
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onSelect={() => onApplyNodeStylePreset?.('reset')}>
                  <RotateCcw size={12} />
                  Reset
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="h-4 w-px bg-border mx-1 shrink-0" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && onViewModeChange(v as '2D' | '3D')}
          className="h-6 gap-0 border border-border rounded-md overflow-hidden bg-background"
        >
          <ToggleGroupItem value="2D" className="h-6 px-2.5 text-[11px]"><Square size={12} strokeWidth={2} fill={viewMode === '2D' ? 'currentColor' : 'none'} fillOpacity={0.12} />2D</ToggleGroupItem>
          <ToggleGroupItem value="3D" className="h-6 px-2.5 text-[11px] border-l border-border"><Cuboid size={12} strokeWidth={2} fill={viewMode === '3D' ? 'currentColor' : 'none'} fillOpacity={0.12} />3D</ToggleGroupItem>
        </ToggleGroup>

        <div className="h-4 w-px bg-border" />

        <ToggleGroup
          type="single"
          value={renderMode}
          onValueChange={(v) => v && onRenderModeChange?.(v as 'edit' | 'render')}
          className="h-6 gap-0 border border-border rounded-md overflow-hidden bg-background"
        >
          <ToggleGroupItem value="edit" className="h-6 px-2.5 text-[11px]"><PencilLine size={12} strokeWidth={2} fill={renderMode === 'edit' ? 'currentColor' : 'none'} fillOpacity={0.12} />Edit</ToggleGroupItem>
          <ToggleGroupItem value="render" className="h-6 px-2.5 text-[11px] border-l border-border"><MonitorPlay size={12} strokeWidth={2} fill={renderMode === 'render' ? 'currentColor' : 'none'} fillOpacity={0.12} />Render</ToggleGroupItem>
        </ToggleGroup>

        <div className="h-4 w-px bg-border" />

        <Button variant="outline" size="sm" className="h-6 text-[11px] px-2.5" onClick={() => onExport?.()}>
          <Download size={12} />Exportieren
        </Button>

        <div className="h-4 w-px bg-border" />

        <Button variant="ghost" size="icon" className="size-6" onClick={cycleTheme} title={themeTitle}>
          <ThemeIcon size={13} />
        </Button>
      </div>
    </div>
  );
}