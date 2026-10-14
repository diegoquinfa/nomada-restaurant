import { describe, expect, it } from "vitest";

import {
  mapActiveDays,
  mapCmsPromo,
  mapCmsPromos,
} from "#/modules/promo/lib/cms-promos.ts";

describe("mapActiveDays", () => {
  it("converts Spanish day names to 0=Monday … 6=Sunday", () => {
    expect(mapActiveDays(["Lunes", "Domingo"])).toEqual([0, 6]);
    expect(mapActiveDays(["Sábado", "Domingo"])).toEqual([5, 6]);
    expect(mapActiveDays(["Miércoles"])).toEqual([2]);
  });

  it("treats an empty or absent list as every day", () => {
    expect(mapActiveDays([])).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(mapActiveDays(undefined)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(mapActiveDays(null)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(mapActiveDays("Lunes")).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("ignores day names outside the known set", () => {
    expect(mapActiveDays(["Lunes", "Nope", "Viernes"])).toEqual([0, 4]);
    expect(mapActiveDays(["Nope"])).toEqual([]);
  });
});

describe("mapCmsPromo", () => {
  const baseData = {
    title: "Costillas",
    start_date: "2026-07-01T15:00:00.000Z",
    end_date: "2026-07-29T04:59:00.000Z",
    active_days: ["Sábado", "Domingo"],
  };

  it("maps a CMS entry to the legacy Promo type", () => {
    const promo = mapCmsPromo({
      id: "promo-costillas",
      data: {
        ...baseData,
        images: [
          {
            image: {
              src: "https://cdn.example.com/promo.webp",
              alt: "Imagen desde el medio",
            },
            alt: "Costillas BBQ",
          },
        ],
      },
    });

    expect(promo).toEqual({
      id: "promo-costillas",
      images: [
        { src: "https://cdn.example.com/promo.webp", alt: "Costillas BBQ" },
      ],
      startDate: "2026-07-01T15:00:00.000Z",
      endDate: "2026-07-29T04:59:00.000Z",
      activeDays: [5, 6],
    });
  });

  it("derives the media URL from meta.storageKey when src is absent (the file route is keyed by storage key, not media id)", () => {
    const promo = mapCmsPromo({
      id: "p",
      data: {
        ...baseData,
        images: [
          {
            image: {
              id: "media-1",
              alt: "Alt del medio",
              meta: { storageKey: "key-1.webp" },
            },
          },
        ],
      },
    });

    expect(promo.images).toEqual([
      { src: "/_emdash/api/media/file/key-1.webp", alt: "Alt del medio" },
    ]);
  });

  it("drops images without a usable media URL and falls back to empty alt", () => {
    const promo = mapCmsPromo({
      id: "p",
      data: {
        ...baseData,
        images: [
          { image: null },
          { image: { src: "https://cdn.example.com/ok.webp" } },
          "not-an-object",
        ],
      },
    });

    expect(promo.images).toEqual([
      { src: "https://cdn.example.com/ok.webp", alt: "" },
    ]);
  });

  it("omits dates when the CMS leaves them empty", () => {
    const promo = mapCmsPromo({
      id: "p",
      data: { images: [{ image: { src: "/a.webp" } }] },
    });

    expect(promo.startDate).toBeUndefined();
    expect(promo.endDate).toBeUndefined();
    expect(promo.activeDays).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});

describe("mapCmsPromos", () => {
  it("maps every entry preserving query order", () => {
    const promos = mapCmsPromos([
      { id: "a", data: { images: [{ image: { src: "/a.webp" } }] } },
      { id: "b", data: { images: [{ image: { src: "/b.webp" } }] } },
    ]);

    expect(promos.map((promo) => promo.id)).toEqual(["a", "b"]);
  });

  it("returns an empty list when there are no entries", () => {
    expect(mapCmsPromos([])).toEqual([]);
  });
});
