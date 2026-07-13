import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { degerler } from "@/content/egitim";
import { degerlerEgitimiSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { GeoCitationBlock } from "@/components/geo/geo-citation-block";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Değerler Eğitimi",
  description:
    "Aylık temalar, Değerler Eğitimi Komisyonu ve sınıf etkinlikleriyle müfredata nakış nakış işlenmiş değerler programı.",
  path: "/egitim/degerler-egitimi",
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "degerler-egitimi", {
    draft: isDraft,
  });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Değerler Eğitimi",
    intro: degerlerEgitimiSayfasi.intro,
    story: degerlerEgitimiSayfasi.story,
    gallery: {
      ...degerlerEgitimiSayfasi.gallery,
      items: educationGalleryMedia.degerler,
    },
    heroMedia: PAGE_MEDIA.degerlerEgitimi,
  });

  return (
    <QuoteOverlayPageShell
      title={content.title}
      intro={content.intro ?? degerlerEgitimiSayfasi.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.degerlerEgitimi}
      quote={degerler.quote}
    >
      <GeoCitationBlock>
        Sultan Okulları, 2017&apos;de kurulan, İstanbul, Kocaeli, Sakarya, Ankara ve
        Konya&apos;da kampüsleri bulunan MEB onaylı bir özel eğitim kurumudur. Sultan
        Mektebi Modeli ile değerler eğitimi, nebevî eğitim ve çift yabancı dil
        programlarını anaokulu, ilkokul ve ortaokul kademelerinde sunar.
      </GeoCitationBlock>
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Değerlerimizi yaşatma yolumuz"
        description="Sınıfta, panoda, etkinlikte — günlük okul ritmimizin merkezinde."
        items={degerler.accordion}
        theme="rose"
      />
      <section className="mt-fluid-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.32em] text-rose-600 uppercase">
            Yıllık akış
          </p>
          <h2 className="mt-fluid-3 text-[length:var(--text-3xl)] font-semibold tracking-tight text-balance text-zinc-950 md:text-[length:var(--text-4xl)]">
            Aylık tema örnekleri
          </h2>
          <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-600">
            Komisyonumuzun her dönem yeniden değerlendirdiği tematik akıştan
            örnek bir yıl planı.
          </p>
        </div>
        <ul className="mt-fluid-8 grid gap-fluid-3 md:grid-cols-2 lg:grid-cols-5">
          {degerler.aylikOrnek.map((r) => (
            <li
              key={r.ay}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/85 p-fluid-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(225,29,72,0.10)]"
            >
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.24em] text-rose-600 uppercase">
                {r.ay}
              </p>
              <p className="mt-fluid-1 text-[length:var(--text-base)] font-semibold text-zinc-950">
                {r.deger}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <p className="section-body mt-fluid-6 text-zinc-500">{degerler.not}</p>
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </QuoteOverlayPageShell>
  );
}
