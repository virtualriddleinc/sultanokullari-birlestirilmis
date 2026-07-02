const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

/** İdari Kadro sayfası ve hero için ortak yeşil zemin + bal köpüğü vurgular + desen. */
export function IdariKadroPageBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[var(--color-brand-honey)]/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-[var(--color-brand-honey)]/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[var(--color-brand-honey)]/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-16 hidden h-56 w-56 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.12] md:block"
        style={{ clipPath: HEX_CLIP }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-20 hidden h-48 w-48 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.10] lg:block"
        style={{ clipPath: HEX_CLIP }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-8 hidden h-40 w-40 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.10] xl:block"
        style={{ clipPath: HEX_CLIP }}
      />
    </>
  );
}
