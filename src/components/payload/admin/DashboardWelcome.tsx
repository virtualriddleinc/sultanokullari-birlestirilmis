import React from "react";

import { getDashboardStats } from "@/lib/admin-dashboard-data";
import { getPreviewBaseUrl } from "@/payload/admin-groups";

const editorQuickLinks = [
  { href: "/admin/globals/ana-sayfa", label: "Ana Sayfa Düzeni" },
  { href: "/admin/collections/hero-slides", label: "Hero" },
  { href: "/admin/globals/gayemiz", label: "Gâyemiz" },
  { href: "/admin/collections/news/create", label: "Haber / Duyuru Ekle" },
  { href: "/admin/collections/media-items/create", label: "Medya Ekle" },
  { href: "/admin/collections/pages/create", label: "Sayfa Ekle" },
  { href: "/admin/collections/contact-messages?where[status][equals]=new", label: "Gelen Kutusu" },
];

const inboxQuickLinks = [
  { href: "/admin/collections/contact-messages?where[status][equals]=new", label: "İletişim Mesajları" },
  { href: "/admin/collections/ik-applications?where[status][equals]=new", label: "İK Başvuruları" },
  { href: "/admin/collections/application-files", label: "Başvuru Dosyaları" },
  { href: "/admin/account", label: "Hesabım" },
];

const adminQuickLinks = [
  ...editorQuickLinks,
  { href: "/admin/collections/users", label: "Kullanıcılar" },
  { href: "/admin/globals/site-ayarlari", label: "Site Ayarları" },
  { href: "/admin/globals/navigation", label: "Navigasyon" },
];

