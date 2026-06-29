import type { Metadata } from "next";

import { absoluteUrl, getSiteUrl, resolveMediaUrl } from "@/lib/seo/site-url";

export const DEFAULT_OG_IMAGE = "/logo.svg";

export const SITE_NAME = "Sultan Okulları";

export const DEFAULT_DESCRIPTION =
  "Sultan Okulları — milli ve manevi değerlerle bütünleşik eğitim. Anaokulu, ilkokul ve ortaokul programları.";

export type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const canonical = input.path ? absoluteUrl(input.path) : undefined;
  const imageUrl = resolveMediaUrl(input.image ?? DEFAULT_OG_IMAGE) ?? absoluteUrl(DEFAULT_OG_IMAGE);
  const openGraphType = input.type ?? "website";

  return {
    title: input.title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: input.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: openGraphType,
      locale: "tr_TR",
      siteName: SITE_NAME,
      title: input.title,
      description,
      url: canonical,
      images: [{ url: imageUrl, alt: input.title }],
      ...(openGraphType === "article" && input.publishedTime
        ? { publishedTime: input.publishedTime }
        : {}),
      ...(openGraphType === "article" && input.modifiedTime
        ? { modifiedTime: input.modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [imageUrl],
    },
  };
}

export function getRootMetadata(defaultOgImage?: string): Metadata {
  const ogImage = resolveMediaUrl(defaultOgImage ?? DEFAULT_OG_IMAGE) ?? absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
      images: [{ url: ogImage, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [ogImage],
    },
  };
}
