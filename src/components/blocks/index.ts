import About from "./About.astro";
import Contact from "./Contact.astro";
import Hero from "./Hero.astro";
import HowToOrder from "./HowToOrder.astro";
import MenuSection from "./MenuSection.astro";
import Schedule from "./Schedule.astro";
import SeasonalStrip from "./SeasonalStrip.astro";

/** One renderer per block type defined in seed/scripts/seed/model.mjs. */
export const blockComponents = {
  hero: Hero,
  about: About,
  menu_section: MenuSection,
  seasonal_strip: SeasonalStrip,
  how_to_order: HowToOrder,
  schedule: Schedule,
  contact: Contact,
};
