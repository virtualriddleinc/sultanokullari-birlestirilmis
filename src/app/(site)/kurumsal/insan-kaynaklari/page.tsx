import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";
import { ikGirisNotu } from "@/content/kurumsal";
import { IkHumanResourcesPage } from "@/components/kurumsal/ik-human-resources-page";
import { getPublishedBranches } from "@/lib/branches-data";

export const metadata = buildPageMetadata({
  path: "/kurumsal/insan-kaynaklari",
  title: "İnsan kaynakları",
  description:
    "Sultan Okulları öğretmen, idari ekip ve personel başvuru sayfası.",
});

export default async function Page() {
  const branches = await getPublishedBranches();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Kurumsal", path: "/kurumsal/hakkimizda" },
    { name: "İnsan Kaynakları", path: "/kurumsal/insan-kaynaklari" },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <IkHumanResourcesPage intro={ikGirisNotu} branches={branches} />
    </>
  );
}
