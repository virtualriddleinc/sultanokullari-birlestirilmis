description: Sultan Okulları Resmî Web Sitesi projesi için temel mimari, içerik, navigasyon ve UI/UX kuralları. Her kodlama oturumunda referans alınmalıdır.
globs: \*
alwaysApply: true

Sultan Okulları Resmî Web Sitesi - Proje Geliştirme Kuralları

Bu dosya, Sultan Okulları Resmî Web Sitesi web projesinin geliştirilmesinde insan geliştiriciler ve AI (Cursor) asistanları için tek referans kaynağıdır. Temel web geliştirme şablon rehberindeki kuralların bu projeye özel uygulanmış halidir.

1. Proje Kimliği ve Kaynaklar

GitHub Reposu: [github.com/virtualriddleinc/sultan-okullari-resmi-sitesi]

Proje Amacı: Sultan Okulları Resmî Web Sitesi'ni geliştirerek mevcut ve potansiyel öğrenci ve velilere hizmet sunmaktır. Okulun tanıtımını ve okula erişilebilirliği sağlamayı amaçlamaktadır.

İçerik Kaynağı (Kritik): Sitede kullanılacak tüm metinler, başlıklar, açıklamalar ve yönlendirme etiketleri docs/content/site-metin-icerigi.pdf dosyasından alınacaktır. AI asistanı hiçbir metin üretmeyecek, metin gerektiğinde doğrudan bu dosyaya başvuracaktır. Bu dosyadaki hiçbir kelimede dahi değişiklik yapılmayacaktır.

Marka Renkleri:

