import React from "react";

import { getUnreadNotificationCount } from "@/lib/admin-dashboard-data";

/** Sidebar üstünde okunmamış bildirim rozeti (hearing-crm NotificationBell uyarlaması) */
export default async function NotificationNavLink() {
  const unread = await getUnreadNotificationCount();

  return (
    <div className="sultan-nav-inbox">
      <a
        href="/admin/collections/notifications?where[isRead][equals]=false"
        className="sultan-nav-inbox__link"
      >
        Bildirimler
        {unread > 0 ? (
          <span className="sultan-inbox-badge sultan-inbox-badge--new">{unread}</span>
        ) : null}
      </a>
    </div>
  );
}
