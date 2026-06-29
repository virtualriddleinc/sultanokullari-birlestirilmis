import Image from "next/image";
import { InteractiveSiteVideo } from "@/components/media/interactive-site-video";
import type { Branch } from "@/content/branches";

interface BranchGalleryProps {
  branch: Branch;
}

export function BranchGallery({ branch }: BranchGalleryProps) {
  const hasImages = branch.gallery.length > 0;

  return (
    <section
      className="mt-12 border-t border-zinc-200 pt-10"
      aria-labelledby={`gallery-heading-${branch.slug}`}
    >
      <h2
        id={`gallery-heading-${branch.slug}`}
        className="text-xl font-semibold text-[var(--color-primary)]"
      >
        Galeri
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        {hasImages
          ? "Okulumuzdan seçilen fotoğraf ve video görüntüleri."
          : "Fotoğraf ve videolar yakında eklenecektir. Görseller okul yönetimi tarafından sağlandığında bu alan güncellenecektir."}
      </p>
      {hasImages ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branch.gallery.map((item, i) => (
            <li
              key={`${item.src}-${i}`}
              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100"
            >
              {item.kind === "video" ? (
                <InteractiveSiteVideo
                  className="h-full w-full object-cover"
                  src={item.src}
                  poster={item.poster}
                  title={item.alt}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="mt-6 flex min-h-[12rem] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 text-center text-sm text-zinc-500"
          role="status"
        >
          Görsel henüz eklenmedi
        </div>
      )}
    </section>
  );
}
