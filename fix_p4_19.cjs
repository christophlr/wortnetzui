const fs = require('fs');
let code = fs.readFileSync('src/app/graph/physics.worker.ts', 'utf8');

const headSize = 8192;
const mask = headSize - 1;

const newHash = `
let gridHead = new Int32Array(${headSize}).fill(-1);
let gridNext = new Int32Array(4000);

export function runStep(
`;

code = code.replace(/export function runStep\(/, newHash);

const gridBuild = `
    const CELL_SIZE = 150;
    if (n > gridNext.length) gridNext = new Int32Array(n * 2);
    gridHead.fill(-1);

    for (let i = 0; i < n; i++) {
      const b = i * 6;
      const cx = Math.floor(posVel[b] / CELL_SIZE);
      const cy = Math.floor(posVel[b + 1] / CELL_SIZE);
      const cz = Math.floor(posVel[b + 2] / CELL_SIZE);
      const key = (Math.imul(cx, 73856093) ^ Math.imul(cy, 19349663) ^ Math.imul(cz, 83492791)) & ${mask};
      gridNext[i] = gridHead[key];
      gridHead[key] = i;
    }`;

code = code.replace(
  /const CELL_SIZE = 150;\n    const grid = new Map<string, number\[\]>\(\);\n\n    for \(let i = 0; i < n; i\+\+\) \{\n      const b = i \* 6;\n      const cx = Math\.floor\(posVel\[b\] \/ CELL_SIZE\);\n      const cy = Math\.floor\(posVel\[b \+ 1\] \/ CELL_SIZE\);\n      const cz = Math\.floor\(posVel\[b \+ 2\] \/ CELL_SIZE\);\n      const key = `\$\{cx\},\$\{cy\},\$\{cz\}`;\n      let cell = grid\.get\(key\);\n      if \(!cell\) \{ cell = \[\]; grid\.set\(key, cell\); \}\n      cell\.push\(i\);\n    \}/,
  gridBuild
);

const lookupCode = `
            const key = (Math.imul(cx + ox, 73856093) ^ Math.imul(cy + oy, 19349663) ^ Math.imul(cz + oz, 83492791)) & ${mask};
            let j = gridHead[key];
            while (j !== -1) {
              if (i !== j) {
                const bj = j * 6;
                const dx = x - posVel[bj];
                const dy = y - posVel[bj + 1];
                const dz = z - posVel[bj + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq > 0.01 && distSq < MAX_DIST_SQ) {
                  const dist = Math.sqrt(distSq);
                  const force = (repulsion * repulsion) / distSq;
                  fx += dx * force / dist;
                  fy += dy * force / dist;
                  fz += dz * force / dist;
                }
              }
              j = gridNext[j];
            }`;

code = code.replace(
  /const key = `\$\{cx \+ ox\},\$\{cy \+ oy\},\$\{cz \+ oz\}`;\n            const cell = grid\.get\(key\);\n            if \(!cell\) continue;\n            for \(const j of cell\) \{\n              if \(i === j\) continue;\n              const bj = j \* 6;\n              const dx = x - posVel\[bj\];\n              const dy = y - posVel\[bj \+ 1\];\n              const dz = z - posVel\[bj \+ 2\];\n              const distSq = dx \* dx \+ dy \* dy \+ dz \* dz;\n\n              if \(distSq > 0\.01 && distSq < MAX_DIST_SQ\) \{\n                const dist = Math\.sqrt\(distSq\);\n                const force = \(repulsion \* repulsion\) \/ distSq;\n                fx \+= dx \* force \/ dist;\n                fy \+= dy \* force \/ dist;\n                fz \+= dz \* force \/ dist;\n              \}\n            \}/,
  lookupCode
);

fs.writeFileSync('src/app/graph/physics.worker.ts', code);
