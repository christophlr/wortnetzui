const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

const scratchDecls = `\n
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _scratchColor = new THREE.Color();
const _scratchVec1 = new THREE.Vector3();
const _scratchVec2 = new THREE.Vector3();
`;

code = code.replace(/import type \{ PhysicsKeyframe \} from '\.\/timeline\/types';/, `import type { PhysicsKeyframe } from './timeline/types';\n${scratchDecls}`);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
