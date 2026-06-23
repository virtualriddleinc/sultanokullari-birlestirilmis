import type { Metadata } from "next";
import { degerler } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Değerler Eğitimi",
  description:
    "Aylık temalar, Değerler Eğitimi Komisyonu ve sınıf etkinlikleriyle müfredata nakış nakış işlenmiş değerler programı.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="degerler-egitimi"
      title="Değerler Eğitimi"
      intro="Müfredatın her alanına nakış nakış işlenmiş değerler eğitimi; komisyon planı, sınıf rehberliği ve etkinliklerle yaşatılır."
      quote={degerler.quote}
      media={PAGE_MEDIA.degerlerEgitimi}
    >
      <div className="mt-6 space-y-4">
        {degerler.intro.map((p, i) => (
          <p key={i} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>

      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Değerlerimizi yaşatma yolumuz"
        description="Sayfayı kaydırdıkça akan değerler — sınıfta, panoda, etkinlikte; günlük okul ritmimizin merkezinde."
        bands={degerler.bands}
        items={degerler.accordion}
        theme="rose"
      />

      <section className="mt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.32em] text-rose-600 uppercase">
            Yıllık akış
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-4xl">
            Aylık tema örnekleri
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Komisyonumuzun her dönem yeniden değerlendirdiği tematik akıştan
            örnek bir yıl planı.
          </p>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {degerler.aylikOrnek.map((r) => (
            <li
              key={r.ay}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(225,29,72,0.10)]"
            >
              <p className="text-[0.62rem] font-semibold tracking-[0.24em] text-rose-600 uppercase">
                {r.ay}
              </p>
              <p className="mt-1 text-base font-semibold text-zinc-950">
                {r.deger}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-sm text-zinc-500">{degerler.not}</p>
      <MediaGallery
        title="Değerler eğitimi galerisi"
        items={educationGalleryMedia.degerler}
      />
    </EgitimSegmentShell>
  );
}
