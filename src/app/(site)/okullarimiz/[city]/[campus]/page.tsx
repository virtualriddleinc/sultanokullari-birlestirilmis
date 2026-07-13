import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { WhatsAppContactButton } from "@/components/branch/whatsapp-contact-button";
import { BranchContactBlock } from "@/components/iletisim/branch-contact-block";
import { ContentCard } from "@/components/layout/content-card";
import { PageDividerSection } from "@/components/layout/page-divider-heading";
import { PageStorySection } from "@/components/layout/page-story-section";
import { PageShell } from "@/components/page-shell";
import { KurumsalKimlikGalerisi } from "@/components/kurumsal/kurumsal-kimlik-galeri";
import { SectionGrid } from "@/components/layout/section-grid";
import type { Branch } from "@/content/branches";
import { getBranchBySlugFromCms } from "@/lib/branches-data";
import {
  CAMPUS_ROUTE_MAP,
  getBranchSlugFromCampusRoute,
  getCampusRouteFromBranch,
} from "@/lib/campus-routes";
import { BRANCH_MENU_IMAGES } from "@/lib/menu-images";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildSchoolSchema } from "@/lib/schema/school";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.entries(CAMPUS_ROUTE_MAP).flatMap(([city, campuses]) =>
    Object.keys(campuses).map((campus) => ({ city, campus })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; campus: string }>;
}): Promise<Metadata> {
  const { city, campus } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const slug = getBranchSlugFromCampusRoute(city, campus);
  const branch = slug
    ? await getBranchBySlugFromCms(slug, { draft: isDraft })
    : undefined;
  if (!branch) return { title: "Okullarımız" };

  const path = getCampusRouteFromBranch(branch);
  const description = branch.upcoming
    ? "Konya — Mevlânâ şubemiz çok yakında açılacak. Ön bilgi almak ve kayıt listesine girmek için bizimle iletişime geçebilirsiniz."
    : `${branch.district}, ${branch.city} — ${branch.levels.join(", ")}`;

  return buildPageMetadata({
    title: branch.name,
    description,
    path,
    image: branch.previewMedia?.src ?? BRANCH_MENU_IMAGES[branch.slug],
  });
}

function branchStory(branch: Branch) {
  return {
    eyebrow: "Okullarımız",
    motto: `${branch.district} kampüsünde Sultan eğitim modeli`,
    rows: [
      {
        eyebrow: "Adres",
        text: branch.address,
        highlights: [branch.district, branch.city],
      },
      ...(branch.levels.length > 0
        ? [
            {
              eyebrow: "Kademeler",
              text: branch.levels.join(", "),
              highlights: [...branch.levels],
            },
          ]
        : []),
    ],
  };
}

