import type { Metadata } from "next";
import { rehberlikGiris } from "@/content/rehberlik";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";
import Link from "@/components/navigation/site-link";

export const metadata: Metadata = {
  title: "Rehberlik ve Eğitim Koçluğu",
};

export default function Page() {
  return (
    <PageShell
      title="Rehberlik ve Eğitim Koçluğu"
      intro="Başarıdan ziyade şahsiyete odaklanan bir model uyguluyoruz"
      media={PAGE_MEDIA.rehberlikKocluk}
    >
      <ContentCard>
        <p className="section-body">{rehberlikGiris}</p>
      </ContentCard>
      <p className="section-body mt-6">
        <Link
          href="/rehberlik"
          className="text-brand-green font-semibold hover:underline"
        >
          Tüm rehberlik içerikleri →
        </Link>
      </p>
    </PageShell>
  );
}
