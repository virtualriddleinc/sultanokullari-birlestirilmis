import type { Metadata } from "next";
import { anaokulu } from "@/content/egitim";
import { AnaokuluPedagojikYaklasim } from "@/components/egitim/anaokulu-pedagojik-yaklasim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";

export const metadata: Metadata = {
  title: "Anaokulu",
  description:
    "Anaokulu programı, Kur’an ve Peygamber ahlakı, oyun tabanlı öğrenme.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="anaokulu"
      title="Anaokulu"
      intro="Fıtrat üzere güvenli ve sevgi dolu bir başlangıç; Kur’an ve Peygamber muhabbetiyle bütünleşik okul öncesi eğitim."
      quote={anaokulu.quote}
      quoteCitation={anaokulu.quoteCitation}
    >
      <div className="mt-6 space-y-4">
        {anaokulu.intro.map((p, i) => (
          <p key={i} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>
      <AnaokuluPedagojikYaklasim items={anaokulu.accordion} />
      <p className="mt-6 text-sm text-zinc-500">{anaokulu.gunlukProgramNotu}</p>
      <MediaGallery
        title="Anaokulu galerisi"
        items={educationGalleryMedia.anaokulu}
      />
    </EgitimSegmentShell>
  );
}
