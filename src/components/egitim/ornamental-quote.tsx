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
  /** Sayfa sütununu aşarak yatayda tam genişlik (kenar yastıklarıyla). */
  fullWidth?: boolean;
}) {
  return (
    <blockquote
      className={cn(
        "relative isolate overflow-hidden bg-[linear-gradient(135deg,#ecfdf5,#ffffff_55%,#dcfce7)] text-center shadow-[0_24px_80px_rgba(18,138,54,0.12)]",
        fullWidth
          ? "left-1/2 w-screen max-w-none -translate-x-1/2 rounded-none px-4 py-8 shadow-[0_20px_70px_rgba(18,138,54,0.14)] sm:px-8 sm:py-10"
          : "rounded-[1.75rem] px-6 py-7",
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
      <p className="mx-auto max-w-xl text-xl leading-relaxed font-semibold tracking-tight text-emerald-950 sm:text-2xl">
        <span>“{quote}”</span>
        {citation ? (
          <span className="font-medium text-emerald-900/90"> {citation}</span>
        ) : null}
      </p>
    </blockquote>
  );
}
