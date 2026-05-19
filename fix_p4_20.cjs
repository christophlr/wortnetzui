const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

if (!code.includes('const prevMaxOverlapRef = useRef(0);')) {
  code = code.replace(
    /const workerBusyRef = useRef\(false\);/,
    `const workerBusyRef = useRef(false);\n  const prevMaxOverlapRef = useRef(0);`
  );
}

code = code.replace(
  /let maxOverlap = 0;\n      if \(is2D\) \{/,
  `let maxOverlap = 0;
      if (is2D && (avgMovement > 0.5 || prevMaxOverlapRef.current > 0)) {`
);

code = code.replace(
  /\n      syncGraphVisuals/,
  `\n      prevMaxOverlapRef.current = maxOverlap;\n\n      syncGraphVisuals`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
