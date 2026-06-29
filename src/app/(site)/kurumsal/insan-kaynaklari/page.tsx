import type { Metadata } from "next";
import { ikGirisNotu } from "@/content/kurumsal";
import { IkHumanResourcesPage } from "@/components/kurumsal/ik-human-resources-page";
import { getPublishedBranches } from "@/lib/branches-data";

export const metadata: Metadata = {
  title: "İnsan kaynakları",
  description:
    "Sultan Okulları öğretmen, idari ekip ve personel başvuru sayfası.",
};

export default async function Page() {
  const branches = await getPublishedBranches();
  return <IkHumanResourcesPage intro={ikGirisNotu} branches={branches} />;
}
