"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { CalendarDays, Newspaper } from "lucide-react";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import type { SiteEvent, SiteNews } from "@/content/guncel";
import type { SiteMedia } from "@/content/site-media";
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

export type HomeGuncelProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  featuredEventLabel?: string;
  upcomingEventsLabel?: string;
  newsLabel?: string;
  featuredEventMedia?: SiteMedia;
  events?: (SiteEvent & { slug?: string })[];
  news?: (SiteNews & { slug?: string })[];
};

export function HomeGuncel({
  eyebrow = "Duyurular",
  title = "Etkinlikler ve haberler",
  description = "Okul takvimi, duyurular ve kurum içinden kısa gelişmeler tek alanda.",
  ctaLabel = "Tüm içerikler",
  ctaHref = "/guncel/haberler",
  featuredEventLabel = "Öne çıkan etkinlik",
  upcomingEventsLabel = "Yaklaşan etkinlikler",
  newsLabel = "Haberler",
  featuredEventMedia = mediaPageItems[1] as SiteMedia,
  events = [],
  news = [],
}: HomeGuncelProps) {
  const featured = events[0];
  const featuredMedia = featuredEventMedia;
  const otherEvents = events.slice(1);
  const hasNews = news.length > 0;
  const marqueeItems = [...events, ...news, ...events];
  const featuredHref = featured?.slug
    ? `/guncel/etkinlikler/${featured.slug}`
    : "/guncel/etkinlikler";

  return (
    <SectionGrid
      id="guncel"
      data-section="guncel"
      variant="honey"
      className="!bg-brand-honey border-charcoal/10 border-y !py-0"
      innerClassName="!py-fluid-8 sm:!py-fluid-16"
    >
      <div className="border-charcoal/10 border-y bg-white/50">
        <Marquee
          speed={55}
          className="text-charcoal/80 py-fluid-2 text-[length:var(--text-xs)] font-semibold tracking-[0.28em] uppercase"
        >
          {marqueeItems.map((item, i) => (
            <span key={`${item.id}-${i}`} className="flex items-center gap-fluid-3">
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
        className="mt-fluid-8"
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Link href={ctaHref} className="cta-pill">
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        }
      />

      <div className="mt-fluid-8 grid gap-fluid-6 lg:grid-cols-12">
        {featured ? (
          <Link
            href={featuredHref}
            className="group border-charcoal/15 relative col-span-1 overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,#1a1c18,#2a2e28_55%,var(--color-brand-green))] p-fluid-6 text-white shadow-[0_30px_120px_rgba(26,28,24,0.20)] lg:col-span-7 lg:p-fluid-8"
          >
            {featuredMedia.kind === "video" ? (
              <AmbientSiteVideo
                className="absolute inset-0 h-full w-full object-cover"
                src={featuredMedia.src}
                poster={featuredMedia.poster}
                title={featuredMedia.alt}
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
            <div className="relative flex h-full flex-col gap-fluid-6">
              <div className="flex items-center gap-fluid-4">
                <div
                  className="bg-brand-honey text-charcoal grid w-24 place-items-center shadow-[0_24px_60px_rgba(26,28,24,0.22)]"
                  style={{
                    aspectRatio: "2 / 1.7320508075688772",
                    clipPath: HEX_CLIP,
                  }}
                >
                  <div className="px-1 text-center">
                    <p className="text-[length:var(--text-2xl)] leading-none font-bold tabular-nums">
                      {dayParts(featured.date).day}
                    </p>
                    <p className="mt-fluid-1 text-[length:var(--text-xs)] font-semibold tracking-[0.18em] whitespace-nowrap uppercase">
                      {dayParts(featured.date).month}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[length:var(--text-xs)] font-semibold tracking-[0.28em] uppercase backdrop-blur">
                  {featuredEventLabel}
                </span>
              </div>
              <h3 className="text-[length:var(--text-3xl)] leading-[1.1] font-semibold tracking-tight text-balance">
                {featured.title}
              </h3>
              <p className="section-body max-w-xl text-white/85">
                {featured.excerpt}
              </p>
              <div className="mt-auto inline-flex items-center gap-fluid-2 text-[length:var(--text-sm)] font-semibold text-white/90 transition group-hover:text-white">
                Etkinlik detayları <span aria-hidden>→</span>
              </div>
            </div>
          </Link>
        ) : null}

        <div className="col-span-1 flex flex-col gap-fluid-6 lg:col-span-5">
          <GlassPanel className="p-fluid-4" interactive>
            <div className="flex items-center gap-fluid-3">
              <HexBadge size="md">
                <CalendarDays className="size-5" aria-hidden />
              </HexBadge>
              <h3 className="section-eyebrow text-charcoal/60">
                {upcomingEventsLabel}
              </h3>
            </div>
            {otherEvents.length > 0 ? (
              <StaggerList className="mt-fluid-4 space-y-fluid-3">
                {otherEvents.map((e) => (
                  <StaggerItem key={e.id}>
                    <div className="border-charcoal/10 hover:border-brand-green/30 flex items-start gap-fluid-3 rounded-2xl border bg-white/80 p-fluid-4 transition">
                      <div
                        className="bg-brand-honey text-charcoal grid w-14 shrink-0 place-items-center"
                        style={{
                          aspectRatio: "2 / 1.7320508075688772",
                          clipPath: HEX_CLIP,
                        }}
                      >
                        <div className="px-1 text-center">
                          <p className="text-[length:var(--text-sm)] leading-none font-bold">
                            {dayParts(e.date).day}
                          </p>
                          <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.12em] whitespace-nowrap uppercase">
                            {dayParts(e.date).month}
                          </p>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-charcoal font-semibold">{e.title}</p>
                        <p className="text-charcoal/70 mt-fluid-1 line-clamp-2 text-[length:var(--text-sm)]">
                          {e.excerpt}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            ) : (
              <p className="border-charcoal/20 text-charcoal/70 mt-fluid-4 rounded-2xl border border-dashed bg-white/60 p-fluid-4 text-[length:var(--text-sm)]">
                Yaklaşan etkinlikler için tüm takvimi inceleyebilirsiniz.
              </p>
            )}
          </GlassPanel>

          <GlassPanel className="p-fluid-4" interactive>
            <div className="flex items-center gap-fluid-3">
              <HexBadge size="md">
                <Newspaper className="size-5" aria-hidden />
              </HexBadge>
              <h3 className="section-eyebrow text-charcoal/60">
                {newsLabel}
              </h3>
            </div>
            {hasNews ? (
              <StaggerList className="mt-fluid-4 space-y-fluid-3">
                {news.map((n) => (
                  <StaggerItem key={n.id}>
                    <div className="border-charcoal/10 rounded-2xl border bg-white/80 p-fluid-4">
                      <p className="text-charcoal/60 text-[length:var(--text-xs)]">
                        {formatDate(n.date)}
                      </p>
                      <p className="text-charcoal mt-fluid-1 font-semibold">
                        {n.title}
                      </p>
                      <p className="text-charcoal/70 mt-fluid-1 text-[length:var(--text-sm)]">
                        {n.excerpt}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            ) : (
              <p className="border-charcoal/20 text-charcoal/70 mt-fluid-4 rounded-2xl border border-dashed bg-white/60 p-fluid-4 text-[length:var(--text-sm)]">
                Henüz yayınlanmış haber yok. Duyurular için{" "}
                <Link
                  href="/guncel/haberler"
                  className="text-brand-green font-semibold hover:underline"
                >
                  güncel bölümünü
                </Link>{" "}
                tâkib edin.
              </p>
            )}
          </GlassPanel>
        </div>
      </div>
    </SectionGrid>
  );
}
