import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { notFound } from "next/navigation";

import { CmsRichText } from "@/components/cms/cms-rich-text";
import { PageShell } from "@/components/page-shell";
import { getNewsBySlug } from "@/lib/guncel-data";
import { buildCmsPageMetadata } from "@/lib/seo/cms-seo";
import { buildNewsArticleSchema } from "@/lib/schema/news-article";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return { title: "Haber bulunamadı" };
  return buildCmsPageMetadata({
    seoTitle: news.seoTitle,
    seoDescription: news.seoDescription,
    ogImageUrl: news.ogImageUrl,
    noIndex: news.noIndex,
    fallbackTitle: news.title,
    fallbackDescription: news.excerpt,
    fallbackImage: news.featuredImageUrl,
    path: `/guncel/haberler/${news.slug}`,
    type: "article",
    publishedTime: news.date,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) notFound();

  const structuredData = [
    buildNewsArticleSchema(news),
    buildBreadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Haberler", path: "/guncel/haberler" },
      { name: news.title, path: `/guncel/haberler/${news.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <PageShell title={news.title} intro={news.excerpt}>
      <p className="text-sm text-zinc-500">{formatDate(news.date)}</p>

      {news.featuredImageUrl ? (
        <div className="relative mt-6 aspect-[16/9] max-w-3xl overflow-hidden rounded-lg">
          <Image
            src={news.featuredImageUrl}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      {news.body ? (
        <div className="prose prose-zinc mt-8 max-w-3xl">
          <CmsRichText data={news.body as Record<string, unknown>} />
        </div>
      ) : (
        <p className="mt-6 text-zinc-700">{news.excerpt}</p>
      )}

      <p className="mt-10">
        <Link
          href="/guncel/haberler"
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          ← Tüm haberler
        </Link>
      </p>
    </PageShell>
    </>
  );
}
