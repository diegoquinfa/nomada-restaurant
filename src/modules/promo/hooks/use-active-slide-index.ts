import { type RefObject, useEffect, useRef, useState } from "react";

const SLIDE_SELECTOR = "[data-blossom-slide]";

function findNearestSlideIndex(element: HTMLElement): number {
  const slides = Array.from(
    element.querySelectorAll<HTMLElement>(SLIDE_SELECTOR),
  );
  if (slides.length === 0) return 0;

  const scrollLeft = element.scrollLeft;
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const [index, slide] of slides.entries()) {
    const distance = Math.abs(slide.offsetLeft - scrollLeft);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
}

/**
 * Tracks the active slide index of a Blossom carousel by observing native
 * `scroll` and `scrollend` events on the carousel element, rAF-throttled,
 * and picking the `[data-blossom-slide]` nearest to the current scroll
 * position. `scrollend` is unsupported in older Safari, so `scroll` is
 * kept as a fallback (mirrors Blossom's own internal observer).
 */
export function useActiveSlideIndex(
  elementRef: RefObject<HTMLElement | null>,
  count: number,
): number {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || count === 0) return;

    const measure = () => {
      rafRef.current = null;
      const current = elementRef.current;
      if (!current) return;
      setActiveIndex(findNearestSlideIndex(current));
    };

    const scheduleMeasure = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(measure);
    };

    element.addEventListener("scroll", scheduleMeasure, { passive: true });
    element.addEventListener("scrollend", scheduleMeasure, { passive: true });

    scheduleMeasure();

    return () => {
      element.removeEventListener("scroll", scheduleMeasure);
      element.removeEventListener("scrollend", scheduleMeasure);
      if (rafRef.current !== null) {
        // Reset the id so a later effect run (StrictMode remount, count
        // change) can schedule again; otherwise scheduleMeasure bails forever.
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [elementRef, count]);

  return activeIndex;
}
