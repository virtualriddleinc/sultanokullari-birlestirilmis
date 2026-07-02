import type { ReactNode } from "react";
import type { PageMedia } from "@/lib/menu-images";
import { OrnamentalQuote } from "@/components/egitim/ornamental-quote";
import { PageShell } from "@/components/page-shell";

export function QuoteOverlayPageShell({
  title,
  intro,
  media,
  quote,
  quoteCitation,
  quoteFullWidth,
  children,
}: {
  title: string;
  intro: string;
  media?: PageMedia;
  quote?: string;
  quoteCitation?: string;
  quoteFullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <PageShell
      title={title}
      intro={intro}
      media={media}
      mediaLayout="overlay"
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
  );
}
