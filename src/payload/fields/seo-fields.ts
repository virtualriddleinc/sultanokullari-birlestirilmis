import type { Field } from "payload";

export const seoFields: Field[] = [
  {
    name: "seoTitle",
    type: "text",
    label: "SEO başlığı",
    maxLength: 60,
    admin: {
      description: "Boş bırakılırsa sayfa başlığı kullanılır. Önerilen: en fazla 60 karakter.",
    },
  },
  {
    name: "seoDescription",
    type: "textarea",
    label: "SEO açıklaması",
    maxLength: 155,
    admin: {
      description: "Boş bırakılırsa özet/giriş metni kullanılır. Önerilen: en fazla 155 karakter.",
    },
  },
  {
    name: "ogImage",
    type: "upload",
    relationTo: "media",
    label: "Paylaşım görseli (OG)",
    admin: {
      description: "Sosyal medya ve arama önizlemeleri için görsel.",
    },
  },
  {
    name: "noIndex",
    type: "checkbox",
    label: "Arama motorlarında indekslenmesin",
    defaultValue: false,
  },
  {
    name: "geoCitationSummary",
    type: "textarea",
    label: "GEO alıntı özeti",
    admin: {
      description:
        "Yapay zekâ motorlarının alıntılayabileceği 40–60 kelimelik özet metin.",
    },
  },
  {
    name: "faqItems",
    type: "array",
    label: "SSS / FAQ",
    admin: {
      description: "Sayfa bazlı soru-cevap çiftleri — FAQPage schema kaynağı.",
    },
    fields: [
      {
        name: "question",
        type: "text",
        label: "Soru",
        required: true,
      },
      {
        name: "answer",
        type: "textarea",
        label: "Cevap",
        required: true,
      },
    ],
  },
];

export const seoTab = {
  label: "SEO & GEO",
  fields: seoFields,
} as const;
