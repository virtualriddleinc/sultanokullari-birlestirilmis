"use server";

import { z } from "zod";
import { getPublishedBranches } from "@/lib/branches-data";
import { persistIkApplication } from "@/lib/form-persistence";

const ikSchemaBase = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(10),
  branchSlug: z.string().optional(),
  position: z.string().trim().min(2),
  experienceYears: z.coerce.number().int().min(0).max(50),
  education: z.string().trim().min(2),
  coverLetter: z.string().trim().min(20),
});

export type IkState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitIkApplication(
  _prev: IkState,
  formData: FormData,
): Promise<IkState> {
  if ((formData.get("hp") as string | null)?.length) {
    return { ok: true, message: "Başvurunuz alındı." };
  }
  if (formData.get("kvkk") !== "on") {
    return {
      ok: false,
      message: "KVKK onayı gerekli.",
      fieldErrors: { kvkk: ["Onaylamanız gerekir."] },
    };
  }

  const branchSlugs = new Set(
    (await getPublishedBranches()).map((b) => b.slug),
  );
  const rawBranch = String(formData.get("branchSlug") ?? "");

  const parsed = ikSchemaBase.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    branchSlug:
      rawBranch && branchSlugs.has(rawBranch) ? rawBranch : undefined,
    position: formData.get("position"),
    experienceYears:
      formData.get("experienceYears") === ""
        ? 0
        : formData.get("experienceYears"),
    education: formData.get("education"),
    coverLetter: formData.get("coverLetter"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Lütfen alanları kontrol edin.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }
  await persistIkApplication(parsed.data);

  return {
    ok: true,
    message: "Başvurunuz alındı. İnsan Kaynakları ekibimiz en kısa sürede değerlendirecektir.",
  };
}
