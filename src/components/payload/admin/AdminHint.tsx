"use client";

type HintProps = {
  text?: string;
};

export default function AdminHint({ text }: HintProps) {
  if (!text) return null;
  return <p className="sultan-admin-hint">{text}</p>;
}

type SiteLinkProps = {
  href?: string;
  label?: string;
};

export function SiteLink({ href, label = "Sayfayı sitede aç →" }: SiteLinkProps) {
  if (!href) return null;
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";
  const url = href.startsWith("http") ? href : `${base}${href.startsWith("/") ? href : `/${href}`}`;

  return (
    <p className="sultan-admin-hint sultan-admin-hint--link">
      <a href={url} target="_blank" rel="noreferrer">
        {label}
      </a>
    </p>
  );
}
