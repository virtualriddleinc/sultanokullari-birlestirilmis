import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function HexBadge({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "grid place-items-center bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm",
        size === "sm" && "w-10",
        size === "md" && "w-12",
        size === "lg" && "w-[4.5rem]",
        className,
      )}
      style={{
        aspectRatio: "2 / 1.7320508075688772",
        clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
      }}
    >
      {children}
    </span>
  );
}
