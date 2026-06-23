import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { BranchGallery } from "@/components/branch-gallery";
import { BranchContactBlock } from "@/components/iletisim/branch-contact-block";
import { ContentCard } from "@/components/layout/content-card";
import { PageHeroMedia } from "@/components/layout/page-hero-media";
import { SectionGrid } from "@/components/layout/section-grid";
import { getBranchBySlug } from "@/content/branches";
import {
  CAMPUS_ROUTE_MAP,
  getBranchSlugFromCampusRoute,
} from "@/lib/campus-routes";
import { BRANCH_MENU_IMAGES } from "@/lib/menu-images";

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
  const slug = getBranchSlugFromCampusRoute(city, campus);
  const branch = slug ? getBranchBySlug(slug) : undefined;
  if (!branch) return { title: "Okullarımız" };
  if (branch.upcoming) {
    return {
      title: branch.name,
      description:
        "Konya — Mevlânâ şubemiz çok yakında açılacak. Ön bilgi almak ve kayıt listesine girmek için bizimle iletişime geçebilirsiniz.",
    };
  }
  return {
    title: branch.name,
    description: `${branch.district}, ${branch.city} — ${branch.levels.join(", ")}`,
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

  const branch = getBranchBySlug(slug);
  if (!branch) notFound();

  const mapsQuery = encodeURIComponent(branch.address);
  const campusImage = BRANCH_MENU_IMAGES[branch.slug];
  const campusMedia = campusImage
    ? {
        src: campusImage,
        type: "image" as const,
        alt: `${branch.district}, ${branch.city} kampüsü`,
      }
    : undefined;

  if (branch.upcoming) {
    return (
      <SectionGrid variant="honey" className="py-fluid-8">
        <article className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Okullarımız</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <h1 className="section-title">{branch.name}</h1>
            <span className="border-charcoal/15 text-charcoal rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase">
              Yakında
            </span>
          </div>
          <p className="section-body mx-auto mt-4 max-w-xl">
            {branch.city} — Çok Yakında
          </p>

          <ContentCard className="mt-10 p-8 sm:p-12">
            <div className="bg-brand-green/20 text-charcoal mx-auto flex size-16 items-center justify-center rounded-full">
              <Clock className="size-8" aria-hidden />
            </div>
            <h2 className="font-cinzel text-charcoal mt-8 text-2xl font-bold tracking-tight sm:text-3xl">
              Konya&apos;da Sultan Rüzgarı Esecek
            </h2>
            <p className="section-body mx-auto mt-4 max-w-lg">
              Konya — Mevlânâ şubemiz çok yakında açılacak. Ön bilgi almak ve
              kayıt listesine girmek için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/iletisim" className="cta-pill">
                Ön Bilgi Talep Et
              </Link>
            </div>
          </ContentCard>

          {campusMedia ? (
            <PageHeroMedia media={campusMedia} priority className="mt-10" />
          ) : null}

          <section className="mt-12 text-left">
            <h2 className="text-charcoal text-lg font-semibold">
              Kayıt listesi ve ön bilgi
            </h2>
            <p className="section-body mt-2">
              Aşağıdaki formda kampüs alanı Konya — Mevlânâ için ön
              doldurulmuştur.
            </p>
            <div className="mt-6">
              <BranchContactBlock branchSlug={branch.slug} />
            </div>
          </section>
        </article>
      </SectionGrid>
    );
  }

  return (
    <SectionGrid variant="white" className="py-fluid-8">
      <article className="max-w-4xl">
        {campusMedia ? <PageHeroMedia media={campusMedia} priority /> : null}
        <p className="section-eyebrow">Okullarımız</p>
        <h1 className="section-title mt-3">{branch.name}</h1>
        <p className="section-body mt-2 text-lg">
          {branch.district} / {branch.city}
        </p>

        {branch.levels.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {branch.levels.map((lv) => (
              <span
                key={lv}
                className="border-brand-green/30 bg-brand-honey/40 text-charcoal rounded-full border px-3 py-1 text-xs font-semibold"
              >
                {lv}
              </span>
            ))}
          </div>
        ) : null}

        <section className="text-charcoal/85 mt-10 space-y-4">
          <h2 className="text-charcoal text-lg font-semibold">İletişim</h2>
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
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/iletisim" className="cta-pill">
              İletişim / ön kayıt
            </Link>
            <a
              className="border-charcoal/15 text-charcoal hover:border-brand-green/40 inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition"
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Haritada aç
            </a>
          </div>
        </section>

        <BranchGallery branch={branch} />

        <section className="border-charcoal/10 mt-12 border-t pt-10">
          <h2 className="text-charcoal text-lg font-semibold">
            Kampüs ile iletişim formu
          </h2>
          <p className="section-body mt-2">
            Aşağıdaki form genel iletişim sunucu eylemini kullanır; kampüs alanı
            bu sayfa için ön doldurulmuştur.
          </p>
          <div className="mt-6">
            <BranchContactBlock branchSlug={branch.slug} />
          </div>
        </section>
      </article>
    </SectionGrid>
  );
}
