import { RefreshCw } from 'lucide-react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { RadioGroup } from '../../ui/radio-group';
import {
  SidebarGroup,
  SidebarRadioRow,
  SidebarSection,
  SidebarTabContent,
} from '../SidebarAtoms';
import { useT } from '../../../i18n/useT';

const PARSE_OPTIONS: Array<{ id: 'sentence' | 'word' | 'both' }> = [
  { id: 'sentence' },
  { id: 'word' },
  { id: 'both' },
];

export function ContentTab({
  localText,
  setLocalText,
  onTextChange,
  parseMode,
  onParsingChange,
}: {
  localText: string;
  setLocalText: (text: string) => void;
  onTextChange: (text: string) => void;
  parseMode: 'sentence' | 'word' | 'both';
  onParsingChange: (mode: 'sentence' | 'word' | 'both') => void;
}) {
  const { t } = useT();
  return (
    <SidebarTabContent>
      <SidebarSection title={t('sidebar.tab.content.section.text')}>
        <SidebarGroup stack="loose">
          <Textarea
            className="min-h-[260px] text-[12px] leading-relaxed resize-y bg-card border-border focus-visible:ring-ring shadow-sm font-sans"
            placeholder={t('sidebar.tab.content.textarea.placeholder')}
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
          />
          <Button
            className="w-full h-9 text-xs gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md active:scale-[0.98] transition-transform"
            onClick={() => onTextChange(localText)}
          >
            <RefreshCw size={14} />
            {t('sidebar.tab.content.refresh')}
          </Button>
        </SidebarGroup>
      </SidebarSection>

      <SidebarSection title={t('sidebar.tab.content.section.parseMode')}>
        <SidebarGroup stack="loose">
          <RadioGroup value={parseMode} onValueChange={onParsingChange} className="gap-4">
            {PARSE_OPTIONS.map((item) => (
              <SidebarRadioRow
                key={item.id}
                id={item.id}
                value={item.id}
                label={t(`sidebar.tab.content.parse.${item.id}.label`)}
                description={t(`sidebar.tab.content.parse.${item.id}.desc`)}
              />
            ))}
          </RadioGroup>
        </SidebarGroup>
      </SidebarSection>
    </SidebarTabContent>
  );
}
