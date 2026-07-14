/**
 * TestSprite derin admin testleri için kalıcı kullanıcılar ve geçici içerik temizliği.
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

  let deletedContacts = 0;
  const contacts = await payload.find({
    collection: "contact-messages",
    limit: 100,
    overrideAccess: true,
  });
  for (const doc of contacts.docs) {
    const marker = `${doc.name ?? ""} ${doc.email ?? ""} ${doc.subject ?? ""} ${doc.message ?? ""}`;
    if (/TestSprite|ts-new|ts-read|ts-arch/i.test(marker)) {
      await payload.delete({
        collection: "contact-messages",
        id: doc.id,
        overrideAccess: true,
      });
      deletedContacts += 1;
    }
  }

  let deletedIk = 0;
  const iks = await payload.find({
    collection: "ik-applications",
    limit: 100,
    overrideAccess: true,
  });
  for (const doc of iks.docs) {
    const marker = `${doc.fullName ?? ""} ${doc.email ?? ""} ${doc.coverLetter ?? ""}`;
    if (/TestSprite|ts-ik/i.test(marker)) {
      await payload.delete({
        collection: "ik-applications",
        id: doc.id,
        overrideAccess: true,
      });
      deletedIk += 1;
    }
  }

  let deletedDraftNews = 0;
  const news = await payload.find({
    collection: "news",
    limit: 100,
    overrideAccess: true,
  });
  for (const doc of news.docs) {
    const marker = `${doc.title ?? ""} ${doc.excerpt ?? ""}`;
    if (/TestSprite/i.test(marker)) {
      await payload.delete({
        collection: "news",
        id: doc.id,
        overrideAccess: true,
      });
      deletedDraftNews += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        usersKept: ["admin@admin.com", "editor@test.local", "inbox@test.local"],
        deletedContacts,
        deletedIk,
        deletedDraftNews,
      },
      null,
      2,
    ),
  );

  console.log("SEED_OK");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
