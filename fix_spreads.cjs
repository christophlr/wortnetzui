const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

code = code.replace(
  /lastParamsValuesRef\.current = \{ \.\.\.lastApplied \};/,
  `Object.assign(lastParamsValuesRef.current, lastApplied);`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
