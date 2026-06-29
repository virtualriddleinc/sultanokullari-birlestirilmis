import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type GeoCitationBlockProps = {
  children: ReactNode;
  className?: string;
};

export function GeoCitationBlock({ children, className }: GeoCitationBlockProps) {
  return (
    <aside
      className={cn(
        "geo-citation-block border-brand-green/40 bg-brand-honey/25 text-charcoal/85 my-6 border-l-4 px-4 py-3 text-sm leading-relaxed",
        className,
      )}
      itemScope
      itemType="https://schema.org/DefinedTerm"
    >
      <p itemProp="description">{children}</p>
    </aside>
  );
}
