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
