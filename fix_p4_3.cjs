const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

// 1. Add refs and update hooks
code = code.replace(
  /const trackMetaRef = useRef<Record<string, TrackMeta>>\(trackMeta \?\? \{\}\);\n  useEffect\(\(\) => \{ trackMetaRef\.current = trackMeta \?\? \{\}; \}, \[trackMeta\]\);/,
  `const trackMetaRef = useRef<Record<string, TrackMeta>>(trackMeta ?? {});
  const hasAnyModulatorRef = useRef(false);
  useEffect(() => { 
    trackMetaRef.current = trackMeta ?? {}; 
    hasAnyModulatorRef.current = Object.values(trackMeta ?? {}).some(m => m.modulator != null && m.modulator.depth !== 0 || m.glide > 0);
  }, [trackMeta]);`
);
code = code.replace(
  /const physicsKeyframesRef = useRef\(physicsKeyframes \?\? \{\}\);/,
  `const physicsKeyframesRef = useRef(physicsKeyframes ?? {});
  const hasAnyKfsRef = useRef(false);`
);
code = code.replace(
  /const sorted: Record<string, Keyframe\[\]> = \{\};\n    for \(const \[trackId, kfs\] of Object\.entries\(physicsKeyframes \|\| \{\}\)\) \{\n      sorted\[trackId\] = \[\.\.\.kfs\]\.sort\(\(a, b\) => a\.time - b\.time\);\n    \}\n    physicsKeyframesRef\.current = sorted;/,
  `const sorted: Record<string, Keyframe[]> = {};
    let anyKfs = false;
    for (const [trackId, kfs] of Object.entries(physicsKeyframes || {})) {
      sorted[trackId] = [...kfs].sort((a, b) => a.time - b.time);
      if (kfs.length > 0) anyKfs = true;
    }
    physicsKeyframesRef.current = sorted;
    hasAnyKfsRef.current = anyKfs;`
);

// 2. Fix 1442-1443
code = code.replace(
  /const hasKfs = isPlayingRef.current && Object.values\(physicsKeyframesRef\.current\).some\(kfs => kfs.length > 0\);\n        const hasModulator = Object.values\(trackMetaRef\.current\).some\(m => m.modulator != null && m.modulator.depth !== 0\);\n        if \(hasKfs \|\| hasModulator\)/,
  `const hasKfs = isPlayingRef.current && hasAnyKfsRef.current;
        const hasModulator = hasAnyModulatorRef.current;
        if (hasKfs || hasModulator)`
);

// 3. Fix auto-stop heuristic (P4-3)
code = code.replace(
  /if \(curParams\.turbulence > 0 \|\| maxOverlap > 1\) \{/,
  `const hasActiveModulation = (isPlayingRef.current && hasAnyKfsRef.current) || hasAnyModulatorRef.current;
      if (curParams.turbulence > 0 || maxOverlap > 1 || hasActiveModulation) {`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
