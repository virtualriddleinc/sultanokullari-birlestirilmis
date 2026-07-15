import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { nebevi } from "@/content/egitim";
import { nebeviEgitimSayfasi } from "@/content/page-templates";
import { educationGalleryMedia } from "@/content/site-media";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { QuoteOverlayPageShell } from "@/components/layout/quote-overlay-page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/egitim/nebevi-egitim",
  title: "Nebevî Eğitim",
  description:
    "Üsve-i hasene Efendimizi rehber alan, siyer ve Peygamber (s.a.s) Ahlâkı dersleriyle bütünleşik nebevî eğitim programı.",
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "nebevi-egitim", {
    draft: isDraft,
  });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Nebevî Eğitim ve Hâl Dili",
    intro: nebeviEgitimSayfasi.intro,
    story: nebeviEgitimSayfasi.story,
    gallery: {
      ...nebeviEgitimSayfasi.gallery,
      items: educationGalleryMedia.nebevi,
    },
    heroMedia: PAGE_MEDIA.nebeviEgitim,
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Eğitim", path: "/egitim/kademeler" },
    { name: "Nebevî Eğitim", path: "/egitim/nebevi-egitim" },
  ]);
  return (
    <QuoteOverlayPageShell
      title={content.title}
      intro={content.intro ?? nebeviEgitimSayfasi.intro}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.nebeviEgitim}
      quote={nebevi.quote}
      quoteFullWidth
    >
      <JsonLd data={breadcrumbs} />
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />
      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Nebevî eğitim yöntemimiz"
        description="Programımızın omurgasını oluşturan kavramlar — Efendimizin asrına uzanan eğitim dilimizi özetliyor."
        items={nebevi.accordion}
        theme="teal"
        itemsLayout="honeycomb"
      />
      <p className="section-body mt-6 text-sm text-zinc-500">{nebevi.not}</p>
      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </QuoteOverlayPageShell>
  );
}
