# CMS İyileştirme Raporu

## Faz 4 — TestSprite seed temizliği

### Yalın özet

- Admin test hesabı korundu; editör ve gelen kutusu test kullanıcıları privilege smoke için tutuldu.
- TestSprite geçici iletişim mesajları temizlendi; IK ve taslak haber tarafında silinecek spam bulunmadı.
- Seed scripti artık örnek içerik üretmez, yalnızca test kullanıcılarını garanti eder ve TestSprite izli geçici kayıtları temizler.

### Teknik özet

- `src/scripts/seed-testsprite-admin.ts`, `admin@admin.com`, `editor@test.local`, `inbox@test.local` kullanıcılarını güncel rollerle koruyacak şekilde sadeleştirildi.
- `contact-messages`, `ik-applications` ve `news` koleksiyonlarında `TestSprite`, `ts-new`, `ts-read`, `ts-arch`, `ts-ik` izleri taranıp siliniyor.
- 2026-07-14 çalıştırmasında `deletedContacts=4`, `deletedIk=0`, `deletedDraftNews=0` sonucu alındı.

# CMS İyileştirme Operasyon Raporu

Bu rapor, mevcut çalışma ağacında tamamlanmış görünen Faz 1-3 CMS iyileştirmelerini ve ağaçta yer alan güvenlik/medya çalışmalarını belgelendirir. Şema düzeltmeleri, Cloud DB drift temizliği veya 100 döngülük test çalışması bu raporun kapsamına alınmadı; yalnızca tamamlanmış işlerin operasyon etkisi yazıldı.

## 1. Numarasız CMS menü etiketleri

### Yalın özet

Yönetim panelindeki ana sayfa odaklı içerik alanları editörler için daha sade hale getirildi. Daha önce sıralama hissi veren veya teknik görünen menü isimleri yerine "Hero", "Yolculuk", "Neden Sultan", "Instagram" ve "Ana Sayfa Düzeni" gibi doğrudan anlaşılır başlıklar kullanılıyor. Editör paneli açtığında hangi bölümü düzenleyeceğini numara takip etmeden seçebiliyor; bu da eğitim ihtiyacını azaltıyor ve yanlış bölüme girme riskini düşürüyor. Ana sayfa sekmelerinde de bölümün sitedeki karşılığı açıkça yazıldığı için editör, tekil ayarların nereden geldiğini ve tekrar eden içeriklerin hangi koleksiyondan yönetildiğini daha kolay anlıyor.

### Teknik özet

- İlgili koleksiyon etiketleri `src/collections/HeroSlides.ts`, `src/collections/JourneyChapters.ts`, `src/collections/NedenSultanItems.ts` ve `src/collections/InstagramPosts.ts` içinde sadeleştirildi; `plural` değerleri panel menüsünde kısa bölüm adı olarak kullanılıyor.
- Ana sayfa global yapılandırması `src/globals/AnaSayfa.ts` içinde `label: "Ana Sayfa Düzeni"` olarak duruyor ve sekmeler "Gâyemiz", "Yolculuk", "Neden Sultan", "Tanıtım Videosu", "Okullarımız", "Güncel", "Instagram", "Kısa Yollar", "Yemekhane" ve "Sizi Arayalım Modal" şeklinde düzenlenmiş.
- `src/payload/admin-groups.ts` içinde ana editoryal grup `ADMIN_GROUPS.home = "Ana Sayfa"` olarak tanımlı; ilgili koleksiyonlar bu gruba bağlı.
- İlgili bölümlerde canlı önizleme ve revalidation hook'ları korunuyor: hero ve Instagram `homeRevalidateHooks`, Neden Sultan `homeAndNedenRevalidateHooks`, Ana Sayfa globali `revalidateAnaSayfaAfterChange` kullanıyor.
- Bilinen test durumu: Bu rapor yazılırken schema/test komutları çalıştırılmadı; mevcut kaynak ağacındaki tamamlanmış değişiklikler dokümante edildi.
- Risk: Cloud DB şeması eski alan adlarını tutuyorsa panel etiketleri doğru görünse bile veri eşleşmesi için ayrı schema drift düzeltmesi gerekebilir.

