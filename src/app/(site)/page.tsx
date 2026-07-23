import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { HeroSection } from "@/features/hero/hero-section";
import { MissionCounters } from "@/components/home/mission-counters";
import { getHomePageData } from "@/lib/home-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

const HomeJourney = dynamic(() =>
  import("@/components/home/home-journey").then((m) => m.HomeJourney),
);
const HomeNedenPreview = dynamic(() =>
  import("@/components/home/home-neden-preview").then((m) => m.HomeNedenPreview),
);
const HomeVideo = dynamic(() =>
  import("@/components/home/home-video").then((m) => m.HomeVideo),
);
const HomeYemekhane = dynamic(() =>
  import("@/components/home/home-yemekhane").then((m) => m.HomeYemekhane),
);
const HomeBranchesShowcase = dynamic(() =>
  import("@/components/home/home-branches-showcase").then(
    (m) => m.HomeBranchesShowcase,
  ),
);
const HomeGuncel = dynamic(() =>
  import("@/components/home/home-guncel").then((m) => m.HomeGuncel),
);
const HomeInstagramHorizontal = dynamic(() =>
  import("@/components/home/home-instagram-horizontal").then(
    (m) => m.HomeInstagramHorizontal,
  ),
);
const HomeQuickLinks = dynamic(() =>
  import("@/components/home/home-quick-links").then((m) => m.HomeQuickLinks),
);

export const revalidate = 120;

export const metadata: Metadata = buildPageMetadata({
  title: "Ana sayfa",
  description:
    "Sultan Okulları — köklerine bağlı, fennî ve İslâmî ilimlerle donanmış nesiller için eğitim. Nebevî eğitim, ayakkabısız okul, butik sınıflar.",
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
