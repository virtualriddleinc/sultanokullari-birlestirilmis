import type { Metadata } from "next";
import { MedyaClient } from "@/components/guncel/medya-client";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Medya",
  description: "Etkinlik ve kampüs medya arşivi.",
};

export default function Page() {
  return (
    <PageShell
      title="Medya"
      intro="Filtre etiketleri şablondur; gerçek medya öğeleri veri kaynağına bağlandığında çoğaltılır."
    >
      <MedyaClient />
    </PageShell>
  );
}
