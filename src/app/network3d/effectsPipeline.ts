import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface EffectsPipeline {
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

/**
 * Configure and build the Three.js postprocessing pipeline.
 */
export function setupEffectsPipeline(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  width: number,
  height: number
): EffectsPipeline {
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Resolution, strength, radius, threshold
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.4, // strength
    0.4, // radius
    0.0  // threshold
  );
  bloomPass.enabled = false;
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  const resize = (w: number, h: number) => {
    composer.setSize(w, h);
    bloomPass.setSize(w, h);
  };

  const dispose = () => {
    composer.dispose();
    renderPass.dispose();
    bloomPass.dispose();
    outputPass.dispose();
  };

  return {
    composer,
    bloomPass,
    resize,
    dispose,
  };
}
