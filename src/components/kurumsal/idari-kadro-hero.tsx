const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

interface IdariKadroHeroProps {
  title: string;
  intro?: string;
}

export function IdariKadroHero({ title, intro }: IdariKadroHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-24 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-16 hidden h-56 w-56 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.10] md:block"
        style={{ clipPath: HEX_CLIP }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 -right-20 hidden h-48 w-48 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.08] lg:block"
        style={{ clipPath: HEX_CLIP }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase">
          Kurumsal · Ekibimiz
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-700 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
