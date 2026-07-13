import type { FaqItem } from "@/lib/schema/types";

type PageFaqSectionProps = {
  title?: string;
  items: FaqItem[];
};

export function PageFaqSection({
  title = "Sık sorulan sorular",
  items,
}: PageFaqSectionProps) {
  if (!items.length) return null;

  return (
    <section className="mt-fluid-12 border-t border-zinc-200 pt-fluid-8">
      <h2 className="text-[length:var(--text-lg)] font-semibold text-[var(--color-primary)] md:text-[length:var(--text-xl)]">
        {title}
      </h2>
      <div className="mt-fluid-6 space-y-fluid-6">
        {items.map((item) => (
          <article key={item.question}>
            <h3 className="text-[length:var(--text-base)] font-semibold text-zinc-900">
              {item.question}
            </h3>
            <p className="snippet-lead mt-fluid-2 text-[length:var(--text-sm)] leading-relaxed text-zinc-700">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
