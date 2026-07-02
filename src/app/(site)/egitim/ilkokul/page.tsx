import type { Metadata } from "next";
import { ilkokul } from "@/content/egitim";
import { ilkokulSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "İlkokul",
  description:
    "İlkokul programı; akademik ve Mânevî gelişim, yapılandırmacı yaklaşım.",
};

export default function Page() {
  const { story, gallery } = ilkokulSayfasi;

  return (
    <QuoteOverlayPageShell
      title="İlkokul"
      intro={ilkokulSayfasi.intro}
      media={PAGE_MEDIA.ilkokul}
      quote={ilkokul.quote}
      quoteCitation={ilkokul.quoteCitation}
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <p className="section-body mt-6 text-sm text-zinc-500">
        {ilkokul.takvimNotu}
      </p>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={educationGalleryMedia.ilkokul}
      />
    </QuoteOverlayPageShell>
  );
}
