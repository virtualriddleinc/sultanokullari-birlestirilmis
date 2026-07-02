import type { Metadata } from "next";
import { rehberlikKocluk } from "@/content/page-templates";
import { pageGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { PageStorySection } from "@/components/layout/page-story-section";
import { PageListSection } from "@/components/layout/page-overlay-sections";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { PAGE_MEDIA } from "@/lib/menu-images";
import Link from "@/components/navigation/site-link";

export const metadata: Metadata = {
  title: "Rehberlik ve Eğitim Koçluğu",
  description: rehberlikKocluk.intro,
};

export default function Page() {
  const { story, gallery, calismaBasliklari } = rehberlikKocluk;

  return (
    <PageShell
      title="Rehberlik ve Eğitim Koçluğu"
      intro={rehberlikKocluk.intro}
      media={PAGE_MEDIA.rehberlikKocluk}
      mediaLayout="overlay"
    >
      <PageStorySection
        eyebrow={story.eyebrow}
        motto={story.motto}
        rows={story.rows}
      />
      <PageListSection
        id="rehberlik-calismalari"
        title="Rehberlik çalışmaları"
        description="Okul yönetimi, eğitim koordinatörü, sınıf danışman öğretmeni ve veli işbirliğiyle yürütülen başlıklar."
        groups={calismaBasliklari}
      />
      <p className="section-body mt-6">
        <Link
          href="/rehberlik"
          className="text-brand-green font-semibold hover:underline"
        >
          Tüm rehberlik içerikleri →
        </Link>
      </p>
      <KurumsalKimlikGalerisi
        title={gallery.title}
        description={gallery.description}
        items={pageGalleryMedia.rehberlikKocluk}
      />
    </PageShell>
  );
}
