import React from "react";

/** Login — sol yeşil panelde logo + tek başlık */
export default function AdminLoginBackdrop() {
  return (
    <aside className="sultan-login-panel">
      <div className="sultan-login-panel__pattern" aria-hidden="true" />
      <div className="sultan-login-panel__brand">
        <div className="sultan-login-panel__logo-wrap">
          <img
            className="sultan-login-panel__logo"
            src="/admin-login-logo.svg"
            alt=""
            width={264}
            height={218}
            decoding="async"
            aria-hidden
          />
        </div>
        <h1 className="sultan-login-panel__title sultan-display">
          <span className="sultan-login-panel__title-line">Sultan Okulları</span>
          <span className="sultan-login-panel__title-line">İçerik Yönetim Sistemi</span>
        </h1>
      </div>
    </aside>
  );
}
