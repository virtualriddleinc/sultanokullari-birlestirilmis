import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { GeoCitationBlock } from "@/components/geo/geo-citation-block";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sultan Mektep Modeli & Kademeler",
  description:
    "Bilginin hikmete, bilincin erdeme dönüştüğü Sultan Mektep Modeli — anaokulu, ilkokul ve ortaokul kademeleri.",
  path: "/egitim/kademeler",
});

const kademeler = [
  { href: "/egitim/anaokulu", label: "Anaokulu" },
  { href: "/egitim/ilkokul", label: "İlkokul" },
  { href: "/egitim/ortaokul", label: "Ortaokul" },
];

export default function Page() {
  return (
    <PageShell
      title="Sultan Mektep Modeli & Kademeler"
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
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {kademeler.map((k) => (
          <li key={k.href}>
            <Link
              href={k.href}
              className="content-card content-card--inset font-cinzel text-charcoal block text-lg font-bold transition hover:opacity-90"
            >
              {k.label}
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
