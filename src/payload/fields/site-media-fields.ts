import type { Field } from "payload";

/** Statik public yolu veya Payload medya ilişkisi — ikisinden biri yeterli */
export const siteMediaField = (
  name: string,
  label: string,
  opts?: { required?: boolean },
): Field => ({
  name,
  type: "group",
  label,
  admin: {
    description:
      "Medya yükleyin veya public klasöründeki dosya yolunu girin. Video için poster yolu ekleyin.",
  },
  fields: [
    {
      name: "kind",
      type: "select",
      label: "Medya türü",
      defaultValue: "image",
      options: [
        { label: "Görsel", value: "image" },
        { label: "Video", value: "video" },
      ],
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      label: "Yüklenen dosya",
      admin: {
        description:
          "Dosya yüklerseniz aşağıdaki yol alanına gerek kalmaz.",
      },
    },
    {
      name: "src",
      type: "text",
      label: "Dosya yolu (public)",
      admin: {
        description: "Örn. /site-media/IMG-....jpg veya /videos/kademeler.mp4",
        condition: (_, siblingData) => !siblingData?.media,
      },
    },
    {
      name: "alt",
      type: "text",
      label: "Alternatif metin",
      required: opts?.required,
    },
    {
      name: "poster",
      type: "text",
      label: "Video poster yolu",
      admin: {
        condition: (_, siblingData) => siblingData?.kind === "video",
      },
    },
  ],
});
