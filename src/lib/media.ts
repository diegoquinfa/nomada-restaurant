// Pure helpers, safe to import from client islands (no server-only imports).
export type MediaValue = {
  id?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  meta?: { storageKey?: string };
};

/**
 * Public URL for a stored media value. The internal file route is keyed by the
 * storage key ("<id>.webp"), NOT by the media row id, so prefer meta.storageKey.
 */
export function mediaUrl(image?: MediaValue | null): string | undefined {
  if (!image) return undefined;
  if (image.src) return image.src;
  const key = image.meta?.storageKey;
  if (key) return `/_emdash/api/media/file/${key}`;
  return undefined;
}

export function whatsappHref(
  info: { whatsappNumber: string; whatsappMessage: string },
  message?: string,
) {
  const text = new URLSearchParams({ text: message ?? info.whatsappMessage });
  return `https://wa.me/${info.whatsappNumber}?${text.toString()}`;
}
