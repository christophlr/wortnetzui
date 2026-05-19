const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

code = code.replace(
  /const n2 = arr\.length;\n        for \(let pass = 0; pass < 4; pass\+\+\) \{/,
  `const n2 = arr.length;
        const maxPasses = n2 > 300 ? 1 : (n2 > 150 ? 2 : 4);
        for (let pass = 0; pass < maxPasses; pass++) {`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
