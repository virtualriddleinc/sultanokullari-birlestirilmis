import { ForgotPasswordForm } from "@/components/hesap/auth-forms";

export const metadata = { title: "Şifremi Unuttum — Sultan Okulları" };

export default function SifremiUnuttumPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-emerald-950">Şifremi Unuttum</h1>
        <p className="text-sm text-zinc-600">
          E-posta adresinizi girin, size bir şifre sıfırlama bağlantısı gönderelim.
        </p>
      </header>
      <ForgotPasswordForm />
    </div>
  );
}
