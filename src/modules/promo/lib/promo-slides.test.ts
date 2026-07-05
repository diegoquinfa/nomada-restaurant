import { describe, expect, it } from "vitest";

import { aggregatePromoSlides } from "#/modules/promo/lib/promo-slides.ts";
import type { Promo } from "#/modules/promo/promos.config.ts";

describe("aggregatePromoSlides", () => {
  it("flattens images from multiple active promos, preserving config order", () => {
    const promos: Promo[] = [
      {
        id: "menu-domingo",
        images: [
          { src: "/images/promo/promo-domingos.webp", alt: "Menu del Domingo" },
        ],
        activeDays: [6],
      },
      {
        id: "mundialista",
        images: [
          { src: "/images/promo/promo-0002.webp", alt: "Hamburguesa" },
          { src: "/images/promo/promo-0003.webp", alt: "Postre" },
        ],
        activeDays: [0, 1, 2, 3, 4, 5, 6],
      },
    ];

    expect(aggregatePromoSlides(promos)).toEqual([
      {
        promoId: "menu-domingo",
        image: {
          src: "/images/promo/promo-domingos.webp",
          alt: "Menu del Domingo",
        },
      },
      {
        promoId: "mundialista",
        image: { src: "/images/promo/promo-0002.webp", alt: "Hamburguesa" },
      },
      {
        promoId: "mundialista",
        image: { src: "/images/promo/promo-0003.webp", alt: "Postre" },
      },
    ]);
  });

  it("returns a single-source slide list when only one promo is provided", () => {
    const promos: Promo[] = [
      {
        id: "mundialista",
        images: [{ src: "/images/promo/promo-0002.webp", alt: "Hamburguesa" }],
        activeDays: [0],
      },
    ];

    expect(aggregatePromoSlides(promos)).toEqual([
      {
        promoId: "mundialista",
        image: { src: "/images/promo/promo-0002.webp", alt: "Hamburguesa" },
      },
    ]);
  });

  it("returns an empty list when no promos are active", () => {
    expect(aggregatePromoSlides([])).toEqual([]);
  });
});
