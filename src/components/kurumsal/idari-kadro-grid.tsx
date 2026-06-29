"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { StaffMember } from "@/content/idari-kadro";
import {
  idariKadro,
  branchOptions,
  type BranchSlug,
} from "@/content/idari-kadro";
import { StaffCard } from "@/components/kurumsal/staff-card";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
        {eyebrow}
      </span>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function StaffGrid({
  members,
  featured = false,
}: {
  members: StaffMember[];
  featured?: boolean;
}) {
  if (members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        Bu bölümde henüz kayıt bulunmamaktadır.
      </p>
    );
  }

  return (
    <StaggerList
      as="ul"
      className="grid grid-cols-1 place-items-center gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12"
    >
      {members.map((member) => (
        <StaggerItem key={member.id} className="list-none">
          <StaffCard member={member} featured={featured} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}

function BranchPicker({
  value,
  onChange,
}: {
  value: BranchSlug;
  onChange: (slug: BranchSlug) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Şube seçimi"
      className="flex flex-wrap gap-2"
    >
      {branchOptions.map((opt) => {
        const active = value === opt.slug;
        return (
          <button
            key={opt.slug}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.slug)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "text-white"
                : "text-zinc-700 hover:text-[var(--color-primary)]"
            }`}
          >
            {active && !reduce ? (
              <motion.span
                layoutId="branch-picker-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary-strong)] shadow-[0_10px_30px_rgba(18,138,54,0.25)]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            ) : null}
            {active && reduce ? (
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary-strong)]" />
            ) : null}
            {!active ? (
              <span className="absolute inset-0 rounded-full border border-zinc-200 bg-white/60 backdrop-blur-sm" />
            ) : null}
            <span className="relative flex items-baseline gap-1.5">
              <span>{opt.name}</span>
              <span
                className={`text-[10px] font-normal ${
                  active ? "text-white/80" : "text-zinc-400"
                }`}
              >
                {opt.city}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function IdariKadroGrid({ members = idariKadro }: { members?: StaffMember[] }) {
  const [branch, setBranch] = useState<BranchSlug>("sancaktepe");

  const yonetim = useMemo(
    () => members.filter((m) => m.department === "yonetim"),
    [members],
  );

  const branchStaff = useMemo(
    () => members.filter((m) => m.branchSlug === branch),
    [members, branch],
  );

  const branchEgitim = branchStaff.filter((m) => m.department === "egitim");
  const branchIdari = branchStaff.filter((m) => m.department === "idari");

  const currentBranch = branchOptions.find((b) => b.slug === branch);

  return (
    <div className="space-y-20">
      {/* Yönetim Kadrosu */}
      <section aria-labelledby="yonetim-baslik" className="space-y-8">
        <SectionTitle
          eyebrow="Merkez"
          title="Yönetim Kadrosu"
          description="Sultan Okulları'nın stratejik yönlendirmesini yapan merkez yönetim ekibi."
        />
        <StaffGrid members={yonetim} featured />
      </section>

      {/* Şube Kadroları */}
      <section aria-labelledby="sube-baslik" className="space-y-10">
        <div className="space-y-5">
          <SectionTitle
            eyebrow="Şube Kadroları"
            title="Okulumuzu seçin"
            description="Her şube kendi eğitim ve idari kadrosuyla hizmet verir. Görüntülemek istediğiniz okulu seçin."
          />
          <BranchPicker value={branch} onChange={setBranch} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={branch}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-12"
          >
            {currentBranch ? (
              <p className="text-sm text-zinc-500">
                <span className="font-semibold text-[var(--color-primary)]">
                  {currentBranch.name}
                </span>{" "}
                kampüsü · {currentBranch.city}
              </p>
            ) : null}

            {branchEgitim.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                  Eğitim Kadrosu
                </h3>
                <StaffGrid members={branchEgitim} />
              </div>
            ) : null}

            {branchIdari.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                  İdari Kadro
                </h3>
                <StaffGrid members={branchIdari} />
              </div>
            ) : null}

            {branchStaff.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                Bu şube için henüz kadro bilgisi eklenmemiştir.
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
