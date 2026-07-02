/** Türkiye GSM numarasını wa.me bağlantısı için normalize eder (örn. 905060576072). */
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

export function toWhatsAppHref(phone: string): string {
  return `https://wa.me/${toWhatsAppDigits(phone)}`;
}
