import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "payload_preferences"
    SET "value" = replace("value"::text, '"sort":"order"', '"sort":"_order"')::jsonb
    WHERE "value"::text LIKE '%"sort":"order"%';

    UPDATE "payload_preferences"
    SET "value" = replace("value"::text, '"sort":"-order"', '"sort":"-_order"')::jsonb
    WHERE "value"::text LIKE '%"sort":"-order"%';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "payload_preferences"
    SET "value" = replace("value"::text, '"sort":"_order"', '"sort":"order"')::jsonb
    WHERE "value"::text LIKE '%"sort":"_order"%';

    UPDATE "payload_preferences"
    SET "value" = replace("value"::text, '"sort":"-_order"', '"sort":"-order"')::jsonb
    WHERE "value"::text LIKE '%"sort":"-_order"%';
  `)
}
