"use client";

import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
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
  Activity,
  Palette
} from 'lucide-react';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
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

interface InspectorProps {
  onPhysicsChange: (p: any) => void;
  onTextChange: (t: string) => void;
  inputText?: string;
  onParsingChange: (m: 'sentence' | 'word' | 'both') => void;
  onGradientChange: (gs: any) => void;
  onStyleChange: (s: any) => void;
  styleSettings: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape?: NodeShape; nodeBorderWidth?: number; depthSizeEnabled?: boolean; depthSizeStrength?: number };
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
  onZoomChange: (v: number) => void;
  zoomValue: number;
  selectedNode?: any;
  onOverrideChange?: (nodeId: string, property: string, value: any, unlinked: boolean) => void;
  visualSettings?: {
    nodesVisible: boolean;
    labelsVisible: boolean;
    edgesVisible: boolean;
    envVisible: boolean;
    radialBiasScale: number;
    radialBiasOpacity: number;
    gradientOrigin: string;
    gradientPeriphery: string;
    labelWeightMapping: number;
    edgeFlowAnimation: boolean;
    envAtmosphereSeed: number;
    glitchActive: boolean;
    glitchBrushRadius: number;
    glitchFeather: number;
    pathSmoothness: number;
    pathCameraFollow: boolean;
  };
  onVisualSettingsChange?: (vs: any) => void;
}

