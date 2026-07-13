import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { isSafePreviewPath } from "@/lib/preview-path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";

  if (
    !process.env.PREVIEW_SECRET ||
    secret !== process.env.PREVIEW_SECRET
  ) {
    return new Response("Yetkisiz önizleme isteği", { status: 401 });
  }

  if (!isSafePreviewPath(path)) {
    return new Response("Geçersiz önizleme yolu", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
