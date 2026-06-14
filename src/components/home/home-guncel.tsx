"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Newspaper } from "lucide-react";
import { staticEvents, staticNews } from "@/content/guncel";
import { mediaPageItems } from "@/content/site-media";
import { Marquee } from "@/components/ui/marquee";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { GlassPanel } from "@/components/ui/glass-panel";
import { HexBadge } from "@/components/ui/hex-badge";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function dayParts(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { day: "—", month: "" };
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: new Intl.DateTimeFormat("tr-TR", { month: "long" })
      .format(date)
      .toLocaleUpperCase("tr-TR"),
  };
}

export function HomeGuncel() {
  const featured = staticEvents[0];
  const featuredMedia = mediaPageItems[1];
  const otherEvents = staticEvents.slice(1);
  const hasNews = staticNews.length > 0;

  return (
    <SectionGrid
      id="guncel"
      data-section="guncel"
      variant="honey"
      className="border-charcoal/10 border-y !py-0"
      innerClassName="!py-fluid-8 sm:!py-fluid-16"
    >
      <div className="border-charcoal/10 -mx-[var(--layout-margin)] border-y bg-white/50 sm:-mx-0">
        <Marquee
          speed={55}
          className="text-charcoal/80 py-3 text-xs font-semibold tracking-[0.28em] uppercase"
        >
          {[...staticEvents, ...staticNews, ...staticEvents].map((item, i) => (
            <span key={`${item.id}-${i}`} className="flex items-center gap-3">
              <span
                aria-hidden
                className="bg-brand-green/60 inline-block w-2"
                style={{
                  aspectRatio: "2 / 1.7320508075688772",
                  clipPath: HEX_CLIP,
                }}
              />
              {formatDate(item.date)}
              <span className="text-brand-green">▸</span>
              <span className="font-medium tracking-normal normal-case">
                {item.title}
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <SectionHeading
        className="mt-10"
        eyebrow="Duyurular"
        title="Etkinlikler ve haberler"
        description="Okul takvimi, duyurular ve kurum içinden kısa gelişmeler tek alanda."
        action={
          <Link href="/guncel/haberler" className="cta-pill">
            Tüm içerikler <span aria-hidden>→</span>
          </Link>
        }
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        {featured ? (
          <Link
            href="/guncel/etkinlikler"
            className="group border-charcoal/15 relative col-span-1 overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,#1a1c18,#2a2e28_55%,var(--color-brand-green))] p-8 text-white shadow-[0_30px_120px_rgba(26,28,24,0.20)] lg:col-span-7 lg:p-10"
          >
            {featuredMedia.kind === "video" ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={featuredMedia.src}
                poster={featuredMedia.poster}
                autoPlay
                loop
                muted
                playsInline
                aria-label={featuredMedia.alt}
              />
            ) : (
              <Image
                src={featuredMedia.src}
                alt={featuredMedia.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 42rem"
                className="object-cover"
              />
            )}
            <div className="from-charcoal/72 via-charcoal/42 to-charcoal/70 absolute inset-0 bg-gradient-to-br" />
            <span
              aria-hidden
              className="absolute top-8 right-8 inline-block w-12 bg-white/15"
              style={{
                aspectRatio: "2 / 1.7320508075688772",
                clipPath: HEX_CLIP,
              }}
            />
            <div className="relative flex h-full flex-col gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="bg-brand-honey text-charcoal grid w-24 place-items-center shadow-[0_24px_60px_rgba(26,28,24,0.22)]"
                  style={{
                    aspectRatio: "2 / 1.7320508075688772",
                    clipPath: HEX_CLIP,
                  }}
                >
                  <div className="px-1 text-center">
                    <p className="text-2xl leading-none font-bold tabular-nums">
                      {dayParts(featured.date).day}
                    </p>
                    <p className="mt-1 text-[0.55rem] font-semibold tracking-[0.18em] whitespace-nowrap uppercase">
                      {dayParts(featured.date).month}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.28em] uppercase backdrop-blur">
                  Öne çıkan etkinlik
                </span>
              </div>
              <h3 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
                {featured.title}
              </h3>
              <p className="max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                {featured.excerpt}
              </p>
              <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition group-hover:text-white">
                Etkinlik detayları <span aria-hidden>→</span>
              </div>
            </div>
          </Link>
        ) : null}

        <div className="col-span-1 flex flex-col gap-6 lg:col-span-5">
          <GlassPanel className="p-6" interactive>
            <div className="flex items-center gap-3">
              <HexBadge size="md">
                <CalendarDays className="size-5" aria-hidden />
              </HexBadge>
              <h3 className="text-charcoal/60 text-xs font-semibold tracking-[0.28em] uppercase">
                Yaklaşan etkinlikler
              </h3>
            </div>
            {otherEvents.length > 0 ? (
              <StaggerList className="mt-5 space-y-3">
                {otherEvents.map((e) => (
                  <StaggerItem key={e.id}>
                    <div className="border-charcoal/10 hover:border-brand-green/30 flex items-start gap-3 rounded-2xl border bg-white/80 p-4 transition">
                      <div
                        className="bg-brand-honey text-charcoal grid w-14 shrink-0 place-items-center"
                        style={{
                          aspectRatio: "2 / 1.7320508075688772",
                          clipPath: HEX_CLIP,
                        }}
                      >
                        <div className="px-1 text-center">
                          <p className="text-sm leading-none font-bold">
                            {dayParts(e.date).day}
                          </p>
                          <p className="text-[0.45rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase">
                            {dayParts(e.date).month}
                          </p>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-charcoal font-semibold">{e.title}</p>
                        <p className="text-charcoal/70 mt-1 line-clamp-2 text-sm">
                          {e.excerpt}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            ) : (
              <p className="border-charcoal/20 text-charcoal/70 mt-5 rounded-2xl border border-dashed bg-white/60 p-5 text-sm">
                Yaklaşan etkinlikler için tüm takvimi inceleyebilirsiniz.
              </p>
            )}
          </GlassPanel>

          <GlassPanel className="p-6" interactive>
            <div className="flex items-center gap-3">
              <HexBadge size="md">
                <Newspaper className="size-5" aria-hidden />
              </HexBadge>
              <h3 className="text-charcoal/60 text-xs font-semibold tracking-[0.28em] uppercase">
                Haberler
              </h3>
            </div>
            {hasNews ? (
              <StaggerList className="mt-5 space-y-3">
                {staticNews.map((n) => (
                  <StaggerItem key={n.id}>
                    <div className="border-charcoal/10 rounded-2xl border bg-white/80 p-4">
                      <p className="text-charcoal/60 text-xs">
                        {formatDate(n.date)}
                      </p>
                      <p className="text-charcoal mt-1 font-semibold">
                        {n.title}
                      </p>
                      <p className="text-charcoal/70 mt-1 text-sm">
                        {n.excerpt}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            ) : (
              <p className="border-charcoal/20 text-charcoal/70 mt-5 rounded-2xl border border-dashed bg-white/60 p-5 text-sm">
                Henüz yayınlanmış haber yok. Duyurular için{" "}
                <Link
                  href="/guncel/haberler"
                  className="text-brand-green font-semibold hover:underline"
                >
                  güncel bölümünü
                </Link>{" "}
                takip edin.
              </p>
            )}
          </GlassPanel>
        </div>
      </div>
    </SectionGrid>
  );
}
