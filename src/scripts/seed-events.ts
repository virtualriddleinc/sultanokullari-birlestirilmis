import { config } from "dotenv";

config({ path: ".env.local" });

const SEED_SLUG = "veli-bilgilendirme-bulusmasi";

async function seedEvents() {
  const { getPayloadClient } = await import("@/lib/payload");
  const payload = await getPayloadClient();

  const existing = await payload.find({
    collection: "events",
    where: {
      slug: {
        equals: SEED_SLUG,
      },
    },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length > 0) {
    console.log(`Seed atlandı: "${SEED_SLUG}" zaten mevcut.`);
    return;
  }

  await payload.create({
    collection: "events",
    data: {
      title: "Veli bilgilendirme buluşması",
      slug: SEED_SLUG,
      date: "2026-05-15",
      excerpt:
        "Tüm şubeler için genel veli bilgilendirme oturumu planlanmaktadır.",
      _status: "published",
    },
  });

  console.log(`Seed tamamlandı: "${SEED_SLUG}" eklendi.`);
}

seedEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed başarısız:", error);
    process.exit(1);
  });
