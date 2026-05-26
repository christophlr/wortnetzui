import { useCallback, useEffect, useRef, type RefObject, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GraphNode, ToolId } from '../components/Toolbar';
import type { PaintedOverride } from '../context/WortnetzContextTypes';

export interface ToolHandlersOpts {
  activeTool: ToolId;
  cameraRef: RefObject<THREE.Camera | null>;
  spritesArrayRef: RefObject<THREE.Object3D[]>;
  graphNodesRef: RefObject<Map<string, GraphNode>>;
  graphNodeArrayRef: RefObject<GraphNode[]>;
  hoveredNodeRef: RefObject<GraphNode | null>;
  selectedNodeRef: RefObject<GraphNode | null>;
  controlsRef: RefObject<OrbitControls | null>;
  cameraFlyRef: RefObject<{
    fromPos: THREE.Vector3; toPos: THREE.Vector3;
    fromTarget: THREE.Vector3; toTarget: THREE.Vector3;
    startTime: number; duration: number;
  } | null>;
  flyToTargetRef: RefObject<THREE.Vector3 | null>;
  onNodeSelectRef: RefObject<((node: GraphNode | null) => void) | undefined>;
  viewMode: '2D' | '3D';
  swap: (node: GraphNode, highlighted: boolean, selected: boolean) => void;
  sync: (arr: GraphNode[]) => void;

  // Paint brush settings
  brushRadius: number;
  paintColor: string;
  paintScale: number;
  paintOpacity: number;
  paintBlend: number;
  paintMode: 'color' | 'scale' | 'opacity' | 'erase';
  setPaintedOverrides: React.Dispatch<React.SetStateAction<Record<string, PaintedOverride>>>;
  onStrokeStart?: () => void;
  onStrokeEnd?: () => void;

  // Glitch jolt controls
  physicsVelocityRef: MutableRefObject<number>;
  stillFramesRef: MutableRefObject<number>;
  physicsEnabledRef: MutableRefObject<boolean>;
  workerPosVelRef: MutableRefObject<Float64Array>;
  is2D: boolean;

  // Callback to display the SVG brush circle
  setMouseCoords: (coords: { x: number; y: number } | null) => void;
}

// Module-scoped structures to avoid allocations inside high-frequency frames and clicks
const SHARED_PLANE = new THREE.Plane();
const SHARED_CLICK_POINT = new THREE.Vector3();
const SHARED_CAM_DIR = new THREE.Vector3();
const SHARED_COM = new THREE.Vector3();
const SHARED_NODE_POS = new THREE.Vector3();
const SHARED_DIR = new THREE.Vector3();
const SCRATCH_ERASE_LABELS: string[] = [];

/**
 * Custom hook that handles mouse event routing on the WebGL canvas DOM element
 * based on the active tool.
 */
