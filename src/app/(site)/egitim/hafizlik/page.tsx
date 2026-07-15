import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import { hafizlik } from "@/content/egitim";
import { EgitimSegmentShell } from "@/components/egitim/egitim-segment-shell";
import { PedagojiSection } from "@/components/egitim/pedagoji-section";
import { MediaGallery } from "@/components/media/media-gallery";
import { educationGalleryMedia } from "@/content/site-media";
import { mapCmsOverlayContent, toPageMedia } from "@/lib/cms-overlay";
import { getPageByPath } from "@/lib/pages-data";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

const FALLBACK_INTRO =
  "Mescid-rahle usulüyle Otağ-ı Hümâyun’umuzda Hamele-i Kur’an’lar yetiştiriyoruz; Vahyin gölgesinde hâfız bir nesil.";

export const metadata = buildPageMetadata({
  path: "/egitim/hafizlik",
  title: "Hâfızlık Eğitimi",
  description:
    "Otağ-ı Hümâyun’umuzda mescid-rahle usulüyle anaokulundan başlayıp ilkokulda taçlanan hâfızlık programı.",
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageByPath("egitim", "hafizlik", { draft: isDraft });
  const content = mapCmsOverlayContent(cmsPage, {
    title: "Hâfızlık Eğitimi",
    intro: FALLBACK_INTRO,
    story: {
      eyebrow: "Hâfızlık",
      motto: "Vahyin gölgesinde hâfız bir nesil",
      rows: hafizlik.intro.map((text, i) => ({
        eyebrow: i === 0 ? "Program" : undefined,
        text,
        highlights: [],
      })),
    },
    gallery: {
      title: "Hâfızlık galerisi",
      description: "",
      items: educationGalleryMedia.hafizlik,
    },
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Eğitim", path: "/egitim/kademeler" },
    { name: "Hâfızlık Eğitimi", path: "/egitim/hafizlik" },
  ]);
  return (
    <EgitimSegmentShell
      slug="hafizlik"
      title={content.title}
      intro={content.intro ?? FALLBACK_INTRO}
      quote={hafizlik.quote}
      media={toPageMedia(content.heroMedia)}
    >
      <JsonLd data={breadcrumbs} />
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
