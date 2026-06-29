"use client";

import Link from "@/components/navigation/site-link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import type { Branch } from "@/content/branches";
import { branches as staticBranches } from "@/content/branches";
import { InstagramGlyph } from "@/components/icons/instagram-glyph";
import { ContentCard } from "@/components/layout/content-card";
import { SectionGrid } from "@/components/layout/section-grid";
import { NAV_SECTIONS } from "@/lib/navigation";
import { getCampusRouteFromBranch } from "@/lib/campus-routes";
import { cn } from "@/lib/cn";
import {
  staggerContainerVariants,
  staggerItemVariants,
  transitionShort,
  viewportInView,
} from "@/lib/animations";

const socials = [
  {
    href: "https://www.instagram.com/sultanokullari/",
    label: "Instagram",
    Icon: ({ className }: { className?: string }) => (
      <InstagramGlyph className={className} useGradient />
    ),
  },
];

const footerNavGroups = [
  NAV_SECTIONS.find((s) => s.key === "kurumsal"),
  NAV_SECTIONS.find((s) => s.key === "egitim"),
  NAV_SECTIONS.find((s) => s.key === "akademik"),
  NAV_SECTIONS.find((s) => s.key === "rehberlik"),
  NAV_SECTIONS.find((s) => s.key === "yasam"),
  NAV_SECTIONS.find((s) => s.key === "okullar"),
].filter(Boolean);

export function SiteFooter({ branches = staticBranches }: { branches?: Branch[] }) {
  const reduce = useReducedMotion();

  return (
    <footer className="border-charcoal/10 bg-brand-honey/25 relative mt-auto border-t">
      <SectionGrid variant="honey" className="pt-fluid-8 pb-fluid-6" as="div">
        <ContentCard className="mb-fluid-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Sultan Okulları</p>
              <h2 className="section-title mt-3">
                İlimde âlim, ibadette âbid, gayrette mücahit bir neslin
                yetiştiği çift kanatlı eğitim modeli
              </h2>
              <p className="section-body mt-4">
                Ön kayıt, okul ziyareti veya bilgi talebi için bizimle iletişime
                geçin.
              </p>
            </div>
            <Link
              href="/iletisim"
              className="cta-pill shrink-0 self-start lg:self-center"
            >
              Sizi Arayalım
            </Link>
          </div>
        </ContentCard>

        {reduce ? (
          <FooterGrid branches={branches} />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportInView}
            variants={staggerContainerVariants}
          >
            <FooterGrid motion branches={branches} />
          </motion.div>
        )}

        <div className="border-charcoal/10 mt-fluid-8 border-t pt-fluid-6">
          <div className="text-charcoal/70 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Sultan Okulları. Tüm hakları
              saklıdır.
            </p>
            <nav
              aria-label="Yasal bağlantılar"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end"
            >
              <Link href="/sss" className="hover:text-charcoal transition">
                SSS
              </Link>
              <Link href="/kvkk" className="hover:text-charcoal transition">
                KVKK
              </Link>
              <Link
                href="/gizlilik-politikasi"
                className="hover:text-charcoal transition"
              >
                Gizlilik politikası
              </Link>
            </nav>
          </div>
        </div>
      </SectionGrid>
    </footer>
  );
}

function FooterGrid({
  motion: useMotion,
  branches = staticBranches,
}: {
  motion?: boolean;
  branches?: Branch[];
}) {
  const Wrapper = useMotion ? motion.div : "div";
  const ItemWrapper = useMotion ? motion.div : "div";
  const itemProps = useMotion
    ? { variants: staggerItemVariants, transition: transitionShort }
    : {};

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
      <ItemWrapper {...itemProps}>
        <Link
          href="/"
          aria-label="Sultan Okulları ana sayfası"
          className="inline-flex"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Sultan Okulları"
            className="h-12 w-auto object-contain"
          />
        </Link>
        <p className="section-body mt-4 max-w-xs">
          Milli ve manevi değerlerle bütünleşik eğitim vizyonu — anaokulundan
          ortaokula, nebevî eğitim yolculuğu.
        </p>
        <div className="mt-5 flex items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="border-charcoal/15 text-charcoal hover:border-brand-green/50 grid size-10 place-items-center rounded-full border bg-white shadow-sm transition"
            >
              <Icon className="size-5" />
            </Link>
          ))}
        </div>
      </ItemWrapper>

      {footerNavGroups.map((section) =>
        section ? (
          <ItemWrapper key={section.key} {...itemProps}>
            <p className="font-cinzel text-charcoal text-sm font-bold tracking-[0.18em] uppercase">
              {section.label}
            </p>
            <ul className="mt-4 space-y-2.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group text-charcoal/75 hover:text-charcoal inline-flex items-center gap-1.5 text-sm transition"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      className="size-3.5 opacity-0 transition group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </ItemWrapper>
        ) : null,
      )}

      <Wrapper
        className="sm:col-span-2 lg:col-span-4"
        {...(useMotion
          ? { variants: staggerItemVariants, transition: transitionShort }
          : {})}
      >
        <ContentCard inset className="mt-2 lg:mt-0">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ContactItem
              icon={Phone}
              label="Telefon"
              value={branches[0].phone}
              href={`tel:${branches[0].phone.replace(/\s/g, "")}`}
            />
            <ContactItem
              icon={Mail}
              label="E-posta"
              value="info@sultanokullari.com"
              href="mailto:info@sultanokullari.com"
            />
            <div className="flex items-start gap-3 sm:col-span-2">
              <span className="bg-brand-green/30 text-charcoal grid size-10 shrink-0 place-items-center rounded-full">
                <MapPin className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="section-eyebrow text-[0.62rem]">Okullarımız</p>
                <p className="section-body mt-2">
                  {branches.map((b, i) => (
                    <span key={b.slug}>
                      {i > 0 ? " · " : ""}
                      <Link
                        href={getCampusRouteFromBranch(b)}
                        className="text-charcoal font-semibold hover:underline"
                      >
                        {b.district}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </ContentCard>
      </Wrapper>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-brand-green/30 text-charcoal grid size-10 shrink-0 place-items-center rounded-full">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="section-eyebrow text-[0.62rem]">{label}</p>
        <a
          href={href}
          className={cn(
            "text-charcoal mt-1 block truncate text-sm font-semibold hover:underline",
          )}
        >
          {value}
        </a>
      </div>
    </div>
  );
}
