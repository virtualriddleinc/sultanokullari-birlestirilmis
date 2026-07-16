import { CreateFirstUserView as PayloadCreateFirstUserView } from "@payloadcms/next/views";
import type { AdminViewServerProps } from "payload";
import React from "react";

import AdminLoginBackdrop from "./AdminLoginBackdrop";

/** İlk kullanıcı oluşturma — login ile aynı marka paneli */
export default async function CreateFirstUserView(props: AdminViewServerProps) {
  return (
    <>
      <AdminLoginBackdrop />
      <PayloadCreateFirstUserView {...props} />
    </>
  );
}
