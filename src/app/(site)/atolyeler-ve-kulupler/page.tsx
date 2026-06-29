import type { Metadata } from "next";
import { AtolyeHoneycomb } from "@/components/atolyeler/atolye-honeycomb";

export const metadata: Metadata = {
  title: "Atölyeler ve kulüpler",
  description:
    "Sultan Okulları atölyeleri ve kulüpleri — bilim, sanat, sosyal ve spor kategorilerinde altıgen petek görünümünde envanter.",
};

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export default function Page() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Başlık alanı */}
      <header className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span
            className="inline-block w-3 bg-[var(--color-primary)]/70"
            style={{
              aspectRatio: "2 / 1.7320508075688772",
              clipPath: HEX_CLIP,
            }}
            aria-hidden
          />
          <p className="text-[0.65rem] font-semibold tracking-[0.36em] text-[var(--color-primary)] uppercase">
            Atölye · Kulüp
          </p>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-primary)] sm:text-4xl lg:text-5xl">
          Atölyeler ve Kulüpler
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
          Öğrencilerimizin ilgi ve yeteneklerini keşfetmelerine yönelik atölye
          ve kulüp envanterimiz. Kategoriye göre filtreleyebilir, bir altıgene
          tıklayarak ayrıntıları görebilirsiniz.
        </p>
      </header>

      {/* Petek alanı */}
      <div className="mt-12">
        <AtolyeHoneycomb />
      </div>
    </article>
  );
}
