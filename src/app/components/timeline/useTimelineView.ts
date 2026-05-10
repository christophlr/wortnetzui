import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LABEL_W, type ViewWindow } from './types';
import { TIMELINE_DURATION } from '../../constants';

/**
 * Shared hook for timeline view window state: zoom, pan, snap, and helpers.
 * Consolidates the scattered zoom/pan/snap state from the main Timeline component.
 */
export function useTimelineView(initialDuration = TIMELINE_DURATION) {
  const [targetZoom, setTargetZoom] = useState(1);
  const [targetPanStart, setTargetPanStart] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [panStart, setPanStart] = useState(0);
  const [snap, setSnap] = useState(true);
  const [duration, setDuration] = useState(initialDuration);

  // Animated values for display
  const viewWindow = useMemo((): ViewWindow => {
    const visibleDuration = duration / zoom;
    const maxStart = Math.max(0, duration - visibleDuration);
    const start = Math.max(0, Math.min(maxStart, panStart));
    return { start, end: start + visibleDuration };
  }, [zoom, panStart, duration]);

  // Target window for calculations (prevents drifting during animation)
  const targetViewWindow = useMemo((): ViewWindow => {
    const visibleDuration = duration / targetZoom;
    const maxStart = Math.max(0, duration - visibleDuration);
    const start = Math.max(0, Math.min(maxStart, targetPanStart));
    return { start, end: start + visibleDuration };
  }, [targetZoom, targetPanStart, duration]);

  // Refs for non-stale access in event handlers
  const targetZoomRef = useRef(targetZoom);
  const targetPanStartRef = useRef(targetPanStart);
  useEffect(() => { 
    targetZoomRef.current = targetZoom; 
    targetPanStartRef.current = targetPanStart;
  }, [targetZoom, targetPanStart]);

  // Animation Loop: Lerp current values toward targets
  useEffect(() => {
    let raf: number;
    const step = () => {
      setZoom(prev => {
        const diff = targetZoomRef.current - prev;
        if (Math.abs(diff) < 0.0001) return targetZoomRef.current;
        return prev + diff * 0.25; // Smoothing factor
      });
      setPanStart(prev => {
        const diff = targetPanStartRef.current - prev;
        if (Math.abs(diff) < 0.0001) return targetPanStartRef.current;
        return prev + diff * 0.25;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  /** Convert a clientX pixel position to a time value, applying snap. */
  const timeFromClientX = useCallback((clientX: number, contentEl: HTMLElement | null): number | null => {
    if (!contentEl) return null;
    const rect = contentEl.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = clientX - rect.left - LABEL_W;
    const frac = x / rightW;
    
    // Use current (animated) view window for visual picking accuracy
    const visibleDuration = viewWindow.end - viewWindow.start;
    const raw = viewWindow.start + frac * visibleDuration;
    const clamped = Math.max(0, Math.min(duration, raw));
    if (snap) return Math.round(clamped * 30) / 30;
    return clamped;
  }, [snap, duration, viewWindow]);

  /** Wheel handler for cursor-anchored zoom + trackpad pan. Attach to the content element. */
  const handleWheel = useCallback((e: WheelEvent, contentEl: HTMLElement) => {
    const rect = contentEl.getBoundingClientRect();
    // Only intercept events over the track area (right of labels)
    if (e.clientX < rect.left + LABEL_W) return;

    if (e.ctrlKey || e.metaKey) {
      // Pinch-to-zoom, anchored at cursor
      e.preventDefault();
      
      // Calculate anchor relative to TARGET view window to keep the zoom stable
      const z = targetZoomRef.current;
      const x = e.clientX - rect.left - LABEL_W;
      const rightW = rect.width - LABEL_W;
      const frac = Math.max(0, Math.min(1, x / rightW));
      
      const visibleDuration = duration / z;
      const maxStart = Math.max(0, duration - visibleDuration);
      const start = Math.max(0, Math.min(maxStart, targetPanStartRef.current));
      const timeAtCursor = start + frac * visibleDuration;

      // Continuous zoom factor based on deltaY magnitude
      const factor = Math.pow(1.1, -e.deltaY * 0.02);
      const newZoom = Math.max(1, Math.min(200, z * factor));
      const newVisibleDuration = duration / newZoom;
      const newPanStart = Math.max(0, Math.min(
        duration - newVisibleDuration,
        timeAtCursor - frac * newVisibleDuration
      ));

      setTargetZoom(newZoom);
      setTargetPanStart(newPanStart);
    } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.5 || Math.abs(e.deltaX) > 2) {
      // Horizontal scroll / trackpad swipe -> pan
      e.preventDefault();
      const z = targetZoomRef.current;
      const rightW = rect.width - LABEL_W;
      const visibleDuration = duration / z;
      const secondsPerPixel = visibleDuration / rightW;
      const delta = e.deltaX * secondsPerPixel;
      
      setTargetPanStart(prev => {
        const maxStart = Math.max(0, duration - visibleDuration);
        return Math.max(0, Math.min(maxStart, prev + delta));
      });
    }
  }, [duration]);

  /** Zoom in, keeping the center of the view fixed. */
  const zoomIn = useCallback(() => {
    const mid = (targetViewWindow.start + targetViewWindow.end) / 2;
    setTargetZoom(z => {
      const newZ = Math.min(200, z * 1.5);
      const newVisible = duration / newZ;
      setTargetPanStart(Math.max(0, Math.min(duration - newVisible, mid - newVisible / 2)));
      return newZ;
    });
  }, [duration, targetViewWindow]);

  /** Zoom out, keeping the center of the view fixed. */
  const zoomOut = useCallback(() => {
    const mid = (targetViewWindow.start + targetViewWindow.end) / 2;
    setTargetZoom(z => {
      const newZ = Math.max(1, z / 1.5);
      const newVisible = duration / newZ;
      setTargetPanStart(Math.max(0, Math.min(duration - newVisible, mid - newVisible / 2)));
      return newZ;
    });
  }, [duration, targetViewWindow]);

  /** Reset zoom to show the full duration. */
  const zoomReset = useCallback(() => {
    setTargetZoom(1);
    setTargetPanStart(0);
  }, []);

  /** Zoom to fit all keyframes in view. */
  const zoomToFit = useCallback((keyframeTimes: number[]) => {
    if (keyframeTimes.length === 0) { zoomReset(); return; }
    const min = Math.min(...keyframeTimes);
    const max = Math.max(...keyframeTimes);
    const padding = Math.max(1, (max - min) * 0.1);
    const fitStart = Math.max(0, min - padding);
    const fitEnd = Math.min(duration, max + padding);
    const fitDuration = fitEnd - fitStart;
    const newZoom = Math.max(1, Math.min(200, duration / fitDuration));
    setTargetZoom(newZoom);
    setTargetPanStart(fitStart);
  }, [duration, zoomReset]);

  /** Auto-extend duration when keyframes approach the end. */
  const autoExtendDuration = useCallback((maxKfTime: number) => {
    if (maxKfTime > duration * 0.9) {
      setDuration(d => d + 60);
    }
  }, [duration]);

  return {
    zoom, setZoom: setTargetZoom,
    panStart, setPanStart: setTargetPanStart,
    snap, setSnap,
    duration, setDuration,
    viewWindow,
    timeFromClientX,
    handleWheel,
    zoomIn, zoomOut, zoomReset, zoomToFit,
    autoExtendDuration,
  };
}
