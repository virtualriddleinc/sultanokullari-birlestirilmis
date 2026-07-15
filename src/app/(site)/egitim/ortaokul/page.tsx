import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { ortaokulSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageDividerSection } from "@/components/layout/page-divider-heading";
import { PageStoryRowsCard } from "@/components/layout/page-overlay-sections";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { ortaokul } from "@/content/egitim";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/egitim/ortaokul",
  title: "Ortaokul",
  description:
    "Ortaokul programı; atölyeler, kulüpler, etüt ve değerler eğitimi.",
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "ortaokul", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Ortaokul",
    intro: ortaokulSayfasi.intro,
    story: ortaokulSayfasi.story,
    gallery: {
      ...ortaokulSayfasi.gallery,
      items: educationGalleryMedia.ortaokul,
    },
    heroMedia: PAGE_MEDIA.ortaokul,
  });
  const { etut } = ortaokulSayfasi;

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Eğitim", path: "/egitim/kademeler" },
    { name: "Ortaokul", path: "/egitim/ortaokul" },
  ]);
  return (
    <QuoteOverlayPageShell
      title={content.title}
      intro={content.intro ?? ortaokulSayfasi.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.ortaokul}
      quote={ortaokul.quote}
      quoteCitation={ortaokul.quoteCitation}
    >
      <JsonLd data={breadcrumbs} />
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <PageDividerSection
        id="etut-baslik"
        title="Etüt ve birebir çalışmalar"
      >
        <PageStoryRowsCard rows={[etut]} />
      </PageDividerSection>
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </QuoteOverlayPageShell>
  );
}
