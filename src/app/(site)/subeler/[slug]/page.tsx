import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { notFound } from "next/navigation";
import { WhatsAppContactButton } from "@/components/branch/whatsapp-contact-button";
import { BranchGallery } from "@/components/branch-gallery";
import { BranchContactBlock } from "@/components/iletisim/branch-contact-block";
import { PageShell } from "@/components/page-shell";
import {
  getBranchBySlugFromCms,
  getPublishedBranches,
} from "@/lib/branches-data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const branches = await getPublishedBranches();
  return branches.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBranchBySlugFromCms(slug);
  if (!b) return { title: "Şube" };
  return {
    title: b.name,
    description: `${b.district}, ${b.city} — ${b.levels.join(", ")}`,
  };
}

export default async function SubelerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = await getBranchBySlugFromCms(slug);
  if (!branch) notFound();

  const mapsQuery = encodeURIComponent(branch.address);

  return (
    <PageShell
      title={branch.name}
      intro={`${branch.district} – ${branch.city}`}
      bodyMotion="immediate"
    >
      <div className="flex flex-wrap gap-fluid-2">
        {branch.levels.map((lv) => (
          <span
            key={lv}
            className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-light)] px-3 py-1 text-[length:var(--text-xs)] font-semibold text-[var(--color-primary)]"
          >
            {lv}
          </span>
        ))}
      </div>

      <section className="mt-fluid-8 space-y-fluid-4 text-zinc-800">
        <h2 className="text-[length:var(--text-lg)] font-semibold text-zinc-900">
          İletişim
        </h2>
        <p className="text-[length:var(--text-base)]">
          <span className="font-medium text-zinc-700">Adres:</span>{" "}
          {branch.address}
        </p>
        <p className="text-[length:var(--text-base)]">
          <span className="font-medium text-zinc-700">Telefon:</span>{" "}
          <a
            className="inline-flex min-h-[44px] items-center text-[var(--color-primary)] hover:underline"
            href={`tel:${branch.phone.replace(/\s/g, "")}`}
          >
            {branch.phone}
          </a>
        </p>
        <div className="flex flex-wrap gap-fluid-3 pt-fluid-2">
          <Link
            href="/iletisim"
            className="inline-flex min-h-[44px] items-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-[length:var(--text-sm)] font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            İletişim / ön kayıt
          </Link>
          <a
            className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-300 px-4 py-2 text-[length:var(--text-sm)] font-semibold text-zinc-800 hover:bg-zinc-50"
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Haritada aç
          </a>
          <WhatsAppContactButton
            phone={branch.phone}
            className="min-h-[44px] rounded-md hover:bg-[#25D366]/10"
          />
        </div>
      </section>

      <BranchGallery branch={branch} />

      <section className="mt-fluid-12 border-t border-zinc-200 pt-fluid-8">
        <h2 className="text-[length:var(--text-lg)] font-semibold text-zinc-900">
          Şube ile iletişim formu
        </h2>
        <p className="mt-fluid-2 text-[length:var(--text-sm)] text-zinc-600">
          Aşağıdaki form genel iletişim sunucu eylemini kullanır; şube alanı bu
          sayfa için ön doldurulmuştur.
        </p>
        <div className="mt-fluid-6">
          <BranchContactBlock branchSlug={branch.slug} />
        </div>
      </section>
    </PageShell>
  );
}
