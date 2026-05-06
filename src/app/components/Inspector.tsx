import * as Accordion from '@radix-ui/react-accordion';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Slider from '@radix-ui/react-slider';
import * as Tabs from '@radix-ui/react-tabs';
import { ChevronRight, Diamond } from 'lucide-react';
import { useState, useEffect } from 'react';

/* ─── helpers ─── */

function KfDiamond({ active, color, onClick }: { active: boolean; color: 'teal' | 'orange' | 'purple'; onClick: () => void }) {
  const cls = {
    teal:   active ? 'text-teal-400'   : 'text-zinc-700 hover:text-zinc-500',
    orange: active ? 'text-orange-400' : 'text-zinc-700 hover:text-zinc-500',
    purple: active ? 'text-purple-400' : 'text-zinc-700 hover:text-zinc-500',
  }[color];

  return (
    <button
      onClick={onClick}
      className={`w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors hover:bg-zinc-800/80 ${cls}`}
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
      className={`w-16 h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 rounded text-[11px] text-zinc-300 text-right focus:outline-none transition-colors shrink-0 ${mono ? 'font-mono' : ''}`}
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
      <span className="text-[11px] text-zinc-500 flex-1 truncate">{label}</span>
      <NumInput defaultValue={value} />
    </div>
  );
}

