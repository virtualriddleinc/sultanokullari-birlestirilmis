import type { Metadata } from "next";
import { kurulusParagraflari } from "@/content/kurumsal";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Niyetimiz ve İstikametimiz",
};

export default function Page() {
  return (
    <PageShell title="Niyetimiz ve İstikametimiz" media={PAGE_MEDIA.niyetimiz}>
      <ContentCard>
        <p className="section-body">{kurulusParagraflari[1]}</p>
      </ContentCard>
    </PageShell>
  );
}
