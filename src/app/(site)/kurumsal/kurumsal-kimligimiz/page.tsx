import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { kurumsalTimeline } from "@/content/kurumsal";
import { kurumsalKimlikGalleryMedia } from "@/content/site-media";
import { CmsPageSections } from "@/components/cms/cms-page-sections";
import { PageShell } from "@/components/page-shell";
import { KurumsalKurulusHikayesi } from "@/components/kurumsal/kurumsal-kurulus-hikayesi";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { KurumsalTimelineSection } from "@/components/kurumsal/kurumsal-timeline-section";
import { getPageBySlug } from "@/lib/pages-data";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/kurumsal/kurumsal-kimligimiz",
  title: "Kurumsal Kimliğimiz",
  description: "Sultan Okulları kuruluş ve kurumsal kimlik.",
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageBySlug("kurumsal-kimligimiz", { draft: isDraft });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Kurumsal", path: "/kurumsal/hakkimizda" },
    { name: "Kurumsal Kimliğimiz", path: "/kurumsal/kurumsal-kimligimiz" },
  ]);

  if (cmsPage?.sections?.length) {
    return (
      <PageShell title={cmsPage.title} intro={cmsPage.intro ?? undefined}>
        <JsonLd data={breadcrumbs} />
        <CmsPageSections sections={cmsPage.sections} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Kurumsal Kimliğimiz"
      intro="İlimde âlim, ibâdette âbid, gayrette mücahit bir neslin yetiştiği çift kanatlı eğitim modeli"
      media={PAGE_MEDIA.kurumsalKimlik}
      mediaLayout="overlay"
    >
      <JsonLd data={breadcrumbs} />
      <KurumsalKurulusHikayesi />
      <KurumsalTimelineSection items={kurumsalTimeline} />
      <KurumsalKimlikGalerisi items={kurumsalKimlikGalleryMedia} />
    </PageShell>
  );
}
