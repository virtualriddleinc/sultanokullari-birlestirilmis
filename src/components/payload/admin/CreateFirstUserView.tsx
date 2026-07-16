import { CreateFirstUserView as PayloadCreateFirstUserView } from "@payloadcms/next/views";
import type { AdminViewServerProps } from "payload";
import React from "react";

import AdminLoginBackdrop from "./AdminLoginBackdrop";
import {
  isBootstrapFailClosed,
  isBootstrapLockClaimed,
} from "@/lib/cms-security";

function BootstrapClosedMessage({ adminHref }: { adminHref: string }) {
  return (
    <div className="create-first-user sultan-bootstrap-closed">
      <h1 className="sultan-display">Sistem zaten yapılandırılmış</h1>
      <p>
        İlk kullanıcı oluşturma kapalı. Hesabınız yoksa yöneticinizle iletişime
        geçin.
      </p>
      <a className="btn btn--style-primary btn--size-large" href={adminHref}>
        Yönetim girişine git
      </a>
    </div>
  );
}

/** İlk kullanıcı oluşturma — login ile aynı marka paneli */
export default async function CreateFirstUserView(props: AdminViewServerProps) {
  const {
    initPageResult: {
      req: {
        payload,
        payload: {
          config: {
            routes: { admin },
          },
        },
      },
    },
  } = props;

  const loginHref = `${admin}/login`;

  let userCount = 0;
  try {
    const counted = await payload.count({
      collection: "users",
      overrideAccess: true,
    });
    userCount = counted.totalDocs;
  } catch {
    userCount = 0;
  }

  let lockClaimed = false;
  try {
    lockClaimed = await isBootstrapLockClaimed();
  } catch {
    lockClaimed = false;
  }

  const failClosed = isBootstrapFailClosed();

  // Kurulu sistem, kilit alınmış veya prod fail-closed → formu gösterme.
  // Acil bootstrap: seed-admin veya x-bootstrap-secret ile API (UI değil).
  const showClosed = userCount > 0 || lockClaimed || failClosed;

  return (
    <>
      <AdminLoginBackdrop />
      {showClosed ? (
        <BootstrapClosedMessage adminHref={loginHref} />
      ) : (
        <PayloadCreateFirstUserView {...props} />
      )}
    </>
  );
}
