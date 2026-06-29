import type { Metadata } from "next";
import { kurulusParagraflari } from "@/content/kurumsal";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Kurumsal Değerlerimiz",
};

export default function Page() {
  return (
    <PageShell
      title="Kurumsal Değerlerimiz"
      media={PAGE_MEDIA.kurumsalDegerler}
    >
      <ContentCard>
        <p className="section-body">{kurulusParagraflari[1]}</p>
      </ContentCard>
    </PageShell>
  );
}
