import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-5",
        align === "center" && "justify-center text-center",
        className,
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-3xl")}>
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 className={cn("section-title", eyebrow && "mt-3")}>{title}</h2>
        {description ? (
          <p
            className={cn(
              "section-body mt-4 max-w-2xl",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className={cn(align === "center" && "w-full")}>{action}</div>
      ) : null}
    </div>
  );
}
