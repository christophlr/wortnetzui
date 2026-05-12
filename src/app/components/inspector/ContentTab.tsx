import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export function ContentTab({
  localText,
  setLocalText,
  onTextChange,
  onParsingChange,
}: {
  localText: string;
  setLocalText: (text: string) => void;
  onTextChange: (text: string) => void;
  onParsingChange: (mode: 'sentence' | 'word' | 'both') => void;
}) {
  return (
    <div>
      <SidebarGroup className="py-4 pb-6 mt-2">
        <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">
          Eingabetext
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-3 space-y-4">
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
        </SidebarGroupContent>
      </SidebarGroup>

      <Separator className="bg-zinc-200/60 mx-4" />

      <SidebarGroup className="py-4 pb-6 mt-2">
        <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">
          Parse Modus
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-3">
          <RadioGroup defaultValue="word" onValueChange={onParsingChange} className="gap-4">
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
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