## 2. Yeşil/bal köpüğü admin tema

### Yalın özet

Yönetim paneli Sultan Okulları marka kimliğine daha yakın bir görünüme taşındı. Giriş ekranı bal köpüğü tonları, yeşil vurgu rengi ve petek deseniyle daha kurumsal bir karşılama sunuyor. Panel içindeki butonlar, odak çizgileri, yan menü aktif durumları ve giriş kartı markayla uyumlu hale getirildi. Editör ve yöneticiler için bu değişiklik işlevsel davranışı değiştirmeden panelin daha tanıdık, daha güven verici ve daha az jenerik görünmesini sağlıyor.

### Teknik özet

- Marka token'ları `src/styles/sultan-brand.scss` içinde `--sultan-green`, `--sultan-honey`, `--sultan-charcoal`, yüzey, border, radius ve shadow değişkenleri olarak tanımlı.
- Admin kabuğu `src/styles/admin/shell.scss` içinde bu token'ları kullanıyor; sidebar, aktif link, focus-visible, primary/secondary button, login formu ve dashboard koleksiyon alanı özelleştirilmiş.
- Petek arka planı `public/honeycomb.svg` ile sağlanıyor; login ekranında ve marka panelinde `url("/honeycomb.svg")` olarak kullanılıyor.
- Login görünümü `template-minimal.login` seçicileriyle bal köpüğü gradyan, petek overlay, geniş marka kartı ve yeşil CTA davranışı kazanıyor.
- Dashboard tarafında `src/components/payload/admin/DashboardWelcome.tsx`, rol bazlı hızlı bağlantılar ve Sultan Okulları başlığıyla bu tema dilini destekliyor.
- CSP etkisi: Petek SVG yerel `public` varlığı olduğu için `img-src 'self'` kapsamına giriyor; harici domain ihtiyacı yok.
- Risk: Payload admin DOM sınıfları sürüm değişimlerinde değişirse `shell.scss` seçicilerinin bir kısmı yeniden uyarlanabilir.

## 3. Rol görünürlüğü ve Users ayrıcalık koruması

### Yalın özet

Panelde herkesin aynı menüyü görmesi yerine rolüne uygun bir görünüm hedeflendi. Yönetici tüm sistemi, editör içerik üretimi ve düzenlemeyi, gelen kutusu rolü ise iletişim/İK başvurularını görür. Böylece gelen kutusu kullanıcıları ana sayfa, medya veya sistem ayarları gibi alanlara yönlendirilmez; editörler de kullanıcı listesi üzerinden gereksiz yetki alanlarına girmeden kendi hesaplarını yönetir. Kullanıcı rolü değiştirme gibi kritik işlemler yöneticiyle sınırlandırıldığı için yanlışlıkla veya kötüye kullanımla yetki yükseltme riski azaltıldı.

### Teknik özet

- Merkezi görünürlük yardımcıları `src/payload/admin-visibility.ts` içinde tanımlı: `hideFromInboxOnly`, `hideUnlessAdmin`, `hideUsersFromInbox`, `userPrimaryRole`, `isInboxOnly`.
- İçerik koleksiyonları ve `AnaSayfa` için `hideFromInboxOnly` kullanılıyor; admin/editor içerik alanlarını görürken inbox-only kullanıcı sidebar'da bu alanlardan ayrıştırılıyor.
- Kritik ayarlar `Navigation`, `SiteAyarlari` ve `AuditLogs` için `hideUnlessAdmin` kullanıyor; giriş yapmamış veya admin olmayan kullanıcıya bu menüler gizleniyor.
- `Users` koleksiyonu `hideUsersFromInbox` ile listede admin dışına kapatılıyor; `usersCollectionAccess` admin için tam yetki, diğer roller için self-only okuma/güncelleme kuralı uyguluyor.
- `src/collections/Users.ts` `beforeChange` hook'u, admin olmayan oturumlu aktör geldiğinde `data.roles` alanını siliyor; sistem/seed çağrılarında kullanıcı yoksa açık roller korunuyor. İlk kullanıcı admin, sonraki rolsüz kullanıcı editor fallback'i alıyor.
- `roles` alanında create/update access sadece admin rolüne açık ve `saveToJWT: true` ile token tarafına taşınıyor.
- Bilinen test/script desteği: `src/scripts/security-privilege-check.ts` admin/editor/inbox login, inbox hero create engeli, kullanıcı self-only görünümü, inbox admin rol yükseltme engeli, editor navigation güncelleme engeli ve admin navigation okuma kontrolü için smoke check sunuyor.
- Risk: Access kuralı API tarafında asıl güvenlik katmanı olmaya devam eder; admin sidebar gizleme yalnızca kullanıcı deneyimi ve yanlış yönlendirmeyi azaltır.

