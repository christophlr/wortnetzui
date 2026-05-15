import { Fullscreen, MonitorPlay, Tv, Image, FileText } from 'lucide-react';
import { RadioGroup } from '../../ui/radio-group';
import {
  SidebarInfoBox,
  SidebarRadioCard,
  SidebarSection,
  SidebarTabContent,
} from '../SidebarAtoms';

const ASPECT_RATIOS = [
  { id: 'full', label: 'Vollbild', icon: Fullscreen },
  { id: '16:9', label: '16:9 Cinema', icon: MonitorPlay },
  { id: '4:3', label: '4:3 Standard', icon: Tv },
  { id: '3:2', label: '3:2 Classic', icon: Image },
  { id: 'din', label: 'DIN Landscape', icon: FileText },
] as const;

export function CanvasTab({
  canvasAspectRatio,
  onCanvasAspectRatioChange,
}: {
  canvasAspectRatio: string;
  onCanvasAspectRatioChange?: (ratio: string) => void;
}) {
  return (
    <SidebarTabContent>
      <SidebarSection title="Seitenverhältnis">
        <RadioGroup
          value={canvasAspectRatio}
          onValueChange={(v) => onCanvasAspectRatioChange?.(v)}
          className="grid grid-cols-2 gap-2"
        >
          {ASPECT_RATIOS.map((ratio) => (
            <SidebarRadioCard
              key={ratio.id}
              id={`ratio-${ratio.id}`}
              value={ratio.id}
              label={ratio.label}
              icon={ratio.icon}
            />
          ))}
        </RadioGroup>
      </SidebarSection>

      <SidebarInfoBox>
        Hinweis: Die Seitenverhältnis-Einstellungen wenden einen Letterbox-Effekt auf das Viewport
        an, um Komposition und Bildausschnitt zu steuern.
      </SidebarInfoBox>
    </SidebarTabContent>
  );
}