Okul Yeşil Tonu [#4cff00 ]

Bal köpüğü Tonu [#fff085]

2. Site Haritası ve Mega Menü Yapısı

Uygulamanın ana navigasyon (Header) yapısı aşağıdaki gibi olacaktır. Tasarım ve yönlendirmeler (Routing) bu hiyerarşiye sıkı sıkıya bağlı kalmalıdır.

Ana Navigasyon (Header)

[Ana Menü Başlığı 1 - Kurumsal] (Tıklandığında/Hover'da Mega Menü Açılacak)

[Ana Menü Başlığı 2 - Eğitim] (Tıklandığında/Hover'da Mega Menü Açılacak)

[Ana Menü Başlığı 3 - Akademik] (Tıklandığında/Hover'da Mega Menü Açılacak)

[Ana Menü Başlığı 4 - Rehberlik & Veli] (Tıklandığında/Hover'da Mega Menü Açılacak)

[Ana Menü Başlığı 5 - Okullarımız] (Tıklandığında/Hover'da Mega Menü Açılacak)

Mega Menü İçeriği:

KURUMSAL

[Kurumsal Kimliğimiz] -> [/kurumsal/kurumsal-kimligimiz]

[Niyetimiz ve İstikametimiz] -> [/kurumsal/niyetimiz-istikametimiz]

[Nesil Tasavvurumuz] -> [/kurumsal/nesil-tasavvurumuz]

[Kurumsal Değerlerimiz] -> [/kurumsal/kurumsal-degerlerimiz]

EĞİTİM

[Sultan Mektep Modeli & Kademeler] -> [/egitim/kademeler]

[Nebevî Eğitim ve Kur'an-i Kerîm] -> [/egitim/nebevi-egitim]

[Değerler ve Mânevî Eğitim] -> [/egitim/degerler-egitimi]

AKADEMİK

[Akademik Gelişim ve Takip] -> [/akademik/gelisim]

[Yabancı Dil & Atölyeler] -> [/akademik/yabanci-dil]

REHBERLİK & VELİ

[Rehberlik ve Eğitim Koçluğu] -> [/rehberlik/egitim-koclugu]

[Sultanda Veli Olmak & Veli Akademisi] -> [/rehberlik/veli]

SULTANDA YAŞAM

[Rehberlik ve Eğitim Koçluğu] -> [/yasam/sultanda-yasam]

OKULLARIMIZ

[İstanbul - Sancaktepe] -> [/okullarimiz/istanbul/sancaktepe]

[Kocaeli - Başiskele] -> [/okullarimiz/kocaeli/basiskele]

[Sakarya - Serdivan] -> [/okullarimiz/sakarya/serdivan]

[Ankara - Sincan] -> [/okullarimiz/ankara/sincan]

[Konya - Mevlânâ] -> [/okullarimiz/konya/mevlana]

3. Teknoloji Yığını ve Bileşen Stratejisi

Bu projede aşağıdaki yığın ve sürümler sabitlenmiştir:

Çatı (Framework): Next.js (App Router) + TypeScript + React 19.

Stil: Tailwind CSS v4 (CSS-first @theme yapılandırması; tasarım token'ları src/app/globals.css içinde).

Bileşen Kiti (Hibrit Strateji): Bileşen ihtiyaçlarında aşağıdaki öncelik sırası uygulanır:

1. Öncelik: Headless UI + Heroicons (erişilebilir, hafif, pazarlama/kurumsal site odaklı).
2. İhtiyaç karşılanmazsa: shadcn/ui + Radix (components.json hazırdır; "npx shadcn@latest add <bilesen>" ile eklenir, neutral temel renk katmanı globals.css'te tanımlı).
3. Son çare: Tailwind + lucide-react ile özel çözüm.

Ek Kütüphaneler:

- Form ve doğrulama: react-hook-form + zod + @hookform/resolvers.
- Animasyon: framer-motion (prefers-reduced-motion ile uyumlu kullanılacak).
- Kod kalitesi: Prettier (+ prettier-plugin-tailwindcss) ve eslint-config-prettier.

Backend: Supabase şimdilik kurulmamıştır; ihtiyaç doğduğunda integrations/supabase altında eklenecektir.

Stil yardımcısı: Sınıf birleştirme için src/lib/utils.ts içindeki cn() (clsx + tailwind-merge) kullanılacaktır.

Komutlar: npm run dev | build | start | lint | typecheck | format.

4. Geliştirme ve UI/UX Disiplinleri

Proje boyunca temel rehberdeki kurallar harfiyen uygulanacaktır:

İçerik Tek Kaynağı: Sitedeki hiçbir metin koda "hardcoded" (elle uydurularak) yazılmamalıdır. Mutlaka docs/content/site-metin-icerigi.pdf okunmalı ve oradaki kopya kullanılmalıdır.

Hizalama ve Grid Disiplini (Göz Kararı Yok):

Tasarımdaki tüm elemanlar görünmez bir CSS Grid veya Flexbox sistemine oturmalıdır.

3 Eksen Kuralı: Başlangıç/Bitiş (Start/End), Merkez (Center), Taban Çizgisi (Baseline) hizalamaları kesin olarak items-center, items-start, items-baseline gibi Tailwind sınıflarıyla sağlanmalıdır.

Sola/sağa yaslı elemanlarda girinti ve çıkıntı çarpıklıkları kesinlikle kabul edilmez.

Fluid Tasarım (Sürekli Ölçekleme):

Sabit pixel font boyutları yerine clamp() fonksiyonu kullanılacaktır.

Sabit px cinsinden padding/margin yerine rem ve viewport (vw) orantılı boşluklar tercih edilecektir.

Responsive (Mobil Öncelikli):

Tasarım minimum 360px genişlikten 1920px genişliğe kadar pürüzsüz çalışmalıdır.

Yapısal kırılımlar (örneğin tek sütundan mega menüye geçiş) md (768px) veya lg (1024px) breakpoint'lerinde Tailwind prefixleri ile yönetilecektir.

5. Klasör Yapısı (Özellik Bazlı)

Uygulama hiyerarşisi aşağıdaki gibi organize edilecektir:

src/
app/ # Next.js App Router (Sayfalar ve Layout)
components/
ui/ # Temel UI bileşenleri (Button, Input vb.)
layout/ # Header, Footer, MegaMenu
features/ # İş mantığı ve özellik bazlı modüller
[ozellik_1]/ # Örn: auth, products, contact
components/
hooks/
lib/ # Yardımcı fonksiyonlar (utils, cn)
types/ # Global TypeScript arayüzleri

6. Grid ve Hizalama Tercihleri

Bu başlık, sıfıra sıfır hizalama ilkesini ve proje genelindeki layout kararlarını belgelemektedir.
Her yeni section veya bileşen oluşturulurken aşağıdaki kurallara uyulacaktır.

6.1 Grid Sistemi

Proje genelinde 8 kolonlu, tam genişlikte (full-bleed) bir grid sistemi esas alınmıştır:

- Kolon sayısı: 8
- Gutter: 20px (--grid-gutter)
- Margin: 5px (--layout-margin)
- Genişlik: tam ekran (max-width yok)
- Birim tercihi: rem / vw (clamp ile fluid)

  6.2 Sıfıra Sıfır Hizalama İlkesi (Dikey Eksenler)

Bir section'ın sol kenarı, üstündeki header'ın ilk nav-link-header butonunun görsel sol kenarıyla; sağ kenarı ise son nav-link-header butonunun görsel sağ kenarıyla tam olarak örtüşmelidir.

"Görsel kenar" ifadesi, CSS Grid kolon sınırını değil, butonun ekranda kapladığı kutuyu (bounding rect) ifade eder.

Bu hizalamayı garantilemek için şu iki kural birlikte uygulanır:

Kural A — Nav butonları tam kolon genişliğinde olmalıdır:
Nav butonlarına justify-self: stretch; justify-content: center; uygulanır.
Böylece butonun sol kenarı = kolon sol sınırı. Justify-self: center kullanılmaz;
bu değer butonu kolon içinde ortalar ve bounding rect'i daraltarak hizalama kaymasına yol açar.

Kural B — Section grid'lerinin outer gutter sütunları padding-inline kullanmaz:
Section grid'lerinde (örneğin hero-section-grid) padding-inline yerine,
ekran solundan nav kolon başlangıcına olan mesafenin tamamı
tek bir explicit grid sütununa baked-in edilir:

grid-template-columns:
calc(var(--layout-margin) + clamp(1rem, 2.5vw, 2.5rem) + var(--grid-gutter)) /_ sol outer gutter _/
1fr
...
calc(var(--layout-margin) + clamp(1rem, 2.5vw, 2.5rem) + var(--grid-gutter)); /_ sağ outer gutter _/

padding-inline kullanıldığında dev tools bu alanı ayrı bir şerit olarak gösterir ve
outer gutter sütunu yanlış genişlikte algılanır.

6.3 Dış Gutter (Outer Gutter) Hesabı

Ekran solundan (x=0) KURUMSAL butonunun sol kenarına (veya simetrik olarak sağda) olan toplam mesafe:
var(--layout-margin) + clamp(1rem, 2.5vw, 2.5rem) + var(--grid-gutter)
= 5px + [fluid 16–40px] + 20px

Bu değer nav-header-grid'in padding + buffer sütunu + column-gap toplamına eşittir.
Section grid'lerinin outer gutter sütunları bu değerle tanımlanır; sütunlar arasında column-gap kullanılmaz.

6.4 Merkez Gutter (Center Gutter)

İki içerik sütunu arasındaki merkez boşluk, bağımsız bir grid sütunu olarak tanımlanır:
var(--grid-gutter) /_ = 20px _/

column-gap ile sağlanmaz; aksi hâlde outer kenarlar da gapped olur ve hesap karmaşıklaşır.

6.5 Satır Sistemi (Row System)

Hero section ve benzeri tam ekranlı section'larda satır yükseklikleri şu kurala göre hesaplanır:

- Satır 1 (üst boşluk / logo sarkma): sabit px değeri veya token (--hero-top-spacer)
- Satır 2 (ana içerik): calc(100svh - var(--header-height) - var(--hero-top-spacer))
  ← Sayfa ilk açıldığında kaydırma gerektirmeden tam viewport'u doldurur.
- Satır 3 (alt geçiş / wave): token (--hero-bottom-spacer), viewport dışında yer alır.

svh (small viewport height) kullanılır; mobil tarayıcı adres çubuğu kaymasından etkilenmez.

6.6 Genel Hizalama Tercihleri

- Bir bileşen kendi grid hücresini tam olarak doldurmalı; hücre içinde konumlandırma için
  justify-self ve align-self kullanılır, margin ile sağlanmaz.
- Merkez hizalama gereken bileşenlerde justify-content: center + align-items: center
  (flex konteynerde) ya da place-items: center (grid konteynerde) tercih edilir.
- Sola/sağa hizalı öğelerde kenar hizası kesinlikle görsel kolon sınırıyla örtüşür;
  "yaklaşık" veya "gözle" hizalama kabul edilmez.
- Nav başlıklarında justify-self: center yasaktır (bkz. Kural A).

7. Grid Kullanım Disiplini — Layout-First Geliştirme Yaklaşımı

Herhangi bir bileşen, section veya sayfa tasarımına başlamadan önce grid sistemi tam ve doğru
biçimde kurulmalıdır. Tasarım detayları (renkler, tipografi, görseller) grid oturuncaya kadar
eklenmez. Bu kural, hizalama sorunlarını geliştirme aşamasında değil başlangıçta engeller.

─────────────────────────────────────────────────────────────────────────────
7.1 Geliştirme Sırası (Zorunlu Akış)
─────────────────────────────────────────────────────────────────────────────

Her yeni section için şu sıra takip edilir; hiçbir adım atlanamaz:

1. Grid token'larını belirle
   Hangi kolon sayısı, gutter ve margin kullanılacağını kararlaştır.
   Projenin mevcut token'larından (--grid-gutter, --layout-margin) sapılmaz;
   yeni section'a özel token gerekiyorsa :root'a eklenmeden önce bu dosyada belgelenir.

2. Kolon şablonunu yaz
   grid-template-columns'u explicit olarak tanımla. "auto" veya belirsiz değer kullanma.
   Her sütunun amacını (outer gutter / içerik / merkez ayraç) yorum satırıyla belirt.

3. Satır şablonunu yaz
   grid-template-rows'u explicit olarak tanımla. Satır yüksekliklerini token veya
   calc() ile ifade et; hiçbir satır yüksekliği gözle tahmin edilmez.

4. Grid öğelerini yerleştir
   Her içerik öğesini col-start / col-end / row-start / row-end ile hücrelerine ata.
   Tarayıcının otomatik yerleştirmesine (auto-placement) güvenilmez; istisnalar
   bilinçli olarak yapılır ve yorum satırıyla açıklanır.

5. Hizalamayı doğrula (dev tools)
   Tarayıcının Grid Inspector'ını aç. Her sütun sınırı ve satır sınırı
   beklenen x/y koordinatına denk geldiğini görsel olarak doğrula.
   Özellikle outer gutter'ın nav-link-header ile sıfıra sıfır örtüştüğünü teyit et.

6. İçerik ve tasarımı ekle
   Yalnızca grid doğrulandıktan sonra renk, yazı tipi, görsel ve animasyon eklenir.

─────────────────────────────────────────────────────────────────────────────
7.2 Token Yönetimi
─────────────────────────────────────────────────────────────────────────────

Proje genelinde kullanılan grid token'ları globals.css'teki @theme veya :root bloğunda
tanımlanır ve tüm section'lar bu token'lara başvurur:

--grid-gutter : 20px — sütunlar arası standart boşluk
--layout-margin : 5px — sayfa kenarı ile grid arasındaki mesafe
--header-height : 90px — header yüksekliği (row hesaplarında kullanılır)
--hero-top-spacer : 107px — hero row-1 yüksekliği (logo sarkma payı)
--hero-bottom-spacer: clamp(4rem, 8vw, 7rem) — wave ayraç satırı

Yeni bir section için ek token gerekiyorsa isimlendirme şeması:
--[section-adı]-[özellik]: değer
Örn: --contact-map-height: clamp(300px, 50vw, 600px);

─────────────────────────────────────────────────────────────────────────────
7.3 Kolon Tanımlama Kuralları
─────────────────────────────────────────────────────────────────────────────

A) Outer gutter sütunları daima explicit olarak tanımlanır:

Doğru:
grid-template-columns:
calc(var(--layout-margin) + clamp(1rem, 2.5vw, 2.5rem) + var(--grid-gutter)) /_ outer sol _/
1fr
1fr
calc(var(--layout-margin) + clamp(1rem, 2.5vw, 2.5rem) + var(--grid-gutter)); /_ outer sağ _/

Yanlış — padding-inline ile outer boşluk bırakmak:
padding-inline: var(--layout-margin); /_ dev tools'da ayrı şerit gösterir _/
grid-template-columns: 1fr 1fr;

B) column-gap yalnızca tüm sütunlar arasında eşit boşluk istenen simetrik grid'lerde
kullanılır. Outer gutterları içerik sütunlarından farklı genişlikte tutmak gerektiğinde
column-gap kullanılmaz; boşluklar explicit sütunlarla tanımlanır.

C) İçerik sütunları 1fr cinsinden yazılır. Belirli bir orana ihtiyaç varsa
minmax(0, 1fr) kullanılır; minmax(0, 1fr) ile 1fr farkı bilinçli olarak seçilir.
(minmax(0,1fr) → overflow taşmasını önler; 1fr → minimum kolon boyutu content'e göre)

D) Sabit genişlikli sütunlar (örn. merkez ayraç, kenar boşluğu) var() veya px ile yazılır:
var(--grid-gutter) — standart 20px ayraç
clamp(1rem, 2.5vw, 2.5rem) — fluid buffer sütun

E) Tüm sütunların toplamı viewport genişliğine eşit olmalıdır. Hesap şöyle doğrulanır:
2 × outer_gutter + Σ(içerik sütunları) + Σ(iç ayraçlar) = %100 genişlik

─────────────────────────────────────────────────────────────────────────────
7.4 Satır Tanımlama Kuralları
─────────────────────────────────────────────────────────────────────────────

A) Her satırın amacı yorum satırıyla belirtilir:
grid-template-rows:
var(--hero-top-spacer) /_ logo sarkma payı _/
calc(100svh - var(--header-height) - var(--hero-top-spacer)) /_ ana içerik _/
var(--hero-bottom-spacer); /_ geçiş ayracı _/

B) Sayfa yüklendiğinde scroll gerektirmeyen "above-the-fold" içerik için ana içerik satırı
daima calc(100svh - sabit_yükseklikler_toplamı) formülüyle hesaplanır.
svh kullanılır (mobile adres çubuğu kaymasına karşı).

C) İçeriğe göre boyutlanan satırlar auto kullanır. Ancak auto kullanan satır,
komşu sabit satırlarla birlikte hesaplanarak beklenmedik taşmaya yol açmaz.

D) row-gap kullanılmaz; satırlar arası boşluk explicit satır tanımıyla sağlanır.

─────────────────────────────────────────────────────────────────────────────
7.5 Grid Öğesi Yerleştirme Kuralları
─────────────────────────────────────────────────────────────────────────────

A) Her öğe en az col-start / col-end veya row-start / row-end ile konumlandırılır.
Grid otomatik yerleştirmesine yalnızca tekrar eden, simetrik kartlarda izin verilir
(örn. Okullarımız kartları). İztisnalar kod yorumuna yazılır.

B) col-span-X yerine col-start / col-end kullanımı tercih edilir; bu sayede
öğenin grid üzerindeki kesin konumu okunabilir.

