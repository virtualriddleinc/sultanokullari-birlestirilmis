import { cn } from "@/lib/cn";

export function OrnamentalQuote({
  quote,
  citation,
  className,
  fullWidth,
}: {
  quote: string;
  /** Tırnak dışında gösterilecek kaynak (örn. `(Buhari)`). */
  citation?: string;
  className?: string;
  /** İçerik sütununda kenardan kenara (Tip B; viewport breakout yok). */
  fullWidth?: boolean;
}) {
  return (
    <blockquote
      className={cn(
        "relative isolate overflow-hidden bg-[linear-gradient(135deg,#ecfdf5,#ffffff_55%,#dcfce7)] text-center shadow-[0_24px_80px_rgba(18,138,54,0.12)]",
        fullWidth
          ? "w-full rounded-none px-fluid-4 py-fluid-8 shadow-[0_20px_70px_rgba(18,138,54,0.14)] md:px-fluid-8 md:py-fluid-12"
          : "rounded-[1.75rem] px-fluid-6 py-fluid-6",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-[0.22] mix-blend-multiply"
        style={{
          backgroundImage: "url('/desen.svg')",
        }}
      />
      <p className="mx-auto max-w-xl text-[length:var(--text-xl)] leading-relaxed font-semibold tracking-tight text-emerald-950 md:text-[length:var(--text-2xl)]">
        <span>“{quote}”</span>
        {citation ? (
          <span className="font-medium text-emerald-900/90"> {citation}</span>
        ) : null}
      </p>
    </blockquote>
  );
}
