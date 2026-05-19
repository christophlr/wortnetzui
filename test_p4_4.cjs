const fs = require('fs');
let code = fs.readFileSync('src/app/context/WortnetzContext.tsx', 'utf8');

const useMemoRegex = /const effectivePhysicsParams = useMemo\(\(\) => \{[\s\S]*?\}, \[physicsParams, physicsKeyframes, playheadPosition\]\);/;

const replacement = `const [effectivePhysicsParams, setEffectivePhysicsParams] = useState(physicsParams);
  useEffect(() => { setEffectivePhysicsParams(physicsParams); }, [physicsParams]);

  useEffect(() => {
    const updateEpp = () => {
      if (network3DRef.current) {
        setEffectivePhysicsParams(network3DRef.current.getEffectivePhysicsParams());
      }
    };
    // Initial sync
    updateEpp();
    const interval = setInterval(updateEpp, 66); // ~15 Hz
    return () => clearInterval(interval);
  }, [playheadPosition, isPlaying]); // include isPlaying to re-sync if changed`;

if (useMemoRegex.test(code)) {
  code = code.replace(useMemoRegex, replacement);
  fs.writeFileSync('src/app/context/WortnetzContext.tsx', code);
  console.log('p4-4 applied');
} else {
  console.log('regex mismatch');
}
