import { getEmDashCollection } from "emdash";

export { type MediaValue, mediaUrl, whatsappHref } from "./media";

export const SITE_URL = "https://nomadarestaurantectg.com";

export type SiteInfo = {
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle: string;
  location: string;
  legalName: string;
};

const FALLBACK: SiteInfo = {
  whatsappNumber: "573242503301",
  whatsappMessage: "Hola, quiero vivir la experiencia NÓMADA 🌎",
  instagramHandle: "nomadarestaurante",
  location: "Cartagena de Indias, Colombia",
  legalName: "NÓMADA",
};

/** Contact data edited in the CMS ("Datos del sitio"); falls back to defaults. */
export async function getSiteInfo(): Promise<SiteInfo> {
  const { entries } = await getEmDashCollection("site_info");
  const d = entries[0]?.data as unknown as Record<string, string> | undefined;
  if (!d) return FALLBACK;
  return {
    whatsappNumber: d.whatsapp_number || FALLBACK.whatsappNumber,
    whatsappMessage: d.whatsapp_message || FALLBACK.whatsappMessage,
    instagramHandle: d.instagram_handle || FALLBACK.instagramHandle,
    location: d.location || FALLBACK.location,
    legalName: d.legal_name || FALLBACK.legalName,
  };
}
