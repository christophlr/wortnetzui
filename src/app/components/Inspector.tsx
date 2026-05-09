"use client";

import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronRight, 
  Diamond, 
  Type, 
  Layers, 
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
  Layout
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

const GRADIENT_PRESETS = [
  { name: 'Indigo → Violett', inner: '#4f46e5', outer: '#7c3aed' },
  { name: 'Cyan → Grün', inner: '#06b6d4', outer: '#10b981' },
  { name: 'Lila → Pink', inner: '#a855f7', outer: '#ec4899' },
  { name: 'Orange → Rot', inner: '#f97316', outer: '#ef4444' },
];

interface InspectorProps {
  onPhysicsChange: (p: any) => void;
  onTextChange: (t: string) => void;
  inputText?: string;
  onParsingChange: (m: 'sentence' | 'word' | 'both') => void;
  onGradientChange: (gs: any) => void;
  onStyleChange: (s: any) => void;
  onNodeAppearanceChange: (na: NodeAppearanceSettings) => void;
  onEdgeAppearanceChange: (ea: any) => void;
  nodeAppearance: NodeAppearanceSettings;
  appliedNodePreset: 'outline' | 'filled' | null;
  effectivePhysicsParams: any;
  currentTime: number;
  cameraKeyframes: any[];
  physicsKeyframes: Record<string, any[]>;
  onTogglePhysicsKeyframe: (track: string, val: number) => void;
  width: number;
  viewMode: '2D' | '3D';
  onDeleteKeyframe: (time: number) => void;
  onCollapse?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onPanView: (dx: number, dy: number) => void;
  onRotateView: (dTheta: number, dPhi: number) => void;
  onSetRotation: (theta: number, phi: number) => void;
  onResetView: () => void;
  canvasAspectRatio?: string;
  onCanvasAspectRatioChange?: (v: string) => void;
}

