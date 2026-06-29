import React from "react";

type Props = {
  readonly?: boolean;
};

/** Admin giriş ve sidebar markası */
export default function AdminLogo(_props: Props) {
  return (
    <div className="sultan-admin-logo">
      <img
        src="/sultan-okullari-logo.svg"
        alt="Sultan Okulları"
        width={160}
        height={40}
        style={{ maxHeight: "2.25rem", width: "auto" }}
      />
      <span className="sultan-admin-logo__badge sultan-display">Yönetim</span>
    </div>
  );
}
