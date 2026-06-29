"use client";

type Props = {
  anchor: string;
  label?: string;
};

function SectionPreviewLink({ anchor, label = "Bölümü sitede aç →" }: Props) {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";
  const href = anchor.startsWith("#") ? `${base}/${anchor}` : `${base}${anchor}`;

  return (
    <p className="sultan-section-preview">
      <a href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    </p>
  );
}

export function GayemizSectionPreview() {
  return <SectionPreviewLink anchor="#gayemiz" label="Gâyemiz bölümünü sitede aç →" />;
}

export function YolculukSectionPreview() {
  return <SectionPreviewLink anchor="#yolculuk" label="Yolculuk bölümünü sitede aç →" />;
}

export function NedenSectionPreview() {
  return <SectionPreviewLink anchor="#neden" label="Neden Sultan bölümünü sitede aç →" />;
}

export function VideoSectionPreview() {
  return <SectionPreviewLink anchor="#video" label="Tanıtım videosu bölümünü sitede aç →" />;
}

export function OkullarimizSectionPreview() {
  return <SectionPreviewLink anchor="#okullarimiz" label="Okullarımız bölümünü sitede aç →" />;
}

export function GuncelSectionPreview() {
  return <SectionPreviewLink anchor="#guncel" label="Güncel bölümünü sitede aç →" />;
}

export function InstagramSectionPreview() {
  return <SectionPreviewLink anchor="#instagram" label="Instagram bölümünü sitede aç →" />;
}

export function KisaYollarSectionPreview() {
  return <SectionPreviewLink anchor="#kisa-yollar" label="Kısa yollar bölümünü sitede aç →" />;
}
