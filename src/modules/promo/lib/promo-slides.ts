import type { Promo, PromoImage } from "#/modules/promo/types.ts";

export type PromoSlide = {
  promoId: string;
  image: PromoImage;
};

/**
 * Flattens the images of every active promo into a single ordered slide
 * list. Order follows each promo's position in the input array, and
 * each slide retains its source promo id for dismiss-all bookkeeping.
 */
export function aggregatePromoSlides(promos: Promo[]): PromoSlide[] {
  return promos.flatMap((promo) =>
    promo.images.map((image) => ({ promoId: promo.id, image })),
  );
}
