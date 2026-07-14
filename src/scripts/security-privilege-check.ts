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

function authHeaders(token: string) {
  return {
    Authorization: `JWT ${token}`,
    "x-forwarded-for": TEST_IP,
  };
}

async function getFirstNewsId(
  adminToken: string,
): Promise<number | string | null> {
  const list = await fetch(`${BASE}/api/news?limit=1`, {
    headers: authHeaders(adminToken),
  });
  const data = await list.json();
  return data.docs?.[0]?.id ?? null;
}

async function createTempNews(
  adminToken: string,
): Promise<number | string | null> {
  const title = `Privilege Smoke ${Date.now()}`;
  const res = await fetch(`${BASE}/api/news`, {
    method: "POST",
    headers: {
      ...authHeaders(adminToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      kind: "haber",
      date: new Date().toISOString(),
      excerpt: "Temporary privilege smoke document",
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      _status: "draft",
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.doc?.id ?? data.id ?? null;
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

    if (admin.token) {
      let tempNewsId: number | string | null = null;
      const newsId =
        (await getFirstNewsId(admin.token)) ??
        (tempNewsId = await createTempNews(admin.token));

      if (newsId) {
        const newsUpdate = await fetch(`${BASE}/api/news/${newsId}`, {
          method: "PATCH",
          headers: {
            ...authHeaders(inbox.token),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: "Inbox escalation attempt" }),
        });
        results.push({
          name: "inbox_cannot_update_news",
          ok: !newsUpdate.ok,
          detail: `status=${newsUpdate.status}`,
        });
      } else {
        results.push({
          name: "inbox_cannot_update_news",
          ok: false,
          detail: "no_news_doc_available",
        });
      }

      if (tempNewsId) {
        await fetch(`${BASE}/api/news/${tempNewsId}`, {
          method: "DELETE",
          headers: authHeaders(admin.token),
        });
      }
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

    if (editor.user?.id) {
      const roleUpdate = await fetch(`${BASE}/api/users/${editor.user.id}`, {
        method: "PATCH",
        headers: {
          ...authHeaders(editor.token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: ["admin"] }),
      });
      const verify = await fetch(`${BASE}/api/users/${editor.user.id}`, {
        headers: authHeaders(editor.token),
      });
      const userData = await verify.json();
      const roles = userData.roles || userData.doc?.roles || [];
      results.push({
        name: "editor_cannot_update_user_roles",
        ok: !roles.includes("admin"),
        detail: `patch_status=${roleUpdate.status};roles=${roles.join(",")}`,
      });
    }
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
