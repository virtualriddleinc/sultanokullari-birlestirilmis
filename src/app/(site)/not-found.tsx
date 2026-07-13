export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-start justify-center gap-4 px-6 py-24">
      <p className="text-sm tracking-wide text-muted-foreground uppercase">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        Bu sayfa bulunamadı
      </h1>
      <p className="text-muted-foreground">
        İstediğiniz adres mevcut değil veya yayından kaldırılmış olabilir.
      </p>
      <a href="/" className="text-primary underline underline-offset-4">
        Ana sayfaya dön
      </a>
    </main>
  );
}
