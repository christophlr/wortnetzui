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
import { ContentTab } from './inspector/ContentTab';
import { VisualTab } from './inspector/VisualTab';
import { PhysicsTab } from './inspector/PhysicsTab';
import { CameraTab } from './inspector/CameraTab';
import { CanvasTab } from './inspector/CanvasTab';

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
              <VisualTab
                styleSettings={styleSettings}
                visualSettings={visualSettings}
                onStyleChange={onStyleChange}
                onVisualSettingsChange={onVisualSettingsChange}
              />
            )}

            {/* PHYSICS TAB */}
            {activeTab === 'physics' && (
              <PhysicsTab
                effectivePhysicsParams={effectivePhysicsParams}
                physKfActive={physKfActive}
                onPhysicsChange={onPhysicsChange}
                onTogglePhysicsKeyframe={onTogglePhysicsKeyframe}
              />
            )}

            {/* CAMERA TAB */}
            {activeTab === 'camera' && (
              <CameraTab
                onSetRotation={onSetRotation}
                onResetView={onResetView}
                onPanView={onPanView}
                onZoomChange={onZoomChange}
                zoomValue={zoomValue}
              />
            )}

            {activeTab === 'canvas' && (
              <CanvasTab
                canvasAspectRatio={canvasAspectRatio}
                onCanvasAspectRatioChange={onCanvasAspectRatioChange}
              />
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