import { config } from "dotenv";

config({ path: ".env.local" });

import {
  bursGiris,
  bursIndirimleri,
} from "@/content/burs";
import {
  kurulusParagraflari,
  kurucuMesajiNotu,
  kurumsalTimeline,
  niyetimizParagraflari,
  nesilTasavvurParagraflari,
  kurumsalDegerlerGiris,
} from "@/content/kurumsal";

async function main() {
  const { getPayloadClient } = await import("@/lib/payload");
  const payload = await getPayloadClient();

  const pages = [
    {
      title: "Hakkımızda",
      slug: "hakkimizda",
      pathPrefix: "kurumsal" as const,
      template: "kurumsal-blok" as const,
      _status: "published" as const,
      intro: "Köklerine bağlı, âtiye yürüyen nesiller için eğitim yolculuğumuz.",
      sections: [
        {
          blockType: "textSection" as const,
          heading: "Kuruluş",
          anchorId: "kurulus",
          paragraphs: kurulusParagraflari.map((text) => ({ text })),
        },
        {
          blockType: "textSection" as const,
          heading: "Kurucu mesajı",
          anchorId: "kurucu-mesaji",
          paragraphs: [{ text: kurucuMesajiNotu }],
        },
        {
          blockType: "timelineSection" as const,
          heading: "Zaman çizelgesi",
          items: kurumsalTimeline.map((t) => ({
            year: t.year,
            title: t.title,
            detail: t.detail,
          })),
        },
      ],
    },
    {
      title: "Burs olanakları",
      slug: "burs-olanaklari",
      pathPrefix: "kurumsal" as const,
      template: "kurumsal-blok" as const,
      _status: "published" as const,
      intro:
        "Hem akademik başarı hem de yönetim kurulunun onayladığı ihtiyaç durumlarında burs imkânları.",
      sections: [
        {
          blockType: "textSection" as const,
          paragraphs: [{ text: bursGiris }],
        },
        {
          blockType: "cardGridSection" as const,
          heading: "İndirim oranları (%10)",
          note: "Kurum politikası gereği sitede ilgili gruplar için %10 indirim gösterilmektedir.",
          cards: bursIndirimleri.map((row) => ({
            label: row.label,
            value: `%${row.percent}`,
          })),
        },
      ],
    },
    // Tasarlanmış overlay sayfalar — sections boş; içerik page-templates + overlay seed’ten gelir.
    {
      title: "Nesil Tasavvurumuz",
      slug: "nesil-tasavvurumuz",
      pathPrefix: "kurumsal" as const,
      template: "overlay-story" as const,
      _status: "published" as const,
      intro: nesilTasavvurParagraflari[0],
      sections: [],
    },
    {
      title: "Kurumsal Kimliğimiz",
      slug: "kurumsal-kimligimiz",
      pathPrefix: "kurumsal" as const,
      template: "kurumsal-blok" as const,
      _status: "published" as const,
      intro:
        "İlimde âlim, ibâdette âbid, gayrette mücahit bir neslin yetiştiği çift kanatlı eğitim modeli.",
      // Statik KurumsalKurulusHikayesi + timeline + galeri için sections boş bırakılır.
      sections: [],
    },
    {
      title: "Kurumsal Değerlerimiz",
      slug: "kurumsal-degerlerimiz",
      pathPrefix: "kurumsal" as const,
      template: "overlay-story" as const,
      _status: "published" as const,
      intro: kurumsalDegerlerGiris[0],
      sections: [],
    },
    {
      title: "Niyetimiz ve İstikametimiz",
      slug: "niyetimiz-istikametimiz",
      pathPrefix: "kurumsal" as const,
      template: "overlay-story" as const,
      _status: "published" as const,
      intro: niyetimizParagraflari[0],
      sections: [],
    },
  ];

  for (const page of pages) {
    const existing = await payload.find({
      collection: "pages",
      where: { slug: { equals: page.slug } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "pages",
        id: existing.docs[0].id,
        data: page,
        draft: false,
      });
      console.log(`Sayfa güncellendi: ${page.slug}`);
    } else {
      await payload.create({
        collection: "pages",
        data: page,
        draft: false,
      });
      console.log(`Sayfa oluşturuldu: ${page.slug}`);
    }
  }

  console.log("Kurumsal sayfa seed tamamlandı.");
}

main().catch((err) => {
  console.error("Seed başarısız:", err);
  process.exit(1);
});
