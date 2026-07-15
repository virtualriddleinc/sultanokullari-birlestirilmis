import { buildPageMetadata } from "@/lib/seo/metadata";
import { IdariKadroGrid } from "@/components/kurumsal/idari-kadro-grid";
import { IdariKadroPageBackground } from "@/components/kurumsal/idari-kadro-page-background";
import { getStaffMembers } from "@/lib/staff-data";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/kurumsal/idari-kadro",
  title: "İdari kadro",
  description: "Sultan Okulları yönetim ve idari ekip tanıtımları.",
});

export default async function Page() {
  const members = await getStaffMembers();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Kurumsal", path: "/kurumsal/hakkimizda" },
    { name: "İdari Kadro", path: "/kurumsal/idari-kadro" },
  ]);
  return (
    <article className="relative isolate overflow-hidden bg-[var(--color-brand-green)]">
      <JsonLd data={breadcrumbs} />
      <IdariKadroPageBackground />
      <section className="relative z-10 py-fluid-8 sm:py-fluid-16">
        <div className="section-page-grid">
          <div className="section-page-grid__content">
            <IdariKadroGrid members={members} />
          </div>
        </div>
      </section>
    </article>
  );
}
