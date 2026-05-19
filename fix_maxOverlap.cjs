const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

// Revert the bad replacement
code = code.replace(
  /prevMaxOverlapRef\.current = maxOverlap;\n\n      syncGraphVisuals\(graphNodesRef\.current, graphEdgesRef\.current, undefined, visualSettings, styleSettings\);/,
  `syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, undefined, visualSettings, styleSettings);`
);

// Apply correctly to the worker block
code = code.replace(
  /\n      syncGraphVisuals\(graphNodesRef\.current, graphEdgesRef\.current, arr\);/,
  `\n      prevMaxOverlapRef.current = maxOverlap;

      const hasActiveModulationLoc = (isPlayingRef.current && hasAnyKfsRef.current) || hasAnyModulatorRef.current;
      if (avgMovement > 0.05 || maxOverlap > 0 || hasActiveModulationLoc) {
        syncGraphVisuals(graphNodesRef.current, graphEdgesRef.current, arr);
      }`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
