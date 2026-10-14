import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { cloudflareEmail } from "@emdash-cms/cloudflare/plugins";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: "https://nomadarestaurantectg.com",
  redirects: { "/home": "/" },
  // Single locale; default routing (no prefix) is required by the EmDash admin.
  i18n: { defaultLocale: "es", locales: ["es"] },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      admin: { locales: ["es-419"] },
      plugins: [
        cloudflareEmail({
          from: { email: "cms@nomadarestaurantectg.com", name: "NÓMADA" },
        }),
      ],
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