C) Bir öğe birden fazla sütunu kapsıyorsa (col-span-full gibi) bu karar bilinçli
seçilmiş ve yorum satırıyla açıklanmıştır.

D) Grid öğeleri z-index ile katmanlanıyorsa (örneğin header'ın hero üstüne binmesi),
z-index değerleri token olarak tanımlanır ve çakışma riski analiz edilir:
z-[1000]: header
z-[2]: header iç elemanlar
z-[1]: hero section ve diğer içerik

─────────────────────────────────────────────────────────────────────────────
7.6 Hücre İçi Hizalama Kuralları
─────────────────────────────────────────────────────────────────────────────

A) Grid hücresindeki bir öğeyi konumlandırmak için justify-self / align-self
kullanılır. margin: auto hücre içi ortalamada kullanılabilir ancak tercih edilmez.

B) Hücreyi tam dolduran öğeler için justify-self: stretch; align-self: stretch (veya
varsayılan) korunur. Gereksiz yere center veya start eklenmez.

C) Flex konteynerlerde yatay ortalama için justify-content: center,
dikey ortalama için align-items: center kullanılır.
Kısayol: place-items: center (grid konteynerlerde hem yatay hem dikeydir).

D) Nav butonlarında justify-self: center kesinlikle kullanılmaz (§6.2 Kural A).
Tüm tıklanabilir nav öğeleri justify-self: stretch alır; içerik ortalama
butonun iç flex/grid yapısıyla sağlanır.

