import { cn } from "@/lib/cn";

type SectionWaveDividerProps = {
  /** Dalga dolgu rengi — alt section arka planıyla eşleşmeli */
  fill?: string;
  className?: string;
};

const VIEW_W = 1440;
/** Dalga tepe (y=62) ve çukur (y=158) arası — viewBox yalnızca dalga derinliği */
const WAVE_Y_MIN = 62;
const WAVE_Y_MAX = 158;
const VIEW_H = WAVE_Y_MAX - WAVE_Y_MIN;

/**
 * 2 geniş dalga (720px periyot); x=0 ve x=1440 aynı faz — kenar kesilmez.
 * Y koordinatları viewBox üstüne (y=0 = en yüksek tepe) kaydırıldı; kapanış çukur hizasında.
 */
const WAVE_PATH = `M0,48 C240,96 480,0 720,48 C960,96 1200,0 1440,48 L1440,${VIEW_H} L0,${VIEW_H} Z`;

/** Sectionlar arası dalgalı renk geçişi — tam viewport genişliği, yükseklik = dalga derinliği */
export function SectionWaveDivider({
  fill = "var(--color-brand-honey)",
  className,
}: SectionWaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "section-wave-divider pointer-events-none relative block max-w-none leading-[0]",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="block aspect-[15/1] h-auto w-full"
      >
        <path fill={fill} d={WAVE_PATH} />
      </svg>
    </div>
  );
}
