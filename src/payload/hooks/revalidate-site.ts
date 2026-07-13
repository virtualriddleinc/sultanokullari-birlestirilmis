import { revalidatePath } from "next/cache";

/** Next.js önbelleğini anında temizler — CMS kayıtları sitede hemen yansır */
export function revalidateSitePaths(...paths: string[]) {
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      // Seed / CLI ortamında Next.js static generation store yok — yoksay
    }
  }
}

/** Footer şube listesi layout.tsx içinde; layout önbelleğini de temizler */
export function revalidateSiteLayout() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Seed / CLI ortamında yoksay
  }
}

export const HOME_PATHS = ["/"] as const;

export const HOME_AND_NEDEN_PATHS = ["/", "/kurumsal/neden-sultan"] as const;

export const GUNCEL_PATHS = [
  "/",
  "/guncel/haberler",
  "/guncel/etkinlikler",
  "/guncel/medya",
] as const;

export const BRANCH_PATHS = [
  "/",
  "/iletisim",
  "/subeler/sancaktepe",
  "/subeler/basiskele",
  "/subeler/serdivan",
  "/subeler/sincan",
  "/subeler/mevlana",
  "/okullarimiz/istanbul/sancaktepe",
  "/okullarimiz/kocaeli/basiskele",
  "/okullarimiz/sakarya/serdivan",
  "/okullarimiz/ankara/sincan",
  "/okullarimiz/konya/mevlana",
] as const;

export function revalidatePageSlug(
  slug: string,
  pathPrefix?: string | null,
) {
  if (slug === "hakkimizda") {
    revalidateSitePaths("/kurumsal/hakkimizda");
    return;
  }
  if (slug === "burs-olanaklari") {
    revalidateSitePaths("/kurumsal/burs-olanaklari");
    return;
  }
  const prefix = pathPrefix || "kurumsal";
  const path = prefix === "root" ? `/${slug}` : `/${prefix}/${slug}`;
  revalidateSitePaths(path);
}

export function revalidateBranchSlugs(
  citySlug?: string | null,
  campusSlug?: string | null,
  branchSlug?: string | null,
) {
  revalidateSitePaths(...BRANCH_PATHS);
  revalidateSiteLayout();
  if (branchSlug) revalidateSitePaths(`/subeler/${branchSlug}`);
  if (citySlug && campusSlug) {
    revalidateSitePaths(`/okullarimiz/${citySlug}/${campusSlug}`);
  }
}
