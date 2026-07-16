import pg from "pg";

const BOOTSTRAP_ADVISORY_KEY = 87201401;

let pool: pg.Pool | null = null;

export function getCmsSecurityPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      throw new Error("[cms-security] DATABASE_URL tanımlı değil.");
    }
    pool = new pg.Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return pool;
}

export type BootstrapClaimResult = "claimed" | "already_claimed";

/**
 * Atomik bootstrap claim — TOCTOU kapatır.
 * Kazanan tek INSERT; kaybeden already_claimed.
 */
export async function tryClaimBootstrapLock(
  email: string,
): Promise<BootstrapClaimResult> {
  const client = await getCmsSecurityPool().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [
      BOOTSTRAP_ADVISORY_KEY,
    ]);
    const inserted = await client.query<{ id: number }>(
      `INSERT INTO cms_bootstrap_lock (id, claimed_at, claimed_by_email)
       VALUES (1, now(), $1)
       ON CONFLICT (id) DO NOTHING
       RETURNING id`,
      [email],
    );
    if ((inserted.rowCount ?? 0) === 0) {
      await client.query("ROLLBACK");
      return "already_claimed";
    }
    await client.query("COMMIT");
    return "claimed";
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function isBootstrapLockClaimed(): Promise<boolean> {
  try {
    const result = await getCmsSecurityPool().query<{ id: number }>(
      `SELECT id FROM cms_bootstrap_lock WHERE id = 1 LIMIT 1`,
    );
    return (result.rowCount ?? 0) > 0;
  } catch {
    // Tablo henüz yoksa (migration öncesi) güvenli taraf: claimed sayma
    return false;
  }
}

/**
 * Break-glass seed: lock zaten varken claimed_by_email güncelle.
 * Public first-register bu yolu kullanmaz.
 */
export async function touchBootstrapLockForSeed(email: string): Promise<void> {
  const client = await getCmsSecurityPool().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [
      BOOTSTRAP_ADVISORY_KEY,
    ]);
    await client.query(
      `INSERT INTO cms_bootstrap_lock (id, claimed_at, claimed_by_email)
       VALUES (1, now(), $1)
       ON CONFLICT (id) DO UPDATE SET
         claimed_by_email = EXCLUDED.claimed_by_email,
         claimed_at = now()`,
      [email],
    );
    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    throw error;
  } finally {
    client.release();
  }
}
