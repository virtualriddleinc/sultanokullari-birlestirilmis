/** Payload admin sidebar grupları — ana sayfa sırasıyla numaralandırılmış */
export const ADMIN_GROUPS = {
  home: "Ana Sayfa",
  site: "Site İçeriği",
  inbox: "Gelen Kutusu",
  system: "Sistem",
} as const;

export const ICON_KEY_OPTIONS = [
  { label: "Kitap", value: "book-open" },
  { label: "Mezuniyet", value: "graduation-cap" },
  { label: "Palet", value: "palette" },
  { label: "Kalp el", value: "hand-heart" },
  { label: "Rehberlik", value: "heart-handshake" },
  { label: "Filiz", value: "sprout" },
  { label: "Radyo", value: "radio" },
  { label: "Telefon", value: "phone" },
  { label: "Kitap açık", value: "book-open-text" },
  { label: "Pusula", value: "compass" },
  { label: "Deney", value: "flask-conical" },
  { label: "Kıvılcım", value: "sparkles" },
] as const;

export const JOURNEY_ICON_OPTIONS = ICON_KEY_OPTIONS.filter((o) =>
  ["book-open-text", "compass", "flask-conical", "palette", "sparkles"].includes(
    o.value,
  ),
);

/** Canlı önizleme için site kök URL */
export function getPreviewBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    "http://localhost:5001"
  );
}
