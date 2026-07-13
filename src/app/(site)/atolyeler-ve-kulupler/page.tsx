import type { Metadata } from "next";
import { AtolyeHoneycomb } from "@/components/atolyeler/atolye-honeycomb";
import { SectionGrid } from "@/components/layout/section-grid";
import { workshopIntro } from "@/content/workshops";

export const metadata: Metadata = {
  title: "Atölyeler ve Kulüpler",
  description: workshopIntro[0],
};

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export default function Page() {
  return (
    <SectionGrid as="article" variant="white">
      <header className="max-w-3xl">
        <div className="flex items-center gap-fluid-3">
          <span
            className="inline-block w-3 bg-[var(--color-primary)]/70"
            style={{
              aspectRatio: "2 / 1.7320508075688772",
              clipPath: HEX_CLIP,
            }}
            aria-hidden
          />
          <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.36em] text-[var(--color-primary)] uppercase">
            Atölyeler ve Kulüpler
          </p>
        </div>

        <h1 className="mt-fluid-4 text-[length:var(--text-3xl)] font-semibold tracking-tight text-[var(--color-primary)] md:text-[length:var(--text-4xl)]">
          Atölyeler ve Kulüpler
        </h1>
        <div className="mt-fluid-4 max-w-2xl space-y-4 text-[length:var(--text-base)] leading-7 text-zinc-600 md:text-[length:var(--text-lg)]">
          {workshopIntro.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      </header>

      <div className="mt-fluid-12">
        <AtolyeHoneycomb />
      </div>
    </SectionGrid>
  );
}
