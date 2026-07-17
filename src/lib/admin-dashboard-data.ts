import "server-only";

import { headers } from "next/headers";

import { getCmsHealth, type CmsHealth } from "@/lib/cms-health";
import { getPayloadClient } from "@/lib/payload";
import type { AppUser } from "@/payload/access";
import { hasRole } from "@/payload/access";
import { isInboxOnly } from "@/payload/admin-visibility";

export type { CmsHealth, CmsHealthIssue } from "@/lib/cms-health";

export type RecentEdit = {
  collection: string;
  label: string;
  id: string | number;
  title: string;
  updatedAt: string;
};

export type RecentActivity = {
  id: string | number;
  summary: string;
  action: string;
  collection: string;
  userEmail: string;
  createdAt: string;
};

export type DashboardStats = {
  isAdmin: boolean;
  isInboxOnly: boolean;
  draftNews: number;
  draftEvents: number;
  unreadContact: number;
  unreadIk: number;
  upcomingEvents: number;
  recentContacts: { id: string | number; name: string; subject: string; createdAt: string }[];
  recentIk: { id: string | number; fullName: string; position: string; createdAt: string }[];
  recentEdits: RecentEdit[];
  recentActivity: RecentActivity[];
  unreadNotifications: number;
  cmsHealth: CmsHealth;
  userCount: number;
};

const emptyHealth: CmsHealth = { ok: true, issues: [], counts: {} };

export async function getDashboardUser(): Promise<AppUser | null> {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });
    return user as AppUser | null;
  } catch {
    return null;
  }
}

export async function getInboxNavCounts(): Promise<{
  unreadContact: number;
  unreadIk: number;
}> {
  try {
    const payload = await getPayloadClient();
    const [unreadContact, unreadIk] = await Promise.all([
      payload.count({
        collection: "contact-messages",
        where: { status: { equals: "new" } },
      }),
      payload.count({
        collection: "ik-applications",
        where: { status: { equals: "new" } },
      }),
    ]);
    return {
      unreadContact: unreadContact.totalDocs,
      unreadIk: unreadIk.totalDocs,
    };
  } catch {
    return { unreadContact: 0, unreadIk: 0 };
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.count({
      collection: "notifications",
      where: { isRead: { equals: false } },
    });
    return res.totalDocs;
  } catch {
    return 0;
  }
}

async function fetchRecentActivity(isAdmin: boolean): Promise<RecentActivity[]> {
  if (!isAdmin) return [];
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "audit-logs",
      sort: "-createdAt",
      limit: 8,
      depth: 0,
    });
    return res.docs.map((d) => ({
      id: d.id,
      summary: (d.summary as string) || "—",
      action: (d.action as string) || "",
      collection: (d.collection as string) || "",
      userEmail: (d.userEmail as string) || "",
      createdAt: d.createdAt as string,
    }));
  } catch {
    return [];
  }
}

async function fetchRecentEdits(): Promise<RecentEdit[]> {
  try {
    const payload = await getPayloadClient();
    const [hero, news, branches] = await Promise.all([
      payload.find({ collection: "hero-slides", sort: "-updatedAt", limit: 3, depth: 0 }),
      payload.find({ collection: "news", sort: "-updatedAt", limit: 3, depth: 0 }),
      payload.find({ collection: "branches", sort: "-updatedAt", limit: 3, depth: 0 }),
    ]);

    const edits: RecentEdit[] = [
      ...hero.docs.map((d) => ({
        collection: "hero-slides",
        label: "Hero",
        id: d.id,
        title: (d.tagline as string) || "Slayt",
        updatedAt: d.updatedAt as string,
      })),
      ...news.docs.map((d) => ({
        collection: "news",
        label: "Haber",
        id: d.id,
        title: (d.title as string) || "—",
        updatedAt: d.updatedAt as string,
      })),
      ...branches.docs.map((d) => ({
        collection: "branches",
        label: "Şube",
        id: d.id,
        title: (d.name as string) || "—",
        updatedAt: d.updatedAt as string,
      })),
    ];

    return edits
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const user = await getDashboardUser();
  const isAdmin = hasRole(user, "admin");
  const inboxOnly = isInboxOnly(user);

  const empty: DashboardStats = {
    isAdmin,
    isInboxOnly: inboxOnly,
    draftNews: 0,
    draftEvents: 0,
    unreadContact: 0,
    unreadIk: 0,
    upcomingEvents: 0,
    recentContacts: [],
    recentIk: [],
    recentEdits: [],
    recentActivity: [],
    unreadNotifications: 0,
    cmsHealth: emptyHealth,
    userCount: 0,
  };

  try {
    const payload = await getPayloadClient();
    const now = new Date().toISOString();

    const [
      newsDrafts,
      eventsDrafts,
      unreadContact,
      unreadIk,
      upcoming,
      recentContacts,
      recentIk,
      cmsHealth,
      recentEdits,
      recentActivity,
      unreadNotifications,
      userCount,
    ] = await Promise.all([
      payload.count({ collection: "news", where: { _status: { equals: "draft" } } }),
      payload.count({ collection: "events", where: { _status: { equals: "draft" } } }),
      payload.count({ collection: "contact-messages", where: { status: { equals: "new" } } }),
      payload.count({ collection: "ik-applications", where: { status: { equals: "new" } } }),
      payload.count({
        collection: "events",
        where: {
          and: [{ date: { greater_than_equal: now } }, { _status: { equals: "published" } }],
        },
      }),
      payload.find({ collection: "contact-messages", sort: "-createdAt", limit: 5, depth: 0 }),
      payload.find({ collection: "ik-applications", sort: "-createdAt", limit: 5, depth: 0 }),
      getCmsHealth(),
      fetchRecentEdits(),
      fetchRecentActivity(isAdmin),
      getUnreadNotificationCount(),
      isAdmin ? payload.count({ collection: "users" }) : Promise.resolve({ totalDocs: 0 }),
    ]);

    return {
      isAdmin,
      isInboxOnly: inboxOnly,
      draftNews: newsDrafts.totalDocs,
      draftEvents: eventsDrafts.totalDocs,
      unreadContact: unreadContact.totalDocs,
      unreadIk: unreadIk.totalDocs,
      upcomingEvents: upcoming.totalDocs,
      recentContacts: recentContacts.docs.map((doc) => ({
        id: doc.id,
        name: doc.name as string,
        subject: doc.subject as string,
        createdAt: doc.createdAt as string,
      })),
      recentIk: recentIk.docs.map((doc) => ({
        id: doc.id,
        fullName: doc.fullName as string,
        position: doc.position as string,
        createdAt: doc.createdAt as string,
      })),
      recentEdits,
      recentActivity,
      unreadNotifications,
      cmsHealth,
      userCount: userCount.totalDocs,
    };
  } catch {
    return empty;
  }
}
