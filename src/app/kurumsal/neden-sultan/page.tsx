import type { Metadata } from "next";
import { nedenSultanItems } from "@/content/neden-sultan";
import { PageShell } from "@/components/page-shell";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";

export const metadata: Metadata = {
  title: "Niçin Sultan Okulları?",
  description: "Kurum değerleri ve tercih nedenleri — 11 madde.",
};

export default function Page() {
  return (
    <PageShell
      title="Niçin Sultan Okulları?"
      intro="Temiz ve huzurlu ortamdan nebevî eğitime, doğa ile iç içe yaşamdan hafızlık vizyonuna kadar on bir başlıkta özet."
    >
      <StaggerList as="ol" className="list-none space-y-6">
        {nedenSultanItems.map((item, i) => (
          <StaggerItem
            key={item.headline}
            className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5"
          >
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-1 text-base font-semibold text-zinc-900">
              {item.headline}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {item.body}
            </p>
          </StaggerItem>
        ))}
      </StaggerList>
    </PageShell>
  );
}
