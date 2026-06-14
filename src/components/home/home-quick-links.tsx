"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Palette,
  Phone,
  Radio,
  Sprout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { Marquee } from "@/components/ui/marquee";
import { springSnappy } from "@/lib/animations";

type QuickLink = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const links: QuickLink[] = [
  {
    href: "/egitim/kademeler",
    label: "Kademeler",
    description: "Sultan Mektep Modeli",
    icon: BookOpen,
  },
  {
    href: "/egitim/nebevi-egitim",
    label: "Nebevî Eğitim",
    description: "Kur'an-ı Kerîm",
    icon: GraduationCap,
  },
  {
    href: "/akademik/yabanci-dil",
    label: "Atölyeler",
    description: "Yabancı dil & atölye",
    icon: Palette,
  },
  {
    href: "/destek-hizmetleri",
    label: "Olanaklar",
    description: "Destek hizmetleri",
    icon: HandHeart,
  },
  {
    href: "/rehberlik/egitim-koclugu",
    label: "Rehberlik",
    description: "Eğitim koçluğu",
    icon: HeartHandshake,
  },
  {
    href: "/kurumsal/burs-olanaklari",
    label: "Burs",
    description: "Burs olanakları",
    icon: Sprout,
  },
  {
    href: "/guncel/haberler",
    label: "Duyurular",
    description: "Haber ve etkinlikler",
    icon: Radio,
  },
  {
    href: "/iletisim",
    label: "İletişim",
    description: "Bizimle iletişime geçin",
    icon: Phone,
  },
];

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

function Chip({ link }: { link: QuickLink }) {
  const reduce = useReducedMotion();
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className="group border-charcoal/10 bg-brand-honey hover:border-brand-green/40 relative flex h-16 items-center gap-3 rounded-full border pr-5 pl-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <motion.span
        className="bg-brand-green/25 text-charcoal grid h-12 w-14 place-items-center"
        style={{ aspectRatio: "2 / 1.7320508075688772", clipPath: HEX_CLIP }}
        whileHover={reduce ? undefined : { rotate: 6, scale: 1.05 }}
        transition={springSnappy}
      >
        <Icon className="size-5" aria-hidden />
      </motion.span>
      <div className="flex min-w-0 flex-col">
        <span className="text-charcoal group-hover:text-charcoal text-sm font-semibold">
          {link.label}
        </span>
        <span className="text-charcoal/55 text-[0.7rem] font-medium tracking-[0.18em] uppercase">
          {link.description}
        </span>
      </div>
    </Link>
  );
}

export function HomeQuickLinks() {
  return (
    <SectionGrid
      id="kisa-yollar"
      variant="honey"
      className="border-charcoal/10 border-t"
    >
      <SectionHeading
        eyebrow="Kısa yollar"
        title="Aradığınız sayfaya hızla ulaşın"
        description="Kademeler, olanaklar ve duyurular için en sık kullanılan bağlantılar — şeritte gezinin veya tıklayın."
      />
      <div className="mt-10">
        <Marquee
          speed={70}
          className="[mask-image:var(--marquee-mask)] [--marquee-mask:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:var(--marquee-mask)]"
        >
          {links.map((link) => (
            <Chip key={link.href} link={link} />
          ))}
        </Marquee>
      </div>
    </SectionGrid>
  );
}
