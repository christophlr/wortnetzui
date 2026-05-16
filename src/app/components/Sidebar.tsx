"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  PanelRight,
  PanelRightClose,
  X,
} from 'lucide-react';

import {
  SidebarContent as ShadSidebarContent,
  SidebarHeader as ShadSidebarHeader,
  SidebarProvider as ShadSidebarProvider,
} from './ui/sidebar';

import type { NodeShape, NodeAppearanceSettings } from '../networkTheme';
import { defaultGradientSettings } from '../networkTheme';
import { ContentTab } from './sidebar/tabs/ContentTab';
import { VisualTab } from './sidebar/tabs/VisualTab';
import { PhysicsTab } from './sidebar/tabs/PhysicsTab';
import { CameraTab } from './sidebar/tabs/CameraTab';
import { CanvasTab } from './sidebar/tabs/CanvasTab';
import {
  SidebarActivityButton,
  SidebarTabHeader,
} from './sidebar/SidebarAtoms';
import {
  SIDEBAR_TABS,
  sidebarTabTitleKey,
  type SidebarTabId,
} from './sidebar/sidebarConfig';
import { useT } from '../i18n/useT';

interface SidebarProps {
  onPhysicsChange: (p: any) => void;
  onTextChange: (t: string) => void;
  inputText?: string;
  parseMode: 'sentence' | 'word' | 'both';
  onParsingChange: (m: 'sentence' | 'word' | 'both') => void;
  onGradientChange: (gs: any) => void;
  onStyleChange: (s: any) => void;
  styleSettings: { edgeOpacity: number; edgeWidth: number; nodeScale: number; nodeShape: NodeShape; nodeBorderWidth?: number; depthSizeEnabled?: boolean; depthSizeStrength?: number };
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

export function Sidebar({
  onPhysicsChange, onTextChange, inputText = "", parseMode, onParsingChange, onGradientChange,
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
    gradientOrigin: defaultGradientSettings.innerColor,
    gradientPeriphery: defaultGradientSettings.outerColor,
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
}: SidebarProps) {
  const { t } = useT();
  const [localText, setLocalText] = useState(inputText);
  const [activeTab, setActiveTab] = useState<SidebarTabId>('content');

  // Sync local text with default input text on load and when context changes (e.g. workspace load)
  useEffect(() => {
    if (inputText !== undefined && inputText !== localText) {
      setLocalText(inputText);
    }
  }, [inputText]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync physics keyframe states
  const physKfActive = useMemo(() => {
    const result: Record<string, boolean> = {};
    const tracks = ['phys-rep', 'phys-spk', 'phys-dmp', 'phys-lnk', 'phys-grv', 'phys-trb', 'phys-vto', 'phys-pls'];
    tracks.forEach(trackId => {
      result[trackId] = (physicsKeyframes?.[trackId] ?? []).some(kf => Math.abs(kf.time - currentTime) < 0.1);
    });
    return result;
  }, [physicsKeyframes, currentTime]);

  const handleTabClick = (id: SidebarTabId) => {
    setActiveTab(id);
    if (!isSidebarOpen && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const activityButtons = SIDEBAR_TABS.map((tab) => (
    <SidebarActivityButton
      key={tab.id}
      active={activeTab === tab.id}
      icon={tab.icon}
      label={t(sidebarTabTitleKey(tab.id))}
      onClick={() => handleTabClick(tab.id)}
    />
  ));

  if (!isSidebarOpen) {
    return (
      <div className="flex h-full w-12 bg-sidebar border border-sidebar-border shadow-sm rounded-tr-xl rounded-b-xl overflow-hidden pointer-events-auto">
        <div className="w-full flex flex-col items-center py-4 gap-2 bg-sidebar-accent/50">
          <button
            onClick={onCollapse}
            className="size-8 mb-2 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            title={t('common.sidebar.expand')}
          >
            <PanelRight size={18} />
          </button>
          {activityButtons}
        </div>
      </div>
    );
  }

  const headerTitle = t(sidebarTabTitleKey(activeTab)).toUpperCase();

  return (
    <ShadSidebarProvider className="h-full w-full">
      <div className="flex h-full w-full bg-sidebar border border-sidebar-border shadow-sm rounded-tr-xl overflow-hidden pointer-events-auto">

        {/* VS Code Style Activity Bar (Icons) */}
        <div className="w-11 border-r border-sidebar-border/60 bg-sidebar-accent/50 flex flex-col items-center py-4 gap-2">
          <button
            onClick={onCollapse}
            className="size-8 mb-2 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            title={t('common.sidebar.collapse')}
          >
            <PanelRightClose size={18} />
          </button>
          {activityButtons}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ShadSidebarHeader className="p-4 pb-2 border-b border-sidebar-border/50 flex flex-row items-center justify-between">
            <SidebarTabHeader>{headerTitle}</SidebarTabHeader>
            <button onClick={onCollapse} className="text-zinc-300 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors md:hidden">
              <X size={16} />
            </button>
          </ShadSidebarHeader>

          <ShadSidebarContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
            
            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <ContentTab
                localText={localText}
                setLocalText={setLocalText}
                onTextChange={onTextChange}
                parseMode={parseMode}
                onParsingChange={onParsingChange}
              />
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
          </ShadSidebarContent>

        </div>
      </div>
    </ShadSidebarProvider>
  );
}