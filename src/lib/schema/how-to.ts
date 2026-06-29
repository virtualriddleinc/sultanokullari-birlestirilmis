import { absoluteUrl } from "@/lib/seo/site-url";
import type { HowToStep, JsonLdObject } from "@/lib/schema/types";

export function buildHowToSchema(options: {
  name: string;
  description: string;
  steps: HowToStep[];
  path?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    ...(options.path ? { url: absoluteUrl(options.path) } : {}),
    step: options.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
