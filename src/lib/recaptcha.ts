/**
 * reCAPTCHA v3 doğrulama.
 * Üretimde secret zorunlu (fail-closed). Geliştirmede secret yoksa geçer.
 */

export async function verifyRecaptcha(
  token: string | undefined,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  const isProd = process.env.NODE_ENV === "production";

  if (!secret) {
    if (isProd) return false;
    return true;
  }

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
