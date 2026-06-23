import type { Metadata } from "next";
import { olcmeGiris } from "@/content/olcme";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { PAGE_MEDIA } from "@/lib/menu-images";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Akademik Gelişim ve Takip",
};

export default function Page() {
  return (
    <PageShell
      title="Akademik Gelişim ve Takip"
      intro="Her evladımızın kabiliyetini emanet bilinciyle takip ediyor, ilmini ve gayretini adım adım büyütüyoruz."
      media={PAGE_MEDIA.akademikGelisim}
    >
      <ContentCard>
        <p className="section-body">{olcmeGiris}</p>
      </ContentCard>
      <p className="section-body mt-6">
        <Link
          href="/egitim/olcme-degerlendirme"
          className="text-brand-green font-semibold hover:underline"
        >
          Ölçme ve değerlendirme detayları →
        </Link>
      </p>
    </PageShell>
  );
}
