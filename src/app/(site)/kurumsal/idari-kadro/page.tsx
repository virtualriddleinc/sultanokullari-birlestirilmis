import type { Metadata } from "next";
import { IdariKadroGrid } from "@/components/kurumsal/idari-kadro-grid";
import { IdariKadroPageBackground } from "@/components/kurumsal/idari-kadro-page-background";
import { getStaffMembers } from "@/lib/staff-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İdari kadro",
  description: "Sultan Okulları yönetim ve idari ekip tanıtımları.",
};

export default async function Page() {
  const members = await getStaffMembers();

  return (
    <article className="relative isolate overflow-hidden bg-[var(--color-brand-green)]">
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
