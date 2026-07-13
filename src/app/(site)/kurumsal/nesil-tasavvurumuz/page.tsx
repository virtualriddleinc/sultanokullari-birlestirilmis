import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { nesilTasavvurumuz } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { getPageBySlug } from "@/lib/pages-data";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nesil Tasavvurumuz",
  description: nesilTasavvurumuz.intro,
};

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageBySlug("nesil-tasavvurumuz", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Nesil Tasavvurumuz",
    intro: nesilTasavvurumuz.intro,
    story: nesilTasavvurumuz.story,
    gallery: {
      ...nesilTasavvurumuz.gallery,
      items: pageGalleryMedia.nesilTasavvur,
    },
    heroMedia: PAGE_MEDIA.nesilTasavvur,
  });

  return (
    <PageShell
      title={content.title}
      intro={content.intro ?? nesilTasavvurumuz.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.nesilTasavvur}
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
