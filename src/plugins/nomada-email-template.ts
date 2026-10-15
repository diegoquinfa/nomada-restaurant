/**
 * NÓMADA email template.
 *
 * Pure module (no runtime imports) so it can be rendered and previewed
 * outside the Worker. EmDash system emails (sign-in, invite, signup
 * verification, settings test) arrive with English copy and a light-theme
 * HTML body. The incoming `html` is always discarded: every message is
 * recomposed from its plain-text body into the NÓMADA layout.
 */

export interface EmailMessageInput {
  to: string;
  cc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailBrand {
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  location: string;
}

export type EmailKind = "sign-in" | "invite" | "signup" | "test" | "other";

/** Brand palette (src/styles.css). Hex only: email clients ignore CSS variables. */
const COLORS = {
  page: "#2a3a2d",
  card: "#3e4a36",
  border: "#76703f",
  gold: "#c9a84c",
  cream: "#f0e8d5",
  muted: "#c5bfb0",
  deep: "#2a3a2d",
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const URL_PATTERN = /https?:\/\/[^\s<>"]+/;
const URL_PATTERN_GLOBAL = /https?:\/\/[^\s<>"]+/g;
const EXPIRY_PATTERN =
  /(\d+)\s*(minutes?|minutos?|hours?|horas?|days?|d[ií]as?)/i;

/** Classify by link path, not by copy: EmDash copy may be English or localized. */
export function classifyEmail(message: EmailMessageInput): EmailKind {
  const link = findLink(message.text);
  if (link) {
    const path = safePathname(link);
    if (path.endsWith("/auth/magic-link/verify")) return "sign-in";
    if (path.endsWith("/admin/invite/accept")) return "invite";
    if (path.endsWith("/admin/signup")) return "signup";
  }
  if (/^test email/i.test(message.subject)) return "test";
  return "other";
}

export function findLink(text: string): string | undefined {
  return text.match(URL_PATTERN)?.[0];
}

/** Read the expiry from the original body so it never drifts from EmDash. */
export function extractExpiry(text: string): string | undefined {
  const match = text.match(EXPIRY_PATTERN);
  if (!match) return undefined;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const plural = amount !== 1;
  if (unit.startsWith("min"))
    return `${amount} ${plural ? "minutos" : "minuto"}`;
  if (unit.startsWith("h")) return `${amount} ${plural ? "horas" : "hora"}`;
  return `${amount} ${plural ? "días" : "día"}`;
}

interface Copy {
  subject: string;
  preheader: string;
  heading: string;
  intro: string;
  button?: string;
  link?: string;
  expiry?: string;
  ignoreNote?: string;
  paragraphs?: string[];
}

function buildCopy(message: EmailMessageInput, brand: EmailBrand): Copy {
  const kind = classifyEmail(message);
  const link = findLink(message.text);
  const expiry = extractExpiry(message.text);
  const ignoreNote =
    "Si no solicitaste este correo, puedes ignorarlo con tranquilidad.";
  const name = brand.siteName;

  switch (kind) {
    case "sign-in":
      return {
        subject: `Inicia sesión en ${name}`,
        preheader: "Tu enlace de acceso al panel está listo.",
        heading: "Inicia sesión",
        intro: `Recibimos una solicitud para entrar al panel de ${name}. Usa el botón para continuar.`,
        button: "Iniciar sesión",
        link,
        expiry,
        ignoreNote,
      };
    case "invite":
      return {
        subject: `Te invitaron a ${name}`,
        preheader: `Únete al equipo de ${name}.`,
        heading: "Tienes una invitación",
        intro: `Te invitaron a unirte al panel de ${name}. Crea tu cuenta con el botón.`,
        button: "Aceptar invitación",
        link,
        expiry,
      };
    case "signup":
      return {
        subject: `Confirma tu correo en ${name}`,
        preheader: "Un paso más para crear tu cuenta.",
        heading: "Confirma tu correo",
        intro: `Confirma tu dirección de correo para crear tu cuenta en ${name}.`,
        button: "Confirmar correo",
        link,
        expiry,
        ignoreNote,
      };
    case "test":
      return {
        subject: `Correo de prueba de ${name}`,
        preheader: "El envío de correos funciona.",
        heading: "Correo de prueba",
        intro:
          "Si recibes este mensaje, el proveedor de correo está configurado correctamente.",
      };
    default: {
      const paragraphs = message.text
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);
      return {
        subject: message.subject,
        preheader: paragraphs[0] ?? message.subject,
        heading: message.subject,
        intro: "",
        paragraphs,
      };
    }
  }
}

export interface RenderedEmail extends EmailMessageInput {
  html: string;
}

/** Recompose an outgoing message with NÓMADA copy and layout. */
export function renderNomadaEmail(
  message: EmailMessageInput,
  brand: EmailBrand,
): RenderedEmail {
  const copy = buildCopy(message, brand);
  return {
    ...message,
    subject: copy.subject,
    text: renderText(copy, brand),
    html: renderHtml(copy, brand),
  };
}

function expiryLine(expiry: string): string {
  return `El enlace vence en ${expiry}.`;
}

function renderText(copy: Copy, brand: EmailBrand): string {
  if (copy.paragraphs)
    return [...copy.paragraphs, footerText(brand)].join("\n\n");
  const parts = [copy.heading, copy.intro];
  if (copy.link) parts.push(copy.link);
  if (copy.expiry) parts.push(expiryLine(copy.expiry));
  if (copy.ignoreNote) parts.push(copy.ignoreNote);
  parts.push(footerText(brand));
  return parts.join("\n\n");
}

function footerText(brand: EmailBrand): string {
  return `${brand.siteName} · ${brand.location}\n${brand.siteUrl}`;
}

function renderHtml(copy: Copy, brand: EmailBrand): string {
  const body: string[] = [];

  body.push(
    `<h1 style="margin:0 0 16px;font-family:${SERIF};font-size:30px;line-height:1.2;font-weight:normal;color:${COLORS.cream};">${escapeHtml(copy.heading)}</h1>`,
  );

  if (copy.intro) body.push(paragraph(escapeHtml(copy.intro)));
  for (const block of copy.paragraphs ?? []) {
    body.push(paragraph(linkify(escapeHtml(block)).replace(/\n/g, "<br>")));
  }

  if (copy.button && copy.link) {
    const href = escapeAttr(copy.link);
    body.push(`<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
<tr><td bgcolor="${COLORS.gold}" style="background-color:${COLORS.gold};border-radius:2px;">
<a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:${SANS};font-size:15px;font-weight:bold;letter-spacing:0.5px;color:${COLORS.deep};text-decoration:none;border-radius:2px;">${escapeHtml(copy.button)}</a>
</td></tr></table>`);
    body.push(
      small(
        `¿El botón no funciona? Copia y pega este enlace en tu navegador:<br><a href="${href}" target="_blank" style="color:${COLORS.gold};text-decoration:underline;word-break:break-all;">${escapeHtml(copy.link)}</a>`,
      ),
    );
  }

  if (copy.expiry) body.push(small(escapeHtml(expiryLine(copy.expiry))));
  if (copy.ignoreNote) body.push(small(escapeHtml(copy.ignoreNote)));

  const siteHref = escapeAttr(brand.siteUrl);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(copy.subject)}</title>
</head>
<body bgcolor="${COLORS.page}" style="margin:0;padding:0;background-color:${COLORS.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${COLORS.page};">${escapeHtml(copy.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.page}" style="background-color:${COLORS.page};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
<tr><td bgcolor="${COLORS.card}" style="background-color:${COLORS.card};border:1px solid ${COLORS.border};border-radius:2px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" bgcolor="${COLORS.card}" style="padding:36px 32px 24px;background-color:${COLORS.card};">
<a href="${siteHref}" target="_blank" style="text-decoration:none;"><img src="${escapeAttr(brand.logoUrl)}" width="240" height="59" alt="${escapeAttr(brand.siteName)}" style="display:block;width:240px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;color:${COLORS.cream};font-family:${SERIF};font-size:28px;"></a>
</td></tr>
<tr><td style="padding:0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${COLORS.border}" style="height:1px;line-height:1px;font-size:1px;background-color:${COLORS.border};">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:32px 32px 36px;font-family:${SANS};color:${COLORS.cream};">
${body.join("\n")}
</td></tr>
</table>
</td></tr>
<tr><td align="center" style="padding:24px 16px 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${COLORS.muted};">
${escapeHtml(brand.siteName)} · ${escapeHtml(brand.location)}<br>
<a href="${siteHref}" target="_blank" style="color:${COLORS.gold};text-decoration:none;">${escapeHtml(displayHost(brand.siteUrl))}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.6;color:${COLORS.cream};">${html}</p>`;
}

function small(html: string): string {
  return `<p style="margin:0 0 12px;font-family:${SANS};font-size:13px;line-height:1.6;color:${COLORS.muted};">${html}</p>`;
}

/** Wrap URLs in already-escaped text. */
function linkify(escaped: string): string {
  return escaped.replace(
    URL_PATTERN_GLOBAL,
    (url) =>
      `<a href="${url}" target="_blank" style="color:${COLORS.gold};text-decoration:underline;word-break:break-all;">${url}</a>`,
  );
}

function safePathname(url: string): string {
  try {
    return new URL(url).pathname.replace(/\/+$/, "");
  } catch {
    return "";
  }
}

function displayHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const escapeAttr = escapeHtml;
