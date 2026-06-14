"use server";

import { z } from "zod";
import { branches } from "@/content/branches";

const branchSlugs = new Set(branches.map((b) => b.slug));

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad en az 2 karakter olmalıdır.")
    .max(100, "Ad Soyad en fazla 100 karakter olabilir.")
    .regex(
      /^[A-Za-zCÇGĞIİOÖSŞUÜa-zcçgğiıoösşuü\s'-]+$/,
      "Ad Soyad alanına yalnızca metin girebilirsiniz.",
    ),
  email: z.string().trim().email("Geçerli bir e-posta girin."),
  phone: z
    .string()
    .trim()
    .regex(/^\d+$/, "Telefon Numarası yalnızca rakamlardan oluşmalıdır.")
    .regex(/^05\d{9}$/, "Telefon Numarası 05XXXXXXXXX formatında olmalıdır."),
  subject: z.string().trim().min(2, "Konu girin."),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalıdır."),
  branchSlug: z
    .string()
    .optional()
    .transform((s) =>
      s && s.length > 0 && branchSlugs.has(s) ? s : undefined,
    ),
  website: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type ContactFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    branchSlug: formData.get("branchSlug") ?? undefined,
    website: formData.get("website") ?? "",
    recaptchaToken: formData.get("recaptchaToken") ?? undefined,
  };

  if (typeof raw.website === "string" && raw.website.length > 0) {
    return { ok: true, message: "Gönderiminiz alındı." };
  }

  if (formData.get("kvkk") !== "on") {
    return {
      ok: false,
      message: "Lütfen formu kontrol edin.",
      fieldErrors: { kvkk: ["KVKK aydınlatma metnini onaylamanız gerekir."] },
    };
  }

  const parsed = contactSchema.safeParse({
    ...raw,
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    subject: typeof raw.subject === "string" ? raw.subject : "",
    message: typeof raw.message === "string" ? raw.message : "",
    branchSlug: typeof raw.branchSlug === "string" ? raw.branchSlug : undefined,
    recaptchaToken:
      typeof raw.recaptchaToken === "string" ? raw.recaptchaToken : undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Lütfen formu kontrol edin.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const captchaOk = await verifyRecaptcha(parsed.data.recaptchaToken);
  if (!captchaOk) {
    return {
      ok: false,
      message: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.",
    };
  }

  // Üretimde e-posta / CRM entegrasyonu burada yapılır.
  return {
    ok: true,
    message:
      "Mesajınız alındı. En kısa sürede size dönüş yapılacaktır. (Şu an yalnızca sunucu tarafı doğrulama; e-posta gönderimi yapılandırılmadı.)",
  };
}
