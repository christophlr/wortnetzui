import { Fullscreen, MonitorPlay, Tv, Image, FileText } from 'lucide-react';
import { RadioGroup } from '../../ui/radio-group';
import {
  SidebarInfoBox,
  SidebarRadioCard,
  SidebarSection,
  SidebarTabContent,
} from '../SidebarAtoms';
import { useT } from '../../../i18n/useT';

type AspectRatioId = 'full' | '16x9' | '4x3' | '3x2' | 'din';

const ASPECT_RATIOS: Array<{ id: AspectRatioId; value: string; icon: typeof Fullscreen }> = [
  { id: 'full', value: 'full', icon: Fullscreen },
  { id: '16x9', value: '16:9', icon: MonitorPlay },
  { id: '4x3',  value: '4:3',  icon: Tv },
  { id: '3x2',  value: '3:2',  icon: Image },
  { id: 'din',  value: 'din',  icon: FileText },
];

export function CanvasTab({
  canvasAspectRatio,
  onCanvasAspectRatioChange,
}: {
  canvasAspectRatio: string;
  onCanvasAspectRatioChange?: (ratio: string) => void;
}) {
  const { t } = useT();
  return (
    <SidebarTabContent>
      <SidebarSection title={t('sidebar.tab.canvas.section.aspectRatio')}>
        <RadioGroup
          value={canvasAspectRatio}
          onValueChange={(v) => onCanvasAspectRatioChange?.(v)}
          className="grid grid-cols-2 gap-2"
        >
          {ASPECT_RATIOS.map((ratio) => (
            <SidebarRadioCard
              key={ratio.id}
              id={`ratio-${ratio.id}`}
              value={ratio.value}
              label={t(`sidebar.tab.canvas.aspect.${ratio.id}`)}
              icon={ratio.icon}
            />
          ))}
        </RadioGroup>
      </SidebarSection>

      <SidebarInfoBox>{t('sidebar.tab.canvas.hint')}</SidebarInfoBox>
    </SidebarTabContent>
  );
}
