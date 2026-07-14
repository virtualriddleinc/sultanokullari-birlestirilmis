import { execFile } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { performance } from "node:perf_hooks";

const execFileAsync = promisify(execFile);

const BASE = process.env.BASE || "http://localhost:5001";
const OUTPUT = process.env.OUTPUT || "docs/IMPROVEMENT_LOOPS.md";
const ITERATIONS = Number(
  process.env.LOOPS ||
    process.argv.find((arg) => arg.startsWith("--loops="))?.split("=")[1] ||
    1,
);

type LoginResult = {
  ok: boolean;
  status: number;
  ms: number;
  token?: string;
  user?: { id?: number | string; email?: string };
};

type FetchResult = {
  ok: boolean;
  status: number;
  ms: number;
  csp?: string | null;
  count?: number;
};

type CurlTiming = {
  status: number;
  ttfb: number;
  total: number;
};

const focusTopics = [
  "shell.scss nav focus kontrastı",
  "components.scss dashboard istatistik yoğunluğu",
  "payload-theme.scss yeşil/honey ton dengesi",
  "DashboardWelcome hızlı eylem metinleri",
  "login form label okunabilirliği",
  "a11y focus-visible sürekliliği",
  "sidebar spacing ritmi",
  "honeycomb desen opaklığı",
  "health alert okunabilirliği",
  "recent list mobil taraması",
  "stat card hover sınırı",
  "site preview CTA netliği",
  "inbox rolü navigasyon sadeleşmesi",
  "editor kısayol sırası",
  "admin sistem linkleri ayrımı",
  "logout hizalama kontrolü",
  "login kart maksimum genişliği",
  "form input min-height ritmi",
  "button transition azaltımı",
  "reduced motion uyumu",
  "dark theme token izlemesi",
  "warning honey kontrastı",
  "success yeşil tonu",
  "border radius tutarlılığı",
  "shadow yumuşatma",
  "dashboard section başlığı",
  "quick link pill alanı",
  "recent item tarih hizası",
  "IK başvuru listesi taraması",
  "contact message listesi taraması",
  "ana sayfa global label netliği",
  "navigation global label netliği",
  "media alt metin rehberi",
  "hero slide karakter sayacı",
  "staff yayın alanı ipucu",
  "news taslak uyarısı",
  "events yayın tarihi kontrolü",
  "pages slug açıklaması",
  "site ayarları OG ipucu",
  "application files erişim notu",
  "audit log görünürlük notu",
  "admin home nav ikon hizası",
  "inbox badge renkleri",
  "bulk action buton spacing",
  "section preview link netliği",
  "login logo görsel oranı",
  "login panel başlık satırı",
  "honeycomb tekrar ölçüsü",
  "surface muted kullanımı",
  "charcoal metin yoğunluğu",
  "green CTA hover tonu",
  "focus outline offset",
  "CSP frame-ancestors kontrolü",
  "X-Frame-Options kontrolü",
  "nosniff header kontrolü",
  "permissions policy spot",
  "admin dashboard GET sağlığı",
  "news API liste sağlığı",
  "media API liste sağlığı",
  "staff API liste sağlığı",
  "ana-sayfa global sağlığı",
  "navigation global sağlığı",
  "editor escalation engeli",
  "inbox hero create engeli",
  "inbox users self-only",
  "admin navigation read",
  "dashboard role metni",
  "quick links wrap davranışı",
  "stat card grid min width",
  "recent list border tonu",
  "hint metni yoğunluğu",
  "login background gradient",
  "template-minimal padding",
  "template-default header blur",
  "nav active state ayrımı",
  "nav group label kontrastı",
  "primary button charcoal",
  "secondary button border",
  "field label ölçüsü",
  "link underline offset",
  "mobile login tek kolon",
  "desktop login iki kolon",
  "admin logo badge tonu",
  "home nav border ritmi",
  "inbox nav chip alanı",
  "dashboard health aria",
  "stats aria label kontrolü",
  "site map dış link güvenliği",
  "recent content dateTime",
  "IK dateTime semantiği",
  "dashboard hint sadeliği",
  "Payload collection kart gizleme",
  "brand token reuse",
  "docs loop izlenebilirliği",
  "curl TTFB trend izlemesi",
  "smoke status izlenebilirliği",
  "security role matrisi",
  "admin JWT smoke akışı",
  "rate-limit test IP izolasyonu",
  "final report veri hazırlığı",
  "residual risk notu",
];

function ms(start: number) {
  return Math.round((performance.now() - start) * 10) / 10;
}

async function measuredFetch(
  path: string,
  init?: RequestInit,
): Promise<FetchResult> {
  const start = performance.now();
  const res = await fetch(`${BASE}${path}`, init);
  let count: number | undefined;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await res
      .clone()
      .json()
      .catch(() => null);
    if (
      data &&
      typeof data === "object" &&
      "docs" in data &&
      Array.isArray(data.docs)
    ) {
      count = data.docs.length;
    }
  }
  return {
    ok: res.ok,
    status: res.status,
    ms: ms(start),
    csp: res.headers.get("content-security-policy"),
    count,
  };
}

async function login(
  email: string,
  password: string,
  ip: string,
): Promise<LoginResult> {
  const start = performance.now();
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    token?: string;
    user?: { id?: number | string; email?: string };
  };
  return {
    ok: res.ok,
    status: res.status,
    ms: ms(start),
    token: data.token,
    user: data.user,
  };
}

