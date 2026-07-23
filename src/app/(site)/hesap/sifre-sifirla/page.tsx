import { ResetPasswordForm } from "@/components/hesap/auth-forms";

export const metadata = { title: "Yeni Şifre Belirle — Sultan Okulları" };

export default function SifreSifirlaPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-emerald-950">Yeni Şifre Belirle</h1>
        <p className="text-sm text-zinc-600">Lütfen yeni şifrenizi girin.</p>
      </header>
      <ResetPasswordForm />
    </div>
  );
}
