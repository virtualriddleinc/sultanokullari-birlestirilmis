import { LoginForm } from "@/components/hesap/auth-forms";

export const metadata = { title: "Giriş Yap — Sultan Okulları" };

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-emerald-950">Giriş Yap</h1>
        <p className="text-sm text-zinc-600">Hesabınıza giriş yapmak için bilgilerinizi girin.</p>
      </header>
      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>
      ) : null}
      <LoginForm />
    </div>
  );
}
