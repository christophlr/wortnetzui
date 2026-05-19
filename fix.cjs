const fs = require('fs');
let code = fs.readFileSync('src/app/components/Network3D.tsx', 'utf8');

// Fix animate
code = code.replace(
  /let lastTime = Date\.now\(\);\n    const animate = \(\) => {\n      animationFrameRef\.current = requestAnimationFrame\(animate\);/g,
  `let lastTime = performance.now();
    const animate = () => {
      if (isCancelled) return;
      animationFrameRef.current = requestAnimationFrame(animate);`
);

// Fix P4-18 Date.now -> performance.now in animate
code = code.replace(
  /const now = Date\.now\(\);/g,
  `const now = performance.now();`
);

// Fix animFrame teardown
code = code.replace(
  /if \(animFrame !== undefined\) cancelAnimationFrame\(animFrame\);/g,
  `if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }`
);
code = code.replace(/let animFrame: number \| undefined;\n/g, '');

// Fix Traverse and add texture cleanup
code = code.replace(
  /scene\.traverse\(\(object\) => \{\s+if \(\(object as THREE\.Mesh\)\.isMesh \|\| \(\(object as THREE\.Sprite\)\.isSprite\) \{\s+const mesh = object as THREE\.Mesh \| THREE\.Sprite;\s+mesh\.geometry\.dispose\(\);\s+if \(Array\.isArray\(mesh\.material\)\) \{\s+mesh\.material\.forEach\(m => m\.dispose\(\)\);\s+\} else \{\s+mesh\.material\.dispose\(\);\s+\}\s+\}\s+\}\);/g,
  `scene.traverse((object: any) => {
        if (object.isMesh || object.isSprite || object.isLineSegments || object.isLine) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m: any) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      textureCacheRef.current.forEach(cache => {
        cache.normal.dispose();
        if (cache.highlighted) cache.highlighted.dispose();
        if (cache.selected) cache.selected.dispose();
      });
      textureCacheRef.current.clear();`
);

fs.writeFileSync('src/app/components/Network3D.tsx', code);
