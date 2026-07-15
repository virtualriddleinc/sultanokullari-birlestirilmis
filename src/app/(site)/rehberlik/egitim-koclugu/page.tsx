import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { rehberlikKocluk } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { PageListSection } from "@/components/layout/page-overlay-sections";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildHowToSchema } from "@/lib/schema/how-to";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/rehberlik/egitim-koclugu",
  title: "Rehberlik ve Eğitim Koçluğu",
  description: rehberlikKocluk.intro,
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("rehberlik", "egitim-koclugu", {
    draft: isDraft,
  });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Rehberlik ve Eğitim Koçluğu",
    intro: rehberlikKocluk.intro,
    story: rehberlikKocluk.story,
    gallery: {
      ...rehberlikKocluk.gallery,
      items: pageGalleryMedia.rehberlikKocluk,
    },
    heroMedia: PAGE_MEDIA.rehberlikKocluk,
  });
  const { calismaBasliklari } = rehberlikKocluk;

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Rehberlik & Veli", path: "/rehberlik/egitim-koclugu" },
    { name: "Rehberlik ve Eğitim Koçluğu", path: "/rehberlik/egitim-koclugu" },
  ]);
  const howTo = buildHowToSchema({
    name: "Sultan Okulları Rehberlik ve Eğitim Koçluğu Süreci",
    description:
      "Başarıdan ziyade şahsiyete odaklanan bütüncül rehberlik modeli; öğrenci, veli ve öğretmen iş birliğiyle üç eksen üzerinde yürütülür.",
    path: "/rehberlik/egitim-koclugu",
    steps: [
      {
        name: "Öğrenci Koçluğu",
        text: "Okula uyum, bireysel danışmanlık, sınıf-grup rehberliği ve akademik-sosyal-duygusal gelişimi destekleyici çalışmalar.",
      },
      {
        name: "Veli Koçluğu",
        text: "Veli tanıma görüşmeleri, seminerler, sosyal etkinlikler, ebeveyn kitap buluşmaları ve bireysel danışmanlık hizmeti.",
      },
      {
        name: "Öğretmen Koçluğu",
        text: "Mesleki ve kişisel gelişim, seminerler, sempozyumlar ve bireysel danışmanlık ile okul-aile-öğrenci üçgenini pekiştirme.",
      },
    ],
  });
  return (
    <PageShell
      title={content.title}
      intro={content.intro ?? rehberlikKocluk.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.rehberlikKocluk}
      mediaLayout="overlay"
    >
      <JsonLd data={[breadcrumbs, howTo]} />
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <PageListSection
        id="rehberlik-calismalari"
        title="Rehberlik çalışmaları"
        description="Okul yönetimi, eğitim koordinatörü, sınıf danışman öğretmeni ve veli işbirliğiyle yürütülen başlıklar."
        groups={calismaBasliklari}
        gapClassName="gap-fluid-12"
      />
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </PageShell>
  );
}
