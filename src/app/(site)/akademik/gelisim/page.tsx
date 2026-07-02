import type { Metadata } from "next";
import { akademikGelisim } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";
import Link from "@/components/navigation/site-link";

export const metadata: Metadata = {
  title: "Akademik Gelişim ve Tâkib",
  description: akademikGelisim.intro,
};

export default function Page() {
  const { story, gallery } = akademikGelisim;

  return (
    <PageShell
      title="Akademik Gelişim ve Tâkib"
      intro={akademikGelisim.intro}
      media={PAGE_MEDIA.akademikGelisim}
      mediaLayout="overlay"
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <p className="section-body mt-6">
        <Link
          href="/egitim/olcme-degerlendirme"
          className="text-brand-green font-semibold hover:underline"
        >
          Ölçme ve değerlendirme detayları →
        </Link>
      </p>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={pageGalleryMedia.akademikGelisim}
      />
    </PageShell>
  );
}
