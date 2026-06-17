import { createFileRoute } from "@tanstack/react-router";
import { WhatsAppFAB } from "#/modules/navigation/components/whatsapp-link";
import { HomeAbout } from "#/modules/pages/home/sections/home-about";
import { HomeContact } from "#/modules/pages/home/sections/home-contact";
import { HomeHero } from "#/modules/pages/home/sections/home-hero";
import { HomeHowToOrder } from "#/modules/pages/home/sections/home-how-to-order";
import { HomeMenu } from "#/modules/pages/home/sections/home-menu";
import { HomeSchedule } from "#/modules/pages/home/sections/home-shedule";
import { PromoPopup } from "#/modules/promo/components/promo-popup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "NÓMADA Cocina Fusión — Almuerzos desde $23.000, arroces y pastas. Delivery gourmet con sabores fusión. Cocina oculta, Cartagena. Pide por WhatsApp.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <HomeHero />
      <HomeAbout />
      <HomeMenu />
      <HomeHowToOrder />
      <HomeSchedule />
      <HomeContact />
      <WhatsAppFAB />
      <PromoPopup />
    </main>
  );
}
