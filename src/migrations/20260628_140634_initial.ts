import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hero_slides_slide_media_kind" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_journey_chapters_icon_key" AS ENUM('palette', 'book-open-text', 'compass', 'flask-conical', 'sparkles');
  CREATE TYPE "public"."enum_journey_chapters_chapter_media_kind" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_instagram_posts_post_media_kind" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_branches_gallery_item_kind" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_branches_preview_media_kind" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_ana_sayfa_mission_decor_media_media_kind" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_ana_sayfa_quick_links_section_links_icon_key" AS ENUM('book-open', 'graduation-cap', 'palette', 'hand-heart', 'heart-handshake', 'sprout', 'radio', 'phone', 'book-open-text', 'compass', 'flask-conical', 'sparkles');
  CREATE TYPE "public"."enum_ana_sayfa_video_section_featured_video_kind" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_ana_sayfa_guncel_section_featured_event_media_kind" AS ENUM('image', 'video');
  CREATE TABLE "hero_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"tagline" varchar NOT NULL,
  	"title_line1" varchar NOT NULL,
  	"title_line2" varchar NOT NULL,
  	"title_line3" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"button_text" varchar NOT NULL,
  	"button_link" varchar NOT NULL,
  	"slide_media_kind" "enum_hero_slides_slide_media_kind" DEFAULT 'image',
  	"slide_media_media_id" integer,
  	"slide_media_src" varchar,
  	"slide_media_alt" varchar NOT NULL,
  	"slide_media_poster" varchar,
  	"display_duration" numeric DEFAULT 6,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "journey_chapters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"icon_key" "enum_journey_chapters_icon_key" NOT NULL,
  	"chapter_media_kind" "enum_journey_chapters_chapter_media_kind" DEFAULT 'image',
  	"chapter_media_media_id" integer,
  	"chapter_media_src" varchar,
  	"chapter_media_alt" varchar NOT NULL,
  	"chapter_media_poster" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "neden_sultan_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"headline" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "instagram_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"post_media_kind" "enum_instagram_posts_post_media_kind" DEFAULT 'image',
  	"post_media_media_id" integer,
  	"post_media_src" varchar,
  	"post_media_alt" varchar,
  	"post_media_poster" varchar,
  	"external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "branches_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"level" varchar NOT NULL
  );
  
  CREATE TABLE "branches_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_kind" "enum_branches_gallery_item_kind" DEFAULT 'image',
  	"item_media_id" integer,
  	"item_src" varchar,
  	"item_alt" varchar NOT NULL,
  	"item_poster" varchar
  );
  
  CREATE TABLE "branches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"district" varchar NOT NULL,
  	"city_slug" varchar NOT NULL,
  	"campus_slug" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"upcoming" boolean DEFAULT false,
  	"preview_media_kind" "enum_branches_preview_media_kind" DEFAULT 'image',
  	"preview_media_media_id" integer,
  	"preview_media_src" varchar,
  	"preview_media_alt" varchar,
  	"preview_media_poster" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"branch_id" integer,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_branch_id" integer,
  	"version_featured_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"hero_slides_id" integer,
  	"journey_chapters_id" integer,
  	"neden_sultan_items_id" integer,
  	"instagram_posts_id" integer,
  	"branches_id" integer,
  	"news_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ana_sayfa_mission_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "ana_sayfa_mission_decor_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_kind" "enum_ana_sayfa_mission_decor_media_media_kind" DEFAULT 'image',
  	"media_media_id" integer,
  	"media_src" varchar,
  	"media_alt" varchar,
  	"media_poster" varchar
  );
  
  CREATE TABLE "ana_sayfa_neden_marquee_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "ana_sayfa_quick_links_section_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon_key" "enum_ana_sayfa_quick_links_section_links_icon_key" NOT NULL
  );
  
  CREATE TABLE "ana_sayfa" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mission_tagline" varchar NOT NULL,
  	"mission_title_line1" varchar NOT NULL,
  	"mission_title_line2" varchar NOT NULL,
  	"mission_title_line3" varchar,
  	"mission_description" varchar NOT NULL,
  	"mission_secondary_description" varchar,
  	"journey_headline" varchar NOT NULL,
  	"neden_eyebrow" varchar NOT NULL,
  	"neden_title" varchar NOT NULL,
  	"neden_title_highlight" varchar,
  	"neden_description" varchar NOT NULL,
  	"neden_cta_label" varchar NOT NULL,
  	"neden_cta_href" varchar NOT NULL,
  	"video_section_eyebrow" varchar NOT NULL,
  	"video_section_title" varchar NOT NULL,
  	"video_section_description" varchar NOT NULL,
  	"video_section_cta_label" varchar NOT NULL,
  	"video_section_cta_href" varchar NOT NULL,
  	"video_section_featured_video_kind" "enum_ana_sayfa_video_section_featured_video_kind" DEFAULT 'image',
  	"video_section_featured_video_media_id" integer,
  	"video_section_featured_video_src" varchar,
  	"video_section_featured_video_alt" varchar NOT NULL,
  	"video_section_featured_video_poster" varchar,
  	"branches_section_eyebrow" varchar NOT NULL,
  	"branches_section_title" varchar NOT NULL,
  	"branches_section_description" varchar NOT NULL,
  	"branches_section_cta_label" varchar NOT NULL,
  	"branches_section_cta_href" varchar NOT NULL,
  	"guncel_section_eyebrow" varchar NOT NULL,
  	"guncel_section_title" varchar NOT NULL,
  	"guncel_section_description" varchar NOT NULL,
  	"guncel_section_cta_label" varchar NOT NULL,
  	"guncel_section_cta_href" varchar NOT NULL,
  	"guncel_section_featured_event_label" varchar,
  	"guncel_section_upcoming_events_label" varchar,
  	"guncel_section_news_label" varchar,
  	"guncel_section_featured_event_media_kind" "enum_ana_sayfa_guncel_section_featured_event_media_kind" DEFAULT 'image',
  	"guncel_section_featured_event_media_media_id" integer,
  	"guncel_section_featured_event_media_src" varchar,
  	"guncel_section_featured_event_media_alt" varchar,
  	"guncel_section_featured_event_media_poster" varchar,
  	"instagram_section_eyebrow" varchar NOT NULL,
  	"instagram_section_title" varchar NOT NULL,
  	"instagram_section_description" varchar NOT NULL,
  	"instagram_section_handle" varchar NOT NULL,
  	"instagram_section_profile_url" varchar NOT NULL,
  	"quick_links_section_eyebrow" varchar NOT NULL,
  	"quick_links_section_title" varchar NOT NULL,
  	"quick_links_section_description" varchar NOT NULL,
  	"info_modal_enabled" boolean DEFAULT true,
  	"info_modal_brand_label" varchar,
  	"info_modal_title" varchar NOT NULL,
  	"info_modal_subtitle" varchar NOT NULL,
  	"info_modal_submit_label" varchar NOT NULL,
  	"info_modal_dismiss_label" varchar,
  	"info_modal_kvkk_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_slide_media_media_id_media_id_fk" FOREIGN KEY ("slide_media_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journey_chapters" ADD CONSTRAINT "journey_chapters_chapter_media_media_id_media_id_fk" FOREIGN KEY ("chapter_media_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_post_media_media_id_media_id_fk" FOREIGN KEY ("post_media_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_levels" ADD CONSTRAINT "branches_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_item_media_id_media_id_fk" FOREIGN KEY ("item_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_preview_media_media_id_media_id_fk" FOREIGN KEY ("preview_media_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_branch_id_branches_id_fk" FOREIGN KEY ("version_branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_slides_fk" FOREIGN KEY ("hero_slides_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journey_chapters_fk" FOREIGN KEY ("journey_chapters_id") REFERENCES "public"."journey_chapters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_neden_sultan_items_fk" FOREIGN KEY ("neden_sultan_items_id") REFERENCES "public"."neden_sultan_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_instagram_posts_fk" FOREIGN KEY ("instagram_posts_id") REFERENCES "public"."instagram_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_branches_fk" FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ana_sayfa_mission_levels" ADD CONSTRAINT "ana_sayfa_mission_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ana_sayfa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ana_sayfa_mission_decor_media" ADD CONSTRAINT "ana_sayfa_mission_decor_media_media_media_id_media_id_fk" FOREIGN KEY ("media_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ana_sayfa_mission_decor_media" ADD CONSTRAINT "ana_sayfa_mission_decor_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ana_sayfa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ana_sayfa_neden_marquee_values" ADD CONSTRAINT "ana_sayfa_neden_marquee_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ana_sayfa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ana_sayfa_quick_links_section_links" ADD CONSTRAINT "ana_sayfa_quick_links_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ana_sayfa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ana_sayfa" ADD CONSTRAINT "ana_sayfa_video_section_featured_video_media_id_media_id_fk" FOREIGN KEY ("video_section_featured_video_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ana_sayfa" ADD CONSTRAINT "ana_sayfa_guncel_section_featured_event_media_media_id_media_id_fk" FOREIGN KEY ("guncel_section_featured_event_media_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "hero_slides_slide_media_slide_media_media_idx" ON "hero_slides" USING btree ("slide_media_media_id");
  CREATE INDEX "hero_slides_updated_at_idx" ON "hero_slides" USING btree ("updated_at");
  CREATE INDEX "hero_slides_created_at_idx" ON "hero_slides" USING btree ("created_at");
  CREATE INDEX "journey_chapters_chapter_media_chapter_media_media_idx" ON "journey_chapters" USING btree ("chapter_media_media_id");
  CREATE INDEX "journey_chapters_updated_at_idx" ON "journey_chapters" USING btree ("updated_at");
  CREATE INDEX "journey_chapters_created_at_idx" ON "journey_chapters" USING btree ("created_at");
  CREATE INDEX "neden_sultan_items_updated_at_idx" ON "neden_sultan_items" USING btree ("updated_at");
  CREATE INDEX "neden_sultan_items_created_at_idx" ON "neden_sultan_items" USING btree ("created_at");
  CREATE INDEX "instagram_posts_post_media_post_media_media_idx" ON "instagram_posts" USING btree ("post_media_media_id");
  CREATE INDEX "instagram_posts_updated_at_idx" ON "instagram_posts" USING btree ("updated_at");
  CREATE INDEX "instagram_posts_created_at_idx" ON "instagram_posts" USING btree ("created_at");
  CREATE INDEX "branches_levels_order_idx" ON "branches_levels" USING btree ("_order");
  CREATE INDEX "branches_levels_parent_id_idx" ON "branches_levels" USING btree ("_parent_id");
  CREATE INDEX "branches_gallery_order_idx" ON "branches_gallery" USING btree ("_order");
  CREATE INDEX "branches_gallery_parent_id_idx" ON "branches_gallery" USING btree ("_parent_id");
  CREATE INDEX "branches_gallery_item_item_media_idx" ON "branches_gallery" USING btree ("item_media_id");
  CREATE UNIQUE INDEX "branches_slug_idx" ON "branches" USING btree ("slug");
  CREATE INDEX "branches_preview_media_preview_media_media_idx" ON "branches" USING btree ("preview_media_media_id");
  CREATE INDEX "branches_updated_at_idx" ON "branches" USING btree ("updated_at");
  CREATE INDEX "branches_created_at_idx" ON "branches" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_featured_image_idx" ON "news" USING btree ("featured_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_featured_image_idx" ON "_news_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_branch_idx" ON "events" USING btree ("branch_id");
  CREATE INDEX "events_featured_image_idx" ON "events" USING btree ("featured_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_branch_idx" ON "_events_v" USING btree ("version_branch_id");
  CREATE INDEX "_events_v_version_version_featured_image_idx" ON "_events_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_hero_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_slides_id");
  CREATE INDEX "payload_locked_documents_rels_journey_chapters_id_idx" ON "payload_locked_documents_rels" USING btree ("journey_chapters_id");
  CREATE INDEX "payload_locked_documents_rels_neden_sultan_items_id_idx" ON "payload_locked_documents_rels" USING btree ("neden_sultan_items_id");
  CREATE INDEX "payload_locked_documents_rels_instagram_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("instagram_posts_id");
  CREATE INDEX "payload_locked_documents_rels_branches_id_idx" ON "payload_locked_documents_rels" USING btree ("branches_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "ana_sayfa_mission_levels_order_idx" ON "ana_sayfa_mission_levels" USING btree ("_order");
  CREATE INDEX "ana_sayfa_mission_levels_parent_id_idx" ON "ana_sayfa_mission_levels" USING btree ("_parent_id");
  CREATE INDEX "ana_sayfa_mission_decor_media_order_idx" ON "ana_sayfa_mission_decor_media" USING btree ("_order");
  CREATE INDEX "ana_sayfa_mission_decor_media_parent_id_idx" ON "ana_sayfa_mission_decor_media" USING btree ("_parent_id");
  CREATE INDEX "ana_sayfa_mission_decor_media_media_media_media_idx" ON "ana_sayfa_mission_decor_media" USING btree ("media_media_id");
  CREATE INDEX "ana_sayfa_neden_marquee_values_order_idx" ON "ana_sayfa_neden_marquee_values" USING btree ("_order");
  CREATE INDEX "ana_sayfa_neden_marquee_values_parent_id_idx" ON "ana_sayfa_neden_marquee_values" USING btree ("_parent_id");
  CREATE INDEX "ana_sayfa_quick_links_section_links_order_idx" ON "ana_sayfa_quick_links_section_links" USING btree ("_order");
  CREATE INDEX "ana_sayfa_quick_links_section_links_parent_id_idx" ON "ana_sayfa_quick_links_section_links" USING btree ("_parent_id");
  CREATE INDEX "ana_sayfa_video_section_featured_video_video_section_fea_idx" ON "ana_sayfa" USING btree ("video_section_featured_video_media_id");
  CREATE INDEX "ana_sayfa_guncel_section_featured_event_media_guncel_sec_idx" ON "ana_sayfa" USING btree ("guncel_section_featured_event_media_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "hero_slides" CASCADE;
  DROP TABLE "journey_chapters" CASCADE;
  DROP TABLE "neden_sultan_items" CASCADE;
  DROP TABLE "instagram_posts" CASCADE;
  DROP TABLE "branches_levels" CASCADE;
  DROP TABLE "branches_gallery" CASCADE;
  DROP TABLE "branches" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "ana_sayfa_mission_levels" CASCADE;
  DROP TABLE "ana_sayfa_mission_decor_media" CASCADE;
  DROP TABLE "ana_sayfa_neden_marquee_values" CASCADE;
  DROP TABLE "ana_sayfa_quick_links_section_links" CASCADE;
  DROP TABLE "ana_sayfa" CASCADE;
  DROP TYPE "public"."enum_hero_slides_slide_media_kind";
  DROP TYPE "public"."enum_journey_chapters_icon_key";
  DROP TYPE "public"."enum_journey_chapters_chapter_media_kind";
  DROP TYPE "public"."enum_instagram_posts_post_media_kind";
  DROP TYPE "public"."enum_branches_gallery_item_kind";
  DROP TYPE "public"."enum_branches_preview_media_kind";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_ana_sayfa_mission_decor_media_media_kind";
  DROP TYPE "public"."enum_ana_sayfa_quick_links_section_links_icon_key";
  DROP TYPE "public"."enum_ana_sayfa_video_section_featured_video_kind";
  DROP TYPE "public"."enum_ana_sayfa_guncel_section_featured_event_media_kind";`)
}