─────────────────────────────────────────────────────────────────────────────
7.7 Responsive Grid Kuralları
─────────────────────────────────────────────────────────────────────────────

A) Grid kırılım noktaları yalnızca Tailwind CSS breakpoint prefixleriyle yönetilir:
sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

B) Mobil varsayılan (320-1023px): tek sütun veya 2 sütunlu basitleştirilmiş grid.
Desktop (1024px+): 8 kolonlu tam grid.

C) Fluid değerler (clamp, vw) sütun genişliklerinde breakpoint sayısını azaltır.
Bir değer iki breakpoint arasında düzgün geçiş yapıyorsa sabit breakpoint eklenmez.

D) Responsive kırılımda kolon ve satır yapısı değişse de token'lar sabit kalır.
Token değerleri breakpoint içinde override edilmez; yalnızca grid-template-columns
yeniden tanımlanır.

─────────────────────────────────────────────────────────────────────────────
7.8 Flexbox ile CSS Grid Arasında Seçim
─────────────────────────────────────────────────────────────────────────────

CSS Grid kullan:

- İki boyutlu (hem satır hem sütun) layout gerektiğinde
- Section / sayfa yapısı gibi makro düzeyde konumlandırmada
- Dikey ve yatay sütun sınırlarının diğer elementlerle hizalanması gerektiğinde
- Öğe konumlarının birbirinden bağımsız kontrol edilmesi gerektiğinde

