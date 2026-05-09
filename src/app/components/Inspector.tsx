import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Accordion, AccordionItem, AccordionContent } from './ui/accordion';
import * as Slider from '@radix-ui/react-slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ChevronRight, Diamond, Type, Layers, Zap } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import type { NodeShape, NodeAppearanceSettings } from '../networkTheme';
import { Button } from './ui/button';
import { Toggle } from './ui/toggle';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';

const GRADIENT_PRESETS = [
  { name: 'Cyan → Grün', inner: '#06b6d4', outer: '#10b981' },
  { name: 'Lila → Pink', inner: '#a855f7', outer: '#ec4899' },
  { name: 'Orange → Rot', inner: '#f97316', outer: '#ef4444' },
  { name: 'Blau → Violett', inner: '#3b82f6', outer: '#8b5cf6' },
  { name: 'Gold → Kupfer', inner: '#f59e0b', outer: '#b45309' },
];

/* ─── helpers ─── */

function KfDiamond({ active, color, onClick }: { active: boolean; color: 'blue' | 'orange' | 'purple'; onClick: () => void }) {
  const activeColor = {
    blue:   'text-blue-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400',
  }[color];

  return (
    <button
      onClick={onClick}
      title={active ? 'Keyframe entfernen' : 'Keyframe setzen'}
      className={`size-5 rounded-full shrink-0 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${active ? activeColor : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent/60'}`}
    >
      <Diamond size={11} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}

function NumInput({ defaultValue, mono = true }: { defaultValue: number | string; mono?: boolean }) {
  return (
    <Input
      type="number"
      defaultValue={defaultValue}
      className={`w-16 h-6 px-1.5 text-[11px] text-right shrink-0 ${mono ? 'font-mono' : ''}`}
    />
  );
}

function ParamRow({
  kfKey, label, value, color = 'blue', kfs, onToggle,
}: {
  kfKey: string; label: string; value: number; color?: 'blue' | 'orange' | 'purple';
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
  effectiveValue,
}: {
  kfKey: string; label: string; value: number[]; onChange: (v: number[]) => void;
  color: 'blue' | 'orange'; kfs: Record<string, boolean>; onToggle: (k: string) => void;
  displayFn?: (v: number[]) => string;
  parseInput?: (s: string) => number;
  description?: string;
  min?: number; max?: number;
  effectiveValue?: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragVelocity, setDragVelocity] = useState(0);
  const lastDragValueRef = useRef(value[0]);
  const lastDragTimeRef = useRef(Date.now());
  const [animatedValue, setAnimatedValue] = useState(value[0]);
  const trackCls = color === 'blue' ? 'bg-blue-600/50' : 'bg-orange-600/50';
  const thumbCls = color === 'blue' ? 'bg-blue-400' : 'bg-orange-400';
  const focusBorderCls = color === 'blue' ? 'border-blue-500/60' : 'border-orange-500/60';

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Animate toward effective value when not dragging, responsive to drag velocity
  useEffect(() => {
    if (isDragging || effectiveValue === undefined || effectiveValue === null) {
      setAnimatedValue(value[0]);
      return;
    }

    let animationId: number;
    const animate = () => {
      setAnimatedValue(prev => {
        const target = effectiveValue;
        const diff = target - prev;
        
        // Spring stiffness scales with drag velocity (faster drags = snappier response)
        const velocityResponse = Math.min(Math.abs(dragVelocity) * 2, 1);
        const stiffness = 0.12 + velocityResponse * 0.08; // 0.12 to 0.20
        
        return prev + diff * stiffness;
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging, effectiveValue, value, dragVelocity]);

  const handleSliderChange = (newVal: number[]) => {
    const now = Date.now();
    const timeDelta = Math.max(16, now - lastDragTimeRef.current); // Min 16ms (60fps frame)
    const valueDelta = newVal[0] - lastDragValueRef.current;
    
    // Calculate velocity in value-units per millisecond
    setDragVelocity(valueDelta / timeDelta);
    lastDragValueRef.current = newVal[0];
    lastDragTimeRef.current = now;

    onChange(newVal);
    setAnimatedValue(newVal[0]);
  };

  const handleSliderPointerDown = () => setIsDragging(true);
  const handleSliderPointerUp = () => {
    setIsDragging(false);
    setDragVelocity(0);
  };

  const displayedSliderValue =
    !isDragging && effectiveValue !== undefined
      ? [Math.round(animatedValue)]
      : value;
  const displayStr = displayFn ? displayFn(displayedSliderValue) : String(displayedSliderValue[0]);

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
            className="text-[11px] font-mono text-muted-foreground/60 hover:text-muted-foreground w-12 text-right shrink-0 cursor-text focus-visible:outline-none focus-visible:text-foreground"
          >
            {displayStr}
          </button>
        )}
        <KfDiamond active={kfs[kfKey]} color={color} onClick={() => onToggle(kfKey)} />
      </div>
      <Slider.Root
        className="relative flex items-center w-full h-4"
        value={displayedSliderValue} onValueChange={handleSliderChange} min={min} max={max} step={1}
      >
        <Slider.Track className="bg-border relative grow rounded-full h-[2px]">
          <Slider.Range className={`absolute rounded-full h-full ${trackCls}`} />
        </Slider.Track>
        <Slider.Thumb 
          className={`block w-2.5 h-2.5 border-[1.5px] border-background rounded-full hover:scale-125 focus:outline-none transition-transform cursor-grab ${thumbCls}`}
          onPointerDown={handleSliderPointerDown}
          onPointerUp={handleSliderPointerUp}
        />
      </Slider.Root>
      {description && (
        <p className="text-[9px] text-muted-foreground/50 mt-1 leading-relaxed">{description}</p>
      )}
    </div>
  );
}

function AccSection({
  value, label, color, children,
}: {
  value: string; label: string; color?: 'blue' | 'orange' | 'purple'; children: React.ReactNode;
}) {
  const borderCls = {
    blue:   'border-l-blue-500/60',
    orange: 'border-l-orange-500/60',
    purple: 'border-l-purple-500/60',
  };
  const dotCls = {
    blue:   'bg-blue-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <AccordionItem value={value} className="border-border/50">
      <AccordionPrimitive.Header asChild>
        <div>
          <AccordionPrimitive.Trigger
            className={`w-full flex items-center gap-2.5 px-3 h-7 transition-[color,background-color,box-shadow] hover:bg-accent/60 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] group ${
              color ? `border-l-2 ${borderCls[color]}` : 'pl-3'
            }`}
          >
            <ChevronRight size={11} className="text-foreground/70 transition-transform duration-150 group-data-[state=open]:rotate-90 shrink-0" />
            {color && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls[color]}`} />}
            <span className="text-[11px] font-medium text-foreground flex-1 text-left">{label}</span>
          </AccordionPrimitive.Trigger>
        </div>
      </AccordionPrimitive.Header>
      <AccordionContent className="px-3 pb-3 pt-1.5">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest block mb-1.5 mt-2.5 first:mt-0">
      {children}
    </span>
  );
}

/* Color helpers */
function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function lightenHex(hex: string, percent: number) {
  const { r, g, b } = hexToRgb(hex);
  const p = Math.max(0, Math.min(100, percent)) / 100;
  const nr = Math.round(r + (255 - r) * p);
  const ng = Math.round(g + (255 - g) * p);
  const nb = Math.round(b + (255 - b) * p);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
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
  effectivePhysicsParams?: {
    repulsion: number;
    springK: number;
    damping: number;
    minSpeed: number;
    linkDistance: number;
    gravity: number;
    turbulence: number;
  };
  onTextChange?: (text: string) => void;
  onParsingChange?: (mode: 'sentence' | 'word' | 'both') => void;
  onGradientChange?: (settings: { mode: 'solid' | 'gradient'; innerColor: string; outerColor: string }) => void;
  onStyleChange?: (settings: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape: NodeShape; nodeBorderWidth: number; depthSizeEnabled: boolean; depthSizeStrength: number }) => void;
  onNodeAppearanceChange?: (a: { borderColor: 'auto' | string; fillColor: 'auto' | string; textColor: 'auto' | string }) => void;
  onEdgeAppearanceChange?: (a: { color: 'auto' | string }) => void;
  currentTime?: number;
  cameraKeyframes?: Array<{ time: number; position: any; target: any }>;
  onDeleteKeyframe?: (time: number) => void;
  physicsKeyframes?: Record<string, Array<{ time: number; value: number }>>;
  onTogglePhysicsKeyframe?: (trackId: string, value: number) => void;
  width?: number;
  viewMode?: '2D' | '3D';
  nodeAppearance?: NodeAppearanceSettings;
  appliedNodePreset?: 'outline' | 'filled' | null;
}

const PHYSICS_DEFAULTS_3D = { repulsion: 150, springK: 6, damping: 88, minSpeed: 0.5, linkDistance: 80, gravity: 0, turbulence: 0 };
const PHYSICS_DEFAULTS_2D = { repulsion: 150, springK: 6, damping: 88, minSpeed: 0.5, linkDistance: 80, gravity: 3, turbulence: 0 };

const PHYS_PARAM_TRACK: Record<string, string> = { repulsion: 'phys-rep', springK: 'phys-spk', damping: 'phys-dmp' };

export function Inspector({
  onPhysicsChange,
  effectivePhysicsParams,
  onTextChange,
  onParsingChange,
  onGradientChange,
  onStyleChange,
  onNodeAppearanceChange,
  onEdgeAppearanceChange,
  currentTime = 0,
  cameraKeyframes = [],
  onDeleteKeyframe,
  physicsKeyframes,
  onTogglePhysicsKeyframe,
  width = 268,
  viewMode = '3D',
  nodeAppearance,
  appliedNodePreset,
}: InspectorProps = {}) {
  const [kfs, setKfs] = useState<Record<string, boolean>>({
    nodeBorderWidth: false, depthSizeStrength: false,
    edgeOpacity: false, edgeWidth: false, nodeScale: false,
    minSpeed: false, linkDistance: false, gravity: false, turbulence: false,
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
  // Preset state for node appearance (outline / filled / custom)
  const [colorPreset, setColorPreset] = useState<'outline' | 'filled' | 'custom' | null>(null);
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
  // Sync external appearance/preset changes
  useEffect(() => {
    if (nodeAppearance) {
      setNodeBorderColor(nodeAppearance.borderColor ?? 'auto');
      setNodeFillColor(nodeAppearance.fillColor ?? 'auto');
      setNodeTextColor(nodeAppearance.textColor ?? 'auto');
      // mark as custom unless an applied preset is supplied
      if (!appliedNodePreset) setColorPreset('custom');
    }
  }, [nodeAppearance]);

  useEffect(() => {
    if (appliedNodePreset === 'outline') setColorPreset('outline');
    if (appliedNodePreset === 'filled') setColorPreset('filled');
    if (appliedNodePreset === null) setColorPreset(null);
  }, [appliedNodePreset]);

  const physKfActive = useMemo(() => {
    const result: Record<string, boolean> = {};
    for (const [k, trackId] of Object.entries(PHYS_PARAM_TRACK)) {
      result[k] = (physicsKeyframes?.[trackId] ?? []).some(kf => Math.abs(kf.time - currentTime) < 0.1);
    }
    return result;
  }, [physicsKeyframes, currentTime]);

  const effectiveKfs = useMemo(() => ({ ...kfs, ...physKfActive }), [kfs, physKfActive]);

  const physEngineValues = () => ({
    repulsion: repulsionVal[0] * 10,
    springK: springKVal[0] / 100,
    damping: dampingVal[0] / 100,
  });

  const toggle = (k: string) => {
    const trackId = PHYS_PARAM_TRACK[k];
    if (trackId) {
      onTogglePhysicsKeyframe?.(trackId, (physEngineValues() as Record<string, number>)[k]);
    } else {
      setKfs(prev => ({ ...prev, [k]: !prev[k] }));
    }
  };

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
    <div className="select-none bg-background border-r border-border flex flex-col shrink-0 overflow-hidden" style={{ width }}>
      {/* Panel Header */}
      

      <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden gap-0">
        {/* Tab Navigation */}
        <div className="px-2 pt-2 pb-1 shrink-0">
          <TabsList className="w-fit h-6 rounded-md p-0.5">
            <TabsTrigger value="content" className="flex-none gap-1 px-1.5 text-[11px] rounded-sm h-full">
              <Type size={11} />Inhalt
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex-none gap-1 px-1.5 text-[11px] rounded-sm h-full">
              <Layers size={11} />Visuell
            </TabsTrigger>
            <TabsTrigger value="physics" className="flex-none gap-1 px-1.5 text-[11px] rounded-sm h-full">
              <Zap size={11} />Physik
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="flex-1 overflow-y-auto mt-0">
          <Accordion type="multiple" defaultValue={['text', 'parsing']}>
            {/* TEXT */}
            <AccSection value="text" label="Text">
              <Textarea
                className="h-[176px] text-[11px] leading-relaxed"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 h-7 text-[11px]"
                onClick={() => onTextChange?.(textInput)}
              >
                Anwenden
              </Button>
            </AccSection>

            {/* PARSING */}
            <AccSection value="parsing" label="Parsing / Zerteilung" color="purple">
              <RadioGroup value={parsingMode} onValueChange={setParsingMode} className="flex flex-col gap-1">
                {[
                  { value: 'sentence', label: 'Satzebene', desc: 'Sätze → Wort-N-Gramme' },
                  { value: 'word', label: 'Wortebene', desc: 'Wörter → Zeichen-N-Gramme' },
                  { value: 'both', label: 'Beides', desc: 'Beide Ebenen (Wörter als Brücke)' },
                ].map(opt => (
                  <label key={opt.value} className="flex flex-col cursor-pointer group py-0.5">
                    <div className="flex items-center gap-2.5 h-6">
                      <RadioGroupItem
                        value={opt.value}
                        className="data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500/10 [&_svg]:fill-purple-400 [&_svg]:stroke-none"
                      />
                      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{opt.label}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground/60 pl-6">{opt.desc}</span>
                  </label>
                ))}
              </RadioGroup>
            </AccSection>
          </Accordion>
        </TabsContent>

        {/* VISUAL TAB */}
        <TabsContent value="visual" className="flex-1 overflow-y-auto mt-0">
          <Accordion type="multiple" defaultValue={['gradient', 'nodes', 'edges']}>

            {/* VERLAUF */}
            <AccSection value="gradient" label="Verlauf" color="purple">
              {/* Mode toggle */}
              <ToggleGroup
                type="single"
                value={gradientMode}
                onValueChange={(v) => v && setGradientMode(v as 'solid' | 'gradient')}
                className="w-full h-6 gap-0 mb-3 border border-border rounded-md overflow-hidden bg-background"
              >
                <ToggleGroupItem value="solid" className="flex-1 h-6 text-[11px]">Einfarbig</ToggleGroupItem>
                <ToggleGroupItem value="gradient" className="flex-1 h-6 text-[11px] border-l border-border">Verlauf</ToggleGroupItem>
              </ToggleGroup>

              {gradientMode === 'solid' ? (
                <div className="flex items-center gap-2 h-[26px]">
                  <span className="text-[11px] text-muted-foreground flex-1">Knotenfarbe</span>
                  <div className="w-6 h-6 rounded border border-border bg-input p-0.5 relative overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-0">
                    <div className="absolute inset-1 rounded" style={{ background: innerColor }} />
                    <input
                      type="color"
                      value={innerColor}
                      onChange={e => { setInnerColor(e.target.value); setColorPreset('custom'); }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">Innen</span>
                    <div className="w-6 h-6 rounded border border-border bg-input p-0.5 relative overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-0">
                      <div className="absolute inset-1 rounded" style={{ background: innerColor }} />
                      <input
                        type="color"
                        value={innerColor}
                        onChange={e => { setInnerColor(e.target.value); setColorPreset('custom'); }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div
                    className="flex-1 h-6 rounded border border-border"
                    style={{ background: `linear-gradient(to right, ${innerColor}, ${outerColor})` }}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">Außen</span>
                    <div className="w-6 h-6 rounded border border-border bg-input p-0.5 relative overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-0">
                      <div className="absolute inset-1 rounded" style={{ background: outerColor }} />
                      <input
                        type="color"
                        value={outerColor}
                        onChange={e => { setOuterColor(e.target.value); setColorPreset('custom'); }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
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
                    className="w-6 h-6 rounded border border-border/60 hover:border-border transition-all hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${p.inner}, ${p.outer})` }}
                  />
                ))}
              </div>
            </AccSection>

            {/* KNOTEN */}
            <AccSection value="nodes" label="Knoten" color="blue">
              {/* Shape selector */}
              <SubLabel>Form</SubLabel>
              <div className="flex gap-1 mb-3">
                {(['rectangle', 'rounded-rectangle', 'ellipse'] as NodeShape[]).map(shape => (
                  <Toggle
                    key={shape}
                    pressed={nodeShapeVal === shape}
                    onPressedChange={() => setNodeShapeVal(shape)}
                    title={shape}
                    variant="outline"
                    className="flex-1 data-[state=on]:bg-blue-600/15 data-[state=on]:border-blue-500/60 data-[state=on]:text-blue-300"
                  >
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {shape === 'rectangle' && <rect x="1" y="2" width="22" height="12" rx="0" />}
                      {shape === 'rounded-rectangle' && <rect x="1" y="2" width="22" height="12" rx="4" />}
                      {shape === 'ellipse' && <ellipse cx="12" cy="8" rx="11" ry="6" />}
                    </svg>
                  </Toggle>
                ))}
              </div>

              <div className="space-y-3">
                <SliderParam
                  kfKey="nodeBorderWidth" label="Rahmenbreite" value={nodeBorderWidthVal} onChange={setNodeBorderWidthVal}
                  color="blue" kfs={effectiveKfs} onToggle={toggle} min={0} max={8}
                  displayFn={v => v[0] + 'px'}
                  description="Stärke der Knotenumrandung."
                />
              </div>

              <SubLabel>Farben</SubLabel>

              {/* Style presets: Outline / Filled */}
              <ToggleGroup
                type="single"
                value={colorPreset === 'outline' || colorPreset === 'filled' ? colorPreset : ''}
                onValueChange={(v) => {
                  if (v === 'outline') {
                    setNodeBorderColor(innerColor);
                    setNodeFillColor(lightenHex(innerColor, 80));
                    setNodeTextColor(innerColor);
                    setColorPreset('outline');
                  } else if (v === 'filled') {
                    setNodeBorderColor('#FFFFFFCC');
                    setNodeFillColor(innerColor);
                    setNodeTextColor('#ffffff');
                    setColorPreset('filled');
                  }
                }}
                className="w-full h-6 gap-0 mb-2 border border-border rounded-md overflow-hidden bg-background"
              >
                <ToggleGroupItem value="outline" className="flex-1 h-6 text-[11px]">Outline</ToggleGroupItem>
                <ToggleGroupItem value="filled" className="flex-1 h-6 text-[11px] border-l border-border">Filled</ToggleGroupItem>
              </ToggleGroup>

              <div className="space-y-2 mb-3">
                {([
                  { label: 'Rahmen', value: nodeBorderColor, set: setNodeBorderColor, hint: 'auto = Verlaufsfarbe' },
                  { label: 'Füllung', value: nodeFillColor, set: setNodeFillColor, hint: 'auto = Hintergrund' },
                  { label: 'Text', value: nodeTextColor, set: setNodeTextColor, hint: 'auto = Verlaufsfarbe' },
                ] as { label: string; value: string | 'auto'; set: (v: string | 'auto') => void; hint: string }[]).map(({ label, value, set, hint }) => (
                  <div key={label} className="flex items-center gap-2 h-[26px]">
                    <span className="text-[11px] text-muted-foreground flex-1 truncate">{label}</span>
                    <div className="w-6 h-6 rounded border border-border bg-input p-0.5 relative overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-0">
                      <div className="absolute inset-1 rounded" style={{ background: value === 'auto' ? '#6b7280' : String(value) }} />
                      <input
                        type="color"
                        value={value === 'auto' ? '#6b7280' : String(value)}
                        onChange={e => { set(e.target.value); setColorPreset('custom'); }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title={value === 'auto' ? hint : String(value)}
                      />
                    </div>
                    {value !== 'auto' && (
                      <button onClick={() => { set('auto'); setColorPreset('custom'); }} className="text-[10px] text-muted-foreground hover:text-foreground px-1" title="Zurücksetzen">↺</button>
                    )}
                  </div>
                ))}
              </div>

              <SubLabel>Tiefengröße</SubLabel>
              <div className="flex items-center gap-2 h-[26px] mb-2">
                <span className="text-[11px] text-muted-foreground flex-1">Nach Tiefe skalieren</span>
                <Switch
                  checked={depthSizeEnabled}
                  onCheckedChange={setDepthSizeEnabled}
                  className="data-[state=checked]:bg-blue-500/70"
                />
              </div>
              {depthSizeEnabled && (
                <div className="mb-3">
                  <SliderParam
                    kfKey="depthSizeStrength" label="Stärke" value={depthSizeStrengthVal} onChange={setDepthSizeStrengthVal}
                    color="blue" kfs={effectiveKfs} onToggle={toggle} min={0} max={100}
                    displayFn={v => v[0] + '%'}
                    description="Größenvariation: Innere Knoten (1 Wort) werden größer, äußere kleiner."
                  />
                </div>
              )}

              <SliderParam
                kfKey="nodeScale" label="Node-Größe" value={nodeScale} onChange={setNodeScale}
                color="blue" kfs={effectiveKfs} onToggle={toggle} min={50} max={150}
                displayFn={v => v[0] + '%'}
                description="Einheitliche Skalierung aller Wortbezeichnungen."
              />
            </AccSection>

            {/* KANTEN */}
            <AccSection value="edges" label="Kanten" color="blue">
              <div className="space-y-3">
                <div className="flex items-center gap-2 h-[26px]">
                  <span className="text-[11px] text-muted-foreground flex-1">Farbe</span>
                  <div className="w-6 h-6 rounded border border-border bg-input p-0.5 relative overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-0">
                    <div className="absolute inset-1 rounded" style={{ background: edgeColor === 'auto' ? '#9aa0aa' : String(edgeColor) }} />
                    <input
                      type="color"
                      value={edgeColor === 'auto' ? '#9aa0aa' : String(edgeColor)}
                      onChange={e => { setEdgeColor(e.target.value); setColorPreset('custom'); }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title={edgeColor === 'auto' ? 'Auto (grau)' : String(edgeColor)}
                    />
                  </div>
                  {edgeColor !== 'auto' && (
                    <button onClick={() => setEdgeColor('auto')} className="text-[10px] text-muted-foreground hover:text-foreground px-1 transition-colors focus-visible:outline-none focus-visible:text-foreground" title="Zurücksetzen">↺</button>
                  )}
                </div>
                <SliderParam
                  kfKey="edgeOpacity" label="Deckkraft" value={edgeOpacity} onChange={setEdgeOpacity}
                  color="blue" kfs={effectiveKfs} onToggle={toggle} min={10} max={100}
                  displayFn={v => v[0] + '%'}
                  description="Transparenz der Verbindungslinien."
                />
                <SliderParam
                  kfKey="edgeWidth" label="Stärke" value={edgeWidth} onChange={setEdgeWidth}
                  color="blue" kfs={effectiveKfs} onToggle={toggle} min={1} max={5}
                  description="Pixelbreite der Verbindungslinien."
                />
              </div>
            </AccSection>

          </Accordion>
        </TabsContent>

        {/* PHYSICS TAB */}
        <TabsContent value="physics" className="flex-1 overflow-y-auto mt-0">
          <Accordion type="multiple" defaultValue={['physics-params']}>
            <AccSection value="physics-params" label="Parameter" color="orange">
              <div className="space-y-3">
                <SliderParam
                  kfKey="repulsion" label="Repulsion" value={repulsionVal} onChange={setRepulsionVal}
                  color="orange" kfs={effectiveKfs} onToggle={toggle}
                  min={10} max={500}
                  displayFn={v => (v[0] * 10).toFixed(0)}
                  parseInput={s => Math.round(parseFloat(s) / 10)}
                  effectiveValue={effectivePhysicsParams != null ? effectivePhysicsParams.repulsion / 10 : undefined}
                  description="Wie stark Knoten sich gegenseitig abstoßen. Höher = weiter auseinander."
                />
                <SliderParam
                  kfKey="springK" label="Spring Stiffness" value={springKVal} onChange={setSpringKVal}
                  color="orange" kfs={effectiveKfs} onToggle={toggle}
                  min={1} max={20}
                  displayFn={v => (v[0] / 100).toFixed(2)}
                  parseInput={s => Math.round(parseFloat(s) * 100)}
                  effectiveValue={effectivePhysicsParams != null ? effectivePhysicsParams.springK * 100 : undefined}
                  description="Stärke der Kantenverbindungen. Höher = engere Gruppierung verbundener Wörter."
                />
                <SliderParam
                  kfKey="damping" label="Damping" value={dampingVal} onChange={setDampingVal}
                  color="orange" kfs={effectiveKfs} onToggle={toggle}
                  min={80} max={99}
                  displayFn={v => (v[0] / 100).toFixed(2)}
                  parseInput={s => Math.round(parseFloat(s) * 100)}
                  effectiveValue={effectivePhysicsParams != null ? effectivePhysicsParams.damping * 100 : undefined}
                  description="Geschwindigkeitsabfall pro Frame (0–1). Niedriger = schnelleres Einpendeln; höher = flüssigere Bewegung."
                />
                <SliderParam
                  kfKey="linkDistance" label="Link Distance" value={linkDistanceVal} onChange={setLinkDistanceVal}
                  color="orange" kfs={effectiveKfs} onToggle={toggle}
                  min={10} max={300}
                  displayFn={v => v[0] + 'px'}
                  parseInput={s => Math.round(parseFloat(s))}
                  effectiveValue={effectivePhysicsParams?.linkDistance}
                  description="Ziel-Ruhelänge der Kanten. Kanten ziehen oder stoßen Knoten ab, um diesen Abstand zu halten."
                />
                <SliderParam
                  kfKey="gravity" label="Gravity" value={gravityVal} onChange={setGravityVal}
                  color="orange" kfs={effectiveKfs} onToggle={toggle}
                  min={0} max={100}
                  displayFn={v => v[0].toFixed(0)}
                  effectiveValue={effectivePhysicsParams?.gravity}
                  description="Zieht alle Knoten zur Mitte, verhindert das Auseinanderdriften des Graphen."
                />
                <SliderParam
                  kfKey="turbulence" label="Turbulence" value={turbulenceVal} onChange={setTurbulenceVal}
                  color="orange" kfs={effectiveKfs} onToggle={toggle}
                  min={0} max={20}
                  displayFn={v => v[0].toFixed(0)}
                  effectiveValue={effectivePhysicsParams?.turbulence}
                  description="Zufälliger Impuls pro Frame. Hält die Simulation mit organischer Bewegung am Laufen."
                />
                <div className="flex items-center gap-2 h-[26px]">
                  <span className="text-[11px] text-muted-foreground flex-1">Min Speed</span>
                  <Input
                    type="number"
                    value={minSpeedVal}
                    onChange={(e) => setMinSpeedVal(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="w-16 h-6 px-1.5 text-[11px] text-right shrink-0 font-mono"
                  />
                  <KfDiamond active={effectiveKfs.minSpeed ?? false} color="orange" onClick={() => toggle('minSpeed')} />
                </div>
                <div className="pt-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[11px]"
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
                  >
                    Reset Defaults
                  </Button>
                </div>
              </div>
            </AccSection>
          </Accordion>
        </TabsContent>
      </Tabs>

      {/* Status bar */}
      
    </div>
  );
}