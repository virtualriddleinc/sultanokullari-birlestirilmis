import { ContentCard } from "@/components/layout/content-card";
import { highlightText } from "@/lib/highlight-text";

export type PageStoryRow = {
  eyebrow: string;
  text: string;
  highlights: string[];
};

export function PageStorySection({
  eyebrow,
  motto,
  rows,
}: {
  eyebrow: string;
  motto: string;
  rows: readonly PageStoryRow[];
}) {
  return (
    <div>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="font-cinzel text-charcoal mt-3 text-2xl font-bold text-balance sm:text-3xl">
        {motto}
      </h2>

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
    </div>
  );
}
