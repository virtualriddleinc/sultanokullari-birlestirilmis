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
        <StaggerList className="space-y-fluid-4">
          {sorted.map((e) => (
            <StaggerItem
              key={e.id}
              className="flex flex-col gap-fluid-1 rounded-lg border border-zinc-200 bg-white p-fluid-4 md:flex-row md:items-start md:justify-between"
            >
              <div>
                <p className="text-[length:var(--text-xs)] font-medium tracking-wide text-[var(--color-primary)] uppercase">
                  {formatDate(e.date)}
                </p>
                {e.slug ? (
                  <Link
                    href={`/guncel/etkinlikler/${e.slug}`}
                    className="inline-flex min-h-[44px] items-center"
                  >
                    <h2 className="mt-fluid-1 text-[length:var(--text-lg)] font-semibold text-zinc-900 hover:text-[var(--color-primary)]">
                      {e.title}
                    </h2>
                  </Link>
                ) : (
                  <h2 className="mt-fluid-1 text-[length:var(--text-lg)] font-semibold text-zinc-900">
                    {e.title}
                  </h2>
                )}
                <p className="mt-fluid-2 max-w-2xl text-[length:var(--text-sm)] text-zinc-600">
                  {e.excerpt}
                </p>
                {e.slug ? (
                  <Link
                    href={`/guncel/etkinlikler/${e.slug}`}
                    className="mt-fluid-2 inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Detay →
                  </Link>
                ) : null}
              </div>
              <p className="shrink-0 text-[length:var(--text-sm)] text-zinc-500">
                {branchName(e.branchSlug)}
              </p>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
      <p className="mt-fluid-8 text-[length:var(--text-sm)] text-zinc-500">
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
