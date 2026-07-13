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

type ExtraLink = {
  label: string;
  href: string;
  group?: string | null;
};

function mergeExtraLinks(
  categories: SitemapCategory[],
  extraLinks: ExtraLink[],
): SitemapCategory[] {
  if (!extraLinks.length) return categories;

  const knownKeys = new Set(categories.map((c) => c.key));

  return categories.map((category) => {
    const extras = extraLinks.filter((link) => {
      const group = link.group || "kurumsal";
      if (group === category.key) return true;
      // Bilinmeyen gruplar (örn. guncel) kurumsal kartına düşer
      if (category.key === "kurumsal" && !knownKeys.has(group)) return true;
      return false;
    });
    if (!extras.length) return category;

    const existing = new Set(category.links.map((l) => l.path));
    const added = extras
      .filter((link) => !existing.has(link.href))
      .map((link) => ({ title: link.label, path: link.href }));

    if (!added.length) return category;
    return { ...category, links: [...category.links, ...added] };
  });
}

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
      className="group border-charcoal/8 hover:border-brand-green/35 hover:bg-brand-honey/45 flex min-h-[44px] items-center gap-fluid-3 rounded-xl border bg-white/80 p-fluid-3 transition-colors"
    >
      <span className="bg-brand-green/25 text-charcoal grid size-8 shrink-0 place-items-center rounded-lg">
        {Icon ? (
          <Icon className="size-4" aria-hidden />
        ) : (
          <ChevronRight className="size-4" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-charcoal block text-[length:var(--text-sm)] font-semibold">
          {link.title}
        </span>
        {showPath ? (
          <span className="text-charcoal/55 mt-fluid-1 block truncate text-[length:var(--text-xs)]">
            {link.path}
          </span>
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
      <div className="mb-fluid-6 flex items-center gap-fluid-3">
        <span className="bg-brand-honey text-charcoal grid size-10 place-items-center rounded-xl">
          <Icon className="size-5" aria-hidden />
        </span>
        <h2 className="font-cinzel text-charcoal text-[length:var(--text-xl)] font-bold tracking-tight md:text-[length:var(--text-2xl)]">
          {category.label}
        </h2>
      </div>

      <div className="grid gap-fluid-3 md:grid-cols-2 lg:grid-cols-3">
        {category.links.map((link) => (
          <SitemapLinkRow key={link.path} link={link} />
        ))}
      </div>
    </ContentCard>
  );
}

export function SiteMapContent({
  extraLinks = [],
}: {
  extraLinks?: ExtraLink[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => mergeExtraLinks(SITEMAP_CATEGORIES, extraLinks),
    [extraLinks],
  );

  const allLinks = useMemo(() => {
    const base = getAllSitemapLinks();
    if (!extraLinks.length) return base;

    const seen = new Set(base.map((l) => l.path));
    const merged = [...base];
    for (const link of extraLinks) {
      if (seen.has(link.href)) continue;
      seen.add(link.href);
      merged.push({ title: link.label, path: link.href });
    }
    return merged.sort((a, b) => a.title.localeCompare(b.title, "tr"));
  }, [extraLinks]);

  const linkCategoryMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const category of categories) {
      for (const link of category.links) {
        map.set(link.path, category.label);
      }
    }

    return map;
  }, [categories]);

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
            "border-charcoal/12 text-charcoal placeholder:text-charcoal/45 min-h-[44px] w-full rounded-2xl border bg-white/90 py-fluid-3 pr-12 pl-12 text-[length:var(--text-sm)] shadow-sm transition",
            "focus:border-brand-green/60 focus:ring-brand-green/25 focus:ring-2 focus:outline-none",
          )}
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-charcoal/50 hover:text-charcoal absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center transition-colors"
            aria-label="Aramayı temizle"
          >
            <X className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      {hasSearch ? (
        <div ref={resultsRef} id="sitemap-search-results">
          <ContentCard>
          <h2 className="font-cinzel text-charcoal mb-fluid-4 text-[length:var(--text-lg)] font-bold md:text-[length:var(--text-xl)]">
            {filteredLinks.length > 0
              ? `"${searchTerm}" için ${filteredLinks.length} sonuç`
              : `"${searchTerm}" için sonuç bulunamadı`}
          </h2>

          {filteredLinks.length > 0 ? (
            <ul className="grid gap-fluid-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredLinks.map((link) => (
                <li key={link.path}>
                  <SitemapLinkRow link={link} showPath />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-charcoal/70 text-[length:var(--text-sm)]">
              Farklı bir anahtar kelime deneyin veya aşağıdaki kategorilere göz
              atın.
            </p>
          )}
          </ContentCard>
        </div>
      ) : (
        <>
          <section aria-labelledby="sitemap-quick-access">
            <div className="mb-fluid-4 flex items-center gap-fluid-3">
              <span className="bg-brand-green/30 text-charcoal grid size-9 place-items-center rounded-lg">
                <Zap className="size-4" aria-hidden />
              </span>
              <h2
                id="sitemap-quick-access"
                className="font-cinzel text-charcoal text-[length:var(--text-lg)] font-bold tracking-tight md:text-[length:var(--text-xl)]"
              >
                Hızlı Erişim
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-fluid-3 md:grid-cols-3 lg:grid-cols-7">
              {SITEMAP_QUICK_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="border-charcoal/10 hover:border-brand-green/40 hover:bg-brand-honey/50 group flex min-h-[44px] flex-col items-center rounded-2xl border bg-white/90 p-fluid-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="bg-brand-green/25 text-charcoal grid size-12 place-items-center rounded-full transition group-hover:scale-105">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-charcoal mt-fluid-3 text-[length:var(--text-sm)] font-semibold text-balance">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="space-y-fluid-4">
            {categories.map((category) => (
              <CategorySection key={category.key} category={category} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
