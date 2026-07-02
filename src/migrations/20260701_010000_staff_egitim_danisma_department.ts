import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/** Eğitim Danışma Kurulu birimi için staff department enum değeri. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_staff_department" ADD VALUE IF NOT EXISTS 'egitim_danisma';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSQL enum değerini güvenli şekilde geri almak mümkün değil; no-op.
  await db.execute(sql`SELECT 1`);
}
