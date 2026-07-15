import { buildPageMetadata } from "@/lib/seo/metadata";
import { draftMode } from "next/headers";
import {
  kurulusParagraflari,
  kurucuMesajiNotu,
  kurumsalTimeline,
} from "@/content/kurumsal";
import { CmsPageSections } from "@/components/cms/cms-page-sections";
import { PageShell } from "@/components/page-shell";
import { HakkimizdaNav } from "@/components/kurumsal/hakkimizda-nav";
import { getPageBySlug } from "@/lib/pages-data";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { JsonLd } from "@/lib/schema/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  path: "/kurumsal/hakkimizda",
  title: "Hakkımızda",
  description: kurulusParagraflari[0],
});

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode();
  const cmsPage = await getPageBySlug("hakkimizda", { draft: isDraft });
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Kurumsal", path: "/kurumsal/hakkimizda" },
    { name: "Hakkımızda", path: "/kurumsal/hakkimizda" },
  ]);

  if (cmsPage?.sections?.length) {
    return (
      <PageShell
        title={cmsPage.title}
        intro={cmsPage.intro ?? undefined}
      >
        <JsonLd data={breadcrumbs} />
        <HakkimizdaNav />
        <CmsPageSections sections={cmsPage.sections} />
      </PageShell>
    );
  }
  return (
    <PageShell title="Hakkımızda" intro={kurulusParagraflari[0]}>
      <JsonLd data={breadcrumbs} />
      <HakkimizdaNav />

      <section
        id="kimligimiz"
        aria-labelledby="kimligimiz-baslik"
        className="scroll-mt-32"
      >
        <h2
          id="kimligimiz-baslik"
          className="text-lg font-semibold text-[var(--color-primary)]"
        >
          Kimliğimiz
        </h2>
        <div className="mt-4 space-y-4">
          {kurulusParagraflari.map((p, i) => (
            <p key={i} className="text-zinc-700">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section
        id="kurucu-mesaji"
        aria-labelledby="kurucu-baslik"
        className="mt-12 scroll-mt-32"
      >
        <h2
          id="kurucu-baslik"
          className="text-lg font-semibold text-[var(--color-primary)]"
        >
          Kurucu mesajı
        </h2>
        <p className="mt-3 text-sm text-zinc-600">{kurucuMesajiNotu}</p>
      </section>

      <section
        id="zaman-cizelgesi"
        aria-labelledby="zaman-baslik"
        className="mt-12 scroll-mt-32"
      >
        <h2
          id="zaman-baslik"
          className="text-lg font-semibold text-[var(--color-primary)]"
        >
          Zaman çizelgesi
        </h2>
        <ol className="mt-6 space-y-6 border-l-2 border-[var(--color-primary)]/30 pl-6">
          {kurumsalTimeline.map((t) => (
            <li key={t.year} className="relative">
              <span
                className="absolute top-1.5 -left-[calc(0.5rem+6px)] w-3 bg-[var(--color-primary)]"
                style={{
                  aspectRatio: "2 / 1.7320508075688772",
                  clipPath:
                    "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
                }}
                aria-hidden
              />
              <p className="text-xs font-semibold tracking-wide text-[var(--color-primary)] uppercase">
                {t.year}
              </p>
              <p className="mt-1 font-medium text-zinc-900">{t.title}</p>
              <p className="mt-1 text-sm text-zinc-600">{t.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
