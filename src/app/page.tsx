import type { Metadata } from "next";
import { HeroSection } from "@/features/hero/hero-section";
import { HomeBranchesShowcase } from "@/components/home/home-branches-showcase";
import { HomeGuncel } from "@/components/home/home-guncel";
import { HomeInstagramHorizontal } from "@/components/home/home-instagram-horizontal";
import { HomeJourney } from "@/components/home/home-journey";
import { HomeNedenPreview } from "@/components/home/home-neden-preview";
import { HomeQuickLinks } from "@/components/home/home-quick-links";
import { HomeVideo } from "@/components/home/home-video";
import { InfoRequestModal } from "@/components/home/info-request-modal";
import { MissionCounters } from "@/components/home/mission-counters";

export const metadata: Metadata = {
  title: "Ana sayfa",
  description:
    "Sultan Okulları — köklerine bağlı, fenni ve İslami ilimlerle donanmış nesiller için eğitim. Nebevî eğitim, ayakkabısız okul, butik sınıflar.",
};

export default function HomePage() {
  return (
    <>
      <InfoRequestModal />
      <HeroSection />
      <MissionCounters />
      <HomeJourney />
      <HomeNedenPreview />
      <HomeVideo />
      <HomeBranchesShowcase />
      <HomeGuncel />
      <HomeInstagramHorizontal />
      <HomeQuickLinks />
    </>
  );
}
