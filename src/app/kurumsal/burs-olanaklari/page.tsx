import type { Metadata } from "next";
import { bursGiris, bursIndirimleri } from "@/content/burs";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Burs olanakları",
  description:
    "Akademik başarı ve ihtiyaç temelli burs; özel indirim oranları.",
};

export default function Page() {
  return (
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
  );
}
