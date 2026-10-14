// Builds seed/seed.json from the static model plus content extracted from the legacy TSX sources.
// Usage: node scripts/build-seed.mjs [--media-base=https://nomadarestaurantectg.com]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename } from "node:path";
import ts from "typescript";
import { DAYS, blockTypes, collections, menus, taxonomies } from "./seed/model.mjs";

const mediaBase = (process.argv.find((a) => a.startsWith("--media-base="))?.split("=")[1] ?? "https://nomadarestaurantectg.com").replace(/\/$/, "");

const media = (path, alt) => ({ $media: { url: `${mediaBase}${path}`, filename: basename(path), alt } });

/** Evaluates an exported-style array literal found in a TS/TSX source, between two line anchors. */
async function extractArray(file, startPattern) {
  const src = readFileSync(file, "utf8");
  const start = src.search(startPattern);
  if (start < 0) throw new Error(`Pattern ${startPattern} not found in ${file}`);
  const end = src.indexOf("\n];", start) + 3;
  const literal = src.slice(start, end).replace(startPattern, "export default [");
  const { outputText } = ts.transpileModule(literal, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  return mod.default;
}

const menuFile = "src/modules/pages/home/sections/home-menu.tsx";
const categories = await extractArray(menuFile, /const categories: Category\[\] = \[/);
const promos = await extractArray("src/modules/promo/promos.config.ts", /export const promos: Promo\[\] = \[/);

// --- dishes ---------------------------------------------------------------
const dishes = [];
for (const cat of categories) {
  cat.dishes.forEach((d, i) => {
    const data = { title: d.name, description: d.description, sort_order: (i + 1) * 10, coming_soon: d.is_coming_soon };
    if (d.price !== null) data.price = d.price;
    if (d.badge) data.badge = d.badge;
    if (d.image) data.image = media(d.image, d.name);
    dishes.push({
      id: `dish-${cat.id}-${i + 1}`,
      slug: undefined,
      status: d.is_hidden ? "draft" : "published",
      data,
      taxonomies: { menu_category: [cat.id] },
    });
  });
}
const terms = categories.map((c) => ({ slug: c.id, label: c.label }));

// --- promos ---------------------------------------------------------------
const now = Date.now();
const promoEntries = promos.map((p) => ({
  id: `promo-${p.id}`,
  status: p.endDate && Date.parse(p.endDate) < now ? "draft" : "published",
  data: {
    title: p.id,
    images: p.images.map((i) => ({ image: media(i.src, i.alt), alt: i.alt })),
    ...(p.startDate && { start_date: p.startDate }),
    ...(p.endDate && { end_date: p.endDate }),
    active_days: p.activeDays.map((n) => DAYS[n]),
  },
}));

// --- home page blocks -----------------------------------------------------
const b = (type, key, data) => ({ _type: type, _version: 1, _key: key, ...data });
const layout = [
  b("hero", "home-hero", {
    eyebrow: "Cartagena de Indias",
    background: media("/images/assets/hero-bg.webp", "Plato gourmet delivery NÓMADA — Cocina Fusión Cartagena"),
    logo: media("/images/logo.webp", "NÓMADA Cocina Fusión"),
    headline: "Bienvenidos a la experiencia NÓMADA",
    subheadline: "Un restaurante cocina oculta creado para transformar el delivery en una experiencia gourmet en Cartagena",
    primary_cta: "Pedir ahora",
    secondary_cta: "Ver menú",
    highlights: ["Entradas y Arroces", "Recomendados del Chef", "Pastas", "Caseritos del Chef"].map((name) => ({ name })),
  }),
  b("seasonal_strip", "home-seasonal", { show_top_bar: true }),
  b("about", "home-about", {
    eyebrow: "Nuestra historia",
    image: media("/images/assets/banner-about.webp", "Cocina artesanal NÓMADA — preparación gourmet en Cartagena"),
    badge: "Cocina oculta · Cartagena",
    heading_line1: "Un sueño hecho",
    heading_line2: "con el corazón",
    paragraph_intro: "Después de meses de ideas, pruebas, esfuerzo y muchísima pasión por la cocina… nace NÓMADA.",
    paragraph_highlight:
      "Una cocina oculta creada para transformar el delivery en una experiencia: sabores intensos, cocina fusión y detalles pensados para disfrutarse desde casa.",
    paragraph_outro: "Este es apenas el comienzo de algo que soñamos construir con el corazón.",
    stats: [
      { value: "100%", label: "Artesanal" },
      { value: "4", label: "Cocinas fusión" },
      { value: "CTG", label: "Solo Cartagena" },
    ],
  }),
  b("menu_section", "home-menu", {
    eyebrow: "Nuestra carta",
    heading: "La carta",
    intro:
      "Trabajamos bajo pedidos programados por franja horaria para asegurar calidad, frescura y tiempos precisos. Más información en nuestro canal de WhatsApp.",
  }),
  b("how_to_order", "home-how-to-order", {
    eyebrow: "Es muy sencillo",
    heading: "Cómo hacer tu pedido",
    steps: [
      {
        title: "Explora el menú",
        description:
          "Navega por nuestras categorías y elige los platos que más te llamen. Entradas y Arroces, Recomendados del Chef, Pastas, Caseritos del Chef y más.",
        icon: "menu",
      },
      {
        title: "Escríbenos por WhatsApp",
        description: "Mándanos un mensaje con tu pedido, dirección de entrega y hora preferida. Respondemos de inmediato.",
        icon: "chat",
      },
      {
        title: "Recibe en casa",
        description: "Tu pedido es una experiencia única, empacado con cuidado para que cada plato llegue perfecto.",
        icon: "home",
      },
    ],
    notice:
      "Trabajamos bajo pedidos programados por franja horaria para asegurar calidad, frescura y tiempos precisos, más información en nuestro canal de WhatsApp.",
  }),
  b("schedule", "home-schedule", {
    eyebrow: "Disponibilidad",
    heading: "Horarios de atención",
    hours_title: "Horario de atención",
    rows: [{ days: "Lunes – Sábado", hours: "11:00 am – 3:00 pm", note: "Horario único" }],
    footnote: "* Los pedidos se reciben hasta 30 minutos antes del cierre. Delivery a domicilio en toda Cartagena.",
    coverage_title: "Zona de cobertura",
    coverage: [{ name: "Toda Cartagena" }],
  }),
  b("contact", "home-contact", {
    eyebrow: "Hablemos",
    heading: "Contacto",
    intro: "Pedidos, consultas, pedidos especiales. Escríbenos cuando quieras - estamos aquí.",
    whatsapp_hint: "Pedidos y consultas",
    instagram_hint: "Fotos, novedades y más",
  }),
];

const seed = {
  $schema: "https://emdashcms.com/seed.schema.json",
  version: "1",
  defaultLocale: "es",
  meta: { name: "Nómada Cocina Fusión", description: "Sitio del restaurante Nómada, Cartagena", author: "Nómada" },
  settings: { title: "NÓMADA Cocina Fusión", tagline: "Delivery gourmet en Cartagena", url: "https://nomadarestaurantectg.com" },
  blockTypes,
  collections,
  taxonomies: taxonomies.map((t) => ({ ...t, terms })),
  menus,
  content: {
    pages: [{ id: "page-home", slug: "home", status: "published", data: { title: "Inicio", layout } }],
    dishes,
    promos: promoEntries,
    seasonal: [
      {
        id: "seasonal-current",
        status: "published",
        data: {
          title: "Plato de Temporada",
          status_label: "Muy pronto",
          eyebrow: "Edición mensual",
          bar_message: "PLATO DE TEMPORADA — una creación exclusiva que cambia cada 30 días",
          body: "Una creación exclusiva que cambia cada mes para sorprenderte con lo mejor de la despensa y nuevas exploraciones culinarias. Cada 30 días renovamos la receta con ingredientes de temporada y combinaciones inesperadas, disponibles solo por tiempo limitado. Espéralo",
          highlight: "Cada 30 días",
          signoff: "Espéralo",
        },
      },
    ],
    site_info: [
      {
        id: "site-info-main",
        status: "published",
        data: {
          title: "NÓMADA Cocina Fusión",
          whatsapp_number: "573242503301",
          whatsapp_message: "Hola, quiero vivir la experiencia NÓMADA 🌎",
          instagram_handle: "nomadarestaurante",
          location: "Cartagena de Indias, Colombia",
          legal_name: "NÓMADA",
        },
      },
    ],
  },
};

mkdirSync("seed", { recursive: true });
writeFileSync("seed/seed.json", `${JSON.stringify(seed, null, 2)}\n`);
console.log(`seed/seed.json: ${dishes.length} dishes (${dishes.filter((d) => d.status === "draft").length} draft), ${categories.length} categories, ${promoEntries.length} promos, ${layout.length} blocks`);
