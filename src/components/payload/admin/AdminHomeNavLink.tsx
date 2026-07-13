import React from "react";

/** Sidebar üstünde yönetim paneli anasayfasına (dashboard) dönüş linki */
export default function AdminHomeNavLink() {
  return (
    <div className="sultan-nav-home">
      <a href="/admin" className="sultan-nav-home__link" aria-label="Yönetim paneli anasayfası">
        <span className="sultan-nav-home__icon" aria-hidden>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </span>
        Ana Sayfa
      </a>
    </div>
  );
}
