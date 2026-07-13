import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { ilkokul } from "@/content/egitim";
import { ilkokulSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İlkokul",
  description:
    "İlkokul programı; akademik ve Mânevî gelişim, yapılandırmacı yaklaşım.",
};

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "ilkokul", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "İlkokul",
    intro: ilkokulSayfasi.intro,
    story: ilkokulSayfasi.story,
    gallery: { ...ilkokulSayfasi.gallery, items: educationGalleryMedia.ilkokul },
    heroMedia: PAGE_MEDIA.ilkokul,
  });

  return (
    <QuoteOverlayPageShell
      title={content.title}
      intro={content.intro ?? ilkokulSayfasi.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.ilkokul}
      quote={ilkokul.quote}
      quoteCitation={ilkokul.quoteCitation}
    >
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <p className="section-body mt-6 text-sm text-zinc-500">
        {ilkokul.takvimNotu}
      </p>
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </QuoteOverlayPageShell>
  );
}
