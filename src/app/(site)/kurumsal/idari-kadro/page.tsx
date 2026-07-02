import type { Metadata } from "next";
import { IdariKadroGrid } from "@/components/kurumsal/idari-kadro-grid";
import { IdariKadroHero } from "@/components/kurumsal/idari-kadro-hero";
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
      <IdariKadroHero
        title="İdari kadro"
        intro="Kurum yönetimi ve idari ekip üyelerinin güncel listesi."
      />
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
        <IdariKadroGrid members={members} />
      </section>
    </article>
  );
}
