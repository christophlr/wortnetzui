const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// 1. Add Imports
content = content.replace(
  "import { PathAnimatorUI } from './components/PathAnimatorUI';",
  "import { PathAnimatorUI } from './components/PathAnimatorUI';\nimport useTimelineHistory from './hooks/useTimelineHistory';\nimport useWorkspaceIO from './hooks/useWorkspaceIO';\nimport { useShortcuts } from './hooks/useShortcuts';"
);

// 2. Remove inline history state
content = content.replace(
  "const [keyframeHistory, setKeyframeHistory] = useState<TimelineState[]>([{ cameraKeyframes: [], physicsKeyframes: EMPTY_PHYSICS_KFS, sceneMarkers: [] }]);\n  const [historyIndex, setHistoryIndex] = useState(0);",
  "// history state managed by useTimelineHistory"
);

// 3. Remove inline shortcuts state
content = content.replace(
  /const \[isShortcutsOpen, setIsShortcutsOpen\].*?\]\);\n/s,
  ""
);

// 4. Replace pushHistory and handleUndo, handleRedo logic
content = content.replace(
  /const preRecordStateRef = useRef<TimelineState \| null>\(null\);\n\n  const pushHistory = useCallback\(\(next: TimelineState\).*?}, \[historyIndex, keyframeHistory\]\);\n/s,
  `const preRecordStateRef = useRef<TimelineState | null>(null);

  const { pushHistory, undo: handleUndo, redo: handleRedo, history: keyframeHistory, index: historyIndex } = useTimelineHistory(getTimelineState, (entry: TimelineState) => {
    setCameraKeyframes(entry.cameraKeyframes ?? []);
    setPhysicsKeyframes(entry.physicsKeyframes ?? EMPTY_PHYSICS_KFS);
    setSceneMarkers(entry.sceneMarkers ?? []);
  });\n`
);

// 5. Replace WorkspaceIO (save, load)
content = content.replace(
  /const handleSave = useCallback\(\(\) => \{.+?input\.click\(\);\n  \}, \[\]\);\n/s,
  `const { handleSave, handleLoad } = useWorkspaceIO(
    useCallback(() => ({ inputText, parseMode, gradientSettings, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers }), [inputText, parseMode, gradientSettings, styleSettings, physicsParams, viewMode, cameraKeyframes, physicsKeyframes, sceneMarkers]),
    useCallback((s) => {
      if (s.inputText) setInputText(s.inputText);
      if (s.parseMode) setParseMode(s.parseMode);
      if (s.gradientSettings) setGradientSettings(s.gradientSettings);
      if (s.styleSettings) setStyleSettings(s.styleSettings);
      if (s.physicsParams) setPhysicsParams(prev => ({ ...prev, ...s.physicsParams, verticalOrder: s.physicsParams.verticalOrder ?? 0, pulse: s.physicsParams.pulse ?? 0 }));
      if (s.viewMode) setViewMode(s.viewMode);
      if (s.cameraKeyframes) setCameraKeyframes(s.cameraKeyframes);
      if (s.physicsKeyframes) setPhysicsKeyframes(s.physicsKeyframes);
      if (s.sceneMarkers) setSceneMarkers(s.sceneMarkers);
    }, [])
  );\n`
);

// 6. Replace shortcuts listener block
content = content.replace(
  /useEffect\(\(\) => \{\n    const handler = \(e: KeyboardEvent\) => \{.*?window\.removeEventListener\('keydown', handler\);\n  \}, \[handleSave, handleLoad, handleUndo, handleRedo, shortcuts\]\);\n/s,
  `const { isShortcutsOpen, setIsShortcutsOpen, shortcuts, addShortcut, removeShortcut } = useShortcuts(useMemo(() => ({
    onSave: handleSave,
    onLoad: handleLoad,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onTogglePlay: () => setIsPlaying(p => !p),
    onToggleRecord: () => setIsRecording(p => !p),
    onToggleSidebar: () => setIsSidebarOpen(p => !p),
  }), [handleSave, handleLoad, handleUndo, handleRedo]));\n`
);

// 7. Replace shortcuts usage in ShortcutsDialog prop
content = content.replace(
  /onAddShortcut=\{\(command, key\) => setShortcuts\(prev => \[\.\.\.prev, \{ id: Date\.now\(\)\.toString\(\), command, key \}\]\)\}/s,
  `onAddShortcut={addShortcut}`
);
content = content.replace(
  /onRemoveShortcut=\{\(id\) => setShortcuts\(prev => prev\.filter\(s => s\.id !== id\)\)\}/s,
  `onRemoveShortcut={removeShortcut}`
);

fs.writeFileSync('src/app/App.tsx', content, 'utf8');
