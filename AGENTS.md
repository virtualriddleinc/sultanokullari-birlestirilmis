<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Supabase auth (yerel geliştirme)

Sultan Okulları e-posta onayı + şifre sıfırlama + yönetici onaylı kullanıcı akışını **Supabase Auth** ile sağlar (hearing-crm know-how uyarlaması). Payload admin paneli (`/admin`) bundan bağımsızdır ve kendi PostgreSQL'ini kullanır.

**Kritik gotcha — Next.js 16 middleware `src/proxy.ts`'tir** (`middleware.ts` DEĞİL). Güvenlik başlıkları (CSP dâhil) ve login rate-limit burada uygulanır; CSP değişiklikleri `next.config.ts`'te değil **`src/proxy.ts`**'te yapılmalıdır. Supabase'e tarayıcıdan bağlanabilmek için `connect-src` yerel Supabase URL'sini (`http://127.0.0.1:54321`) içerir.

**Yerel Supabase yığınını çalıştırma** (Docker + `supabase` CLI snapshot'ta kuruludur):
- Docker daemon'ı başlat (systemd yok): `sudo dockerd &` gerekiyorsa; ardından repo kökünde
  `supabase start -x analytics,vector,realtime,storage,imgproxy,studio,edge-runtime,functions`
  (analytics/vector kaynak kısıtlarında sağlıksız olabildiği için hariç tutulur; **db + auth + rest + inbucket** yeterli).
- Anahtarlar `.env.local` içinde (git-ignore): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (bunlar tüm yerel Supabase kurulumlarında aynı demo değerleridir).
- Şema `supabase/migrations/` altında; uygulamak için `supabase migration up`. `supabase/config.toml`: e-posta onayı açık (`enable_confirmations = true`), **hCaptcha kapalı** (captcha bölümü yok), `site_url = http://localhost:5001`.
- **RLS + GRANT zorunlu:** yeni tablolar için `authenticated`/`service_role` rollerine tablo GRANT'ı verilmezse RLS öncesi "permission denied for table" alınır. `profiles` için `grant select ... to authenticated` ve `grant select,insert,update,delete ... to service_role` migration'da tanımlıdır.
- **E-posta testi:** yerel Inbucket/Mailpit arayüzü `http://127.0.0.1:54324` — onay ve şifre sıfırlama e-postaları buraya düşer (gerçek SMTP gerekmez).

**Auth rotaları:** `/hesap/kayit`, `/hesap/giris`, `/hesap/dogrulama` (onay kapısı), `/hesap/sifremi-unuttum`, `/hesap/sifre-sifirla`, `/hesap/onay` (yönetici onay), `/hesap` (hesap ana sayfası) ve `/auth/callback` (e-posta bağlantısı → PKCE kod değişimi). İlk kaydolan kullanıcı otomatik olarak `is_admin + approved` olur (onaylayıcı hesap); sonrakiler yönetici onayı bekler.
