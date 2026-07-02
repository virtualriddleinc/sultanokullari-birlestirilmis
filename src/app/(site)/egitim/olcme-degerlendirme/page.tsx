import type { Metadata } from "next";
import {
  hazirbulunusluk,
  olcmeGiris,
  pisaBolumu,
  portfolyo,
  rubric,
} from "@/content/olcme";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { AccordionItem, AccordionRoot } from "@/components/ui/accordion-radix";

export const metadata: Metadata = {
  title: "Ölçme ve değerlendirme",
  description: "PISA, hazırbulunuşluk, rubrik ve portfolyo yaklaşımı.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="olcme-degerlendirme"
      title="Ölçme ve değerlendirme"
      intro="Akademik ve Mânevî gelişimi destekleyen çok boyutlu değerlendirme anlayışı."
    >
      <p className="mt-2 text-zinc-700">{olcmeGiris}</p>

      <h2 className="mt-10 text-lg font-semibold text-[var(--color-primary)]">
        {pisaBolumu.title}
      </h2>
      <div className="mt-4 space-y-3">
        {pisaBolumu.paragraflar.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-zinc-700">
            {p}
          </p>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-[var(--color-primary)]">
        Hazırbulunuşluk
      </h2>
      <p className="mt-3 text-sm text-zinc-700">{hazirbulunusluk}</p>

      <h2 className="mt-10 text-lg font-semibold text-[var(--color-primary)]">
        Rubrik ve portfolyo
      </h2>
      <div className="mt-4">
        <AccordionRoot type="single" collapsible>
          <AccordionItem value="r1" title="Rubrik tanımı">
            {rubric.tanim}
          </AccordionItem>
          <AccordionItem value="r2" title="Holistik puanlama">
            {rubric.holistik}
          </AccordionItem>
          <AccordionItem value="r3" title="Analitik puanlama">
            {rubric.analitik}
          </AccordionItem>
          <AccordionItem value="r4" title="Öğrenci ürün dosyası (portfolyo)">
            {portfolyo}
          </AccordionItem>
        </AccordionRoot>
      </div>
    </EgitimSegmentShell>
  );
}