## 4. HexFocalPointPicker dirty/persist

### Yalın özet

Hero slaytlarında altıgen görselin odak noktası ve yakınlaştırması panelden daha güvenilir biçimde ayarlanabilir hale getirildi. Editör görseli seçip odak noktasını taşıdığında veya yakınlaştırmayı değiştirdiğinde bu değerlerin kayda yansıması hedeflendi. Bu, özellikle ana sayfa hero alanında yüz, logo veya önemli görsel detayların altıgen çerçeve içinde doğru yerde kalmasını sağlar. Panelde canlı önizleme ve reticle göstergesi, editöre kaydetmeden önce görünüm hakkında net geri bildirim verir.

### Teknik özet

- UI alanı `src/payload/fields/hex-focal-picker-field.ts` ile Payload `ui` field olarak `src/components/payload/admin/HexFocalPointPicker.tsx` bileşenine bağlanıyor.
- Hero koleksiyonu `src/collections/HeroSlides.ts` içinde `hexFocalPickerField()`, `focalPoint.x`, `focalPoint.y`, `mediaScale` ve read-only `mediaAspect` alanlarıyla birlikte çalışıyor.
- Bileşen `useField` ile `focalPoint.x`, `focalPoint.y`, `mediaScale`, `mediaAspect` değerlerini güncelliyor; değerler iki ondalığa yuvarlanıyor ve Payload `setValue` çağrısının ikinci argümanı ile form dirty/persist davranışı açıkça yönetiliyor.
- Medya URL çözümü upload objesi, dosya adı veya `/api/media/:id` fetch sonucundan yapılabiliyor; video ve görsel için ayrı load event'leriyle aspect ratio ölçülüyor.
- Odak noktası `clampFocalPoint` ile altıgen reticle sınırlarına göre kısıtlanıyor; scale değişiminde sonsuz döngüyü önlemek için effect bağımlılıkları sınırlı tutulmuş.
- Risk: Bu alan admin UI davranışına bağlıdır; Payload `useField` API'sindeki değişiklikler dirty flag semantiğini etkileyebilir. Ayrıca medya fetch'i yetki veya dosya URL farklarında boş önizleme gösterebilir.

## 5. Navigation admin.hidden `hideUnlessAdmin`

### Yalın özet

Site navigasyon yönetimi yalnızca yöneticilerin göreceği ve değiştireceği bir alana taşındı. Bu önemlidir çünkü üst menüde yapılacak hatalı bir değişiklik tüm ziyaretçilerin site gezintisini etkileyebilir. Editörler ana sayfa ve içerik düzenleme işlerine devam ederken, menü yapısı, ek bağlantılar ve sistemsel yönlendirme mantığı admin sorumluluğunda kalır. Böylece panel daha sade görünür ve kritik ayarlar daha kontrollü yönetilir.

### Teknik özet

- `src/globals/Navigation.ts` içinde `admin.hidden: hideUnlessAdmin` ve `access: adminOnlyGlobalAccess` birlikte kullanılıyor.
- `hideUnlessAdmin`, kullanıcı yoksa veya `admin` rolü yoksa menüyü gizler; API tarafında `adminOnlyGlobalAccess.update` yalnızca admin rolüne izin verir.
- Navigation globali `sections`, `extraLinks` ve `useCmsMenu` alanlarını içeriyor. `sections` yalnızca CMS menüsü açıkken condition ile gösteriliyor; `extraLinks` kod menüsüne ek link ekleme için ayrı tutuluyor.
- `afterChange` hook'u `revalidateSiteLayout()` ve `revalidateSitePaths("/", "/sitemap")` çağırıyor; ayrıca `createGlobalAuditAfterChange("navigation")` ile audit izi bırakıyor.
- Risk: Admin olmayan kullanıcı menüyü sidebar'da görmese bile güvenlik asıl access kuralına bağlıdır; frontend menü tüketimi boş CMS menüsü/kod menüsü fallback davranışını doğru yorumlamalıdır.

