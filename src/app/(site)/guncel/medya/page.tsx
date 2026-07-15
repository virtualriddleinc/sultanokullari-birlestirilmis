import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { MedyaClient } from "@/components/guncel/medya-client";
import { PageShell } from "@/components/page-shell";
import { getPublishedMediaItems } from "@/lib/media-items-data";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/guncel/medya",
  title: "Medya",
  description: "Etkinlik ve kampüs medya arşivi.",
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const items = await getPublishedMediaItems({ draft: isDraft });

  return (
    <PageShell
      title="Medya"
      intro="Kampüs, etkinlik ve okul yaşamından seçilen fotoğraf ve videolar."
    >
      <MedyaClient items={items} />
    </PageShell>
  );
}
