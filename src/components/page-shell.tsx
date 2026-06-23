import type { ReactNode } from "react";
import type { PageMedia } from "@/lib/menu-images";
import { PageShellMotion } from "@/components/page-shell-motion";

interface PageShellProps {
  title: string;
  intro?: string;
  children?: ReactNode;
  headingLayout?: "default" | "centerHero";
  media?: PageMedia;
}

export function PageShell({
  title,
  intro,
  children,
  headingLayout,
  media,
}: PageShellProps) {
  return (
    <PageShellMotion
      title={title}
      intro={intro}
      headingLayout={headingLayout}
      media={media}
    >
      {children}
    </PageShellMotion>
  );
}
