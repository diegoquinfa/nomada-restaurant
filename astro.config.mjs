import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { nomadaEmail } from "./src/plugins/nomada-email.ts";

const SITE_URL = "https://nomadarestaurantectg.com";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: SITE_URL,
  redirects: { "/home": "/" },
  // Single locale; default routing (no prefix) is required by the EmDash admin.
  i18n: { defaultLocale: "es", locales: ["es"] },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      admin: {
        locales: ["es-419"],
        siteName: "NÓMADA",
        logo: "/images/logo.webp",
        footerLabel: false,
      },
      plugins: [
        nomadaEmail({
          from: { email: "cms@nomadarestaurantectg.com", name: "NÓMADA" },
          brand: {
            siteName: "NÓMADA",
            siteUrl: SITE_URL,
            logoUrl: `${SITE_URL}/images/email-logo.png`,
            location: "Cartagena de Indias, Colombia",
          },
        }),
      ],
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
