import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { anaokulu } from "@/content/egitim";
import { anaokuluSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { AnaokuluPedagojikYaklasim } from "@/components/egitim/anaokulu-pedagojik-yaklasim";
import { ElifCalligraphy } from "@/components/egitim/elif-calligraphy";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anaokulu",
  description:
    "Anaokulu programı, Kur’an ve Peygamber (s.a.s) Ahlâkı, oyun tabanlı öğrenme.",
};

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "anaokulu", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Anaokulu",
    intro: anaokuluSayfasi.intro,
    story: anaokuluSayfasi.story,
    gallery: { ...anaokuluSayfasi.gallery, items: educationGalleryMedia.anaokulu },
    heroMedia: PAGE_MEDIA.anaokulu,
  });

  return (
    <QuoteOverlayPageShell
      title={content.title}
      intro={content.intro ?? anaokuluSayfasi.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.anaokulu}
      quote={anaokulu.quote}
      quoteCitation={anaokulu.quoteCitation}
    >
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        mottoTrailing={
          <ElifCalligraphy className="h-28 w-14 sm:h-36 sm:w-16" />
        }
        rows={content.story.rows}
      />
      <AnaokuluPedagojikYaklasim items={anaokulu.accordion} />
      <p className="section-body mt-6 text-sm text-zinc-500">
        {anaokulu.gunlukProgramNotu}
      </p>
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </QuoteOverlayPageShell>
  );
}
