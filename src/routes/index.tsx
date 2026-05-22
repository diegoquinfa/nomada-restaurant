import { WhatsAppFAB } from "#/modules/navigation/components/whatsapp-link";
import { HomeAbout } from "#/modules/pages/home/sections/home-about";
import { HomeContact } from "#/modules/pages/home/sections/home-contact";
import { HomeHero } from "#/modules/pages/home/sections/home-hero";
import { HomeHowToOrder } from "#/modules/pages/home/sections/home-how-to-order";
import { HomeMenu } from "#/modules/pages/home/sections/home-menu";
import { HomeSchedule } from "#/modules/pages/home/sections/home-shedule";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

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
    </main>
  );
}