export function Inspector({
  onPhysicsChange, onTextChange, inputText = "", onParsingChange, onGradientChange,
  onStyleChange, onNodeAppearanceChange, onEdgeAppearanceChange,
  nodeAppearance, appliedNodePreset, canvasAspectRatio = 'full', onCanvasAspectRatioChange, effectivePhysicsParams,
  currentTime, cameraKeyframes, physicsKeyframes, onTogglePhysicsKeyframe,
  width, viewMode, onDeleteKeyframe, onCollapse, isSidebarOpen = true, onToggleSidebar,
  onPanView, onRotateView, onSetRotation, onResetView, styleSettings,
  onZoomChange, zoomValue,
  selectedNode, onOverrideChange, visualSettings = {
    nodesVisible: true,
    labelsVisible: true,
    edgesVisible: true,
    envVisible: true,
    radialBiasScale: 0.5,
    radialBiasOpacity: 0.5,
    gradientOrigin: '#4f46e5',
    gradientPeriphery: '#10b981',
    labelWeightMapping: 0.5,
    edgeFlowAnimation: false,
    envAtmosphereSeed: 123,
    glitchActive: false,
    glitchBrushRadius: 100,
    glitchFeather: 0.5,
    pathSmoothness: 0.5,
    pathCameraFollow: true
  },
  onVisualSettingsChange
}: InspectorProps) {
  const [localText, setLocalText] = useState(inputText);
  const [activeTab, setActiveTab] = useState<'content' | 'visual' | 'physics' | 'camera' | 'canvas'>('content');
  const [puckPos, setPuckPos] = useState({ x: 0, y: 0 });
  const [isDraggingPuck, setIsDraggingPuck] = useState(false);
  const [panPuckPos, setPanPuckPos] = useState({ x: 0, y: 0 });
  const [isDraggingPanPuck, setIsDraggingPanPuck] = useState(false);
  const [zoomPuckPos, setZoomPuckPos] = useState({ x: 0, y: 0 });
  const [isDraggingZoomPuck, setIsDraggingZoomPuck] = useState(false);

  // Sync local text with default input text on load
  useEffect(() => {
    if (inputText && !localText) {
      setLocalText(inputText);
    }
  }, [inputText]);

  // Sync physics keyframe states
  const physKfActive = useMemo(() => {
    const result: Record<string, boolean> = {};
    const tracks = ['phys-rep', 'phys-spk', 'phys-dmp', 'phys-min', 'phys-lnk', 'phys-grv', 'phys-trb', 'phys-vto', 'phys-pls'];
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
            onClick={onCollapse}
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
        
        {/* VS Code Style Activity Bar (Icons) */}
        <div className="w-11 border-r border-sidebar-border/60 bg-sidebar-accent/50 flex flex-col items-center py-4 gap-2">
          <button 
            onClick={onCollapse}
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
            <button onClick={onCollapse} className="text-zinc-300 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors md:hidden">
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
                      onClick={() => onTextChange(localText)}
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
                    <RadioGroup defaultValue="word" onValueChange={(v) => onParsingChange(v as any)} className="gap-4">
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

            {/* VISUAL TAB (Accordion-based Property Stack) */}
            {activeTab === 'visual' && (
              <div className="px-3 py-4">
                <Accordion type="multiple" defaultValue={["nodes", "labels", "edges", "environment"]} className="space-y-3">

                  {/* KNOTEN (Nodes) */}
                  <AccordionItem value="nodes" className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-zinc-50/80 dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors">
                      <div className="flex items-center w-full pr-2 gap-2">
                        <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wide text-[10px]">Knoten</span>
                        <button
                          className={cn(
                            "ml-auto p-0 transition-colors",
                            visualSettings.nodesVisible
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onVisualSettingsChange?.({ ...visualSettings, nodesVisible: !visualSettings.nodesVisible });
                          }}
                        >
                          {visualSettings.nodesVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 py-2 space-y-3 bg-white dark:bg-zinc-900/10">
                      <div className="space-y-3 pl-2">
                        <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">Form</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                          {[
                            { id: 'rectangle', icon: Square, label: 'Rect' },
                            { id: 'rounded-rectangle', icon: RectangleHorizontal, label: 'Rounded' },
                            { id: 'ellipse', icon: Circle, label: 'Ellipse' }
                          ].map((shape) => (
                            <button
                              key={shape.id}
                              onClick={() => onStyleChange({ nodeShape: shape.id as NodeShape })}
                              className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md transition-all text-[9px] font-medium",
                                styleSettings.nodeShape === shape.id
                                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                              )}
                              title={shape.label}
                            >
                              <shape.icon size={12} />
                              <span>{shape.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pl-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Basis-Skalierung</span>
                          <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{(styleSettings.nodeScale ?? 1).toFixed(1)}x</span>
                        </div>
                        <Slider
                          value={[(styleSettings.nodeScale ?? 1) * 100]}
                          max={250}
                          step={5}
                          onValueChange={([val]) => onStyleChange({ nodeScale: val / 100 })}
                          className="py-2"
                        />
                      </div>

                      <div className="space-y-2 pl-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Radialer Bias</span>
                          <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{visualSettings.radialBiasScale.toFixed(2)}</span>
                        </div>
                        <Slider
                          value={[visualSettings.radialBiasScale * 100]}
                          max={100}
                          step={1}
                          onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, radialBiasScale: val / 100 })}
                          className="py-2"
                        />
                        <p className="text-[9px] text-zinc-400 mt-0.5 leading-tight pr-2">Scale = Basis + (Bias × Dist)</p>
                      </div>

                      {/* COLOR MODE - Gradient vs Cluster */}
                      <div className="space-y-3 pl-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
                        <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">Farbmodus</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                          {[
                            { id: 'gradient', label: 'Gradient' },
                            { id: 'cluster', label: 'Cluster' }
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              onClick={() => onVisualSettingsChange?.({ ...visualSettings, colorMode: mode.id as 'gradient' | 'cluster' })}
                              className={cn(
                                "flex-1 flex flex-col items-center justify-center px-2 py-1.5 rounded-md transition-all text-[9px] font-medium",
                                visualSettings.colorMode === mode.id
                                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                              )}
                            >
                              <span>{mode.label}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-[9px] text-zinc-400 leading-tight pr-2">
                          {visualSettings.colorMode === 'cluster' 
                            ? 'Knoten werden nach Satzzugehörigkeit eingefärbt. Überlappende Knoten erhalten gemischte Farben.'
                            : 'Knoten werden nach Abstand zum Zentrum eingefärbt (Origin → Periphery).'
                          }
                        </p>
                        
                        {/* Cluster Palette Preview - only show in cluster mode */}
                        {visualSettings.colorMode === 'cluster' && (
                          <div className="pt-2">
                            <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase font-medium tracking-wide">Cluster-Palette</span>
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {(visualSettings.clusterPalette || ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']).map((color, i) => (
                                <div 
                                  key={i}
                                  className="size-5 rounded-md border-2 border-zinc-300 dark:border-zinc-600 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  title={`Cluster ${i + 1}: ${color}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* BESCHRIFTUNG (Labels) */}
                  <AccordionItem value="labels" className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-zinc-50/80 dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors">
                      <div className="flex items-center w-full pr-2 gap-2">
                        <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wide text-[10px]">Beschriftung</span>
                        <button
                          className={cn(
                            "ml-auto p-0 transition-colors",
                            visualSettings.labelsVisible
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onVisualSettingsChange?.({ ...visualSettings, labelsVisible: !visualSettings.labelsVisible });
                          }}
                        >
                          {visualSettings.labelsVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 space-y-4 bg-white dark:bg-zinc-900/10">
                      <div className="space-y-2 pl-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Weight-Mapping</span>
                          <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{visualSettings.labelWeightMapping.toFixed(2)}</span>
                        </div>
                        <Slider
                          value={[visualSettings.labelWeightMapping * 100]}
                          max={100}
                          step={1}
                          onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, labelWeightMapping: val / 100 })}
                          className="py-2"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* VERBINDUNGEN (Edges) */}
                  <AccordionItem value="edges" className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-zinc-50/80 dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors">
                      <div className="flex items-center w-full pr-2 gap-2">
                        <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wide text-[10px]">Verbindungen</span>
                        <button
                          className={cn(
                            "ml-auto p-0 transition-colors",
                            visualSettings.edgesVisible
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onVisualSettingsChange?.({ ...visualSettings, edgesVisible: !visualSettings.edgesVisible });
                          }}
                        >
                          {visualSettings.edgesVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 space-y-4 bg-white dark:bg-zinc-900/10">
                      <div className="pl-3 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Flow Animation</span>
                        <Switch
                          checked={visualSettings.edgeFlowAnimation}
                          onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, edgeFlowAnimation: checked })}
                          className="scale-90 data-[state=checked]:bg-zinc-900"
                        />
                      </div>

                      <div className="space-y-2 pl-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Global Opacity</span>
                          <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{Math.round(styleSettings.edgeOpacity * 100)}%</span>
                        </div>
                        <Slider
                          value={[styleSettings.edgeOpacity * 100]}
                          max={100}
                          step={1}
                          onValueChange={([val]) => onStyleChange({ edgeOpacity: val / 100 })}
                          className="py-2"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* UMGEBUNG (Environment) */}
                  <AccordionItem value="environment" className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-zinc-50/80 dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors">
                      <div className="flex items-center w-full pr-2 gap-2">
                        <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wide text-[10px]">Umgebung</span>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onVisualSettingsChange?.({ ...visualSettings, envAtmosphereSeed: Math.random() * 1000 });
                            }}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
                            title="Shuffle Atmosphere"
                          >
                            <Dices size={13} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onVisualSettingsChange?.({ ...visualSettings, envVisible: !visualSettings.envVisible });
                            }}
                            className={cn(
                              "p-0 transition-colors",
                              visualSettings.envVisible
                                ? "text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                            )}
                          >
                            {visualSettings.envVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 space-y-3 bg-white dark:bg-zinc-900/10">
                      <div className="space-y-3 pl-3">
                        <span className="text-zinc-700 dark:text-zinc-300 text-[10px] uppercase tracking-wide font-semibold">Atmosphere Gradient</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase font-medium tracking-wide">Origin</span>
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-md border-2 border-zinc-300 dark:border-zinc-600 shadow-sm" style={{ backgroundColor: visualSettings.gradientOrigin }} />
                              <Input
                                value={visualSettings.gradientOrigin}
                                className="h-7 text-[9px] font-mono bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                                onChange={(e) => onVisualSettingsChange?.({ ...visualSettings, gradientOrigin: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase font-medium tracking-wide">Periphery</span>
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-md border-2 border-zinc-300 dark:border-zinc-600 shadow-sm" style={{ backgroundColor: visualSettings.gradientPeriphery }} />
                              <Input
                                value={visualSettings.gradientPeriphery}
                                className="h-7 text-[9px] font-mono bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                                onChange={(e) => onVisualSettingsChange?.({ ...visualSettings, gradientPeriphery: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* GLITCH PAINT */}
                  <AccordionItem value="glitch" className="border-2 border-indigo-100 dark:border-indigo-900/30 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-indigo-50/80 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                      <div className="flex items-center w-full pr-2 gap-2">
                        <span className="text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wide text-[10px]">Glitch Paint</span>
                        <Switch
                          className="ml-auto scale-90 data-[state=checked]:bg-indigo-600"
                          checked={visualSettings.glitchActive}
                          onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, glitchActive: checked })}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </AccordionTrigger>
                    {visualSettings.glitchActive && (
                      <AccordionContent className="px-3 py-2 space-y-4 bg-indigo-50/20 dark:bg-indigo-950/10">
                        <div className="space-y-2 pl-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Brush Radius</span>
                            <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{visualSettings.glitchBrushRadius}px</span>
                          </div>
                          <Slider
                            value={[visualSettings.glitchBrushRadius]}
                            max={500}
                            step={5}
                            onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, glitchBrushRadius: val })}
                            className="py-2"
                          />
                        </div>
                        <div className="space-y-2 pl-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Feather</span>
                            <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{visualSettings.glitchFeather.toFixed(2)}</span>
                          </div>
                          <Slider
                            value={[visualSettings.glitchFeather * 100]}
                            max={100}
                            step={1}
                            onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, glitchFeather: val / 100 })}
                            className="py-2"
                          />
                        </div>
                      </AccordionContent>
                    )}
                  </AccordionItem>

                  {/* PATH ANIMATOR */}
                  <AccordionItem value="path" className="border-2 border-emerald-100 dark:border-emerald-900/30 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-emerald-50/80 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                      <div className="flex items-center w-full pr-2 gap-2">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wide text-[10px]">Path Animator</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-2 space-y-4 bg-emerald-50/20 dark:bg-emerald-950/10">
                      <div className="pl-3 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Camera Follow</span>
                        <Switch
                          checked={visualSettings.pathCameraFollow}
                          onCheckedChange={(checked) => onVisualSettingsChange?.({ ...visualSettings, pathCameraFollow: checked })}
                          className="scale-90 data-[state=checked]:bg-emerald-600"
                        />
                      </div>

                      <div className="space-y-2 pl-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Smoothness</span>
                          <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{visualSettings.pathSmoothness.toFixed(2)}</span>
                        </div>
                        <Slider
                          value={[visualSettings.pathSmoothness * 100]}
                          max={100}
                          step={1}
                          onValueChange={([val]) => onVisualSettingsChange?.({ ...visualSettings, pathSmoothness: val / 100 })}
                          className="py-2"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
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
                      { id: 'phys-spk', label: 'Spannung (Tension)', desc: 'Wie straff Verbindungen die Elemente zusammenziehen. Höher = snappier.', value: effectivePhysicsParams?.springK ?? 0.2, max: 0.8, step: 0.01, key: 'springK' },
                      { id: 'phys-dmp', label: 'Reibung (Friction)', desc: 'Wie schnell Bewegungen abbremsen. Niedriger = bouncier.', value: effectivePhysicsParams?.damping ?? 0.85, max: 1, step: 0.01, key: 'damping' },
                      { id: 'phys-lnk', label: 'Abstand (Distance)', desc: 'Die gewünschte Grundlänge aller Verbindungen.', value: effectivePhysicsParams?.linkDistance ?? 80, max: 500, step: 1, key: 'linkDistance' },
                      { id: 'phys-grv', label: 'Schwerkraft (Gravity)', desc: 'Zieht alle Elemente zur Mitte des Canvas.', value: effectivePhysicsParams?.gravity ?? 0, min: -5, max: 10, step: 0.1, key: 'gravity' },
                      { id: 'phys-trb', label: 'Bewegung (Wobble)', desc: 'Erzeugt eine stetige, organische Unruhe.', value: effectivePhysicsParams?.turbulence ?? 0, max: 10, step: 0.1, key: 'turbulence' },
                      { id: 'phys-vto', label: 'Vertikale Ordnung', desc: 'Sortiert Knoten nach Textlänge (kurz oben, lang unten).', value: effectivePhysicsParams?.verticalOrder ?? 0, max: 10, step: 0.1, key: 'verticalOrder' },
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
                              onCommit={(val) => onPhysicsChange({ [p.key]: val })} 
                              format={(v) => typeof v === 'number' ? v.toFixed(2) : v} 
                            />
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
                <SidebarGroup className="py-4 pb-6 mt-2">
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">Ansicht-Positionierung</SidebarGroupLabel>
                  <SidebarGroupContent className="px-3 space-y-6">
                    
                    <div className="flex flex-col items-center gap-3">
                      <div 
                        className="relative w-full h-40 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden"
                        onDoubleClick={() => {
                          onResetView();
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
                            onRotateView(-dx * 0.01, -dy * 0.01);

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
                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-[0.05]">
                          {Array.from({ length: 72 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-zinc-900" />
                          ))}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-[1px] bg-zinc-300" />
                          <div className="h-full w-[1px] bg-zinc-300" />
                          <div className="absolute w-full h-[1px] bg-zinc-300/20 rotate-[31deg]" />
                          <div className="absolute w-full h-[1px] bg-zinc-300/20 -rotate-[31deg]" />
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
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Ansicht verschieben (Pan)</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="relative w-full h-32 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden"
                          onDoubleClick={() => {
                            onResetView();
                            setPanPuckPos({ x: 0, y: 0 });
                          }}
                          onMouseDown={(e) => {
                            setIsDraggingPanPuck(true);
                            const rect = e.currentTarget.getBoundingClientRect();
                            const centerX = rect.left + rect.width / 2;
                            const centerY = rect.top + rect.height / 2;

                            const onMove = (ev: MouseEvent) => {
                              const scale = 5;
                              onPanView(ev.movementX * scale, -ev.movementY * scale);

                              const relX = ev.clientX - centerX;
                              const relY = ev.clientY - centerY;
                              
                              const limitX = rect.width / 2 - 16;
                              const limitY = rect.height / 2 - 16;
                              
                              setPanPuckPos({ 
                                x: Math.max(-limitX, Math.min(limitX, relX)), 
                                y: Math.max(-limitY, Math.min(limitY, relY)) 
                              });
                            };
                            const onUp = () => {
                              setIsDraggingPanPuck(false);
                              setPanPuckPos({ x: 0, y: 0 });
                              document.body.style.cursor = 'default';
                              window.removeEventListener('mousemove', onMove);
                              window.removeEventListener('mouseup', onUp);
                            };
                            document.body.style.cursor = 'grabbing';
                            window.addEventListener('mousemove', onMove);
                            window.addEventListener('mouseup', onUp);
                          }}
                        >
                          {/* Grid Background */}
                          <div className="absolute inset-0 grid grid-cols-8 grid-rows-3 pointer-events-none opacity-[0.05]">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div key={i} className="border-[0.5px] border-zinc-900" />
                            ))}
                          </div>
                          
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-[1px] bg-zinc-300" />
                            <div className="h-full w-[1px] bg-zinc-300" />
                          </div>

                          <div 
                            className={cn(
                              "size-8 rounded-lg bg-white border border-zinc-300 shadow-sm flex items-center justify-center text-zinc-400 z-10 transition-colors",
                              isDraggingPanPuck ? "border-blue-500 text-blue-500 shadow-md" : "group-hover:border-zinc-400",
                              !isDraggingPanPuck && "transition-transform duration-300 ease-out"
                            )}
                            style={{ 
                              transform: `translate(${panPuckPos.x}px, ${panPuckPos.y}px)` 
                            }}
                          >
                            <Move size={14} />
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-400 italic">Ziehen zum Verschieben</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Zoom</span>
                        <span className="text-[10px] font-mono text-zinc-400">{zoomValue.toFixed(1)}%</span>
                      </div>
                      
                      <div className="relative h-6 flex items-center px-1 group">
                        {/* Slider Track */}
                        <div className="absolute inset-x-1 h-1.5 bg-zinc-200 rounded-full" />
                        {/* Center Tick */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-3 bg-zinc-300 z-0" />
                        
                        {/* Draggable Handle */}
                        <div 
                          className={cn(
                            "absolute size-4 rounded-full bg-white border border-zinc-300 shadow-sm z-10 cursor-grab active:cursor-grabbing hover:border-zinc-400 transition-colors flex items-center justify-center",
                            isDraggingZoomPuck && "border-blue-500 shadow-md",
                            !isDraggingZoomPuck && "transition-all duration-300 ease-out"
                          )}
                          style={{ 
                            left: `calc(50% + ${zoomPuckPos.x}px)`,
                            transform: 'translateX(-50%)'
                          }}
                          onMouseDown={(e) => {
                            setIsDraggingZoomPuck(true);
                            const startX = e.clientX;
                            const startPuckX = zoomPuckPos.x;

                            const onMove = (ev: MouseEvent) => {
                              const dx = ev.clientX - startX;
                              const newPuckX = startPuckX + dx;
                              
                              // Clamp handle movement to track
                              const limit = 100; // Track half-width approx
                              const clampedX = Math.max(-limit, Math.min(limit, newPuckX));
                              setZoomPuckPos({ x: clampedX, y: 0 });

                              // Relative zoom: displacement from center = speed/delta
                              // We use a non-linear feel: further from center = faster zoom
                              const scale = 0.05;
                              const delta = clampedX * scale;
                              onZoomChange(Math.max(0, Math.min(100, zoomValue + delta)));
                            };
                            const onUp = () => {
                              setIsDraggingZoomPuck(false);
                              setZoomPuckPos({ x: 0, y: 0 });
                              document.body.style.cursor = 'default';
                              window.removeEventListener('mousemove', onMove);
                              window.removeEventListener('mouseup', onUp);
                            };
                            document.body.style.cursor = 'grabbing';
                            window.addEventListener('mousemove', onMove);
                            window.addEventListener('mouseup', onUp);
                          }}
                        >
                          <div className="size-1 rounded-full bg-zinc-300" />
                        </div>
                      </div>
                      <div className="flex justify-between px-1">
                        <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-tight">-</span>
                        <span className="text-[9px] text-zinc-400 italic">Schieben zum Zoomen (Relativ)</span>
                        <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-tight">+</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full h-8 text-[11px] bg-white border-zinc-200 mt-4"
                      onClick={() => {
                        onResetView();
                        setPanPuckPos({ x: 0, y: 0 });
                        onZoomChange(50); // Default zoom on reset
                      }}
                    >
                      Kamera zurücksetzen
                    </Button>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            )}

            {activeTab === 'canvas' && (
              <div>
                <SidebarGroup className="py-4 pb-6 mt-2">
                  <SidebarGroupLabel className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] px-2 mb-3">Canvas Layout</SidebarGroupLabel>
                  <SidebarGroupContent className="px-3 space-y-6">
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 mb-3 block">Seitenverhältnis</span>
                      <RadioGroup 
                        value={canvasAspectRatio} 
                        onValueChange={onCanvasAspectRatioChange}
                        className="grid grid-cols-2 gap-2"
                      >
                        {[
                          { id: 'full', label: 'Vollbild', icon: Fullscreen },
                          { id: '16:9', label: '16:9 Cinema', icon: MonitorPlay },
                          { id: '4:3', label: '4:3 Standard', icon: Tv },
                          { id: '3:2', label: '3:2 Classic', icon: Image },
                          { id: 'din', label: 'DIN Landscape', icon: FileText },
                        ].map((ratio) => {
                          const IconComponent = ratio.icon;
                          return (
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
                              <span className="mb-1 flex h-4 items-center justify-center">
                                <IconComponent size={16} className="text-zinc-600" />
                              </span>
                              <span className="text-[10px] font-medium">{ratio.label}</span>
                            </label>
                          </div>
                        );
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <div className="px-3 pt-2">
                  <p className="text-[10px] text-zinc-400 leading-relaxed italic border-t border-zinc-100 pt-4">
                    Hinweis: Die Seitenverhältnis-Einstellungen wenden einen Letterbox-Effekt auf das Viewport an, um Komposition und Bildausschnitt zu steuern.
                  </p>
                </div>
              </div>
            )}

            <div className="h-20" />
          </SidebarContent>

          <div className="p-3 bg-zinc-100/80 border-t border-zinc-200 flex items-center justify-between">
            <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Workspace Properties</p>
            <p className="text-[9px] text-zinc-400 font-mono">v0.8.2</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
