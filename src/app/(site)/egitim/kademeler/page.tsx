import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { GeoCitationBlock } from "@/components/geo/geo-citation-block";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sultan Mektep Modeli",
  description:
    "Bilginin hikmete, bilincin erdeme dönüştüğü Sultan Mektep Modeli — anaokulu, ilkokul ve ortaokul kademeleri.",
  path: "/egitim/kademeler",
});

export default function Page() {
  return (
    <PageShell
      title="Sultan Mektep Modeli"
      intro="Bilginin hikmete, bilincin ise erdeme dönüştüğü özgün bir eğitim modeli"
      media={PAGE_MEDIA.kademeler}
    >
      <GeoCitationBlock>
        Sultan Mektep Modeli, her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bir
        bütün olarak ele alır; kökü mazide, ufku âtîde bir nesil yetiştirmeyi
        amaçlar. Anaokulu, ilkokul ve ortaokul kademelerinde uygulanır.
      </GeoCitationBlock>
      <ContentCard>
        <p className="section-body">
          Her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bir bütün olarak ele
          alır; kökü mazide, ufku âtîde bir nesil yetiştirmeyi amaçlar.
        </p>
      </ContentCard>
    </PageShell>
  );
}
