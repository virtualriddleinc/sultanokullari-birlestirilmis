"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/components/navigation/site-link";
import {
  ArrowUpRight,
  ChevronRight,
  Search,
  X,
  Zap,
} from "lucide-react";
import { ContentCard } from "@/components/layout/content-card";
import {
  getAllSitemapLinks,
  SITEMAP_CATEGORIES,
  SITEMAP_LINK_ICONS,
  SITEMAP_QUICK_LINKS,
  type SitemapCategory,
  type SitemapLink,
} from "@/content/sitemap";
import { cn } from "@/lib/cn";
import { matchesSearchQuery } from "@/lib/search-text";

function SitemapLinkRow({
  link,
  showPath = false,
}: {
  link: SitemapLink;
  showPath?: boolean;
}) {
  const Icon = SITEMAP_LINK_ICONS[link.path];

  return (
    <Link
      href={link.path}
      className="group border-charcoal/8 hover:border-brand-green/35 hover:bg-brand-honey/45 flex items-center gap-3 rounded-xl border bg-white/80 p-3 transition-colors"
    >
      <span className="bg-brand-green/25 text-charcoal grid size-8 shrink-0 place-items-center rounded-lg">
        {Icon ? (
          <Icon className="size-4" aria-hidden />
        ) : (
          <ChevronRight className="size-4" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-charcoal block text-sm font-semibold">{link.title}</span>
        {showPath ? (
          <span className="text-charcoal/55 mt-0.5 block truncate text-xs">{link.path}</span>
        ) : null}
      </span>
      <ArrowUpRight
        className="text-charcoal/35 group-hover:text-charcoal size-4 shrink-0 opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}

function CategorySection({ category }: { category: SitemapCategory }) {
  const Icon = category.icon;

  return (
    <ContentCard>
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-brand-honey text-charcoal grid size-10 place-items-center rounded-xl">
          <Icon className="size-5" aria-hidden />
        </span>
        <h2 className="font-cinzel text-charcoal text-xl font-bold tracking-tight">
          {category.label}
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.links.map((link) => (
          <SitemapLinkRow key={link.path} link={link} />
        ))}
      </div>
    </ContentCard>
  );
}

export function SiteMapContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const allLinks = useMemo(() => getAllSitemapLinks(), []);

  const linkCategoryMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const category of SITEMAP_CATEGORIES) {
      for (const link of category.links) {
        map.set(link.path, category.label);
      }
    }

    return map;
  }, []);

  const filteredLinks = useMemo(() => {
    const query = searchTerm.trim();
    if (!query) return [];

    return allLinks.filter((link) =>
      matchesSearchQuery(
        query,
        link.title,
        link.path,
        linkCategoryMap.get(link.path),
      ),
    );
  }, [allLinks, linkCategoryMap, searchTerm]);

  const hasSearch = searchTerm.trim().length > 0;

  useEffect(() => {
    if (!hasSearch) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hasSearch, filteredLinks.length, searchTerm]);

  return (
    <div className="space-y-fluid-8">
      <div className="relative mx-auto max-w-xl">
        <label htmlFor="sitemap-search" className="sr-only">
          Site haritasında sayfa ara
        </label>
        <Search
          className="text-charcoal/45 pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
          aria-hidden
        />
        <input
          id="sitemap-search"
          type="text"
          role="searchbox"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Sayfa ara..."
          autoComplete="off"
          spellCheck={false}
          aria-controls="sitemap-search-results"
          aria-expanded={hasSearch}
          className={cn(
            "border-charcoal/12 text-charcoal placeholder:text-charcoal/45 w-full rounded-2xl border bg-white/90 py-3.5 pr-12 pl-12 text-sm shadow-sm transition",
            "focus:border-brand-green/60 focus:ring-brand-green/25 focus:ring-2 focus:outline-none",
          )}
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-charcoal/50 hover:text-charcoal absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
            aria-label="Aramayı temizle"
          >
            <X className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      {hasSearch ? (
        <div ref={resultsRef} id="sitemap-search-results">
          <ContentCard>
          <h2 className="font-cinzel text-charcoal mb-5 text-lg font-bold">
            {filteredLinks.length > 0
              ? `"${searchTerm}" için ${filteredLinks.length} sonuç`
              : `"${searchTerm}" için sonuç bulunamadı`}
          </h2>

          {filteredLinks.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLinks.map((link) => (
                <li key={link.path}>
                  <SitemapLinkRow link={link} showPath />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-charcoal/70 text-sm">
              Farklı bir anahtar kelime deneyin veya aşağıdaki kategorilere göz
              atın.
            </p>
          )}
          </ContentCard>
        </div>
      ) : (
        <>
          <section aria-labelledby="sitemap-quick-access">
            <div className="mb-5 flex items-center gap-3">
              <span className="bg-brand-green/30 text-charcoal grid size-9 place-items-center rounded-lg">
                <Zap className="size-4" aria-hidden />
              </span>
              <h2
                id="sitemap-quick-access"
                className="font-cinzel text-charcoal text-lg font-bold tracking-tight"
              >
                Hızlı Erişim
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
              {SITEMAP_QUICK_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="border-charcoal/10 hover:border-brand-green/40 hover:bg-brand-honey/50 group flex flex-col items-center rounded-2xl border bg-white/90 p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="bg-brand-green/25 text-charcoal grid size-12 place-items-center rounded-full transition group-hover:scale-105">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-charcoal mt-3 text-sm font-semibold text-balance">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="space-y-fluid-4">
            {SITEMAP_CATEGORIES.map((category) => (
              <CategorySection key={category.key} category={category} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
