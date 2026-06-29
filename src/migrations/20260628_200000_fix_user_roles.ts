import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/** Rolü atanmamış kullanıcılara varsayılan yönetici rolü */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "users_roles" ("order", "parent_id", "value")
    SELECT 0, u."id", 'admin'::"enum_users_roles"
    FROM "users" u
    WHERE NOT EXISTS (
      SELECT 1 FROM "users_roles" ur WHERE ur."parent_id" = u."id"
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "users_roles" ur
    USING "users" u
    WHERE ur."parent_id" = u."id"
      AND u."email" = 'admin@admin.com'
      AND ur."value" = 'admin'::"enum_users_roles"
      AND NOT EXISTS (
        SELECT 1 FROM "users_roles" ur2
        WHERE ur2."parent_id" = u."id" AND ur2."id" != ur."id"
      );
  `);
}
