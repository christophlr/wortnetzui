import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { InspectorPanelSection, InspectorSectionHeader, InspectorSubgroup } from './InspectorAtoms';

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
  return (
    <div className="divide-y divide-zinc-300/80 dark:divide-zinc-800">
      <InspectorPanelSection>
        <InspectorSectionHeader title="Text" />
        <InspectorSubgroup className="space-y-4">
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
        </InspectorSubgroup>
      </InspectorPanelSection>

      <InspectorPanelSection>
        <InspectorSectionHeader title="Parse-Modus" />
        <InspectorSubgroup className="space-y-4">
          <RadioGroup value={parseMode} onValueChange={onParsingChange} className="gap-4">
            {[
              { id: 'sentence', label: 'Satzebene', desc: 'Sätze → Wort-N-Gramme' },
              { id: 'word', label: 'Wortebene', desc: 'Wörter → Zeichen-N-Gramme' },
              { id: 'both', label: 'Beides', desc: 'Wörter als Brücke' },
            ].map((item) => (
              <div key={item.id} className="flex items-start space-x-3 group cursor-pointer">
                <RadioGroupItem
                  value={item.id}
                  id={item.id}
                  className="mt-0.5 border-zinc-300 text-zinc-900"
                />
                <label
                  htmlFor={item.id}
                  className="text-[12px] font-semibold leading-tight cursor-pointer group-hover:text-zinc-900 text-zinc-800 transition-colors"
                >
                  {item.label}
                  <p className="text-[10px] text-zinc-400 font-normal mt-1">{item.desc}</p>
                </label>
              </div>
            ))}
          </RadioGroup>
        </InspectorSubgroup>
      </InspectorPanelSection>
    </div>
  );
}
