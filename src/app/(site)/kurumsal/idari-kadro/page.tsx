import type { Metadata } from "next";
import { IdariKadroGrid } from "@/components/kurumsal/idari-kadro-grid";
import { IdariKadroHero } from "@/components/kurumsal/idari-kadro-hero";
import { getStaffMembers } from "@/lib/staff-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İdari kadro",
  description: "Sultan Okulları yönetim ve idari ekip tanıtımları.",
};

export default async function Page() {
  const members = await getStaffMembers();

  return (
    <article className="relative">
      <IdariKadroHero
        title="İdari kadro"
        intro="Kurum yönetimi ve idari ekip üyelerinin güncel listesi."
      />
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <IdariKadroGrid members={members} />
      </section>
    </article>
  );
}
