import type { Metadata } from "next";
import { kurulusParagraflari, kurumsalTimeline } from "@/content/kurumsal";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Kurumsal Kimliğimiz",
  description: "Sultan Okulları kuruluş ve kurumsal kimlik.",
};

export default function Page() {
  return (
    <PageShell
      title="Kurumsal Kimliğimiz"
      intro="İlimde âlim, ibadette âbid, gayrette mücahit bir neslin yetiştiği çift kanatlı eğitim modeli"
      media={PAGE_MEDIA.kurumsalKimlik}
    >
      <ContentCard>
        <div className="space-y-4">
          {kurulusParagraflari.map((p, i) => (
            <p key={i} className="section-body">
              {p}
            </p>
          ))}
        </div>
      </ContentCard>

      <section aria-labelledby="timeline-baslik" className="mt-10">
        <h2
          id="timeline-baslik"
          className="font-cinzel text-charcoal text-xl font-bold"
        >
          Zaman çizelgesi
        </h2>
        <ol className="mt-6 space-y-6">
          {kurumsalTimeline.map((item) => (
            <li key={item.year} className="border-brand-green border-l-2 pl-4">
              <p className="text-charcoal/60 text-sm font-semibold">
                {item.year}
              </p>
              <p className="font-cinzel text-charcoal mt-1 text-lg font-bold">
                {item.title}
              </p>
              <p className="section-body mt-2">{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
