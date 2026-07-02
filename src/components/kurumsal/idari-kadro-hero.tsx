interface IdariKadroHeroProps {
  title: string;
  intro?: string;
}

export function IdariKadroHero({ title, intro }: IdariKadroHeroProps) {
  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
        <span className="text-charcoal text-xs font-semibold tracking-[0.24em] uppercase">
          Kurumsal · Ekibimiz
        </span>
        <h1 className="text-charcoal text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="text-charcoal/80 max-w-2xl text-base leading-7 sm:text-lg">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
