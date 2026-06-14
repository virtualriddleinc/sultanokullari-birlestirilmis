import type { Metadata } from "next";
import { ikGirisNotu } from "@/content/kurumsal";
import { IkHumanResourcesPage } from "@/components/kurumsal/ik-human-resources-page";

export const metadata: Metadata = {
  title: "İnsan kaynakları",
  description:
    "Sultan Okulları öğretmen, idari ekip ve personel başvuru sayfası.",
};

export default function Page() {
  return <IkHumanResourcesPage intro={ikGirisNotu} />;
}
