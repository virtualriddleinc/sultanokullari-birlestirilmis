import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
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
import { LivePreviewBridge } from "@/components/payload/live-preview-bridge";
import { getRootMetadata } from "@/lib/seo/metadata";
import { buildOrganizationGraph } from "@/lib/schema/organization";
import { JsonLd } from "@/lib/schema/JsonLd";
import { getNavSectionsWithCms } from "@/lib/navigation-data";
import { getSiteSettings } from "@/lib/site-settings-data";
import { iletisimMetinleri } from "@/content/sultanda-yasam";
import { SitePatternOverlay } from "@/components/layout/site-pattern-overlay";
import "./globals.css";

const FALLBACK_BRANCH_PHONE = "0506 057 60 72";

/** Yayınlanmış içerik ISR — draftMode layout'ta çağrılmaz (dinamik kilidi kırar). */
export const revalidate = 120;

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
  const [branches, settings, infoModal, navSections] = await Promise.all([
    getPublishedBranches(),
    getSiteSettings(),
    getInfoModalData({ draft: false }),
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
          <SitePatternOverlay opacity={0.06} />
        </div>

        <MotionProviders>
          <PreventTopOverscroll />
          <HashAnchorScroll />
          <RouteReadySignal />
          <Suspense fallback={null}>
            <LivePreviewBridge />
          </Suspense>
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
