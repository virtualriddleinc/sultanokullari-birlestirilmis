import type { ReactNode } from "react";
import { ContentCard } from "@/components/layout/content-card";
import { highlightText } from "@/lib/highlight-text";

export type PageStoryRow = {
  /** Satır başlığı — yoksa tek sütun metin düzeni kullanılır. */
  eyebrow?: string;
  text: string;
  highlights: string[];
};

export function PageStorySection({
  eyebrow,
  motto,
  mottoTrailing,
  rows,
}: {
  eyebrow: string;
  motto: string;
  /** Motto başlığının sağına eklenen süsleme. */
  mottoTrailing?: ReactNode;
  rows: readonly PageStoryRow[];
}) {
  return (
    <div>
      <p className="section-eyebrow">{eyebrow}</p>
      <div className="mt-fluid-3 flex items-center gap-fluid-3 md:gap-fluid-4">
        <h2 className="font-cinzel text-charcoal min-w-0 flex-1 text-[length:var(--text-2xl)] font-bold text-balance md:text-[length:var(--text-3xl)]">
          {motto}
        </h2>
        {mottoTrailing}
      </div>

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
    </div>
  );
}
