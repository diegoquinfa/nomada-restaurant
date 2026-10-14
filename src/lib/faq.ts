type Row = {
  days?: string | null;
  hours?: string | null;
  note?: string | null;
};
type LayoutBlock = { _type: string };

/** FAQPage structured data whose schedule answers come from the CMS schedule block. */
export function buildFaqJsonLd(layout: readonly LayoutBlock[] | undefined) {
  const schedule = layout?.find((b) => b._type === "schedule") as
    | Record<string, unknown>
    | undefined;
  const rows = ((schedule?.rows as Row[] | undefined) ?? []).filter(
    (r) => r.days && r.hours,
  );
  const footnote =
    typeof schedule?.footnote === "string"
      ? schedule.footnote.replace(/^\*\s*/, "")
      : "";
  const hours = rows
    .map((r) => `${r.days}: ${r.hours}${r.note ? ` (${r.note})` : ""}`)
    .join("; ");

  const question = (name: string, text: string) => ({
    "@type": "Question",
    name,
    acceptedAnswer: { "@type": "Answer", text },
  });

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      question(
        "¿Cómo hago un pedido en NÓMADA?",
        "Explora nuestro menú, escríbenos por WhatsApp con tu pedido y dirección de entrega, y recibe en casa. Respondemos de inmediato.",
      ),
      ...(hours
        ? [question("¿Cuál es el horario de atención?", `${hours}.`)]
        : []),
      question(
        "¿Hacen delivery en Cartagena?",
        `${footnote || "Ofrecemos delivery a domicilio en toda Cartagena."} Trabajamos bajo pedido con antelación — consúltanos por WhatsApp.`,
      ),
    ],
  };
}
