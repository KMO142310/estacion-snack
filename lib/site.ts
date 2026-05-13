const DEFAULT_SITE_URL = "https://www.estacionsnack.cl";

export const WHATSAPP_PHONE = "+56 9 5374 3338";
export const INSTAGRAM_URL = "https://instagram.com/estacionsnack.sc";
export const SERVICE_AREAS = ["Santa Cruz", "Palmilla", "Peralillo", "Marchigüe"] as const;

function normalizeSiteUrl(raw?: string) {
  if (!raw) return DEFAULT_SITE_URL;

  try {
    const url = new URL(raw);

    if (url.hostname === "estacionsnack.cl" || url.hostname === "www.estacionsnack.cl") {
      url.protocol = "https:";
      url.hostname = "www.estacionsnack.cl";
      url.pathname = "";
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    }

    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function buildMetaDescription(text: string, maxLength = 160) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const shortened = normalized.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${(lastSpace > 110 ? shortened.slice(0, lastSpace) : shortened).trim()}…`;
}
