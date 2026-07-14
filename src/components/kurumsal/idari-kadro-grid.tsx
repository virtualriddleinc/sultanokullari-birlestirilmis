"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { StaffMember } from "@/content/idari-kadro";
import {
  idariKadro,
  branchOptions,
  type BranchSlug,
} from "@/content/idari-kadro";
import { StaffCard } from "@/components/kurumsal/staff-card";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { cn } from "@/lib/cn";

function SectionTitle({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-fluid-2">
      {eyebrow ? (
        <span className="text-charcoal/70 text-[length:var(--text-xs)] font-semibold tracking-[0.22em] uppercase">
          {eyebrow}
        </span>
      ) : null}
      <Heading
        id={id}
        className="text-charcoal text-[length:var(--text-2xl)] font-semibold tracking-tight md:text-[length:var(--text-3xl)]"
      >
        {title}
      </Heading>
      {description ? (
        <p className="text-charcoal/75 max-w-2xl text-[length:var(--text-sm)] leading-6">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function StaffGrid({
  members,
  featured = false,
  singleRow = false,
}: {
  members: StaffMember[];
  featured?: boolean;
  singleRow?: boolean;
}) {
  if (members.length === 0) {
    return (
      <p className="text-charcoal/70 py-8 text-center text-sm">
        Bu bölümde henüz kayıt bulunmamaktadır.
      </p>
    );
  }

  return (
    <StaggerList
      as="ul"
      className={
        singleRow
          ? "grid grid-cols-1 place-items-center gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12 xl:gap-x-8"
          : "grid grid-cols-1 place-items-center gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:gap-x-6 lg:gap-y-12 xl:grid-cols-3 xl:gap-x-8"
      }
    >
      {members.map((member) => (
        <StaggerItem
          key={member.id}
          className="list-none w-full min-w-0 max-w-[min(100%,24rem)]"
        >
          <StaffCard member={member} featured={featured} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}

function BranchTitleSelector({
  value,
  onChange,
}: {
  value: BranchSlug;
  onChange: (slug: BranchSlug) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = branchOptions.find((b) => b.slug === value);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <h2
        id="sube-baslik"
        className="text-charcoal flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--text-2xl)] font-semibold tracking-tight md:text-[length:var(--text-3xl)]"
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Şube seç: ${current ? `${current.name} – ${current.city}` : "Şube"}`}
          onClick={() => setOpen((prev) => !prev)}
          className="bg-brand-honey text-charcoal hover:ring-charcoal/20 inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition hover:ring-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        >
          <span>
            {current ? `${current.name} – ${current.city}` : "Şube"}
          </span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        <span>Şube Kadromuz</span>
      </h2>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label="Şube seçimi"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="border-charcoal/10 absolute top-[calc(100%+0.5rem)] left-0 z-30 min-w-[14rem] overflow-hidden rounded-2xl border bg-[var(--color-brand-honey)] py-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
          >
            {branchOptions.map((opt) => {
              const active = value === opt.slug;
              return (
                <li key={opt.slug} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(opt.slug);
                      setOpen(false);
                    }}
                    className={cn(
                      "text-charcoal flex min-h-[44px] w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left text-[length:var(--text-sm)] transition",
                      active
                        ? "bg-black/8 font-semibold"
                        : "hover:bg-black/5",
                    )}
                  >
                    <span>
                      {opt.name} – {opt.city}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function BranchSectionHeader({
  value,
  onChange,
}: {
  value: BranchSlug;
  onChange: (slug: BranchSlug) => void;
}) {
  return (
    <div className="flex flex-col gap-fluid-2">
      <span className="text-charcoal/70 text-[length:var(--text-xs)] font-semibold tracking-[0.22em] uppercase">
        Şube Kadroları
      </span>
      <BranchTitleSelector value={value} onChange={onChange} />
      <p className="text-charcoal/75 max-w-2xl text-[length:var(--text-sm)] leading-6">
        Her şube kendi idari ve eğitim kadrosuyla hizmet verir. Başlıktaki şube
        adına tıklayarak görüntülemek istediğiniz okulu seçin.
      </p>
    </div>
  );
}

export function IdariKadroGrid({ members = idariKadro }: { members?: StaffMember[] }) {
  const [branch, setBranch] = useState<BranchSlug>("sancaktepe");

  const yonetim = useMemo(
    () => members.filter((m) => m.department === "yonetim"),
    [members],
  );

  const egitimDanisma = useMemo(
    () => members.filter((m) => m.department === "egitim_danisma"),
    [members],
  );

  const branchStaff = useMemo(
    () => members.filter((m) => m.branchSlug === branch),
    [members, branch],
  );

  const branchIdari = branchStaff.filter((m) => m.department === "idari");
  const branchEgitim = branchStaff.filter((m) => m.department === "egitim");

  return (
    <div className="space-y-20">
      {/* Yönetim Kadrosu */}
      <section aria-labelledby="yonetim-baslik" className="space-y-8">
        <SectionTitle
          as="h1"
          id="yonetim-baslik"
          title="Yönetim Kadrosu"
          description="Sultan Okulları'nın stratejik yönlendirmesini yapan merkez yönetim ekibi."
        />
        <StaffGrid members={yonetim} featured singleRow />
      </section>

      {/* Eğitim Danışma Kurulu */}
      <section aria-labelledby="danisma-baslik" className="space-y-8">
        <SectionTitle
          id="danisma-baslik"
          eyebrow="Merkez"
          title="Eğitim Danışma Kurulumuz"
          description="Kurumun eğitim politikalarına akademik ve mesleki danışmanlık sağlayan uzman kadro."
        />
        <StaffGrid members={egitimDanisma} featured />
      </section>

      {/* Şube Kadroları */}
      <section aria-labelledby="sube-baslik" className="space-y-10">
        <BranchSectionHeader value={branch} onChange={setBranch} />

        <AnimatePresence mode="wait">
          <motion.div
            key={branch}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-12"
          >
            {branchIdari.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-charcoal/70 text-sm font-semibold tracking-[0.18em] uppercase">
                  İdari Kadro
                </h3>
                <StaffGrid members={branchIdari} />
              </div>
            ) : null}

            {branchEgitim.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-charcoal/70 text-sm font-semibold tracking-[0.18em] uppercase">
                  Eğitim Kadrosu
                </h3>
                <StaffGrid members={branchEgitim} />
              </div>
            ) : null}

            {branchStaff.length === 0 ? (
              <p className="text-charcoal/70 py-8 text-center text-sm">
                Bu şube için henüz kadro bilgisi eklenmemiştir.
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
