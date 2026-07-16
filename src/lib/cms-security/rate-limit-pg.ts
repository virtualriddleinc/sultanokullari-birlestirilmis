import { getCmsSecurityPool } from "./bootstrap-lock";

export type PgRateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
  limit: number;
};

/**
 * Sabit pencere rate limit — Postgres atomik upsert (çoklu instance güvenli).
 */
export async function rateLimitPg(
  key: string,
  limit: number,
  windowMs: number,
): Promise<PgRateLimitResult> {
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const pool = getCmsSecurityPool();

  // Lazy cleanup (best-effort)
  void pool
    .query(`DELETE FROM cms_rate_limit_buckets WHERE reset_at < now()`)
    .catch(() => undefined);

  const result = await pool.query<{ count: number; reset_at: Date }>(
    `INSERT INTO cms_rate_limit_buckets ("key", "count", "reset_at")
     VALUES ($1, 1, now() + make_interval(secs => $2))
     ON CONFLICT ("key") DO UPDATE SET
       "count" = CASE
         WHEN cms_rate_limit_buckets.reset_at <= now() THEN 1
         ELSE cms_rate_limit_buckets.count + 1
       END,
       "reset_at" = CASE
         WHEN cms_rate_limit_buckets.reset_at <= now()
           THEN now() + make_interval(secs => $2)
         ELSE cms_rate_limit_buckets.reset_at
       END
     RETURNING "count", "reset_at"`,
    [key, windowSec],
  );

  const row = result.rows[0];
  const count = row?.count ?? limit + 1;
  const resetAt = row?.reset_at ? new Date(row.reset_at).getTime() : Date.now();
  const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  if (count > limit) {
    return { ok: false, remaining: 0, retryAfterSec, limit };
  }

  return {
    ok: true,
    remaining: Math.max(0, limit - count),
    retryAfterSec,
    limit,
  };
}

export const AUTH_RATE_LIMITS = {
  login: { limit: 20, windowMs: 15 * 60 * 1000 },
  firstRegister: { limit: 5, windowMs: 15 * 60 * 1000 },
  usersCreate: { limit: 5, windowMs: 15 * 60 * 1000 },
  forgotPassword: { limit: 5, windowMs: 15 * 60 * 1000 },
  resetPassword: { limit: 10, windowMs: 15 * 60 * 1000 },
  init: { limit: 30, windowMs: 15 * 60 * 1000 },
} as const;
