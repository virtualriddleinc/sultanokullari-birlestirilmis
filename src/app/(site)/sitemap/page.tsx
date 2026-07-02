import type { Metadata } from "next";

import { SiteMapContent } from "@/components/sitemap/site-map-content";
import { PageShell } from "@/components/page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Site Haritası",
  description:
    "Sultan Okulları web sitesindeki tüm sayfaların kategorik listesi. Kurumsal, eğitim, akademik, rehberlik, kampüsler ve yasal sayfalara hızlı erişim.",
  path: "/sitemap",
});

export default function SitemapPage() {
  return (
    <PageShell
      title="Site Haritası"
      intro="Sultan Okulları web sitesindeki tüm bölümlere kolayca erişin. Sayfalarımızın kategorik ve düzenli listesi."
      bodyMotion="immediate"
    >
      <SiteMapContent />
    </PageShell>
  );
}
