/**
 * TestSprite derin admin testleri için seed verisi.
 * Kullanım: NODE_OPTIONS=--no-deprecation npx tsx src/scripts/seed-testsprite-admin.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";

const PASSWORD = "admin123";

async function ensureUser(
  payload: Awaited<ReturnType<typeof getPayload>>,
  email: string,
  roles: ("admin" | "editor" | "inbox")[],
) {
  const found = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  });
  if (found.docs[0]) {
    await payload.update({
      collection: "users",
      id: found.docs[0].id,
      data: { password: PASSWORD, roles },
      overrideAccess: true,
    });
    console.log("user updated", email, roles);
    return found.docs[0].id;
  }
  const created = await payload.create({
    collection: "users",
    data: { email, password: PASSWORD, roles },
    overrideAccess: true,
  });
  console.log("user created", email, roles);
  return created.id;
}

async function main() {
  const payload = await getPayload({ config });

  await ensureUser(payload, "admin@admin.com", ["admin"]);
  await ensureUser(payload, "editor@test.local", ["editor"]);
  await ensureUser(payload, "inbox@test.local", ["inbox"]);

  // Contact messages — mixed statuses for inbox tests
  const contacts = await payload.find({
    collection: "contact-messages",
    limit: 20,
    overrideAccess: true,
  });
  const neededContacts = [
    {
      name: "TestSprite Yeni Mesaj",
      email: "ts-new@example.com",
      phone: "05551110001",
      subject: "TestSprite NEW inbox",
      message: "Yeni durum — auto-read ve bulk test için.",
      source: "contact" as const,
      status: "new" as const,
    },
    {
      name: "TestSprite İkinci Yeni",
      email: "ts-new2@example.com",
      phone: "05551110002",
      subject: "TestSprite NEW bulk-2",
      message: "Toplu arşiv için ikinci yeni mesaj.",
      source: "info_request" as const,
      status: "new" as const,
    },
    {
      name: "TestSprite Okunmuş",
      email: "ts-read@example.com",
      phone: "05551110003",
      subject: "TestSprite READ",
      message: "Okundu durum örneği.",
      source: "contact" as const,
      status: "read" as const,
    },
    {
      name: "TestSprite Arşiv",
      email: "ts-arch@example.com",
      phone: "05551110004",
      subject: "TestSprite ARCHIVED",
      message: "Arşiv durum örneği.",
      source: "contact" as const,
      status: "archived" as const,
    },
  ];
  if (contacts.totalDocs < 4) {
    for (const data of neededContacts) {
      await payload.create({
        collection: "contact-messages",
        data,
        overrideAccess: true,
      });
      console.log("contact created", data.subject);
    }
  } else {
    // Ensure at least 2 new
    const news = contacts.docs.filter((d) => d.status === "new");
    for (let i = news.length; i < 2; i++) {
      await payload.create({
        collection: "contact-messages",
        data: neededContacts[i],
        overrideAccess: true,
      });
      console.log("contact created (fill new)", neededContacts[i].subject);
    }
    console.log("contacts ok", contacts.totalDocs, "new≈", Math.max(news.length, 2));
  }

  // IK applications
  const iks = await payload.find({
    collection: "ik-applications",
    limit: 10,
    overrideAccess: true,
  });
  if (iks.totalDocs < 2) {
    for (const data of [
      {
        fullName: "TestSprite IK Aday",
        email: "ts-ik@example.com",
        phone: "05552220001",
        position: "Öğretmen",
        experienceYears: 3,
        education: "Lisans",
        coverLetter: "TestSprite İK başvurusu — incelendi/arşiv testi.",
        status: "new" as const,
      },
      {
        fullName: "TestSprite IK İkinci",
        email: "ts-ik2@example.com",
        phone: "05552220002",
        position: "Rehber Öğretmen",
        experienceYears: 5,
        education: "Yüksek Lisans",
        coverLetter: "İkinci İK kaydı bulk için.",
        status: "new" as const,
      },
    ]) {
      await payload.create({
        collection: "ik-applications",
        data,
        overrideAccess: true,
      });
      console.log("ik created", data.fullName);
    }
  } else {
    console.log("ik ok", iks.totalDocs);
  }

  // Hero slides — need 2+ for orderable
  const heroes = await payload.find({
    collection: "hero-slides",
    limit: 5,
    overrideAccess: true,
  });
  console.log("hero-slides count", heroes.totalDocs);

  const journeys = await payload.find({
    collection: "journey-chapters",
    limit: 5,
    overrideAccess: true,
  });
  console.log("journey-chapters count", journeys.totalDocs);

  const neden = await payload.find({
    collection: "neden-sultan-items",
    limit: 5,
    overrideAccess: true,
  });
  console.log("neden-sultan-items count", neden.totalDocs);

  const ig = await payload.find({
    collection: "instagram-posts",
    limit: 5,
    overrideAccess: true,
  });
  console.log("instagram-posts count", ig.totalDocs);

  const news = await payload.find({
    collection: "news",
    limit: 10,
    overrideAccess: true,
  });
  console.log("news count", news.totalDocs);

  const events = await payload.find({
    collection: "events",
    limit: 5,
    overrideAccess: true,
  });
  console.log("events count", events.totalDocs);

  const branches = await payload.find({
    collection: "branches",
    limit: 5,
    overrideAccess: true,
  });
  console.log("branches count", branches.totalDocs);

  const staff = await payload.find({
    collection: "staff",
    limit: 5,
    overrideAccess: true,
  });
  console.log("staff count", staff.totalDocs);

  // Ensure one draft news if none
  const drafts = news.docs.filter((d) => d._status === "draft");
  if (drafts.length === 0) {
    await payload.create({
      collection: "news",
      data: {
        title: "TestSprite Taslak Haber",
        kind: "haber",
        date: new Date().toISOString().slice(0, 10),
        excerpt: "TestSprite için taslak haber özeti.",
        _status: "draft",
      },
      draft: true,
      overrideAccess: true,
    });
    console.log("draft news created");
  }

  console.log("SEED_OK");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
