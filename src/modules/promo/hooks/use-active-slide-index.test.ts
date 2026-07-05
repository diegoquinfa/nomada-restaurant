import { act, renderHook } from "@testing-library/react";
import { StrictMode, useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useActiveSlideIndex } from "#/modules/promo/hooks/use-active-slide-index.ts";

function createCarousel(slideCount: number): HTMLElement {
  const container = document.createElement("div");
  for (let i = 0; i < slideCount; i++) {
    const slide = document.createElement("div");
    slide.setAttribute("data-blossom-slide", "");
    Object.defineProperty(slide, "offsetLeft", {
      value: i * 300,
      configurable: true,
    });
    container.appendChild(slide);
  }
  document.body.appendChild(container);
  return container;
}

describe("useActiveSlideIndex", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("reports index 0 before any scroll (initial measurement)", () => {
    const container = createCarousel(3);

    const { result } = renderHook(() => {
      const ref = useRef(container);
      return useActiveSlideIndex(ref, 3);
    });

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(result.current).toBe(0);
  });

  it("updates to the nearest slide index after a scroll event", () => {
    const container = createCarousel(3);

    const { result } = renderHook(() => {
      const ref = useRef(container);
      return useActiveSlideIndex(ref, 3);
    });

    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(result.current).toBe(0);

    Object.defineProperty(container, "scrollLeft", {
      value: 300,
      configurable: true,
    });

    act(() => {
      container.dispatchEvent(new Event("scroll"));
      vi.advanceTimersByTime(20);
    });

    expect(result.current).toBe(1);
  });

  it("keeps measuring after a StrictMode effect remount (rAF id must reset)", () => {
    const container = createCarousel(3);

    const { result } = renderHook(
      () => {
        const ref = useRef(container);
        return useActiveSlideIndex(ref, 3);
      },
      { wrapper: StrictMode },
    );

    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(result.current).toBe(0);

    Object.defineProperty(container, "scrollLeft", {
      value: 300,
      configurable: true,
    });

    act(() => {
      container.dispatchEvent(new Event("scroll"));
      vi.advanceTimersByTime(20);
    });

    expect(result.current).toBe(1);
  });

  it("updates on scrollend as an iOS fallback for the scroll event", () => {
    const container = createCarousel(3);

    const { result } = renderHook(() => {
      const ref = useRef(container);
      return useActiveSlideIndex(ref, 3);
    });

    act(() => {
      vi.advanceTimersByTime(20);
    });

    Object.defineProperty(container, "scrollLeft", {
      value: 600,
      configurable: true,
    });

    act(() => {
      container.dispatchEvent(new Event("scrollend"));
      vi.advanceTimersByTime(20);
    });

    expect(result.current).toBe(2);
  });
});
