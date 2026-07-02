import type { Metadata } from "next";
import { kurumsalTimeline } from "@/content/kurumsal";
import { kurumsalKimlikGalleryMedia } from "@/content/site-media";
import { PageShell } from "@/components/page-shell";
import { KurumsalKurulusHikayesi } from "@/components/kurumsal/kurumsal-kurulus-hikayesi";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { KurumsalTimelineSection } from "@/components/kurumsal/kurumsal-timeline-section";
import { PAGE_MEDIA } from "@/lib/menu-images";

export const metadata: Metadata = {
  title: "Kurumsal Kimliğimiz",
  description: "Sultan Okulları kuruluş ve kurumsal kimlik.",
};

export default function Page() {
  return (
    <PageShell
      title="Kurumsal Kimliğimiz"
      intro="İlimde âlim, ibâdette âbid, gayrette mücahit bir neslin yetiştiği çift kanatlı eğitim modeli"
      media={PAGE_MEDIA.kurumsalKimlik}
      mediaLayout="overlay"
    >
      <KurumsalKurulusHikayesi />
      <KurumsalTimelineSection items={kurumsalTimeline} />
      <KurumsalKimlikGalerisi items={kurumsalKimlikGalleryMedia} />
    </PageShell>
  );
}
