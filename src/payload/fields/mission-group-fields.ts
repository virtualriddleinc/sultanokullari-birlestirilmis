import type { Field } from "payload";

import { HERO_SLIDE_LIMITS } from "@/lib/hero-slide-limits";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { hexFocalPickerField } from "@/payload/fields/hex-focal-picker-field";
import {
  limitedText,
  limitedTextarea,
} from "@/payload/fields/limited-text-fields";

const { tagline, titleLine, description, buttonText } = HERO_SLIDE_LIMITS;

const DECOR_SLOT_OPTIONS = [
  { label: "Kademeler (sol üst)", value: "top-left" },
  { label: "Nebevî Eğitim (sağ üst)", value: "top-right" },
  { label: "Akademik Gelişim (sağ)", value: "right" },
  { label: "Rehberlik (alt)", value: "bottom" },
] as const;

function focalPointFields(): Field[] {
  return [
    hexFocalPickerField("hexFocalPicker", { mediaPathPrefix: "media" }),
    {
      name: "focalPoint",
      type: "group",
      label: "Odak noktası",
      fields: [
        {
          name: "x",
          type: "number",
          label: "X (%)",
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: { step: 1 },
        },
        {
          name: "y",
          type: "number",
          label: "Y (%)",
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: { step: 1 },
        },
      ],
    },
    {
      name: "mediaScale",
      type: "number",
      label: "Yakınlaştırma",
      defaultValue: 1,
      min: 1,
      max: 3,
      admin: { step: 0.05 },
    },
    {
      name: "mediaAspect",
      type: "number",
      label: "Medya en-boy oranı",
      admin: { readOnly: true },
    },
  ];
}

/** Ana Sayfa → Gâyemiz sekmesi mission group alanları */
export function missionGroupFields(): Field[] {
  return [
    {
      name: "decorCells",
      type: "array",
      label: "Bilgi kartları (petek hücreleri)",
      minRows: 0,
      maxRows: 4,
      labels: {
        singular: "Bilgi kartı",
        plural: "Bilgi kartları",
      },
      admin: {
        description:
          "Petek üzerine gelince yeşil kartta görünen içerik. Tüm kartları silebilirsiniz; boş bırakılırsa yeşil kart ancak hücre hover’ında dolu olur.",
        initCollapsed: true,
        components: {
          RowLabel:
            "@/components/payload/admin/MissionDecorCellRowLabel#default",
        },
      },
      fields: [
        {
          name: "slot",
          type: "select",
          label: "Konum",
          required: true,
          options: [...DECOR_SLOT_OPTIONS],
        },
        limitedText(
          { name: "tagline", label: "Üst etiket", required: true },
          tagline,
        ),
        limitedText(
          { name: "titleLine1", label: "Başlık satırı 1", required: true },
          titleLine,
        ),
        limitedText(
          { name: "titleLine2", label: "Başlık satırı 2", required: true },
          titleLine,
        ),
        limitedText(
          { name: "titleLine3", label: "Başlık satırı 3", required: true },
          titleLine,
        ),
        limitedTextarea(
          { name: "description", label: "Açıklama", required: true },
          description,
        ),
        limitedText(
          { name: "buttonText", label: "Buton metni", required: true },
          buttonText,
        ),
        {
          name: "buttonLink",
          type: "text",
          label: "Buton bağlantısı",
          required: true,
        },
        siteMediaField("media", "Hücre medyası", {
          required: true,
          hideDescriptions: true,
        }),
        ...focalPointFields(),
      ],
    },
    {
      name: "levels",
      type: "array",
      label: "Kademe hücreleri",
      maxRows: 3,
      minRows: 3,
      labels: {
        singular: "Kademe",
        plural: "Kademeler",
      },
      admin: {
        description: "Anaokulu, İlkokul, Ortaokul — sıra: üst / orta / sol alt.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Etiket",
          required: true,
          maxLength: 24,
        },
        limitedTextarea(
          { name: "description", label: "Açıklama", required: true },
          description,
        ),
        {
          name: "href",
          type: "text",
          label: "Bağlantı",
          required: true,
        },
        limitedText(
          {
            name: "ctaLabel",
            label: "CTA metni",
            admin: {
              description: 'Boş bırakılırsa "{Etiket} Programını Keşfet".',
            },
          },
          buttonText,
        ),
      ],
    },
  ];
}
