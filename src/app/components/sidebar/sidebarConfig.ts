import { Atom, PaintRoller, Proportions, Type, Video } from 'lucide-react';
import type * as React from 'react';

export type SidebarTabId = 'content' | 'visual' | 'physics' | 'camera' | 'canvas';

export interface SidebarTabMeta {
  id: SidebarTabId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  titleDe: string;
  titleEn: string;
}

export const SIDEBAR_TABS: readonly SidebarTabMeta[] = [
  { id: 'content', icon: Type,        titleDe: 'Inhalt',         titleEn: 'Content' },
  { id: 'visual',  icon: PaintRoller, titleDe: 'Visualisierung', titleEn: 'Visual'  },
  { id: 'physics', icon: Atom,        titleDe: 'Physik',         titleEn: 'Physics' },
  { id: 'camera',  icon: Video,       titleDe: 'Kamera',         titleEn: 'Camera'  },
  { id: 'canvas',  icon: Proportions, titleDe: 'Canvas',         titleEn: 'Canvas'  },
] as const;

export function getSidebarTab(id: SidebarTabId): SidebarTabMeta {
  const meta = SIDEBAR_TABS.find((t) => t.id === id);
  if (!meta) throw new Error(`Unknown sidebar tab id: ${id}`);
  return meta;
}
