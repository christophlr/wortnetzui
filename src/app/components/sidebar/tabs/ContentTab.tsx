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
  const parseOptions: Array<{ id: typeof parseMode; label: string; desc: string }> = [
    { id: 'sentence', label: 'Satzebene', desc: 'Sätze → Wort-N-Gramme' },
    { id: 'word', label: 'Wortebene', desc: 'Wörter → Zeichen-N-Gramme' },
    { id: 'both', label: 'Beides', desc: 'Wörter als Brücke' },
  ];

  return (
    <SidebarTabContent>
      <SidebarSection title="Text">
        <SidebarGroup stack="loose">
          <Textarea
            className="min-h-[260px] text-[12px] leading-relaxed resize-y bg-white border-zinc-200 focus-visible:ring-zinc-400 shadow-sm font-sans"
            placeholder="Text hier einfügen..."
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
          />
          <Button
            className="w-full h-9 text-xs gap-2 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md active:scale-[0.98] transition-transform"
            onClick={() => onTextChange(localText)}
          >
            <RefreshCw size={14} />
            Aktualisieren
          </Button>
        </SidebarGroup>
      </SidebarSection>

      <SidebarSection title="Parse-Modus">
        <SidebarGroup stack="loose">
          <RadioGroup value={parseMode} onValueChange={onParsingChange} className="gap-4">
            {parseOptions.map((item) => (
              <SidebarRadioRow
                key={item.id}
                id={item.id}
                value={item.id}
                label={item.label}
                description={item.desc}
              />
            ))}
          </RadioGroup>
        </SidebarGroup>
      </SidebarSection>
    </SidebarTabContent>
  );
}
