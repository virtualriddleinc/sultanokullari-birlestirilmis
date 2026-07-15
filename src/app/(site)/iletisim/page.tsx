import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "@/components/navigation/site-link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/iletisim/contact-form";
import { IletisimBranchCards } from "@/components/iletisim/iletisim-branch-cards";
import { IletisimHero } from "@/components/iletisim/iletisim-hero";
import { InstagramGlyph } from "@/components/icons/instagram-glyph";
import { iletisimMetinleri } from "@/content/sultanda-yasam";
import { getPublishedBranches } from "@/lib/branches-data";
import { getSiteSettings } from "@/lib/site-settings-data";
import beyazDesen from "@/images/beyaz-desen.svg";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/iletisim",
  title: "İletişim",
  description: iletisimMetinleri.bizeUlasin,
});

export default async function Page() {
  const [branches, settings] = await Promise.all([
    getPublishedBranches(),
    getSiteSettings(),
  ]);
  const instagramHandle = settings.instagramHandle.startsWith("@")
    ? settings.instagramHandle
    : `@${settings.instagramHandle}`;
  const email = settings.footerEmail || iletisimMetinleri.email;
  const phone = settings.footerPhone || iletisimMetinleri.telefon;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <article className="relative">
      <IletisimHero />
      <IletisimBranchCards branches={branches} />

      <section
        id="iletisim-formu"
        className="relative isolate overflow-hidden bg-brand-green py-fluid-8 sm:py-fluid-16"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beyazDesen.src}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none"
        />

        <div className="section-page-grid relative z-[1]">
          <div className="section-page-grid__content">
            <div className="grid gap-fluid-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col gap-fluid-6">
                <div>
                  <p className="text-charcoal/70 text-[length:var(--text-xs)] font-semibold tracking-[0.32em] uppercase">
                    Ön Kayıt / Bilgi Talep Formu
                  </p>
                  <h2 className="text-charcoal mt-fluid-3 text-[length:var(--text-3xl)] leading-tight font-semibold tracking-tight text-balance">
                    Ön Kayıt / Bilgi Talep Formu
                  </h2>
                  <p className="text-charcoal/75 mt-fluid-4 max-w-xl text-[length:var(--text-base)] leading-7">
                    {iletisimMetinleri.onKayit}
                  </p>
                </div>

                <div className="grid gap-fluid-3 md:grid-cols-2">
                  <Link
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border-charcoal/10 group flex min-h-[44px] items-center gap-3 rounded-2xl border bg-white/90 p-4 text-[length:var(--text-sm)] font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-charcoal/20 hover:shadow-md"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                      <InstagramGlyph className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-charcoal/55 block text-[length:var(--text-xs)] font-semibold tracking-[0.24em] uppercase">
                        Instagram
                      </span>
                      <span className="mt-0.5 block truncate">
                        {instagramHandle}
                      </span>
                    </span>
                  </Link>

                  <a
                    href={`mailto:${email}`}
                    className="border-charcoal/10 group flex min-h-[44px] items-center gap-3 rounded-2xl border bg-white/90 p-4 text-[length:var(--text-sm)] font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-charcoal/20 hover:shadow-md"
                  >
                    <span className="bg-brand-honey text-charcoal grid size-10 shrink-0 place-items-center rounded-full">
                      <Mail className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="text-charcoal/55 block text-[length:var(--text-xs)] font-semibold tracking-[0.24em] uppercase">
                        E-posta
                      </span>
                      <span className="mt-0.5 block truncate">{email}</span>
                    </span>
                  </a>
                </div>

                <div className="border-charcoal/10 grid gap-fluid-3 rounded-2xl border bg-brand-honey p-5">
                  <div className="flex items-start gap-3">
                    <span className="bg-brand-green text-charcoal grid size-9 shrink-0 place-items-center rounded-full">
                      <Phone className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-charcoal text-[length:var(--text-sm)] font-semibold">
                        Bize Ulaşın
                      </p>
                      <p className="text-charcoal/75 mt-1 text-[length:var(--text-sm)] leading-6">
                        <a
                          href={telHref}
                          className="font-semibold text-charcoal underline-offset-2 hover:underline"
                        >
                          {phone}
                        </a>
                        {" · "}
                        <a
                          href={`mailto:${email}`}
                          className="font-semibold text-charcoal underline-offset-2 hover:underline"
                        >
                          {email}
                        </a>
                      </p>
                      <p className="text-charcoal/75 mt-1 text-[length:var(--text-sm)] leading-6">
                        Hafta içi {iletisimMetinleri.calismaSaatleri.haftaIci}
                        {" · "}
                        Cumartesi {iletisimMetinleri.calismaSaatleri.cumartesi}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-brand-green text-charcoal grid size-9 shrink-0 place-items-center rounded-full">
                      <MessageCircle className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-charcoal text-[length:var(--text-sm)] font-semibold">
                        Yol Tarifi
                      </p>
                      <p className="text-charcoal/75 mt-1 text-[length:var(--text-sm)] leading-6">
                        {iletisimMetinleri.yolTarifi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <ContactForm branches={branches} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
