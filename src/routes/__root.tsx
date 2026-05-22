import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";
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
      { rel: "stylesheet", href: appCss },
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
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
});

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
