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
    <div className={cn("flex items-center gap-4", className)}>
      <h2
        id={id}
        className="font-cinzel text-charcoal shrink-0 text-2xl font-bold sm:text-3xl"
      >
        {title}
      </h2>
      <div className="from-brand-green/60 h-px flex-1 bg-gradient-to-r to-transparent" />
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
    <section aria-labelledby={id} className={cn("mt-16", className)}>
      <PageDividerHeading id={id} title={title} />
      {description ? (
        <p className="section-body mt-3 max-w-2xl text-base">{description}</p>
      ) : null}
      {children}
    </section>
  );
}
