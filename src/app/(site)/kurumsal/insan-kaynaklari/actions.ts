"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { getPublishedBranches } from "@/lib/branches-data";
import { persistIkApplication } from "@/lib/form-persistence";
import { rateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";

const ikSchemaBase = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(10),
  branchSlug: z.string().optional(),
  position: z.string().trim().min(2),
  experienceYears: z.coerce.number().int().min(0).max(50),
  education: z.string().trim().min(2),
  coverLetter: z.string().trim().min(20),
  recaptchaToken: z.string().optional(),
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
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`ik:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return {
      ok: false,
      message: `Çok fazla istek. Lütfen ${limited.retryAfterSec} saniye sonra tekrar deneyin.`,
    };
  }

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

  const captchaOk = await verifyRecaptcha(
    typeof formData.get("recaptchaToken") === "string"
      ? (formData.get("recaptchaToken") as string)
      : undefined,
  );
  if (!captchaOk) {
    return {
      ok: false,
      message: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.",
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
    recaptchaToken: formData.get("recaptchaToken") ?? undefined,
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

  // CV: FormData'dan File — server action içinde Payload'a yüklenir
  const cvFile = formData.get("cv");
  let cvMediaId: number | undefined;
  if (cvFile && typeof cvFile === "object" && "arrayBuffer" in cvFile) {
    const file = cvFile as File;
    if (file.size > 0) {
      const { uploadIkCv } = await import("@/lib/ik-cv-upload");
      const uploaded = await uploadIkCv(file);
      if (!uploaded.ok) {
        return { ok: false, message: uploaded.message };
      }
      cvMediaId = uploaded.id;
    }
  }

  await persistIkApplication({
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    branchSlug: parsed.data.branchSlug,
    position: parsed.data.position,
    experienceYears: parsed.data.experienceYears,
    education: parsed.data.education,
    coverLetter: parsed.data.coverLetter,
    cv: cvMediaId,
  });

  return {
    ok: true,
    message:
      "Başvurunuz alındı. İnsan Kaynakları ekibimiz en kısa sürede değerlendirecektir.",
  };
}
