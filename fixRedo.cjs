const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');
content = content.replace(
  /const handleRedo[\s\S]*?\}, \[historyIndex, keyframeHistory\]\);\n/,
  ''
);
// And also check if setHistoryIndex is left anywhere
content = content.replace(/setHistoryIndex\(.*?\);\n/g, '');
fs.writeFileSync('src/app/App.tsx', content, 'utf8');
