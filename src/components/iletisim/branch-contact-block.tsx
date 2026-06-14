import { ContactForm } from "@/components/iletisim/contact-form";

export function BranchContactBlock({ branchSlug }: { branchSlug: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
      <p className="text-sm text-zinc-600">
        Bu şube için ön seçim yapılmıştır; dilerseniz açılır listeden başka şube
        seçebilirsiniz.
      </p>
      <div className="mt-4">
        <ContactForm defaultBranchSlug={branchSlug} />
      </div>
    </div>
  );
}
