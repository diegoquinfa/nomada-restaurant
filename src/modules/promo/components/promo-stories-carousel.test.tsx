import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PromoStoriesCarousel } from "#/modules/promo/components/promo-stories-carousel.tsx";
import type { PromoSlide } from "#/modules/promo/lib/promo-slides.ts";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

const twoSlides: PromoSlide[] = [
  { promoId: "menu-domingo", image: { src: "/a.webp", alt: "Promo A" } },
  { promoId: "mundialista", image: { src: "/b.webp", alt: "Promo B" } },
];

const oneSlide: PromoSlide[] = [
  { promoId: "mundialista", image: { src: "/b.webp", alt: "Promo B" } },
];

describe("PromoStoriesCarousel", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders a bare image with no navigation controls for a single slide", () => {
    render(<PromoStoriesCarousel slides={oneSlide} />);

    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /anterior/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /siguiente/i })).toBeNull();
  });

  it("renders prev/next controls and one progress segment per slide for multiple slides", () => {
    const { container } = render(<PromoStoriesCarousel slides={twoSlides} />);

    expect(
      screen.getByRole("button", { name: "Imagen anterior" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Siguiente imagen" }),
    ).not.toBeNull();

    const segments = container.querySelectorAll("[data-progress-state]");
    expect(segments).toHaveLength(2);
  });

  it("disables prev on the first slide and scrolls the next slide into view on next click", () => {
    const scrollSpy = vi.spyOn(Element.prototype, "scrollIntoView");
    render(<PromoStoriesCarousel slides={twoSlides} />);

    const prev = screen.getByRole("button", {
      name: "Imagen anterior",
    }) as HTMLButtonElement;
    const next = screen.getByRole("button", {
      name: "Siguiente imagen",
    }) as HTMLButtonElement;

    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    fireEvent.click(next);

    const slides = document.querySelectorAll("[data-blossom-slide]");
    expect(scrollSpy).toHaveBeenCalled();
    expect(scrollSpy.mock.contexts.at(-1)).toBe(slides[1]);
  });

  it("labels every slide as a group with its position and total count", () => {
    render(<PromoStoriesCarousel slides={twoSlides} />);

    expect(screen.getByRole("group", { name: "1 de 2" })).not.toBeNull();
    expect(screen.getByRole("group", { name: "2 de 2" })).not.toBeNull();
  });
});
