import * as migration_20260628_140634_initial from './20260628_140634_initial';
import * as migration_20260628_142235_admin_modernization from './20260628_142235_admin_modernization';
import * as migration_20260628_174500_cms_revalidation_orderable from './20260628_174500_cms_revalidation_orderable';
import * as migration_20260628_180000_fix_orderable_sort_preferences from './20260628_180000_fix_orderable_sort_preferences';
import * as migration_20260628_190000_admin_v3 from './20260628_190000_admin_v3';
import * as migration_20260628_191000_staff_locked_docs_rels from './20260628_191000_staff_locked_docs_rels';
import * as migration_20260628_200000_fix_user_roles from './20260628_200000_fix_user_roles';
import * as migration_20260701_000000_staff_education_fields from './20260701_000000_staff_education_fields';
import * as migration_20260701_010000_staff_egitim_danisma_department from './20260701_010000_staff_egitim_danisma_department';
import * as migration_20260711_000000_hero_slide_focal_point from './20260711_000000_hero_slide_focal_point';
import * as migration_20260711_010000_cms_security_maturity from './20260711_010000_cms_security_maturity';

export const migrations = [
  {
    up: migration_20260628_140634_initial.up,
    down: migration_20260628_140634_initial.down,
    name: '20260628_140634_initial',
  },
  {
    up: migration_20260628_142235_admin_modernization.up,
    down: migration_20260628_142235_admin_modernization.down,
    name: '20260628_142235_admin_modernization'
  },
  {
    up: migration_20260628_174500_cms_revalidation_orderable.up,
    down: migration_20260628_174500_cms_revalidation_orderable.down,
    name: '20260628_174500_cms_revalidation_orderable',
  },
  {
    up: migration_20260628_180000_fix_orderable_sort_preferences.up,
    down: migration_20260628_180000_fix_orderable_sort_preferences.down,
    name: '20260628_180000_fix_orderable_sort_preferences',
  },
  {
    up: migration_20260628_190000_admin_v3.up,
    down: migration_20260628_190000_admin_v3.down,
    name: '20260628_190000_admin_v3',
  },
  {
    up: migration_20260628_191000_staff_locked_docs_rels.up,
    down: migration_20260628_191000_staff_locked_docs_rels.down,
    name: '20260628_191000_staff_locked_docs_rels',
  },
  {
    up: migration_20260628_200000_fix_user_roles.up,
    down: migration_20260628_200000_fix_user_roles.down,
    name: '20260628_200000_fix_user_roles',
  },
  {
    up: migration_20260701_000000_staff_education_fields.up,
    down: migration_20260701_000000_staff_education_fields.down,
    name: '20260701_000000_staff_education_fields',
  },
  {
    up: migration_20260701_010000_staff_egitim_danisma_department.up,
    down: migration_20260701_010000_staff_egitim_danisma_department.down,
    name: '20260701_010000_staff_egitim_danisma_department',
  },
  {
    up: migration_20260711_000000_hero_slide_focal_point.up,
    down: migration_20260711_000000_hero_slide_focal_point.down,
    name: '20260711_000000_hero_slide_focal_point',
  },
  {
    up: migration_20260711_010000_cms_security_maturity.up,
    down: migration_20260711_010000_cms_security_maturity.down,
    name: '20260711_010000_cms_security_maturity',
  },
];
