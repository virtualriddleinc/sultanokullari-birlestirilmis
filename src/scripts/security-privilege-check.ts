/**
 * Privilege escalation / IDOR smoke checks against local Payload API.
 * Usage: BASE=http://localhost:5001 npx tsx src/scripts/security-privilege-check.ts
 */
const BASE = process.env.BASE || "http://localhost:5001";
const TEST_IP =
  process.env.TEST_IP ||
  `10.88.${Math.floor(Math.random() * 200) + 1}.${Math.floor(Math.random() * 200) + 1}`;

type Result = { name: string; ok: boolean; detail: string };

async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": TEST_IP },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return {
    ok: res.ok,
    token: data.token as string | undefined,
    user: data.user,
    data,
  };
}

async function main() {
  const results: Result[] = [];

  const admin = await login("admin@admin.com", "admin123");
  results.push({
    name: "admin_login",
    ok: Boolean(admin.token),
    detail: admin.ok ? "ok" : JSON.stringify(admin.data),
  });

  const editor = await login("editor@test.local", "admin123");
  results.push({
    name: "editor_login",
    ok: Boolean(editor.token),
    detail: editor.ok ? "ok" : "fail_or_missing_user",
  });

  const inbox = await login("inbox@test.local", "admin123");
  results.push({
    name: "inbox_login",
    ok: Boolean(inbox.token),
    detail: inbox.ok ? "ok" : "fail_or_missing_user",
  });

  if (inbox.token) {
    const heroCreate = await fetch(`${BASE}/api/hero-slides`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${inbox.token}`,
        "x-forwarded-for": TEST_IP,
      },
      body: JSON.stringify({
        tagline: "x",
        titleLine1: "a",
        titleLine2: "b",
        titleLine3: "c",
        description: "d",
        buttonText: "e",
        buttonLink: "/",
        slideMedia: { kind: "image", src: "/x.jpg", alt: "x" },
      }),
    });
    results.push({
      name: "inbox_cannot_create_hero",
      ok: !heroCreate.ok,
      detail: `status=${heroCreate.status}`,
    });

    const usersList = await fetch(`${BASE}/api/users`, {
      headers: {
        Authorization: `JWT ${inbox.token}`,
        "x-forwarded-for": TEST_IP,
      },
    });
    const usersData = await usersList.json();
    const docs = usersData.docs || [];
    const onlySelf =
      docs.length <= 1 && (!docs[0] || docs[0].email === "inbox@test.local");
    results.push({
      name: "inbox_users_self_only",
      ok: onlySelf,
      detail: `count=${docs.length}`,
    });

    if (admin.user?.id) {
      const escalate = await fetch(`${BASE}/api/users/${admin.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${inbox.token}`,
          "x-forwarded-for": TEST_IP,
        },
        body: JSON.stringify({ roles: ["admin"] }),
      });
      results.push({
        name: "inbox_cannot_escalate_admin",
        ok: !escalate.ok,
        detail: `status=${escalate.status}`,
      });
    }
  }

  if (editor.token) {
    const nav = await fetch(`${BASE}/api/globals/navigation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${editor.token}`,
        "x-forwarded-for": TEST_IP,
      },
      body: JSON.stringify({ useCmsMenu: true }),
    });
    results.push({
      name: "editor_cannot_update_navigation",
      ok: !nav.ok,
      detail: `status=${nav.status}`,
    });
  }

  if (admin.token) {
    const navGet = await fetch(`${BASE}/api/globals/navigation`, {
      headers: {
        Authorization: `JWT ${admin.token}`,
        "x-forwarded-for": TEST_IP,
      },
    });
    results.push({
      name: "admin_can_read_navigation",
      ok: navGet.ok,
      detail: `status=${navGet.status}`,
    });
  }

  const failed = results.filter((r) => !r.ok);
  console.log(
    JSON.stringify(
      {
        passed: results.length - failed.length,
        failed: failed.length,
        results,
      },
      null,
      2,
    ),
  );
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
