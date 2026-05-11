import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LABEL_W, type ViewWindow } from './types';
import { TIMELINE_DURATION } from '../../constants';

// Base zoom multiplier. User's "1x" = 12.0 internal zoom.
const ZOOM_SCALE = 12;

/**
 * Shared hook for timeline view window state: zoom, pan, snap, and helpers.
 * Consolidates the scattered zoom/pan/snap state from the main Timeline component.
 */
export function useTimelineView(initialDuration = TIMELINE_DURATION) {
  const [zoom, setZoom] = useState(1);
  const [panStart, setPanStart] = useState(0);
  const [snap, setSnap] = useState(true);
  const [duration, setDuration] = useState(initialDuration);

  // Animated values for display
  const viewWindow = useMemo((): ViewWindow => {
    const visibleDuration = duration / (zoom * ZOOM_SCALE);
    const maxStart = Math.max(0, duration - visibleDuration);
    const start = Math.max(0, Math.min(maxStart, panStart));
    return { start, end: start + visibleDuration };
  }, [zoom, panStart, duration]);

  // Refs for non-stale access in event handlers
  const zoomRef = useRef(zoom);
  const panStartRef = useRef(panStart);
  useEffect(() => { 
    zoomRef.current = zoom; 
    panStartRef.current = panStart;
  }, [zoom, panStart]);

  /** Convert a clientX pixel position to a time value, applying snap. */
  const timeFromClientX = useCallback((clientX: number, contentEl: HTMLElement | null, snapPoints: number[] = []): number | null => {
    if (!contentEl) return null;
    const rect = contentEl.getBoundingClientRect();
    const rightW = rect.width - LABEL_W;
    const x = clientX - rect.left - LABEL_W;
    const frac = x / rightW;
    
    // Use current (animated) view window for visual picking accuracy
    const visibleDuration = viewWindow.end - viewWindow.start;
    const raw = viewWindow.start + frac * visibleDuration;
    const clamped = Math.max(0, Math.min(duration, raw));

    if (snap) {
      // 1. Try snapping to provided points (scene markers, etc)
      // Threshold: ~10 pixels in time
      const threshold = (visibleDuration / rightW) * 10;
      let bestPoint = -1;
      let minDiff = threshold;

      for (const p of snapPoints) {
        const diff = Math.abs(clamped - p);
        if (diff < minDiff) {
          minDiff = diff;
          bestPoint = p;
        }
      }

      if (bestPoint !== -1) return bestPoint;

      // 2. Fallback to frame grid
      return Math.round(clamped * 30) / 30;
    }
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
      const z = zoomRef.current;
      const x = e.clientX - rect.left - LABEL_W;
      const rightW = rect.width - LABEL_W;
      const frac = Math.max(0, Math.min(1, x / rightW));
      
      const visibleDuration = duration / (z * ZOOM_SCALE);
      const maxStart = Math.max(0, duration - visibleDuration);
      const start = Math.max(0, Math.min(maxStart, panStartRef.current));
      const timeAtCursor = start + frac * visibleDuration;

      // Continuous zoom factor based on deltaY magnitude
      const factor = Math.pow(1.1, -e.deltaY * 0.02);
      // New constraints: 0.08 (full duration) to 20 (240x original)
      const newZoom = Math.max(0.08, Math.min(20, z * factor));
      const newVisibleDuration = duration / (newZoom * ZOOM_SCALE);
      const newPanStart = Math.max(0, Math.min(
        duration - newVisibleDuration,
        timeAtCursor - frac * newVisibleDuration
      ));

      setZoom(newZoom);
      setPanStart(newPanStart);
    } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.5 || Math.abs(e.deltaX) > 2) {
      // Horizontal scroll / trackpad swipe -> pan
      e.preventDefault();
      const z = zoomRef.current;
      const rightW = rect.width - LABEL_W;
      const visibleDuration = duration / (z * ZOOM_SCALE);
      const secondsPerPixel = visibleDuration / rightW;
      const delta = e.deltaX * secondsPerPixel;
      
      setPanStart(prev => {
        const maxStart = Math.max(0, duration - visibleDuration);
        return Math.max(0, Math.min(maxStart, prev + delta));
      });
    }
  }, [duration]);

  /** Zoom in, keeping the center of the view fixed. */
  const zoomIn = useCallback(() => {
    const mid = (viewWindow.start + viewWindow.end) / 2;
    setZoom(z => {
      const newZ = Math.min(20, z * 1.5);
      const newVisible = duration / (newZ * ZOOM_SCALE);
      setPanStart(Math.max(0, Math.min(duration - newVisible, mid - newVisible / 2)));
      return newZ;
    });
  }, [duration, viewWindow]);

  /** Zoom out, keeping the center of the view fixed. */
  const zoomOut = useCallback(() => {
    const mid = (viewWindow.start + viewWindow.end) / 2;
    setZoom(z => {
      const newZ = Math.max(0.08, z / 1.5);
      const newVisible = duration / (newZ * ZOOM_SCALE);
      setPanStart(Math.max(0, Math.min(duration - newVisible, mid - newVisible / 2)));
      return newZ;
    });
  }, [duration, viewWindow]);

  /** Reset zoom to show the default 1x zoom. */
  const zoomReset = useCallback(() => {
    setZoom(1);
    setPanStart(0);
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
    const newZoom = Math.max(0.08, Math.min(20, duration / (fitDuration * ZOOM_SCALE)));
    setZoom(newZoom);
    setPanStart(fitStart);
  }, [duration, zoomReset]);



  /** Auto-extend duration when keyframes approach the end. */
  const autoExtendDuration = useCallback((maxKfTime: number) => {
    if (maxKfTime > duration * 0.9) {
      setDuration(d => d + 60);
    }
  }, [duration]);

  return {
    zoom, setZoom,
    panStart, setPanStart,
    snap, setSnap,
    duration, setDuration,
    viewWindow,
    timeFromClientX,
    handleWheel,
    zoomIn, zoomOut, zoomReset, zoomToFit,
    autoExtendDuration,
  };
}
