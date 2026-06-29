import type { Page } from "@/payload-types";
import { CmsRichText } from "@/components/cms/cms-rich-text";

type Section = NonNullable<Page["sections"]>[number];

export function CmsPageSections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((block, index) => {
        if (block.blockType === "textSection") {
          const sectionId = block.anchorId || `section-${index}`;
          return (
            <section
              key={block.id ?? index}
              id={sectionId}
              aria-labelledby={`${sectionId}-heading`}
              className="scroll-mt-32"
            >
              {block.heading ? (
                <h2
                  id={`${sectionId}-heading`}
                  className="text-lg font-semibold text-[var(--color-primary)]"
                >
                  {block.heading}
                </h2>
              ) : null}
              <div className={block.heading ? "mt-4 space-y-4" : "space-y-4"}>
                {block.paragraphs?.map((p, i) => (
                  <p key={p.id ?? i} className="text-zinc-700">
                    {p.text}
                  </p>
                ))}
              </div>
            </section>
          );
        }

        if (block.blockType === "timelineSection") {
          return (
            <section
              key={block.id ?? index}
              id="zaman-cizelgesi"
              aria-labelledby="zaman-baslik"
              className="mt-12 scroll-mt-32"
            >
              <h2
                id="zaman-baslik"
                className="text-lg font-semibold text-[var(--color-primary)]"
              >
                {block.heading ?? "Zaman çizelgesi"}
              </h2>
              <ol className="mt-6 space-y-6 border-l-2 border-[var(--color-primary)]/30 pl-6">
                {block.items?.map((t) => (
                  <li key={t.id ?? t.year} className="relative">
                    <span
                      className="absolute top-1.5 -left-[calc(0.5rem+6px)] w-3 bg-[var(--color-primary)]"
                      style={{
                        aspectRatio: "2 / 1.7320508075688772",
                        clipPath:
                          "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
                      }}
                      aria-hidden
                    />
                    <p className="text-xs font-semibold tracking-wide text-[var(--color-primary)] uppercase">
                      {t.year}
                    </p>
                    <p className="mt-1 font-medium text-zinc-900">{t.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{t.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          );
        }

        if (block.blockType === "cardGridSection") {
          return (
            <section key={block.id ?? index} className="mt-10">
              {block.heading ? (
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">
                  {block.heading}
                </h2>
              ) : null}
              {block.note ? (
                <p className="mt-2 text-sm text-zinc-600">{block.note}</p>
              ) : null}
              <ul className="mt-6 space-y-3">
                {block.cards?.map((row) => (
                  <li
                    key={row.id ?? row.label}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm"
                  >
                    <span className="text-zinc-800">{row.label}</span>
                    <span className="font-semibold text-[var(--color-primary)]">
                      {row.value}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.blockType === "richTextSection") {
          return (
            <section key={block.id ?? index} className="mt-10">
              {block.heading ? (
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">
                  {block.heading}
                </h2>
              ) : null}
              <CmsRichText
                data={block.body}
                className={block.heading ? "mt-4" : undefined}
              />
            </section>
          );
        }

        return null;
      })}
    </>
  );
}
