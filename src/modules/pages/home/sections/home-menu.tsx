import { WhatsAppLink } from "#/modules/navigation/components/whatsapp-link";
import { cn } from "#/shared/ui/lib/utils";
import { Image } from "@unpic/react";
import { useEffect, useState } from "react";

type Badge = "Favorito" | "Nuevo" | "Temporada" | null;

interface Dish {
  name: string;
  description: string;
  price: number | null;
  badge: Badge;
  is_coming_soon: boolean;
  image?: string;
}

interface Category {
  id: string;
  label: string;
  dishes: Dish[];
}

function formatPrice(price: number | null): string {
  if (price === null) return "";
  return `$${price.toLocaleString("es-CO")}`;
}

const categories: Category[] = [
  {
    id: "entradas-y-arroces",
    label: "Entradas y Arroces",
    dishes: [
      {
        name: "Calamar Crocante & Acevichado",
        description:
          "Anillas de calamar apanadas acompañadas de mayonesa acevichada.",
        price: 18000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/entradas/calamar-crocante-acevichado.webp",
      },
      {
        name: "Arroz Salteado Caribeño",
        description:
          "Arroz de coco frito salteado, con vegetales, chorizo argentino, chicharrón, lomo fino, y pechuga.",
        price: 37000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/arroces/arroz-salteado-caribeno.webp",
      },
    ],
  },
  {
    id: "recomendados-del-chef",
    label: "Recomendados del Chef",
    dishes: [
      {
        name: "Jalea Caribeña",
        description:
          "Mariscos apanados crocantes, mayonesa acevichada, ensalada peruana y cascos de papa criolla.",
        price: 45000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/recomendados-del-chef/jalea-caribena.webp",
      },
      {
        name: "Costilla BBQ Roadhouse",
        description:
          "Costillas St. Louis en salsa BBQ, cascos de papa criolla y ensalada de la casa.",
        price: 45000,
        badge: null,
        is_coming_soon: false,
        image:
          "/images/dishes/recomendados-del-chef/costilla-bbq-roadhouse.webp",
      },
      {
        name: "Lomo Tres Pimientas",
        description:
          "Lomo fino en costra de pimientas acompañado de papas francesa y ensalada.",
        price: 35000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/recomendados-del-chef/lomo-tres-pimientas.webp",
      },
    ],
  },
  {
    id: "pastas",
    label: "Pastas",
    dishes: [
      {
        name: "Fettuccine Huancaína & Camarones",
        description: "",
        price: 35000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/pastas/fettuccine-huancaina-camarones.webp",
      },
      {
        name: "Pasta Cremosa Ajo & Parmesano con Pollo",
        description: "",
        price: 35000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/pastas/pasta-cremosa-ajo-parmesano-pollo.webp",
      },
      {
        name: "Fettuccine Pesto & Pistacho con Lomo",
        description: "",
        price: 35000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/pastas/fettuccine-pesto-pistacho-lomo.webp",
      },
    ],
  },
  {
    id: "caseritos-del-chef",
    label: "Caseritos del Chef (Lunes a Viernes)",
    dishes: [
      {
        name: "Fusión Criolla",
        description:
          "Pechuga en salsa stroganoff, acompañada de Arroz salteado.",
        price: 23000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/caseritos-del-chef/fusion-criolla.webp",
      },
      {
        name: "Perú Urbano",
        description:
          "Lomo fino saltado, acompañado de Arroz salteado, cascos de papa criolla y ensalada de la casa.",
        price: 23000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/caseritos-del-chef/peru-urbano.webp",
      },
      {
        name: "Galeón Caribe",
        description:
          "Cubos de pescado apanado, en salsa de mango picante, acompañado de arroz salteado, patacones y ensalada de la casa.",
        price: 23000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/caseritos-del-chef/galeon-caribe.webp",
      },
    ],
  },
  {
    id: "proximamente",
    label: "Próximamente",
    dishes: [
      {
        name: "Milanesa Caribeña Cremosa",
        description:
          "Milanesa de cerdo crocante, salsa de ajo cremosa, queso provolone gratinado, papas a la francesa y ensalada.",
        price: null,
        badge: null,
        is_coming_soon: true,
      },
      {
        name: "Hamburguesa de Camarón",
        description:
          "Camarón crocante, salsa de mango picante, alioli de aguacate y eneldo, mix de lechuga, tomate asado encurtido pan brioche de orégano y papas a la francesa.",
        price: null,
        badge: null,
        is_coming_soon: true,
      },
      {
        name: "Hamburguesa Cartagenera",
        description:
          "Carne angus artesanal, chicharron crocante, queso costeño, tocineta y cebolla caramelizada en reducción de panela, salsa de la casa en pan brioche de orégano y papas a la francesa.",
        price: null,
        badge: null,
        is_coming_soon: true,
      },
    ],
  },
];

const badgeStyles: Record<NonNullable<Badge>, string> = {
  Favorito: "bg-nomada-gold text-nomada-deep",
  Nuevo: "bg-nomada-earth text-nomada-cream",
  Temporada: "border border-nomada-gold text-nomada-gold",
};

// ─── Hook: IntersectionObserver scroll tracker ─────────────────────────────

