import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import profilCerceveFrame from "@/images/profil-cercevesi.webp";
import {
  type StaffMember,
  departmentLabels,
} from "@/content/idari-kadro";

/** profil-cercevesi.webp iç deliği — opak sınır analizi (861×863) */
const FRAME_INNER_INSET = "22%";

interface StaffCardProps {
  member: StaffMember;
  featured?: boolean;
}

export function StaffCard({ member, featured = false }: StaffCardProps) {
  const sizeClass = featured
    ? "size-72 sm:size-80 lg:size-96"
    : "size-64 sm:size-72 lg:size-80";

  return (
    <div
      className={cn(
        "group relative mx-auto aspect-square transition-transform duration-300 hover:-translate-y-1",
        sizeClass,
      )}
    >
      <div
        className={cn(
          "absolute flex flex-col items-center justify-center rounded-full bg-white text-center shadow-[inset_0_0_0_1px_rgba(26,28,24,0.06)]",
          featured ? "p-2 sm:p-3" : "p-1.5 sm:p-2",
        )}
        style={{ inset: FRAME_INNER_INSET }}
      >
        <div className="flex min-w-0 flex-col items-center gap-1">
          {member.academicTitle ? (
            <span
              className={cn(
                "text-charcoal/70 font-semibold tracking-[0.18em] uppercase",
                featured ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[10px]",
              )}
            >
              {member.academicTitle}
            </span>
          ) : null}

          <h3
            className={cn(
              "text-charcoal line-clamp-2 font-semibold tracking-tight",
              featured ? "text-base sm:text-lg" : "text-sm sm:text-base",
            )}
          >
            {member.name}
          </h3>

          <p
            className={cn(
              "text-charcoal/80 line-clamp-2 font-medium",
              featured ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs",
            )}
          >
            {member.title}
          </p>
        </div>

        {member.education ? (
          <div className="border-charcoal/15 mt-1.5 flex max-w-[90%] items-start justify-center gap-1 border-t pt-1.5 sm:mt-2 sm:gap-1.5 sm:pt-2">
            <GraduationCap
              className="text-charcoal/60 mt-0.5 size-3 shrink-0 sm:size-3.5"
              aria-hidden
            />
            <p
              className={cn(
                "text-charcoal/70 line-clamp-3 text-left leading-4",
                featured ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[10px]",
              )}
            >
              {member.education}
            </p>
          </div>
        ) : null}

        <span className="text-charcoal/60 mt-1.5 inline-flex max-w-[92%] items-center justify-center rounded-full bg-black/5 px-1.5 py-0.5 text-[7px] font-semibold tracking-wider uppercase sm:mt-2 sm:px-2 sm:text-[8px]">
          {departmentLabels[member.department]}
        </span>
      </div>

      <Image
        src={profilCerceveFrame}
        alt=""
        aria-hidden="true"
        fill
        sizes={
          featured
            ? "(max-width: 640px) 18rem, (max-width: 1024px) 20rem, 24rem"
            : "(max-width: 640px) 16rem, (max-width: 1024px) 18rem, 20rem"
        }
        unoptimized
        className="pointer-events-none object-contain drop-shadow-[0_18px_45px_rgba(0,0,0,0.14)] transition-[filter] duration-300 group-hover:drop-shadow-[0_26px_60px_rgba(0,0,0,0.2)]"
      />
    </div>
  );
}
