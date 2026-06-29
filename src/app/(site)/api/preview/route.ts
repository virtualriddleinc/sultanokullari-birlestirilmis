import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

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

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
