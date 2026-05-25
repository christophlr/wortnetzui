import { useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import type { GraphNode, PhysicsParams } from '../graph';
import {
  packStepBuffer,
  unpackStepBuffer,
  unpackSettleBuffer,
  applyOverlapSeparation,
} from '../network3d/workerGlue';

interface WorkerMessageData {
  type: string;
  posVel?: Float64Array;
  avgMovement?: number;
  progress?: number;
  applied?: PhysicsParams;
}

export interface PhysicsWorkerSyncOpts {
  // Buffer + node array (hot path refs)
  graphNodeArrayRef: RefObject<GraphNode[]>;
  workerPosVelRef: MutableRefObject<Float64Array>;
  // Authoritative worker-applied params
  effectivePhysicsRef: MutableRefObject<PhysicsParams>;
  // Sidebar baseline params + playhead
  physicsParamsRef: RefObject<PhysicsParams>;
  playheadRef: RefObject<number>;
  // Wake / activity flags
  isPlayingRef: RefObject<boolean>;
  hasAnyKfsRef: RefObject<boolean>;
  hasAnyModulatorRef: RefObject<boolean>;
  // Step bookkeeping
  prevMaxOverlapRef: MutableRefObject<number>;
  stillFramesRef: MutableRefObject<number>;
  physicsEnabledRef: MutableRefObject<boolean>;
  workerBusyRef: MutableRefObject<boolean>;
  // Jolt velocity tracking
  physicsVelocityRef: MutableRefObject<number>;
  lastStepNowRef: MutableRefObject<number>;
  lastParamsTimeRef: MutableRefObject<number>;
  lastParamsValuesRef: MutableRefObject<PhysicsParams>;
  // Callbacks (fresh each render via the bag)
  onSettled: (posVel: Float64Array) => void;
  onProgress?: (progress: number) => void;
  sync: (arr: GraphNode[]) => void;
}

export interface PhysicsWorkerSync {
  /** Bind as worker.onmessage. Routes settle_progress/settled/step. */
  handleMessage: (e: MessageEvent<WorkerMessageData>, is2D: boolean) => void;
  /** Call once per RAF frame. No-ops if disabled, busy, or frame gap too large. */
  dispatchStep: (worker: Worker, is2D: boolean, delta: number) => void;
}

/**
 * Owns the main-thread side of the physics-worker contract: routing the
 * worker's progress / settled / step responses, and dispatching outgoing
 * step messages with jolt-velocity-driven damping overrides.
 *
 * Worker creation, init/settle posting, and termination stay in the
 * caller (they are tied to the scene setup lifecycle). All refs/callbacks
 * are read through a ref bag so the returned functions keep stable
 * identity across renders.
 */
export function usePhysicsWorkerSync(opts: PhysicsWorkerSyncOpts): PhysicsWorkerSync {
  const bagRef = useRef(opts);
  useEffect(() => { bagRef.current = opts; });

  const handleMessage = useCallback((e: MessageEvent<WorkerMessageData>, is2D: boolean) => {
    const bag = bagRef.current;

    if (e.data.type === 'settle_progress') {
      if (e.data.progress !== undefined) bag.onProgress?.(e.data.progress);
      return;
    }

    if (e.data.type === 'settled') {
      const { posVel } = e.data;
      if (!posVel) return;
      const arr = bag.graphNodeArrayRef.current!;
      unpackSettleBuffer(posVel, arr);
      bag.workerPosVelRef.current = posVel;
      // Apply visualSettings (gradient, radial bias, opacity) before fit/ready
      // so the first painted frame matches the sidebar state — without this,
      // 3D loads with default white sprites until any sidebar tweak triggers sync.
      bag.sync(arr);
      bag.onSettled(posVel);
      return;
    }

    // ── STEP response ──
    const { posVel, avgMovement, applied } = e.data;
    if (!posVel || avgMovement === undefined) return;
    if (applied) {
      // Worker is authoritative for `applied`; surface it back so the main
      // thread can drive jolt velocity, recording, and external consumers.
      bag.effectivePhysicsRef.current = applied;
    }
    const arr = bag.graphNodeArrayRef.current!;
    unpackStepBuffer(posVel, arr);
    bag.workerPosVelRef.current = posVel;

    const maxOverlap = (is2D && (avgMovement > 0.5 || bag.prevMaxOverlapRef.current > 0))
      ? applyOverlapSeparation(arr)
      : 0;
    bag.prevMaxOverlapRef.current = maxOverlap;

    const hasActiveModulation = (!!bag.isPlayingRef.current && !!bag.hasAnyKfsRef.current) || !!bag.hasAnyModulatorRef.current;
    if (avgMovement > 0.05 || maxOverlap > 0 || hasActiveModulation) {
      bag.sync(arr);
    }

    // Auto-stop heuristic
    const curParams = bag.effectivePhysicsRef.current;
    if (curParams.turbulence > 0 || maxOverlap > 1 || hasActiveModulation) {
      bag.stillFramesRef.current = 0;
    } else if (avgMovement < 0.5) {
      bag.stillFramesRef.current++;
      if (bag.stillFramesRef.current > 60) bag.physicsEnabledRef.current = false;
    } else {
      bag.stillFramesRef.current = 0;
    }

    bag.workerBusyRef.current = false;
  }, []);

  const dispatchStep = useCallback((worker: Worker, is2D: boolean, delta: number) => {
    const bag = bagRef.current;
    if (delta >= 5) return;
    if (!bag.physicsEnabledRef.current) return;
    if (bag.workerBusyRef.current) return;

    // The worker is authoritative for keyframe/glide/LFO evaluation.
    // Main thread tracks parameter-change velocity from the previous frame's
    // `applied` to drive the jolt overrides — layered on top of `applied`
    // via `paramOverrides` so the worker stays a pure evaluator.
    const lastApplied = bag.effectivePhysicsRef.current;
    const now = performance.now();
    const dtMs = Math.max(1, now - bag.lastParamsTimeRef.current);
    const prev = bag.lastParamsValuesRef.current;

    const dRep = Math.abs(lastApplied.repulsion - prev.repulsion) / 1000;
    const dSpr = Math.abs(lastApplied.springK - prev.springK) * 20;
    const dDmp = Math.abs(lastApplied.damping - prev.damping) * 20;
    const dSpd = Math.abs(lastApplied.minSpeed - prev.minSpeed);
    const dLnk = Math.abs(lastApplied.linkDistance - prev.linkDistance) / 100;
    const dGrv = Math.abs(lastApplied.gravity - prev.gravity) / 5;
    const dTrb = Math.abs((lastApplied.turbulence ?? 0) - (prev.turbulence ?? 0)) / 5;
    const dVto = Math.abs((lastApplied.verticalOrder ?? 0) - (prev.verticalOrder ?? 0)) / 2;
    const velocity = (dRep + dSpr + dDmp + dSpd + dLnk + dGrv + dTrb + dVto) / dtMs;

    if (!bag.isPlayingRef.current) {
      bag.physicsVelocityRef.current = Math.min(1.0, (bag.physicsVelocityRef.current || 0) + velocity * 150);
    } else {
      bag.physicsVelocityRef.current = (bag.physicsVelocityRef.current || 0) * 0.8;
    }

    bag.lastParamsTimeRef.current = now;
    Object.assign(bag.lastParamsValuesRef.current, lastApplied);

    const paramOverrides: Partial<PhysicsParams> = {};
    if ((bag.physicsVelocityRef.current || 0) > 0.01) {
      const jolt = bag.physicsVelocityRef.current || 0;
      const targetDamping = Math.max(lastApplied.damping, 0.92);
      paramOverrides.damping = lastApplied.damping + (targetDamping - lastApplied.damping) * Math.min(1, jolt * 1.5);
      bag.physicsVelocityRef.current = (bag.physicsVelocityRef.current || 0) * 0.80;
    }

    const dtSeconds = Math.min(0.1, Math.max(0.001, (now - bag.lastStepNowRef.current) / 1000));
    bag.lastStepNowRef.current = now;

    const pv = bag.workerPosVelRef.current;
    packStepBuffer(pv, bag.graphNodeArrayRef.current!);
    bag.workerBusyRef.current = true;
    worker.postMessage(
      {
        type: 'step',
        posVel: pv,
        time: bag.playheadRef.current,
        dt: dtSeconds,
        sliderParams: bag.physicsParamsRef.current,
        paramOverrides: Object.keys(paramOverrides).length > 0 ? paramOverrides : undefined,
        is2D,
      },
      [pv.buffer],
    );
  }, []);

  return { handleMessage, dispatchStep };
}
