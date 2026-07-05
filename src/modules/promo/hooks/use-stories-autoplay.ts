import { type RefObject, useCallback, useEffect, useState } from "react";

export const SLIDE_DURATION_MS = 10_000;
const SLIDE_SELECTOR = "[data-blossom-slide]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = () => setPrefersReduced(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}

type UseStoriesAutoplayResult = {
  playing: boolean;
  markInteracted: () => void;
};

/**
 * Drives the "stories" autoplay for the promo carousel: advances one slide
 * every `SLIDE_DURATION_MS` by scrolling the next `[data-blossom-slide]`
 * element into view. Stops permanently at the last slide (no loop), on the
 * first user interaction, or when `prefers-reduced-motion` is set.
 */
export function useStoriesAutoplay(
  elementRef: RefObject<HTMLElement | null>,
  activeIndex: number,
  count: number,
): UseStoriesAutoplayResult {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [interacted, setInteracted] = useState(false);
  const playing = !prefersReducedMotion && !interacted;

  useEffect(() => {
    if (!playing) return;
    if (count === 0) return;
    if (activeIndex >= count - 1) return;

    const id = window.setTimeout(() => {
      const element = elementRef.current;
      if (!element) return;

      const slides = element.querySelectorAll<HTMLElement>(SLIDE_SELECTOR);
      const next = slides[activeIndex + 1];
      next?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(id);
  }, [playing, activeIndex, count, elementRef]);

  const markInteracted = useCallback(() => {
    setInteracted(true);
  }, []);

  return { playing, markInteracted };
}
