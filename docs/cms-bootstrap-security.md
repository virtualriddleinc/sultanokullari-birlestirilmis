# CMS bootstrap ve auth güvenliği

## Özet

`/admin/create-first-user` sayfası tek başına sürekli açık bir admin fabrikası değildir; asıl risk **`users = 0` iken** public bootstrap yarışıdır. Payload özelliği kaldırılmaz; production’da **fail-closed** + **DB atomik kilit** + seed ile kapatılır.

Şifre sıfırlama (`forgot` / `reset`) **aynı risk sınıfında değildir** — yeni admin yaratmaz; mevcut hesap recovery’sidir.

## Katmanlar

| Katman | Ne yapar |
|---|---|
| `cms_bootstrap_lock` + advisory lock | TOCTOU: yalnızca bir bootstrap claim |
| `proxy.ts` | Secret, CSRF Origin, rate limit, `/init` maskesi, SMTP yoksa forgot 403 |
| Users access | Prod’da anonymous create kapalı |
| Users hook | İlk create’te roles zorla `admin`; lock conflict → 403/409 |
| UI | Fail-closed / kilitli sistemde “yapılandırılmış” mesajı |
| `seed-admin.ts` | Break-glass kurtarma |

## `FIRST_USER_BOOTSTRAP_SECRET`

- Vercel Production/Preview env’de saklanır (≥32 rastgele karakter). Git’e yazılmaz.
- Env **yoksa** production/preview’da `POST /api/users/first-register` → **403** (fail-closed).
- Acil kullanım: `x-bootstrap-secret` header ile API; normal operasyonda **seed tercih edilir**.
- Sızıntı: secret’ı rotate et, bootstrap loglarını incele.
- Secret kaybı: public UI açılmaz. Break-glass:

```bash
SEED_ADMIN_EMAIL='admin@example.com' \
SEED_ADMIN_PASSWORD='uzun-guclu-sifre-16+' \
ALLOW_PROD_SEED=true \
npx tsx src/scripts/seed-admin.ts
```

## Son admin silinirse

`cms_bootstrap_lock` satırı **silinmez** → public create-first-user yeniden açılmaz. Kurtarma yalnızca `seed-admin` (veya secret’lı API).

## Rate limit (Postgres)

Tablo: `cms_rate_limit_buckets`. Eşikler: login 20/15dk, first-register 5, forgot 5, reset 10, init 30. Aşımda `429` + `Retry-After`.

## Forgot password

Production/preview’da `SMTP_HOST` yoksa `POST /api/users/forgot-password` → **403**.

## Vercel Firewall (öneri)

`/api/users/first-register` ve `/admin/create-first-user` için ek rate/geo kuralı operasyon checklist’ine eklenebilir. `BOOTSTRAP_ALLOWED_IPS` env ile IP allowlist opsiyoneldir.

## Supabase

RLS bu riski çözmez (Payload `sultan_app` ile bağlanır). `anon`/`authenticated` grant’i olmamalı; seed script’ler production’a koşturulmamalı (`seed-testsprite-admin` engelli).
