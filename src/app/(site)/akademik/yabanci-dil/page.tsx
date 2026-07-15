import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { ciftDil } from "@/content/egitim";
import { yabanciDil } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { OrnamentalQuote } from "@/components/egitim/ornamental-quote";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { getPageByPath } from "@/lib/pages-data";
import Link from "@/components/navigation/site-link";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

const MERGED_INTRO =
  "Arapça ve İngilizce; alanında uzman yabancı öğretmenlerle okul öncesi kademesinden itibaren dinleme, anlama, konuşma, okuma ve yazma becerilerinin tümünü dengeli geliştiren program.";

const galleryItems = [
  ...pageGalleryMedia.yabanciDil,
  ...educationGalleryMedia.ciftDil.filter(
    (item) =>
      !pageGalleryMedia.yabanciDil.some((existing) => existing.src === item.src),
  ),
];

export const metadata = buildPageMetadata({
  path: "/akademik/yabanci-dil",
  title: "Yabancı Dil & Atölyeler",
  description: MERGED_INTRO,
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("akademik", "yabanci-dil", {
    draft: isDraft,
  });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Yabancı Dil & Atölyeler",
    intro: MERGED_INTRO,
    story: yabanciDil.story,
    gallery: {
      title: yabanciDil.gallery.title,
      description: yabanciDil.gallery.description,
      items: galleryItems,
    },
    heroMedia: PAGE_MEDIA.yabanciDil,
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Akademik", path: "/akademik/gelisim" },
    { name: "Yabancı Dil & Atölyeler", path: "/akademik/yabanci-dil" },
  ]);
  return (
    <PageShell
      title={content.title}
      intro={content.intro ?? MERGED_INTRO}
      media={toPageMedia(content.heroMedia) ?? PAGE_MEDIA.yabanciDil}
      mediaLayout="overlay"
    >
      <JsonLd data={breadcrumbs} />
      <PageStorySection
        eyebrow={content.story.eyebrow}
        motto={content.story.motto}
        rows={content.story.rows}
      />

      <OrnamentalQuote
        quote={ciftDil.motto}
        citation={ciftDil.mottoCitation}
        className="mt-fluid-8"
      />

      <PedagojiSection
        eyebrow="Pedagojik yaklaşımımız"
        title="Çift dilli yarınların yöntemi"
        description="İki dilin de doğal akışta yaşandığı sürekli bir dil yolculuğu."
        items={ciftDil.accordion}
        theme="sky"
      />

      <p className="section-body mt-fluid-6 text-sm text-zinc-500">
        {ciftDil.not}
      </p>

      <p className="section-body mt-fluid-6">
        <Link
          href="/atolyeler-ve-kulupler"
          className="text-brand-green font-semibold hover:underline"
        >
          Atölyeler ve kulüpler →
        </Link>
      </p>

      <KurumsalKimlikGalerisi
        title={content.gallery.title}
        description={content.gallery.description}
        items={content.gallery.items}
      />
    </PageShell>
  );
}
