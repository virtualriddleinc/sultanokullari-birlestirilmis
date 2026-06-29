import type { Metadata } from "next";
import { ilkokul } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";

export const metadata: Metadata = {
  title: "İlkokul",
  description:
    "İlkokul programı; akademik ve manevi gelişim, yapılandırmacı yaklaşım.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="ilkokul"
      title="İlkokul"
      intro="Okuma sevgisi, milli ve manevi değerler, Kur’an ve siyer dersleriyle güçlü temeller."
      quote={ilkokul.quote}
      quoteCitation={ilkokul.quoteCitation}
    >
      <div className="mt-6 space-y-4">
        {ilkokul.paragraflar.map((p, i) => (
          <p key={i} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>
      <p className="mt-8 text-sm text-zinc-500">{ilkokul.takvimNotu}</p>
      <MediaGallery
        title="İlkokul galerisi"
        items={educationGalleryMedia.ilkokul}
      />
    </EgitimSegmentShell>
  );
}
