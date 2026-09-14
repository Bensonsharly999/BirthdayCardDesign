import { useEffect } from 'react';

export function useSwipe(ref, { onLeft, onRight, threshold = 48 } = {}) {
  useEffect(() => {
    const node = ref?.current;
    if (!node) return undefined;
    let startX = 0;
    let startY = 0;
    let active = false;

    const onStart = (event) => {
      const point = event.touches ? event.touches[0] : event;
      startX = point.clientX;
      startY = point.clientY;
      active = true;
    };

    const onEnd = (event) => {
      if (!active) return;
      active = false;
      const point = event.changedTouches ? event.changedTouches[0] : event;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onLeft?.();
      else onRight?.();
    };

    node.addEventListener('touchstart', onStart, { passive: true });
    node.addEventListener('touchend', onEnd);
    node.addEventListener('pointerdown', onStart);
    node.addEventListener('pointerup', onEnd);
    return () => {
      node.removeEventListener('touchstart', onStart);
      node.removeEventListener('touchend', onEnd);
      node.removeEventListener('pointerdown', onStart);
      node.removeEventListener('pointerup', onEnd);
    };
  }, [ref, onLeft, onRight, threshold]);
}
