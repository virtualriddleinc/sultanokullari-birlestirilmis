import type { Metadata } from "next";
import { hafizlik } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";

export const metadata: Metadata = {
  title: "Hafızlık Eğitimi",
  description:
    "Otağ-ı Hümâyun’umuzda mescid-rahle usulüyle anaokulundan başlayıp ilkokulda taçlanan hafızlık programı.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="hafizlik"
      title="Hafızlık Eğitimi"
      intro="Mescid-rahle usulüyle Otağ-ı Hümâyun’umuzda Hamele-i Kur’an’lar yetiştiriyoruz; vahyin gölgesinde hafız bir nesil."
      quote={hafizlik.quote}
    >
      <div className="mt-6 space-y-4">
        {hafizlik.intro.map((p, i) => (
          <p key={i} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>
      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Hafızlık programının ruhu"
        description="Sayfayı kaydırdıkça akan kavramlar — Otağ-ı Hümâyun’umuzun disiplini ve sevgi atmosferi."
        bands={hafizlik.bands}
        items={hafizlik.accordion}
        theme="emerald"
      />
      <p className="mt-6 text-sm text-zinc-500">{hafizlik.not}</p>
      <MediaGallery
        title="Hafızlık galerisi"
        items={educationGalleryMedia.hafizlik}
      />
    </EgitimSegmentShell>
  );
}
