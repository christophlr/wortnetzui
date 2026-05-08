import * as Accordion from '@radix-ui/react-accordion';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Slider from '@radix-ui/react-slider';
import * as Tabs from '@radix-ui/react-tabs';
import { ChevronRight, Diamond, Type, Layers, Camera, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { NodeShape } from '../networkTheme';

const GRADIENT_PRESETS = [
  { name: 'Cyan → Grün', inner: '#06b6d4', outer: '#10b981' },
  { name: 'Lila → Pink', inner: '#a855f7', outer: '#ec4899' },
  { name: 'Orange → Rot', inner: '#f97316', outer: '#ef4444' },
  { name: 'Blau → Violett', inner: '#3b82f6', outer: '#8b5cf6' },
  { name: 'Gold → Kupfer', inner: '#f59e0b', outer: '#b45309' },
];

/* ─── helpers ─── */

function KfDiamond({ active, color, onClick }: { active: boolean; color: 'teal' | 'orange' | 'purple'; onClick: () => void }) {
  const cls = {
    teal:   active ? 'text-teal-400'   : 'text-muted-foreground/40 hover:text-muted-foreground/60',
    orange: active ? 'text-orange-400' : 'text-muted-foreground/40 hover:text-muted-foreground/60',
    purple: active ? 'text-purple-400' : 'text-muted-foreground/40 hover:text-muted-foreground/60',
  }[color];

  return (
    <button
      onClick={onClick}
      className={`w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors hover:bg-muted/50 ${cls}`}
    >
      <Diamond size={8} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}

function NumInput({ defaultValue, mono = true }: { defaultValue: number | string; mono?: boolean }) {
  return (
    <input
      type="number"
      defaultValue={defaultValue}
      className={`w-16 h-6 px-1.5 bg-input border border-border hover:border-border focus:border-border rounded text-[11px] text-foreground text-right focus:outline-none transition-colors shrink-0 ${mono ? 'font-mono' : ''}`}
    />
  );
}

function ParamRow({
  kfKey, label, value, color = 'teal', kfs, onToggle,
}: {
  kfKey: string; label: string; value: number; color?: 'teal' | 'orange' | 'purple';
  kfs: Record<string, boolean>; onToggle: (k: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 h-[26px]">
      <KfDiamond active={kfs[kfKey]} color={color} onClick={() => onToggle(kfKey)} />
      <span className="text-[11px] text-muted-foreground flex-1 truncate">{label}</span>
      <NumInput defaultValue={value} />
    </div>
  );
}

/*
 * SliderParam — numeric slider with click-to-type value editing.
 *
 * The numeric badge on the right is always clickable: clicking it opens an
 * inline input so the user can type an exact value with the keyboard.
 * Press Enter or Tab to commit, Escape to cancel.
 *
 * Props:
 *   displayFn   — converts raw slider value array → display string (e.g. v[0] * 10)
 *   parseInput  — converts a typed string back to the raw slider integer; defaults to
 *                 clamping the parsed number to [min, max]. For scaled params (e.g.
 *                 repulsion where display = slider * 10) pass e.g. s => parseFloat(s) / 10.
 *   description — short help text shown below the slider row.
 */
function SliderParam({
  kfKey, label, value, onChange, color, kfs, onToggle,
  displayFn, parseInput, description, min = 0, max = 200,
}: {
  kfKey: string; label: string; value: number[]; onChange: (v: number[]) => void;
  color: 'teal' | 'orange'; kfs: Record<string, boolean>; onToggle: (k: string) => void;
  displayFn?: (v: number[]) => string;
  parseInput?: (s: string) => number;
  description?: string;
  min?: number; max?: number;
}) {
  const trackCls = color === 'teal' ? 'bg-teal-600/50' : 'bg-orange-600/50';
  const thumbCls = color === 'teal' ? 'bg-teal-400' : 'bg-orange-400';
  const focusBorderCls = color === 'teal' ? 'border-teal-500/60' : 'border-orange-500/60';

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayStr = displayFn ? displayFn(value) : String(value[0]);

  const startEdit = () => {
    setDraft(displayStr);
    setEditing(true);
    // Focus after render
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    if (draft.trim() !== '') {
      const parsed = parseInput
        ? parseInput(draft)
        : Math.max(min, Math.min(max, Math.round(parseFloat(draft) || min)));
      const clamped = Math.max(min, Math.min(max, Math.round(parsed)));
      onChange([clamped]);
    }
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <KfDiamond active={kfs[kfKey]} color={color} onClick={() => onToggle(kfKey)} />
        <span className="text-[11px] text-muted-foreground flex-1">{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commitEdit(); }
              if (e.key === 'Escape') setEditing(false);
            }}
            className={`w-12 h-5 px-1 bg-input border ${focusBorderCls} rounded text-[11px] font-mono text-right text-foreground focus:outline-none shrink-0`}
            autoFocus
          />
        ) : (
          <button
            onClick={startEdit}
            title="Click to type a value"
            className="text-[11px] font-mono text-muted-foreground/60 hover:text-muted-foreground w-12 text-right shrink-0 cursor-text tabindex-0"
          >
            {displayStr}
          </button>
        )}
      </div>
      <div className="pl-7">
        <Slider.Root
          className="relative flex items-center w-full h-4"
          value={value} onValueChange={onChange} min={min} max={max} step={1}
        >
          <Slider.Track className="bg-border relative grow rounded-full h-[2px]">
            <Slider.Range className={`absolute rounded-full h-full ${trackCls}`} />
          </Slider.Track>
          <Slider.Thumb className={`block w-2.5 h-2.5 border-[1.5px] border-background rounded-full hover:scale-125 focus:outline-none transition-transform cursor-grab ${thumbCls}`} />
        </Slider.Root>
      </div>
      {description && (
        <p className="text-[9px] text-muted-foreground/50 mt-1 pl-7 leading-relaxed">{description}</p>
      )}
    </div>
  );
}

