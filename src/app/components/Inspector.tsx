"use client";

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  Diamond, 
  Type, 
  PaintRoller, 
  Zap, 
  RefreshCw,
  MoreHorizontal,
  PanelRight,
  PanelRightClose,
  X,
  Plus,
  Minus,
  Video,
  Atom,
  Monitor,
  Proportions,
  Fullscreen,
  MonitorPlay,
  Tv,
  Image,
  FileText,
  Move,
  Eye,
  EyeOff,
  Link,
  Link2Off,
  Wand2,
  Route,
  Target,
  CircleDot,
  Layers,
  Globe,
  MousePointer2,
  Dices,
  Square,
  Circle,
  RectangleHorizontal,
  MousePointerClick,
  Sparkles,
  Camera,
  CornerUpRight,
  Activity
} from 'lucide-react';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import {
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from './ui/sidebar';

import type { NodeShape, NodeAppearanceSettings } from '../networkTheme';
import { cn } from './ui/utils';
import { useWortnetz } from '../context/WortnetzContext';
import { useHistory } from '../hooks/useHistory';

function SliderValue({ value, onCommit, min, max, format = (v: number) => v.toFixed(2) }: { value: number; onCommit: (v: number) => void; min?: number; max?: number; format?: (v: number) => string }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value.toString());

  const commitValue = (valStr: string) => {
    let val = parseFloat(valStr);
    if (!isNaN(val)) {
      if (min !== undefined) val = Math.max(min, val);
      if (max !== undefined) val = Math.min(max, val);
      onCommit(val);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        type="number"
        autoFocus
        className="w-12 h-6 text-[10px] px-1 py-0 text-center border-zinc-200"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commitValue(localValue);
          } else if (e.key === 'Escape') {
            setIsEditing(false);
            setLocalValue(value.toString());
          }
        }}
        onBlur={() => commitValue(localValue)}
      />
    );
  }

  return (
    <button 
      onClick={() => {
        setIsEditing(true);
        setLocalValue(value.toString());
      }}
      className="text-[10px] font-mono text-zinc-400 hover:text-zinc-900 transition-colors"
    >
      {format(value)}
    </button>
  );
}

