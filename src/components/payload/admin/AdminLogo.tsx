import React from "react";

type Props = {
  readonly?: boolean;
};

/** Admin giriş ve sidebar markası — arma + metin */
export default function AdminLogo(_props: Props) {
  return (
    <div className="sultan-admin-logo">
      <img
        className="sultan-admin-logo__img"
        src="/admin-login-logo.svg"
        alt=""
        width={72}
        height={60}
        decoding="async"
        aria-hidden
      />
      <div className="sultan-admin-logo__text">
        <span className="sultan-admin-logo__name sultan-display">Sultan Okulları</span>
        <span className="sultan-admin-logo__badge">Yönetim</span>
      </div>
    </div>
  );
}
