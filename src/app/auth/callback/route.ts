import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase e-posta bağlantısı callback'i.
 * - E-posta onayı (signup) ve şifre sıfırlama (recovery) bağlantıları buraya döner.
 * - PKCE `code` varsa oturuma çevrilir; ardından `next` hedefine yönlendirilir.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/hesap/dogrulama";
  const errorDescription = searchParams.get("error_description");

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/hesap/giris?error=${encodeURIComponent(errorDescription)}`,
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/hesap/giris?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/hesap/giris`);
}
