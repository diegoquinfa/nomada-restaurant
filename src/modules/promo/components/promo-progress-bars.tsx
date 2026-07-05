import type { CSSProperties } from "react";

import { SLIDE_DURATION_MS } from "#/modules/promo/hooks/use-stories-autoplay.ts";

type PromoProgressBarsProps = {
  count: number;
  activeIndex: number;
  playing: boolean;
};

type SegmentState = "complete" | "active" | "upcoming";

function resolveSegmentState(index: number, activeIndex: number): SegmentState {
  if (index < activeIndex) return "complete";
  if (index === activeIndex) return "active";
  return "upcoming";
}

function resolveSegmentStyle(
  state: SegmentState,
  playing: boolean,
): CSSProperties {
  if (state === "complete") return { transform: "scaleX(1)" };
  if (state === "upcoming") return { transform: "scaleX(0)" };

  // state === "active"
  if (!playing) return { transform: "scaleX(1)" };

  return {
    animationName: "promo-progress-fill",
    animationDuration: `${SLIDE_DURATION_MS}ms`,
    animationTimingFunction: "linear",
    animationFillMode: "forwards",
  };
}

/**
 * Segmented "stories" progress bars: one segment per slide, the active
 * segment fills over `SLIDE_DURATION_MS` via a CSS animation, prior
 * segments render complete, later ones render empty. `key={activeIndex}`
 * on the root remounts the segments so the fill animation always restarts
 * cleanly. Purely decorative — `aria-hidden`.
 */
export function PromoProgressBars({
  count,
  activeIndex,
  playing,
}: PromoProgressBarsProps) {
  if (count <= 1) return null;

  return (
    <div
      key={activeIndex}
      className="absolute top-2 right-2 left-2 z-10 flex gap-1"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => {
        const state = resolveSegmentState(index, activeIndex);

        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: segments are a fixed-length, order-stable sequence; the parent already remounts on index change via key={activeIndex}.
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              data-progress-state={state}
              className="h-full w-full origin-left bg-white"
              style={resolveSegmentStyle(state, playing)}
            />
          </div>
        );
      })}
    </div>
  );
}
