import { kurulusParagraflari } from "@/content/kurumsal";
import { PageStorySection } from "@/components/layout/page-story-section";

const hikayeSatirlari = [
  {
    eyebrow: "Kuruluş · 2016–2017",
    highlights: [
      "fennî ve İslami ilimlerle",
      "Nebevî eğitim modeliyle",
      "2016-2017",
    ],
  },
  {
    eyebrow: "Gayemiz",
    highlights: ["milli ve Mânevî değerlerle", "millet ve ümmet bilincine"],
  },
  {
    eyebrow: "Hedeflerimiz",
    highlights: ["Anadolu ve Fen lisesi", "Eğitim Külliyesi"],
  },
] as const;

export function KurumsalKurulusHikayesi() {
  return (
    <PageStorySection
      eyebrow="Biz Kimiz?"
      motto="Köklerinden geleceğe yürüyen bir eğitim yolculuğu"
      rows={kurulusParagraflari.map((text, i) => {
        const satir = hikayeSatirlari[i];
        if (!satir) return null;
        return {
          eyebrow: satir.eyebrow,
          text,
          highlights: [...satir.highlights],
        };
      }).filter((row): row is NonNullable<typeof row> => row !== null)}
    />
  );
}
