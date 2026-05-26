import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface EffectsPipeline {
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  vignettePass: ShaderPass;
  chromaPass: ShaderPass;
  grainPass: ShaderPass;
  pixelatePass: ShaderPass;
  updatePasses: (
    effectsList: string[],
    settings: {
      bloom: boolean;
      vignette: boolean;
      chroma: boolean;
      grain: boolean;
      pixelate: boolean;
    }
  ) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

// Custom Vignette Shader
const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    darkness: { value: 0.0 },
    offset: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = length(uv);
      float vignette = smoothstep(offset, offset - darkness, dist);
      gl_FragColor = vec4(texel.rgb * vignette, texel.a);
    }
  `
};

// Custom Chromatic Aberration Shader
const ChromaShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 0.0 },
    mode: { value: 0 }, // 0 = radial, 1 = horizontal
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform int mode;
    varying vec2 vUv;
    void main() {
      if (offset == 0.0) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }
      vec2 rUv = vUv;
      vec2 gUv = vUv;
      vec2 bUv = vUv;
      if (mode == 0) {
        vec2 dir = vUv - 0.5;
        rUv = vUv + dir * offset;
        bUv = vUv - dir * offset;
      } else {
        rUv = vUv + vec2(offset, 0.0);
        bUv = vUv - vec2(offset, 0.0);
      }
      float r = texture2D(tDiffuse, rUv).r;
      float g = texture2D(tDiffuse, gUv).g;
      float b = texture2D(tDiffuse, bUv).b;
      float a = texture2D(tDiffuse, gUv).a;
      gl_FragColor = vec4(r, g, b, a);
    }
  `
};

// Custom Film Grain Shader
const GrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    intensity: { value: 0.0 },
    speed: { value: 1.0 },
    time: { value: 0.0 },
    colored: { value: false },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float intensity;
    uniform float speed;
    uniform float time;
    uniform bool colored;
    varying vec2 vUv;
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      if (intensity == 0.0) {
        gl_FragColor = texel;
        return;
      }
      float grainSeed = time * speed;
      float noiseX = rand(vUv + vec2(grainSeed, 0.0));
      float noiseY = rand(vUv + vec2(0.0, grainSeed));
      float noiseZ = rand(vUv + vec2(grainSeed, grainSeed));
      if (colored) {
        vec3 noise = vec3(noiseX, noiseY, noiseZ) - 0.5;
        gl_FragColor = vec4(texel.rgb + noise * intensity, texel.a);
      } else {
        float noise = noiseX - 0.5;
        gl_FragColor = vec4(texel.rgb + vec3(noise) * intensity, texel.a);
      }
    }
  `
};

// Custom Pixelate Shader
const PixelateShader = {
  uniforms: {
    tDiffuse: { value: null },
    pixelSize: { value: 1.0 },
    resolution: { value: new THREE.Vector2(1000, 800) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float pixelSize;
    uniform vec2 resolution;
    varying vec2 vUv;
    void main() {
      if (pixelSize <= 1.0) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }
      vec2 dxy = pixelSize / resolution;
      vec2 coord = dxy * floor(vUv / dxy) + dxy * 0.5;
      gl_FragColor = texture2D(tDiffuse, coord);
    }
  `
};

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

  // Initialize Bloom
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.4, // strength
    0.4, // radius
    0.0  // threshold
  );
  bloomPass.enabled = false;

  // Initialize Vignette, Chromatic Aberration, Film Grain, and Pixelation passes
  const vignettePass = new ShaderPass(VignetteShader);
  const chromaPass = new ShaderPass(ChromaShader);
  const grainPass = new ShaderPass(GrainShader);
  const pixelatePass = new ShaderPass(PixelateShader);

  // Set default resolution for pixelate pass
  pixelatePass.uniforms.resolution.value.set(width, height);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  const updatePasses = (
    effectsList: string[],
    settings: {
      bloom: boolean;
      vignette: boolean;
      chroma: boolean;
      grain: boolean;
      pixelate: boolean;
    }
  ) => {
    // Rebuild composer passes array
    composer.passes = [];
    composer.addPass(renderPass);

    for (const effect of effectsList) {
      if (effect === 'bloom' && settings.bloom) {
        composer.addPass(bloomPass);
      } else if (effect === 'vignette' && settings.vignette) {
        composer.addPass(vignettePass);
      } else if (effect === 'chromatic-aberration' && settings.chroma) {
        composer.addPass(chromaPass);
      } else if (effect === 'film-grain' && settings.grain) {
        composer.addPass(grainPass);
      } else if (effect === 'pixelate' && settings.pixelate) {
        composer.addPass(pixelatePass);
      }
    }

    composer.addPass(outputPass);
  };

  const resize = (w: number, h: number) => {
    composer.setSize(w, h);
    bloomPass.setSize(w, h);
    pixelatePass.uniforms.resolution.value.set(w, h);
  };

  const dispose = () => {
    composer.dispose();
    renderPass.dispose();
    bloomPass.dispose();
    vignettePass.dispose();
    chromaPass.dispose();
    grainPass.dispose();
    pixelatePass.dispose();
    outputPass.dispose();
  };

  return {
    composer,
    bloomPass,
    vignettePass,
    chromaPass,
    grainPass,
    pixelatePass,
    updatePasses,
    resize,
    dispose,
  };
}
