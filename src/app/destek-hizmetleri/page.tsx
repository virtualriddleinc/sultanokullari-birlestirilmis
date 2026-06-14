import type { Metadata } from "next";
import { DestekTabs } from "@/components/destek/destek-tabs";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Destek hizmetleri",
  description: "Yemekhane, güvenlik, kıyafet.",
};

export default function Page() {
  return (
    <PageShell
      title="Destek hizmetleri"
      intro="Yemekhane, güvenlik ve kıyafet hizmetleri."
    >
      <DestekTabs />
    </PageShell>
  );
}
