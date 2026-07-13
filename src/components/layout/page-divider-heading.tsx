import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageDividerHeading({
  id,
  title,
  className,
}: {
  id: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-fluid-4", className)}>
      <h2
        id={id}
        className="font-cinzel text-charcoal min-w-0 text-[length:var(--text-2xl)] font-bold text-balance md:text-[length:var(--text-3xl)]"
      >
        {title}
      </h2>
      <div
        className="from-brand-green/60 hidden h-px min-w-[2rem] flex-1 bg-gradient-to-r to-transparent sm:block"
        aria-hidden
      />
    </div>
  );
}

export function PageDividerSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn("mt-fluid-16", className)}>
      <PageDividerHeading id={id} title={title} />
      {description ? (
        <p className="section-body mt-fluid-3 max-w-2xl">{description}</p>
      ) : null}
      {children}
    </section>
  );
}
