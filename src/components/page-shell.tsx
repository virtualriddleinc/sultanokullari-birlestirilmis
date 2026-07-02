import type { ReactNode } from "react";
import type { PageMedia } from "@/lib/menu-images";
import { PageShellMotion } from "@/components/page-shell-motion";

interface PageShellProps {
  title: string;
  intro?: string;
  children?: ReactNode;
  headingLayout?: "default" | "centerHero";
  mediaLayout?: "default" | "underHeader" | "overlay";
  media?: PageMedia;
  /** Etkileşimli içeriklerde whileInView gecikmesini devre dışı bırakır. */
  bodyMotion?: "inView" | "immediate";
}

export function PageShell({
  title,
  intro,
  children,
  headingLayout,
  mediaLayout,
  media,
  bodyMotion,
}: PageShellProps) {
  return (
    <PageShellMotion
      title={title}
      intro={intro}
      headingLayout={headingLayout}
      mediaLayout={mediaLayout}
      media={media}
      bodyMotion={bodyMotion}
    >
      {children}
    </PageShellMotion>
  );
}