## 6. Media WebP/AVIF `imageSizes` ve Next images

### Yalın özet

Medya yüklemeleri daha hızlı ve daha modern görsel teslimata hazırlanmış durumda. Editörler yine görsel veya video yükler; sistem görseller için daha hafif WebP türevleri üretir ve site tarafında Next.js görsel optimizasyonu AVIF/WebP formatlarını tercih edebilir. Bu çalışma sayfa yüklenme süresini, bant genişliği kullanımını ve mobil deneyimi iyileştirmeyi hedefler. Medya kütüphanesinde alt metin zorunlu tutularak erişilebilirlik de editör akışının parçası haline getirilmiştir.

### Teknik özet

- `src/collections/Media.ts` upload ayarında `mimeTypes: ["image/*", "video/*"]`, 25 MB `beforeValidate` limiti ve zorunlu `alt` alanı bulunuyor.
- Payload upload `formatOptions` varsayılan olarak WebP kalite 82 kullanıyor; `thumbnail` 400x300 WebP kalite 78, `card` 800x600 WebP kalite 82, `hero` 1920 genişlik WebP kalite 85 ve `withoutEnlargement` ile tanımlı.
- `next.config.ts` `images.formats` içinde `["image/avif", "image/webp"]` tanımlıyor; bu AVIF desteği Next image delivery katmanındadır, Payload türevleri ise mevcut haliyle WebP üretir.
- `next.config.ts` `deviceSizes`, `imageSizes`, `minimumCacheTTL` ve `localPatterns` ile `/api/media/file/**`, `/_next/static/media/**`, `/images/**`, `/site-media/**`, `/videos/**` yollarını izinli tutuyor.
- CSP tarafında `img-src 'self' data: blob: https:` ve `media-src 'self' blob: https:` medya gösterimini destekliyor.
- Risk: Video dosyaları imageSizes işleminden geçmez; ayrıca Cloud DB veya storage katmanında eski medya kayıtları WebP türevlerini geriye dönük üretmeyebilir.

## 7. CSP ve güvenlik başlıkları

### Yalın özet

Site ve panel için temel tarayıcı güvenlik başlıkları eklendi. Bu başlıklar sayfanın başka sitelerde gömülmesini sınırlar, MIME türü kandırmacalarını azaltır, tarayıcının referer paylaşımını daha kontrollü yapar ve kamera/mikrofon/konum gibi izinleri kapatır. CSP politikası, mevcut Payload/Next çalışma ihtiyaçlarını karşılayacak şekilde görsel, medya, bağlantı ve form kaynaklarını sınırlar. Üretimde HSTS ile HTTPS kullanımı daha güçlü hale gelir.

### Teknik özet

- `next.config.ts` `headers()` fonksiyonu tüm route'lar için `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` ve `Content-Security-Policy` döndürüyor.
- CSP direktifleri: `default-src 'self'`, `script-src 'self' 'unsafe-inline' 'unsafe-eval'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: blob: https:`, `font-src 'self' data:`, `media-src 'self' blob: https:`, `connect-src 'self' https:`, `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`.
- Üretimde `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` ekleniyor.
- `src/proxy.ts` aynı başlıkları proxy yanıtlarına da uyguluyor ve `/api/users/login` POST istekleri için IP bazlı 15 dakikalık pencerede 20 deneme sınırı koyuyor.
- Proxy matcher `_next/static`, `_next/image`, favicon ve statik medya uzantılarını dışarıda bırakıyor; uygulama route'ları ve API akışı korunuyor.
- Risk: `unsafe-inline` ve `unsafe-eval` Payload/Next admin uyumluluğu için bırakılmış geniş izinlerdir; CSP sertleştirme ayrı regresyon testi gerektirir. Proxy rate limit süreç belleğinde tutulduğu için çoklu instance ortamında merkezi rate limit yerine geçmez.

