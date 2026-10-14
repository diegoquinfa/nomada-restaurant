import { type MediaValue, mediaUrl } from "#/lib/media.ts";
import type { Promo, PromoImage } from "#/modules/promo/types.ts";

/** Spanish day names as stored in the CMS `active_days` multiSelect. */
const DAY_INDEX: Record<string, number> = {
  Lunes: 0,
  Martes: 1,
  Miércoles: 2,
  Jueves: 3,
  Viernes: 4,
  Sábado: 5,
  Domingo: 6,
};

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

/** CMS entry shape (subset) needed to map a promo to the legacy type. */
export type CmsPromoEntry = {
  id: string;
  data: Record<string, unknown>;
};

/**
 * Converts the CMS `active_days` value to legacy day indexes
 * (0 = Monday … 6 = Sunday). An absent or empty list means every day.
 */
export function mapActiveDays(raw: unknown): number[] {
  if (!Array.isArray(raw) || raw.length === 0) return [...EVERY_DAY];

  return raw
    .map((value) => (typeof value === "string" ? DAY_INDEX[value] : undefined))
    .filter((day): day is number => day !== undefined);
}

/** Maps a CMS promo entry to the legacy `Promo` type. */
export function mapCmsPromo(entry: CmsPromoEntry): Promo {
  const data = entry.data;
  const rawImages = Array.isArray(data.images) ? data.images : [];

  const images: PromoImage[] = rawImages.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const image = record.image as MediaValue | null | undefined;
    const src = mediaUrl(image);
    if (!src) return [];

    const alt =
      typeof record.alt === "string" && record.alt
        ? record.alt
        : (image?.alt ?? "");

    return [{ src, alt }];
  });

  const promo: Promo = {
    id: entry.id,
    images,
    activeDays: mapActiveDays(data.active_days),
  };

  if (typeof data.start_date === "string" && data.start_date) {
    promo.startDate = data.start_date;
  }
  if (typeof data.end_date === "string" && data.end_date) {
    promo.endDate = data.end_date;
  }

  return promo;
}

/** Maps every published CMS promo entry, preserving the query order. */
export function mapCmsPromos(entries: readonly CmsPromoEntry[]): Promo[] {
  return entries.map(mapCmsPromo);
}