const siteMapLinks = [
  { href: "/#guncel", label: "Güncel" },
  { href: "/#okullarimiz", label: "Okullarımız" },
  { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
  { href: "/guncel/medya", label: "Medya" },
  { href: "/guncel/haberler", label: "Haberler" },
];

function StatCard({
  label,
  value,
  href,
  tone = "default",
}: {
  label: string;
  value: number;
  href: string;
  tone?: "default" | "warn" | "accent";
}) {
  return (
    <a href={href} className={`sultan-stat-card sultan-stat-card--${tone}`}>
      <span className="sultan-stat-card__value">{value}</span>
      <span className="sultan-stat-card__label">{label}</span>
    </a>
  );
}

export default async function DashboardWelcome() {
  const stats = await getDashboardStats();
  const siteUrl = getPreviewBaseUrl();
  const quickLinks = stats.isAdmin
    ? adminQuickLinks
    : stats.isInboxOnly
      ? inboxQuickLinks
      : editorQuickLinks;

  return (
    <div className="sultan-dashboard">
      <header className="sultan-dashboard__header">
        <div>
          <h1 className="sultan-dashboard__title sultan-display">Sultan Okulları Yönetim Paneli</h1>
          <p className="sultan-dashboard__subtitle">
            {stats.isAdmin
              ? "Yönetici görünümü — içerik, kullanıcılar ve sistem ayarları."
              : stats.isInboxOnly
                ? "Gelen kutusu görünümü — yalnızca iletişim ve İK başvuruları."
                : "Editör görünümü — taslaklar, gelen kutusu ve hızlı içerik eylemleri."}
          </p>
        </div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sultan-dashboard__preview"
        >
          Siteyi önizle ↗
        </a>
      </header>

      {!stats.cmsHealth.ok && stats.cmsHealth.issues.length > 0 ? (
        <section className="sultan-dashboard__health" aria-label="CMS sağlık">
          {stats.cmsHealth.issues.map((issue) => (
            <p key={issue.message} className={`sultan-dashboard__health-item sultan-dashboard__health-item--${issue.level}`}>
              {issue.message}
              {issue.action ? <span> — {issue.action}</span> : null}
            </p>
          ))}
        </section>
      ) : null}

      <section className="sultan-dashboard__stats" aria-label="Özet">
        {stats.isInboxOnly ? (
          <>
            <StatCard
              label="Okunmamış mesaj"
              value={stats.unreadContact}
              href="/admin/collections/contact-messages?where[status][equals]=new"
              tone="accent"
            />
            <StatCard
              label="Yeni İK başvurusu"
              value={stats.unreadIk}
              href="/admin/collections/ik-applications?where[status][equals]=new"
              tone="accent"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Taslak haber"
              value={stats.draftNews}
              href="/admin/collections/news?where[_status][equals]=draft"
              tone="warn"
            />
            <StatCard
              label="Taslak etkinlik"
              value={stats.draftEvents}
              href="/admin/collections/events?where[_status][equals]=draft"
              tone="warn"
            />
            <StatCard
              label="Okunmamış mesaj"
              value={stats.unreadContact}
              href="/admin/collections/contact-messages?where[status][equals]=new"
              tone="accent"
            />
            <StatCard
              label="Yeni İK başvurusu"
              value={stats.unreadIk}
              href="/admin/collections/ik-applications?where[status][equals]=new"
              tone="accent"
            />
            <StatCard
              label="Yaklaşan etkinlik"
              value={stats.upcomingEvents}
              href="/admin/collections/events"
            />
            {stats.isAdmin ? (
              <StatCard
                label="Panel kullanıcısı"
                value={stats.userCount}
                href="/admin/collections/users"
              />
            ) : null}
          </>
        )}
      </section>

      <section className="sultan-dashboard__quick" aria-label="Hızlı eylemler">
        <h2 className="sultan-dashboard__section-title">Hızlı eylemler</h2>
        <div className="sultan-dashboard__links">
          {quickLinks.map((link) => (
            <a key={link.href} href={link.href} className="sultan-dashboard__link">
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="sultan-dashboard__quick" aria-label="Site haritası">
        <h2 className="sultan-dashboard__section-title">Sık kullanılan site linkleri</h2>
        <div className="sultan-dashboard__links">
          {siteMapLinks.map((link) => (
            <a
              key={link.href}
              href={`${siteUrl}${link.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sultan-dashboard__link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {stats.recentEdits.length > 0 ? (
        <section className="sultan-dashboard__recent" aria-label="Son düzenlenen">
          <h2 className="sultan-dashboard__section-title">Son düzenlenen içerik</h2>
          <ul className="sultan-dashboard__recent-list">
            {stats.recentEdits.map((item) => (
              <li key={`${item.collection}-${item.id}`}>
                <a href={`/admin/collections/${item.collection}/${item.id}`}>
                  <strong>{item.title}</strong>
                  <span>{item.label}</span>
                  <time dateTime={item.updatedAt}>
                    {new Date(item.updatedAt).toLocaleDateString("tr-TR")}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stats.recentContacts.length > 0 ? (
        <section className="sultan-dashboard__recent" aria-label="Son mesajlar">
          <h2 className="sultan-dashboard__section-title">Son iletişim mesajları</h2>
          <ul className="sultan-dashboard__recent-list">
            {stats.recentContacts.map((item) => (
              <li key={item.id}>
                <a href={`/admin/collections/contact-messages/${item.id}`}>
                  <strong>{item.name}</strong>
                  <span>{item.subject}</span>
                  <time dateTime={item.createdAt}>
                    {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stats.recentIk.length > 0 ? (
        <section className="sultan-dashboard__recent" aria-label="Son İK başvuruları">
          <h2 className="sultan-dashboard__section-title">Son İK başvuruları</h2>
          <ul className="sultan-dashboard__recent-list">
            {stats.recentIk.map((item) => (
              <li key={item.id}>
                <a href={`/admin/collections/ik-applications/${item.id}`}>
                  <strong>{item.fullName}</strong>
                  <span>{item.position}</span>
                  <time dateTime={item.createdAt}>
                    {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="sultan-dashboard__hint">
        Hero, Gâyemiz, yolculuk, Instagram ve Neden Sultan içerikleri Ana Sayfa
        menüsünden yönetilir. Listelerde sıralama için{" "}
        <strong>sürükle-bırak</strong> kullanın.
      </p>
    </div>
  );
}
