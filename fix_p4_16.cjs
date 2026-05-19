const fs = require('fs');
let code = fs.readFileSync('src/app/animation/evaluateTracks.ts', 'utf8');

const keysDecl = "const PARAM_KEYS = ['repulsion', 'springK', 'damping', 'minSpeed', 'linkDistance', 'gravity', 'turbulence', 'verticalOrder'];\n\nexport function evaluateTracks";

code = code.replace(/export function evaluateTracks/, keysDecl);
code = code.replace(/for \(const key of Object\.keys\(sliderParams\)\) \{/, 'for (const key of PARAM_KEYS) {');

fs.writeFileSync('src/app/animation/evaluateTracks.ts', code);
