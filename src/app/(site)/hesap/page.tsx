import { redirect } from "next/navigation";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/hesap/auth-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hesabım — Sultan Okulları" };

export default async function HesapPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/hesap/giris");

  const { data: profile } = await supabase
    .from("profiles")
    .select("approved, is_active, rejected, is_admin, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.approved || !profile?.is_active || profile?.rejected) {
    redirect("/hesap/dogrulama");
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-emerald-950">
          Hoş geldiniz{fullName ? `, ${fullName}` : ""}
        </h1>
        <p className="text-sm text-zinc-600">Hesabınız aktif. E-posta: {user.email}</p>
      </header>

      {profile.is_admin ? (
        <Link
          href="/hesap/onay"
          className="block rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
        >
          Yönetici: Onay bekleyen kayıtları görüntüle →
        </Link>
      ) : null}

      <div className="flex flex-col gap-3">
        <Link href="/hesap/sifremi-unuttum" className="text-sm text-emerald-700 hover:underline">
          Şifremi değiştir
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}