export function Inspector() {
  const {
    inputText, setInputText,
    parseMode, setParseMode,
    gradientSettings, setGradientSettings,
    styleSettings, setStyleSettings,
    physicsParams, setPhysicsParams,
    visualSettings, setVisualSettings,
    nodeAppearance, setNodeAppearance,
    edgeAppearance, setEdgeAppearance,
    lastAppliedPreset,
    canvasAspectRatio, setCanvasAspectRatio,
    effectivePhysicsParams,
    playheadPosition,
    cameraKeyframes,
    physicsKeyframes, setPhysicsKeyframes,
    isSidebarOpen, setIsSidebarOpen,
    inspectorWidth,
    viewMode,
    network3DRef,
    zoomValue, setZoomValue,
    selectedNode,
    physicsKeyframesRef,
    isRecordingRef,
    playheadRef
  } = useWortnetz();

  const { pushHistory, getTimelineState } = useHistory();

  const [localText, setLocalText] = useState(inputText);
  const [activeTab, setActiveTab] = useState<'content' | 'visual' | 'physics' | 'camera' | 'canvas'>('content');
  const [puckPos, setPuckPos] = useState({ x: 0, y: 0 });
  const [isDraggingPuck, setIsDraggingPuck] = useState(false);
  const [panPuckPos, setPanPuckPos] = useState({ x: 0, y: 0 });
  const [isDraggingPanPuck, setIsDraggingPanPuck] = useState(false);
  const [zoomPuckPos, setZoomPuckPos] = useState({ x: 0, y: 0 });
  const [isDraggingZoomPuck, setIsDraggingZoomPuck] = useState(false);

  useEffect(() => {
    setLocalText(inputText);
  }, [inputText]);

  const physKfActive = useMemo(() => {
    const result: Record<string, boolean> = {};
    const tracks = ['phys-rep', 'phys-spk', 'phys-dmp', 'phys-min', 'phys-lnk', 'phys-grv', 'phys-trb', 'phys-vto', 'phys-pls'];
    tracks.forEach(trackId => {
      result[trackId] = (physicsKeyframes?.[trackId] ?? []).some(kf => Math.abs(kf.time - playheadPosition) < 0.1);
    });
    return result;
  }, [physicsKeyframes, playheadPosition]);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabClick = (id: typeof activeTab) => {
    setActiveTab(id);
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  };

  const handlePhysicsChange = (params: Partial<typeof physicsParams>) => {
    setPhysicsParams((prev: any) => ({ ...prev, ...params }));
    
    const currentTime = playheadRef.current;
    const PHYS_TRACK_PARAM: Record<string, string> = { 
      'phys-rep': 'repulsion', 
      'phys-spk': 'springK', 
      'phys-dmp': 'damping',
      'phys-min': 'minSpeed',
      'phys-lnk': 'linkDistance',
      'phys-grv': 'gravity',
      'phys-trb': 'turbulence',
      'phys-vto': 'verticalOrder',
      'phys-pls': 'pulse'
    };

    setPhysicsKeyframes((prevKfs: any) => {
      let changed = false;
      const nextKfs = { ...prevKfs };
      
      for (const [trackId, paramName] of Object.entries(PHYS_TRACK_PARAM)) {
        const newVal = (params as Record<string, number>)[paramName];
        if (newVal === undefined) continue;

        const track = prevKfs[trackId] ?? [];
        const isRecordingLocal = isRecordingRef.current;
        if (track.length === 0 && !isRecordingLocal) continue;
        
        const kfIdx = track.findIndex((k: any) => Math.abs(k.time - currentTime) <= 0.1);
        if (kfIdx >= 0) {
          if (newVal !== track[kfIdx].value) {
            nextKfs[trackId] = track.map((k: any, i: number) => i === kfIdx ? { ...k, value: newVal } : k);
            changed = true;
          }
        } else {
          const nextTrack = [...track, { time: currentTime, value: newVal, mode: 'aligned' as const }].sort((a, b) => a.time - b.time);
          nextKfs[trackId] = nextTrack;
          changed = true;
        }
      }
      
      if (!changed) return prevKfs;
      physicsKeyframesRef.current = nextKfs;
      return nextKfs;
    });
  };

  const handleTogglePhysicsKeyframe = (trackId: string, value: number) => {
    const prev = getTimelineState();
    const currentTime = playheadRef.current;
    setPhysicsKeyframes((prevKfs: any) => {
      const track = prevKfs[trackId] ?? [];
      const hasKf = track.some((k: any) => Math.abs(k.time - currentTime) <= 0.1);
      const next = hasKf
        ? { ...prevKfs, [trackId]: track.filter((k: any) => Math.abs(k.time - currentTime) > 0.1) }
        : { ...prevKfs, [trackId]: [...track, { time: currentTime, value, mode: 'aligned' as const }].sort((a, b) => a.time - b.time) };
      physicsKeyframesRef.current = next;
      pushHistory({ ...prev, physicsKeyframes: next });
      return next;
    });
  };

  const SidebarTab = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => handleTabClick(id)}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center",
        activeTab === id ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      )}
      title={label}
    >
      <Icon size={20} className={cn(activeTab === id ? "scale-110" : "scale-100 group-hover:scale-105")} />
      {activeTab === id && (
        <div className="absolute left-0 h-5 w-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-r-full" />
      )}
    </button>
  );

  if (!isSidebarOpen) {
    return (
      <div className="flex h-full w-12 bg-sidebar border border-sidebar-border shadow-sm rounded-tr-xl rounded-b-xl overflow-hidden pointer-events-auto">
        <div className="w-full flex flex-col items-center py-4 gap-2 bg-sidebar-accent/50">
          <button 
            onClick={handleToggleSidebar}
            className="size-8 mb-2 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            title="Sidebar einblenden"
          >
            <PanelRight size={18} />
          </button>
          <SidebarTab id="content" icon={Type} label="Inhalt" />
          <SidebarTab id="visual" icon={PaintRoller} label="Visualisierung" />
          <SidebarTab id="physics" icon={Atom} label="Physik" />
          <SidebarTab id="camera" icon={Video} label="Kamera" />
          <SidebarTab id="canvas" icon={Proportions} label="Canvas" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="h-full w-full">
      <div className="flex h-full w-full bg-sidebar border border-sidebar-border shadow-sm rounded-tr-xl overflow-hidden pointer-events-auto">
        
        {/* Activity Bar */}
        <div className="w-11 border-r border-sidebar-border/60 bg-sidebar-accent/50 flex flex-col items-center py-4 gap-2">
          <button 
            onClick={handleToggleSidebar}
            className="size-8 mb-2 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            title="Sidebar ausblenden"
          >
            <PanelRightClose size={18} />
          </button>
          <SidebarTab id="content" icon={Type} label="Inhalt" />
          <SidebarTab id="visual" icon={PaintRoller} label="Visualisierung" />
          <SidebarTab id="physics" icon={Atom} label="Physik" />
          <SidebarTab id="camera" icon={Video} label="Kamera" />
          <SidebarTab id="canvas" icon={Proportions} label="Canvas" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <SidebarHeader className="p-4 pb-2 border-b border-sidebar-border/50 flex flex-row items-center justify-between">
            <h2 className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              {activeTab === 'content' ? 'Eigenschaften' : activeTab === 'visual' ? 'Visualisierung' : activeTab === 'physics' ? 'Physik Engine' : activeTab === 'camera' ? 'Kamera Steuerung' : 'Canvas Layout'}
            </h2>
            <button onClick={handleToggleSidebar} className="text-zinc-300 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors md:hidden">
              <X size={16} />
            </button>
          </SidebarHeader>

          <SidebarContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
            
            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div>
                <SidebarGroup className="py-4 pb-6 mt-2">
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">Eingabetext</SidebarGroupLabel>
                  <SidebarGroupContent className="px-3 space-y-4">
                    <Textarea 
                      className="min-h-[260px] text-[12px] leading-relaxed resize-y bg-white border-zinc-200 focus-visible:ring-zinc-400 shadow-sm font-sans" 
                      placeholder="Text hier einfügen..."
                      value={localText}
                      onChange={(e) => setLocalText(e.target.value)}
                    />
                    <Button 
                      className="w-full h-9 text-xs gap-2 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md active:scale-[0.98] transition-transform"
                      onClick={() => setInputText(localText)}
                    >
                      <RefreshCw size={14} />
                      Aktualisieren
                    </Button>
                  </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="bg-zinc-200/60 mx-4" />

                <SidebarGroup className="py-4 pb-6 mt-2">
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">Parse Modus</SidebarGroupLabel>
                  <SidebarGroupContent className="px-3">
                    <RadioGroup value={parseMode} onValueChange={(v) => setParseMode(v as any)} className="gap-4">
                      {[
                        { id: 'sentence', label: 'Satzebene', desc: 'Sätze → Wort-N-Gramme' },
                        { id: 'word', label: 'Wortebene', desc: 'Wörter → Zeichen-N-Gramme' },
                        { id: 'both', label: 'Beides', desc: 'Wörter als Brücke' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 group cursor-pointer">
                          <RadioGroupItem value={item.id} id={item.id} className="mt-0.5 border-zinc-300 text-zinc-900" />
                          <label htmlFor={item.id} className="text-[12px] font-semibold leading-tight cursor-pointer group-hover:text-zinc-900 text-zinc-800 transition-colors">
                            {item.label}
                            <p className="text-[10px] text-zinc-400 font-normal mt-1">{item.desc}</p>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}

            {/* VISUAL TAB */}
            {activeTab === 'visual' && (
              <div className="flex flex-col h-full text-[11px]">
                <SidebarGroup className="py-4 pb-6 mt-2">
                  <div className="flex items-center justify-between pr-2 mb-3">
                    <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2">Knoten (Nodes)</SidebarGroupLabel>
                    <button 
                      onClick={() => setVisualSettings({ ...visualSettings, nodesVisible: !visualSettings.nodesVisible })}
                      className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                    >
                      {visualSettings.nodesVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                  
                  <SidebarGroupContent className="px-3 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Form</span>
                      <div className="flex bg-zinc-100 rounded-md p-0.5 border border-zinc-200">
                        {[
                          { id: 'rectangle', icon: Square, label: 'Rect' },
                          { id: 'rounded-rectangle', icon: RectangleHorizontal, label: 'Rounded' },
                          { id: 'ellipse', icon: Circle, label: 'Ellipse' }
                        ].map((shape) => (
                          <button
                            key={shape.id}
                            onClick={() => setStyleSettings((prev: any) => ({ ...prev, nodeShape: shape.id as NodeShape }))}
                            className={cn(
                              "flex items-center gap-1.5 px-2 py-1 rounded-[4px] transition-all",
                              styleSettings.nodeShape === shape.id 
                                ? "bg-white text-zinc-900 shadow-sm" 
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
                            )}
                            title={shape.label}
                          >
                            <shape.icon size={12} />
                            <span className="text-[9px] font-medium">{shape.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Basis-Skalierung</span>
                        <span className="font-mono text-[10px] text-zinc-400">{(styleSettings.nodeScale ?? 1).toFixed(1)}x</span>
                      </div>
                      <Slider 
                        value={[styleSettings.nodeScale * 100 ?? 100]} 
                        max={250} 
                        step={5} 
                        onValueChange={([val]) => setStyleSettings((prev: any) => ({ ...prev, nodeScale: val / 100 }))}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Radialer Bias</span>
                        <span className="font-mono text-[10px] text-zinc-400">{visualSettings.radialBiasScale.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[visualSettings.radialBiasScale * 100]} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => setVisualSettings({ ...visualSettings, radialBiasScale: val / 100 })}
                        className="py-1"
                      />
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="bg-zinc-100 mx-4" />

                <SidebarGroup className="py-4 pb-6 mt-2">
                  <div className="flex items-center justify-between pr-2 mb-3">
                    <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2">Beschriftung (Labels)</SidebarGroupLabel>
                    <button 
                      onClick={() => setVisualSettings({ ...visualSettings, labelsVisible: !visualSettings.labelsVisible })}
                      className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                    >
                      {visualSettings.labelsVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                  <SidebarGroupContent className="px-3 space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Weight-Mapping</span>
                        <span className="font-mono text-[10px] text-zinc-400">{visualSettings.labelWeightMapping.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[visualSettings.labelWeightMapping * 100]} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => setVisualSettings({ ...visualSettings, labelWeightMapping: val / 100 })}
                        className="py-2"
                      />
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="bg-zinc-100 mx-4" />

                <SidebarGroup className="py-4 pb-6 mt-2">
                  <div className="flex items-center justify-between pr-2 mb-3">
                    <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2">Verbindungen (Edges)</SidebarGroupLabel>
                    <button 
                      onClick={() => setVisualSettings({ ...visualSettings, edgesVisible: !visualSettings.edgesVisible })}
                      className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                    >
                      {visualSettings.edgesVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                  <SidebarGroupContent className="px-3 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Flow Animation</span>
                      <Switch 
                        checked={visualSettings.edgeFlowAnimation}
                        onCheckedChange={(checked) => setVisualSettings({ ...visualSettings, edgeFlowAnimation: checked })}
                        className="scale-75 data-[state=checked]:bg-zinc-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Global Opacity</span>
                        <span className="font-mono text-[10px] text-zinc-400">{Math.round(styleSettings.edgeOpacity * 100)}%</span>
                      </div>
                      <Slider 
                        value={[styleSettings.edgeOpacity * 100]} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => setStyleSettings((prev: any) => ({ ...prev, edgeOpacity: val / 100 }))}
                        className="py-2"
                      />
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}

            {/* PHYSICS TAB */}
            {activeTab === 'physics' && (
              <div>
                <SidebarGroup className="py-4 pb-6 mt-2">
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3 mt-2">Physik-Steuerung</SidebarGroupLabel>
                  <SidebarGroupContent className="px-3 space-y-7">
                    {[
                      { id: 'phys-rep', label: 'Streuung (Abstoßung)', desc: 'Wie stark Elemente sich gegenseitig verdrängen.', value: effectivePhysicsParams?.repulsion ?? 1500, max: 5000, step: 10, key: 'repulsion' },
                      { id: 'phys-spk', label: 'Spannung (Tension)', desc: 'Wie straff Verbindungen die Elemente zusammenziehen.', value: effectivePhysicsParams?.springK ?? 0.06, max: 0.8, step: 0.01, key: 'springK' },
                      { id: 'phys-dmp', label: 'Reibung (Friction)', desc: 'Wie schnell Bewegungen abbremsen.', value: effectivePhysicsParams?.damping ?? 0.88, max: 1, step: 0.01, key: 'damping' },
                      { id: 'phys-lnk', label: 'Abstand (Distance)', desc: 'Die gewünschte Grundlänge aller Verbindungen.', value: effectivePhysicsParams?.linkDistance ?? 80, max: 500, step: 1, key: 'linkDistance' },
                      { id: 'phys-grv', label: 'Schwerkraft (Gravity)', desc: 'Zieht alle Elemente zur Mitte des Canvas.', value: effectivePhysicsParams?.gravity ?? 0, min: -5, max: 10, step: 0.1, key: 'gravity' },
                      { id: 'phys-trb', label: 'Bewegung (Wobble)', desc: 'Erzeugt eine stetige, organische Unruhe.', value: effectivePhysicsParams?.turbulence ?? 0, max: 10, step: 0.1, key: 'turbulence' },
                      { id: 'phys-vto', label: 'Vertikale Ordnung', desc: 'Sortiert Knoten nach Textlänge.', value: effectivePhysicsParams?.verticalOrder ?? 0, max: 10, step: 0.1, key: 'verticalOrder' },
                      { id: 'phys-pls', label: 'Lebendigkeit (Pulse)', desc: 'Organisches Atmen der Knotenabstände.', value: effectivePhysicsParams?.pulse ?? 0, max: 1, step: 0.01, key: 'pulse' },
                    ].map((p) => (
                      <div key={p.id} className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">{p.label}</span>
                            <span className="text-[9px] text-zinc-400 mt-0.5 leading-tight pr-2">{p.desc}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <SliderValue 
                              value={p.value} 
                              min={p.min ?? 0}
                              max={p.max}
                              onCommit={(val) => handlePhysicsChange({ [p.key]: val })} 
                              format={(v) => typeof v === 'number' ? v.toFixed(2) : v} 
                            />
                            <button 
                              onClick={() => handleTogglePhysicsKeyframe(p.id, p.value)}
                              className={`size-5 rounded-full flex items-center justify-center transition-colors ${physKfActive[p.id] ? 'text-indigo-500 bg-indigo-50 border border-indigo-200' : 'text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100'}`}
                            >
                              <Diamond size={10} fill={physKfActive[p.id] ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                        <Slider 
                          value={[p.value]} 
                          min={p.min ?? 0}
                          max={p.max} 
                          step={p.step}
                          onValueChange={([val]) => handlePhysicsChange({ [p.key]: val })}
                        />
                      </div>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}

            {/* CAMERA TAB */}
            {activeTab === 'camera' && (
              <div>
                <SidebarGroup className="py-4 pb-6 mt-2">
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">Ansicht-Positionierung</SidebarGroupLabel>
                  <SidebarGroupContent className="px-3 space-y-6">
                    <div className="flex flex-col items-center gap-3">
                      <div 
                        className="relative w-full h-40 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden"
                        onDoubleClick={() => {
                          network3DRef.current?.resetView();
                          setPuckPos({ x: 0, y: 0 });
                        }}
                        onMouseDown={(e) => {
                          setIsDraggingPuck(true);
                          const rect = e.currentTarget.getBoundingClientRect();
                          const centerX = rect.left + rect.width / 2;
                          const centerY = rect.top + rect.height / 2;

                          const onMove = (ev: MouseEvent) => {
                            const dx = ev.movementX;
                            const dy = ev.movementY;
                            network3DRef.current?.rotateView(-dx * 0.01, -dy * 0.01);

                            const relX = ev.clientX - centerX;
                            const relY = ev.clientY - centerY;
                            
                            const limitX = rect.width / 2 - 24;
                            const limitY = rect.height / 2 - 24;
                            
                            setPuckPos({ 
                              x: Math.max(-limitX, Math.min(limitX, relX)), 
                              y: Math.max(-limitY, Math.min(limitY, relY)) 
                            });
                          };
                          const onUp = () => {
                            setIsDraggingPuck(false);
                            setPuckPos({ x: 0, y: 0 });
                            document.body.style.cursor = 'default';
                            window.removeEventListener('mousemove', onMove);
                            window.removeEventListener('mouseup', onUp);
                          };
                          document.body.style.cursor = 'grabbing';
                          window.addEventListener('mousemove', onMove);
                          window.addEventListener('mouseup', onUp);
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-[1px] bg-zinc-300" />
                          <div className="h-full w-[1px] bg-zinc-300" />
                        </div>

                        <div className="absolute inset-0 p-4 flex flex-col justify-between items-center pointer-events-none">
                          <button 
                            className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                            onClick={() => network3DRef.current?.setRotation(0, 0)}
                          >Y</button>
                          <div className="flex justify-between w-full items-center">
                            <button 
                              className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                              onClick={() => network3DRef.current?.setRotation(-Math.PI/2, Math.PI/2)}
                            >-X</button>
                            <div 
                              className={cn(
                                "size-8 rounded-full bg-white border border-zinc-300 shadow-md flex items-center justify-center text-zinc-400 z-10",
                                !isDraggingPuck && "transition-transform duration-300 ease-out"
                              )}
                              style={{ transform: `translate(${puckPos.x}px, ${puckPos.y}px)` }}
                            >
                              <MoreHorizontal size={14} className="rotate-90" />
                            </div>
                            <button 
                              className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                              onClick={() => network3DRef.current?.setRotation(Math.PI/2, Math.PI/2)}
                            >X</button>
                          </div>
                          <button 
                            className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                            onClick={() => network3DRef.current?.setRotation(Math.PI, 0)}
                          >-Y</button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between w-full px-1">
                         <span className="text-[10px] text-zinc-400 italic">Orbit: Ziehen / Klicken zum Einrasten</span>
                         <button onClick={() => network3DRef.current?.resetView()} className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium underline">Reset</button>
                      </div>
                    </div>

                    <Separator className="bg-zinc-200/40" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Zoom</span>
                        <span className="font-mono text-[10px] text-zinc-400">{Math.round(zoomValue)}</span>
                      </div>
                      <Slider 
                        value={[zoomValue]} 
                        min={10} 
                        max={1000} 
                        onValueChange={([val]) => {
                          setZoomValue(val);
                          network3DRef.current?.setZoom(val);
                        }}
                      />
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}

            {/* CANVAS TAB */}
            {activeTab === 'canvas' && (
              <div>
                <SidebarGroup className="py-4 pb-6 mt-2">
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">Seitenverhältnis (Ratio)</SidebarGroupLabel>
                  <SidebarGroupContent className="px-3">
                    <RadioGroup value={canvasAspectRatio} onValueChange={setCanvasAspectRatio} className="gap-3">
                      {[
                        { id: 'full', label: 'Freies Fenster', icon: Fullscreen },
                        { id: '16:9', label: '16:9 Video', icon: Tv },
                        { id: '4:3', label: '4:3 Standard', icon: Monitor },
                        { id: '3:2', label: '3:2 Foto', icon: Camera },
                        { id: 'din', label: 'DIN A4/A3', icon: FileText },
                      ].map((ratio) => (
                        <div key={ratio.id} className="flex items-center space-x-3 group cursor-pointer">
                          <RadioGroupItem value={ratio.id} id={ratio.id} className="border-zinc-300 text-zinc-900" />
                          <label htmlFor={ratio.id} className="flex items-center gap-2 text-[12px] font-semibold leading-tight cursor-pointer group-hover:text-zinc-900 text-zinc-800 transition-colors">
                            <ratio.icon size={14} className="text-zinc-400" />
                            {ratio.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}
          </SidebarContent>
        </div>
      </div>
    </SidebarProvider>
  );
}