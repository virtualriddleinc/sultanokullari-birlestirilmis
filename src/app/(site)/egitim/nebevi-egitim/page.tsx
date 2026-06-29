import type { Metadata } from "next";
import { nebevi } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";

export const metadata: Metadata = {
  title: "Nebevî Eğitim",
  description:
    "Üsve-i hasene Efendimizi rehber alan, siyer ve peygamber ahlakı dersleriyle bütünleşik nebevî eğitim programı.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="nebevi-egitim"
      title="Nebevî Eğitim"
      intro="Peygamber Efendimizin (s.a.v.) muallim oluşunu rehber alan; siyer, peygamber ahlakı ve üsve-i hasene örnekliğiyle çocuklarımızın gönüllerine dokunan program."
      quote={nebevi.quote}
      headingLayout="centerHero"
      quoteFullWidth
    >
      <div className="mt-6 space-y-4">
        {nebevi.intro.map((p, i) => (
          <p key={i} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>
      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Nebevî eğitim yöntemimiz"
        description="Programımızın omurgasını oluşturan kavramlar — Efendimizin asrına uzanan eğitim dilimizi özetliyor."
        items={nebevi.accordion}
        theme="teal"
        itemsLayout="honeycomb"
      />
      <p className="mt-6 text-sm text-zinc-500">{nebevi.not}</p>
      <MediaGallery
        title="Nebevî eğitim galerisi"
        items={educationGalleryMedia.nebevi}
        size="large"
      />
    </EgitimSegmentShell>
  );
}
