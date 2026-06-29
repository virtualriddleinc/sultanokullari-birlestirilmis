const DEFAULT_SITE_URL = "https://sultanokullari.com.tr";

export function getSiteUrl(): string {
  const url = process.env.SITE_URL ?? DEFAULT_SITE_URL;
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function resolveMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return absoluteUrl(url);
}
