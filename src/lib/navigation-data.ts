import "server-only";

import { NAV_SECTIONS, type NavItem, type NavSection } from "@/lib/navigation";
import { getPayloadClient } from "@/lib/payload";

export type NavigationExtraLink = {
  label: string;
  href: string;
  group?: string | null;
  icon?: string | null;
};

type CmsNavSection = {
  key?: string | null;
  label?: string | null;
  description?: string | null;
  items?: Array<{
    label?: string | null;
    href?: string | null;
    icon?: string | null;
  }> | null;
};

export async function getNavigationExtraLinks(): Promise<NavigationExtraLink[]> {
  try {
    const payload = await getPayloadClient();
    const data = await payload.findGlobal({ slug: "navigation", depth: 0 });
    const links = data.extraLinks ?? [];

    return links
      .filter(
        (link): link is NonNullable<typeof link> & { label: string; href: string } =>
          Boolean(link?.label?.trim() && link?.href?.trim()),
      )
      .map((link) => ({
        label: link.label.trim(),
        href: link.href.trim(),
        group: link.group ?? "kurumsal",
        icon: link.icon ?? null,
      }));
  } catch {
    return [];
  }
}

function mapCmsSections(sections: CmsNavSection[]): NavSection[] {
  return sections
    .filter((s) => s?.key?.trim() && s?.label?.trim())
    .map((s) => {
      const key = s.key!.trim();
      const items: NavItem[] = (s.items ?? [])
        .filter((item) => item?.label?.trim() && item?.href?.trim())
        .map((item) => ({
          label: item!.label!.trim(),
          href: item!.href!.trim(),
          icon: item?.icon?.trim() || "Link",
        }));

      const fallback = NAV_SECTIONS.find((n) => n.key === key);

      return {
        key,
        label: s.label!.trim(),
        title: fallback?.title ?? "",
        description: s.description?.trim() || fallback?.description || "",
        featured: fallback?.featured ?? {
          label: "",
          img: "/images/menu/kurumsal-kimlik.webp",
          icon: "Landmark",
        },
        items,
      } satisfies NavSection;
    });
}

/** Kod içi NAV_SECTIONS + CMS; veya tam CMS menüsü. */
export async function getNavSectionsWithCms(): Promise<NavSection[]> {
  try {
    const payload = await getPayloadClient();
    const data = await payload.findGlobal({ slug: "navigation", depth: 0 });

    if (data.useCmsMenu && data.sections?.length) {
      const mapped = mapCmsSections(data.sections as CmsNavSection[]);
      if (mapped.length) return mapped;
    }
  } catch {
    /* fallback below */
  }

  const extra = await getNavigationExtraLinks();
  if (!extra.length) return NAV_SECTIONS;

  return NAV_SECTIONS.map((section) => {
    const sectionExtras = extra.filter(
      (link) => (link.group || "kurumsal") === section.key,
    );
    if (!sectionExtras.length) return section;

    const existingHrefs = new Set(section.items.map((item) => item.href));
    const newItems: NavItem[] = sectionExtras
      .filter((link) => !existingHrefs.has(link.href))
      .map((link) => ({
        label: link.label,
        href: link.href,
        icon: link.icon?.trim() || "Link",
      }));

    if (!newItems.length) return section;
    return { ...section, items: [...section.items, ...newItems] };
  });
}
