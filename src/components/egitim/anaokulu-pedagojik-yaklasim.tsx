import {
  BookOpen,
  HeartHandshake,
  Layers3,
  Puzzle,
  Sprout,
} from "lucide-react";
import { HexBadge } from "@/components/ui/hex-badge";

const icons = [BookOpen, Puzzle, Sprout, HeartHandshake, Layers3] as const;

export function AnaokuluPedagojikYaklasim({
  items,
}: {
  items: readonly { title: string; text: string }[];
}) {
  return (
    <section
      aria-label="Anaokulunda pedagojik yaklaşımımız"
      className="relative mt-fluid-12"
    >
      <div className="mx-auto mb-fluid-8 max-w-3xl text-center">
        <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.32em] text-[var(--color-primary)] uppercase">
          Pedagojik yaklaşımımız
        </p>
        <h2 className="mt-fluid-3 text-[length:var(--text-3xl)] font-semibold tracking-tight text-balance text-zinc-950 md:text-[length:var(--text-4xl)]">
          Anaokulunda pedagojik yaklaşımımız
        </h2>
        <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-600">
          Sultan&apos;ın anaokulu felsefesini taşıyan temel ilkeler ve
          yaklaşımlar.
        </p>
      </div>

      <ul className="grid gap-fluid-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li
              key={item.title}
              className="group relative overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white/85 p-fluid-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)] md:p-fluid-6"
            >
              <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-[var(--color-primary)]/8 blur-2xl transition group-hover:bg-[var(--color-primary)]/14" />
              <div className="relative flex items-start gap-fluid-4">
                <HexBadge size="md" className="bg-white">
                  <Icon className="size-5" aria-hidden />
                </HexBadge>
                <div className="min-w-0">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.22em] text-[var(--color-primary)]/85 uppercase">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-fluid-2 text-[length:var(--text-base)] font-semibold text-zinc-950">
                    {item.title}
                  </h3>
                  <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-6 text-zinc-600">
                    {item.text}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
