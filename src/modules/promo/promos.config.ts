export type PromoImage = {
  src: string;
  alt: string;
};

export type Promo = {
  id: string;
  images: PromoImage[];
  /** ISO 8601 with explicit offset, e.g. "2026-07-01T10:00-05:00" (Colombia). Optional. */
  startDate?: string;
  /** Inclusive end instant in Colombia time. Optional. */
  endDate?: string;
  /** Days of the week in Colombia time. 0 = Monday, 6 = Sunday. */
  activeDays: number[];
};

export const promos: Promo[] = [
  {
    id: "menu-domingo",
    images: [
      {
        src: "/images/promo/promo-domingos.webp",
        alt: "Menu del Domingo",
      },
    ],
    activeDays: [6], // Sunday only
  },
  {
    id: "mundialista",
    images: [
      {
        src: "/images/promo/promo-0002.webp",
        alt: "Hamburguesa de camarón llena de sabores inolvidables",
      },
    ],
    startDate: "2026-07-01T10:00-05:00",
    endDate: "2026-07-12T23:59-05:00",
    activeDays: [0, 1, 2, 3, 4, 5, 6], // Sunday only
  },
];
