import { buildPageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { HexBadge } from "@/components/ui/hex-badge";
import { getNedenSultanItems } from "@/lib/home-data";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/kurumsal/neden-sultan",
  title: "Niçin Sultan Okulları?",
  description: "Kurum değerleri ve tercih nedenleri — 11 madde.",
});

export default async function Page() {
  const items = await getNedenSultanItems();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Kurumsal", path: "/kurumsal/hakkimizda" },
    { name: "Niçin Sultan Okulları?", path: "/kurumsal/neden-sultan" },
  ]);

  return (
    <PageShell
      title="Niçin Sultan Okulları?"
      intro="Temiz ve huzurlu ortamdan nebevî eğitime, doğa ile iç içe yaşamdan hâfızlık vizyonuna kadar on bir başlıkta özet."
    >
      <JsonLd data={breadcrumbs} />

      <div>
        <p className="section-eyebrow">Ayırt edici yaklaşım</p>
        <div className="mt-fluid-3 flex items-center gap-fluid-3 md:gap-fluid-4">
          <h2 className="font-cinzel text-charcoal min-w-0 flex-1 text-[length:var(--text-2xl)] font-bold text-balance md:text-[length:var(--text-3xl)]">
            On bir gerekçe, bir kurum dili
          </h2>
          <span className="hidden shrink-0 sm:block" aria-hidden>
            <HexBadge
              size="sm"
              className="bg-brand-green text-charcoal"
            >
              <span className="font-cinzel text-[length:var(--text-xs)] font-bold">
                {String(items.length).padStart(2, "0")}
              </span>
            </HexBadge>
          </span>
        </div>
        <p className="section-body mt-fluid-4 max-w-2xl">
          Ana sayfadaki petek özetinin tam metni — her madde, Sultan Okulları’nı
          tercih etmenin bir nedenini açar.
        </p>
      </div>

      <ContentCard className="mt-fluid-2">
        <StaggerList
          as="ol"
          className="divide-charcoal/10 list-none divide-y"
        >
          {items.map((item, i) => {
            const n = String(i + 1).padStart(2, "0");
            const isAccent = i % 3 === 0;

            return (
              <StaggerItem
                key={item.headline}
                className="grid gap-fluid-4 py-fluid-6 first:pt-0 last:pb-0 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-fluid-6"
              >
                <div className="flex items-center gap-fluid-3 sm:flex-col sm:items-center sm:gap-fluid-2">
                  <HexBadge
                    size="md"
                    className={cn(
                      "font-cinzel shrink-0 text-[length:var(--text-sm)] font-bold",
                      isAccent
                        ? "bg-brand-green text-charcoal"
                        : "bg-white/70 text-charcoal ring-1 ring-charcoal/10",
                    )}
                  >
                    {n}
                  </HexBadge>
                  <span className="font-cinzel text-charcoal/45 text-[length:var(--text-xs)] font-bold tracking-[0.18em] uppercase sm:hidden">
                    Madde {n}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="font-cinzel text-charcoal text-[length:var(--text-lg)] font-bold text-balance md:text-[length:var(--text-xl)]">
                    {item.headline}
                  </h3>
                  <p className="text-charcoal/85 mt-fluid-2 text-[length:var(--text-sm)] leading-relaxed md:text-[length:var(--text-base)]">
                    {item.body}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </ContentCard>
    </PageShell>
  );
}
