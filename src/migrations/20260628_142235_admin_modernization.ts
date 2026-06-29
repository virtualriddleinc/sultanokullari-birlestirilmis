import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_messages_source" AS ENUM('contact', 'info_request');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'read', 'archived');
  CREATE TYPE "public"."enum_ik_applications_status" AS ENUM('new', 'read', 'archived');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TABLE "pages_blocks_text_section_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_section_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_card_grid_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"branch_slug" varchar,
  	"source" "enum_contact_messages_source" DEFAULT 'contact' NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ik_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"branch_slug" varchar,
  	"position" varchar NOT NULL,
  	"experience_years" numeric NOT NULL,
  	"education" varchar NOT NULL,
  	"cover_letter" varchar NOT NULL,
  	"status" "enum_ik_applications_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "news" ADD COLUMN "body" jsonb;
  ALTER TABLE "_news_v" ADD COLUMN "version_body" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_messages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ik_applications_id" integer;
  ALTER TABLE "pages_blocks_text_section_paragraphs" ADD CONSTRAINT "pages_blocks_text_section_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_section" ADD CONSTRAINT "pages_blocks_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_section_items" ADD CONSTRAINT "pages_blocks_timeline_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_section" ADD CONSTRAINT "pages_blocks_timeline_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_section_cards" ADD CONSTRAINT "pages_blocks_card_grid_section_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_section" ADD CONSTRAINT "pages_blocks_card_grid_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_section" ADD CONSTRAINT "pages_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_text_section_paragraphs_order_idx" ON "pages_blocks_text_section_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_section_paragraphs_parent_id_idx" ON "pages_blocks_text_section_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_section_order_idx" ON "pages_blocks_text_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_section_parent_id_idx" ON "pages_blocks_text_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_section_path_idx" ON "pages_blocks_text_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_section_items_order_idx" ON "pages_blocks_timeline_section_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_section_items_parent_id_idx" ON "pages_blocks_timeline_section_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_section_order_idx" ON "pages_blocks_timeline_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_section_parent_id_idx" ON "pages_blocks_timeline_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_section_path_idx" ON "pages_blocks_timeline_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_section_cards_order_idx" ON "pages_blocks_card_grid_section_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_section_cards_parent_id_idx" ON "pages_blocks_card_grid_section_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_section_order_idx" ON "pages_blocks_card_grid_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_section_parent_id_idx" ON "pages_blocks_card_grid_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_section_path_idx" ON "pages_blocks_card_grid_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_section_order_idx" ON "pages_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_section_parent_id_idx" ON "pages_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_section_path_idx" ON "pages_blocks_rich_text_section" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "ik_applications_updated_at_idx" ON "ik_applications" USING btree ("updated_at");
  CREATE INDEX "ik_applications_created_at_idx" ON "ik_applications" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ik_applications_fk" FOREIGN KEY ("ik_applications_id") REFERENCES "public"."ik_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_ik_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("ik_applications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_text_section_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid_section_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ik_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_text_section_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_text_section" CASCADE;
  DROP TABLE "pages_blocks_timeline_section_items" CASCADE;
  DROP TABLE "pages_blocks_timeline_section" CASCADE;
  DROP TABLE "pages_blocks_card_grid_section_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid_section" CASCADE;
  DROP TABLE "pages_blocks_rich_text_section" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "ik_applications" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_messages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ik_applications_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_contact_messages_id_idx";
  DROP INDEX "payload_locked_documents_rels_ik_applications_id_idx";
  ALTER TABLE "news" DROP COLUMN "body";
  ALTER TABLE "_news_v" DROP COLUMN "version_body";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_messages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ik_applications_id";
  DROP TYPE "public"."enum_contact_messages_source";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_ik_applications_status";
  DROP TYPE "public"."enum_users_roles";`)
}
