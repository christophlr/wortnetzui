import { useCallback, useRef, type RefObject, type MutableRefObject } from 'react';
import * as THREE from 'three';

export interface CameraFlyState {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  startTime: number;
  duration: number;
}

export interface UseCameraFlyTo {
  /** Set non-null to start an eased fly-to animation; auto-clears at t >= 1. */
  cameraFlyRef: MutableRefObject<CameraFlyState | null>;
  /** Set non-null to smoothly lerp the controls target toward this world point; auto-clears on arrival. */
  flyToTargetRef: MutableRefObject<THREE.Vector3 | null>;
  /** Call once per animation frame to advance both motions. */
  tick: () => void;
}

export function useCameraFlyTo(opts: {
  cameraRef: RefObject<THREE.Camera | null>;
  controlsRef: RefObject<{ target: THREE.Vector3 } | null>;
}): UseCameraFlyTo {
  const cameraFlyRef = useRef<CameraFlyState | null>(null);
  const flyToTargetRef = useRef<THREE.Vector3 | null>(null);

  const tick = useCallback(() => {
    const camera = opts.cameraRef.current;
    const controls = opts.controlsRef.current;
    if (!camera) return;

    if (cameraFlyRef.current) {
      const { fromPos, toPos, fromTarget, toTarget, startTime, duration } = cameraFlyRef.current;
      const t = Math.min(1, (performance.now() - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(fromPos, toPos, eased);
      if (controls) controls.target.lerpVectors(fromTarget, toTarget, eased);
      if (t >= 1) cameraFlyRef.current = null;
    }

    if (flyToTargetRef.current && controls) {
      controls.target.lerp(flyToTargetRef.current, 0.08);
      if (controls.target.distanceTo(flyToTargetRef.current) < 0.5) {
        controls.target.copy(flyToTargetRef.current);
        flyToTargetRef.current = null;
      }
    }
  }, [opts.cameraRef, opts.controlsRef]);

  return { cameraFlyRef, flyToTargetRef, tick };
}
