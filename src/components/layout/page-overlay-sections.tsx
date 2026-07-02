import { ContentCard } from "@/components/layout/content-card";
import { PageDividerSection } from "@/components/layout/page-divider-heading";
import { highlightText } from "@/lib/highlight-text";
import type { PageStoryRow } from "@/components/layout/page-story-section";

export function PageStoryRowsCard({
  rows,
}: {
  rows: readonly PageStoryRow[];
}) {
  return (
    <ContentCard className="mt-8">
      <div className="divide-charcoal/10 divide-y">
        {rows.map((row) => (
          <div
            key={row.eyebrow}
            className="grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-8"
          >
            <p className="font-cinzel text-charcoal/70 text-xs font-bold tracking-[0.16em] uppercase sm:text-sm">
              {row.eyebrow}
            </p>
            <p className="text-charcoal/90 text-lg leading-relaxed sm:text-xl">
              {highlightText(row.text, row.highlights)}
            </p>
          </div>
        ))}
      </div>
    </ContentCard>
  );
}

export function PageListSection({
  id,
  title,
  description,
  groups,
}: {
  id: string;
  title: string;
  description?: string;
  groups: readonly { title: string; items: readonly string[] }[];
}) {
  return (
    <PageDividerSection id={id} title={title} description={description}>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {groups.map((group) => (
          <ContentCard key={group.title}>
            <h3 className="font-cinzel text-charcoal text-lg font-bold">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-charcoal/85 flex gap-2 text-sm leading-relaxed sm:text-base"
                >
                  <span
                    className="bg-brand-green mt-2 size-1.5 shrink-0 rounded-full"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </ContentCard>
        ))}
      </div>
    </PageDividerSection>
  );
}
