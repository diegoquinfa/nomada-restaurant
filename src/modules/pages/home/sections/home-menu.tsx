import { Image } from "@unpic/react";
import { useEffect, useRef, useState } from "react";
import { WhatsAppLink } from "#/modules/navigation/components/whatsapp-link";
import { cn } from "#/shared/ui/lib/utils";

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
    id: "recomendados-del-chef",
    label: "Recomendados del Chef",
    dishes: [
      {
        name: "Hamburguesa de Camarón con papas",
        description:
          "Pan brioche artesanal, disco de camarón apanado súper crujiente, ensalada coleslaw, alioli de eneldo, pepinillos agridulces y cebolla encurtida artesanal. Bañada en nuestra salsa de la casa y acompañada de papas a la francesa.",
        price: 35000,
        badge: "Nuevo", // Badge destacado
        is_coming_soon: false,
        image: "/images/dishes/recomendados-del-chef/hamburguesa-camaron.webp",
      },
      {
        name: "Costilla BBQ Roadhouse",
        description:
          "Costillas de cerdo de cocción lenta, caramelizadas con nuestra salsa BBQ artesanal de café, logrando un equilibrio perfecto entre dulzor, ahumado y especias. Acompañadas de papas a la francesa y ensalada fresca de la casa.",
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
    id: "reservas-del-chef",
    label: "Reservas del Chef",
    dishes: [
      {
        name: "Picada Gourmet de Pollo",
        description:
          "Tiernos bocados de pechuga de pollo bañados en una cremosa salsa de queso crema y eneldo, acompañados de papas en casco y chicharrón crocante. Servida con alioli de la casa, mayonesa de mango y pico de gallo fresco.",
        price: 38000,
        badge: "Nuevo",
        is_coming_soon: false, // Cambiado a false porque ya está disponible
        image: "/images/dishes/reservas-del-chef/picada-gourmet-pollo.webp",
      },
      {
        name: "Picada Gourmet de Camarón",
        description:
          "Jugosos camarones en una cremosa salsa de queso crema y eneldo, acompañados de papas en casco, chorizo y chicharrón crocante. Servida con alioli de la casa, mayonesa de mango y pico de gallo fresco.",
        price: 38000,
        badge: "Nuevo",
        is_coming_soon: false, // Cambiado a false porque ya está disponible
        image: "/images/dishes/reservas-del-chef/picada-gourmet-camaron.webp",
      },
    ],
  },
  {
    id: "pastas",
    label: "Pastas",
    dishes: [
      {
        name: "Fettuccine Queso Azul",
        description:
          "Crujiente milanesa de cerdo apanada, coronada con fettuccine en una cremosa salsa de queso azul, terminada con queso parmesano y cebolla frita crujiente.",
        price: 37000,
        badge: "Nuevo", // Le agregamos el badge de 'Nuevo'
        is_coming_soon: false,
        image: "/images/dishes/pastas/fettuccine-queso-azul.webp", // Ruta de imagen sugerida
      },
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
        name: "Pollo & Champiñones",
        description:
          "Jugosos trozos de pollo en una cremosa salsa de champiñones, acompañados de arroz salteado, cascos de papa criolla y ensalada fresca de la casa.",
        price: 23000,
        badge: "Nuevo",
        is_coming_soon: false,
        image:
          "/images/dishes/caseritos-del-chef/caserito-pollo-champinones.webp",
      },
      {
        name: "Fusión Criolla",
        description: "Pechuga en salsa teriyaki, acompañada de Arroz salteado.",
        price: 23000,
        badge: null,
        is_coming_soon: false,
        image: "/images/dishes/caseritos-del-chef/fusion-criolla.webp",
      },
      {
        name: "Perú Urbano",
        description:
          "Fajitas de res salteado, acompañado de arroz salteado, cascos de papa criolla y ensalada de la casa.",
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
    id: "entradas-y-arroces",
    label: "Arroces",
    dishes: [
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
    const visibleSections = new Map<string, number>();
    const observers = new Map<string, IntersectionObserver>();

    const observerOptions: IntersectionObserverInit = {
      rootMargin: "-100px 0px -40% 0px",
      threshold: 0,
    };

    const updateActiveId = () => {
      if (visibleSections.size === 0) return;

      let topId: string | null = null;
      let minTop = Infinity;

      visibleSections.forEach((top, id) => {
        if (top < minTop) {
          minTop = top;
          topId = id;
        }
      });

      if (topId) setActiveId(topId);
    };

    categoryIds.forEach((id) => {
      const el = document.getElementById(`cat-${id}`);
      if (!el) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.boundingClientRect.top);
          } else {
            visibleSections.delete(id);
          }
        });

        updateActiveId();
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
        <div
          className="relative aspect-4/3 overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/images/assets/bg-wood.webp)`,
          }}
        >
          <Image
            src={dish.image}
            alt={`${dish.name} — delivery gourmet Cartagena NÓMADA`}
            layout="constrained"
            width={640}
            height={480}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
      <div className="flex flex-col gap-4 md:gap-4 p-5 flex-1">
        <div className={"flex items-start justify-between flex-col"}>
          <h4 className="font-serif text-nomada-cream text-[20px] md:text-xl leading-snug text-pretty">
            {dish.name}
          </h4>
          <span
            className={cn(
              "font-serif text-nomada-gold  shrink-0",
              dish.is_coming_soon ? "text-[16px]" : "text-[20px] font-bold",
            )}
          >
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
  const tabBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabBar = tabBarRef.current;
    const activeBtn = tabBar?.querySelector<HTMLElement>(
      `[data-category="${activeId}"]`,
    );
    if (!tabBar || !activeBtn) return;

    // Calcular posición para centrar el botón dentro del contenedor
    const btnLeft = activeBtn.offsetLeft;
    const btnWidth = activeBtn.offsetWidth;
    const barWidth = tabBar.offsetWidth;

    tabBar.scrollTo({
      left: btnLeft - barWidth / 2 + btnWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-nomada-primary py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-nomada-gold/60" />
            <span
              id="menu"
              className="font-sans text-nomada-gold text-[10px] tracking-[0.4em] uppercase"
            >
              Nuestra carta
            </span>
            <div className="w-8 h-px bg-nomada-gold/60" />
          </div>
          <h2 className="font-serif text-nomada-cream text-4xl md:text-5xl font-light leading-tight">
            La carta
          </h2>
          <p className="font-sans text-nomada-cream/50 text-[12px] md:text-[13px] leading-relaxed mt-4 max-w-xl text-balance">
            Trabajamos bajo pedidos programados por franja horaria para asegurar
            calidad, frescura y tiempos precisos. Más información en nuestro
            canal de{" "}
            <WhatsAppLink className="text-nomada-gold hover:text-nomada-cream transition-colors underline underline-offset-2">
              WhatsApp
            </WhatsAppLink>
            .
          </p>
        </div>

        {/* Mobile: sticky horizontal scrollable bar */}
        <div
          ref={tabBarRef}
          className="sticky top-17.5 z-30 bg-nomada-primary/95 backdrop-blur-sm border-b border-nomada-gold/20 mb-12 -mx-6 px-6 lg:mx-0 lg:px-0 lg:hidden overflow-x-auto"
        >
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
          <aside className="hidden lg:block sticky top-25 z-30 self-start w-45 shrink-0">
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
                className="scroll-mt-5"
              >
                {/* Decorative header */}
                <div className="relative mb-8 pb-6 border-b border-nomada-gold/30">
                  <div className="absolute bottom-0 left-0 w-16 h-px bg-nomada-gold" />
                  <div className="absolute bottom-0 right-0 w-16 h-px bg-nomada-gold" />
                  <h3 className="font-serif text-nomada-gold text-3xl md:text-4xl font-light tracking-wide text-center text-balance">
                    {cat.label}
                  </h3>
                  {cat.id === "caseritos-del-chef" && (
                    <p className="font-sans text-nomada-gold/60 text-[10px] tracking-[0.3em] font-bold uppercase text-center mt-2">
                      Disponible 11:00 am - 2:00 pm
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
            Pedir domicilio por WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
