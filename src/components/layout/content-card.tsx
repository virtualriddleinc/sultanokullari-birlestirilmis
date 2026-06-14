import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ContentCard({
  children,
  className,
  inset = true,
}: {
  children: ReactNode;
  className?: string;
  inset?: boolean;
}) {
  return (
    <div
      className={cn("content-card", inset && "content-card--inset", className)}
    >
      {children}
    </div>
  );
}
