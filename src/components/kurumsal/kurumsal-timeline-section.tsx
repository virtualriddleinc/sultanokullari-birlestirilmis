import { PageDividerSection } from "@/components/layout/page-divider-heading";

type TimelineItem = {
  year: string;
  title: string;
  detail: string;
};

export function KurumsalTimelineSection({
  items,
  title = "Zaman Çizelgesi",
  description,
}: {
  items: readonly TimelineItem[];
  title?: string;
  description?: string;
}) {
  return (
    <PageDividerSection
      id="timeline-baslik"
      title={title}
      description={description}
    >
      <ol className="mt-fluid-8 space-y-fluid-6 lg:hidden">
        {items.map((item) => (
          <li
            key={`${item.year}-${item.title}`}
            className="border-brand-green relative border-l-2 pl-fluid-6"
          >
            <span className="bg-brand-green absolute top-1 -left-[7px] h-3 w-3 rounded-full" />
            <p className="text-brand-green text-[length:var(--text-sm)] font-bold tracking-wide uppercase">
              {item.year}
            </p>
            <p className="font-cinzel text-charcoal mt-fluid-1 text-[length:var(--text-lg)] font-bold">
              {item.title}
            </p>
            <p className="section-body mt-fluid-2">{item.detail}</p>
          </li>
        ))}
      </ol>

      <div className="relative mt-fluid-12 hidden lg:block">
        <div
          className="grid gap-fluid-6"
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item) => (
            <div
              key={`${item.year}-${item.title}`}
              className="relative pt-fluid-8"
            >
              <div className="from-brand-green/15 via-brand-green to-brand-green/15 absolute top-3 right-0 left-0 h-0.5 bg-gradient-to-r" />
              <span className="bg-brand-green border-brand-honey absolute top-1.5 left-0 h-3 w-3 rounded-full border-2 shadow-[0_0_0_4px_rgba(0,0,0,0.03)]" />
              <p className="text-brand-green text-[length:var(--text-sm)] font-bold tracking-wide uppercase">
                {item.year}
              </p>
              <p className="font-cinzel text-charcoal mt-fluid-2 text-[length:var(--text-lg)] leading-snug font-bold text-balance">
                {item.title}
              </p>
              <p className="section-body mt-fluid-3 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageDividerSection>
  );
}
