import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { kurumsalDegerlerimiz } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { CmsPageSections } from "@/components/cms/cms-page-sections";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { getPageBySlug } from "@/lib/pages-data";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kurumsal Değerlerimiz",
  description: kurumsalDegerlerimiz.intro,
};

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageBySlug("kurumsal-degerlerimiz", {
    draft: isDraft,
  });

  if (cmsPage?.sections?.length) {
    return (
      <PageShell title={cmsPage.title} intro={cmsPage.intro ?? undefined}>
        <CmsPageSections sections={cmsPage.sections} />
      </PageShell>
    );
  }

  const { story, gallery } = kurumsalDegerlerimiz;

  return (
    <PageShell
      title="Kurumsal Değerlerimiz"
      intro={kurumsalDegerlerimiz.intro}
      media={PAGE_MEDIA.kurumsalDegerler}
      mediaLayout="overlay"
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={pageGalleryMedia.kurumsalDegerler}
      />
    </PageShell>
  );
}
