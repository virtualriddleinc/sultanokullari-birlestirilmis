import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { kurumsalDegerlerimiz } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { getPageBySlug } from "@/lib/pages-data";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/kurumsal/kurumsal-degerlerimiz",
  title: "Kurumsal Değerlerimiz",
  description: kurumsalDegerlerimiz.intro,
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageBySlug("kurumsal-degerlerimiz", {
    draft: isDraft,
  });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Kurumsal Değerlerimiz",
    intro: kurumsalDegerlerimiz.intro,
    story: kurumsalDegerlerimiz.story,
    gallery: {
      ...kurumsalDegerlerimiz.gallery,
      items: pageGalleryMedia.kurumsalDegerler,
    },
    heroMedia: PAGE_MEDIA.kurumsalDegerler,
  });
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Kurumsal", path: "/kurumsal/hakkimizda" },
    { name: "Kurumsal Değerlerimiz", path: "/kurumsal/kurumsal-degerlerimiz" },
  ]);

  return (
    <PageShell
      title={content.title}
      intro={content.intro ?? kurumsalDegerlerimiz.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.kurumsalDegerler}
      mediaLayout="overlay"
    >
      <JsonLd data={breadcrumbs} />
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </PageShell>
  );
}
