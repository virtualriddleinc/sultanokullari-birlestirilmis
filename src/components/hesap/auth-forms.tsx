"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";
const labelClass = "block text-sm font-semibold text-zinc-800";
const buttonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-800 disabled:opacity-60";

function Alert({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={`rounded-2xl px-4 py-3 text-sm ${ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}
    >
      {children}
    </p>
  );
}

/** Kayıt Ol — e-posta onayı gerektirir (hCaptcha yok). */
export function RegisterForm() {
  const supabase = createSupabaseBrowserClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/hesap/dogrulama`,
      },
    });
    setLoading(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    setMsg({
      ok: true,
      text: "Kayıt başarılı! E-posta adresinize gönderilen bağlantıdan hesabınızı onaylayın. Ardından yönetici onayının ardından giriş yapabilirsiniz.",
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {msg ? <Alert ok={msg.ok}>{msg.text}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Ad
          <input
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Soyad
          <input
            className={inputClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
      </div>
      <label className={labelClass}>
        E-posta
        <input
          type="email"
          required
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className={labelClass}>
        Şifre
        <input
          type="password"
          required
          minLength={6}
          placeholder="En az 6 karakter"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Kaydediliyor…" : "Kayıt Ol"}
      </button>
      <p className="text-center text-sm text-zinc-600">
        Zaten hesabınız var mı?{" "}
        <Link href="/hesap/giris" className="font-semibold text-emerald-700 hover:underline">
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}

/** Giriş Yap (hCaptcha yok). */
export function LoginForm() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    router.push("/hesap/dogrulama");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {msg ? <Alert ok={msg.ok}>{msg.text}</Alert> : null}
      <label className={labelClass}>
        E-posta
        <input
          type="email"
          required
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className={labelClass}>
        Şifre
        <input
          type="password"
          required
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
      <div className="flex items-center justify-between text-sm">
        <Link href="/hesap/kayit" className="font-semibold text-emerald-700 hover:underline">
          Kayıt Ol
        </Link>
        <Link
          href="/hesap/sifremi-unuttum"
          className="text-zinc-600 hover:text-emerald-700 hover:underline"
        >
          Şifremi unuttum
        </Link>
      </div>
    </form>
  );
}

/** Şifremi unuttum — sıfırlama bağlantısı gönderir. */
export function ForgotPasswordForm() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/hesap/sifre-sifirla`,
    });
    setLoading(false);
    setMsg(
      error
        ? { ok: false, text: error.message }
        : {
            ok: true,
            text: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
          },
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {msg ? <Alert ok={msg.ok}>{msg.text}</Alert> : null}
      <label className={labelClass}>
        E-posta
        <input
          type="email"
          required
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
      </button>
      <p className="text-center text-sm text-zinc-600">
        <Link href="/hesap/giris" className="font-semibold text-emerald-700 hover:underline">
          Giriş sayfasına dön
        </Link>
      </p>
    </form>
  );
}

/** Yeni şifre belirleme (recovery oturumu callback'te kuruldu). */
export function ResetPasswordForm() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMsg({ ok: false, text: "Şifreler eşleşmiyor." });
      return;
    }
    if (password.length < 6) {
      setMsg({ ok: false, text: "Şifre en az 6 karakter olmalıdır." });
      return;
    }
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    setMsg({ ok: true, text: "Şifreniz güncellendi. Yönlendiriliyorsunuz…" });
    setTimeout(() => {
      router.push("/hesap/dogrulama");
      router.refresh();
    }, 1200);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {msg ? <Alert ok={msg.ok}>{msg.text}</Alert> : null}
      <label className={labelClass}>
        Yeni şifre
        <input
          type="password"
          required
          minLength={6}
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className={labelClass}>
        Yeni şifre (tekrar)
        <input
          type="password"
          required
          minLength={6}
          className={inputClass}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Güncelleniyor…" : "Şifreyi Güncelle"}
      </button>
    </form>
  );
}

/** Çıkış yap butonu. */
export function SignOutButton({
  className,
  children = "Çıkış yap",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/hesap/giris");
        router.refresh();
      }}
      className={
        className ??
        "inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-60"
      }
    >
      {loading ? "Çıkış yapılıyor…" : children}
    </button>
  );
}
