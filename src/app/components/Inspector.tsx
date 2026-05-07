import * as Accordion from '@radix-ui/react-accordion';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Slider from '@radix-ui/react-slider';
import * as Tabs from '@radix-ui/react-tabs';
import { ChevronRight, Diamond, Type, Layers, Camera, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
  onColorChange?: (settings: { hueStart: number; hueEnd: number; saturation: number; lightness: number }) => void;
  onStyleChange?: (settings: { edgeOpacity: number; edgeWidth: number; nodeScale: number }) => void;
  currentTime?: number;
  cameraKeyframes?: Array<{ time: number; position: any; target: any }>;
  onDeleteKeyframe?: (time: number) => void;
  width?: number;
}

export function Inspector({
  onPhysicsChange,
  onTextChange,
  onColorChange,
  onStyleChange,
  currentTime = 0,
  cameraKeyframes = [],
  onDeleteKeyframe,
  width = 268,
}: InspectorProps = {}) {
  const [kfs, setKfs] = useState<Record<string, boolean>>({
    saturation: false, lightness: false,
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
  const [colorScheme, setColorScheme] = useState('cyan-green');
  const [saturation, setSaturation] = useState([75]);
  const [lightness, setLightness] = useState([65]);
  const [edgeOpacity, setEdgeOpacity] = useState([85]);
  const [edgeWidth, setEdgeWidth] = useState([2]);
  const [nodeScale, setNodeScale] = useState([100]);

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

  // Notify color changes
  useEffect(() => {
    const schemes: Record<string, { hueStart: number; hueEnd: number }> = {
      'cyan-green': { hueStart: 180, hueEnd: 120 },
      'cyan-green-bright': { hueStart: 140, hueEnd: 85 },
      'purple-pink': { hueStart: 280, hueEnd: 320 },
      'orange-red': { hueStart: 40, hueEnd: 0 },
      'yellow-green': { hueStart: 60, hueEnd: 120 },
      'blue-purple': { hueStart: 220, hueEnd: 280 },
    };
    const scheme = schemes[colorScheme] || schemes['cyan-green'];
    onColorChange?.({ ...scheme, saturation: saturation[0], lightness: lightness[0] });
  }, [colorScheme, saturation, lightness]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify style changes
  useEffect(() => {
    onStyleChange?.({
      edgeOpacity: edgeOpacity[0] / 100,
      edgeWidth: edgeWidth[0],
      nodeScale: nodeScale[0] / 100
    });
  }, [edgeOpacity, edgeWidth, nodeScale]); // eslint-disable-line react-hooks/exhaustive-deps


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
                  { value: 'sentence', label: 'Satzebene' },
                  { value: 'word', label: 'Wortebene' },
                  { value: 'both', label: 'Beides' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2.5 h-7 cursor-pointer group">
                    <RadioGroup.Item
                      value={opt.value}
                      className="w-3.5 h-3.5 rounded-full border border-border data-[state=checked]:border-purple-500 bg-input shrink-0 flex items-center justify-center transition-colors"
                    >
                      <RadioGroup.Indicator>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup.Root>
              <p className="text-[9px] text-muted-foreground mt-2 leading-relaxed">
                Bestimmt welche Ebenen in der Timeline keyframable sind.
              </p>
            </AccSection>
          </Accordion.Root>
        </Tabs.Content>

        {/* VISUAL TAB */}
        <Tabs.Content value="visual" className="flex-1 overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={['colors', 'style']}>
            {/* COLORS */}
            <AccSection value="colors" label="Farben" color="purple">
              <span className="text-[10px] text-muted-foreground block mb-3">
                Farbschema (kurz → lang)
              </span>
              <RadioGroup.Root value={colorScheme} onValueChange={setColorScheme} className="flex flex-col gap-1.5">
                {[
                  { value: 'cyan-green', label: 'Cyan → Grün' },
                  { value: 'cyan-green-bright', label: 'Cyan → Grün (hell)' },
                  { value: 'purple-pink', label: 'Lila → Pink' },
                  { value: 'orange-red', label: 'Orange → Rot' },
                  { value: 'yellow-green', label: 'Gelb → Grün' },
                  { value: 'blue-purple', label: 'Blau → Lila' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2.5 h-6 cursor-pointer group">
                    <RadioGroup.Item
                      value={opt.value}
                      className="w-4 h-4 rounded-sm border border-border data-[state=checked]:border-border shrink-0 flex items-center justify-center transition-all overflow-hidden relative"
                      style={{
                        background: opt.value === 'cyan-green' ? 'linear-gradient(135deg, #06b6d4, #10b981)' :
                                    opt.value === 'cyan-green-bright' ? 'linear-gradient(135deg, #22d3ee, #34d399)' :
                                    opt.value === 'purple-pink' ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                    opt.value === 'orange-red' ? 'linear-gradient(135deg, #f97316, #ef4444)' :
                                    opt.value === 'yellow-green' ? 'linear-gradient(135deg, #eab308, #22c55e)' :
                                    opt.value === 'blue-purple' ? 'linear-gradient(135deg, #3b82f6, #a855f7)' :
                                    '#18181b'
                      }}
                    >
                      <RadioGroup.Indicator>
                        <div className="w-2 h-2 rounded-[1px] bg-white/90 shadow-sm" />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup.Root>

              <div className="mt-4 space-y-3">
                <SliderParam
                  kfKey="saturation" label="Sättigung" value={saturation} onChange={setSaturation}
                  color="teal" kfs={kfs} onToggle={toggle} min={30} max={100}
                  displayFn={v => v[0] + '%'}
                  description="Farbintensität. Niedriger = matter/grauer; höher = lebhafter."
                />
                <SliderParam
                  kfKey="lightness" label="Helligkeit" value={lightness} onChange={setLightness}
                  color="teal" kfs={kfs} onToggle={toggle} min={40} max={80}
                  displayFn={v => v[0] + '%'}
                  description="Helligkeit der Knotenbezeichnungen. Für helle oder dunkle Hintergründe anpassen."
                />
              </div>
            </AccSection>

            {/* STYLE */}
            <AccSection value="style" label="Darstellung" color="teal">
              <div className="space-y-3">
                <SliderParam
                  kfKey="edgeOpacity" label="Linien-Deckkraft" value={edgeOpacity} onChange={setEdgeOpacity}
                  color="teal" kfs={kfs} onToggle={toggle} min={10} max={100}
                  displayFn={v => v[0] + '%'}
                  description="Transparenz der Verbindungslinien zwischen Wörtern."
                />
                <SliderParam
                  kfKey="edgeWidth" label="Linien-Stärke" value={edgeWidth} onChange={setEdgeWidth}
                  color="teal" kfs={kfs} onToggle={toggle} min={1} max={5}
                  description="Pixelbreite der Verbindungslinien."
                />
                <SliderParam
                  kfKey="nodeScale" label="Node-Größe" value={nodeScale} onChange={setNodeScale}
                  color="teal" kfs={kfs} onToggle={toggle} min={50} max={150}
                  displayFn={v => v[0] + '%'}
                  description="Einheitliche Skalierung aller Wortbezeichnungen."
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
              </div>
            </AccSection>
          </Accordion.Root>
        </Tabs.Content>
      </Tabs.Root>

      {/* Status bar */}
      
    </div>
  );
}