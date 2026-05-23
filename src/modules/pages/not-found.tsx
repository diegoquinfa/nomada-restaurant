import { Link } from "@tanstack/react-router";

export function NotFound() {
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
        Esta página no existe o fue movida. Mejor volvé al inicio y buscá desde
        ahí.
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
