import type { Metadata } from "next";
import { yabanciDil } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";
import Link from "@/components/navigation/site-link";

export const metadata: Metadata = {
  title: "Yabancı Dil & Atölyeler",
  description: yabanciDil.intro,
};

export default function Page() {
  const { story, gallery } = yabanciDil;

  return (
    <PageShell
      title="Yabancı Dil & Atölyeler"
      intro={yabanciDil.intro}
      media={PAGE_MEDIA.yabanciDil}
      mediaLayout="overlay"
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <p className="section-body mt-6">
        <Link
          href="/atolyeler-ve-kulupler"
          className="text-brand-green font-semibold hover:underline"
        >
          Atölyeler ve kulüpler →
        </Link>
      </p>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={pageGalleryMedia.yabanciDil}
      />
    </PageShell>
  );
}
