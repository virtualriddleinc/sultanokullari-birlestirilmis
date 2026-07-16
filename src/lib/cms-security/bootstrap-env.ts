/** Production-benzeri ortam: Vercel production/preview veya gerçek prod runtime. */
export function isProductionLike(): boolean {
  const vercelEnv = process.env.VERCEL_ENV?.trim();
  if (vercelEnv === "production" || vercelEnv === "preview") return true;
  if (process.env.ALLOW_LOCAL_PRODUCTION?.trim() === "true") return false;
  return process.env.NODE_ENV === "production";
}

/** Public bootstrap fail-closed mi? (secret yoksa/yanlışsa red) */
export function isBootstrapFailClosed(): boolean {
  return isProductionLike();
}

export function getBootstrapSecret(): string {
  return process.env.FIRST_USER_BOOTSTRAP_SECRET?.trim() ?? "";
}

/** Acil bootstrap için geçerli secret tanımlı mı? */
export function hasBootstrapSecretConfigured(): boolean {
  return getBootstrapSecret().length >= 32;
}

export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export function isValidBootstrapSecret(provided: string | null): boolean {
  const expected = getBootstrapSecret();
  if (!expected || expected.length < 32) return false;
  if (!provided) return false;
  return timingSafeEqualString(provided, expected);
}

export function parseAllowedBootstrapIps(): string[] {
  const raw = process.env.BOOTSTRAP_ALLOWED_IPS?.trim() ?? "";
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ipAllowedForBootstrap(ip: string): boolean {
  const allow = parseAllowedBootstrapIps();
  if (allow.length === 0) return true;
  return allow.includes(ip);
}