Flexbox kullan:

- Tek boyutlu (yalnızca satır veya yalnızca sütun) layout gerektiğinde
- Bir sıradaki kartlar, buton grupları, nav öğeleri gibi mikro düzeyde
- İçeriğe göre boyutlanan eleman dizilerinde

İkisi birlikte kullanılır:

- Grid ana konteyneri (section) kurar, flex içerik hücrelerini düzenler.
- Grid öğeleri flex konteynere dönüştürülebilir; iç hizalamayı flex yönetir.

─────────────────────────────────────────────────────────────────────────────
7.9 Yaygın Hatalar ve Yasaklar
─────────────────────────────────────────────────────────────────────────────

YASAK — padding-inline ile outer gutter oluşturmak:
Yanlış: padding-inline: var(--layout-margin);
Doğru: outer gutter explicit kolon olarak tanımlanır (bkz. §7.3-A)

YASAK — margin ile grid hizalaması yapmak:
Yanlış: margin-left: 40px; (gözle tahmin)
Doğru: col-start / col-end ile doğru hücreye yerleştir

YASAK — sabit px kolon genişlikleri (fluid olmayan değerler):
Yanlış: grid-template-columns: 200px 1fr 200px;
Doğru: calc(var(--layout-margin) + clamp(...) + var(--grid-gutter)) 1fr ...