export default async function CampusPage({
  params,
}: {
  params: Promise<{ city: string; campus: string }>;
}) {
  const { city, campus } = await params;
  const slug = getBranchSlugFromCampusRoute(city, campus);
  if (!slug) notFound();

  const { isEnabled: isDraft } = await draftMode();
  const branch = await getBranchBySlugFromCms(slug, { draft: isDraft });
  if (!branch) notFound();

  const mapsQuery = encodeURIComponent(branch.address);
  const campusImage =
    branch.previewMedia?.src ?? BRANCH_MENU_IMAGES[branch.slug];
  const campusMedia = campusImage
    ? {
        src: campusImage,
        type: "image" as const,
        alt: `${branch.district}, ${branch.city} kampüsü`,
      }
    : undefined;
  const campusPath = getCampusRouteFromBranch(branch);
  const structuredData = [
    buildSchoolSchema(branch),
    buildBreadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Okullarımız", path: "/#okullarimiz" },
      { name: branch.name, path: campusPath },
    ]),
  ];
  const story = branchStory(branch);

  if (branch.upcoming) {
    return (
      <>
        <JsonLd data={structuredData} />
        <SectionGrid variant="honey" className="py-fluid-8">
          <article className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow">Okullarımız</p>
            <div className="mt-fluid-4 flex flex-wrap items-center justify-center gap-fluid-3">
              <h1 className="section-title">{branch.name}</h1>
              <span className="border-charcoal/15 text-charcoal inline-flex min-h-[44px] items-center rounded-full border bg-white/80 px-fluid-3 text-[length:var(--text-xs)] font-semibold tracking-[0.22em] uppercase">
                Yakında
              </span>
            </div>
            <p className="section-body mx-auto mt-fluid-4 max-w-xl">
              {branch.city} — Çok Yakında
            </p>

            <ContentCard className="mt-fluid-8 p-fluid-8 md:p-fluid-12">
              <div className="bg-brand-green/20 text-charcoal mx-auto flex size-16 items-center justify-center rounded-full">
                <Clock className="size-8" aria-hidden />
              </div>
              <h2 className="font-cinzel text-charcoal mt-fluid-8 text-[length:var(--text-2xl)] font-bold tracking-tight md:text-[length:var(--text-3xl)]">
                Konya&apos;da Sultan Rüzgarı Esecek
              </h2>
              <p className="section-body mx-auto mt-fluid-4 max-w-lg">
                Konya — Mevlânâ şubemiz çok yakında açılacak. Ön bilgi almak ve
                kayıt listesine girmek için bizimle iletişime geçebilirsiniz.
              </p>
              <div className="mt-fluid-8 flex flex-wrap items-center justify-center gap-fluid-3">
                <Link href="/iletisim" className="cta-pill">
                  Ön Bilgi Talep Et
                </Link>
              </div>
            </ContentCard>

            <section className="mt-fluid-12 text-left">
              <h2 className="text-charcoal text-[length:var(--text-lg)] font-semibold">
                Kayıt listesi ve ön bilgi
              </h2>
              <p className="section-body mt-fluid-2">
                Aşağıdaki formda kampüs alanı Konya — Mevlânâ için ön
                doldurulmuştur.
              </p>
              <div className="mt-fluid-6">
                <BranchContactBlock branchSlug={branch.slug} />
              </div>
            </section>
          </article>
        </SectionGrid>
      </>
    );
  }

  return (
    <>
      <JsonLd data={structuredData} />
      <PageShell
        title={branch.name}
        intro={`${branch.district} / ${branch.city}`}
        media={campusMedia}
        mediaLayout="overlay"
      >
        <PageStorySection
          eyebrow={story.eyebrow}
          motto={story.motto}
          rows={story.rows}
        />

        <PageDividerSection id="iletisim-baslik" title="İletişim">
          <div className="text-charcoal/85 mt-fluid-8 space-y-fluid-4">
            <p>
              <span className="text-charcoal font-medium">Adres:</span>{" "}
              {branch.address}
            </p>
            <p>
              <span className="text-charcoal font-medium">Telefon:</span>{" "}
              <a
                className="text-charcoal hover:underline"
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
              >
                {branch.phone}
              </a>
            </p>
            <div className="flex flex-wrap gap-fluid-3 pt-fluid-2">
              <a href="#iletisim-formu-baslik" className="cta-pill">
                İletişim / ön kayıt
              </a>
              <a
                className="border-charcoal/15 text-charcoal hover:border-brand-green/40 inline-flex min-h-[44px] items-center rounded-full border px-fluid-4 text-[length:var(--text-sm)] font-semibold transition"
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Haritada aç
              </a>
              <WhatsAppContactButton phone={branch.phone} />
            </div>
          </div>
        </PageDividerSection>

        {branch.gallery.length > 0 ? (
          <KurumsalKimlikGalerisi
            title="Görsel Galeri"
            description="Okulumuzdan seçilen fotoğraf ve video görüntüleri. Büyütmek için bir görsele dokunun."
            items={branch.gallery}
          />
        ) : null}

        <PageDividerSection
          id="iletisim-formu-baslik"
          className="scroll-mt-32"
          title="Kampüs ile iletişim formu"
          description="Aşağıdaki form genel iletişim sunucu eylemini kullanır; kampüs alanı bu sayfa için ön doldurulmuştur."
        >
          <div className="mt-fluid-8">
            <BranchContactBlock branchSlug={branch.slug} />
          </div>
        </PageDividerSection>
      </PageShell>
    </>
  );
}
