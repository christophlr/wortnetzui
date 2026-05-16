import { Atom, PaintRoller, Proportions, Type, Video } from 'lucide-react';
import type * as React from 'react';

export type SidebarTabId = 'content' | 'visual' | 'physics' | 'camera' | 'canvas';

export interface SidebarTabMeta {
  id: SidebarTabId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const SIDEBAR_TABS: readonly SidebarTabMeta[] = [
  { id: 'content', icon: Type },
  { id: 'visual',  icon: PaintRoller },
  { id: 'physics', icon: Atom },
  { id: 'camera',  icon: Video },
  { id: 'canvas',  icon: Proportions },
] as const;

export function getSidebarTab(id: SidebarTabId): SidebarTabMeta {
  const meta = SIDEBAR_TABS.find((t) => t.id === id);
  if (!meta) throw new Error(`Unknown sidebar tab id: ${id}`);
  return meta;
}

/**
 * Translation key for a tab's title — consumed by `t()`. Header H1 + the
 * activity-rail tooltip share this key.
 */
export const sidebarTabTitleKey = (id: SidebarTabId): string =>
  `sidebar.tab.${id}.title`;
