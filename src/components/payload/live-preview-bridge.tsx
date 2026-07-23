import { draftMode } from "next/headers";
import { PayloadRefreshOnSave } from "@/components/payload/RefreshOnSave";

/** Draft preview köprüsü — Suspense içinde; yayın HTML'ini force-dynamic yapmaz. */
export async function LivePreviewBridge() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return <PayloadRefreshOnSave enabled />;
}
