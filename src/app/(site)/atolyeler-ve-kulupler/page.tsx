import { buildPageMetadata } from "@/lib/seo/metadata";
import { AtolyeHoneycomb } from "@/components/atolyeler/atolye-honeycomb";
import { SectionGrid } from "@/components/layout/section-grid";

export const metadata = buildPageMetadata({
  path: "/atolyeler-ve-kulupler",
  title: "Atölyeler ve kulüpler",
  description:
    "Sultan Okulları atölyeleri ve kulüpleri — bilim, sanat, sosyal ve spor kategorilerinde altıgen petek görünümünde envanter.",
});

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
            Atölye · Kulüp
          </p>
        </div>

        <h1 className="mt-fluid-4 text-[length:var(--text-3xl)] font-semibold tracking-tight text-[var(--color-primary)] md:text-[length:var(--text-4xl)]">
          Atölyeler ve Kulüpler
        </h1>
        <p className="mt-fluid-4 max-w-2xl text-[length:var(--text-base)] leading-7 text-zinc-600 md:text-[length:var(--text-lg)]">
          Öğrencilerimizin ilgi ve yeteneklerini keşfetmelerine yönelik atölye
          ve kulüp envanterimiz. Kategoriye göre filtreleyebilir, bir altıgene
          tıklayarak ayrıntıları görebilirsiniz.
        </p>
      </header>

      <div className="mt-fluid-12">
        <AtolyeHoneycomb />
      </div>
    </SectionGrid>
  );
}
