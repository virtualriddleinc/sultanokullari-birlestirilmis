import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/iletisim/contact-form";
import { IletisimBranchCards } from "@/components/iletisim/iletisim-branch-cards";
import { IletisimHero } from "@/components/iletisim/iletisim-hero";
import { InstagramGlyph } from "@/components/icons/instagram-glyph";
import { instagramHandle, instagramProfileUrl } from "@/content/instagram";
import { getPublishedBranches } from "@/lib/branches-data";
import beyazDesen from "@/images/beyaz-desen.svg";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İletişim",
  description: "İletişim formu, şube seçimi ve KVKK onayı.",
};

export default async function Page() {
  const branches = await getPublishedBranches();

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

        <div className="relative z-[1] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-charcoal/70 text-xs font-semibold tracking-[0.32em] uppercase">
                  İletişim formu
                </p>
                <h2 className="text-charcoal mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
                  Soru, ön kayıt veya bilgi talebi göndermek için formu doldurun.
                </h2>
                <p className="text-charcoal/75 mt-4 max-w-xl text-base leading-7">
                  Mesajlar sunucuda doğrulanır; üretim ortamında e-posta veya CRM
                  entegrasyonu etkinleştirildiğinde size en kısa sürede dönüş
                  yapılacaktır. Şube seçimi isteğe bağlıdır.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={instagramProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border-charcoal/10 group flex items-center gap-3 rounded-2xl border bg-white/90 p-4 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-charcoal/20 hover:shadow-md"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                    <InstagramGlyph className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-charcoal/55 block text-[0.62rem] font-semibold tracking-[0.24em] uppercase">
                      Instagram
                    </span>
                    <span className="mt-0.5 block truncate">
                      {instagramHandle}
                    </span>
                  </span>
                </Link>

                <a
                  href="mailto:info@sultanokullari.com"
                  className="border-charcoal/10 group flex items-center gap-3 rounded-2xl border bg-white/90 p-4 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:border-charcoal/20 hover:shadow-md"
                >
                  <span className="bg-brand-honey text-charcoal grid size-10 shrink-0 place-items-center rounded-full">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="text-charcoal/55 block text-[0.62rem] font-semibold tracking-[0.24em] uppercase">
                      E-posta
                    </span>
                    <span className="mt-0.5 block truncate">
                      info@sultanokullari.com
                    </span>
                  </span>
                </a>
              </div>

              <div className="border-charcoal/10 rounded-2xl border bg-brand-honey p-5">
                <div className="flex items-start gap-3">
                  <span className="bg-brand-green text-charcoal grid size-9 shrink-0 place-items-center rounded-full">
                    <MessageCircle className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-charcoal text-sm font-semibold">
                      Hızlı yanıt
                    </p>
                    <p className="text-charcoal/75 mt-1 text-sm leading-6">
                      Mesai saatleri içinde gelen iletilere genellikle 1 iş günü
                      içinde dönüş yapıyoruz. Acil durumlar için şube
                      telefonlarını arayabilirsiniz.
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
      </section>
    </article>
  );
}
