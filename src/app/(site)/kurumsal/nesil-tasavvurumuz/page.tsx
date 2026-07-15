import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { nesilTasavvurumuz } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { CmsPageSections } from "@/components/cms/cms-page-sections";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { KurumsalTimelineSection } from "@/components/kurumsal/kurumsal-timeline-section";
import { getPageBySlug } from "@/lib/pages-data";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/kurumsal/nesil-tasavvurumuz",
  title: "Nesil Tasavvurumuz",
  description: nesilTasavvurumuz.intro,
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageBySlug("nesil-tasavvurumuz", { draft: isDraft });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Kurumsal", path: "/kurumsal/hakkimizda" },
    { name: "Nesil Tasavvurumuz", path: "/kurumsal/nesil-tasavvurumuz" },
  ]);

  if (cmsPage?.sections?.length) {
    return (
      <PageShell title={cmsPage.title} intro={cmsPage.intro ?? undefined}>
        <JsonLd data={breadcrumbs} />
        <CmsPageSections sections={cmsPage.sections} />
      </PageShell>
    );
  }

  const { story, gallery, timeline } = nesilTasavvurumuz;

  return (
    <PageShell
      title="Nesil Tasavvurumuz"
      intro={nesilTasavvurumuz.intro}
      media={PAGE_MEDIA.nesilTasavvur}
      mediaLayout="overlay"
    >
      <JsonLd data={breadcrumbs} />
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <KurumsalTimelineSection
        items={timeline}
        title="Ufkumuz"
        description="Geleceğe dönük hedeflerimiz ve Eğitim Külliyesi vizyonumuz."
      />
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={pageGalleryMedia.nesilTasavvur}
      />
    </PageShell>
  );
}
