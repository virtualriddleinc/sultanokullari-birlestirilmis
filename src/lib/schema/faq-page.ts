import type { FaqItem, JsonLdObject } from "@/lib/schema/types";

export function buildFaqPageSchema(
  items: FaqItem[],
  pageUrl?: string,
): JsonLdObject {
  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  if (pageUrl) {
    schema.url = pageUrl;
  }

  return schema;
}
