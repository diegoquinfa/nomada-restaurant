import { WhatsAppLink } from "#/modules/navigation/components/whatsapp-link";
import { cn } from "#/shared/ui/lib/utils";
import { Image } from "@unpic/react";
import { useState } from "react";

type Badge = "Favorito" | "Nuevo" | "Temporada" | null;

interface Dish {
  name: string;
  description: string;
  price: string;
  badge: Badge;
  image?: string;
}

interface Category {
  id: string;
  label: string;
  dishes: Dish[];
}

const categories: Category[] = [
  {
    id: "almuerzos",
    label: "Almuerzos",
    dishes: [
      {
        name: "Almuerzo ejecutivo NÓMADA",
        description:
          "Plato del día con proteína, arroz, ensalada fresca y acompañante",
        price: "$23.000",
        badge: "Favorito",
        image: "/images/dishes/almuerzo.png",
      },
      {
        name: "Almuerzo del día",
        description:
          "Opción variada que cambia diariamente — pregúntanos por la sugerencia",
        price: "$23.000",
        badge: null,
      },
      {
        name: "Almuerzo ligero",
        description:
          "Ensalada completa con proteína a elección y aderezo de la casa",
        price: "$23.000",
        badge: "Nuevo",
      },
    ],
  },
  {
    id: "arroces",
    label: "Arroces",
    dishes: [
      {
        name: "Arroz salteado caribeño",
        description:
          "Arroz salteado con vegetales, proteína fresca y toque de hierbas caribeñas",
        price: "$42.000",
        badge: null,
        image: "/images/dishes/arroz-salteado-caribeño.webp",
      },
      {
        name: "Arroz cremoso de champiñones",
        description:
          "Hongos silvestres, parmesano reggiano, aceite de trufa negra",
        price: "$38.000",
        badge: "Nuevo",
      },
      {
        name: "Arroz negro al tinto",
        description:
          "Tinta de calamar, vino tinto reducido, alioli de ajo negro, calamares salteados",
        price: "$44.000",
        badge: null,
      },
    ],
  },
  {
    id: "pastas",
    label: "Pastas",
    dishes: [
      {
        name: "Pastas con camarones",
        description:
          "Pasta salteada con camarones, ajo, aceite de oliva y toque de ají dulce",
        price: "$44.000",
        badge: null,
        image: "/images/dishes/pastas-camarones.webp",
      },
      {
        name: "Linguine ai frutti di mare",
        description:
          "Mariscos mixtos, bisque ligero de langostinos, perejil fresco, ají caribe",
        price: "$46.000",
        badge: null,
      },
      {
        name: "Cacio e Pepe fusión",
        description:
          "Spaghetti, pecorino, pimienta negra, toque de mantequilla de hierbas",
        price: "$34.000",
        badge: "Nuevo",
      },
    ],
  },
  {
    id: "mariscos",
    label: "Mariscos",
    dishes: [
      {
        name: "Jalea de mariscos",
        description:
          "Mariscos mixtos crocantes, salsa de la casa, acompañados de patacones y ensalada",
        price: "$38.000",
        badge: null,
        image: "/images/dishes/jalea-mariscos.webp",
      },
      {
        name: "Camarones al ajillo caribeño",
        description:
          "Mantequilla de ajo, ají dulce, patacones crocantes, hierbas frescas",
        price: "$44.000",
        badge: "Temporada",
      },
      {
        name: "Pulpo a la brasa",
        description:
          "Pulpo tierno, papas confitadas, pimentón ahumado, aceite de albahaca",
        price: "$52.000",
        badge: null,
      },
    ],
  },
  {
    id: "grill",
    label: "Grill",
    dishes: [
      {
        name: "Lomo a las tres pimientas",
        description:
          "Lomo de res sellado, salsa de tres pimientas, papas rústicas y vegetales salteados",
        price: "$52.000",
        badge: null,
        image: "/images/dishes/lomo-tres-pimientas.webp",
      },
      {
        name: "Pollo BBQ fusión",
        description:
          "Glaseado de tamarindo y miel, ensalada de mango verde y cilantro",
        price: "$38.000",
        badge: "Nuevo",
      },
      {
        name: "Costilla lenta de res",
        description:
          "8 horas de cocción, salsa de vino tinto reducido, puré rústico",
        price: "$62.000",
        badge: "Favorito",
      },
    ],
  },
];

const badgeStyles: Record<NonNullable<Badge>, string> = {
  Favorito: "bg-nomada-gold text-nomada-deep",
  Nuevo: "bg-nomada-earth text-nomada-cream",
  Temporada: "border border-nomada-gold text-nomada-gold",
};

export function HomeMenu() {
  const [activeCategory, setActiveCategory] = useState("almuerzos");
  const current = categories.find((c) => c?.id === activeCategory);

  return (
    <section id="menu" className="bg-nomada-primary py-24 md:py-36">
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
          <p className="font-serif italic text-nomada-cream/60 text-xl mt-3">
            Una selección pensada para sorprenderte
          </p>
        </div>

        {/* Category tabs — scrollable on mobile */}
        <div className="flex gap-0 border-b border-nomada-gold/20 mb-12 overflow-x-auto pb-0 -mx-6 px-6 md:mx-0 md:px-0 md:justify-center">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                `font-sans text-[11px] tracking-[0.25em] uppercase px-6 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "border-nomada-gold text-nomada-gold"
                    : "border-transparent text-nomada-cream/50 hover:text-nomada-cream/80"
                }`,
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dishes grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {current?.dishes.map((dish) => (
            <article
              key={dish.name}
              className="group flex flex-col border border-nomada-gold/15 hover:border-nomada-gold/35 transition-colors duration-300 bg-nomada-deep/30"
            >
              {/* Image con aspect-ratio fijo para que midan todas igual */}
              {dish.image ? (
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={`${dish.name} — delivery gourmet Cartagena NÓMADA`}
                    layout="fullWidth"
                    className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
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
                dish.badge && (
                  <div className="px-5 pt-5">
                    <span
                      className={cn(
                        `inline-block font-sans text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 ${badgeStyles[dish.badge]}`,
                      )}
                    >
                      {dish.badge}
                    </span>
                  </div>
                )
              )}

              {/* Info */}
              <div className="flex flex-col gap-2 p-5 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-nomada-cream text-[17px] leading-snug">
                    {dish.name}
                  </h3>
                  <span className="font-serif text-nomada-gold text-[16px] shrink-0">
                    {dish.price}
                  </span>
                </div>
                <p
                  className="font-sans text-nomada-earth/90 text-[13px] leading-relaxed"
                  style={{ color: "#c4a07a" }}
                >
                  {dish.description}
                </p>
              </div>
            </article>
          ))}
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
