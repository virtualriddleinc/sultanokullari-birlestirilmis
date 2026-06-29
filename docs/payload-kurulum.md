# PayloadCMS Kurulumu

Sultan Okulları birleştirme projesinde içerik yönetimi PayloadCMS 3 `/admin` paneli üzerinden yapılır. Admin paneli **tamamen Türkçe** arayüzle çalışır.

## Gereksinimler

- Node.js 20.9+
- Docker (yerel PostgreSQL için)

## Yerel geliştirme

### Veritabanı (Docker yoksa)

Yerel Homebrew PostgreSQL kullanıyorsanız:

```bash
bash integrations/postgres/setup-local.sh
```

### Sunucu

1. PostgreSQL'in çalıştığından emin olun.

```bash
docker compose up -d postgres   # Docker varsa
```

2. Ortam değişkenlerini oluşturun:

```bash
cp .env.example .env.local
```

`.env.local` içinde `PAYLOAD_SECRET`, `PREVIEW_SECRET` ve `NEXT_PUBLIC_SERVER_URL=http://localhost:5001` tanımlı olmalıdır.

3. Veritabanı migration'larını uygulayın:

```bash
npm run payload migrate
```

Şema değişikliği yaptıysanız önce `npm run payload migrate:create <ad>` çalıştırın, ardından `migrate`.

4. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Site: `http://localhost:5001` — Admin: `http://localhost:5001/admin`

5. İlk admin kullanıcısını oluşturun ve **Roller** alanından **Yönetici** seçin.

6. İçerik seed komutları:

```bash
npm run seed:homepage   # Ana sayfa
npm run seed:pages      # Hakkımızda, burs sayfaları
npm run seed:events     # (isteğe bağlı) örnek etkinlik
```

## Admin paneli yapısı

Girişte **özel dashboard** görünür: taslak sayıları, okunmamış form mesajları, hızlı eylemler ve site önizleme linki.

### Ana Sayfa

| Admin girişi | Site bölümü |
|---|---|
| Ana Sayfa Düzeni | Sekmeli: Gâyemiz, Yolculuk başlığı, Neden Sultan, Tanıtım, Okullarımız, Güncel, Instagram, Kısa Yollar, Sizi Arayalım modal |
| 1 · Hero Slaytları | Hero slider |
| 3 · Yolculuk Bölümleri | `#yolculuk` |
| 4 · Neden Sultan Maddeleri | `#neden` + kurumsal sayfa |
| 8 · Instagram Gönderileri | `#instagram` |

### Site İçeriği

| Admin girişi | Kullanım |
|---|---|
| Şubeler | `#okullarimiz`, kampüs sayfaları, iletişim, footer |
| Kurumsal Sayfalar | `/kurumsal/hakkimizda`, `/kurumsal/burs-olanaklari` vb. |
| Etkinlikler | `#guncel`, `/guncel/etkinlikler` |
| Haberler | `#guncel`, `/guncel/haberler` |

### Gelen Kutusu

| Admin girişi | Kaynak |
|---|---|
| İletişim Mesajları | İletişim formu + Sizi Arayalım modal |
| İK Başvuruları | İnsan Kaynakları formu |

Durum alanı: **Yeni → Okundu / İncelendi → Arşiv**

### Sistem

| Admin girişi | Kullanım |
|---|---|
| Medya Kütüphanesi | Görsel/video yüklemeleri |
| Kullanıcılar | Panel girişi ve roller |

## Kullanıcı rolleri

| Rol | Yetki |
|---|---|
| **Yönetici** | Tam erişim; kullanıcı yönetimi dahil |
| **Editör** | İçerik, medya, globals, form gelen kutusu; kullanıcı yönetimi yok |

Yeni kullanıcılar varsayılan olarak **Editör** rolü alır. İlk kurulumda en az bir **Yönetici** atayın.

Yalnızca **yayınlanmış** (`published`) haber ve etkinlik kayıtları sitede görünür.

## Değişiklikler sitede ne zaman görünür?

Kayıt sonrası **anında** yansır. Payload `afterChange` hook'ları `revalidatePath` çağırır; CMS tüketen sayfalar `force-dynamic` ile cache'lenmez.

Haber/etkinlik için **Taslak** durumundaki kayıtlar normal sitede görünmez; **Canlı Önizleme** ile görülebilir.

## Ana sayfa test checklist

| Panel | Beklenen |
|---|---|
| Ana Sayfa Düzeni → Gâyemiz başlığı | Ana sayfa metin güncellemesi |
| Hero Slaytları | Slider içeriği |
| Yolculuk / Neden / Instagram listeleri | Sürükle-bırak sıra + ilgili bölüm |
| Haber/Etkinlik (Yayınlandı) | `#guncel` bölümü |
| Şubeler | `#okullarimiz`, footer, iletişim |

## Canlı önizleme

1. `.env.local` dosyasında `PREVIEW_SECRET` ve `NEXT_PUBLIC_SERVER_URL` tanımlı olmalıdır.
2. Admin panelinde bir kayıt veya global düzenlerken **Canlı Önizleme** sekmesini açın.
3. Kaydettiğinizde iframe otomatik yenilenir; mobil/masaüstü breakpoint'leri panelden seçilebilir.

**Önizleme çalışmıyorsa:** `.env.local` içinde `PREVIEW_SECRET` ve `NEXT_PUBLIC_SERVER_URL=http://localhost:5001` olduğundan emin olun; dev sunucusunu yeniden başlatın.

## Admin regression checklist (v3)

| Test | Beklenen |
|---|---|
| Editör `/admin/account` | Hesap sayfası açılır, 403 yok |
| Hero listesi sürükle-bırak | Sıra kaydedilir, ana sayfa güncellenir |
| Gelen kutusu kayıt açma | Otomatik okundu, sayfa reload yok |
| Toplu arşiv (liste seçimi) | Seçili kayıtlar güncellenir |
| Sidebar gelen kutusu badge | Yeni mesaj/İK sayısı görünür |
| Haber taslak | Sitede görünmez; önizleme çalışır |
| Kurumsal sayfa taslak | `/kurumsal/[slug]` yayınlanmamış içerik göstermez |
| `npm run check:importmap` | Eksik bileşen yok |
| `npm run cms:health` | DB bağlantısı ve seed uyarıları |

Detaylı editör rehberi: [`docs/payload-editor-handbook.md`](./payload-editor-handbook.md)

## Bildirimler

Yeni form kayıtları için `.env.local` içine virgülle ayrılmış alıcılar:

```bash
INBOX_NOTIFY_EMAIL=editor@sultanokullari.com,admin@sultanokullari.com
```

SMTP yapılandırılmamışsa bildirimler yalnızca sunucu loguna yazılır.

## Yararlı komutlar

```bash
npm run generate:importmap   # Özel admin bileşenleri sonrası
npm run check:importmap      # importMap CI doğrulaması
npm run generate:types       # payload-types.ts üretimi
npm run payload migrate:create <ad>  # Şema değişikliği
npm run payload migrate      # Migration uygula
npm run seed:all             # Tüm seed komutları
npm run cms:health           # DB + boş koleksiyon kontrolü
npm run seed:homepage
npm run seed:pages
npm run payload              # Payload CLI
```

## Üretim veritabanı

PostgreSQL bağlantı dizesini `DATABASE_URL` ortam değişkenine verin. `push: false` kullanıldığı için üretimde migration'ları CI/CD ile uygulayın.
