import { kurulusParagraflari } from "@/content/kurumsal";
import { PageStorySection } from "@/components/layout/page-story-section";

const hikayeSatirlari = [
  {
    eyebrow: "Kimliğimiz",
    highlights: [
      "2016-2017",
      "çift kanatlı eğitim modelimize",
      "ilimde âlim, ibadette âbid, gayrette mücahit",
    ],
  },
  {
    eyebrow: "Gayemiz",
    highlights: [
      "milli ve manevi değerlerle",
      "millet ve ümmet bilincine",
      "geçmişini bilip geleceğine sahip çıkan",
    ],
  },
  {
    eyebrow: "Eğitim Külliyesi",
    highlights: ["Anadolu ve Fen Lisemizi", "Eğitim Külliyesi"],
  },
  {
    eyebrow: "Maksadımız",
    highlights: [
      "17 yıllık eğitim yolculuğunda",
      "fenni ve dini ilimlerle",
    ],
  },
] as const;

export function KurumsalKurulusHikayesi() {
  return (
    <PageStorySection
      eyebrow="Kimliğimiz"
      motto="İlimde âlim, ibadette âbid, gayrette mücahit bir neslin yetiştiği çift kanatlı eğitim modeli"
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
