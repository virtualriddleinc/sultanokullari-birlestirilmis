import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { hafizlik } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { getPageByPath } from "@/lib/pages-data";

export const dynamic = "force-dynamic";

const FALLBACK_INTRO = hafizlik.intro[0];

export const metadata: Metadata = {
  title: "Kur’an-ı Kerim ve Hafızlık Eğitimi",
  description: hafizlik.intro[0],
};

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "hafizlik", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Kur’an-ı Kerim ve Hafızlık Eğitimi",
    intro: FALLBACK_INTRO,
    story: {
      eyebrow: "Kur’an-ı Kerim ve Hafızlık Eğitimi",
      motto: hafizlik.quote,
      rows: hafizlik.intro.map((text, i) => ({
        eyebrow: i === 0 ? "Program" : "Gayemiz",
        text,
        highlights: [],
      })),
    },
    gallery: {
      title: "Görsel Galeri",
      description: "",
      items: educationGalleryMedia.hafizlik,
    },
  });

  return (
    <EgitimSegmentShell
      slug="hafizlik"
      title={content.title}
      intro={content.intro ?? FALLBACK_INTRO}
      quote={hafizlik.quote}
      media={toPageMedia(content.heroMedia)}
    >
      <div className="mt-6 space-y-4">
        {content.story.rows.map((row, i) => (
          <p key={i} className="text-zinc-700">
            {row.text}
          </p>
        ))}
      </div>
      <PedagojiSection items={hafizlik.accordion} theme="emerald" />
      <p className="mt-6 text-sm text-zinc-500">{hafizlik.not}</p>
      <MediaGallery
        title={content.gallery.title}
        items={content.gallery.items}
      />
    </EgitimSegmentShell>
  );
}