function AccSection({
  value, label, color, children,
}: {
  value: string; label: string; color?: 'teal' | 'orange' | 'purple'; children: React.ReactNode;
}) {
  const borderCls = {
    teal:   'border-l-teal-500/60',
    orange: 'border-l-orange-500/60',
    purple: 'border-l-purple-500/60',
  };
  const dotCls = {
    teal:   'bg-teal-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <Accordion.Item value={value} className="border-b border-border/50">
      <Accordion.Header asChild>
        <div>
          <Accordion.Trigger
            className={`w-full flex items-center gap-2.5 px-3 h-9 transition-colors hover:bg-muted/30 group ${
              color ? `border-l-2 ${borderCls[color]}` : 'pl-3'
            }`}
          >
            {color && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls[color]}`} />}
            {!color && <ChevronRight size={11} className="text-muted-foreground/40 transition-transform duration-150 group-data-[state=open]:rotate-90 shrink-0" />}
            <span className="text-[11px] font-medium text-foreground flex-1 text-left">{label}</span>
            {color && <ChevronRight size={11} className="text-muted-foreground/60 transition-transform duration-150 group-data-[state=open]:rotate-90" />}
          </Accordion.Trigger>
        </div>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-none">
        <div className="px-3 pb-3 pt-1.5 bg-[#00000000]">
          {children}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest block mb-1.5 mt-2.5 first:mt-0">
      {children}
    </span>
  );
}

/* ─── main ─── */

interface InspectorProps {
  onPhysicsChange?: (params: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
  }) => void;
  onTextChange?: (text: string) => void;
  onParsingChange?: (mode: 'sentence' | 'word' | 'both') => void;
  onGradientChange?: (settings: { mode: 'solid' | 'gradient'; innerColor: string; outerColor: string }) => void;
  onStyleChange?: (settings: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape: NodeShape; nodeBorderWidth: number; depthSizeEnabled: boolean; depthSizeStrength: number }) => void;
  onNodeAppearanceChange?: (a: { borderColor: 'auto' | string; fillColor: 'auto' | string; textColor: 'auto' | string }) => void;
  onEdgeAppearanceChange?: (a: { color: 'auto' | string }) => void;
  currentTime?: number;
  cameraKeyframes?: Array<{ time: number; position: any; target: any }>;
  onDeleteKeyframe?: (time: number) => void;
  width?: number;
  viewMode?: '2D' | '3D';
}

const PHYSICS_DEFAULTS_3D = { repulsion: 150, springK: 6, damping: 88, minSpeed: 0.5, linkDistance: 80, gravity: 0, turbulence: 0 };
const PHYSICS_DEFAULTS_2D = { repulsion: 150, springK: 6, damping: 88, minSpeed: 0.5, linkDistance: 80, gravity: 3, turbulence: 0 };

export function Inspector({
  onPhysicsChange,
  onTextChange,
  onParsingChange,
  onGradientChange,
  onStyleChange,
  onNodeAppearanceChange,
  onEdgeAppearanceChange,
  currentTime = 0,
  cameraKeyframes = [],
  onDeleteKeyframe,
  width = 268,
  viewMode = '3D',
}: InspectorProps = {}) {
  const [kfs, setKfs] = useState<Record<string, boolean>>({
    nodeBorderWidth: false, depthSizeStrength: false,
    edgeOpacity: false, edgeWidth: false, nodeScale: false,
    repulsion: false, springK: true, damping: false, minSpeed: false,
    linkDistance: false, gravity: false, turbulence: false,
  });
  const [parsingMode, setParsingMode] = useState('word');
  const [zoomVal, setZoomVal] = useState([800]);
  const [repulsionVal, setRepulsionVal] = useState([150]);
  const [springKVal, setSpringKVal] = useState([6]);
  const [dampingVal, setDampingVal] = useState([88]);
  const [minSpeedVal, setMinSpeedVal] = useState(0.5);
  const [linkDistanceVal, setLinkDistanceVal] = useState([80]);
  const [gravityVal, setGravityVal] = useState([0]);
  const [turbulenceVal, setTurbulenceVal] = useState([0]);
  const [textInput, setTextInput] = useState(`Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes far away up the hill. It was 3am that day cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write I write like a ritual over and over. The more exist the more I go I fly they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.`);
  // Gradient settings
  const [gradientMode, setGradientMode] = useState<'solid' | 'gradient'>('gradient');
  const [innerColor, setInnerColor] = useState('#06b6d4');
  const [outerColor, setOuterColor] = useState('#10b981');
  // Style settings
  const [nodeShapeVal, setNodeShapeVal] = useState<NodeShape>('rectangle');
  const [nodeBorderWidthVal, setNodeBorderWidthVal] = useState([2]);
  const [depthSizeEnabled, setDepthSizeEnabled] = useState(false);
  const [depthSizeStrengthVal, setDepthSizeStrengthVal] = useState([50]);
  const [edgeOpacity, setEdgeOpacity] = useState([85]);
  const [edgeWidth, setEdgeWidth] = useState([2]);
  const [nodeScale, setNodeScale] = useState([100]);
  // Appearance colors
  const [nodeBorderColor, setNodeBorderColor] = useState<string | 'auto'>('auto');
  const [nodeFillColor, setNodeFillColor] = useState<string | 'auto'>('auto');
  const [nodeTextColor, setNodeTextColor] = useState<string | 'auto'>('auto');
  const [edgeColor, setEdgeColor] = useState<string | 'auto'>('auto');

  const toggle = (k: string) => setKfs(prev => ({ ...prev, [k]: !prev[k] }));

  // Notify parent of physics changes
  const notifyPhysicsChange = () => {
    onPhysicsChange?.({
      repulsion: repulsionVal[0] * 10,
      springK: springKVal[0] / 100,
      damping: dampingVal[0] / 100,
      minSpeed: minSpeedVal,
      linkDistance: linkDistanceVal[0],
      gravity: gravityVal[0],
      turbulence: turbulenceVal[0],
    });
  };

  // Call on mount and when values change
  useEffect(() => {
    notifyPhysicsChange();
  }, [repulsionVal, springKVal, dampingVal, minSpeedVal, linkDistanceVal, gravityVal, turbulenceVal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync gravity default when viewMode switches
  useEffect(() => {
    setGravityVal([viewMode === '2D' ? 3 : 0]);
  }, [viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify gradient changes
  useEffect(() => {
    onGradientChange?.({ mode: gradientMode, innerColor, outerColor });
  }, [gradientMode, innerColor, outerColor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify style changes
  useEffect(() => {
    onStyleChange?.({
      edgeOpacity: edgeOpacity[0] / 100,
      edgeWidth: edgeWidth[0],
      nodeScale: nodeScale[0] / 100,
      nodeShape: nodeShapeVal,
      nodeBorderWidth: nodeBorderWidthVal[0],
      depthSizeEnabled,
      depthSizeStrength: depthSizeStrengthVal[0],
    });
  }, [edgeOpacity, edgeWidth, nodeScale, nodeShapeVal, nodeBorderWidthVal, depthSizeEnabled, depthSizeStrengthVal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify appearance changes
  useEffect(() => {
    onNodeAppearanceChange?.({ borderColor: nodeBorderColor, fillColor: nodeFillColor, textColor: nodeTextColor });
  }, [nodeBorderColor, nodeFillColor, nodeTextColor]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onEdgeAppearanceChange?.({ color: edgeColor });
  }, [edgeColor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parsing mode changes
  useEffect(() => {
    onParsingChange?.(parsingMode as 'sentence' | 'word' | 'both');
  }, [parsingMode]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div className="bg-background border-r border-border flex flex-col shrink-0 overflow-hidden" style={{ width }}>
      {/* Panel Header */}
      

      <Tabs.Root defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <Tabs.List className="flex border-b border-border shrink-0">
          <Tabs.Trigger
            value="content"
            className="flex-1 h-9 flex items-center justify-center gap-1 text-[10px] text-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:bg-muted transition-colors border-b-2 border-transparent data-[state=active]:border-purple-500/60"
          >
            <Type size={10} />Inhalt
          </Tabs.Trigger>
          <Tabs.Trigger
            value="visual"
            className="flex-1 h-9 flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-muted transition-colors border-b-2 border-transparent data-[state=active]:border-teal-500/60"
          >
            <Layers size={10} />Visuell
          </Tabs.Trigger>
          <Tabs.Trigger
            value="camera"
            className="flex-1 h-9 flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-muted transition-colors border-b-2 border-transparent data-[state=active]:border-teal-500/60"
          >
            <Camera size={10} />Kamera
          </Tabs.Trigger>
          <Tabs.Trigger
            value="physics"
            className="flex-1 h-9 flex items-center justify-center gap-1 text-[10px] text-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:bg-muted transition-colors border-b-2 border-transparent data-[state=active]:border-orange-500/60"
          >
            <Zap size={10} />Physik
          </Tabs.Trigger>
        </Tabs.List>

        {/* CONTENT TAB */}
        <Tabs.Content value="content" className="flex-1 overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={['text', 'parsing']}>
            {/* TEXT */}
            <AccSection value="text" label="Text">
              <textarea
                className="w-full h-[176px] bg-input border border-border hover:border-border focus:border-border rounded px-2.5 py-2 text-[11px] text-foreground resize-none focus:outline-none transition-colors leading-relaxed"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button
                onClick={() => onTextChange?.(textInput)}
                className="w-full mt-2 h-7 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-[11px] rounded border border-blue-700/40 hover:border-blue-600/50 transition-colors"
              >
                Anwenden
              </button>
            </AccSection>

            {/* PARSING */}
            <AccSection value="parsing" label="Parsing / Zerteilung" color="purple">
              <RadioGroup.Root value={parsingMode} onValueChange={setParsingMode} className="flex flex-col gap-1">
                {[
                  { value: 'sentence', label: 'Satzebene', desc: 'Sätze → Wort-N-Gramme' },
                  { value: 'word', label: 'Wortebene', desc: 'Wörter → Zeichen-N-Gramme' },
                  { value: 'both', label: 'Beides', desc: 'Beide Ebenen (Wörter als Brücke)' },
                ].map(opt => (
                  <label key={opt.value} className="flex flex-col cursor-pointer group py-0.5">
                    <div className="flex items-center gap-2.5 h-6">
                      <RadioGroup.Item
                        value={opt.value}
                        className="w-3.5 h-3.5 rounded-full border border-border data-[state=checked]:border-purple-500 bg-input shrink-0 flex items-center justify-center transition-colors"
                      >
                        <RadioGroup.Indicator>
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        </RadioGroup.Indicator>
                      </RadioGroup.Item>
                      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{opt.label}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground/60 pl-6">{opt.desc}</span>
                  </label>
                ))}
              </RadioGroup.Root>
            </AccSection>
          </Accordion.Root>
        </Tabs.Content>

        {/* VISUAL TAB */}
        <Tabs.Content value="visual" className="flex-1 overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={['gradient', 'nodes', 'edges']}>

            {/* VERLAUF */}
            <AccSection value="gradient" label="Verlauf" color="purple">
              {/* Mode toggle */}
              <div className="flex rounded border border-border overflow-hidden mb-3">
                <button
                  onClick={() => setGradientMode('solid')}
                  className={`flex-1 h-7 text-[11px] transition-colors ${gradientMode === 'solid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Einfarbig
                </button>
                <button
                  onClick={() => setGradientMode('gradient')}
                  className={`flex-1 h-7 text-[11px] transition-colors border-l border-border ${gradientMode === 'gradient' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Verlauf
                </button>
              </div>

              {gradientMode === 'solid' ? (
                <div className="flex items-center gap-2 h-[26px]">
                  <span className="text-[11px] text-muted-foreground flex-1">Knotenfarbe</span>
                  <input
                    type="color" value={innerColor} onChange={e => setInnerColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-border bg-input p-0.5"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">Innen</span>
                    <input
                      type="color" value={innerColor} onChange={e => setInnerColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border border-border bg-input p-0.5"
                    />
                  </div>
                  <div
                    className="flex-1 h-6 rounded border border-border"
                    style={{ background: `linear-gradient(to right, ${innerColor}, ${outerColor})` }}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">Außen</span>
                    <input
                      type="color" value={outerColor} onChange={e => setOuterColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border border-border bg-input p-0.5"
                    />
                  </div>
                </div>
              )}

              {/* Preset chips */}
              <SubLabel>Schnellauswahl</SubLabel>
              <div className="flex gap-1.5 flex-wrap">
                {GRADIENT_PRESETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setGradientMode('gradient'); setInnerColor(p.inner); setOuterColor(p.outer); }}
                    title={p.name}
                    className="w-8 h-8 rounded border border-border/60 hover:border-border transition-all hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${p.inner}, ${p.outer})` }}
                  />
                ))}
              </div>
            </AccSection>

            {/* KNOTEN */}
            <AccSection value="nodes" label="Knoten" color="teal">
              {/* Shape selector */}
              <SubLabel>Form</SubLabel>
              <div className="flex gap-1 mb-3">
                {(['rectangle', 'rounded-rectangle', 'ellipse'] as NodeShape[]).map(shape => (
                  <button
                    key={shape}
                    onClick={() => setNodeShapeVal(shape)}
                    title={shape}
                    className={`flex-1 h-9 flex items-center justify-center rounded border transition-colors ${
                      nodeShapeVal === shape
                        ? 'bg-teal-600/20 border-teal-500/60 text-teal-300'
                        : 'bg-input border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {shape === 'rectangle' && <rect x="1" y="2" width="22" height="12" rx="0" />}
                      {shape === 'rounded-rectangle' && <rect x="1" y="2" width="22" height="12" rx="4" />}
                      {shape === 'ellipse' && <ellipse cx="12" cy="8" rx="11" ry="6" />}
                    </svg>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <SliderParam
                  kfKey="nodeBorderWidth" label="Rahmenbreite" value={nodeBorderWidthVal} onChange={setNodeBorderWidthVal}
                  color="teal" kfs={kfs} onToggle={toggle} min={0} max={8}
                  displayFn={v => v[0] + 'px'}
                  description="Stärke der Knotenumrandung."
                />
              </div>

              <SubLabel>Farben</SubLabel>
              <div className="space-y-2 mb-3">
                {([
                  { label: 'Rahmen', value: nodeBorderColor, set: setNodeBorderColor, hint: 'auto = Verlaufsfarbe' },
                  { label: 'Füllung', value: nodeFillColor, set: setNodeFillColor, hint: 'auto = Hintergrund' },
                  { label: 'Text', value: nodeTextColor, set: setNodeTextColor, hint: 'auto = Verlaufsfarbe' },
                ] as { label: string; value: string | 'auto'; set: (v: string | 'auto') => void; hint: string }[]).map(({ label, value, set, hint }) => (
                  <div key={label} className="flex items-center gap-2 h-[26px]">
                    <span className="text-[11px] text-muted-foreground flex-1 truncate">{label}</span>
                    <input
                      type="color"
                      value={value === 'auto' ? '#6b7280' : value}
                      onChange={e => set(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border border-border bg-input p-0.5"
                      title={value === 'auto' ? hint : value}
                    />
                    {value !== 'auto' && (
                      <button onClick={() => set('auto')} className="text-[10px] text-muted-foreground hover:text-foreground px-1" title="Zurücksetzen">↺</button>
                    )}
                  </div>
                ))}
              </div>

              <SubLabel>Tiefengröße</SubLabel>
              <div className="flex items-center gap-2 h-[26px] mb-2">
                <span className="text-[11px] text-muted-foreground flex-1">Nach Tiefe skalieren</span>
                <button
                  onClick={() => setDepthSizeEnabled(v => !v)}
                  className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${depthSizeEnabled ? 'bg-teal-500/70' : 'bg-border'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white shadow absolute top-[3px] transition-transform ${depthSizeEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                </button>
              </div>
              {depthSizeEnabled && (
                <div className="mb-3">
                  <SliderParam
                    kfKey="depthSizeStrength" label="Stärke" value={depthSizeStrengthVal} onChange={setDepthSizeStrengthVal}
                    color="teal" kfs={kfs} onToggle={toggle} min={0} max={100}
                    displayFn={v => v[0] + '%'}
                    description="Größenvariation: Innere Knoten (1 Wort) werden größer, äußere kleiner."
                  />
                </div>
              )}

              <SliderParam
                kfKey="nodeScale" label="Node-Größe" value={nodeScale} onChange={setNodeScale}
                color="teal" kfs={kfs} onToggle={toggle} min={50} max={150}
                displayFn={v => v[0] + '%'}
                description="Einheitliche Skalierung aller Wortbezeichnungen."
              />
            </AccSection>

            {/* KANTEN */}
            <AccSection value="edges" label="Kanten" color="teal">
              <div className="space-y-3">
                <div className="flex items-center gap-2 h-[26px]">
                  <span className="text-[11px] text-muted-foreground flex-1">Farbe</span>
                  <input
                    type="color"
                    value={edgeColor === 'auto' ? '#9aa0aa' : edgeColor}
                    onChange={e => setEdgeColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-border bg-input p-0.5"
                    title={edgeColor === 'auto' ? 'Auto (grau)' : edgeColor}
                  />
                  {edgeColor !== 'auto' && (
                    <button onClick={() => setEdgeColor('auto')} className="text-[10px] text-muted-foreground hover:text-foreground px-1" title="Zurücksetzen">↺</button>
                  )}
                </div>
                <SliderParam
                  kfKey="edgeOpacity" label="Deckkraft" value={edgeOpacity} onChange={setEdgeOpacity}
                  color="teal" kfs={kfs} onToggle={toggle} min={10} max={100}
                  displayFn={v => v[0] + '%'}
                  description="Transparenz der Verbindungslinien."
                />
                <SliderParam
                  kfKey="edgeWidth" label="Stärke" value={edgeWidth} onChange={setEdgeWidth}
                  color="teal" kfs={kfs} onToggle={toggle} min={1} max={5}
                  description="Pixelbreite der Verbindungslinien."
                />
              </div>
            </AccSection>

          </Accordion.Root>
        </Tabs.Content>

        {/* CAMERA TAB */}
        <Tabs.Content value="camera" className="flex-1 overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={['camera-controls', 'camera-keyframes']}>
            {/* CAMERA CONTROLS */}
            <AccSection value="camera-controls" label="Steuerung" color="teal">
              <div className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                Verwende die Maus zum Steuern:
                <div className="mt-1 space-y-0.5 text-muted-foreground/70">
                  <div>• Linksklick + Ziehen: Rotieren</div>
                  <div>• Mausrad: Zoomen</div>
                  <div>• Rechtsklick + Ziehen: Verschieben</div>
                </div>
              </div>

              <SubLabel>Manuelle Steuerung</SubLabel>
              <div className="space-y-2">
                <div className="text-[9px] text-muted-foreground mb-1">Position (X, Y, Z)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    placeholder="X"
                    className="w-full h-6 px-1.5 bg-input border border-border hover:border-border focus:border-teal-600 rounded text-[11px] text-foreground text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    className="w-full h-6 px-1.5 bg-input border border-border hover:border-border focus:border-teal-600 rounded text-[11px] text-foreground text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Z"
                    className="w-full h-6 px-1.5 bg-input border border-border hover:border-border focus:border-teal-600 rounded text-[11px] text-foreground text-center focus:outline-none transition-colors font-mono"
                  />
                </div>
                <div className="text-[9px] text-muted-foreground mb-1 mt-3">Ziel (X, Y, Z)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    placeholder="X"
                    className="w-full h-6 px-1.5 bg-input border border-border hover:border-border focus:border-teal-600 rounded text-[11px] text-foreground text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    className="w-full h-6 px-1.5 bg-input border border-border hover:border-border focus:border-teal-600 rounded text-[11px] text-foreground text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Z"
                    className="w-full h-6 px-1.5 bg-input border border-border hover:border-border focus:border-teal-600 rounded text-[11px] text-foreground text-center focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </AccSection>

            {/* CAMERA KEYFRAMES */}
            <AccSection value="camera-keyframes" label="Keyframes" color="teal">
              <div className="text-[10px] text-muted-foreground bg-muted/30 rounded px-2 py-1.5 border border-border">
                💡 Benutze den <span className="text-teal-400">◆ Keyframe</span> Button in der Timeline
              </div>

              {cameraKeyframes.length > 0 && (
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] text-muted-foreground block mb-1.5">
                    Gespeicherte Keyframes:
                  </span>
                  {cameraKeyframes.map((kf, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-2 py-1 rounded text-[10px] ${
                        Math.abs(kf.time - currentTime) < 0.1
                          ? 'bg-teal-900/30 border border-teal-700/40'
                        : 'bg-muted/30 border border-border'
                      }`}
                    >
                      <span className="text-muted-foreground font-mono">
                        {Math.floor(kf.time / 60).toString().padStart(2, '0')}:
                        {(kf.time % 60).toFixed(1).padStart(4, '0')}s
                      </span>
                      <button
                        onClick={() => onDeleteKeyframe?.(kf.time)}
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AccSection>
          </Accordion.Root>
        </Tabs.Content>

        {/* PHYSICS TAB */}
        <Tabs.Content value="physics" className="flex-1 overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={['physics-params']}>
            <AccSection value="physics-params" label="Parameter" color="orange">
              <div className="space-y-3">
                <SliderParam
                  kfKey="repulsion" label="Repulsion" value={repulsionVal} onChange={setRepulsionVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={10} max={500}
                  displayFn={v => (v[0] * 10).toFixed(0)}
                  parseInput={s => Math.round(parseFloat(s) / 10)}
                  description="Wie stark Knoten sich gegenseitig abstoßen. Höher = weiter auseinander."
                />
                <SliderParam
                  kfKey="springK" label="Spring Stiffness" value={springKVal} onChange={setSpringKVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={1} max={20}
                  displayFn={v => (v[0] / 100).toFixed(2)}
                  parseInput={s => Math.round(parseFloat(s) * 100)}
                  description="Stärke der Kantenverbindungen. Höher = engere Gruppierung verbundener Wörter."
                />
                <SliderParam
                  kfKey="damping" label="Damping" value={dampingVal} onChange={setDampingVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={80} max={99}
                  displayFn={v => (v[0] / 100).toFixed(2)}
                  parseInput={s => Math.round(parseFloat(s) * 100)}
                  description="Geschwindigkeitsabfall pro Frame (0–1). Niedriger = schnelleres Einpendeln; höher = flüssigere Bewegung."
                />
                <SliderParam
                  kfKey="linkDistance" label="Link Distance" value={linkDistanceVal} onChange={setLinkDistanceVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={10} max={300}
                  displayFn={v => v[0] + 'px'}
                  parseInput={s => Math.round(parseFloat(s))}
                  description="Ziel-Ruhelänge der Kanten. Kanten ziehen oder stoßen Knoten ab, um diesen Abstand zu halten."
                />
                <SliderParam
                  kfKey="gravity" label="Gravity" value={gravityVal} onChange={setGravityVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={0} max={100}
                  displayFn={v => v[0].toFixed(0)}
                  description="Zieht alle Knoten zur Mitte, verhindert das Auseinanderdriften des Graphen."
                />
                <SliderParam
                  kfKey="turbulence" label="Turbulence" value={turbulenceVal} onChange={setTurbulenceVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={0} max={20}
                  displayFn={v => v[0].toFixed(0)}
                  description="Zufälliger Impuls pro Frame. Hält die Simulation mit organischer Bewegung am Laufen."
                />
                <div className="flex items-center gap-2 h-[26px]">
                  <KfDiamond active={kfs.minSpeed} color="orange" onClick={() => toggle('minSpeed')} />
                  <span className="text-[11px] text-muted-foreground flex-1">Min Speed</span>
                  <input
                    type="number"
                    value={minSpeedVal}
                    onChange={(e) => setMinSpeedVal(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="w-16 h-6 px-1.5 bg-input border border-border hover:border-border focus:border-border rounded text-[11px] text-foreground text-right focus:outline-none transition-colors shrink-0 font-mono"
                  />
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      const d = viewMode === '2D' ? PHYSICS_DEFAULTS_2D : PHYSICS_DEFAULTS_3D;
                      setRepulsionVal([d.repulsion]);
                      setSpringKVal([d.springK]);
                      setDampingVal([d.damping]);
                      setMinSpeedVal(d.minSpeed);
                      setLinkDistanceVal([d.linkDistance]);
                      setGravityVal([d.gravity]);
                      setTurbulenceVal([d.turbulence]);
                    }}
                    className="px-2 h-6 text-[10px] text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border rounded transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            </AccSection>
          </Accordion.Root>
        </Tabs.Content>
      </Tabs.Root>

      {/* Status bar */}
      
    </div>
  );
}