import type { SiteEventDetail } from "@/lib/guncel-data";
import { absoluteUrl, resolveMediaUrl } from "@/lib/seo/site-url";
import type { JsonLdObject } from "@/lib/schema/types";

export function buildEventSchema(event: SiteEventDetail): JsonLdObject {
  const pageUrl = absoluteUrl(`/guncel/etkinlikler/${event.slug}`);

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.excerpt,
    startDate: event.date,
    url: pageUrl,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      "@id": absoluteUrl("#organization"),
      name: "Sultan Okulları",
    },
    inLanguage: "tr-TR",
  };

  const image = resolveMediaUrl(event.featuredImageUrl);
  if (image) {
    schema.image = image;
  }

  return schema;
}