export function useToolHandlers(opts: ToolHandlersOpts): (domElement: HTMLElement) => () => void {
  const bagRef = useRef(opts);
  useEffect(() => {
    bagRef.current = opts;
  }, [opts]);

  // Handle reconfiguring OrbitControls mouse buttons based on active tool
  useEffect(() => {
    const controls = opts.controlsRef.current;
    if (!controls) return;

    if (opts.activeTool === 'pan') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      controls.enableRotate = false;
      controls.enabled = true;
    } else if (opts.activeTool === 'zoom') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.DOLLY,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      controls.touches = {
        ONE: THREE.TOUCH.DOLLY_PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      controls.enableRotate = false;
      controls.enabled = true;
    } else if (opts.activeTool === 'paint') {
      // Disable orbit controls while painting so dragging paints instead of orbiting
      controls.enabled = false;
    } else {
      // Default: pointer / glitch / path
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      controls.enableRotate = !opts.is2D;
      controls.enabled = true;
    }
    controls.update();
  }, [opts.activeTool, opts.is2D]);

  return useCallback((domElement: HTMLElement) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isMouseDown = false;
    let lastRaycastTime = 0;

    const getRaycastHit = (e: MouseEvent): GraphNode | null => {
      const bag = bagRef.current;
      const camera = bag.cameraRef.current;
      if (!camera) return null;

      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(bag.spritesArrayRef.current);
      if (intersects.length > 0) {
        const hitLabel = (intersects[0].object as THREE.Sprite).userData.label as string;
        return bag.graphNodesRef.current.get(hitLabel) ?? null;
      }
      return null;
    };

    const performPaint = (e: MouseEvent) => {
      const bag = bagRef.current;
      const camera = bag.cameraRef.current;
      const arr = bag.graphNodeArrayRef.current;
      if (!camera || !arr) return;

      const rect = domElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const width = rect.width;
      const height = rect.height;
      const widthHalf = width / 2;
      const heightHalf = height / 2;
      const tempV = new THREE.Vector3();

      SCRATCH_ERASE_LABELS.length = 0;
      const newOverrides: Record<string, PaintedOverride> = {};
      let changed = false;

      for (let i = 0; i < arr.length; i++) {
        const node = arr[i];
        if (!node.textSprite) continue;

        tempV.set(node.x, node.y, node.z).project(camera);
        const px = (tempV.x * widthHalf) + widthHalf;
        const py = -(tempV.y * heightHalf) + heightHalf;

        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= bag.brushRadius) {
          changed = true;
          if (bag.paintMode === 'erase') {
            SCRATCH_ERASE_LABELS.push(node.label);
          } else if (bag.paintMode === 'color') {
            newOverrides[node.label] = { color: bag.paintColor, colorBlend: bag.paintBlend };
          } else if (bag.paintMode === 'scale') {
            newOverrides[node.label] = { scale: bag.paintScale };
          } else if (bag.paintMode === 'opacity') {
            newOverrides[node.label] = { opacity: bag.paintOpacity };
          }
        }
      }

      if (changed) {
        bag.setPaintedOverrides(prev => {
          const next = { ...prev };
          if (bag.paintMode === 'erase') {
            for (let i = 0; i < SCRATCH_ERASE_LABELS.length; i++) {
              delete next[SCRATCH_ERASE_LABELS[i]];
            }
          } else {
            Object.entries(newOverrides).forEach(([label, po]) => {
              next[label] = {
                ...next[label],
                ...po
              };
            });
          }
          return next;
        });
        // Immediately sync visual overrides for responsive drag-painting
        bag.sync(arr);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const bag = bagRef.current;
      const activeTool = bag.activeTool;

      if (activeTool === 'paint') {
        const rect = domElement.getBoundingClientRect();
        bag.setMouseCoords({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });

        if (isMouseDown) {
          performPaint(e);
        }
        return;
      } else {
        bag.setMouseCoords(null);
      }

      // Pointer or Path tool hover highlights
      if (activeTool === 'pointer' || activeTool === 'path') {
        const now = performance.now();
        if (now - lastRaycastTime < 33) return;
        lastRaycastTime = now;

        const nextNode = getRaycastHit(e);
        const prevNode = bag.hoveredNodeRef.current;

        if (prevNode?.label === nextNode?.label) return;
        if (prevNode) bag.swap(prevNode, false, prevNode.label === bag.selectedNodeRef.current?.label);
        if (nextNode) bag.swap(nextNode, true, nextNode.label === bag.selectedNodeRef.current?.label);
        bag.hoveredNodeRef.current = nextNode;
        domElement.style.cursor = nextNode ? 'pointer' : (activeTool === 'path' ? 'cell' : 'default');
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Left click only
      isMouseDown = true;
      const bag = bagRef.current;

      if (bag.activeTool === 'paint') {
        bag.onStrokeStart?.();
        performPaint(e);
      } else if (bag.activeTool === 'pan') {
        domElement.style.cursor = 'grabbing';
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const wasMouseDown = isMouseDown;
      isMouseDown = false;
      const bag = bagRef.current;
      if (bag.activeTool === 'paint' && wasMouseDown) {
        bag.onStrokeEnd?.();
      } else if (bag.activeTool === 'pan') {
        domElement.style.cursor = 'grab';
      }
    };

    const handleMouseLeave = () => {
      const bag = bagRef.current;
      const wasMouseDown = isMouseDown;
      isMouseDown = false;
      bag.setMouseCoords(null);
      if (bag.activeTool === 'pan') {
        domElement.style.cursor = 'grab';
      }
      if (bag.activeTool === 'paint' && wasMouseDown) {
        bag.onStrokeEnd?.();
      }

      if (bag.hoveredNodeRef.current) {
        const was = bag.hoveredNodeRef.current;
        bag.swap(was, false, was.label === bag.selectedNodeRef.current?.label);
        bag.hoveredNodeRef.current = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const bag = bagRef.current;
      const activeTool = bag.activeTool;

      if (activeTool === 'pointer' || activeTool === 'path') {
        const hit = getRaycastHit(e);
        const prev = bag.selectedNodeRef.current;

        if (activeTool === 'path') {
          bag.onNodeSelectRef.current?.(hit);
          return;
        }

        // Pointer selection behavior
        if (!hit) {
          if (prev) bag.swap(prev, prev.label === bag.hoveredNodeRef.current?.label, false);
          bag.selectedNodeRef.current = null;
          bag.onNodeSelectRef.current?.(null);
          return;
        }

        if (prev && prev.label !== hit.label) {
          bag.swap(prev, prev.label === bag.hoveredNodeRef.current?.label, false);
        }

        const selecting = hit.label !== prev?.label;
        bag.selectedNodeRef.current = selecting ? hit : null;
        bag.swap(hit, hit.label === bag.hoveredNodeRef.current?.label, selecting);
        bag.onNodeSelectRef.current?.(selecting ? hit : null);
      }

      if (activeTool === 'glitch') {
        const camera = bag.cameraRef.current;
        const posVel = bag.workerPosVelRef.current;
        const arr = bag.graphNodeArrayRef.current;
        if (!camera || !posVel || !arr) return;

        // 1. Raycast to project click into 3D world space
        const rect = domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        // Calculate Center of Mass (COM) dynamically
        let sumX = 0;
        let sumY = 0;
        let sumZ = 0;
        const count = arr.length;
        for (let i = 0; i < count; i++) {
          const b = i * 6;
          sumX += posVel[b];
          sumY += posVel[b + 1];
          sumZ += posVel[b + 2];
        }
        SHARED_COM.set(
          count > 0 ? sumX / count : 0,
          count > 0 ? sumY / count : 0,
          count > 0 ? sumZ / count : 0
        );

        camera.getWorldDirection(SHARED_CAM_DIR);
        SHARED_CAM_DIR.negate();
        SHARED_PLANE.setFromNormalAndCoplanarPoint(SHARED_CAM_DIR, SHARED_COM);

        if (!raycaster.ray.intersectPlane(SHARED_PLANE, SHARED_CLICK_POINT)) {
          return;
        }

        const glitchRadius = 250;
        let hitAny = false;

        // 2. Iterate and apply outward velocity impulse
        for (let i = 0; i < arr.length; i++) {
          const node = arr[i];
          SHARED_NODE_POS.set(node.x, node.y, node.z);
          const dist = SHARED_NODE_POS.distanceTo(SHARED_CLICK_POINT);

          if (dist <= glitchRadius) {
            hitAny = true;
            const b = i * 6;
            SHARED_DIR.copy(SHARED_NODE_POS).sub(SHARED_CLICK_POINT);
            const distSafe = dist || 1;
            SHARED_DIR.divideScalar(distSafe); // Normalize

            // Stronger push for nodes closer to click point
            const force = (1.0 - dist / glitchRadius) * 35.0;
            posVel[b + 3] += SHARED_DIR.x * force;
            posVel[b + 4] += SHARED_DIR.y * force;
            posVel[b + 5] += SHARED_DIR.z * force;
          }
        }

        // 3. Wake up simulation and trigger jolt override
        if (hitAny) {
          bag.stillFramesRef.current = 0;
          bag.physicsEnabledRef.current = true;
          bag.physicsVelocityRef.current = 1.0; // Trigger dampening jolt override
        }
      }
    };

    const handleDblClick = (e: MouseEvent) => {
      const bag = bagRef.current;
      if (bag.activeTool !== 'pointer') return;

      const camera = bag.cameraRef.current;
      const controls = bag.controlsRef.current;
      if (!camera) return;

      const hit = getRaycastHit(e);
      if (!hit) return;

      const nodePos = new THREE.Vector3(hit.x, hit.y, hit.z);
      if (bag.viewMode !== '2D' && controls) {
        const dir = camera.position.clone().sub(controls.target).normalize();
        bag.cameraFlyRef.current = {
          fromPos: camera.position.clone(),
          toPos: nodePos.clone().addScaledVector(dir, 150),
          fromTarget: controls.target.clone(),
          toTarget: nodePos.clone(),
          startTime: performance.now(),
          duration: 700,
        };
      } else if (bag.viewMode === '2D') {
        bag.flyToTargetRef.current = nodePos.clone();
        const cam = camera as THREE.OrthographicCamera;
        cam.zoom = Math.max(cam.zoom, 5);
        cam.updateProjectionMatrix();
      }
    };

    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('mouseleave', handleMouseLeave);
    domElement.addEventListener('click', handleClick);
    domElement.addEventListener('dblclick', handleDblClick);

    return () => {
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('mouseleave', handleMouseLeave);
      domElement.removeEventListener('click', handleClick);
      domElement.removeEventListener('dblclick', handleDblClick);
    };
  }, []);
}