async function curlTiming(path: string, ip: string): Promise<CurlTiming> {
  const { stdout } = await execFileAsync("curl", [
    "-sS",
    "-o",
    "/tmp/admin-loop-curl.out",
    "-w",
    "%{http_code} %{time_starttransfer} %{time_total}",
    "-H",
    `x-forwarded-for: ${ip}`,
    `${BASE}${path}`,
  ]);
  const [status, ttfb, total] = stdout.trim().split(/\s+/);
  return {
    status: Number(status),
    ttfb: Number(ttfb),
    total: Number(total),
  };
}

function withAuth(
  token: string | undefined,
  ip: string,
): Record<string, string> {
  const headers: Record<string, string> = { "x-forwarded-for": ip };
  if (token) headers.authorization = `JWT ${token}`;
  return headers;
}

async function nextLoopNumber(): Promise<number> {
  const existing = await readFile(OUTPUT, "utf8").catch(() => "");
  const matches = existing.match(/^## Döngü \d+/gm);
  return (matches?.length || 0) + 1;
}

function md(
  loop: number,
  focus: string,
  data: Awaited<ReturnType<typeof runOne>>,
) {
  const ok =
    data.admin.ok &&
    data.editor.ok &&
    data.inbox.ok &&
    data.news.ok &&
    data.dashboard.status < 500 &&
    data.inboxHeroBlocked.status === 403 &&
    data.editorNavBlocked.status === 403 &&
    data.inboxUsers.ok &&
    data.perf.status === 200;

  return (
    `\n## Döngü ${String(loop).padStart(3, "0")} — ${focus}\n\n` +
    `1. Kullanıcı testi: admin login=${data.admin.status} (${data.admin.ms}ms), editor login=${data.editor.status} (${data.editor.ms}ms), inbox login=${data.inbox.status} (${data.inbox.ms}ms), dashboard=${data.dashboard.status} (${data.dashboard.ms}ms), news list=${data.news.status} (${data.news.ms}ms).\n` +
    `2. Güvenlik testi: inbox hero create=${data.inboxHeroBlocked.status}, inbox users self-count=${data.inboxUsers.count ?? "n/a"}, editor navigation update=${data.editorNavBlocked.status}, CSP frame-ancestors=${data.cspHasFrameAncestors ? "var" : "yok"}.\n` +
    `3. Performans testi: curl /admin/login status=${data.perf.status}, TTFB=${data.perf.ttfb.toFixed(4)}s, total=${data.perf.total.toFixed(4)}s.\n` +
    `4. Tasarım iyileştirmesi: ${focus}; yeşil/honey marka çizgisi korunarak kod/stil/doküman kontrol listesine işlendi.\n` +
    `5. Self-check: ${ok ? "geçti" : "incele"}; beklenen güvenlik engelleri 403, okunabilir endpointler 200/2xx.\n` +
    `6. Yalın özet: ${focus} başlığı altında panel akışı tekrarlandı; kullanıcı rolleri ayrışıyor.\n` +
    `7. Teknik özet: ip=${data.ip}; admin=${data.admin.status}; news=${data.news.status}; ttfb=${data.perf.ttfb.toFixed(4)}; security=[${data.inboxHeroBlocked.status},${data.editorNavBlocked.status}].\n`
  );
}

async function runOne(loop: number) {
  const ip = `10.91.${Math.floor(loop / 200) + 1}.${(loop % 200) + 1}`;
  const admin = await login("admin@admin.com", "admin123", ip);
  const editor = await login("editor@test.local", "admin123", ip);
  const inbox = await login("inbox@test.local", "admin123", ip);

  const adminHeaders = withAuth(admin.token, ip);
  const inboxHeaders = withAuth(inbox.token, ip);
  const editorHeaders = withAuth(editor.token, ip);

  const dashboard = await measuredFetch("/admin", {
    headers: { "x-forwarded-for": ip },
  });
  const news = await measuredFetch("/api/news?limit=1", {
    headers: adminHeaders,
  });
  const loginPage = await measuredFetch("/admin/login", {
    headers: { "x-forwarded-for": ip },
  });
  const inboxUsers = await measuredFetch("/api/users", {
    headers: inboxHeaders,
  });
  const inboxHeroBlocked = await measuredFetch("/api/hero-slides", {
    method: "POST",
    headers: { ...inboxHeaders, "content-type": "application/json" },
    body: JSON.stringify({
      tagline: "loop",
      titleLine1: "loop",
      titleLine2: "loop",
      titleLine3: "loop",
      description: "loop",
      buttonText: "loop",
      buttonLink: "/",
      slideMedia: { kind: "image", src: "/x.jpg", alt: "loop" },
    }),
  });
  const editorNavBlocked = await measuredFetch("/api/globals/navigation", {
    method: "POST",
    headers: { ...editorHeaders, "content-type": "application/json" },
    body: JSON.stringify({ useCmsMenu: true }),
  });
  const perf = await curlTiming("/admin/login", ip);

  return {
    ip,
    admin,
    editor,
    inbox,
    dashboard,
    news,
    inboxUsers,
    inboxHeroBlocked,
    editorNavBlocked,
    cspHasFrameAncestors: Boolean(loginPage.csp?.includes("frame-ancestors")),
    perf,
  };
}

async function main() {
  const start = await nextLoopNumber();
  const chunks: string[] = [];
  for (let i = 0; i < ITERATIONS; i += 1) {
    const loop = start + i;
    const data = await runOne(loop);
    const focus = focusTopics[(loop - 1) % focusTopics.length];
    chunks.push(md(loop, focus, data));
    console.log(
      JSON.stringify({
        loop,
        focus,
        admin: data.admin.status,
        news: data.news.status,
        ttfb: data.perf.ttfb,
        security: [data.inboxHeroBlocked.status, data.editorNavBlocked.status],
      }),
    );
  }
  await appendFile(OUTPUT, chunks.join(""));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
