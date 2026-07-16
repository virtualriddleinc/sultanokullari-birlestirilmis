function hostFromUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

export function getAllowedAuthHosts(): Set<string> {
  const hosts = new Set<string>();
  const site = hostFromUrl(process.env.SITE_URL);
  if (site) hosts.add(site);
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) hosts.add(vercel.replace(/^https?:\/\//, "").toLowerCase());
  // Yerel geliştirme
  hosts.add("localhost:5001");
  hosts.add("127.0.0.1:5001");
  return hosts;
}

/**
 * Cookie oturumlu auth POST'ları için Origin/Referer host doğrulaması.
 */
export function isTrustedAuthOrigin(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  if (secFetchSite === "cross-site") return false;

  const allowed = getAllowedAuthHosts();
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return allowed.has(new URL(origin).host.toLowerCase());
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return allowed.has(new URL(referer).host.toLowerCase());
    } catch {
      return false;
    }
  }

  // Same-origin tarayıcı istekleri bazen Origin göndermez (eski istemciler).
  // Sec-Fetch-Site: same-origin / same-site / none kabul.
  if (
    secFetchSite === "same-origin" ||
    secFetchSite === "same-site" ||
    secFetchSite === "none"
  ) {
    return true;
  }

  // Server-to-server / curl: Origin yok — prod fail-closed için red.
  // Bootstrap secret ile gelen acil istekler Origin olmadan da gelebilir;
  // caller bootstrap path'te secret kontrolünden sonra bu fonksiyonu atlayabilir.
  return false;
}
