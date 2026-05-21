import {
  Save, FolderOpen, Sun, Moon, Monitor, Undo2, Redo2, Download,
  Keyboard
} from 'lucide-react';
import { Menubar, MenubarMenu, MenubarContent, MenubarGroup, MenubarItem, MenubarSeparator, MenubarShortcut, MenubarRadioGroup, MenubarRadioItem, MenubarLabel, MenubarSub, MenubarSubContent } from './ui/menubar';
import { useWortnetz } from '../context/WortnetzContext';
import { useProject } from '../hooks/useProject';
import { TopBarActionButton, TopBarMenuSubTrigger, TopBarMenuTrigger, TopBarPill, TopBarViewToggle } from './topbar/TopBarAtoms';
import { useT } from '../i18n/useT';
import { LANGUAGE_STORAGE_KEY, LANGUAGE_AUTO_KEY, normalizeLanguage } from '../i18n';
import { THEME_STORAGE_KEY, THEME_AUTO_KEY, resolveSystemTheme } from '../theme/tokens';
import faviconUrl from '../../../favicon.svg';

interface TopBarProps {
  onOpenShortcuts?: () => void;
  onExport?: () => void;
}

export function TopBar({
  onOpenShortcuts,
  onExport,
}: TopBarProps) {
  const {
    viewMode, setViewMode,
    themeMode, setThemeMode,
    themeAuto, setThemeAuto,
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

  const handleThemeChange = (v: string) => {
    if (v === 'system') {
      localStorage.setItem(THEME_AUTO_KEY, 'true');
      localStorage.removeItem(THEME_STORAGE_KEY);
      setThemeAuto(true);
      setThemeMode(resolveSystemTheme());
    } else {
      localStorage.setItem(THEME_AUTO_KEY, 'false');
      localStorage.setItem(THEME_STORAGE_KEY, v);
      setThemeAuto(false);
      setThemeMode(v as 'light' | 'dark');
    }
  };

  const currentThemeValue = themeAuto ? 'system' : themeMode;

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
          <img src={faviconUrl} alt="Logo" className="w-5 h-5" />
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
                  <MenubarLabel>{t('topbar.label.theme')}</MenubarLabel>
                  <MenubarRadioGroup value={currentThemeValue} onValueChange={handleThemeChange}>
                    <MenubarRadioItem value="light"><Sun size={12} strokeWidth={2} />{t('topbar.item.themeLight')}</MenubarRadioItem>
                    <MenubarRadioItem value="dark"><Moon size={12} strokeWidth={2} />{t('topbar.item.themeDark')}</MenubarRadioItem>
                    <MenubarRadioItem value="system"><Monitor size={12} strokeWidth={2} />{t('topbar.item.themeSystem')}</MenubarRadioItem>
                  </MenubarRadioGroup>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarSub>
                    <TopBarMenuSubTrigger>{t('topbar.label.language')}</TopBarMenuSubTrigger>
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
        <TopBarViewToggle
          value={viewMode}
          onChange={handleViewModeChange}
          titleTwoD={t('topbar.view.twoD')}
          titleThreeD={t('topbar.view.threeD')}
        />

        <TopBarActionButton onClick={onExport}>
          <Download size={12} strokeWidth={2.5} className="mr-1.5 opacity-70" />
          {t('topbar.action.export')}
        </TopBarActionButton>
      </TopBarPill>
    </div>
  );
}