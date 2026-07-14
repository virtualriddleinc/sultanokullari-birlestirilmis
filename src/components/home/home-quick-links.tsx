"use client";

import Link from "@/components/navigation/site-link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionGrid } from "@/components/layout/section-grid";
import { Marquee } from "@/components/ui/marquee";
import { springSnappy } from "@/lib/animations";
import { resolveQuickLinkIcon, type QuickLinkItem } from "@/lib/home-shared";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

const DEFAULT_LINKS: QuickLinkItem[] = [
  { href: "/egitim/kademeler", label: "Kademeler", description: "", iconKey: "book-open" },
  { href: "/egitim/nebevi-egitim", label: "Nebevî Eğitim", description: "", iconKey: "graduation-cap" },
  { href: "/akademik/yabanci-dil", label: "Atölyeler", description: "", iconKey: "palette" },
  { href: "/yasam/sultanda-yasam", label: "Yemekhane", description: "", iconKey: "hand-heart" },
  { href: "/rehberlik/egitim-koclugu", label: "Rehberlik", description: "", iconKey: "heart-handshake" },
  { href: "/kurumsal/burs-olanaklari", label: "Burs", description: "", iconKey: "sprout" },
  { href: "/guncel/haberler", label: "Duyurular", description: "", iconKey: "radio" },
  { href: "/iletisim", label: "İletişim", description: "", iconKey: "phone" },
];

function Chip({ link }: { link: QuickLinkItem }) {
  const reduce = useReducedMotion();
  const Icon = resolveQuickLinkIcon(link.iconKey);
  return (
    <Link
      href={link.href}
      className="group border-charcoal/10 bg-brand-honey hover:border-brand-green/40 relative flex h-16 items-center gap-fluid-3 rounded-full border pr-5 pl-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <motion.span
        className="bg-brand-green/25 text-charcoal grid h-12 w-14 place-items-center"
        style={{ aspectRatio: "2 / 1.7320508075688772", clipPath: HEX_CLIP }}
        whileHover={reduce ? undefined : { rotate: 6, scale: 1.05 }}
        transition={springSnappy}
      >
        <Icon className="size-5" aria-hidden />
      </motion.span>
      <span className="text-charcoal group-hover:text-charcoal text-[length:var(--text-sm)] font-semibold">
        {link.label}
      </span>
    </Link>
  );
}

export type HomeQuickLinksProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  links?: QuickLinkItem[];
};

export function HomeQuickLinks({
  links = DEFAULT_LINKS,
}: HomeQuickLinksProps = {}) {
  return (
    <SectionGrid
      id="kisa-yollar"
      variant="honey"
      className="border-charcoal/10 border-t"
    >
      <Marquee
        speed={70}
        className="[mask-image:var(--marquee-mask)] [--marquee-mask:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:var(--marquee-mask)]"
      >
        {links.map((link) => (
          <Chip key={link.href} link={link} />
        ))}
      </Marquee>
    </SectionGrid>
  );
}
