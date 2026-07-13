import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { CmsRichText } from "@/components/cms/cms-rich-text";
import { GeoCitationBlock } from "@/components/geo/geo-citation-block";
import { PageFaqSection } from "@/components/geo/page-faq-section";
import { PageShell } from "@/components/page-shell";
import { getEventBySlug } from "@/lib/guncel-data";
import { buildCmsPageMetadata } from "@/lib/seo/cms-seo";
import { buildEventSchema } from "@/lib/schema/event";
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
  const { isEnabled: isDraft } = await draftMode();
  const event = await getEventBySlug(slug, { draft: isDraft });
  if (!event) return { title: "Etkinlik bulunamadı" };
  return buildCmsPageMetadata({
    seoTitle: event.seoTitle,
    seoDescription: event.seoDescription,
    ogImageUrl: event.ogImageUrl,
    noIndex: event.noIndex,
    fallbackTitle: event.title,
    fallbackDescription: event.excerpt,
    fallbackImage: event.featuredImageUrl,
    path: `/guncel/etkinlikler/${event.slug}`,
    type: "article",
    publishedTime: event.date,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const event = await getEventBySlug(slug, { draft: isDraft });
  if (!event) notFound();

  const structuredData = [
    buildEventSchema(event),
    buildBreadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Etkinlikler", path: "/guncel/etkinlikler" },
      { name: event.title, path: `/guncel/etkinlikler/${event.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <PageShell title={event.title} intro={event.excerpt}>
        <p className="text-[length:var(--text-sm)] text-zinc-500">
          {formatDate(event.date)}
        </p>

        {event.featuredImageUrl ? (
          <div className="relative mt-fluid-6 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-lg">
            <Image
              src={event.featuredImageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}

        {event.body ? (
          <div className="prose prose-zinc mt-fluid-8 max-w-3xl">
            <CmsRichText data={event.body as Record<string, unknown>} />
          </div>
        ) : (
          <p className="mt-fluid-6 text-zinc-700">{event.excerpt}</p>
        )}

        {event.geoCitationSummary ? (
          <GeoCitationBlock>{event.geoCitationSummary}</GeoCitationBlock>
        ) : null}
        {event.faqItems?.length ? (
          <PageFaqSection items={event.faqItems} />
        ) : null}

        <p className="mt-fluid-8">
          <Link
            href="/guncel/etkinlikler"
            className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-primary)] hover:underline"
          >
            ← Tüm etkinlikler
          </Link>
        </p>
      </PageShell>
    </>
  );
}
