import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContentCard } from "@/components/layout/content-card";

export const metadata: Metadata = {
  title: "Sultanda Yaşam",
};

export default function Page() {
  return (
    <PageShell
      title="Sultanda Yaşam"
      intro="Özel Sultan Okulları'nda eğitim; öğrencilerimizin akademik gelişimlerinin yanında kişisel, sosyal ve ahlaki becerilerini de desteklemeyi amaçlar."
    >
      <ContentCard>
        <p className="section-body">
          Özel Sultan Okulları&apos;nda eğitim; öğrencilerimizin akademik
          gelişimlerinin yanında kişisel, sosyal ve ahlaki becerilerini de
          desteklemeyi amaçlar.
        </p>
      </ContentCard>
    </PageShell>
  );
}
