import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

import {
  GUNCEL_PATHS,
  HOME_AND_NEDEN_PATHS,
  HOME_PATHS,
  revalidateBranchSlugs,
  revalidatePageSlug,
  revalidateSiteLayout,
  revalidateSitePaths,
} from "./revalidate-site";

export const revalidateHomeAfterChange: CollectionAfterChangeHook = () => {
  revalidateSitePaths(...HOME_PATHS);
};

export const revalidateHomeAfterDelete: CollectionAfterDeleteHook = () => {
  revalidateSitePaths(...HOME_PATHS);
};

export const revalidateHomeAndNedenAfterChange: CollectionAfterChangeHook = () => {
  revalidateSitePaths(...HOME_AND_NEDEN_PATHS);
};

export const revalidateHomeAndNedenAfterDelete: CollectionAfterDeleteHook = () => {
  revalidateSitePaths(...HOME_AND_NEDEN_PATHS);
};

export const revalidateGuncelAfterChange: CollectionAfterChangeHook = () => {
  revalidateSitePaths(...GUNCEL_PATHS);
};

export const revalidateGuncelAfterDelete: CollectionAfterDeleteHook = () => {
  revalidateSitePaths(...GUNCEL_PATHS);
};

export const revalidateBranchAfterChange: CollectionAfterChangeHook = ({
  doc,
}) => {
  revalidateBranchSlugs(
    doc.citySlug as string | undefined,
    doc.campusSlug as string | undefined,
    doc.slug as string | undefined,
  );
};

export const revalidateBranchAfterDelete: CollectionAfterDeleteHook = () => {
  revalidateSitePaths(
    "/",
    "/iletisim",
    "/subeler/sancaktepe",
    "/subeler/basiskele",
    "/subeler/serdivan",
    "/subeler/sincan",
    "/subeler/mevlana",
  );
  revalidateSiteLayout();
};

export const revalidatePageAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  const slug = doc.slug as string | undefined;
  if (slug) revalidatePageSlug(slug);
};

export const revalidatePageAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  const slug = doc.slug as string | undefined;
  if (slug) revalidatePageSlug(slug);
};

export const revalidateAnaSayfaAfterChange: GlobalAfterChangeHook = () => {
  revalidateSitePaths(...HOME_PATHS);
};

export const revalidateStaffAfterChange: CollectionAfterChangeHook = () => {
  revalidateSitePaths("/kurumsal/idari-kadro");
};

export const revalidateStaffAfterDelete: CollectionAfterDeleteHook = () => {
  revalidateSitePaths("/kurumsal/idari-kadro");
};

export const staffRevalidateHooks = {
  afterChange: [revalidateStaffAfterChange],
  afterDelete: [revalidateStaffAfterDelete],
};

export const homeRevalidateHooks = {
  afterChange: [revalidateHomeAfterChange],
  afterDelete: [revalidateHomeAfterDelete],
};

export const homeAndNedenRevalidateHooks = {
  afterChange: [revalidateHomeAndNedenAfterChange],
  afterDelete: [revalidateHomeAndNedenAfterDelete],
};

export const guncelRevalidateHooks = {
  afterChange: [revalidateGuncelAfterChange],
  afterDelete: [revalidateGuncelAfterDelete],
};

export const branchRevalidateHooks = {
  afterChange: [revalidateBranchAfterChange],
  afterDelete: [revalidateBranchAfterDelete],
};

export const pageRevalidateHooks = {
  afterChange: [revalidatePageAfterChange],
  afterDelete: [revalidatePageAfterDelete],
};
