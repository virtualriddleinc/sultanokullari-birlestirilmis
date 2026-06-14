import type { Branch } from "@/content/branches";

/** §2.3 okullarimiz rotaları → mevcut şube slug eşlemesi */
export const CAMPUS_ROUTE_MAP: Record<string, Record<string, string>> = {
  istanbul: { sancaktepe: "sancaktepe" },
  kocaeli: { basiskele: "basiskele" },
  sakarya: { serdivan: "serdivan" },
  ankara: { sincan: "sincan" },
  konya: { mevlana: "mevlana" },
};

export function getBranchSlugFromCampusRoute(
  city: string,
  campus: string,
): string | undefined {
  return CAMPUS_ROUTE_MAP[city]?.[campus];
}

export function getCampusRouteFromBranch(branch: Branch): string {
  const cityKey = branch.city
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g");

  const campusKey = branch.district
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g")
    .replace(/â/g, "a");

  return `/okullarimiz/${cityKey}/${campusKey}`;
}
