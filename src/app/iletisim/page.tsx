import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/iletisim/contact-form";
import { IletisimBranchCards } from "@/components/iletisim/iletisim-branch-cards";
import { IletisimHero } from "@/components/iletisim/iletisim-hero";
import { InstagramGlyph } from "@/components/icons/instagram-glyph";
import { instagramHandle, instagramProfileUrl } from "@/content/instagram";

export const metadata: Metadata = {
  title: "İletişim",
  description: "İletişim formu, şube seçimi ve KVKK onayı.",
};

export default function Page() {
  return (
    <article className="relative">
      <IletisimHero />
      <IletisimBranchCards />

      <section
        id="iletisim-formu"
        className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.32em] text-[var(--color-primary)] uppercase">
                İletişim formu
              </p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance text-zinc-950 sm:text-4xl">
                Soru, ön kayıt veya bilgi talebi göndermek için formu doldurun.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
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
                className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-md"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                  <InstagramGlyph className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.62rem] font-semibold tracking-[0.24em] text-zinc-500 uppercase">
                    Instagram
                  </span>
                  <span className="mt-0.5 block truncate">
                    {instagramHandle}
                  </span>
                </span>
              </Link>

              <a
                href="mailto:info@sultanokullari.com"
                className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-md"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Mail className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.62rem] font-semibold tracking-[0.24em] text-zinc-500 uppercase">
                    E-posta
                  </span>
                  <span className="mt-0.5 block truncate">
                    info@sultanokullari.com
                  </span>
                </span>
              </a>
            </div>

            <div className="rounded-2xl border border-emerald-900/10 bg-[var(--color-primary-light)]/40 p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[var(--color-primary)]">
                  <MessageCircle className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Hızlı yanıt
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-700">
                    Mesai saatleri içinde gelen iletilere genellikle 1 iş günü
                    içinde dönüş yapıyoruz. Acil durumlar için şube
                    telefonlarını arayabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </article>
  );
}
