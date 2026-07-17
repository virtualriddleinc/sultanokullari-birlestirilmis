export const dynamic = "force-dynamic";

export default function HesapLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-16 sm:py-20">
      <div className="rounded-3xl border border-emerald-950/10 bg-white/95 p-6 shadow-[0_28px_90px_rgba(6,78,59,0.12)] backdrop-blur sm:p-8">
        {children}
      </div>
    </main>
  );
}
