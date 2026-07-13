import type { Field } from "payload";

type SiteMediaFieldOpts = {
  required?: boolean;
  /** Alan açıklama metinlerini gizle (özellikle hero slayt formu) */
  hideDescriptions?: boolean;
  /** Medya seçilince alternatif metni otomatik doldur */
  syncAltFromMedia?: boolean;
};

/** Statik public yolu veya Payload medya ilişkisi — ikisinden biri yeterli */
export const siteMediaField = (
  name: string,
  label: string,
  opts?: SiteMediaFieldOpts,
): Field => ({
  name,
  type: "group",
  label,
  admin: opts?.hideDescriptions
    ? undefined
    : {
        description:
          "Medya yükleyin veya public klasöründeki dosya yolunu girin. Video için poster yolu ekleyin.",
      },
  fields: [
    ...(opts?.syncAltFromMedia
      ? [
          {
            name: `${name}AltSync`,
            type: "ui" as const,
            admin: {
              components: {
                Field: {
                  path: "@/components/payload/admin/MediaAltSync#default",
                  clientProps: {
                    mediaPath: `${name}.media`,
                    altPath: `${name}.alt`,
                  },
                },
              },
            },
          },
        ]
      : []),
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
      admin: opts?.hideDescriptions
        ? undefined
        : {
            description:
              "Dosya yüklerseniz aşağıdaki yol alanına gerek kalmaz.",
          },
    },
    {
      name: "src",
      type: "text",
      label: "Dosya yolu (public)",
      admin: {
        description: opts?.hideDescriptions
          ? undefined
          : "Örn. /site-media/IMG-....jpg veya /videos/kademeler.mp4",
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
