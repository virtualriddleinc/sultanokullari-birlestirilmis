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
} from "@/content/kurumsal";

async function main() {
  const { getPayloadClient } = await import("@/lib/payload");
  const payload = await getPayloadClient();

  const pages = [
    {
      title: "Hakkımızda",
      slug: "hakkimizda",
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
    {
      title: "Nesil Tasavvurumuz",
      slug: "nesil-tasavvurumuz",
      intro: "Yetişmesini hedeflediğimiz neslin tasavvuru ve ufku.",
      sections: [
        {
          blockType: "textSection" as const,
          paragraphs: [{ text: kurulusParagraflari[2] ?? kurulusParagraflari[0] }],
        },
      ],
    },
    {
      title: "Kurumsal Kimliğimiz",
      slug: "kurumsal-kimligimiz",
      intro:
        "İlimde âlim, ibadette âbid, gayrette mücahit bir neslin yetiştiği çift kanatlı eğitim modeli.",
      sections: [
        {
          blockType: "textSection" as const,
          paragraphs: kurulusParagraflari.map((text) => ({ text })),
        },
      ],
    },
    {
      title: "Kurumsal Değerlerimiz",
      slug: "kurumsal-degerlerimiz",
      intro: "Sultan Okulları'nın temel değerleri ve eğitim anlayışı.",
      sections: [
        {
          blockType: "textSection" as const,
          paragraphs: [{ text: kurulusParagraflari[0] }],
        },
      ],
    },
    {
      title: "Niyetimiz ve İstikametimiz",
      slug: "niyetimiz-istikametimiz",
      intro: "Kurum niyeti ve eğitim istikametimiz.",
      sections: [
        {
          blockType: "textSection" as const,
          paragraphs: [{ text: kurucuMesajiNotu }],
        },
      ],
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
      });
      console.log(`Sayfa güncellendi: ${page.slug}`);
    } else {
      await payload.create({
        collection: "pages",
        data: page,
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
