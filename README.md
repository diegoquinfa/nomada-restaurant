# NÓMADA Cocina Fusión

[![React Doctor](https://www.react.doctor/share/badge?p=web_nomada&s=100&w=0&f=0)](https://www.react.doctor/share?p=web_nomada&s=100&w=0&f=0)

Official landing page for **NÓMADA Fusión Cocina**, a gourmet ghost kitchen delivery brand based in Cartagena de Indias, Colombia.

NÓMADA was created with the idea of transforming food delivery into an experience through bold flavors, fusion cuisine, and a brand identity inspired by travel, exploration, and handcrafted detail.

---

## About the Project

NÓMADA is a culinary brand focused on:

- Fusion cuisine
- Gourmet delivery
- Elevated at-home dining experiences
- Careful presentation and attention to detail in every order

The brand has a warm, close, and passionate personality, moving away from the feel of a traditional corporate restaurant.

---

## Landing Page Goals

This website aims to:

- Present the brand identity
- Showcase the menu and main categories
- Make ordering through WhatsApp easy
- Display opening hours and delivery coverage
- Improve local SEO visibility in Cartagena

---

## Main Sections

- Main hero section
- About NÓMADA
- Value proposition
- Menu
- How to order
- Opening hours and coverage
- Contact and social media

---

## Project Architecture

Astro 6 + [EmDash CMS](https://docs.emdashcms.com) 1.2.0 on Cloudflare Workers (D1 for content, R2 for media).
All site content lives in the CMS; the code only renders it.

```txt
seed/seed.json            Initial content model + content (generated, do not edit by hand)
scripts/                  build-seed.mjs + seed/model.mjs (the model: block types, collections, menus)
src/pages/                index.astro (home = the "home" page entry), 404.astro
src/components/blocks/    One renderer per CMS block type (map in blocks/index.ts)
src/components/Chrome.astro   Navbar, footer, WhatsApp button, promo popup
src/modules/              Interactive React islands (menu, seasonal banner, promos, navigation)
src/lib/                  site.ts (server data loading), media.ts (client-safe helpers)
```

### Commands

```bash
pnpm dev            # http://localhost:3000, admin at /_emdash/admin
pnpm build
pnpm check          # biome
pnpm astro check    # types
pnpm test
pnpm seed:build     # regenerate seed/seed.json from scripts/
pnpm seed:validate
```

Local setup: open `/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin` once to skip passkey setup in dev and load the seed content.

### Gotchas

- Never import `src/lib/site.ts` from a React island (it pulls server-only `emdash` into the client bundle). Use `src/lib/media.ts`.
- The seed only runs on the first request of an empty database. After that, change the model from the admin (Content Types) or `emdash schema`.
- `PUBLIC_POSTHOG_*` variables are read at build time.

---

## Editing content (for non-developers)

Sign in at `/_emdash/admin`.

| I want to… | Go to |
| --- | --- |
| Change a price, description or photo | **Platos** → open the dish |
| Hide a dish without deleting it | **Platos** → set it to *Draft* (back to *Published* to show it) |
| Add a dish | **Platos** → New, then pick its category |
| Run a promo on certain days | **Promociones** → set images, dates and active days, then Publish |
| Update the monthly seasonal dish | **Plato de temporada** |
| Change opening hours, texts or reorder sections | **Páginas** → Inicio → *Secciones de la página* |
| Change the WhatsApp number or Instagram | **Datos del sitio** |
| Edit the menu links | **Menús** |
