/**
 * Canlı önizleme path doğrulama — açık yönlendirmeyi engeller.
 * Yalnızca site-içi relative path kabul edilir.
 */

export function isSafePreviewPath(path: string): boolean {
  if (!path || typeof path !== "string") return false;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("//")) return false;
  if (trimmed.includes("://")) return false;
  if (trimmed.includes("\\")) return false;
  if (/[\x00-\x1f]/.test(trimmed)) return false;
  try {
    const url = new URL(trimmed, "http://preview.local");
    if (url.hostname !== "preview.local") return false;
    if (url.username || url.password) return false;
    return url.pathname.startsWith("/");
  } catch {
    return false;
  }
}
