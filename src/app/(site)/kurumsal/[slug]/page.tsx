import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { CmsPageSections } from "@/components/cms/cms-page-sections";
import { PageShell } from "@/components/page-shell";
import { buildPagePath, getPageBySlug } from "@/lib/pages-data";
import { buildCmsPageMetadata } from "@/lib/seo/cms-seo";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const RESERVED = new Set([
  "hakkimizda",
  "burs-olanaklari",
  "insan-kaynaklari",
  "idari-kadro",
]);

function ogImageUrl(page: {
  ogImage?: unknown;
}): string | undefined {
  const og = page.ogImage;
  if (og && typeof og === "object" && "url" in og && og.url) {
    return String(og.url);
  }
  return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const page = await getPageBySlug(slug, { draft: isDraft });
  if (!page) return { title: "Sayfa bulunamadı" };

  return buildCmsPageMetadata({
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    ogImageUrl: ogImageUrl(page),
    noIndex: page.noIndex,
    fallbackTitle: page.title,
    fallbackDescription: page.intro ?? "",
    path: buildPagePath(page),
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  if (RESERVED.has(slug)) {
    notFound();
  }

  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageBySlug(slug, { draft: isDraft });
  if (!cmsPage?.sections?.length) {
    notFound();
  }

  return (
    <PageShell title={cmsPage.title} intro={cmsPage.intro ?? undefined}>
      <CmsPageSections sections={cmsPage.sections} />
    </PageShell>
  );
}
