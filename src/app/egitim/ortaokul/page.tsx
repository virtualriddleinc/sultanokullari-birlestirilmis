import type { Metadata } from "next";
import { ortaokul } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";

export const metadata: Metadata = {
  title: "Ortaokul",
  description:
    "Ortaokul programı; atölyeler, kulüpler, etüt ve değerler eğitimi.",
};

export default function Page() {
  return (
    <EgitimSegmentShell
      slug="ortaokul"
      title="Ortaokul"
      intro="Kökleri sağlam, teknolojiyi bilinçli kullanan ve topluma yön verecek yiğit gençler."
      quote={ortaokul.quote}
      quoteCitation={ortaokul.quoteCitation}
    >
      <div className="mt-6 space-y-4">
        {ortaokul.paragraflar.map((p, i) => (
          <p key={i} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>
      <p className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
        {ortaokul.etut}
      </p>
      <MediaGallery
        title="Ortaokul galerisi"
        items={educationGalleryMedia.ortaokul}
      />
    </EgitimSegmentShell>
  );
}
