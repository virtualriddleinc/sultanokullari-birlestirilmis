import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/metadata";

export type CmsSeoInput = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  noIndex?: boolean | null;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackImage?: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function buildCmsPageMetadata(input: CmsSeoInput): Metadata {
  return buildPageMetadata({
    title: input.seoTitle?.trim() || input.fallbackTitle,
    description: input.seoDescription?.trim() || input.fallbackDescription,
    path: input.path,
    image: input.ogImageUrl || input.fallbackImage,
    noIndex: Boolean(input.noIndex),
    type: input.type,
    publishedTime: input.publishedTime,
  });
}

export type CmsFaqItem = {
  question: string;
  answer: string;
};

export function mapCmsFaqItems(
  items: Array<{ question?: string | null; answer?: string | null }> | null | undefined,
): CmsFaqItem[] {
  if (!items?.length) return [];
  return items
    .map((item) => ({
      question: item.question?.trim() ?? "",
      answer: item.answer?.trim() ?? "",
    }))
    .filter((item) => item.question && item.answer);
}
