import { redirect } from "next/navigation";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/hesap/auth-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hesap Doğrulama — Sultan Okulları" };

export default async function DogrulamaPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/hesap/giris");

  const { data: profile } = await supabase
    .from("profiles")
    .select("approved, is_active, rejected, is_admin, first_name")
    .eq("id", user.id)
    .maybeSingle();

  // Onaylı ve aktif → hesap ana sayfası
  if (profile?.approved && profile?.is_active && !profile?.rejected) {
    redirect("/hesap");
  }

  let title = "Hesabınız onay bekliyor";
  let message =
    "E-posta adresiniz doğrulandı. Hesabınız bir yönetici tarafından onaylandıktan sonra giriş yapabileceksiniz.";

  if (profile?.rejected) {
    title = "Erişim reddedildi";
    message = "Bu hesap için erişim izni bulunmamaktadır. Lütfen yöneticiyle iletişime geçin.";
  } else if (profile && !profile.is_active) {
    title = "Hesabınız pasif";
    message = "Hesabınız pasif durumdadır. Lütfen bir yönetici ile iletişime geçin.";
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
        ⏳
      </div>
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-emerald-950">{title}</h1>
        <p className="text-sm text-zinc-600">{message}</p>
      </header>
      <p className="text-xs text-zinc-500">Giriş yapan: {user.email}</p>
      <div className="flex flex-col items-center gap-3">
        <SignOutButton />
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
