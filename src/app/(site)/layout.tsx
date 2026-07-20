import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { draftMode } from "next/headers";
import { SiteFooter } from "@/components/site-footer";
import { InfoRequestModal } from "@/components/home/info-request-modal";
import { HashAnchorScroll } from "@/components/layout/hash-anchor-scroll";
import { PreventTopOverscroll } from "@/components/layout/prevent-top-overscroll";
import { RouteReadySignal } from "@/components/layout/route-ready-signal";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { MotionProviders } from "@/components/ui/motion-providers";
import { getPublishedBranches } from "@/lib/branches-data";
import { getInfoModalData } from "@/lib/home-data";
import { PayloadRefreshOnSave } from "@/components/payload/RefreshOnSave";
import { getRootMetadata } from "@/lib/seo/metadata";
import { buildOrganizationGraph } from "@/lib/schema/organization";
import { JsonLd } from "@/lib/schema/JsonLd";
import { getNavSectionsWithCms } from "@/lib/navigation-data";
import { getSiteSettings } from "@/lib/site-settings-data";
import { iletisimMetinleri } from "@/content/sultanda-yasam";
import beyazDesen from "@/images/beyaz-desen.svg";
import "./globals.css";

const FALLBACK_BRANCH_PHONE = "0506 057 60 72";

export const dynamic = "force-dynamic";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return getRootMetadata(settings.defaultOgImageUrl);
}

function buildSameAs(settings: Awaited<ReturnType<typeof getSiteSettings>>): string[] {
  const links = new Set<string>();
  if (settings.instagramUrl) links.add(settings.instagramUrl);
  for (const link of settings.socialLinks) {
    if (link.href) links.add(link.href);
  }
  return [...links];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraft } = await draftMode();
  const [branches, settings, infoModal, navSections] = await Promise.all([
    getPublishedBranches(),
    getSiteSettings(),
    getInfoModalData({ draft: isDraft }),
    getNavSectionsWithCms(),
  ]);
  const organizationSchema = buildOrganizationGraph({
    sameAs: buildSameAs(settings),
    branches,
  });
  const whatsappPhone =
    settings.footerPhone?.trim() ||
    iletisimMetinleri.telefon ||
    branches[0]?.phone?.trim() ||
    FALLBACK_BRANCH_PHONE;

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans antialiased">
        <JsonLd data={organizationSchema} />
        {recaptchaSiteKey ? (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
            strategy="lazyOnload"
          />
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beyazDesen.src}
            alt=""
            className="absolute top-1/2 left-1/2 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.06] select-none"
          />
        </div>

        <MotionProviders>
          <PreventTopOverscroll />
          <HashAnchorScroll />
          <RouteReadySignal />
          <PayloadRefreshOnSave enabled={isDraft} />
          <InfoRequestModal {...infoModal} />
          <SiteHeader sections={navSections} />
          <main className="relative z-[1] flex w-full min-w-0 flex-1 flex-col overflow-x-clip">
            {children}
          </main>
          <SiteFooter
            branches={branches}
            settings={settings}
            sections={navSections}
          />
          <WhatsAppFab phone={whatsappPhone} />
        </MotionProviders>
      </body>
    </html>
  );
}
