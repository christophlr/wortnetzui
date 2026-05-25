import { useEffect, type RefObject } from 'react';

export function useResizeObserver(
  containerRef: RefObject<HTMLElement | null>,
  onResize: (width: number, height: number) => void,
): void {
  useEffect(() => {
    const handle = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0 || h === 0) return;
      onResize(w, h);
    };
    const el = containerRef.current;
    const ro = new ResizeObserver(handle);
    if (el) ro.observe(el);
    window.addEventListener('resize', handle);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handle);
    };
  }, [containerRef, onResize]);
}
