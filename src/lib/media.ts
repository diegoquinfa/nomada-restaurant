// Pure helpers, safe to import from client islands (no server-only imports).
export type MediaValue = {
  id?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

/** Public URL for a stored media value (works for the internal R2 route). */
export function mediaUrl(image?: MediaValue | null): string | undefined {
  if (!image) return undefined;
  return (
    image.src ?? (image.id ? `/_emdash/api/media/file/${image.id}` : undefined)
  );
}

export function whatsappHref(
  info: { whatsappNumber: string; whatsappMessage: string },
  message?: string,
) {
  const text = new URLSearchParams({ text: message ?? info.whatsappMessage });
  return `https://wa.me/${info.whatsappNumber}?${text.toString()}`;
}