## 8. `security-privilege-check.ts` script

### Yalın özet

Rol ve yetki çalışmalarının elle tekrar kontrol edilebilmesi için bir güvenlik smoke test script'i eklendi. Bu script, yerel çalışan Payload API'ye admin, editör ve gelen kutusu kullanıcılarıyla giriş yapmayı dener; ardından kritik yetki ihlallerini hızlıca yoklar. Amaç kapsamlı güvenlik denetimi yapmak değil, en riskli hataların geliştirme sırasında hızlı fark edilmesini sağlamaktır.

### Teknik özet

- Script `src/scripts/security-privilege-check.ts` altında bulunuyor ve `BASE=http://localhost:5001 npx tsx src/scripts/security-privilege-check.ts` kullanımını tarif ediyor.
- Kontroller JSON sonuç olarak `passed`, `failed` ve her test için `name/ok/detail` alanları basıyor; başarısızlık varsa process exit code `1` dönüyor.
- Kapsadığı senaryolar: admin login, editor login, inbox login, inbox rolünün hero create edememesi, inbox rolünün users listesinde self-only kalması, inbox kullanıcının admin rol yükseltme PATCH'i yapamaması, editor rolünün navigation globalini güncelleyememesi, admin kullanıcının navigation okuyabilmesi.
- Bu script mevcut access ve hook kurallarını uçtan uca API üzerinden yoklamak için tasarlanmış; seed kullanıcılarının varlığına ve yerel servis/DB durumuna bağlı.
- Risk: Script test kullanıcısı e-postalarını sabit kabul ediyor. Cloud DB drift veya eksik seed durumunda başarısızlık, ürün hatası yerine test ortamı eksikliğinden kaynaklanabilir.

## 9. Self-check notları ve kalan riskler

### Yalın özet

Bu rapor tamamlanmış işleri kayıt altına alır; devam eden schema düzeltmelerini veya kapsamlı test döngülerini tamamlanmış gibi göstermiyor. En önemli kalan risk, Cloud veritabanındaki şema veya veri durumunun kodla birebir aynı olmaması ihtimalidir. Ayrıca planlanan 100 iyileştirme döngüsü henüz tamamlanmış iş olarak yazılamaz; bu nedenle raporda yalnızca mevcut dosyalarda görülen operasyonlar yer aldı. Bu ayrım, kullanıcıya neyin hazır olduğunu ve neyin ayrıca doğrulanması gerektiğini açık gösterir.

### Teknik özet

- Kapsam yalnızca mevcut ağaçta bulunan Faz 1-3, güvenlik ve medya değişiklikleriyle sınırlandı.
- Schema drift riski: Payload tipleri/migrations/Cloud DB alanları arasında fark varsa admin UI doğru görünse bile kayıt/okuma sırasında uyumsuzluk oluşabilir. Kullanıcının talimatı gereği schema fix çalıştırılmadı ve beklenmedi.
- 100 loop çalışması henüz tamamlanmış kabul edilmedi; `docs/IMPROVEMENT_LOOPS.md` sadece takip dosyası olarak mevcut.
- Test riski: Bu dokümantasyon görevi için build, lint, schema veya API smoke test çalıştırılmadı; rapor kaynak incelemesine dayanıyor.
- Git riski: Çalışma ağacında çok sayıda kod/schema değişikliği başka ajan işi olarak duruyor. Bu rapor yalnızca yeni doküman dosyası olarak commitlenmelidir.

## Yaklaşan: 100 iyileştirme döngüsü

Bkz. `docs/IMPROVEMENT_LOOPS.md`. Bu başlık, tamamlandığında ayrı döngü raporuna bağlanacak stub olarak bırakıldı.

## Yaklaşan: final rapor

Bkz. `docs/FINAL_REPORT.md`. Bu başlık, tüm açık riskler kapatıldığında hazırlanacak final raporuna bağlanacak stub olarak bırakıldı.
