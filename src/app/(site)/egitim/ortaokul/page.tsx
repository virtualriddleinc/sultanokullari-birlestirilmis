import type { Metadata } from "next";
import { ortaokulSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageDividerSection } from "@/components/layout/page-divider-heading";
import { PageStoryRowsCard } from "@/components/layout/page-overlay-sections";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { ortaokul } from "@/content/egitim";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Ortaokul",
  description:
    "Ortaokul programı; atölyeler, kulüpler, etüt ve değerler eğitimi.",
};

export default function Page() {
  const { story, gallery, etut } = ortaokulSayfasi;

  return (
    <QuoteOverlayPageShell
      title="Ortaokul"
      intro={ortaokulSayfasi.intro}
      media={PAGE_MEDIA.ortaokul}
      quote={ortaokul.quote}
      quoteCitation={ortaokul.quoteCitation}
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <PageDividerSection
        id="etut-baslik"
        title="Etüt ve birebir çalışmalar"
      >
        <PageStoryRowsCard rows={[etut]} />
      </PageDividerSection>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={educationGalleryMedia.ortaokul}
      />
    </QuoteOverlayPageShell>
  );
}