function SliderParam({
  kfKey, label, value, onChange, color, kfs, onToggle, displayFn, min = 0, max = 200,
}: {
  kfKey: string; label: string; value: number[]; onChange: (v: number[]) => void;
  color: 'teal' | 'orange'; kfs: Record<string, boolean>; onToggle: (k: string) => void;
  displayFn?: (v: number[]) => string; min?: number; max?: number;
}) {
  const trackCls = color === 'teal' ? 'bg-teal-600/50' : 'bg-orange-600/50';
  const thumbCls = color === 'teal' ? 'bg-teal-400' : 'bg-orange-400';

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <KfDiamond active={kfs[kfKey]} color={color} onClick={() => onToggle(kfKey)} />
        <span className="text-[11px] text-zinc-500 flex-1">{label}</span>
        <span className="text-[11px] font-mono text-zinc-400 w-9 text-right shrink-0">
          {displayFn ? displayFn(value) : value[0]}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center w-full h-4 pl-7"
        value={value} onValueChange={onChange} min={min} max={max} step={1}
      >
        <Slider.Track className="bg-zinc-800 relative grow rounded-full h-[2px]">
          <Slider.Range className={`absolute rounded-full h-full ${trackCls}`} />
        </Slider.Track>
        <Slider.Thumb className={`block w-2.5 h-2.5 border-[1.5px] border-zinc-950 rounded-full hover:scale-125 focus:outline-none transition-transform cursor-grab ${thumbCls}`} />
      </Slider.Root>
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
    <Accordion.Item value={value} className="border-b border-zinc-800/80">
      <Accordion.Header asChild>
        <div>
          <Accordion.Trigger
            className={`w-full flex items-center gap-2.5 px-3 h-9 transition-colors hover:bg-zinc-800/30 group ${
              color ? `border-l-2 ${borderCls[color]}` : 'pl-3'
            }`}
          >
            {color && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls[color]}`} />}
            {!color && <ChevronRight size={11} className="text-zinc-600 transition-transform duration-150 group-data-[state=open]:rotate-90 shrink-0" />}
            <span className="text-[11px] font-medium text-zinc-200 flex-1 text-left">{label}</span>
            {color && <ChevronRight size={11} className="text-zinc-600 transition-transform duration-150 group-data-[state=open]:rotate-90" />}
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
    <span className="text-[9px] text-zinc-700 uppercase tracking-widest block mb-1.5 mt-2.5 first:mt-0">
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
  }) => void;
  onTextChange?: (text: string) => void;
  onColorChange?: (settings: { hueStart: number; hueEnd: number; saturation: number; lightness: number }) => void;
  onStyleChange?: (settings: { edgeOpacity: number; edgeWidth: number; nodeScale: number }) => void;
  currentTime?: number;
  cameraSnapshots?: Array<{ time: number; position: any; target: any }>;
  onDeleteSnapshot?: (time: number) => void;
}

export function Inspector({
  onPhysicsChange,
  onTextChange,
  onColorChange,
  onStyleChange,
  currentTime = 0,
  cameraSnapshots = [],
  onDeleteSnapshot
}: InspectorProps = {}) {
  const [kfs, setKfs] = useState<Record<string, boolean>>({
    saturation: false, lightness: false,
    edgeOpacity: false, edgeWidth: false, nodeScale: false,
    repulsion: false, springK: true, damping: false, minSpeed: false,
  });
  const [parsingMode, setParsingMode] = useState('word');
  const [zoomVal, setZoomVal] = useState([800]);
  const [repulsionVal, setRepulsionVal] = useState([150]);
  const [springKVal, setSpringKVal] = useState([6]);
  const [dampingVal, setDampingVal] = useState([88]);
  const [minSpeedVal, setMinSpeedVal] = useState(0.5);
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
      minSpeed: minSpeedVal
    });
  };

  // Call on mount and when values change
  useEffect(() => {
    notifyPhysicsChange();
  }, [repulsionVal, springKVal, dampingVal, minSpeedVal]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="w-[268px] bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden">
      {/* Panel Header */}
      

      <Tabs.Root defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <Tabs.List className="flex border-b border-zinc-800 shrink-0">
          <Tabs.Trigger
            value="content"
            className="flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-purple-500/60"
          >
            Inhalt
          </Tabs.Trigger>
          <Tabs.Trigger
            value="visual"
            className="flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-teal-500/60"
          >
            Visuell
          </Tabs.Trigger>
          <Tabs.Trigger
            value="camera"
            className="flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-teal-500/60"
          >
            Kamera
          </Tabs.Trigger>
          <Tabs.Trigger
            value="physics"
            className="flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-orange-500/60"
          >
            Physik
          </Tabs.Trigger>
        </Tabs.List>

        {/* CONTENT TAB */}
        <Tabs.Content value="content" className="flex-1 overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={['text', 'parsing']}>
            {/* TEXT */}
            <AccSection value="text" label="Text">
              <textarea
                className="w-full h-[176px] bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-700 rounded px-2.5 py-2 text-[11px] font-mono text-zinc-300 resize-none focus:outline-none transition-colors leading-relaxed"
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
                      className="w-3.5 h-3.5 rounded-full border border-zinc-700 data-[state=checked]:border-purple-500 bg-zinc-950 shrink-0 flex items-center justify-center transition-colors"
                    >
                      <RadioGroup.Indicator>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-200 transition-colors">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup.Root>
              <p className="text-[9px] text-zinc-700 mt-2 leading-relaxed">
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
              <span className="text-[10px] text-zinc-600 block mb-3">
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
                      className="w-4 h-4 rounded-sm border border-zinc-700 data-[state=checked]:border-zinc-500 shrink-0 flex items-center justify-center transition-all overflow-hidden relative"
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
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-200 transition-colors">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup.Root>

              <div className="mt-4 space-y-3">
                <SliderParam
                  kfKey="saturation" label="Sättigung" value={saturation} onChange={setSaturation}
                  color="teal" kfs={kfs} onToggle={toggle} min={30} max={100}
                  displayFn={v => v[0] + '%'}
                />
                <SliderParam
                  kfKey="lightness" label="Helligkeit" value={lightness} onChange={setLightness}
                  color="teal" kfs={kfs} onToggle={toggle} min={40} max={80}
                  displayFn={v => v[0] + '%'}
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
                />
                <SliderParam
                  kfKey="edgeWidth" label="Linien-Stärke" value={edgeWidth} onChange={setEdgeWidth}
                  color="teal" kfs={kfs} onToggle={toggle} min={1} max={5}
                />
                <SliderParam
                  kfKey="nodeScale" label="Node-Größe" value={nodeScale} onChange={setNodeScale}
                  color="teal" kfs={kfs} onToggle={toggle} min={50} max={150}
                  displayFn={v => v[0] + '%'}
                />
              </div>
            </AccSection>
          </Accordion.Root>
        </Tabs.Content>

        {/* CAMERA TAB */}
        <Tabs.Content value="camera" className="flex-1 overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={['camera-controls', 'camera-snapshots']}>
            {/* CAMERA CONTROLS */}
            <AccSection value="camera-controls" label="Steuerung" color="teal">
              <div className="text-[10px] text-zinc-600 leading-relaxed mb-3">
                Verwende die Maus zum Steuern:
                <div className="mt-1 space-y-0.5 text-zinc-700">
                  <div>• Linksklick + Ziehen: Rotieren</div>
                  <div>• Mausrad: Zoomen</div>
                  <div>• Rechtsklick + Ziehen: Verschieben</div>
                </div>
              </div>

              <SubLabel>Manuelle Steuerung</SubLabel>
              <div className="space-y-2">
                <div className="text-[9px] text-zinc-600 mb-1">Position (X, Y, Z)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    placeholder="X"
                    className="w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-teal-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    className="w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-teal-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Z"
                    className="w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-teal-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"
                  />
                </div>
                <div className="text-[9px] text-zinc-600 mb-1 mt-3">Ziel (X, Y, Z)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    placeholder="X"
                    className="w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-teal-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    className="w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-teal-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Z"
                    className="w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-teal-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </AccSection>

            {/* CAMERA SNAPSHOTS */}
            <AccSection value="camera-snapshots" label="Snapshots" color="teal">
              <div className="text-[10px] text-zinc-600 bg-zinc-900/50 rounded px-2 py-1.5 border border-zinc-800">
                💡 Benutze den <span className="text-teal-400">📸 Snapshot</span> Button in der Timeline
              </div>

              {cameraSnapshots.length > 0 && (
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] text-zinc-600 block mb-1.5">
                    Gespeicherte Snapshots:
                  </span>
                  {cameraSnapshots.map((snapshot, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-2 py-1 rounded text-[10px] ${
                        Math.abs(snapshot.time - currentTime) < 0.1
                          ? 'bg-teal-900/30 border border-teal-700/40'
                          : 'bg-zinc-900/50 border border-zinc-800'
                      }`}
                    >
                      <span className="text-zinc-400 font-mono">
                        {Math.floor(snapshot.time / 60).toString().padStart(2, '0')}:
                        {(snapshot.time % 60).toFixed(1).padStart(4, '0')}s
                      </span>
                      <button
                        onClick={() => onDeleteSnapshot?.(snapshot.time)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
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
                />
                <SliderParam
                  kfKey="springK" label="Spring K" value={springKVal} onChange={setSpringKVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={1} max={20}
                  displayFn={v => (v[0] / 100).toFixed(2)}
                />
                <SliderParam
                  kfKey="damping" label="Damping" value={dampingVal} onChange={setDampingVal}
                  color="orange" kfs={kfs} onToggle={toggle}
                  min={80} max={99}
                  displayFn={v => (v[0] / 100).toFixed(2)}
                />
                <div className="flex items-center gap-2 h-[26px]">
                  <KfDiamond active={kfs.minSpeed} color="orange" onClick={() => toggle('minSpeed')} />
                  <span className="text-[11px] text-zinc-500 flex-1">Min Speed</span>
                  <input
                    type="number"
                    value={minSpeedVal}
                    onChange={(e) => setMinSpeedVal(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="w-16 h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 rounded text-[11px] text-zinc-300 text-right focus:outline-none transition-colors shrink-0 font-mono"
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