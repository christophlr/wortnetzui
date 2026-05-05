import {
  Settings, Save, FolderOpen, Sun, Moon, Monitor
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';

interface TopBarProps {
  viewMode: '2D' | '3D';
  onViewModeChange: (mode: '2D' | '3D') => void;
  onSaveState?: () => void;
  onLoadState?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
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
  onSaveState, onLoadState, theme = 'system', onThemeChange
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

  return (
    <div className="h-11 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 gap-2 select-none shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <NetworkLogo />
        <span className="text-[12px] font-medium text-zinc-100 tracking-tight whitespace-nowrap">Wornetze</span>
      </div>

      <div className="h-4 w-px bg-zinc-800 mx-1 shrink-0" />

      {/* Menu */}
      <div className="flex items-center shrink-0">
        <DropdownMenu.Root open={fileMenuOpen} onOpenChange={setFileMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <button className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-200">
              Datei
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] bg-zinc-900 border border-zinc-800 rounded-md shadow-xl p-1 z-50"
              sideOffset={5}
              align="start"
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded cursor-pointer outline-none"
                onSelect={() => onSaveState?.()}
              >
                <Save size={12} />
                Zustand Speichern
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded cursor-pointer outline-none"
                onSelect={() => onLoadState?.()}
              >
                <FolderOpen size={12} />
                Zustand Laden
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        {['Bearbeiten', 'Ansicht', 'Fenster'].map(m => (
          <button
            key={m}
            className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
          >
            {m}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-zinc-800 mx-1 shrink-0" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex h-6 rounded overflow-hidden border border-zinc-700 bg-zinc-950">
          {(['2D', '3D'] as const).map((mode, i) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-3 text-[11px] transition-colors ${i > 0 ? 'border-l border-zinc-700' : ''} ${
                viewMode === mode
                  ? 'bg-cyan-600 text-white'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <button className="h-6 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 text-[11px] rounded border border-zinc-700/60 transition-colors">
          Exportieren
        </button>
        <button className="w-7 h-7 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
          <Settings size={13} />
        </button>

        <div className="h-4 w-px bg-zinc-800" />

        <button
          onClick={cycleTheme}
          title={themeTitle}
          className="w-7 h-7 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <ThemeIcon size={13} />
        </button>
      </div>
    </div>
  );
}