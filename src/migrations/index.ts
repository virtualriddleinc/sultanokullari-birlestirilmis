import * as migration_20260628_140634_initial from "./20260628_140634_initial";
import * as migration_20260628_142235_admin_modernization from "./20260628_142235_admin_modernization";
import * as migration_20260628_174500_cms_revalidation_orderable from "./20260628_174500_cms_revalidation_orderable";
import * as migration_20260628_180000_fix_orderable_sort_preferences from "./20260628_180000_fix_orderable_sort_preferences";
import * as migration_20260628_190000_admin_v3 from "./20260628_190000_admin_v3";
import * as migration_20260628_191000_staff_locked_docs_rels from "./20260628_191000_staff_locked_docs_rels";
import * as migration_20260628_200000_fix_user_roles from "./20260628_200000_fix_user_roles";
import * as migration_20260701_000000_staff_education_fields from "./20260701_000000_staff_education_fields";
import * as migration_20260701_010000_staff_egitim_danisma_department from "./20260701_010000_staff_egitim_danisma_department";
import * as migration_20260711_000000_hero_slide_focal_point from "./20260711_000000_hero_slide_focal_point";
import * as migration_20260711_010000_cms_security_maturity from "./20260711_010000_cms_security_maturity";
import * as migration_20260714_000000_fix_orderable_fractional_keys from "./20260714_000000_fix_orderable_fractional_keys";
import * as migration_20260714_120000_navigation_extra_links from "./20260714_120000_navigation_extra_links";
import * as migration_20260714_130000_schema_drift_smoke_fix from "./20260714_130000_schema_drift_smoke_fix";
import * as migration_20260714_130100_media_tags_order_columns from "./20260714_130100_media_tags_order_columns";
import * as migration_20260714_130200_media_size_columns from "./20260714_130200_media_size_columns";
import * as migration_20260714_130300_locked_document_rel_columns from "./20260714_130300_locked_document_rel_columns";
import * as migration_20260714_130400_branch_media_item_tables from "./20260714_130400_branch_media_item_tables";
import * as migration_20260714_190000_gayemiz_global from "./20260714_190000_gayemiz_global";
import * as migration_20260714_200000_gayemiz_remove_default_card from "./20260714_200000_gayemiz_remove_default_card";
import * as migration_20260714_210000_journey_chapter_focal_point from "./20260714_210000_journey_chapter_focal_point";
import * as migration_20260716_180000_cms_bootstrap_security from "./20260716_180000_cms_bootstrap_security";

export const migrations = [
  {
    up: migration_20260628_140634_initial.up,
    down: migration_20260628_140634_initial.down,
    name: "20260628_140634_initial",
  },
  {
    up: migration_20260628_142235_admin_modernization.up,
    down: migration_20260628_142235_admin_modernization.down,
    name: "20260628_142235_admin_modernization",
  },
  {
    up: migration_20260628_174500_cms_revalidation_orderable.up,
    down: migration_20260628_174500_cms_revalidation_orderable.down,
    name: "20260628_174500_cms_revalidation_orderable",
  },
  {
    up: migration_20260628_180000_fix_orderable_sort_preferences.up,
    down: migration_20260628_180000_fix_orderable_sort_preferences.down,
    name: "20260628_180000_fix_orderable_sort_preferences",
  },
  {
    up: migration_20260628_190000_admin_v3.up,
    down: migration_20260628_190000_admin_v3.down,
    name: "20260628_190000_admin_v3",
  },
  {
    up: migration_20260628_191000_staff_locked_docs_rels.up,
    down: migration_20260628_191000_staff_locked_docs_rels.down,
    name: "20260628_191000_staff_locked_docs_rels",
  },
  {
    up: migration_20260628_200000_fix_user_roles.up,
    down: migration_20260628_200000_fix_user_roles.down,
    name: "20260628_200000_fix_user_roles",
  },
  {
    up: migration_20260701_000000_staff_education_fields.up,
    down: migration_20260701_000000_staff_education_fields.down,
    name: "20260701_000000_staff_education_fields",
  },
  {
    up: migration_20260701_010000_staff_egitim_danisma_department.up,
    down: migration_20260701_010000_staff_egitim_danisma_department.down,
    name: "20260701_010000_staff_egitim_danisma_department",
  },
  {
    up: migration_20260711_000000_hero_slide_focal_point.up,
    down: migration_20260711_000000_hero_slide_focal_point.down,
    name: "20260711_000000_hero_slide_focal_point",
  },
  {
    up: migration_20260711_010000_cms_security_maturity.up,
    down: migration_20260711_010000_cms_security_maturity.down,
    name: "20260711_010000_cms_security_maturity",
  },
  {
    up: migration_20260714_000000_fix_orderable_fractional_keys.up,
    down: migration_20260714_000000_fix_orderable_fractional_keys.down,
    name: "20260714_000000_fix_orderable_fractional_keys",
  },
  {
    up: migration_20260714_120000_navigation_extra_links.up,
    down: migration_20260714_120000_navigation_extra_links.down,
    name: "20260714_120000_navigation_extra_links",
  },
  {
    up: migration_20260714_130000_schema_drift_smoke_fix.up,
    down: migration_20260714_130000_schema_drift_smoke_fix.down,
    name: "20260714_130000_schema_drift_smoke_fix",
  },
  {
    up: migration_20260714_130100_media_tags_order_columns.up,
    down: migration_20260714_130100_media_tags_order_columns.down,
    name: "20260714_130100_media_tags_order_columns",
  },
  {
    up: migration_20260714_130200_media_size_columns.up,
    down: migration_20260714_130200_media_size_columns.down,
    name: "20260714_130200_media_size_columns",
  },
  {
    up: migration_20260714_130300_locked_document_rel_columns.up,
    down: migration_20260714_130300_locked_document_rel_columns.down,
    name: "20260714_130300_locked_document_rel_columns",
  },
  {
    up: migration_20260714_130400_branch_media_item_tables.up,
    down: migration_20260714_130400_branch_media_item_tables.down,
    name: "20260714_130400_branch_media_item_tables",
  },
  {
    up: migration_20260714_190000_gayemiz_global.up,
    down: migration_20260714_190000_gayemiz_global.down,
    name: "20260714_190000_gayemiz_global",
  },
  {
    up: migration_20260714_200000_gayemiz_remove_default_card.up,
    down: migration_20260714_200000_gayemiz_remove_default_card.down,
    name: "20260714_200000_gayemiz_remove_default_card",
  },
  {
    up: migration_20260714_210000_journey_chapter_focal_point.up,
    down: migration_20260714_210000_journey_chapter_focal_point.down,
    name: "20260714_210000_journey_chapter_focal_point",
  },
  {
    up: migration_20260716_180000_cms_bootstrap_security.up,
    down: migration_20260716_180000_cms_bootstrap_security.down,
    name: "20260716_180000_cms_bootstrap_security",
  },
];
