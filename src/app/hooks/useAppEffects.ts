import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TIMELINE_DURATION } from '../constants';
import type { TimelineState } from '../context/WortnetzContextTypes';
import { resolveSystemTheme } from '../theme/tokens';

export function useOverlayBandOffsets() {
  const [offsets, setOffsets] = useState({ top: 0, bottom: 0 });
  const topBarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measure = () => setOffsets({
      top: topBarRef.current?.offsetHeight ?? 0,
      bottom: timelineRef.current?.offsetHeight ?? 0,
    });
    measure();
    const observer = new ResizeObserver(measure);
    if (topBarRef.current) observer.observe(topBarRef.current);
    if (timelineRef.current) observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, []);

  return { offsets, topBarRef, timelineRef };
}

export function useThemeClass(themeMode: 'light' | 'dark' | 'hybrid') {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'theme-hybrid');
    if (themeMode === 'dark') root.classList.add('dark');
    else if (themeMode === 'hybrid') root.classList.add('theme-hybrid');
    else root.classList.add('light');
  }, [themeMode]);
}

/**
 * When the user has picked "System" (themeAuto === true), follow the OS's
 * prefers-color-scheme in real time. Tears the listener down when the user
 * flips back to an explicit choice.
 */
export function useSystemThemeSync(themeAuto: boolean, setThemeMode: (m: 'light' | 'hybrid' | 'dark') => void) {
  useEffect(() => {
    if (!themeAuto || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setThemeMode(resolveSystemTheme());
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, [themeAuto, setThemeMode]);
}

export function useInitProgressTick(isNetworkReady: boolean, setInitProgress: (v: number | ((prev: number) => number)) => void) {
  useEffect(() => {
    if (isNetworkReady) {
      setInitProgress(100);
      return;
    }
    setInitProgress(0);
    const interval = setInterval(() => {
      setInitProgress(prev => {
        if (typeof prev !== 'number') return 0;
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isNetworkReady, setInitProgress]);
}



export function usePlayAnimation(
  isPlaying: boolean,
  setIsPlaying: (v: boolean | ((prev: boolean) => boolean)) => void,
  setPlayheadPosition: (v: number) => void,
  playheadRef: React.MutableRefObject<number>,
) {
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - playheadRef.current * 1000;
      const animate = () => {
        const newPos = (Date.now() - startTimeRef.current) / 1000;
        if (newPos >= TIMELINE_DURATION) {
          setPlayheadPosition(TIMELINE_DURATION);
          setIsPlaying(false);
        } else {
          setPlayheadPosition(newPos);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useTimecode(playheadPosition: number, setTimecode: (v: string) => void) {
  useEffect(() => {
    const total = Math.floor(playheadPosition);
    const frames = Math.floor((playheadPosition - total) * 30);
    const s = total % 60;
    const m = Math.floor(total / 60) % 60;
    const h = Math.floor(total / 3600);
    setTimecode(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(frames).padStart(2,'0')}`);
  }, [playheadPosition, setTimecode]);
}

export function useTimelineResize(timelineHeight: number, setTimelineHeight: (v: number) => void) {
  return useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = timelineHeight;
    const onMove = (ev: MouseEvent) => setTimelineHeight(Math.max(100, Math.min(600, startHeight - (ev.clientY - startY))));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [timelineHeight, setTimelineHeight]);
}
