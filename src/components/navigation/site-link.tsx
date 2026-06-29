"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { EbruLink } from "@/components/navigation/ebru-link";

type SiteLinkProps = ComponentProps<typeof NextLink>;

function resolveHref(href: SiteLinkProps["href"]): string {
  if (typeof href === "string") return href;
  if (href.pathname) return href.pathname;
  return "";
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}

export default function SiteLink({
  href,
  prefetch: _prefetch,
  replace,
  scroll,
  locale: _locale,
  onMouseEnter,
  onFocus,
  ...props
}: SiteLinkProps) {
  const router = useRouter();
  const hrefStr = resolveHref(href);

  const prefetchHref = useCallback(() => {
    if (!isInternalHref(hrefStr)) return;
    try {
      router.prefetch(hrefStr);
    } catch {
      // prefetch is best-effort
    }
  }, [router, hrefStr]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    prefetchHref();
    onMouseEnter?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    prefetchHref();
    onFocus?.(e);
  };

  if (isInternalHref(hrefStr)) {
    return (
      <EbruLink
        href={hrefStr}
        replace={replace}
        scroll={scroll}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        {...props}
      />
    );
  }

  return (
    <NextLink
      href={href}
      replace={replace}
      scroll={scroll}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      {...props}
    />
  );
}
