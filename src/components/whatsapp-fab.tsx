import { WhatsAppGlyph } from "@/components/icons/whatsapp-glyph";
import { toWhatsAppHref } from "@/lib/phone";

type WhatsAppFabProps = {
  phone: string;
};

/** Mobil-only sabit WhatsApp butonu (lg altı). */
export function WhatsAppFab({ phone }: WhatsAppFabProps) {
  const href = toWhatsAppHref(phone);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed right-5 bottom-5 z-[60] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95 lg:hidden"
    >
      <WhatsAppGlyph className="size-7 text-white" aria-hidden />
    </a>
  );
}
