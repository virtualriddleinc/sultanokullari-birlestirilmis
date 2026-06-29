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
    <section className="mt-12 border-t border-zinc-200 pt-10">
      <h2 className="text-lg font-semibold text-[var(--color-primary)]">{title}</h2>
      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <article key={item.question}>
            <h3 className="text-base font-semibold text-zinc-900">{item.question}</h3>
            <p className="snippet-lead mt-2 text-sm leading-relaxed text-zinc-700">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
