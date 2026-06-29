"use client";

import { useCallback, useState, useId } from "react";
import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Compass,
  Users,
  Heart,
  GraduationCap,
  Book,
  Star,
  Award,
  TrendingUp,
  Globe,
  HeartHandshake,
  UserCheck,
  Coffee,
  Smile,
  Map,
  MapPin,
  Landmark,
  BookOpen,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, type NavSection, type NavItem } from "@/lib/navigation";
import logo from "@/images/logo.svg";

/* -------------------------------------------------------------------------
   Icon map — lucide-react PascalCase adları string anahtarlarıyla eşleşir
   (yalnızca mega menü ve mobil alt link satırlarında kullanılır;
   menü başlıklarında ikon kullanılmaz)
   ------------------------------------------------------------------------- */
const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  Compass,
  Users,
  Heart,
  GraduationCap,
  Book,
  Star,
  Award,
  TrendingUp,
  Globe,
  HeartHandshake,
  UserCheck,
  Coffee,
  Smile,
  Map,
  MapPin,
  Landmark,
  BookOpen,
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}

/* Çok kelimeli başlıkları ikiye böler; labelLines varsa onu kullanır */
function LabelLines({
  label,
  lines,
}: {
  label: string;
  lines?: [string, string];
}) {
  if (lines) {
    return (
      <span className="flex flex-col items-center leading-[1.2]">
        <span>{lines[0]}</span>
        <span>{lines[1]}</span>
      </span>
    );
  }

  const cut = label.lastIndexOf(" ");
  if (cut === -1) return <>{label}</>;
  return (
    <span className="flex flex-col items-center leading-[1.2]">
      <span>{label.slice(0, cut)}</span>
      <span>{label.slice(cut + 1)}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------
   CentralLogo — merkez logo dairesi (header sınırından taşar)
   ------------------------------------------------------------------------- */
function CentralLogo({ onClick }: { onClick?: () => void }) {
  const uid = useId();
  return (
    <Link
      href="/"
      onClick={onClick}
      className="central-identity rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1c18]"
      aria-label="Ana sayfaya git"
    >
      <span className="logo-drop-area">
        <Image
          src={logo}
          alt="Sultan Okulları"
          fill
          sizes="130px"
          className="logo-main-img"
          priority
        />
        {/*
          Sarı halkada alt yay yazısı — SVG textPath
          165px beyaz çembere orantılı: r=102, viewBox -82.5..82.5
        */}
        <svg
          viewBox="-82.5 -82.5 165 165"
          width="100%"
          height="100%"
          overflow="visible"
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
        >
          <defs>
            {/* Alt yarım daire — sol (-102,0) → sağ (102,0) */}
            <path id={`${uid}b`} d="M -102,0 A 102,102 0 0,0 102,0" />
          </defs>
          <text
            fontFamily="var(--font-cinzel), Georgia, serif"
            fontWeight="600"
            fontSize="14"
            fill="#1a1c18"
            letterSpacing="3"
            className="text-[12px] md:text-[14px]"
          >
            <textPath href={`#${uid}b`} startOffset="50%" textAnchor="middle">
              SULTAN OKULLARI
            </textPath>
          </text>
        </svg>
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------
   MegaPanel — dropdown içerik kartı
   ------------------------------------------------------------------------- */
function MegaPanel({
  section,
  onLinkClick,
}: {
  section: NavSection;
  onLinkClick?: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredItem, setHoveredItem] = useState<NavItem | null>(null);

  const defaultItem =
    section.items.find((item) => item.img || item.video) ?? null;
  const activeItem = hoveredItem ?? defaultItem;

  const activeVideo = activeItem?.video ?? null;
  const activeImg = activeItem?.img ?? section.featured.img;
  const activeLabel = activeItem?.label ?? section.featured.label;
  const useSoftCrop = section.key === "egitim" || section.key === "akademik";
  const mediaKey = activeVideo ?? activeImg;

  return (
    <motion.div
      key={section.key}
      initial={{ opacity: 0, y: -8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
      }
      className="absolute top-full right-0 left-0 z-[1] pt-3"
      role="region"
      aria-label={section.label + " menüsü"}
    >
      <div className="mega-menu-grid items-stretch">
        {/* Sol kart — col-2: hero bilgi kartı ile aynı başlangıç hizası */}
        <div className="col-span-full flex flex-col overflow-hidden rounded-[1.5rem] bg-[#FDFBF0] pt-7 pr-7 pb-7 shadow-[0_32px_80px_rgba(0,0,0,0.22)] lg:col-start-2 lg:col-end-3 lg:h-[460px]">
          <div className="mega-panel-content flex min-h-0 flex-1 flex-col">
            {/* Bölüm kimliği — logo çakışma bölgesi için sağdan boşluk */}
            <div className="border-b border-[#1a1c18]/15 pr-32 pb-5 lg:pr-32">
              <p className="font-cinzel text-[0.68rem] font-bold tracking-[0.32em] text-[#1a1c18] uppercase">
                {section.label}
              </p>
            </div>

            {/* Açıklama — editorial pull-quote */}
            {section.description && (
              <div className="relative mt-4 pr-4 lg:pr-32">
                {/* Dekoratif tırnak işareti */}
                <span
                  className="font-cinzel pointer-events-none absolute -top-2 -left-1 text-[4rem] leading-none text-[#1a1c18]/8 select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="font-cinzel relative text-[length:var(--text-sm)] leading-[1.65] font-medium tracking-wide text-[#1a1c18]/70">
                  {section.description}
                </p>
                {/* Alt aksan çizgisi */}
                <span
                  className="mt-3 block h-px w-8 rounded-full bg-[#1a1c18]/20"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Bağlantı listesi */}
            <nav className="mt-4 flex flex-1 flex-col justify-center gap-0">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem(item)}
                  onBlur={() => setHoveredItem(null)}
                  className="group relative flex min-h-[44px] items-center gap-4 rounded-xl py-2 pr-4 transition-all duration-200 hover:bg-[#fff085] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18]"
                >
                  <span className="flex-1 text-[length:var(--text-base)] leading-snug font-semibold text-[#1a1c18]/80 transition-colors duration-200 group-hover:text-black">
                    {item.label}
                    {item.isNew && (
                      <span className="ml-2.5 inline-flex items-center rounded-full bg-[#1a1c18] px-2 py-0.5 text-[0.58rem] leading-none font-bold text-[#4cff00] uppercase">
                        Yakında
                      </span>
                    )}
                  </span>

                  {/* Ok işareti */}
                  <span
                    className="shrink-0 -translate-x-1 text-black opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Sağ kart: medya — col-3: hero altıgen medya ile aynı kolon */}
        <div className="group/media relative col-span-full min-h-[220px] w-full self-stretch overflow-hidden rounded-[1.5rem] bg-[#1a1c18] shadow-[0_32px_80px_rgba(0,0,0,0.22)] lg:col-start-3 lg:col-end-4 lg:h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mediaKey}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {activeVideo ? (
                <div
                  className={
                    useSoftCrop ? "mega-media-frame" : "absolute inset-0"
                  }
                >
                  <AmbientSiteVideo
                    playerKey={activeVideo}
                    src={activeVideo}
                    title="Menü tanıtım videosu"
                    preload="none"
                    poster={activeVideo.replace(/\.mp4$/, "-poster.jpg")}
                    className="mega-media-fill"
                  />
                </div>
              ) : (
                <div
                  className={
                    useSoftCrop
                      ? "mega-media-frame relative"
                      : "absolute inset-0"
                  }
                >
                  <Image
                    src={activeImg}
                    alt={activeLabel ?? ""}
                    fill
                    className="mega-media-fill"
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    priority={false}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Gradient katmanı */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0d0f0b]/90 via-[#1a1c18]/40 to-transparent" />

          {/* Etiket */}
          {activeLabel && (
            <div className="absolute right-7 bottom-7 left-7">
              <span className="font-cinzel text-[length:var(--text-base)] leading-snug font-bold text-white">
                {activeLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   MobileDrawer — sağdan kayan Headless UI Dialog + Disclosure akordeon
   ------------------------------------------------------------------------- */
function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [openSection, setOpenSection] = useState<string>(NAV_SECTIONS[0].key);

  const toggleSection = useCallback((key: string) => {
    setOpenSection((prev) => (prev === key ? "" : key));
  }, []);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[1100]">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <motion.div
          initial={shouldReduceMotion ? false : { x: "100%" }}
          animate={{ x: 0 }}
          exit={shouldReduceMotion ? undefined : { x: "100%" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        >
          <DialogPanel className="flex h-full w-[min(100vw,400px)] flex-col overflow-y-auto bg-white shadow-2xl">
            {/* Drawer header — yalnızca kapat butonu */}
            <div className="flex items-center justify-end border-b border-gray-100 px-4 py-3">
              <button
                onClick={onClose}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#1a1c18] hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18]"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Accordion navigation */}
            <nav className="flex flex-1 flex-col px-4 py-4">
              {NAV_SECTIONS.map((section) => {
                /* Öncelik: item'daki img → yoksa item'daki video */
                const sectionImg =
                  section.items.find((it) => it.img)?.img ?? null;
                const sectionVideo = sectionImg
                  ? null
                  : (section.items.find((it) => it.video)?.video ?? null);

                const isOpen = openSection === section.key;

                return (
                  <div key={section.key} className="mb-1">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.key)}
                      aria-expanded={isOpen}
                      aria-controls={`mobile-panel-${section.key}`}
                      className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl px-4 py-2 text-[length:var(--text-sm)] font-bold text-[#1a1c18] hover:bg-[#fff085]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18]"
                    >
                      {section.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300",
                          isOpen && "rotate-180 text-[#1a1c18]",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={`mobile-panel-${section.key}`}
                        role="region"
                        aria-label={section.label}
                        className="pt-1 pb-3 pl-2"
                      >
                        {/* Alt bağlantılar */}
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 py-1.5 text-[length:var(--text-sm)] font-medium text-gray-600 hover:text-[#1a1c18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18]"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-50">
                              <NavIcon
                                name={item.icon}
                                className="h-3.5 w-3.5"
                              />
                            </span>
                            <span className="flex items-center gap-1.5">
                              {item.label}
                              {item.isNew && (
                                <span className="ml-auto rounded-full bg-[#4cff00] px-2 py-0.5 text-[0.6rem] leading-none font-bold text-[#1a1c18] uppercase">
                                  Yakında
                                </span>
                              )}
                            </span>
                          </Link>
                        ))}

                        {/* Bölüm medyası */}
                        {(sectionImg || sectionVideo) && (
                          <div className="relative mx-2 mt-3 aspect-[16/9] overflow-hidden rounded-xl">
                            {sectionImg ? (
                              <Image
                                src={sectionImg}
                                alt={section.label}
                                fill
                                className="object-cover"
                                sizes="(max-width: 400px) 90vw, 360px"
                              />
                            ) : (
                              <AmbientSiteVideo
                                src={sectionVideo!}
                                title="Menü bölüm videosu"
                                preload="none"
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Drawer alt — "Sizi Arayalım" CTA */}
            <div className="px-4 pt-2 pb-6">
              <Link
                href="/iletisim"
                onClick={onClose}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#4cff00] text-[length:var(--text-base)] font-bold text-black shadow-md transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18]"
              >
                Sizi Arayalım
              </Link>
            </div>
          </DialogPanel>
        </motion.div>
      </div>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------
   SiteHeader — ana bileşen
   ------------------------------------------------------------------------- */
export function SiteHeader() {
  const shouldReduceMotion = useReducedMotion();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMenu = useCallback((key: string) => {
    setActiveMenu(key);
  }, []);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const closeAllMenus = useCallback(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, []);

  const leftSections = NAV_SECTIONS.slice(0, 3);
  const rightSections = NAV_SECTIONS.slice(3);

  const activeSection = NAV_SECTIONS.find((s) => s.key === activeMenu) ?? null;

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <MobileDrawer
            open={mobileOpen}
            onClose={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* Header + mega panel hover bölgesi (backdrop dışında — dışına çıkınca kapanır) */}
      <div className="relative z-[1000] w-full min-w-0 overflow-x-clip">
        {/* Mega menü açıkken anasayfa / hero — buzlu cam */}
        <AnimatePresence>
          {activeSection && (
            <motion.div
              key="mega-menu-backdrop"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
              }
              className="mega-menu-backdrop pointer-events-auto fixed inset-x-0 top-[var(--header-height)] bottom-0 z-[1] hidden lg:block"
              aria-hidden="true"
              onMouseEnter={closeMenu}
            >
              <div className="mega-menu-backdrop__mesh" />
              <div className="mega-menu-backdrop__shapes">
                <span className="mega-menu-backdrop__shape mega-menu-backdrop__shape--1" />
                <span className="mega-menu-backdrop__shape mega-menu-backdrop__shape--2" />
                <span className="mega-menu-backdrop__shape mega-menu-backdrop__shape--3" />
                <span className="mega-menu-backdrop__shape mega-menu-backdrop__shape--4" />
                <span className="mega-menu-backdrop__shape mega-menu-backdrop__shape--5" />
                <span className="mega-menu-backdrop__shape mega-menu-backdrop__shape--6" />
              </div>
              <div className="mega-menu-backdrop__glass" />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          onMouseLeave={closeMenu}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              closeMenu();
            }
          }}
        >
          <header className="bg-brand-honey relative z-[2] h-[90px] overflow-visible shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
            {/* ---- Mobil bar (xs → lg-1) ---- */}
            <div className="relative flex h-full w-full items-center justify-between px-[var(--mobile-chrome-gutter)] lg:hidden">
              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#1a1c18] hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18]"
                aria-label="Menüyü aç"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-7 w-7" aria-hidden="true" />
              </button>

              {/* Logo — desktop grid davranışıyla aynı: h=90px, yatayda orta */}
              <div className="absolute top-0 left-1/2 flex h-[90px] -translate-x-1/2 items-center justify-center">
                <CentralLogo onClick={closeAllMenus} />
              </div>

              {/* Sağ — "Sizi Arayalım" butonu */}
              <Link
                href="/iletisim"
                className="flex h-[52px] items-center justify-center rounded-xl bg-[#4cff00] px-5 text-[0.88rem] font-bold text-black shadow-sm transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18]"
              >
                Sizi Arayalım
              </Link>
            </div>

            {/* ---- Desktop grid (lg+) · 10 kolon · baş ve son kenar tamponu ---- */}
            <nav
              className="nav-header-grid hidden h-full items-center justify-items-stretch lg:grid"
              aria-label="Ana navigasyon"
            >
              {/* Kolon 1 — sol kenar tamponu */}
              <div aria-hidden="true" />

              {/* Sol başlıklar — kolon 2-4 */}
              {leftSections.map((section) => (
                <button
                  key={section.key}
                  className={cn(
                    "nav-link-header",
                    activeMenu === section.key && "active",
                  )}
                  onMouseEnter={() => openMenu(section.key)}
                  onFocus={() => openMenu(section.key)}
                  aria-expanded={activeMenu === section.key}
                  aria-haspopup="true"
                >
                  <LabelLines
                    label={section.label}
                    lines={section.labelLines}
                  />
                </button>
              ))}

              {/* Merkez logo — kolon 5-6 */}
              <div className="col-span-2 flex h-full justify-center">
                <CentralLogo onClick={closeAllMenus} />
              </div>

              {/* Sağ başlıklar — kolon 6-8 */}
              {rightSections.map((section) => (
                <button
                  key={section.key}
                  className={cn(
                    "nav-link-header",
                    activeMenu === section.key && "active",
                  )}
                  onMouseEnter={() => openMenu(section.key)}
                  onFocus={() => openMenu(section.key)}
                  aria-expanded={activeMenu === section.key}
                  aria-haspopup="true"
                >
                  <LabelLines
                    label={section.label}
                    lines={section.labelLines}
                  />
                </button>
              ))}

              {/* Kolon 10 — sağ kenar tamponu */}
              <div aria-hidden="true" />
            </nav>
          </header>

          {/* Mega panel — header dışında ama hover wrapper içinde */}
          <AnimatePresence>
            {activeSection && (
              <div className="hidden lg:block">
                <MegaPanel section={activeSection} onLinkClick={closeAllMenus} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
