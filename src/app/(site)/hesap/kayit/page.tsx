import { RegisterForm } from "@/components/hesap/auth-forms";

export const metadata = { title: "Kayıt Ol — Sultan Okulları" };

export default function KayitPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-emerald-950">Kayıt Ol</h1>
        <p className="text-sm text-zinc-600">
          Yeni hesap oluşturun. E-posta onayından ve yönetici onayından sonra giriş yapabilirsiniz.
        </p>
      </header>
      <RegisterForm />
    </div>
  );
}
