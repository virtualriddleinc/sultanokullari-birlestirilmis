"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import type { Branch } from "@/content/branches";
import { IkWizard } from "@/components/kurumsal/ik-wizard";
import {
  headerMedia,
  insanKaynaklariMedia,
  type SiteMedia,
} from "@/content/site-media";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

const talentPillars = [
  {
    title: "Değer merkezli ekip",
    body: "Milli ve Mânevî değerleri eğitim diline taşıyan, öğrencinin kalbine temas etmeyi önemseyen bir kadro.",
    icon: HeartHandshake,
  },
  {
    title: "Butik okul iklimi",
    body: "Öğretmenin öğrencisini yakından tanıdığı, iletişimin güçlü ve sorumluluğun paylaşıldığı sıcak çalışma ortamı.",
    icon: UsersRound,
  },
  {
    title: "Gelişim kültürü",
    body: "Pedagojik derinlik, mesleki öğrenme ve kurum içi paylaşım ile öğretmenin yolculuğunu destekleyen yapı.",
    icon: GraduationCap,
  },
] as const satisfies readonly {
  title: string;
  body: string;
  icon: LucideIcon;
}[];

const processSteps = [
  {
    title: "Başvuru",
    body: "Kısa form ile temel bilgilerinizi ve çalışma alanınızı paylaşın.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Ön değerlendirme",
    body: "Yetkinlik, değer uyumu ve şube ihtiyacına göre başvurunuz incelenir.",
    icon: BookOpenCheck,
  },
  {
    title: "Görüşme",
    body: "Karşılıklı beklentileri, eğitim yaklaşımını ve çalışma kültürünü konuşuruz.",
    icon: MessageCircleHeart,
  },
  {
    title: "KVKK ve kayıt",
    body: "Onay süreçleri tamamlanır, uygun pozisyonlar için iletişim sürdürülür.",
    icon: ShieldCheck,
  },
] as const satisfies readonly {
  title: string;
  body: string;
  icon: LucideIcon;
}[];

const highlights = [
  "5 şube",
  "Anaokulu · İlkokul · Ortaokul",
  "Nebevî eğitim iklimi",
  "Butik ve temiz okul ortamı",
] as const;

