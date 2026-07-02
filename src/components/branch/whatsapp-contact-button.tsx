import { WhatsAppGlyph } from "@/components/icons/whatsapp-glyph";
import { toWhatsAppHref } from "@/lib/phone";
import { cn } from "@/lib/utils";

type WhatsAppContactButtonProps = {
  phone: string;
  label?: string;
  className?: string;
};

export function WhatsAppContactButton({
  phone,
  label = "WhatsApp",
  className,
}: WhatsAppContactButtonProps) {
  if (!phone.trim()) return null;

  return (
    <a
      className={cn(
        "border-charcoal/15 text-charcoal hover:border-[#25D366]/50 hover:bg-[#25D366]/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        className,
      )}
      href={toWhatsAppHref(phone)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppGlyph className="size-4 shrink-0 text-[#25D366]" aria-hidden />
      {label}
    </a>
  );
}
