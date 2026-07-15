import type { CmsBranch } from "@/lib/branches-data";
import { getCampusRouteFromBranch } from "@/lib/campus-routes";
import { absoluteUrl } from "@/lib/seo/site-url";
import type { JsonLdObject } from "@/lib/schema/types";

const ORG_ID = "#organization";
const WEBSITE_ID = "#website";

export function buildOrganizationGraph(options: {
  sameAs?: string[];
  branches?: CmsBranch[];
}): JsonLdObject {
  const sameAs = (options.sameAs ?? []).filter(Boolean);
  const branches = options.branches ?? [];

  const subOrganizations = branches
    .filter((b) => b.citySlug && b.campusSlug)
    .map((b) => ({
      "@type": "School",
      "@id": absoluteUrl(`${getCampusRouteFromBranch(b)}#school`),
      name: b.name,
      url: absoluteUrl(getCampusRouteFromBranch(b)),
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "EducationalOrganization", "School"],
        "@id": absoluteUrl(ORG_ID),
        name: "Sultan Okulları",
        alternateName: "Özel Sultan Okulları",
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.svg"),
        },
        description:
          "Milli ve Mânevî değerlerle bütünleşik eğitim. Anaokulu, ilkokul ve ortaokul programları.",
        foundingDate: "2017",
        email: "info@sultanokullari.com",
        contactPoint: {
          "@type": "ContactPoint",
          email: "info@sultanokullari.com",
          contactType: "customer support",
          availableLanguage: "Turkish",
          areaServed: "TR",
        },
        areaServed: [
          { "@type": "City", name: "İstanbul" },
          { "@type": "City", name: "Kocaeli" },
          { "@type": "City", name: "Sakarya" },
          { "@type": "City", name: "Ankara" },
          { "@type": "City", name: "Konya" },
        ],
        sameAs,
        educationalLevel: ["Preschool", "Primary Education", "Middle School"],
        knowsAbout: [
          "Değerler Eğitimi",
          "Nebevî Eğitim",
          "Sultan Mektebi Modeli",
          "Çift Yabancı Dil",
          "Hâfızlık Eğitimi",
        ],
        ...(subOrganizations.length ? { subOrganization: subOrganizations } : {}),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl(WEBSITE_ID),
        url: absoluteUrl("/"),
        name: "Sultan Okulları",
        publisher: { "@id": absoluteUrl(ORG_ID) },
        inLanguage: "tr-TR",
      },
    ],
  };
}
