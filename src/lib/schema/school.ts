import type { CmsBranch } from "@/lib/branches-data";
import { getCampusRouteFromBranch } from "@/lib/campus-routes";
import { absoluteUrl } from "@/lib/seo/site-url";
import type { JsonLdObject } from "@/lib/schema/types";

export function buildSchoolSchema(branch: CmsBranch): JsonLdObject {
  const path = getCampusRouteFromBranch(branch);
  const pageUrl = absoluteUrl(path);

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": ["School", "LocalBusiness", "EducationalOrganization"],
    "@id": `${pageUrl}#school`,
    name: branch.name,
    url: pageUrl,
    parentOrganization: {
      "@type": "Organization",
      "@id": absoluteUrl("#organization"),
      name: "Sultan Okulları",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.district,
      addressRegion: branch.city,
      addressCountry: "TR",
    },
    telephone: branch.phone.replace(/\s/g, ""),
  };

  if (branch.levels.length) {
    schema.educationalLevel = branch.levels;
  }

  if (branch.upcoming) {
    schema.description =
      "Konya — Mevlânâ şubemiz çok yakında açılacak. Ön bilgi için iletişime geçebilirsiniz.";
  }

  if (branch.previewMedia?.src) {
    schema.image = absoluteUrl(branch.previewMedia.src);
  }

  return schema;
}
