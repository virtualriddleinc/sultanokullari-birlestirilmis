import type { GlobalConfig } from "payload";

import { ADMIN_GROUPS, ICON_KEY_OPTIONS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { globalReadAccess } from "@/payload/access";
import { revalidateAnaSayfaAfterChange } from "@/payload/hooks/collection-hooks";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { sectionPreviewField } from "@/payload/fields/section-preview-field";

export const AnaSayfa: GlobalConfig = {
  slug: "ana-sayfa",
  label: "Ana Sayfa Düzeni",
  hooks: {
    afterChange: [revalidateAnaSayfaAfterChange],
  },
  admin: {
    group: ADMIN_GROUPS.home,
    description:
      "Ana sayfadaki sabit bölüm başlıkları, metinler ve medya ayarları. Tekrarlayan içerik (slaytlar, yolculuk vb.) ilgili koleksiyonlardan yönetilir.",
    livePreview: {
      url: () => buildPreviewUrl("/"),
    },
  },
  access: globalReadAccess,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "2 · Gâyemiz · Ufkumuz",
          description: "Site: ana sayfa Gâyemiz bölümü — kayıttan sonra / adresinde anında yansır.",
          fields: [
            sectionPreviewField(
              "gayemizPreview",
              "@/components/payload/admin/SectionPreviewLink#GayemizSectionPreview",
            ),
            {
              name: "mission",
              type: "group",
              label: "Gâyemiz · Ufkumuz",
              fields: [
                {
                  name: "tagline",
                  type: "text",
                  label: "Üst etiket",
                  required: true,
                },
                {
                  name: "titleLine1",
                  type: "text",
                  label: "Başlık satırı 1",
                  required: true,
                  maxLength: 80,
                },
                {
                  name: "titleLine2",
                  type: "text",
                  label: "Başlık satırı 2",
                  required: true,
                  maxLength: 80,
                },
                {
                  name: "titleLine3",
                  type: "text",
                  label: "Başlık satırı 3",
                  maxLength: 80,
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Açıklama",
                  required: true,
                },
                {
                  name: "secondaryDescription",
                  type: "textarea",
                  label: "İkincil açıklama",
                },
                {
                  name: "levels",
                  type: "array",
                  label: "Kademe etiketleri",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      label: "Etiket",
                      required: true,
                    },
                  ],
                },
                {
                  name: "decorMedia",
                  type: "array",
                  label: "Petek dekor görselleri",
                  maxRows: 6,
                  fields: [siteMediaField("media", "Medya")],
                },
              ],
            },
          ],
        },
        {
          label: "3 · Yolculuk",
          description: "Levha başlığı burada; paneller 3 · Yolculuk Bölümleri koleksiyonundan gelir.",
          fields: [
            sectionPreviewField(
              "yolculukPreview",
              "@/components/payload/admin/SectionPreviewLink#YolculukSectionPreview",
            ),
            {
              name: "journey",
              type: "group",
              label: "Yolculuk",
              fields: [
                {
                  name: "headline",
                  type: "text",
                  label: "Levha başlığı",
                  required: true,
                  maxLength: 120,
                },
              ],
            },
          ],
        },
        {
          label: "4 · Neden Sultan",
          description: "Başlık/metin burada; petek maddeleri 4 · Neden Sultan Maddeleri koleksiyonundan.",
          fields: [
            sectionPreviewField(
              "nedenPreview",
              "@/components/payload/admin/SectionPreviewLink#NedenSectionPreview",
            ),
            {
              name: "neden",
              type: "group",
              label: "Neden Sultan",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Üst satır",
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  label: "Başlık",
                  required: true,
                  maxLength: 100,
                },
                {
                  name: "titleHighlight",
                  type: "text",
                  label: "Vurgulu başlık parçası",
                  maxLength: 60,
                  admin: {
                    description: 'Örn. "Sultan Okulları?" — yeşil renkte gösterilir.',
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Açıklama",
                  required: true,
                },
                {
                  name: "ctaLabel",
                  type: "text",
                  label: "Bağlantı etiketi",
                  required: true,
                },
                {
                  name: "ctaHref",
                  type: "text",
                  label: "Bağlantı adresi",
                  required: true,
                },
                {
                  name: "marqueeValues",
                  type: "array",
                  label: "Marquee değerleri",
                  fields: [
                    {
                      name: "value",
                      type: "text",
                      label: "Değer",
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "5 · Tanıtım Videosu",
          description: "Tanıtım videosu bölümü — kayıttan sonra ana sayfada anında güncellenir.",
          fields: [
            sectionPreviewField(
              "videoPreview",
              "@/components/payload/admin/SectionPreviewLink#VideoSectionPreview",
            ),
            {
              name: "videoSection",
              type: "group",
              label: "Tanıtım Videosu",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Üst satır",
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  label: "Başlık",
                  required: true,
                  maxLength: 100,
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Açıklama",
                  required: true,
                },
                {
                  name: "ctaLabel",
                  type: "text",
                  label: "Bağlantı etiketi",
                  required: true,
                },
                {
                  name: "ctaHref",
                  type: "text",
                  label: "Bağlantı adresi",
                  required: true,
                },
                siteMediaField("featuredVideo", "Tanıtım videosu", {
                  required: true,
                }),
              ],
            },
          ],
        },
        {
          label: "6 · Okullarımız",
          description: "Bölüm başlıkları burada; şube kartları Şubeler koleksiyonundan gelir.",
          fields: [
            sectionPreviewField(
              "okullarimizPreview",
              "@/components/payload/admin/SectionPreviewLink#OkullarimizSectionPreview",
            ),
            {
              name: "branchesSection",
              type: "group",
              label: "Okullarımız",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Üst satır",
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  label: "Başlık",
                  required: true,
                  maxLength: 100,
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Açıklama",
                  required: true,
                },
                {
                  name: "ctaLabel",
                  type: "text",
                  label: "Bağlantı etiketi",
                  required: true,
                },
                {
                  name: "ctaHref",
                  type: "text",
                  label: "Bağlantı adresi",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "7 · Güncel",
          description: "Bölüm başlıkları; haber/etkinlik listesi Haberler ve Etkinlikler koleksiyonundan (yayınlanmış).",
          fields: [
            sectionPreviewField(
              "guncelPreview",
              "@/components/payload/admin/SectionPreviewLink#GuncelSectionPreview",
            ),
            {
              name: "guncelSection",
              type: "group",
              label: "Güncel",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Üst satır",
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  label: "Başlık",
                  required: true,
                  maxLength: 100,
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Açıklama",
                  required: true,
                },
                {
                  name: "ctaLabel",
                  type: "text",
                  label: "Bağlantı etiketi",
                  required: true,
                },
                {
                  name: "ctaHref",
                  type: "text",
                  label: "Bağlantı adresi",
                  required: true,
                },
                {
                  name: "featuredEventLabel",
                  type: "text",
                  label: "Öne çıkan etkinlik etiketi",
                },
                {
                  name: "upcomingEventsLabel",
                  type: "text",
                  label: "Yaklaşan etkinlikler başlığı",
                },
                {
                  name: "newsLabel",
                  type: "text",
                  label: "Haberler başlığı",
                },
                siteMediaField("featuredEventMedia", "Öne çıkan etkinlik arka planı"),
              ],
            },
          ],
        },
        {
          label: "8 · Instagram",
          description: "Bölüm başlıkları; gönderiler 8 · Instagram Gönderileri koleksiyonundan.",
          fields: [
            sectionPreviewField(
              "instagramPreview",
              "@/components/payload/admin/SectionPreviewLink#InstagramSectionPreview",
            ),
            {
              name: "instagramSection",
              type: "group",
              label: "Instagram",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Üst satır",
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  label: "Başlık",
                  required: true,
                  maxLength: 100,
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Açıklama",
                  required: true,
                },
                {
                  name: "handle",
                  type: "text",
                  label: "Instagram kullanıcı adı",
                  required: true,
                },
                {
                  name: "profileUrl",
                  type: "text",
                  label: "Profil bağlantısı",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "9 · Kısa Yollar",
          description: "Alt kısımdaki hızlı bağlantı kartları — sıra ve ikon buradan düzenlenir.",
          fields: [
            sectionPreviewField(
              "kisaYollarPreview",
              "@/components/payload/admin/SectionPreviewLink#KisaYollarSectionPreview",
            ),
            {
              name: "quickLinksSection",
              type: "group",
              label: "Kısa Yollar",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Üst satır",
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  label: "Başlık",
                  required: true,
                  maxLength: 100,
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Açıklama",
                  required: true,
                },
                {
                  name: "links",
                  type: "array",
                  label: "Bağlantılar",
                  fields: [
                    {
                      name: "href",
                      type: "text",
                      label: "Adres",
                      required: true,
                    },
                    {
                      name: "label",
                      type: "text",
                      label: "Etiket",
                      required: true,
                    },
                    {
                      name: "description",
                      type: "text",
                      label: "Alt açıklama",
                      required: true,
                    },
                    {
                      name: "iconKey",
                      type: "select",
                      label: "İkon",
                      options: [...ICON_KEY_OPTIONS],
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Sizi Arayalım Modal",
          description: "Açılış pop-up formu — gönderiler Gelen Kutusu → İletişim Mesajları'nda listelenir.",
          fields: [
            {
              name: "infoModal",
              type: "group",
              label: "Sizi Arayalım Modal",
              fields: [
                {
                  name: "enabled",
                  type: "checkbox",
                  label: "Modal etkin",
                  defaultValue: true,
                },
                {
                  name: "brandLabel",
                  type: "text",
                  label: "Marka etiketi",
                },
                {
                  name: "title",
                  type: "text",
                  label: "Başlık",
                  required: true,
                  maxLength: 120,
                },
                {
                  name: "subtitle",
                  type: "textarea",
                  label: "Alt metin",
                  required: true,
                },
                {
                  name: "submitLabel",
                  type: "text",
                  label: "Gönder butonu metni",
                  required: true,
                },
                {
                  name: "dismissLabel",
                  type: "text",
                  label: "Ertele butonu metni",
                },
                {
                  name: "kvkkText",
                  type: "textarea",
                  label: "KVKK onay metni",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