YASAK — gözle "yaklaşık" hizalama:
Grid Inspector'da sütun sınırı ile öğe kenarı arasında herhangi bir piksel farkı
düzeltilmeden geçilmez.

YASAK — grid düzeni tasarım detaylarıyla aynı anda kurmak:
Önce layout, sonra tasarım. Renk ve tipografi eklemeden önce grid doğrulanmalıdır.

YASAK — column-gap'i outer gutter için kullanmak:
column-gap tüm komşu sütunlara eşit aralık uygular. Outer ve inner gutterın farklı
olduğu durumlarda column-gap kullanılmaz; her boşluk explicit sütunla tanımlanır.

─────────────────────────────────────────────────────────────────────────────
7.10 Grid Doğrulama Kontrol Listesi
─────────────────────────────────────────────────────────────────────────────

Bir section kodu tamamlandığında aşağıdaki her madde tarayıcı Grid Inspector ile
teyit edilir; onaylanmayan section PR'a alınmaz:

[ ] Outer gutter sol kenarı nav ilk nav-link-header sol kenarıyla sıfıra sıfır örtüşüyor
[ ] Outer gutter sağ kenarı nav son nav-link-header sağ kenarıyla sıfıra sıfır örtüşüyor
[ ] Tüm içerik sütunları symmetrik (sol == sağ içerik genişliği, gerektiğinde)
[ ] Satır 2 yüksekliği scroll olmadan tam viewport dolduruyor (above-the-fold)
[ ] padding-inline sıfır ya da kullanılmıyor
[ ] column-gap yalnızca içerik sütunları arasında kullanılıyor (outer gutter hariç)
[ ] Her grid öğesi explicit col/row ile yerleştirilmiş
[ ] 360px, 768px, 1024px, 1440px genişliklerinde görsel bozukluk yok

8. AI (Cursor) İçin Talimatlar

Sevgili AI Asistanı, bu projede kod yazarken şu kurallara dikkat et:

Bir bileşen oluşturmadan önce daima docs/content/site-metin-icerigi.pdf dosyasına bakarak ilgili sayfanın metinlerini çek.

"Lorem Ipsum" kullanmaktan kaçın; bağlam yoksa kullanıcıdan bilgi iste.

UI kodlarken gap, padding ve hizalama konularında mükemmelliyetçi ol. flex ve grid yapılarını rastgele değil, bilinçli bir matris mantığıyla kur.

Bileşen isimlerinde PascalCase, dosya isimlerinde kebab-case kullan (örn: MegaMenu.tsx yerine mega-menu.tsx veya tercih edilen yapıya göre).
