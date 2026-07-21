/** Türkiye GSM numarasını wa.me bağlantısı için normalize eder (örn. 905060576072). */
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

/** Geçerli TR/uluslararası E.164 benzeri uzunluk (ülke kodu dahil). */
export function isValidWhatsAppDigits(digits: string): boolean {
  return /^\d{11,15}$/.test(digits);
}

export function toWhatsAppHref(phone: string): string | null {
  const digits = toWhatsAppDigits(phone);
  if (!isValidWhatsAppDigits(digits)) return null;
  return `https://wa.me/${digits}`;
}
