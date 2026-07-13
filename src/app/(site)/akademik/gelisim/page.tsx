import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { akademikGelisim } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Akademik Gelişim ve Tâkib",
  description: akademikGelisim.intro,
};

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("akademik", "gelisim", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Akademik Gelişim ve Tâkib",
    intro: akademikGelisim.intro,
    story: akademikGelisim.story,
    gallery: {
      ...akademikGelisim.gallery,
      items: pageGalleryMedia.akademikGelisim,
    },
    heroMedia: PAGE_MEDIA.akademikGelisim,
  });

  return (
    <PageShell
      title={content.title}
      intro={content.intro ?? akademikGelisim.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.akademikGelisim}
      mediaLayout="overlay"
    >
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </PageShell>
  );
}