function MediaFrame({
  media,
  label,
  className,
  priority = false,
  animate = false,
}: {
  media: SiteMedia;
  label?: string;
  className?: string;
  priority?: boolean;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      data-ik-media={animate ? true : undefined}
      className={cn("relative overflow-hidden bg-emerald-950/10", className)}
    >
      {media.kind === "video" ? (
        <AmbientSiteVideo
          className="absolute inset-0 h-full w-full object-cover"
          src={media.src}
          poster={media.poster}
          title={media.alt}
          autoPlay={!reduce}
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      )}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-emerald-950/58 via-emerald-950/10 to-white/10"
      />
      {label ? (
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.22em] text-emerald-900 uppercase shadow-lg shadow-emerald-950/10 backdrop-blur">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function IkHumanResourcesPage({
  intro,
  branches,
}: {
  intro: string;
  branches?: Branch[];
}) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          root.querySelectorAll(
            "[data-ik-reveal], [data-ik-card], [data-ik-media]",
          ),
          {
            autoAlpha: 1,
            clearProps: "transform,filter",
          },
        );
        return undefined;
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const revealItems = gsap.utils.toArray<HTMLElement>(
          "[data-ik-reveal]",
          root,
        );

        revealItems.forEach((item) => {
          gsap.from(item, {
            autoAlpha: 0,
            y: 36,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              once: true,
            },
          });
        });

        const culture = root.querySelector<HTMLElement>("[data-ik-culture]");
        const mediaGrid = root.querySelector<HTMLElement>(
          "[data-ik-media-grid]",
        );

        if (culture) {
          gsap.from(root.querySelectorAll("[data-ik-card]"), {
            autoAlpha: 0,
            y: 32,
            scale: 0.96,
            duration: 0.78,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: {
              trigger: culture,
              start: "top 76%",
              once: true,
            },
          });
        }

        if (mediaGrid) {
          gsap.fromTo(
            root.querySelectorAll("[data-ik-media]"),
            { autoAlpha: 0, y: 56, scale: 0.94 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: mediaGrid,
                start: "top 78%",
                once: true,
              },
            },
          );
        }

        gsap.to(root.querySelectorAll("[data-ik-float]"), {
          y: -24,
          rotation: 2,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        ScrollTrigger.refresh();
        return undefined;
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <main ref={rootRef} className="overflow-hidden bg-white text-zinc-950">
      <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[radial-gradient(circle_at_16%_18%,rgba(18,138,54,0.16),transparent_34rem),linear-gradient(135deg,#fffdf7,#f5fbf6_54%,#ecfdf3)]">
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.06] mix-blend-multiply"
        />
        <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
          <div data-ik-reveal className="relative z-10">
            <p className="text-xs font-semibold tracking-[0.32em] text-[var(--color-primary)] uppercase">
              İnsan kaynakları · Sultan ailesi
            </p>
            <h1 className="mt-4 text-4xl leading-[1.02] font-semibold tracking-tight text-balance text-zinc-950 sm:text-5xl lg:text-7xl">
              Öğrencinin yoluna ışık tutan ekip arkadaşları arıyoruz.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-700 sm:text-lg">
              {intro} Sultan Okulları’nda insan kaynakları; yalnızca pozisyon
              doldurmak değil, aynı eğitim idealini paylaşan öğretmen ve çalışma
              arkadaşlarını aynı sofrada buluşturmaktır.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#basvuru"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-900/15 hover:bg-[var(--color-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Başvuru formuna geç
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="#surec"
                className="inline-flex items-center justify-center rounded-full border border-emerald-900/10 bg-white/70 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-lg shadow-emerald-950/5 backdrop-blur hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Süreci incele
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur"
                >
                  <CheckCircle2
                    className="size-4 text-[var(--color-primary)]"
                    aria-hidden
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative min-h-[34rem]"
            aria-label="İnsan kaynakları görsel alanı"
          >
            <div
              data-ik-float
              className="absolute top-0 right-2 z-10 w-28 bg-[var(--color-secondary)]/70 shadow-[0_24px_70px_rgba(180,83,9,0.18)] sm:right-10 sm:w-36"
              style={{
                aspectRatio: "2 / 1.7320508075688772",
                clipPath: HEX_CLIP,
              }}
              aria-hidden
            />
            <MediaFrame
              media={headerMedia.insanKaynaklari}
              label="Ekip ruhu"
              priority
              className="absolute top-8 left-0 h-[24rem] w-[78%] rounded-[2rem] shadow-[0_40px_120px_rgba(6,78,59,0.20)] sm:h-[31rem]"
            />
            <MediaFrame
              media={insanKaynaklariMedia[1]}
              label="Kurum atmosferi"
              className="absolute right-0 bottom-0 h-56 w-[58%] rounded-[1.75rem] border-4 border-white shadow-[0_30px_100px_rgba(6,78,59,0.22)] sm:h-72"
            />
            <div className="absolute bottom-8 left-6 max-w-xs rounded-3xl border border-white/40 bg-white/80 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--color-primary)] uppercase">
                Çalışma ilkesi
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Güven, nezaket, emanet bilinci ve öğrencinin fıtratına saygı.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        data-ik-culture
        className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
      >
        <div data-ik-reveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-[var(--color-primary)] uppercase">
            Çalışma kültürü
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Sultan Okulları’nda ekip olmak, aynı eğitim niyetini birlikte
            taşımaktır.
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            Öğretmen, idari ekip ve destek personeli için beklentimiz; mesleki
            yetkinliği güçlü, iletişimi temiz, öğrenciyi merkeze alan ve
            kurumsal değerleri sahiplenen bir duruştur.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {talentPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                data-ik-card
                className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50/70 p-6 shadow-sm"
              >
                <div
                  className="grid w-16 place-items-center bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  style={{
                    aspectRatio: "2 / 1.7320508075688772",
                    clipPath: HEX_CLIP,
                  }}
                >
                  <Icon className="size-7" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-950">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {pillar.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative bg-[var(--color-primary)] py-20 text-white sm:py-24">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(226,162,26,0.32),transparent_30rem)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div
            data-ik-reveal
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-emerald-100 uppercase">
                Kampüsten kareler
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Başvurduğunuz yer, yaşayan bir okul iklimi.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-emerald-50/80">
              Görseller ve kısa videolar; sınıf, etkinlik ve kurum atmosferinden
              seçilen gerçek kesitlerle çalışma ortamını daha yakından
              hissettirir.
            </p>
          </div>

          <div data-ik-media-grid className="mt-10 grid gap-4 md:grid-cols-4">
            {insanKaynaklariMedia.map((media, index) => (
              <MediaFrame
                key={media.src}
                media={media}
                label={
                  index === 0
                    ? "İK"
                    : index === 1
                      ? "Ekip"
                      : index === 2
                        ? "Etkinlik"
                        : "Kurum"
                }
                animate
                className={cn(
                  "h-72 rounded-[1.75rem] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.18)]",
                  index === 0 && "md:col-span-2 md:h-96",
                  index === 3 && "md:col-span-2",
                )}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="surec"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24"
      >
        <div data-ik-reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-[var(--color-primary)] uppercase">
            Başvuru süreci
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Kısa, anlaşılır ve insani bir değerlendirme akışı.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                data-ik-reveal
                className="relative rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <span className="text-xs font-semibold text-[var(--color-primary)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon
                  className="mt-5 size-8 text-[var(--color-primary)]"
                  aria-hidden
                />
                <h3 className="mt-4 text-base font-semibold text-zinc-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {step.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="basvuru"
        className="relative scroll-mt-28 bg-[linear-gradient(135deg,#f7fbf8,#fff8e6)] py-20 sm:py-24"
      >
        <div
          className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.05] mix-blend-multiply"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div data-ik-reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold tracking-[0.28em] text-[var(--color-primary)] uppercase">
              Başvuru formu
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Sizi tanımamız için ilk adımı buradan atın.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
              Form üç kısa adımdan oluşur. Başvurunuz demo ortamında doğrulanır;
              canlı kullanımda CV yükleme, e-posta bildirimi ve aday tâkib
              süreci eklenebilir.
            </p>
            <div className="mt-6 rounded-3xl border border-emerald-900/10 bg-white/80 p-5 text-sm leading-7 text-zinc-700 shadow-sm backdrop-blur">
              <div className="flex gap-3">
                <Sparkles
                  className="mt-1 size-5 shrink-0 text-[var(--color-secondary)]"
                  aria-hidden
                />
                <p>
                  Özellikle öğretmen, idari ekip ve destek personeli
                  başvurularında; mesleki deneyim kadar iletişim dili ve eğitim
                  niyeti de önemsenir.
                </p>
              </div>
            </div>
          </div>

          <div data-ik-reveal>
            <IkWizard branches={branches} />
          </div>
        </div>
      </section>
    </main>
  );
}