export function Inspector({
  onPhysicsChange, onTextChange, inputText = "", onParsingChange, onGradientChange,
  onStyleChange, onNodeAppearanceChange, onEdgeAppearanceChange,
  nodeAppearance, appliedNodePreset, canvasAspectRatio = 'full', onCanvasAspectRatioChange, effectivePhysicsParams,
  currentTime, cameraKeyframes, physicsKeyframes, onTogglePhysicsKeyframe,
  width, viewMode, onDeleteKeyframe, onCollapse, isSidebarOpen = true, onToggleSidebar,
  onPanView, onRotateView, onSetRotation, onResetView
}: InspectorProps) {
  const [localText, setLocalText] = useState(inputText);
  const [activeTab, setActiveTab] = useState<'content' | 'visual' | 'physics' | 'camera' | 'canvas'>('content');
  const [localPan, setLocalPan] = useState({ x: 0, y: 0 });
  const [puckPos, setPuckPos] = useState({ x: 0, y: 0 });
  const [isDraggingPuck, setIsDraggingPuck] = useState(false);
  const lastPanRef = useRef({ x: 0, y: 0 });

  // Sync local text with default input text on load
  useEffect(() => {
    if (inputText && !localText) {
      setLocalText(inputText);
    }
  }, [inputText]);

  // Sync physics keyframe states
  const physKfActive = useMemo(() => {
    const result: Record<string, boolean> = {};
    const tracks = ['phys-rep', 'phys-spk', 'phys-dmp', 'phys-min', 'phys-lnk', 'phys-grv', 'phys-trb'];
    tracks.forEach(trackId => {
      result[trackId] = (physicsKeyframes?.[trackId] ?? []).some(kf => Math.abs(kf.time - currentTime) < 0.1);
    });
    return result;
  }, [physicsKeyframes, currentTime]);

  const handleTabClick = (id: typeof activeTab) => {
    setActiveTab(id);
    if (!isSidebarOpen && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const SidebarTab = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => handleTabClick(id)}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center",
        activeTab === id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
      )}
      title={label}
    >
      <Icon size={20} className={cn(activeTab === id ? "scale-110" : "scale-100 group-hover:scale-105")} />
      {activeTab === id && (
        <div className="absolute left-0 h-5 w-0.5 bg-zinc-900 rounded-r-full" />
      )}
    </button>
  );

  if (!isSidebarOpen) {
    return (
      <div className="flex h-full w-12 bg-zinc-50 border border-zinc-200 shadow-sm rounded-tr-xl rounded-b-xl overflow-hidden pointer-events-auto">
        <div className="w-full flex flex-col items-center py-4 gap-2 bg-zinc-100/50">
          <button 
            onClick={onCollapse}
            className="size-8 mb-2 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Sidebar einblenden"
          >
            <PanelRight size={18} />
          </button>
          <SidebarTab id="content" icon={Type} label="Inhalt" />
          <SidebarTab id="visual" icon={Layers} label="Visualisierung" />
          <SidebarTab id="physics" icon={Atom} label="Physik" />
          <SidebarTab id="camera" icon={Video} label="Kamera" />
          <SidebarTab id="canvas" icon={Monitor} label="Canvas" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="h-full w-full">
      <div className="flex h-full w-full bg-zinc-50 border border-zinc-200 shadow-sm rounded-tr-xl overflow-hidden pointer-events-auto">
        
        {/* VS Code Style Activity Bar (Icons) */}
        <div className="w-11 border-r border-zinc-200/60 bg-zinc-100/50 flex flex-col items-center py-4 gap-2">
          <button 
            onClick={onCollapse}
            className="size-8 mb-2 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Sidebar ausblenden"
          >
            <PanelRightClose size={18} />
          </button>
          <SidebarTab id="content" icon={Type} label="Inhalt" />
          <SidebarTab id="visual" icon={Layers} label="Visualisierung" />
          <SidebarTab id="physics" icon={Atom} label="Physik" />
          <SidebarTab id="camera" icon={Video} label="Kamera" />
          <SidebarTab id="canvas" icon={Monitor} label="Canvas" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <SidebarHeader className="p-4 pb-2 border-b border-zinc-200/50 flex flex-row items-center justify-between">
            <h2 className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              {activeTab === 'content' ? 'Eigenschaften' : activeTab === 'visual' ? 'Visualisierung' : activeTab === 'physics' ? 'Physik Engine' : activeTab === 'camera' ? 'Kamera Steuerung' : 'Canvas Layout'}
            </h2>
            <button onClick={onCollapse} className="text-zinc-300 hover:text-zinc-500 transition-colors md:hidden">
              <X size={16} />
            </button>
          </SidebarHeader>

          <SidebarContent className="flex-1 overflow-auto p-0">
            
            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Input Text</SidebarGroupLabel>
                  <SidebarGroupContent className="space-y-4 pt-1">
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

                <SidebarGroup>
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Parsing / Zerteilung</SidebarGroupLabel>
                  <SidebarGroupContent className="pt-2">
                    <RadioGroup defaultValue="word" onValueChange={(v) => onParsingChange(v as any)} className="gap-4">
                      {[
                        { id: 'sentence', label: 'Satzebene', desc: 'Sätze → Wort-N-Gramme' },
                        { id: 'word', label: 'Wortebene', desc: 'Wörter → Zeichen-N-Gramme' },
                        { id: 'both', label: 'Beides', desc: 'Wörter als Brücke' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 group cursor-pointer">
                          <RadioGroupItem value={item.id} id={item.id} className="mt-0.5 border-zinc-300 text-zinc-900" />
                          <label htmlFor={item.id} className="text-[12px] font-medium leading-tight cursor-pointer group-hover:text-zinc-900 text-zinc-600 transition-colors">
                            {item.label}
                            <p className="text-[10px] text-zinc-400 font-normal mt-0.5">{item.desc}</p>
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
              <div>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Presets</SidebarGroupLabel>
                  <SidebarGroupContent className="pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className={cn("h-8 text-[11px] bg-white border-zinc-200", appliedNodePreset === 'filled' && "border-indigo-500 bg-indigo-50/30 text-indigo-700")} onClick={() => onNodeAppearanceChange({ borderColor: 'auto', fillColor: 'auto', textColor: '#ffffff' })}>
                        Filled (Export)
                      </Button>
                      <Button variant="outline" size="sm" className={cn("h-8 text-[11px] bg-white border-zinc-200", appliedNodePreset === 'outline' && "border-indigo-500 bg-indigo-50/30 text-indigo-700")} onClick={() => onNodeAppearanceChange({ borderColor: 'auto', fillColor: 'transparent', textColor: 'auto' })}>
                        Outline (Edit)
                      </Button>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="bg-zinc-200/60 mx-4" />

                <SidebarGroup>
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Node Appearance</SidebarGroupLabel>
                  <SidebarGroupContent className="pt-3 space-y-5 px-1">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-600">Skalierung</span>
                        <span className="text-[10px] font-mono text-zinc-400">1.0x</span>
                      </div>
                      <Slider 
                        value={[nodeAppearance.nodeScale ?? 100]} 
                        max={250} 
                        step={5} 
                        onValueChange={([val]) => onNodeAppearanceChange({ ...nodeAppearance, nodeScale: val })}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-600">Kanten Deckkraft</span>
                        <span className="text-[10px] font-mono text-zinc-400">35%</span>
                      </div>
                      <Slider 
                        value={[(styleSettings as any)?.edgeOpacity * 100 || 35]} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => onStyleChange({ edgeOpacity: val / 100 })}
                      />
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="bg-zinc-200/60 mx-4" />

                <SidebarGroup>
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Gradients</SidebarGroupLabel>
                  <SidebarGroupContent className="pt-2 grid grid-cols-2 gap-2">
                    {GRADIENT_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 transition-colors text-left shadow-xs"
                        onClick={() => onGradientChange({ mode: 'gradient', innerColor: p.inner, outerColor: p.outer })}
                      >
                        <div className="size-3.5 rounded-full shadow-sm" style={{ background: `linear-gradient(to bottom right, ${p.inner}, ${p.outer})` }} />
                        <span className="text-[10px] font-medium truncate text-zinc-700">{p.name}</span>
                      </button>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}

            {/* PHYSICS TAB */}
            {activeTab === 'physics' && (
              <div>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Engine Control</SidebarGroupLabel>
                  <SidebarGroupContent className="pt-3 space-y-8 px-1">
                    {[
                      { id: 'phys-rep', label: 'Repulsion (Abstoßung)', value: effectivePhysicsParams?.repulsion ?? 1500, max: 5000, step: 10, key: 'repulsion' },
                      { id: 'phys-spk', label: 'Federkonstante', value: effectivePhysicsParams?.springK ?? 0.06, max: 0.5, step: 0.005, key: 'springK' },
                      { id: 'phys-dmp', label: 'Dämpfung', value: effectivePhysicsParams?.damping ?? 0.88, max: 1, step: 0.01, key: 'damping' },
                      { id: 'phys-min', label: 'Min. Geschwindigkeit', value: effectivePhysicsParams?.minSpeed ?? 0.5, max: 2, step: 0.05, key: 'minSpeed' },
                      { id: 'phys-lnk', label: 'Kantenlänge', value: effectivePhysicsParams?.linkDistance ?? 80, max: 500, step: 1, key: 'linkDistance' },
                      { id: 'phys-grv', label: 'Schwerkraft', value: effectivePhysicsParams?.gravity ?? 0, min: -5, max: 10, step: 0.1, key: 'gravity' },
                      { id: 'phys-trb', label: 'Turbulenz', value: effectivePhysicsParams?.turbulence ?? 0, max: 10, step: 0.1, key: 'turbulence' },
                    ].map((p) => (
                      <div key={p.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-600">{p.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-zinc-400">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
                            <button 
                              onClick={() => onTogglePhysicsKeyframe(p.id, p.value)}
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
                          onValueChange={([val]) => onPhysicsChange({ [p.key]: val })}
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
                <SidebarGroup>
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">View Positioning</SidebarGroupLabel>
                  <SidebarGroupContent className="pt-3 space-y-6 px-1">
                    
                    <div className="flex flex-col items-center gap-3">
                      <div 
                        className="relative size-40 bg-zinc-200/50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden"
                        onMouseDown={(e) => {
                          setIsDraggingPuck(true);
                          const rect = e.currentTarget.getBoundingClientRect();
                          const centerX = rect.left + rect.width / 2;
                          const centerY = rect.top + rect.height / 2;

                          const onMove = (ev: MouseEvent) => {
                            const dx = ev.movementX;
                            const dy = ev.movementY;
                            onRotateView(-dx * 0.01, -dy * 0.01);

                            const relX = ev.clientX - centerX;
                            const relY = ev.clientY - centerY;
                            
                            const limit = 60;
                            const dist = Math.sqrt(relX * relX + relY * relY);
                            if (dist > limit) {
                              setPuckPos({ x: (relX / dist) * limit, y: (relY / dist) * limit });
                            } else {
                              setPuckPos({ x: relX, y: relY });
                            }
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
                          <div className="w-full h-[1.5px] bg-zinc-300" />
                          <div className="h-full w-[1.5px] bg-zinc-300" />
                          <div className="absolute w-full h-[1px] bg-zinc-300/30 rotate-45" />
                          <div className="absolute w-full h-[1px] bg-zinc-300/30 -rotate-45" />
                        </div>

                        <div className="absolute inset-0 p-4 flex flex-col justify-between items-center pointer-events-none">
                          <button 
                            className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                            onClick={() => onSetRotation(0, 0)}
                            title="Top View (Y)"
                          >Y</button>
                          <div className="flex justify-between w-full items-center">
                            <button 
                              className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                              onClick={() => onSetRotation(-Math.PI/2, Math.PI/2)}
                              title="Left View (-X)"
                            >-X</button>
                            
                            <div 
                              className={cn(
                                "size-8 rounded-full bg-white border border-zinc-300 shadow-md flex items-center justify-center text-zinc-400 z-10",
                                !isDraggingPuck && "transition-transform duration-300 ease-out"
                              )}
                              style={{ 
                                transform: `translate(${puckPos.x}px, ${puckPos.y}px)` 
                              }}
                            >
                              <MoreHorizontal size={14} className="rotate-90" />
                            </div>

                            <button 
                              className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                              onClick={() => onSetRotation(Math.PI/2, Math.PI/2)}
                              title="Right View (X)"
                            >X</button>
                          </div>
                          <button 
                            className="pointer-events-auto size-5 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-600 transition-colors"
                            onClick={() => onSetRotation(Math.PI, 0)}
                            title="Bottom View (-Y)"
                          >-Y</button>
                        </div>
                        
                        <button onClick={() => onSetRotation(Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute top-2 left-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 1" />
                        <button onClick={() => onSetRotation(-Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute top-2 right-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 2" />
                        <button onClick={() => onSetRotation(3*Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute bottom-2 left-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 3" />
                        <button onClick={() => onSetRotation(-3*Math.PI/4, Math.PI/4)} className="pointer-events-auto absolute bottom-2 right-2 size-4 rounded bg-zinc-100/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all" title="ISO 4" />
                      </div>
                      
                      <div className="flex justify-between w-full px-1">
                         <span className="text-[10px] text-zinc-400 italic">Orbit: Ziehen / Klicken zum Einrasten</span>
                         <button 
                           onClick={() => onResetView()}
                           className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium underline-offset-2 hover:underline"
                         >
                           Reset
                         </button>
                      </div>
                    </div>

                    <Separator className="bg-zinc-200/40" />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-600">Horizontaler Pan</span>
                        <span className="text-[10px] font-mono text-zinc-400">{localPan.x}</span>
                      </div>
                      <Slider 
                        value={[localPan.x]} 
                        min={-100} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => {
                          const delta = val - lastPanRef.current.x;
                          onPanView(delta * 40, 0);
                          lastPanRef.current.x = val;
                          setLocalPan(prev => ({ ...prev, x: val }));
                        }}
                        onPointerUp={() => {
                          setLocalPan(prev => ({ ...prev, x: 0 }));
                          lastPanRef.current.x = 0;
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-600">Vertikaler Pan</span>
                        <span className="text-[10px] font-mono text-zinc-400">{localPan.y}</span>
                      </div>
                      <Slider 
                        value={[localPan.y]} 
                        min={-100} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => {
                          const delta = val - lastPanRef.current.y;
                          onPanView(0, delta * 40);
                          lastPanRef.current.y = val;
                          setLocalPan(prev => ({ ...prev, y: val }));
                        }}
                        onPointerUp={() => {
                          setLocalPan(prev => ({ ...prev, y: 0 }));
                          lastPanRef.current.y = 0;
                        }}
                      />
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full h-8 text-[11px] bg-white border-zinc-200 mt-4"
                      onClick={() => {
                        onResetView();
                        setLocalPan({ x: 0, y: 0 });
                        lastPanRef.current = { x: 0, y: 0 };
                      }}
                    >
                      Kamera zurücksetzen
                    </Button>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}

            {activeTab === 'canvas' && (
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-blue-500" />
                    Canvas Layout
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-500 mb-3 block">Aspect Ratio</label>
                      <RadioGroup 
                        value={canvasAspectRatio} 
                        onValueChange={onCanvasAspectRatioChange}
                        className="grid grid-cols-2 gap-2"
                      >
                        {[
                          { id: 'full', label: 'Full Screen' },
                          { id: '16:9', label: '16:9 Cinema' },
                          { id: '4:3', label: '4:3 Standard' },
                          { id: '3:2', label: '3:2 Classic' },
                          { id: 'din', label: 'DIN Landscape' },
                        ].map((ratio) => (
                          <div key={ratio.id}>
                            <RadioGroupItem
                              value={ratio.id}
                              id={`ratio-${ratio.id}`}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={`ratio-${ratio.id}`}
                              className="flex flex-col items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/50 p-2 hover:bg-zinc-100 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50/50 cursor-pointer transition-all"
                            >
                              <span className="text-[10px] font-medium">{ratio.label}</span>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                    Note: Aspect ratio settings apply a letterbox effect to the viewport for controlled composition and framing.
                  </p>
                </div>
              </div>
            )}

            <div className="h-20" />
          </SidebarContent>

          <div className="p-3 bg-zinc-100/80 border-t border-zinc-200 flex items-center justify-between">
            <p className="text-[9px] text-zinc-400 font-medium tracking-wide uppercase">Workspace Properties</p>
            <p className="text-[9px] text-zinc-400 font-mono">v0.8.2</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}