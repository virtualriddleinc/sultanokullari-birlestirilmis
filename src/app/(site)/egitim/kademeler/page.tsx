import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { kademeler } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { PageStoryRowsCard } from "@/components/layout/page-overlay-sections";
import { PageDividerSection } from "@/components/layout/page-divider-heading";
import { GeoCitationBlock } from "@/components/geo/geo-citation-block";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Sultan Mektebi Modeli",
  description:
    "Bilginin hikmete, bilincin erdeme dönüştüğü Sultan Mektebi Modeli — anaokulu, ilkokul ve ortaokul kademeleri.",
  path: "/egitim/kademeler",
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "kademeler", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Sultan Mektebi Modeli",
    intro: kademeler.intro,
    story: kademeler.story,
    gallery: { ...kademeler.gallery, items: pageGalleryMedia.kademeler },
    heroMedia: PAGE_MEDIA.kademeler,
  });
  const { kademeSatirlari } = kademeler;

  return (
    <PageShell
      title={content.title}
      intro={content.intro ?? kademeler.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.kademeler}
      mediaLayout="overlay"
    >
      <GeoCitationBlock>
        Sultan Mektebi Modeli, her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bir
        bütün olarak ele alır; kökü mâzide, ufku âtîde bir nesil yetiştirmeyi
        amaçlar. Anaokulu, ilkokul ve ortaokul kademelerinde uygulanır.
      </GeoCitationBlock>
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <PageDividerSection
        id="kademeler-baslik"
        title="Kademeler"
        description="Anaokulundan ortaokula kesintisiz Sultan Mektebi Modeli."
      >
        <PageStoryRowsCard rows={kademeSatirlari} />
      </PageDividerSection>
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </PageShell>
  );
}
