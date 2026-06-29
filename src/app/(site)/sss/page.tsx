import type { Metadata } from "next";

import { SssAccordion } from "@/components/geo/sss-accordion";
import { PageShell } from "@/components/page-shell";
import { ALL_SSS_ITEMS } from "@/content/sss";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildFaqPageSchema } from "@/lib/schema/faq-page";
import { JsonLd } from "@/lib/schema/JsonLd";
import { absoluteUrl } from "@/lib/seo/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Sık sorulan sorular",
  description:
    "Sultan Okulları kayıt, eğitim programı, burs, kampüsler ve günlük okul hayatı hakkında sık sorulan sorular.",
  path: "/sss",
});

export default function SssPage() {
  const faqSchema = buildFaqPageSchema(ALL_SSS_ITEMS, absoluteUrl("/sss"));

  return (
    <>
      <JsonLd data={faqSchema} />
      <PageShell
        title="Sık sorulan sorular"
        intro="Kayıt, eğitim modeli, kampüsler ve okul hayatı hakkında en çok sorulan soruların yanıtları."
      >
        <SssAccordion />
      </PageShell>
    </>
  );
}
