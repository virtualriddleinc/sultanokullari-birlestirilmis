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
    <ContentCard className="mt-fluid-8">
      <div className="divide-charcoal/10 divide-y">
        {rows.map((row, index) => {
          const hasEyebrow = Boolean(row.eyebrow);
          return (
            <div
              key={row.eyebrow ?? `row-${index}`}
              className={
                hasEyebrow
                  ? "grid gap-fluid-4 py-fluid-6 first:pt-0 last:pb-0 md:grid-cols-[9rem_1fr] md:gap-fluid-8"
                  : "py-fluid-6 first:pt-0 last:pb-0"
              }
            >
              {hasEyebrow ? (
                <p className="font-cinzel text-charcoal/70 text-[length:var(--text-xs)] font-bold tracking-[0.16em] uppercase md:text-[length:var(--text-sm)]">
                  {row.eyebrow}
                </p>
              ) : null}
              <p className="text-charcoal/90 text-[length:var(--text-lg)] leading-relaxed md:text-[length:var(--text-xl)]">
                {highlightText(row.text, row.highlights)}
              </p>
            </div>
          );
        })}
      </div>
    </ContentCard>
  );
}

export function PageListSection({
  id,
  title,
  description,
  groups,
  gapClassName = "gap-fluid-6",
}: {
  id: string;
  title: string;
  description?: string;
  groups: readonly { title: string; items: readonly string[] }[];
  gapClassName?: string;
}) {
  return (
    <PageDividerSection id={id} title={title} description={description}>
      <div className={`mt-fluid-8 flex flex-col ${gapClassName}`}>
        {groups.map((group) => (
          <ContentCard key={group.title}>
            <div className="grid gap-fluid-4 md:grid-cols-[minmax(9rem,13rem)_1fr] md:items-start md:gap-fluid-8">
              <h3 className="font-cinzel text-charcoal text-[length:var(--text-lg)] font-bold md:pt-0.5">
                {group.title}
              </h3>
              <ul className="grid gap-x-fluid-6 gap-y-2 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-charcoal/85 flex gap-2 text-[length:var(--text-sm)] leading-relaxed md:text-[length:var(--text-base)]"
                  >
                    <span
                      className="bg-brand-green mt-2 size-1.5 shrink-0 rounded-full"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ContentCard>
        ))}
      </div>
    </PageDividerSection>
  );
}
