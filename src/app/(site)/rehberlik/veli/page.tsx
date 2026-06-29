import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Sultanda Veli Olmak & Veli Akademisi",
};

export default function Page() {
  return (
    <PageShell
      title="Sultanda Veli Olmak & Veli Akademisi"
      intro="Başarıdan ziyade şahsiyete odaklanan bir model uyguluyoruz"
      media={PAGE_MEDIA.veli}
    >
      <ContentCard>
        <p className="section-body">
          Çocuklarımızın ruhsal ve bedensel gelişiminde doğru rehberliğin hayati
          önem taşıdığının bilincindeyiz.
        </p>
      </ContentCard>
    </PageShell>
  );
}
