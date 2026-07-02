/** Arama eşleştirmesi için Türkçe karakter ve aksan normalizasyonu. */
export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[''`´]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesSearchQuery(
  query: string,
  ...fields: Array<string | undefined | null>
): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  return fields.some((field) => {
    if (!field) return false;
    return normalizeSearchText(field).includes(normalizedQuery);
  });
}
