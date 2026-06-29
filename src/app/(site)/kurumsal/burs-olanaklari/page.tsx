import type { Metadata } from "next";
import { bursGiris, bursIndirimleri } from "@/content/burs";
import { BURS_FAQ_ITEMS, BURS_HOWTO_STEPS } from "@/content/sss";
import { CmsPageSections } from "@/components/cms/cms-page-sections";
import { PageFaqSection } from "@/components/geo/page-faq-section";
import { PageShell } from "@/components/page-shell";
import { getPageBySlug } from "@/lib/pages-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildFaqPageSchema } from "@/lib/schema/faq-page";
import { buildHowToSchema } from "@/lib/schema/how-to";
import { JsonLd } from "@/lib/schema/JsonLd";
import { absoluteUrl } from "@/lib/seo/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Burs olanakları",
  description:
    "Akademik başarı ve ihtiyaç temelli burs; özel indirim oranları.",
  path: "/kurumsal/burs-olanaklari",
});

function BursStructuredData() {
  const path = "/kurumsal/burs-olanaklari";
  return (
    <JsonLd
      data={[
        buildHowToSchema({
          name: "Sultan Okulları burs ve kayıt başvurusu",
          description:
            "Sultan Okulları'nda burs ve kayıt sürecine başvuru adımları.",
          steps: BURS_HOWTO_STEPS,
          path,
        }),
        buildFaqPageSchema(BURS_FAQ_ITEMS, absoluteUrl(path)),
      ]}
    />
  );
}

export default async function Page() {
  const cmsPage = await getPageBySlug("burs-olanaklari");

  if (cmsPage?.sections?.length) {
    return (
      <>
        <BursStructuredData />
        <PageShell
          title={cmsPage.title}
          intro={cmsPage.intro ?? undefined}
        >
          <CmsPageSections sections={cmsPage.sections} />
          <PageFaqSection items={BURS_FAQ_ITEMS} />
          <p className="mt-10 text-sm text-zinc-500">
            Başvuru formu ve evrak listesi hazırlandığında bu sayfaya eklenecektir.
            Ön bilgi için{" "}
            <a
              href="/iletisim"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              iletişim
            </a>{" "}
            üzerinden yazabilirsiniz.
          </p>
        </PageShell>
      </>
    );
  }

  return (
    <>
      <BursStructuredData />
      <PageShell
        title="Burs olanakları"
        intro="Hem akademik başarı hem de yönetim kurulunun onayladığı ihtiyaç durumlarında burs imkânları."
      >
        <p className="text-zinc-700">{bursGiris}</p>
        <h2 className="mt-10 text-lg font-semibold text-[var(--color-primary)]">
          İndirim oranları (%10)
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Kurum politikası gereği sitede ilgili gruplar için <strong>%10</strong>{" "}
          indirim gösterilmektedir.
        </p>
        <ul className="mt-6 space-y-3">
          {bursIndirimleri.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm"
            >
              <span className="text-zinc-800">{row.label}</span>
              <span className="font-semibold text-[var(--color-primary)]">
                %{row.percent}
              </span>
            </li>
          ))}
        </ul>
        <PageFaqSection items={BURS_FAQ_ITEMS} />
        <p className="mt-10 text-sm text-zinc-500">
          Başvuru formu ve evrak listesi hazırlandığında bu sayfaya eklenecektir.
          Ön bilgi için{" "}
          <a
            href="/iletisim"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            iletişim
          </a>{" "}
          üzerinden yazabilirsiniz.
        </p>
      </PageShell>
    </>
  );
}
