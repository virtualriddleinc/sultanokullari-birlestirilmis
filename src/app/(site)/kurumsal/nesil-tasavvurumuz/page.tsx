import type { Metadata } from "next";
import { kurulusParagraflari, kurumsalTimeline } from "@/content/kurumsal";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Nesil Tasavvurumuz",
};

export default function Page() {
  const ufku = kurumsalTimeline.find((t) => t.year === "Ufkumuz");

  return (
    <PageShell title="Nesil Tasavvurumuz" media={PAGE_MEDIA.nesilTasavvur}>
      <ContentCard>
        <p className="section-body">{kurulusParagraflari[2]}</p>
      </ContentCard>
      {ufku ? (
        <section className="mt-8">
          <h2 className="font-cinzel text-charcoal text-xl font-bold">
            {ufku.title}
          </h2>
          <p className="section-body mt-3">{ufku.detail}</p>
        </section>
      ) : null}
    </PageShell>
  );
}
