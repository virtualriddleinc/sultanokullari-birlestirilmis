"use client";

import { motion, useReducedMotion } from "framer-motion";
import beyazDesen from "@/images/beyaz-desen.svg";
import {
  MissionHoneycomb,
  type HoneycombCell,
} from "@/components/home/mission-honeycomb";
import {
  HeroInfoCard,
  HeroInfoCardShell,
} from "@/features/hero/hero-info-card";
import { hexGalleryMedia } from "@/content/site-media";
import { t, viewportInView } from "@/lib/animations";

const levels = ["Anaokulu", "İlkokul", "Ortaokul"] as const;
const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

/** Hero grid — yer değişimi: petek col-2 (sol), kart col-3 (sağ); hero hizaları korunur */
const MISSION_MEDIA_CELL =
  "hero-slide-media-col col-span-full h-full min-h-0 w-full min-w-0 max-md:order-2 md:col-start-2 md:col-end-3 md:row-start-1 md:order-none";
const MISSION_CARD_CELL =
  "col-span-full min-h-0 min-w-0 max-md:order-1 md:col-start-3 md:col-end-4 md:row-start-1 md:order-none";

function LevelContent({ label }: { label: string }) {
  return (
    <div className="text-center">
      <p className="font-cinzel text-xl font-bold tracking-tight sm:text-2xl">
        {label}
      </p>
    </div>
  );
}

export function MissionCounters() {
  const reduce = useReducedMotion();

  const honeycombCells: HoneycombCell[] = [
    {
      id: "decor-top-left",
      kind: "decor",
      position: { col: 0, row: 0.5 },
      tone: "surface",
      media: hexGalleryMedia[0],
    },
    {
      id: "level-anaokulu",
      kind: "stat",
      position: { col: 1, row: 0 },
      children: <LevelContent label={levels[0]} />,
    },
    {
      id: "decor-top-right",
      kind: "decor",
      position: { col: 2, row: 0.5 },
      tone: "primary",
      media: hexGalleryMedia[2],
    },
    {
      id: "level-ortaokul",
      kind: "stat",
      position: { col: 0, row: 1.5 },
      children: <LevelContent label={levels[2]} />,
    },
    {
      id: "level-ilkokul",
      kind: "stat",
      position: { col: 1, row: 1 },
      children: <LevelContent label={levels[1]} />,
    },
    {
      id: "decor-right",
      kind: "decor",
      position: { col: 2, row: 1.5 },
      tone: "emerald",
      media: hexGalleryMedia[3],
    },
    {
      id: "decor-bottom",
      kind: "decor",
      position: { col: 1, row: 2 },
      tone: "glass",
      media: hexGalleryMedia[5],
    },
  ];

  return (
    <section
      id="gayemiz"
      aria-label="Gâyemiz ve ufkumuz"
      className="mission-section-grid border-charcoal/10 relative z-[1] -mt-px w-full overflow-hidden border-b bg-brand-honey py-fluid-8 sm:py-fluid-16"
    >
      {/* Beyaz desen — hero yeşil bölümüyle aynı katman; bal köpüğü zemin üzerinde süreklilik */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beyazDesen.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none"
      />

      {/* ── Sol hücre: petek — hero bilgi kartı band hizası (col-2) ── */}
      <div className={`${MISSION_MEDIA_CELL} relative z-[1]`}>
        <div className="hero-slide-media-band">
          <MissionHoneycomb cells={honeycombCells} />
        </div>

        <div className="relative mx-auto mt-8 grid w-full max-w-md grid-cols-2 gap-x-2 gap-y-6 md:hidden">
          {levels.map((label, i) => (
            <motion.div
              key={label}
              className={
                i === 1
                  ? "col-span-2 flex justify-center"
                  : i === 0
                    ? "flex justify-end pt-6"
                    : "flex justify-start pt-6"
              }
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={viewportInView}
              transition={{ ...t(0.6), delay: i * 0.1 }}
            >
              <div
                className="bg-brand-honey text-charcoal relative grid w-44 place-items-center shadow-[0_20px_50px_rgb(0_0_0_/_0.12)]"
                style={{
                  aspectRatio: "2 / 1.7320508075688772",
                  clipPath: HEX_CLIP,
                }}
              >
                <LevelContent label={label} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Sağ hücre: bilgi kartı — hero altıgen/medya band hizası (col-3) ── */}
      <HeroInfoCardShell className={`${MISSION_CARD_CELL} relative z-[1]`}>
        <HeroInfoCard
          className="bg-brand-green"
          tagline="Gâyemiz · Ufkumuz"
          titleLines={[
            "Değer merkezli eğitim,",
            "güçlü bir gelecek vizyonu ile birleşiyor.",
          ]}
          description="Peygamber Efendimizin (s.a.v.) izinde, üsve-i hasene olmayı hedefleyen; ilim, hikmet ve ahlakla bütünleşmiş nesiller yetiştirmek için çalışıyoruz."
          secondaryDescription="Anaokulu, ilkokul ve ortaokul kademeleriyle bütüncül bir eğitim yolculuğu; okul öncesinden üniversiteye, cami ve hafızlık binasıyla bütünleşik eğitim külliyesi ufkumuz."
          preserveFooterSpace
        />
      </HeroInfoCardShell>
    </section>
  );
}
