#!/usr/bin/env tsx
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { getPayloadClient } = await import("@/lib/payload");
  const { isAdminOrEditor } = await import("@/payload/access");

  const payload = await getPayloadClient();
  const users = await payload.find({
    collection: "users",
    limit: 10,
    overrideAccess: true,
  });

  console.log("\n=== Kullanıcı rolleri ===\n");
  for (const user of users.docs) {
    const req = { user, payload } as Parameters<typeof isAdminOrEditor>[0]["req"];
    let roles = user.roles;
    if (!roles?.length) {
      await payload.update({
        collection: "users",
        id: user.id,
        data: { roles: ["editor"] },
        overrideAccess: true,
      });
      roles = ["editor"];
      console.log(`${user.email}: roles düzeltildi → ["editor"] (boş rol asla admin yapılmaz)`);
    }
    const canEditUser = { ...user, roles };
    const canEdit = await isAdminOrEditor({
      req: { ...req, user: canEditUser },
    });
    console.log(`${user.email}: roles=${JSON.stringify(roles)} canEdit=${canEdit}`);
  }

  const locks = await payload.find({
    collection: "payload-locked-documents",
    limit: 20,
    overrideAccess: true,
    depth: 1,
  });

  console.log(`\n=== Kilitli belgeler: ${locks.totalDocs} ===\n`);
  for (const lock of locks.docs) {
    console.log(JSON.stringify({ id: lock.id, globalSlug: lock.globalSlug, updatedAt: lock.updatedAt }));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
