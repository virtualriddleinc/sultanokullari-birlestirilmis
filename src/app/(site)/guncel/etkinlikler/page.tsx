import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { branches } from "@/content/branches";
import { PageShell } from "@/components/page-shell";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { getPublishedEvents } from "@/lib/guncel-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Etkinlik takvimi",
  description: "Yaklaşan etkinlikler ve tarihler.",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

function branchName(slug: string | null) {
  if (!slug) return "Tüm şubeler";
  return branches.find((b) => b.slug === slug)?.name ?? slug;
}

export default async function Page() {
  const events = await getPublishedEvents();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <PageShell
      title="Etkinlik takvimi"
      intro="Yaklaşan etkinlikler içerik yönetim panelinden güncellenir."
    >
      {sorted.length === 0 ? (
        <p className="text-zinc-600">
          Henüz yayınlanmış etkinlik bulunmuyor. Haberler için{" "}
          <Link
            href="/guncel/haberler"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            haberler
          </Link>{" "}
          sayfasına bakın.
        </p>
      ) : (
        <StaggerList className="space-y-4">
          {sorted.map((e) => (
            <StaggerItem
              key={e.id}
              className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="text-xs font-medium tracking-wide text-[var(--color-primary)] uppercase">
                  {formatDate(e.date)}
                </p>
                {e.slug ? (
                  <Link href={`/guncel/etkinlikler/${e.slug}`}>
                    <h2 className="mt-1 text-lg font-semibold text-zinc-900 hover:text-[var(--color-primary)]">
                      {e.title}
                    </h2>
                  </Link>
                ) : (
                  <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                    {e.title}
                  </h2>
                )}
                <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                  {e.excerpt}
                </p>
                {e.slug ? (
                  <Link
                    href={`/guncel/etkinlikler/${e.slug}`}
                    className="mt-2 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Detay →
                  </Link>
                ) : null}
              </div>
              <p className="shrink-0 text-sm text-zinc-500">
                {branchName(e.branchSlug)}
              </p>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
      <p className="mt-8 text-sm text-zinc-500">
        Medya arşivi:{" "}
        <Link
          href="/guncel/medya"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          Güncel medya
        </Link>
      </p>
    </PageShell>
  );
}
