import type { ReactNode } from "react";
import { PageShellMotion } from "@/components/page-shell-motion";

interface PageShellProps {
  title: string;
  intro?: string;
  children?: ReactNode;
  headingLayout?: "default" | "centerHero";
}

export function PageShell({
  title,
  intro,
  children,
  headingLayout,
}: PageShellProps) {
  return (
    <PageShellMotion title={title} intro={intro} headingLayout={headingLayout}>
      {children}
    </PageShellMotion>
  );
}
