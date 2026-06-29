import type { Metadata } from "next";
import { olcmeGiris, rehberlikGiris } from "@/content/rehberlik";
import { RehberlikOlcmePanels } from "@/components/rehberlik/rehberlik-olcme-panels";
import { RehberlikPanels } from "@/components/rehberlik/rehberlik-panels";

export const metadata: Metadata = {
  title: "Rehberlik",
  description:
    "Sultan Okulları — ölçme ve değerlendirme yöntemleri ile rehberlik ve psikolojik danışma hizmetleri.",
};

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

function SectionDivider({
  num,
  eyebrow,
  title,
  body,
  light = false,
}: {
  num: string;
  eyebrow: string;
  title: string;
  body: string;
  light?: boolean;
}) {
  return (
    <section
      className={
        light
          ? "relative overflow-hidden border-b border-zinc-100 bg-white px-4 pt-14 pb-12 sm:px-6 lg:pt-20 lg:pb-16"
          : "relative overflow-hidden bg-[var(--color-primary)] px-4 pt-14 pb-12 sm:px-6 lg:pt-20 lg:pb-16"
      }
    >
      {!light && (
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.07] mix-blend-screen"
          aria-hidden
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.12),transparent_32rem)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block w-2.5 ${light ? "bg-[var(--color-primary)]/60" : "bg-white/70"}`}
            style={{
              aspectRatio: "2 / 1.7320508075688772",
              clipPath: HEX_CLIP,
            }}
            aria-hidden
          />
          <p
            className={`text-[0.65rem] font-semibold tracking-[0.36em] uppercase ${
              light ? "text-[var(--color-primary)]" : "text-emerald-200/90"
            }`}
          >
            {eyebrow}
          </p>
        </div>

        <div className="mt-2 flex items-baseline gap-4">
          <span
            className={`text-[0.7rem] font-black tabular-nums select-none ${
              light ? "text-zinc-300" : "text-white/20"
            }`}
            aria-hidden
          >
            {num}
          </span>
          <h2
            className={`text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl ${
              light ? "text-zinc-900" : "text-white"
            }`}
          >
            {title}
          </h2>
        </div>

        <p
          className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8 ${
            light ? "text-zinc-600" : "text-emerald-100/85"
          }`}
        >
          {body}
        </p>

        {!light && (
          <div className="mt-8 flex items-center gap-3" aria-hidden>
            <div className="h-px w-10 bg-white/30" />
            <span className="text-xs font-semibold tracking-[0.30em] text-white/45 uppercase">
              Aşağı kaydırın
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        )}
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <article>
      {/* ──────────────────────────────────────────────────────────
          ANA BAŞLIK 1: ÖLÇME VE DEĞERLENDİRME
          ────────────────────────────────────────────────────────── */}
      <SectionDivider
        num="01"
        eyebrow="Sultan Okulları"
        title="Ölçme ve Değerlendirme"
        body={olcmeGiris}
      />

      <RehberlikOlcmePanels />

      {/* ──────────────────────────────────────────────────────────
          ANA BAŞLIK 2: REHBERLİK VE PSİKOLOJİK DANIŞMA
          ────────────────────────────────────────────────────────── */}
      <SectionDivider
        num="02"
        eyebrow="Sultan Okulları"
        title="Rehberlik ve Psikolojik Danışma"
        body={rehberlikGiris}
        light
      />

      <RehberlikPanels />
    </article>
  );
}
