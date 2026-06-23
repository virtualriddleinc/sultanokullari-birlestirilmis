import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProviders } from "@/components/ui/motion-providers";
import beyazDesen from "@/images/beyaz-desen.svg";
import "./globals.css";

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

const siteUrl = process.env.SITE_URL ?? "https://sultanokullari.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sultan Okulları",
    template: "%s | Sultan Okulları",
  },
  description:
    "Sultan Okulları — milli ve manevi değerlerle bütünleşik eğitim. Anaokulu, ilkokul ve ortaokul programları.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Sultan Okulları",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans antialiased">
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
          <SiteHeader />
          <main className="relative z-[1] flex w-full min-w-0 flex-1 flex-col overflow-x-clip">
            {children}
          </main>
          <SiteFooter />
        </MotionProviders>
      </body>
    </html>
  );
}
