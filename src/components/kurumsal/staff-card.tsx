import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  type StaffMember,
  departmentLabels,
  type Department,
} from "@/content/idari-kadro";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

const departmentStyles: Record<
  Department,
  { badge: string; ring: string; glow: string }
> = {
  yonetim: {
    badge: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
    ring: "ring-[var(--color-primary)]/40",
    glow: "from-[var(--color-primary)]/12 to-[var(--color-secondary)]/12",
  },
  egitim: {
    badge: "bg-amber-50 text-amber-700",
    ring: "ring-amber-500/40",
    glow: "from-amber-300/15 to-amber-500/10",
  },
  idari: {
    badge: "bg-zinc-100 text-zinc-700",
    ring: "ring-zinc-400/40",
    glow: "from-zinc-300/15 to-zinc-500/10",
  },
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface StaffCardProps {
  member: StaffMember;
  featured?: boolean;
}

export function StaffCard({ member, featured = false }: StaffCardProps) {
  const abbr = initials(member.name);
  const styles = departmentStyles[member.department];

  // Boyutlandırma — featured (yönetim) daha büyük
  const cardSize = featured
    ? "w-[18rem] sm:w-[20rem] md:w-[22rem]"
    : "w-[16rem] sm:w-[18rem] md:w-[20rem]";
  const photoSize = featured
    ? "h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36"
    : "h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32";
  const photoPx = featured ? 144 : 128;

  return (
    <div
      className={cn("group relative mx-auto", cardSize)}
      style={{ aspectRatio: "2 / 1.7320508075688772" }}
    >
      {/* Dış glow halkası */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-[6%] bg-gradient-to-br opacity-40 blur-xl transition-opacity duration-500 group-hover:opacity-70",
          styles.glow,
        )}
        style={{ clipPath: HEX_CLIP }}
        aria-hidden
      />

      {/* Altıgen kart arka planı — desenli */}
      <div
        className="absolute inset-0 overflow-hidden bg-gradient-to-br from-white via-white/95 to-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_32px_90px_rgba(18,138,54,0.22)]"
        style={{ clipPath: HEX_CLIP }}
      >
        {/* Desen overlay */}
        <div
          className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.05] mix-blend-multiply"
          aria-hidden
        />
        {/* Üst gradient — okunabilirliği artırır */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[var(--color-primary-light)]/40 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      {/* Altıgen kenarlık */}
      <div
        className="pointer-events-none absolute inset-0 border-2 border-[var(--color-primary)]/25 transition-colors duration-300 group-hover:border-[var(--color-primary)]/55"
        style={{ clipPath: HEX_CLIP }}
        aria-hidden
      />

      {/* İçerik */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 py-4 text-center">
        {/* Profil fotoğrafı — yuvarlak */}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-full shadow-[0_8px_24px_rgba(15,23,42,0.18)] ring-4 ring-white transition-transform duration-300 group-hover:scale-105",
            photoSize,
          )}
        >
          {/* Renk halkası (departman bazlı) */}
          <div
            className={cn(
              "absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-white",
              styles.ring,
            )}
            aria-hidden
          />
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              sizes={`${photoPx}px`}
              className="object-cover"
            />
          ) : (
            <span
              className={cn(
                "flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] font-semibold text-white",
                featured ? "text-2xl" : "text-xl",
              )}
            >
              {abbr}
            </span>
          )}
        </div>

        {/* Metin */}
        <div className="flex min-w-0 flex-col items-center gap-1">
          <h3
            className={cn(
              "truncate font-semibold tracking-tight text-zinc-900",
              featured
                ? "max-w-[14rem] text-base sm:text-lg"
                : "max-w-[12rem] text-sm sm:text-base",
            )}
            title={member.name}
          >
            {member.name}
          </h3>
          <p
            className={cn(
              "max-w-[12rem] truncate text-zinc-600",
              featured ? "text-sm" : "text-xs sm:text-sm",
            )}
            title={member.title}
          >
            {member.title}
          </p>
          <span
            className={cn(
              "mt-0.5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
              styles.badge,
            )}
          >
            {departmentLabels[member.department]}
          </span>
        </div>
      </div>
    </div>
  );
}
