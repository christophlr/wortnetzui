import {
  Save, FolderOpen, Sun, Moon, Undo2, Redo2, Download,
  Square, Box, MonitorPlay,
  Keyboard
} from 'lucide-react';
import { Menubar, MenubarMenu, MenubarContent, MenubarGroup, MenubarItem, MenubarSeparator, MenubarShortcut, MenubarRadioGroup, MenubarRadioItem, MenubarLabel, MenubarSub, MenubarSubTrigger, MenubarSubContent } from './ui/menubar';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { useWortnetz } from '../context/WortnetzContext';
import { useProject } from '../hooks/useProject';
import { TopBarActionButton, TopBarMenuTrigger, TopBarPill } from './topbar/TopBarAtoms';
import { useT } from '../i18n/useT';
import { LANGUAGE_STORAGE_KEY, LANGUAGE_AUTO_KEY, normalizeLanguage } from '../i18n';

function NetworkLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="6.81 6.96 19 7 16.33 11 7 25 25 13 25 25 6.81 6.96"
        fill="none"
        stroke="var(--wn-brand-blue)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="7" cy="25" r="3" fill="var(--wn-brand-blue)" opacity="0.5" />
      <circle cx="7" cy="7" r="3" fill="var(--wn-brand-blue)" opacity="0.5" />
      <circle cx="25" cy="25" r="3" fill="var(--wn-brand-blue)" opacity="0.5" />
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
    setPhysicsParams,
    undo, redo, canUndo, canRedo
  } = useWortnetz();
  
  const { handleSave, handleLoad } = useProject();
  const { t, language, setLanguage } = useT();

  const handleLanguageChange = (v: string) => {
    if (v === 'auto') {
      localStorage.setItem(LANGUAGE_AUTO_KEY, 'true');
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      setLanguage(normalizeLanguage(navigator.language));
    } else {
      localStorage.setItem(LANGUAGE_AUTO_KEY, 'false');
      localStorage.setItem(LANGUAGE_STORAGE_KEY, v);
      setLanguage(normalizeLanguage(v));
    }
  };

  const autoDetect = localStorage.getItem(LANGUAGE_AUTO_KEY) === 'true';
  const currentLanguageValue = autoDetect ? 'auto' : language;

  const handleViewModeChange = (mode: '2D' | '3D') => {
    setViewMode(mode);
    setPhysicsParams((p: any) => ({ ...p, gravity: mode === '2D' ? 3 : 0 }));
  };

  return (
    <div className="flex items-start justify-between w-full pointer-events-none select-none">
      {/* Left Pill: Logo & Menubar */}
      <TopBarPill gap="gap-2">

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
              <TopBarMenuTrigger>{t('topbar.menu.file.label')}</TopBarMenuTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem onSelect={handleSave}>
                    <Save size={12} />
                    {t('topbar.item.save')}
                    <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onSelect={handleLoad}>
                    <FolderOpen size={12} />
                    {t('topbar.item.load')}
                    <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <TopBarMenuTrigger>{t('topbar.menu.edit.label')}</TopBarMenuTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem onSelect={undo} disabled={!canUndo}>
                    <Undo2 size={12} />
                    {t('topbar.item.undo')}
                    <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onSelect={redo} disabled={!canRedo}>
                    <Redo2 size={12} />
                    {t('topbar.item.redo')}
                    <MenubarShortcut>⌘⇧Z</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem onSelect={onOpenShortcuts}>
                    <Keyboard size={12} />
                    {t('topbar.item.shortcuts')}
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <TopBarMenuTrigger>{t('topbar.menu.view.label')}</TopBarMenuTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarLabel>{t('topbar.label.mode')}</MenubarLabel>
                  <MenubarItem onSelect={() => setRenderMode(renderMode === 'edit' ? 'render' : 'edit')}>
                    <MonitorPlay size={12} strokeWidth={2} className={renderMode === 'render' ? 'text-wn-topbar-toggle-text' : 'text-muted-foreground'} />
                    {t('topbar.item.preview')}
                    <MenubarShortcut>{renderMode === 'render' ? t('topbar.state.on') : t('topbar.state.off')}</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarLabel>{t('topbar.label.theme')}</MenubarLabel>
                  <MenubarRadioGroup value={themeMode} onValueChange={(v) => setThemeMode(v as any)}>
                    <MenubarRadioItem value="light"><Sun size={12} strokeWidth={2} />{t('topbar.item.themeLight')}</MenubarRadioItem>
                    <MenubarRadioItem value="dark"><Moon size={12} strokeWidth={2} />{t('topbar.item.themeDark')}</MenubarRadioItem>
                  </MenubarRadioGroup>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarSub>
                    <MenubarSubTrigger>{t('topbar.label.language')}</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarRadioGroup value={currentLanguageValue} onValueChange={handleLanguageChange}>
                        <MenubarRadioItem value="de">{t('topbar.language.de')}</MenubarRadioItem>
                        <MenubarRadioItem value="en">{t('topbar.language.en')}</MenubarRadioItem>
                        <MenubarSeparator />
                        <MenubarRadioItem value="auto">{t('topbar.language.auto')}</MenubarRadioItem>
                      </MenubarRadioGroup>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </TopBarPill>

      {/* Right Pill: Toggles & Actions */}
      <TopBarPill gap="gap-3">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && handleViewModeChange(v as '2D' | '3D')}
          className="h-7 gap-0 border border-border rounded-md overflow-hidden bg-background/50"
        >
          <ToggleGroupItem value="2D" className="h-7 w-8 p-0 text-[11px] hover:bg-accent/50 data-[state=on]:bg-primary/10" title={t('topbar.view.twoD')}>
            <Square size={13} strokeWidth={2.5} fill={viewMode === '2D' ? 'currentColor' : 'none'} fillOpacity={0.12} />
          </ToggleGroupItem>
          <ToggleGroupItem value="3D" className="h-7 w-8 p-0 text-[11px] border-l border-border hover:bg-accent/50 data-[state=on]:bg-primary/10" title={t('topbar.view.threeD')}>
            <Box size={13} strokeWidth={2.5} fill={viewMode === '3D' ? 'currentColor' : 'none'} fillOpacity={0.12} />
          </ToggleGroupItem>
        </ToggleGroup>

        <TopBarActionButton
          active={renderMode === 'render'}
          onClick={() => setRenderMode(renderMode === 'edit' ? 'render' : 'edit')}
        >
          <MonitorPlay
            size={12}
            strokeWidth={2.5}
            className={`mr-1.5 transition-transform duration-300 ${renderMode === 'render' ? 'scale-110' : 'opacity-70'}`}
          />
          {t('topbar.action.preview')}
        </TopBarActionButton>

        <TopBarActionButton onClick={onExport}>
          <Download size={12} strokeWidth={2.5} className="mr-1.5 opacity-70" />
          {t('topbar.action.export')}
        </TopBarActionButton>
      </TopBarPill>
    </div>
  );
}