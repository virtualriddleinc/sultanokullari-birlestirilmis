import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import profilCerceveFrame from "@/images/profil-cercevesi.webp";
import {
  type StaffMember,
  departmentLabels,
} from "@/content/idari-kadro";

/**
 * profil-cercevesi.webp iç deliği — alpha sınırı ~%20.2.
 * Beyaz daire çerçeve altına hafifçe taşsın diye biraz daha küçük inset;
 * yeşil arka plan sızmasın.
 */
const FRAME_INNER_INSET = "19.5%";

interface StaffCardProps {
  member: StaffMember;
  featured?: boolean;
}

export function StaffCard({ member, featured = false }: StaffCardProps) {
  return (
    <div
      className={cn(
        "@container group relative mx-auto aspect-square w-full min-w-0 transition-transform duration-300 hover:-translate-y-1",
        featured ? "max-w-96" : "max-w-80",
      )}
    >
      <div
        className={cn(
          "absolute flex flex-col items-center justify-center overflow-hidden rounded-full bg-white text-center shadow-[inset_0_0_0_1px_rgba(26,28,24,0.06)]",
          featured ? "p-[3.2cqw]" : "p-[2.6cqw]",
        )}
        style={{ inset: FRAME_INNER_INSET }}
      >
        <div className="flex min-w-0 max-w-[92%] flex-col items-center gap-[1.1cqw]">
          {member.academicTitle ? (
            <span
              className={cn(
                "text-charcoal/70 font-semibold tracking-[0.18em] uppercase",
                featured
                  ? "text-[length:min(0.75rem,2.7cqw)]"
                  : "text-[length:min(0.625rem,2.85cqw)]",
              )}
            >
              {member.academicTitle}
            </span>
          ) : null}

          <h3
            className={cn(
              "text-charcoal line-clamp-2 font-semibold tracking-tight leading-[1.2]",
              featured
                ? "text-[length:min(1.125rem,4.8cqw)]"
                : "text-[length:min(1rem,4.4cqw)]",
            )}
          >
            {member.name}
          </h3>

          <p
            className={cn(
              "text-charcoal/80 line-clamp-2 font-medium leading-[1.25]",
              featured
                ? "text-[length:min(0.875rem,3.2cqw)]"
                : "text-[length:min(0.75rem,3.4cqw)]",
            )}
          >
            {member.title}
          </p>
        </div>

        {member.education ? (
          <div className="border-charcoal/15 mt-[1.6cqw] flex max-w-[88%] items-start justify-center gap-[1.1cqw] border-t pt-[1.6cqw]">
            <GraduationCap
              className="text-charcoal/60 mt-[0.15em] size-[min(0.875rem,3.2cqw)] shrink-0"
              aria-hidden
            />
            <p
              className={cn(
                "text-charcoal/70 line-clamp-3 text-left leading-[1.3]",
                featured
                  ? "text-[length:min(0.75rem,2.55cqw)]"
                  : "text-[length:min(0.625rem,2.65cqw)]",
              )}
            >
              {member.education}
            </p>
          </div>
        ) : null}

        <span
          className={cn(
            "text-charcoal/60 mt-[1.5cqw] inline-flex max-w-[90%] items-center justify-center rounded-full bg-black/5 px-[1.6cqw] py-[0.5cqw] font-semibold tracking-wider uppercase",
            featured
              ? "text-[length:min(0.5rem,2.1cqw)]"
              : "text-[length:min(0.5rem,2.15cqw)]",
          )}
        >
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
        className="pointer-events-none object-cover drop-shadow-[0_18px_45px_rgba(0,0,0,0.14)] transition-[filter] duration-300 group-hover:drop-shadow-[0_26px_60px_rgba(0,0,0,0.2)]"
      />
    </div>
  );
}
