import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { notFound } from "next/navigation";
import { BranchGallery } from "@/components/branch-gallery";
import { BranchContactBlock } from "@/components/iletisim/branch-contact-block";
import { branches, getBranchBySlug } from "@/content/branches";

export function generateStaticParams() {
  return branches.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBranchBySlug(slug);
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
  const branch = getBranchBySlug(slug);
  if (!branch) notFound();

  const mapsQuery = encodeURIComponent(branch.address);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Şubemiz
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-primary)] sm:text-4xl">
        {branch.name}
      </h1>
      <p className="mt-2 text-lg text-zinc-600">
        {branch.district} / {branch.city}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {branch.levels.map((lv) => (
          <span
            key={lv}
            className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]"
          >
            {lv}
          </span>
        ))}
      </div>

      <section className="mt-10 space-y-4 text-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900">İletişim</h2>
        <p>
          <span className="font-medium text-zinc-700">Adres:</span>{" "}
          {branch.address}
        </p>
        <p>
          <span className="font-medium text-zinc-700">Telefon:</span>{" "}
          <a
            className="text-[var(--color-primary)] hover:underline"
            href={`tel:${branch.phone.replace(/\s/g, "")}`}
          >
            {branch.phone}
          </a>
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/iletisim"
            className="inline-flex rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            İletişim / ön kayıt
          </Link>
          <a
            className="inline-flex rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Haritada aç
          </a>
        </div>
      </section>

      <BranchGallery branch={branch} />

      <section className="mt-12 border-t border-zinc-200 pt-10">
        <h2 className="text-lg font-semibold text-zinc-900">
          Şube ile iletişim formu
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Aşağıdaki form genel iletişim sunucu eylemini kullanır; şube alanı bu
          sayfa için ön doldurulmuştur.
        </p>
        <div className="mt-6">
          <BranchContactBlock branchSlug={branch.slug} />
        </div>
      </section>
    </article>
  );
}
