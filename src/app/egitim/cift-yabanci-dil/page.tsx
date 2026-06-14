import type { Metadata } from "next";
import { ciftDil } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";

export const metadata: Metadata = {
  title: "Çift Yabancı Dil Eğitimi",
  description:
    "Arapça ve İngilizce; alanında uzman yabancı öğretmenlerle dört temel beceriyi okul öncesinden itibaren süreklilikle.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="cift-yabanci-dil"
      title="Çift Yabancı Dil Eğitimi"
      intro="Arapça ve İngilizce; alanında uzman yabancı öğretmenlerle okul öncesi kademesinden itibaren dinleme, anlama, konuşma, okuma ve yazma becerilerinin tümünü dengeli geliştiren program."
      quote={ciftDil.quote}
    >
      <ul className="mt-6 space-y-2 text-sm text-zinc-700 italic">
        {ciftDil.alintilar.map((a) => (
          <li key={a}>“{a}”</li>
        ))}
      </ul>

      <div className="mt-6 space-y-4">
        {ciftDil.intro.map((p, i) => (
          <p key={i} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>

      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Çift dilli yarınların yöntemi"
        description="Sayfayı kaydırdıkça akan kavramlar — iki dilin de doğal akışta yaşandığı sürekli bir dil yolculuğu."
        bands={ciftDil.bands}
        items={ciftDil.accordion}
        theme="sky"
      />

      <p className="mt-6 text-sm text-zinc-500">{ciftDil.not}</p>
      <MediaGallery
        title="Çift yabancı dil galerisi"
        items={educationGalleryMedia.ciftDil}
      />
    </EgitimSegmentShell>
  );
}