function useScrollSpy(categoryIds: string[]) {
  const [activeId, setActiveId] = useState(categoryIds[0]);

  useEffect(() => {
    const observers: Map<string, IntersectionObserver> = new Map();

    const observerOptions: IntersectionObserverInit = {
      rootMargin: "-100px 0px -40% 0px",
      threshold: 0,
    };

    categoryIds.forEach((id) => {
      const el = document.getElementById(`cat-${id}`);
      if (!el) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        });
      }, observerOptions);

      observer.observe(el);
      observers.set(id, observer);
    });

    return () => {
      observers.forEach((obs) => {
        obs.disconnect();
      });
    };
  }, [categoryIds]);

  return activeId;
}

// ─── Dish Card ─────────────────────────────────────────────────────────────

function DishCard({ dish }: { dish: Dish }) {
  return (
    <article
      className={cn(
        "group flex flex-col border border-nomada-gold/15 hover:border-nomada-gold/35 transition-colors duration-300 bg-nomada-deep/30",
        dish.is_coming_soon ? "opacity-60" : "",
      )}
    >
      {dish.image && !dish.is_coming_soon ? (
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={dish.image}
            alt={`${dish.name} — delivery gourmet Cartagena NÓMADA`}
            layout="constrained"
            width={640}
            height={480}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {dish.badge && (
            <span
              className={cn(
                `absolute top-3 left-3 font-sans text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 ${badgeStyles[dish.badge]}`,
              )}
            >
              {dish.badge}
            </span>
          )}
        </div>
      ) : (
        <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-nomada-primary to-nomada-deep flex items-center justify-center">
          <span className="font-serif text-nomada-cream/60 text-sm text-center px-4">
            {dish.name}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-serif text-nomada-cream text-[17px] leading-snug">
            {dish.name}
          </h4>
          <span className="font-serif text-nomada-gold text-[16px] shrink-0">
            {dish.is_coming_soon ? "Próximamente" : formatPrice(dish.price)}
          </span>
        </div>
        {dish.description?.trim() && (
          <p
            className="font-sans text-nomada-earth/90 text-[13px] leading-relaxed"
            style={{ color: "#c4a07a" }}
          >
            {dish.description}
          </p>
        )}
      </div>
    </article>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

export function HomeMenu() {
  const categoryIds = categories.map((c) => c.id);
  const activeId = useScrollSpy(categoryIds);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Auto-scroll the active mobile tab into view horizontally
  useEffect(() => {
    const activeTab = document.querySelector(
      `[data-category="${activeId}"]`,
    ) as HTMLElement | null;
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  return (
    <section className="bg-nomada-primary py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-nomada-gold/60" />
            <span className="font-sans text-nomada-gold text-[10px] tracking-[0.4em] uppercase">
              Nuestra carta
            </span>
            <div className="w-8 h-px bg-nomada-gold/60" />
          </div>
          <h2 className="font-serif text-nomada-cream text-4xl md:text-5xl font-light leading-tight">
            La carta
          </h2>
        </div>

        {/* Mobile: sticky horizontal scrollable bar */}
        <div className="sticky top-18 z-40 bg-nomada-primary/95 backdrop-blur-sm border-b border-nomada-gold/20 mb-12 -mx-6 px-6 lg:mx-0 lg:px-0 lg:hidden overflow-x-auto">
          <div className="flex gap-0 pb-0">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                data-category={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  `font-sans text-[11px] tracking-[0.25em] uppercase px-6 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeId === cat.id
                      ? "border-nomada-gold text-nomada-gold"
                      : "border-transparent text-nomada-cream/50 hover:text-nomada-cream/80"
                  }`,
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop + Mobile content layout */}
        <div className="flex gap-12">
          {/* Desktop sidebar (hidden on mobile) */}
          <aside className="hidden lg:block sticky top-25 self-start w-45 shrink-0">
            <nav className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={cn(
                    `text-left font-sans text-[11px] tracking-[0.2em] uppercase px-3 py-3 border-l-2 transition-all duration-200 flex items-center gap-3 ${
                      activeId === cat.id
                        ? "border-nomada-gold text-nomada-gold"
                        : "border-transparent text-nomada-cream/40 hover:text-nomada-cream/70 hover:border-nomada-gold/30"
                    }`,
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200",
                      activeId === cat.id
                        ? "bg-nomada-gold"
                        : "bg-nomada-cream/20",
                    )}
                  />
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content — stacked sections with decorative headers */}
          <div className="flex-1 space-y-24">
            {categories.map((cat) => (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                className="scroll-mt-35"
              >
                {/* Decorative header */}
                <div className="relative mb-8 pb-6 border-b border-nomada-gold/30">
                  <div className="absolute bottom-0 left-0 w-16 h-px bg-nomada-gold" />
                  <div className="absolute bottom-0 right-0 w-16 h-px bg-nomada-gold" />
                  <h3 className="font-serif text-nomada-gold text-3xl md:text-4xl font-light tracking-wide text-center">
                    {cat.label}
                  </h3>
                  {cat.id === "caseritos-del-chef" && (
                    <p className="font-sans text-nomada-gold/60 text-[10px] tracking-[0.3em] uppercase text-center mt-2">
                      Disponible 11:00 am — 2:00 pm
                    </p>
                  )}
                  {activeId === cat.id && (
                    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-nomada-gold rounded-full" />
                  )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.dishes.map((dish) => (
                    <DishCard key={dish.name} dish={dish} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <WhatsAppLink className="font-sans text-nomada-deep text-[11px] tracking-[0.25em] uppercase bg-nomada-gold px-10 py-4 hover:bg-nomada-cream transition-colors duration-300">
            Ver menú completo por WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
