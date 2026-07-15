import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "@/components/navigation/site-link";
import { PageShell } from "@/components/page-shell";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { getPublishedNews } from "@/lib/guncel-data";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/guncel/haberler",
  title: "Haberler ve duyurular",
  description: "Kurum haberleri ve duyurular.",
});

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export default async function Page() {
  const news = await getPublishedNews();

  return (
    <PageShell
      title="Haberler ve duyurular"
      intro="Yayınlanmış haber ve duyurular içerik yönetim panelinden güncellenir."
    >
      {news.length === 0 ? (
        <p className="text-zinc-600">
          Henüz yayınlanmış haber bulunmuyor. Etkinlikler için{" "}
          <Link
            href="/guncel/etkinlikler"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            etkinlikler
          </Link>{" "}
          sayfasına bakın.
        </p>
      ) : (
        <StaggerList className="space-y-fluid-4">
          {news.map((n) => (
            <StaggerItem
              key={n.id}
              className="rounded-lg border border-zinc-200 bg-white p-fluid-4"
            >
              <p className="text-[length:var(--text-xs)] text-zinc-500">
                {formatDate(n.date)}
              </p>
              {n.slug ? (
                <Link
                  href={`/guncel/haberler/${n.slug}`}
                  className="inline-flex min-h-[44px] items-center"
                >
                  <h2 className="mt-fluid-1 text-[length:var(--text-lg)] font-semibold text-zinc-900 hover:text-[var(--color-primary)]">
                    {n.title}
                  </h2>
                </Link>
              ) : (
                <h2 className="mt-fluid-1 text-[length:var(--text-lg)] font-semibold text-zinc-900">
                  {n.title}
                </h2>
              )}
              <p className="mt-fluid-2 text-[length:var(--text-sm)] text-zinc-600">
                {n.excerpt}
              </p>
              {n.slug ? (
                <Link
                  href={`/guncel/haberler/${n.slug}`}
                  className="mt-fluid-3 inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-primary)] hover:underline"
                >
                  Devamını oku →
                </Link>
              ) : null}
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </PageShell>
  );
}
