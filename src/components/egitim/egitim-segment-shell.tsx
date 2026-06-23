import type { ReactNode } from "react";
import type { PageMedia } from "@/lib/menu-images";
import { OrnamentalQuote } from "@/components/egitim/ornamental-quote";
import { PageShell } from "@/components/page-shell";
import { cn } from "@/lib/cn";

const accentBySlug: Record<string, string> = {
  anaokulu: "border-l-amber-500",
  ilkokul: "border-l-emerald-600",
  ortaokul: "border-l-violet-600",
  "nebevi-egitim": "border-l-teal-700",
  hafizlik: "border-l-emerald-800",
  "degerler-egitimi": "border-l-rose-600",
  "cift-yabanci-dil": "border-l-sky-600",
  "olcme-degerlendirme": "border-l-slate-600",
};

export function EgitimSegmentShell({
  slug,
  title,
  intro,
  quote,
  quoteCitation,
  children,
  headingLayout,
  quoteFullWidth,
  media,
}: {
  slug: keyof typeof accentBySlug | string;
  title: string;
  intro: string;
  quote?: string;
  /** Alıntı metninin dışında, tırnak sonrası kaynak (örn. `(Buhari)`). */
  quoteCitation?: string;
  children: ReactNode;
  headingLayout?: "default" | "centerHero";
  /** Alıntı bloğunu yatayda tam genişlikte göster. */
  quoteFullWidth?: boolean;
  media?: PageMedia;
}) {
  const accent = accentBySlug[slug] ?? "border-l-[var(--color-primary)]";
  return (
    <div className={cn("border-l-4 pl-4 sm:pl-6", accent)}>
      <PageShell
        title={title}
        intro={intro}
        headingLayout={headingLayout}
        media={media}
      >
        {quote ? (
          <OrnamentalQuote
            quote={quote}
            citation={quoteCitation}
            fullWidth={quoteFullWidth}
          />
        ) : null}
        {children}
      </PageShell>
    </div>
  );
}
