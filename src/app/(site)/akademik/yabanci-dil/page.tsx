import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";
import Link from "@/components/navigation/site-link";

export const metadata: Metadata = {
  title: "Yabancı Dil & Atölyeler",
};

export default function Page() {
  return (
    <PageShell title="Yabancı Dil & Atölyeler" media={PAGE_MEDIA.yabanciDil}>
      <ContentCard>
        <p className="section-body">
          Öğrencilerimizin ilgi ve yeteneklerini keşfetmelerine yönelik atölye
          ve kulüp envanterimiz. Kategoriye göre filtreleyebilir, bir altıgene
          tıklayarak ayrıntıları görebilirsiniz.
        </p>
      </ContentCard>
      <p className="section-body mt-6">
        <Link
          href="/atolyeler-ve-kulupler"
          className="text-brand-green font-semibold hover:underline"
        >
          Atölyeler ve kulüpler →
        </Link>
      </p>
    </PageShell>
  );
}
