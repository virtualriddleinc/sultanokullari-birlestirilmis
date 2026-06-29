import React from "react";

import { getInboxNavCounts } from "@/lib/admin-dashboard-data";

/** Sidebar üstünde gelen kutusu özet linkleri */
export default async function InboxNavLinks() {
  const counts = await getInboxNavCounts();
  const total = counts.unreadContact + counts.unreadIk;
  if (total === 0) return null;

  return (
    <div className="sultan-nav-inbox">
      {counts.unreadContact > 0 ? (
        <a href="/admin/collections/contact-messages?where[status][equals]=new" className="sultan-nav-inbox__link">
          Mesajlar
          <span className="sultan-inbox-badge sultan-inbox-badge--new">{counts.unreadContact}</span>
        </a>
      ) : null}
      {counts.unreadIk > 0 ? (
        <a href="/admin/collections/ik-applications?where[status][equals]=new" className="sultan-nav-inbox__link">
          İK
          <span className="sultan-inbox-badge sultan-inbox-badge--new">{counts.unreadIk}</span>
        </a>
      ) : null}
    </div>
  );
}
