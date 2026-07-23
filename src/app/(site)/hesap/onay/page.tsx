import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Onay Bekleyenler — Sultan Okulları" };

/** Oturumdaki kullanıcının yönetici olduğunu doğrular; değilse hata fırlatır. */
async function assertAdmin(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum bulunamadı.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) throw new Error("Bu işlem için yönetici yetkisi gerekir.");
  return user.id;
}

async function approveUser(formData: FormData) {
  "use server";
  await assertAdmin();
  const id = String(formData.get("id"));
  const admin = createSupabaseAdminClient();
  await admin
    .from("profiles")
    .update({ approved: true, is_active: true, rejected: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/hesap/onay");
}

async function rejectUser(formData: FormData) {
  "use server";
  await assertAdmin();
  const id = String(formData.get("id"));
  const admin = createSupabaseAdminClient();
  await admin
    .from("profiles")
    .update({ approved: false, rejected: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/hesap/onay");
}

export default async function OnayPage() {
  // Yetki kontrolü
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/hesap/giris");
  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!me?.is_admin) redirect("/hesap");

  // Onay bekleyenler — service role ile (RLS baypas)
  const admin = createSupabaseAdminClient();
  const { data: pending } = await admin
    .from("profiles")
    .select("id, email, first_name, last_name, created_at")
    .eq("approved", false)
    .eq("rejected", false)
    .order("created_at", { ascending: true });

  const rows = pending ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-emerald-950">Onay Bekleyen Kayıtlar</h1>
        <p className="text-sm text-zinc-600">
          Yeni kaydolan kullanıcıları onaylayın veya reddedin.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-2xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-600">
          Onay bekleyen kayıt yok.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {[p.first_name, p.last_name].filter(Boolean).join(" ") || "—"}
                </p>
                <p className="text-xs text-zinc-500">{p.email}</p>
              </div>
              <div className="flex gap-2">
                <form action={approveUser}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    Onayla
                  </button>
                </form>
                <form action={rejectUser}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-800 hover:bg-red-100"
                  >
                    Reddet
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link href="/hesap" className="block text-sm text-emerald-700 hover:underline">
        ← Hesabım
      </Link>
    </div>
  );
}
