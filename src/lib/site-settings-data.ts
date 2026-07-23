import "server-only";

import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/payload";

export type SiteSettings = {
  instagramHandle: string;
  instagramUrl: string;
  footerEmail: string;
  footerPhone: string;
  socialLinks: { label: string; href: string }[];
  defaultOgImageUrl?: string;
};

const DEFAULTS: SiteSettings = {
  instagramHandle: "sultanokullari",
  instagramUrl: "https://www.instagram.com/sultanokullari/",
  footerEmail: "info@sultanokullari.com",
  footerPhone: "",
  socialLinks: [],
};

async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayloadClient();
    const data = await payload.findGlobal({ slug: "site-ayarlari", depth: 1 });
    const defaultOgImage = data.defaultOgImage;
    const defaultOgImageUrl =
      defaultOgImage &&
      typeof defaultOgImage === "object" &&
      "url" in defaultOgImage &&
      defaultOgImage.url
        ? String(defaultOgImage.url)
        : undefined;

    return {
      instagramHandle:
        (data.instagramHandle as string) || DEFAULTS.instagramHandle,
      instagramUrl: (data.instagramUrl as string) || DEFAULTS.instagramUrl,
      footerEmail: (data.footerEmail as string) || DEFAULTS.footerEmail,
      footerPhone: (data.footerPhone as string) || DEFAULTS.footerPhone,
      socialLinks: (data.socialLinks as SiteSettings["socialLinks"]) ?? [],
      defaultOgImageUrl,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return unstable_cache(fetchSiteSettings, ["site-settings"], {
    revalidate: 120,
    tags: ["site-settings"],
  })();
}
