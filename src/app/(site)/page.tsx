import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { HeroSection } from "@/features/hero/hero-section";
import { HomeBranchesShowcase } from "@/components/home/home-branches-showcase";
import { HomeGuncel } from "@/components/home/home-guncel";
import { HomeInstagramHorizontal } from "@/components/home/home-instagram-horizontal";
import { HomeJourney } from "@/components/home/home-journey";
import { HomeNedenPreview } from "@/components/home/home-neden-preview";
import { HomeQuickLinks } from "@/components/home/home-quick-links";
import { HomeVideo } from "@/components/home/home-video";
import { HomeYemekhane } from "@/components/home/home-yemekhane";
import { MissionCounters } from "@/components/home/mission-counters";
import { getHomePageData } from "@/lib/home-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Ana sayfa",
  description:
    "Sultan Okulları — köklerine bağlı, fennî ve İslami ilimlerle donanmış nesiller için eğitim. Nebevî eğitim, ayakkabısız okul, butik sınıflar.",
  path: "/",
});

export default async function HomePage() {
  const { isEnabled: isDraft } = await draftMode();
  const home = await getHomePageData({ draft: isDraft });

  return (
    <>
      <HeroSection slides={home.heroSlides} />
      <MissionCounters {...home.mission} />
      <HomeJourney headline={home.journey.headline} chapters={home.journey.chapters} />
      <HomeNedenPreview {...home.neden} />
      <HomeVideo {...home.videoSection} />
      <HomeYemekhane {...home.yemekhaneSection} />
      <HomeBranchesShowcase {...home.branchesSection} />
      <HomeGuncel {...home.guncelSection} />
      <HomeInstagramHorizontal {...home.instagramSection} />
      <HomeQuickLinks {...home.quickLinksSection} />
    </>
  );
}
