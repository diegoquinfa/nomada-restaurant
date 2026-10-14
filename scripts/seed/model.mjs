// Static EmDash content model for Nómada. Labels are Spanish because editors are Spanish speakers.

const s = (slug, label, extra = {}) => ({ slug, label, type: "string", ...extra });
const t = (slug, label, extra = {}) => ({ slug, label, type: "text", ...extra });
const img = (slug, label, extra = {}) => ({ slug, label, type: "image", ...extra });
const rep = (slug, label, subFields, extra = {}) => ({
  slug,
  label,
  type: "repeater",
  validation: { subFields, ...extra },
});

const block = (slug, label, fields) => ({
  slug,
  label,
  category: "Secciones",
  currentVersion: 1,
  versions: [{ version: 1, fields }],
});

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const blockTypes = [
  block("hero", "Portada", [
    s("eyebrow", "Texto superior", { required: true }),
    img("background", "Imagen de fondo"),
    img("logo", "Logo"),
    s("headline", "Título", { required: true }),
    t("subheadline", "Subtítulo"),
    s("primary_cta", "Botón principal (abre WhatsApp)"),
    s("secondary_cta", "Botón secundario (baja al menú)"),
    rep("highlights", "Categorías destacadas", [s("name", "Nombre", { required: true })], { maxItems: 8 }),
  ]),
  block("about", "Nosotros", [
    s("eyebrow", "Texto superior"),
    img("image", "Imagen"),
    s("badge", "Etiqueta sobre la imagen"),
    s("heading_line1", "Título (línea 1)"),
    s("heading_line2", "Título (línea 2, en cursiva)"),
    t("paragraph_intro", "Párrafo 1"),
    t("paragraph_highlight", "Párrafo 2 (destacado)"),
    t("paragraph_outro", "Párrafo 3"),
    rep(
      "stats",
      "Cifras",
      [s("value", "Valor", { required: true }), s("label", "Etiqueta", { required: true })],
      { maxItems: 4 },
    ),
  ]),
  block("menu_section", "Carta (platos)", [
    s("eyebrow", "Texto superior"),
    s("heading", "Título", { required: true }),
    t("intro", "Texto introductorio"),
  ]),
  block("seasonal_strip", "Plato de temporada", [
    { slug: "show_top_bar", label: "Mostrar barra dorada al bajar", type: "boolean", defaultValue: true },
  ]),
  block("how_to_order", "Cómo pedir", [
    s("eyebrow", "Texto superior"),
    s("heading", "Título", { required: true }),
    rep(
      "steps",
      "Pasos",
      [
        s("title", "Título", { required: true }),
        t("description", "Descripción", { required: true }),
        {
          slug: "icon",
          label: "Icono",
          type: "select",
          options: ["menu", "chat", "home"],
        },
      ],
      { minItems: 1, maxItems: 6 },
    ),
    t("notice", "Aviso final (la palabra WhatsApp se enlaza sola)"),
  ]),
  block("schedule", "Horarios", [
    s("eyebrow", "Texto superior"),
    s("heading", "Título", { required: true }),
    s("hours_title", "Subtítulo de horarios"),
    rep(
      "rows",
      "Horarios",
      [
        s("days", "Días", { required: true }),
        s("hours", "Horas", { required: true }),
        s("note", "Nota"),
      ],
      { minItems: 1, maxItems: 7 },
    ),
    t("footnote", "Nota al pie"),
    s("coverage_title", "Subtítulo de cobertura"),
    rep("coverage", "Zonas de cobertura", [s("name", "Zona", { required: true })], { maxItems: 12 }),
  ]),
  block("contact", "Contacto", [
    s("eyebrow", "Texto superior"),
    s("heading", "Título", { required: true }),
    t("intro", "Texto introductorio"),
    s("whatsapp_hint", "Texto bajo el número de WhatsApp"),
    s("instagram_hint", "Texto bajo el usuario de Instagram"),
  ]),
];

