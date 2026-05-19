const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

// Declare scratches outside component
const scratchDecls = `
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _scratchColor = new THREE.Color();
const _scratchVec1 = new THREE.Vector3();
const _scratchVec2 = new THREE.Vector3();
`;

code = code.replace(/import \{ WordNode, GraphEdge, GraphNode \} from '\.\.\/graph\/types';/, `import { WordNode, GraphEdge, GraphNode } from '../graph/types';\n${scratchDecls}`);

// Fix P4-11, 12, P4-21
code = code.replace(
  /const uDistMap = \{\n      origin: new THREE\.Color\(vs\.gradientOrigin\),\n      periphery: new THREE\.Color\(vs\.gradientPeriphery\)\n    \};/,
  `_colorA.set(vs.gradientOrigin);
    _colorB.set(vs.gradientPeriphery);`
);

code = code.replace(
  /const maxDist = Math\.sqrt\(maxDistSq\) \|\| 1;/g,
  `const invMaxDistSq = 1 / (maxDistSq || 1);`
);

// Replace dist/normDist inside the loop
code = code.replace(
  /const dist = Math\.sqrt\(node\.x \* node\.x \+ node\.y \* node\.y \+ node\.z \* node\.z\);\n        const normDist = dist \/ maxDist;/g,
  `const distSq = node.x * node.x + node.y * node.y + node.z * node.z;
        const normDistSq = distSq * invMaxDistSq;`
);

code = code.replace(/normDist \* normDist \* normDist/g, 'normDistSq * normDistSq * Math.sqrt(normDistSq)');
code = code.replace(/normDist/g, 'normDistSq');

// Fix P4-12
code = code.replace(
  /const nodeColor = new THREE\.Color\(\)\.lerpColors\(uDistMap\.origin, uDistMap\.periphery, normDistSq\);/,
  `const nodeColor = _scratchColor.lerpColors(_colorA, _colorB, normDistSq);`
);

// Fix P4-13
code = code.replace(
  /const spritePos = node\.textSprite\.position\.clone\(\)\.project\(cameraRef\.current!\);\n          const mouseDist = spritePos\.distanceTo\(new THREE\.Vector3\(mousePosRef\.current\.x, mousePosRef\.current\.y, spritePos\.z\)\);/,
  `_scratchVec1.copy(node.textSprite.position).project(cameraRef.current!);
          _scratchVec2.set(mousePosRef.current.x, mousePosRef.current.y, _scratchVec1.z);
          const mouseDist = _scratchVec1.distanceTo(_scratchVec2);`
);

// Fix P4-14 (Network3D.tsx:1453... wait line numbers changed)
code = code.replace(
  /const lastApplied = effectivePhysicsRef\.current;\n\n        const now = performance\.now\(\);\n        const dtMs = now - lastTime/,
  `const lastApplied = effectivePhysicsRef.current; // already a direct reference, no spread needed since it's just read
\n        const now = performance.now();\n        const dtMs = now - lastTime`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
