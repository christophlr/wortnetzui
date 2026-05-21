import { MousePointer2, Hand, Paintbrush, View, Scale3D, Wand2, Route } from 'lucide-react';
import { ToolButton, ToolbarDivider, ToolbarShell } from './toolbar/ToolbarAtoms';
import { useT } from '../i18n/useT';

export type ToolId = 'pointer' | 'pan' | 'paint' | 'zoom' | 'scale' | 'glitch' | 'path';

interface ToolbarProps {
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  className?: string;
}

const TOOL_ICONS = {
  pointer: MousePointer2,
  pan: Hand,
  paint: Paintbrush,
  zoom: View,
  scale: Scale3D,
  glitch: Wand2,
  path: Route,
} as const satisfies Record<ToolId, unknown>;

function toolLabel(t: (key: string) => string, id: ToolId): string {
  return `${t(`toolbar.tool.${id}`)} (${t(`toolbar.shortcut.${id}`)})`;
}

export function Toolbar({ activeTool, onToolChange, className }: ToolbarProps) {
  const { t } = useT();
  const primary: ToolId[] = ['pointer', 'pan', 'paint', 'zoom', 'scale'];
  const advanced: ToolId[] = ['glitch', 'path'];

  const renderButton = (id: ToolId) => (
    <ToolButton
      key={id}
      id={id}
      activeId={activeTool}
      onSelect={onToolChange}
      icon={TOOL_ICONS[id]}
      label={toolLabel(t, id)}
    />
  );

  return (
    <ToolbarShell className={className}>
      {primary.map(renderButton)}
      <ToolbarDivider />
      {advanced.map(renderButton)}
    </ToolbarShell>
  );
}
