const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

code = code.replace(
  /if \(delta < 5 && physicsEnabledRef\.current && !workerBusyRef\.current\) \{/,
  `if (delta < 5 && physicsEnabledRef.current && !workerBusyRef.current && (performance.now() - lastStepNowRef.current > 33)) {`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
