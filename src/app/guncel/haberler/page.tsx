import type { Metadata } from "next";
import Link from "next/link";
import { staticNews } from "@/content/guncel";
import { PageShell } from "@/components/page-shell";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";

export const metadata: Metadata = {
  title: "Haberler ve duyurular",
  description: "Kurum haberleri ve duyurular.",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export default function Page() {
  return (
    <PageShell
      title="Haberler ve duyurular"
      intro="Statik veri kaynağından listelenen haberler; CMS bağlandığında güncellenebilir."
    >
      {staticNews.length === 0 ? (
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
        <StaggerList className="space-y-4">
          {staticNews.map((n) => (
            <StaggerItem
              key={n.id}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <p className="text-xs text-zinc-500">{formatDate(n.date)}</p>
              <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                {n.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600">{n.excerpt}</p>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </PageShell>
  );
}
