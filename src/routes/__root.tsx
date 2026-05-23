import "../styles.css";
import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import { Navbar } from "#/modules/navigation/components/navbar";
import { Footer } from "#/modules/navigation/components/footer";

const SITE_URL = process.env.SITE_URL ?? "https://nomadacartagena.com";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NÓMADA Cocina Fusión | Delivery Gourmet en Cartagena" },
      { name: "robots", content: "index, follow" },
      { name: "og:type", content: "website" },
      { name: "og:locale", content: "es_CO" },
      { name: "og:site_name", content: "NÓMADA Cocina Fusión" },
      {
        name: "og:title",
        content: "NÓMADA Cocina Fusión — Delivery Gourmet en Cartagena",
      },
      {
        name: "og:description",
        content:
          "Cocina oculta fusión en Cartagena. Platos artesanales, almuerzos desde $23.000. Pedí por WhatsApp.",
      },
      { name: "og:image", content: `${SITE_URL}/images/open_graph.webp` },
      { name: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "NÓMADA Cocina Fusión — Delivery Gourmet en Cartagena",
      },
      {
        name: "twitter:description",
        content:
          "Cocina oculta fusión en Cartagena. Platos artesanales, almuerzos desde $23.000.",
      },
      { name: "twitter:image", content: `${SITE_URL}/images/open_graph.webp` },
    ],
    links: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "canonical", href: SITE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "NÓMADA Cocina Fusión",
          description:
            "Cocina fusión gourmet en Cartagena. Platos artesanales para delivery.",
          url: SITE_URL,
          image: `${SITE_URL}/images/open_graph.webp`,
          servesCuisine: "Fusión",
          priceRange: "$",
          telephone: "+57-324-250-3301",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Cartagena",
            addressCountry: "CO",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 10.391,
            longitude: -75.514,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: "11:00",
              closes: "14:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: "18:00",
              closes: "22:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Friday", "Saturday", "Sunday"],
              opens: "11:00",
              closes: "22:00",
            },
          ],
          sameAs: ["https://www.instagram.com/nomadarestaurante"],
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <section className="bg-nomada-primary min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-6">
      <span className="font-serif text-nomada-gold text-8xl md:text-9xl font-light leading-none">
        404
      </span>
      <div className="w-10 h-px bg-nomada-gold/40 my-6" />
      <h1 className="font-serif text-nomada-cream text-2xl md:text-3xl font-light leading-relaxed">
        Página no encontrada
      </h1>
      <p className="font-sans text-nomada-cream/50 text-sm md:text-base leading-relaxed mt-3 max-w-md">
        Esta página no existe o fue movida. Mejor volvé al inicio y buscá desde ahí.
      </p>
      <Link
        to="/"
        className="mt-10 font-sans text-nomada-deep text-[11px] tracking-[0.25em] uppercase bg-nomada-gold px-10 py-4 hover:bg-nomada-cream transition-colors duration-300"
      >
        Volver al inicio
      </Link>
    </section>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <head>
        <HeadContent />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
