import type { Metadata } from "next";
import { kurumsalTimeline } from "@/content/kurumsal";
import { kurumsalKimlikGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { KurumsalKurulusHikayesi } from "@/components/kurumsal/kurumsal-kurulus-hikayesi";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
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
      mediaLayout="overlay"
    >
      <KurumsalKurulusHikayesi />

      <section aria-labelledby="timeline-baslik" className="mt-16">
        <div className="flex items-center gap-4">
          <h2
            id="timeline-baslik"
            className="font-cinzel text-charcoal shrink-0 text-2xl font-bold sm:text-3xl"
          >
            Zaman Çizelgesi
          </h2>
          <div className="from-brand-green/60 h-px flex-1 bg-gradient-to-r to-transparent" />
        </div>

        {/* Mobil / tablet (< lg): dikey zaman çizelgesi */}
        <ol className="mt-8 space-y-6 lg:hidden">
          {kurumsalTimeline.map((item) => (
            <li
              key={item.year}
              className="border-brand-green relative border-l-2 pl-6"
            >
              <span className="bg-brand-green absolute top-1 -left-[7px] h-3 w-3 rounded-full" />
              <p className="text-brand-green text-sm font-bold tracking-wide uppercase">
                {item.year}
              </p>
              <p className="font-cinzel text-charcoal mt-1 text-lg font-bold">
                {item.title}
              </p>
              <p className="section-body mt-2 text-base">{item.detail}</p>
            </li>
          ))}
        </ol>

        {/* Laptop / masaüstü (lg+): yatay zaman çizelgesi */}
        <div className="relative mt-12 hidden lg:block">
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${kurumsalTimeline.length}, minmax(0, 1fr))`,
            }}
          >
            {kurumsalTimeline.map((item) => (
              <div key={item.year} className="relative pt-10">
                <div className="from-brand-green/15 via-brand-green to-brand-green/15 absolute top-3 right-0 left-0 h-0.5 bg-gradient-to-r" />
                <span className="bg-brand-green border-brand-honey absolute top-1.5 left-0 h-3 w-3 rounded-full border-2 shadow-[0_0_0_4px_rgba(0,0,0,0.03)]" />
                <p className="text-brand-green text-sm font-bold tracking-wide uppercase">
                  {item.year}
                </p>
                <p className="font-cinzel text-charcoal mt-2 text-lg leading-snug font-bold text-balance">
                  {item.title}
                </p>
                <p className="section-body mt-3 text-sm leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KurumsalKimlikGalerisi items={kurumsalKimlikGalleryMedia} />
    </PageShell>
  );
}
