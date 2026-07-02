import type { Metadata } from "next";
import { niyetimizIstikametimiz } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Niyetimiz ve İstikametimiz",
  description: niyetimizIstikametimiz.intro,
};

export default function Page() {
  const { story, gallery } = niyetimizIstikametimiz;

  return (
    <PageShell
      title="Niyetimiz ve İstikametimiz"
      intro={niyetimizIstikametimiz.intro}
      media={PAGE_MEDIA.niyetimiz}
      mediaLayout="overlay"
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={pageGalleryMedia.niyetimiz}
      />
    </PageShell>
  );
}
