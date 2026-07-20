import { Fragment, type ReactNode } from "react";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightText(text: string, phrases: string[]): ReactNode {
  if (phrases.length === 0) return text;

  const pattern = new RegExp(`(${phrases.map(escapeRegExp).join("|")})`, "g");
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    phrases.includes(part) ? (
      <mark
        key={i}
        className="font-bold italic text-charcoal"
      >
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
