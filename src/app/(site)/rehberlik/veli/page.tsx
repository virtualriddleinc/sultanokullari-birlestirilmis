import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { veliSayfasi } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sultanda Veli Olmak & Veli Akademisi",
  description: veliSayfasi.intro,
};

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("rehberlik", "veli", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Sultanda Veli Olmak & Veli Akademisi",
    intro: veliSayfasi.intro,
    story: veliSayfasi.story,
    gallery: { ...veliSayfasi.gallery, items: pageGalleryMedia.veli },
    heroMedia: PAGE_MEDIA.veli,
  });

  return (
    <PageShell
      title={content.title}
      intro={content.intro ?? veliSayfasi.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.veli}
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
