import type { Metadata } from "next";
import { sultandaYasam } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Sultanda Yaşam",
  description: sultandaYasam.intro,
};

export default function Page() {
  const { story, gallery } = sultandaYasam;

  return (
    <PageShell
      title="Sultanda Yaşam"
      intro={sultandaYasam.intro}
      media={PAGE_MEDIA.sultandaYasamVideo}
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
        items={pageGalleryMedia.sultandaYasam}
      />
    </PageShell>
  );
}
