import { Fragment, type ReactNode } from "react";
import { kurulusParagraflari } from "@/content/kurumsal";
import { ContentCard } from "@/components/layout/content-card";

type HikayeSatiri = {
  eyebrow: string;
  highlights: string[];
};

const hikayeSatirlari: HikayeSatiri[] = [
  {
    eyebrow: "Kuruluş · 2016–2017",
    highlights: [
      "fenni ve İslami ilimlerle",
      "nebevi eğitim modeliyle",
      "2016-2017",
    ],
  },
  {
    eyebrow: "Gayemiz",
    highlights: ["milli ve manevi değerlerle", "millet ve ümmet bilincine"],
  },
  {
    eyebrow: "Hedeflerimiz",
    highlights: ["Anadolu ve Fen lisesi", "Eğitim Külliyesi"],
  },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, phrases: string[]): ReactNode {
  if (phrases.length === 0) return text;

  const pattern = new RegExp(`(${phrases.map(escapeRegExp).join("|")})`, "g");
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    phrases.includes(part) ? (
      <mark
        key={i}
        className="bg-brand-green/20 text-charcoal rounded px-1 font-semibold"
      >
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function KurumsalKurulusHikayesi() {
  return (
    <div>
      <p className="section-eyebrow">Biz Kimiz?</p>
      <h2 className="font-cinzel text-charcoal mt-3 text-2xl font-bold text-balance sm:text-3xl">
        Köklerinden geleceğe yürüyen bir eğitim yolculuğu
      </h2>

      <ContentCard className="mt-8">
        <div className="divide-charcoal/10 divide-y">
          {kurulusParagraflari.map((paragraf, i) => {
            const satir = hikayeSatirlari[i];
            if (!satir) return null;

            return (
              <div
                key={satir.eyebrow}
                className="grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-8"
              >
                <p className="font-cinzel text-charcoal/70 text-xs font-bold tracking-[0.16em] uppercase sm:text-sm">
                  {satir.eyebrow}
                </p>
                <p className="text-charcoal/90 text-lg leading-relaxed sm:text-xl">
                  {highlightText(paragraf, satir.highlights)}
                </p>
              </div>
            );
          })}
        </div>
      </ContentCard>
    </div>
  );
}