export const collections = [
  {
    slug: "pages",
    label: "Páginas",
    labelSingular: "Página",
    icon: "layout",
    supports: ["drafts", "revisions", "preview", "seo"],
    urlPattern: "/{slug}",
    fields: [
      s("title", "Título interno", { required: true }),
      {
        slug: "layout",
        label: "Secciones de la página",
        type: "blocks",
        validation: {
          allowedTypes: ["hero", "seasonal_strip", "about", "menu_section", "how_to_order", "schedule", "contact"],
          maxItems: 30,
        },
      },
    ],
  },
  {
    slug: "dishes",
    label: "Platos",
    labelSingular: "Plato",
    icon: "fork-knife",
    routable: false,
    supports: ["drafts"],
    titleField: "title",
    admin: { listColumns: ["price", "badge", "coming_soon"] },
    fields: [
      s("title", "Nombre", { required: true, searchable: true }),
      t("description", "Descripción"),
      { slug: "price", label: "Precio (COP)", type: "integer" },
      // The admin select has no empty choice, so "no label" must be an explicit option (the site ignores it).
      {
        slug: "badge",
        label: "Etiqueta",
        type: "select",
        defaultValue: "Sin etiqueta",
        validation: { options: ["Sin etiqueta", "Favorito", "Nuevo", "Temporada"] },
      },
      { slug: "coming_soon", label: "Muy pronto (sin precio)", type: "boolean", defaultValue: false },
      img("image", "Foto"),
      { slug: "sort_order", label: "Orden dentro de su categoría", type: "integer", indexed: true },
    ],
  },
  {
    slug: "promos",
    label: "Promociones",
    labelSingular: "Promoción",
    icon: "megaphone",
    routable: false,
    supports: ["drafts"],
    titleField: "title",
    admin: { listColumns: ["start_date", "end_date"] },
    fields: [
      s("title", "Nombre interno", { required: true }),
      rep("images", "Imágenes (cada una es una historia)", [img("image", "Imagen", { required: true }), s("alt", "Texto alternativo")], {
        minItems: 1,
        maxItems: 8,
      }),
      { slug: "start_date", label: "Empieza (hora Colombia)", type: "datetime" },
      { slug: "end_date", label: "Termina (hora Colombia)", type: "datetime" },
      { slug: "active_days", label: "Días activos (vacío = todos)", type: "multiSelect", validation: { options: DAYS } },
    ],
  },
  {
    slug: "seasonal",
    label: "Plato de temporada",
    labelSingular: "Plato de temporada",
    icon: "star",
    routable: false,
    supports: ["drafts"],
    titleField: "title",
    fields: [
      s("title", "Título", { required: true }),
      s("status_label", "Estado (ej. Muy pronto)"),
      s("eyebrow", "Texto superior"),
      s("bar_message", "Mensaje de la barra dorada"),
      t("body", "Texto"),
      s("highlight", "Frase a resaltar en dorado (debe aparecer en el texto)"),
      s("signoff", "Cierre en cursiva"),
    ],
  },
  {
    slug: "site_info",
    label: "Datos del sitio",
    labelSingular: "Datos del sitio",
    icon: "storefront",
    routable: false,
    supports: [],
    fields: [
      s("title", "Nombre", { required: true }),
      s("whatsapp_number", "WhatsApp (solo dígitos, con código de país)", { required: true }),
      s("whatsapp_message", "Mensaje inicial de WhatsApp"),
      s("instagram_handle", "Usuario de Instagram (sin @)"),
      s("location", "Ubicación"),
      s("legal_name", "Nombre en el pie de página"),
    ],
  },
];

export const taxonomies = [
  {
    name: "menu_category",
    label: "Categorías de la carta",
    labelSingular: "Categoría",
    hierarchical: false,
    collections: ["dishes"],
  },
];

export const menus = [
  {
    name: "primary",
    label: "Navegación principal",
    items: [
      ["Nosotros", "/#nosotros"],
      ["Menú", "/#menu"],
      ["Cómo pedir", "/#como-pedir"],
      ["Horarios", "/#horarios"],
      ["Contacto", "/#contacto"],
    ].map(([label, url]) => ({ type: "custom", label, url })),
  },
  {
    name: "footer",
    label: "Pie de página",
    items: [
      ["Nosotros", "/#nosotros"],
      ["Menú", "/#menu"],
      ["Cómo pedir", "/#como-pedir"],
      ["Horarios", "/#horarios"],
    ].map(([label, url]) => ({ type: "custom", label, url })),
  },
];
