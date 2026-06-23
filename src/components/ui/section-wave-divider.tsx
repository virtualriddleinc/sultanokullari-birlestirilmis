import { cn } from "@/lib/cn";

type SectionWaveDividerProps = {
  /** Dalga dolgu rengi — alt section arka planıyla eşleşmeli */
  fill?: string;
  className?: string;
};

const VIEW_W = 1440;
const VIEW_H = 240;

/**
 * 2 geniş dalga (720px periyot); x=0 ve x=1440 aynı y — kenar kesilmez.
 * Genlik ~±48 (110 merkez); dikey alan VIEW_H ile geçiş derinliği artırılır.
 */
const WAVE_PATH = `M0,110 C240,158 480,62 720,110 C960,158 1200,62 1440,110 L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`;

/** Sectionlar arası dalgalı renk geçişi — grid padding’ini aşarak tam kenar genişliği */
export function SectionWaveDivider({
  fill = "var(--color-brand-honey)",
  className,
}: SectionWaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "section-wave-divider pointer-events-none relative -ml-[var(--layout-margin)] w-[calc(100%+2*var(--layout-margin))] max-w-none leading-[0]",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="block h-[clamp(5rem,13vw,9rem)] w-full"
      >
        <path fill={fill} d={WAVE_PATH} />
      </svg>
    </div>
  );
}
