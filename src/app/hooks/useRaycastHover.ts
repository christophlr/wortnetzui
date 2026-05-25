import { useCallback, useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import type { GraphNode } from '../graph';

export interface RaycastHoverOpts {
  cameraRef: RefObject<THREE.Camera | null>;
  spritesArrayRef: RefObject<THREE.Object3D[]>;
  graphNodesRef: RefObject<Map<string, GraphNode>>;
  hoveredNodeRef: RefObject<GraphNode | null>;
  selectedNodeRef: RefObject<GraphNode | null>;
  cameraFlyRef: RefObject<{
    fromPos: THREE.Vector3; toPos: THREE.Vector3;
    fromTarget: THREE.Vector3; toTarget: THREE.Vector3;
    startTime: number; duration: number;
  } | null>;
  flyToTargetRef: RefObject<THREE.Vector3 | null>;
  controlsRef: RefObject<{ target: THREE.Vector3 } | null>;
  swap: (node: GraphNode, highlighted: boolean, selected: boolean) => void;
  onNodeSelectRef: RefObject<((node: GraphNode | null) => void) | undefined>;
  viewMode: '2D' | '3D';
}

/**
 * Returns a stable `attach(domElement)` that wires raycaster-based hover,
 * click (select), and dblclick (camera fly-to) handlers on the given DOM
 * element. Returns a detach function for cleanup.
 *
 * The hook reads all dependencies through a ref bag so `attach` keeps a
 * stable identity across renders.
 */
export function useRaycastHover(opts: RaycastHoverOpts): (domElement: HTMLElement) => () => void {
  const bagRef = useRef(opts);
  useEffect(() => { bagRef.current = opts; });

  return useCallback((domElement: HTMLElement) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastRaycastTime = 0;

    const handleHoverMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastRaycastTime < 33) return;
      lastRaycastTime = now;
      const bag = bagRef.current;
      const camera = bag.cameraRef.current;
      if (!camera) return;

      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(bag.spritesArrayRef.current);
      const hitLabel = intersects.length > 0 ? (intersects[0].object as THREE.Sprite).userData.label as string : null;
      const prevNode = bag.hoveredNodeRef.current;
      const nextNode = hitLabel ? bag.graphNodesRef.current.get(hitLabel) ?? null : null;

      if (prevNode?.label === nextNode?.label) return;
      if (prevNode) bag.swap(prevNode, false, prevNode.label === bag.selectedNodeRef.current?.label);
      if (nextNode) bag.swap(nextNode, true, nextNode.label === bag.selectedNodeRef.current?.label);
      bag.hoveredNodeRef.current = nextNode;
      domElement.style.cursor = nextNode ? 'pointer' : 'default';
    };

    const handleHoverLeave = () => {
      const bag = bagRef.current;
      if (bag.hoveredNodeRef.current) {
        const was = bag.hoveredNodeRef.current;
        bag.swap(was, false, was.label === bag.selectedNodeRef.current?.label);
        bag.hoveredNodeRef.current = null;
        domElement.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const bag = bagRef.current;
      const camera = bag.cameraRef.current;
      if (!camera) return;
      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(bag.spritesArrayRef.current);
      const hit = intersects.length > 0 ? bag.graphNodesRef.current.get((intersects[0].object as THREE.Sprite).userData.label) ?? null : null;
      const prev = bag.selectedNodeRef.current;

      if (!hit) {
        if (prev) bag.swap(prev, prev.label === bag.hoveredNodeRef.current?.label, false);
        bag.selectedNodeRef.current = null;
        return;
      }

      if (prev && prev.label !== hit.label) bag.swap(prev, prev.label === bag.hoveredNodeRef.current?.label, false);

      const selecting = hit.label !== prev?.label;
      bag.selectedNodeRef.current = selecting ? hit : null;
      bag.swap(hit, hit.label === bag.hoveredNodeRef.current?.label, selecting);

      bag.onNodeSelectRef.current?.(selecting ? hit : null);
    };

    const handleDblClick = (e: MouseEvent) => {
      const bag = bagRef.current;
      const camera = bag.cameraRef.current;
      const controls = bag.controlsRef.current;
      if (!camera) return;
      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(bag.spritesArrayRef.current);
      const hit = intersects.length > 0 ? bag.graphNodesRef.current.get((intersects[0].object as THREE.Sprite).userData.label) ?? null : null;
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

    domElement.addEventListener('mousemove', handleHoverMove);
    domElement.addEventListener('mouseleave', handleHoverLeave);
    domElement.addEventListener('click', handleClick);
    domElement.addEventListener('dblclick', handleDblClick);

    return () => {
      domElement.removeEventListener('mousemove', handleHoverMove);
      domElement.removeEventListener('mouseleave', handleHoverLeave);
      domElement.removeEventListener('click', handleClick);
      domElement.removeEventListener('dblclick', handleDblClick);
    };
  }, []);
}
