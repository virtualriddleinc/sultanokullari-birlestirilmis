import type { Metadata } from "next";
import { veliSayfasi } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Sultanda Veli Olmak & Veli Akademisi",
  description: veliSayfasi.intro,
};

export default function Page() {
  const { story, gallery } = veliSayfasi;

  return (
    <PageShell
      title="Sultanda Veli Olmak & Veli Akademisi"
      intro={veliSayfasi.intro}
      media={PAGE_MEDIA.veli}
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
        items={pageGalleryMedia.veli}
      />
    </PageShell>
  );
}
