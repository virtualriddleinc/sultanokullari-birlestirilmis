"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ContentCard } from "@/components/layout/content-card";
import { SectionGrid } from "@/components/layout/section-grid";
import {
  MissionHoneycomb,
  type HoneycombCell,
} from "@/components/home/mission-honeycomb";
import { hexGalleryMedia } from "@/content/site-media";
import {
  sectionCardVariants,
  staggerSectionVariants,
  t,
  viewportInView,
} from "@/lib/animations";

const levels = ["Anaokulu", "İlkokul", "Ortaokul"] as const;
const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

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
    <SectionGrid
      id="gayemiz"
      variant="accent"
      className="border-brand-green/30 border-y"
      innerClassName="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportInView}
        variants={staggerSectionVariants}
      >
        <motion.div variants={sectionCardVariants}>
          <ContentCard>
            <p className="section-eyebrow">Gâyemiz · Ufkumuz</p>
            <h2 className="section-title mt-5">
              Değer merkezli eğitim, güçlü bir gelecek vizyonu ile birleşiyor.
            </h2>
            <p className="section-body mt-6 max-w-xl">
              Peygamber Efendimizin (s.a.v.) izinde, üsve-i hasene olmayı
              hedefleyen; ilim, hikmet ve ahlakla bütünleşmiş nesiller
              yetiştirmek için çalışıyoruz.
            </p>
            <p className="section-body text-charcoal/65 mt-3 max-w-xl">
              Anaokulu, ilkokul ve ortaokul kademeleriyle bütüncül bir eğitim
              yolculuğu; okul öncesinden üniversiteye, cami ve hafızlık
              binasıyla bütünleşik eğitim külliyesi ufkumuz.
            </p>
          </ContentCard>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto w-full max-w-xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportInView}
        variants={sectionCardVariants}
      >
        <MissionHoneycomb cells={honeycombCells} />

        <div className="relative mx-auto mt-8 grid w-full max-w-md grid-cols-2 gap-x-2 gap-y-6 sm:hidden">
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
      </motion.div>
    </SectionGrid>
  );
}
