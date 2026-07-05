import { act, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useStoriesAutoplay } from "#/modules/promo/hooks/use-stories-autoplay.ts";

function createCarousel(slideCount: number): HTMLElement {
  const container = document.createElement("div");
  for (let i = 0; i < slideCount; i++) {
    const slide = document.createElement("div");
    slide.setAttribute("data-blossom-slide", "");
    container.appendChild(slide);
  }
  document.body.appendChild(container);
  return container;
}

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_event: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: () => void) => {
      listeners.delete(listener);
    },
  }));
}

describe("useStoriesAutoplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("advances to the next slide via scrollIntoView after 10s", () => {
    const container = createCarousel(3);
    const slides = container.querySelectorAll("[data-blossom-slide]");
    const spy = vi.spyOn(slides[1] as HTMLElement, "scrollIntoView");

    renderHook(() => {
      const ref = useRef(container);
      return useStoriesAutoplay(ref, 0, 3);
    });

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ inline: "start", block: "nearest" }),
    );
  });

  it("does not schedule a timer once the last slide is active (no loop)", () => {
    const container = createCarousel(3);
    const slides = container.querySelectorAll("[data-blossom-slide]");
    const spies = Array.from(slides).map((slide) =>
      vi.spyOn(slide as HTMLElement, "scrollIntoView"),
    );

    renderHook(() => {
      const ref = useRef(container);
      return useStoriesAutoplay(ref, 2, 3);
    });

    act(() => {
      vi.advanceTimersByTime(20_000);
    });

    for (const spy of spies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it("stops advancing after markInteracted() is called", () => {
    const container = createCarousel(3);
    const slides = container.querySelectorAll("[data-blossom-slide]");
    const spy = vi.spyOn(slides[1] as HTMLElement, "scrollIntoView");

    const { result } = renderHook(() => {
      const ref = useRef(container);
      return useStoriesAutoplay(ref, 0, 3);
    });

    act(() => {
      result.current.markInteracted();
    });

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(spy).not.toHaveBeenCalled();
    expect(result.current.playing).toBe(false);
  });

  it("never starts a timer when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    const container = createCarousel(3);
    const slides = container.querySelectorAll("[data-blossom-slide]");
    const spy = vi.spyOn(slides[1] as HTMLElement, "scrollIntoView");

    const { result } = renderHook(() => {
      const ref = useRef(container);
      return useStoriesAutoplay(ref, 0, 3);
    });

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(spy).not.toHaveBeenCalled();
    expect(result.current.playing).toBe(false);
  });
});
