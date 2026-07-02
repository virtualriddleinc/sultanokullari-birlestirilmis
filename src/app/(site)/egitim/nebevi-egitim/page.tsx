import type { Metadata } from "next";
import { nebevi } from "@/content/egitim";
import { nebeviEgitimSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Nebevî Eğitim",
  description:
    "Üsve-i hasene Efendimizi rehber alan, siyer ve Peygamber (s.a.s) Ahlâkı dersleriyle bütünleşik nebevî eğitim programı.",
};

export default function Page() {
  const { story, gallery } = nebeviEgitimSayfasi;

  return (
    <QuoteOverlayPageShell
      title="Nebevî Eğitim"
      intro={nebeviEgitimSayfasi.intro}
      media={PAGE_MEDIA.nebeviEgitim}
      quote={nebevi.quote}
      quoteFullWidth
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Nebevî eğitim yöntemimiz"
        description="Programımızın omurgasını oluşturan kavramlar — Efendimizin asrına uzanan eğitim dilimizi özetliyor."
        items={nebevi.accordion}
        theme="teal"
        itemsLayout="honeycomb"
      />
      <p className="section-body mt-6 text-sm text-zinc-500">{nebevi.not}</p>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={educationGalleryMedia.nebevi}
      />
    </QuoteOverlayPageShell>
  );
}
