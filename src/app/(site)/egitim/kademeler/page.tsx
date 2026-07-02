import type { Metadata } from "next";
import { kademeler } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { PageStoryRowsCard } from "@/components/layout/page-overlay-sections";
import { PageDividerSection } from "@/components/layout/page-divider-heading";
import { GeoCitationBlock } from "@/components/geo/geo-citation-block";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sultan Mektebi Modeli",
  description:
    "Bilginin hikmete, bilincin erdeme dönüştüğü Sultan Mektebi Modeli — anaokulu, ilkokul ve ortaokul kademeleri.",
  path: "/egitim/kademeler",
});

export default function Page() {
  const { story, gallery, kademeSatirlari } = kademeler;

  return (
    <PageShell
      title="Sultan Mektebi Modeli"
      intro={kademeler.intro}
      media={PAGE_MEDIA.kademeler}
      mediaLayout="overlay"
    >
      <GeoCitationBlock>
        Sultan Mektebi Modeli, her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bir
        bütün olarak ele alır; kökü mâzide, ufku âtîde bir nesil yetiştirmeyi
        amaçlar. Anaokulu, ilkokul ve ortaokul kademelerinde uygulanır.
      </GeoCitationBlock>
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <PageDividerSection
        id="kademeler-baslik"
        title="Kademeler"
        description="Anaokulundan ortaokula kesintisiz Sultan Mektebi Modeli."
      >
        <PageStoryRowsCard rows={kademeSatirlari} />
      </PageDividerSection>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={pageGalleryMedia.kademeler}
      />
    </PageShell>
  );
}
