import { getPreviewBaseUrl } from "@/payload/admin-groups";

/** Canlı önizleme iframe URL'si — draft modunu etkinleştirir */
export function buildPreviewUrl(path = "/"): string {
  const base = getPreviewBaseUrl();
  const secret = process.env.PREVIEW_SECRET || "";
  if (!secret) return `${base}${path}`;
  const params = new URLSearchParams({
    secret,
    path,
  });
  return `${base}/api/preview?${params.toString()}`;
}
