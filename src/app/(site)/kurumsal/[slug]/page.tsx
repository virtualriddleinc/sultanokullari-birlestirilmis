import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CmsPageSections } from "@/components/cms/cms-page-sections";
import { PageShell } from "@/components/page-shell";
import { getPageBySlug } from "@/lib/pages-data";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const RESERVED = new Set(["hakkimizda", "burs-olanaklari", "insan-kaynaklari", "idari-kadro"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Sayfa bulunamadı" };
  return {
    title: page.title,
    description: page.intro ?? undefined,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  if (RESERVED.has(slug)) {
    notFound();
  }

  const cmsPage = await getPageBySlug(slug);
  if (!cmsPage?.sections?.length) {
    notFound();
  }

  return (
    <PageShell title={cmsPage.title} intro={cmsPage.intro ?? undefined}>
      <CmsPageSections sections={cmsPage.sections} />
    </PageShell>
  );
}
