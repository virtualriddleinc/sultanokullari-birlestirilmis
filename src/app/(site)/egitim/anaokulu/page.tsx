import type { Metadata } from "next";
import { anaokulu } from "@/content/egitim";
import { anaokuluSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { AnaokuluPedagojikYaklasim } from "@/components/egitim/anaokulu-pedagojik-yaklasim";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Anaokulu",
  description:
    "Anaokulu programı, Kur’an ve Peygamber (s.a.s) Ahlâkı, oyun tabanlı öğrenme.",
};

export default function Page() {
  const { story, gallery } = anaokuluSayfasi;

  return (
    <QuoteOverlayPageShell
      title="Anaokulu"
      intro={anaokuluSayfasi.intro}
      media={PAGE_MEDIA.anaokulu}
      quote={anaokulu.quote}
      quoteCitation={anaokulu.quoteCitation}
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <AnaokuluPedagojikYaklasim items={anaokulu.accordion} />
      <p className="section-body mt-6 text-sm text-zinc-500">
        {anaokulu.gunlukProgramNotu}
      </p>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={educationGalleryMedia.anaokulu}
      />
    </QuoteOverlayPageShell>
  );
}
