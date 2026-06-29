import * as migration_20260628_140634_initial from './20260628_140634_initial';
import * as migration_20260628_142235_admin_modernization from './20260628_142235_admin_modernization';
import * as migration_20260628_174500_cms_revalidation_orderable from './20260628_174500_cms_revalidation_orderable';
import * as migration_20260628_180000_fix_orderable_sort_preferences from './20260628_180000_fix_orderable_sort_preferences';
import * as migration_20260628_190000_admin_v3 from './20260628_190000_admin_v3';
import * as migration_20260628_191000_staff_locked_docs_rels from './20260628_191000_staff_locked_docs_rels';
import * as migration_20260628_200000_fix_user_roles from './20260628_200000_fix_user_roles';

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
];
