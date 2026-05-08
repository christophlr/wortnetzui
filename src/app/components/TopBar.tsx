import {
  Settings, Save, FolderOpen, Sun, Moon, Monitor
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { buttonVariants } from './ui/button';
import { cn } from './ui/utils';

interface TopBarProps {
  viewMode: '2D' | '3D';
  onViewModeChange: (mode: '2D' | '3D') => void;
  onSaveState?: () => void;
  onLoadState?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  renderMode?: 'edit' | 'render';
  onRenderModeChange?: (mode: 'edit' | 'render') => void;
}

function NetworkLogo() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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
}: TopBarProps) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);

  const cycleTheme = () => {
    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    onThemeChange?.(next);
  };

  const themeTitle =
    theme === 'system' ? 'System (automatisch)' :
    theme === 'light'  ? 'Hell' : 'Dunkel';

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const segmentedButtonBase =
    'min-w-0 px-3 text-[11px] font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0';
  const neutralSegmentedButton =
    'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground';

  return (
    <div className="h-11 bg-background border-b border-border flex items-center px-3 gap-2 select-none shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <NetworkLogo />
        <span className="text-[12px] font-medium text-foreground tracking-tight whitespace-nowrap">Wortnetze</span>
      </div>

      <div className="h-4 w-px bg-border mx-1 shrink-0" />

      {/* Menu */}
      <div className="flex items-center shrink-0">
        <DropdownMenu.Root open={fileMenuOpen} onOpenChange={setFileMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'h-7 px-2 text-[11px] data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
              )}
            >
              Datei
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md z-50"
              sideOffset={5}
              align="start"
            >
              <DropdownMenu.Item
                className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-[11px] outline-none transition-colors select-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                onSelect={() => onSaveState?.()}
              >
                <Save size={12} />
                Zustand Speichern
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-[11px] outline-none transition-colors select-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                onSelect={() => onLoadState?.()}
              >
                <FolderOpen size={12} />
                Zustand Laden
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        {['Bearbeiten', 'Ansicht', 'Fenster'].map(m => (
          null
        ))}
      </div>

      <div className="h-4 w-px bg-border mx-1 shrink-0" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex h-6 rounded overflow-hidden border border-border bg-background">
          {(['2D', '3D'] as const).map((mode, i) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`h-6 ${segmentedButtonBase} ${i > 0 ? 'border-l border-border' : ''} ${
                viewMode === mode
                  ? 'border-border bg-accent text-accent-foreground shadow-sm'
                  : 'border-transparent bg-background text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex h-6 rounded overflow-hidden border border-border bg-background">
          {(['edit', 'render'] as const).map((mode, i) => (
            <button
              key={mode}
              onClick={() => onRenderModeChange?.(mode)}
              className={`h-6 capitalize ${segmentedButtonBase} ${i > 0 ? 'border-l border-border' : ''} ${
                renderMode === mode
                  ? 'border-border bg-accent text-accent-foreground shadow-sm'
                  : 'border-transparent bg-background text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-border" />

        <button className="h-6 px-3 rounded-md border border-border bg-background text-[11px] font-medium text-foreground shadow-sm transition-[color,background-color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0">
          Exportieren
        </button>
            <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent bg-transparent text-foreground transition-[color,background-color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0">
          <Settings size={13} />
        </button>

        <div className="h-4 w-px bg-border" />

        <button
          onClick={cycleTheme}
          title={themeTitle}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent bg-transparent text-foreground transition-[color,background-color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0"
        >
          <ThemeIcon size={13} />
        </button>
      </div>
    </div>
  );
}