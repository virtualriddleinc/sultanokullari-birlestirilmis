# Editör El Kitabı — Sultan Okulları CMS

Bu belge yönetim panelinde içerik düzenleyenler içindir. Teknik kurulum için [`payload-kurulum.md`](./payload-kurulum.md) dosyasına bakın.

## Hızlı başlangıç (30 dk)

1. `http://localhost:5001/admin` adresine giriş yapın.
2. Dashboard'dan **Siteyi önizle** ile canlı siteyi açın.
3. **Ana Sayfa Düzeni** global'ından bir metin değiştirin → kaydedin → sitede kontrol edin.
4. **Hero Slaytları** listesinde bir slayt düzenleyin.
   - **Slayt medyası** ekledikten sonra **Canlı Odak Noktası** ile altıgen çerçevede görünecek alanı sürükleyerek seçin; gerekirse yakınlaştırmayı artırın.
   - Kaydettikten sonra ana sayfa hero slider’da aynı kırpma uygulanır.
5. **Haberler** → yeni kayıt → **Taslak** olarak kaydedin → **Canlı Önizleme** sekmesini açın.
6. **Gelen Kutusu** → yeni mesaj açıldığında otomatik **Okundu** olur.

## Rol matrisi

| İşlem | Editör | Gelen Kutusu | Yönetici |
|---|---|---|---|
| İçerik oluşturma/düzenleme | ✓ | ✗ | ✓ |
| Haber/etkinlik/sayfa/şube/kadro/medya arşivi **yayınlama** | ✗ (taslak) | ✗ | ✓ |
| Hero / Yolculuk / Neden / Instagram | ✓ (anında canlı) | ✗ | ✓ |
| Medya yükleme | ✓ | ✗ | ✓ |
| Gelen kutusu okuma | ✓ | ✓ | ✓ |
| Kullanıcı yönetimi | Yalnızca kendi hesabı | Yalnızca kendi hesabı | ✓ |
| Site Ayarları / Navigasyon | ✗ | ✗ | ✓ |
| Denetim kayıtları | ✗ | ✗ | ✓ |

## Anında canlı içerik

**Hero Slaytları**, **Yolculuk**, **Neden Sultan**, **Instagram** ve **Ana Sayfa Düzeni** taslak desteklemez — kayıt sonrası sitede hemen görünür. Dikkatli düzenleyin.

## Zamanlanmış yayın

Haber / Etkinlik / Sayfa kaydında **Zamanlanmış yayın** alanı (sidebar): gelecek tarih seçilirse kayıt taslakta kalır. Cron:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "$NEXT_PUBLIC_SERVER_URL/api/cron/publish-scheduled"
```

## Panel grupları

| Grup | Ne yönetir |
|---|---|
| **Ana Sayfa** | Düzen, hero, yolculuk, neden, Instagram |
| **İçerik** | Haberler, Etkinlikler, Sayfalar, Medya Arşivi, Medya Kütüphanesi |
| **Okullar** | Şubeler, İdari Kadro |
| **Gelen Kutusu** | İletişim mesajları, İK başvuruları, başvuru dosyaları |
| **Ayarlar** | Site Ayarları, Navigasyon, Kullanıcılar, Denetim Kayıtları |

## Koleksiyon → site eşlemesi

| Panel | Sitede nerede görünür |
|---|---|
| Ana Sayfa Düzeni | `/` bölüm başlıkları, yemekhane, modal |
| Hero / Yolculuk / Neden / Instagram | Ana sayfa ilgili bölüm |
| Şubeler | `/okullarimiz/...`, `/subeler/...`, footer, iletişim |
| Sayfalar | `/{pathPrefix}/{slug}` — kurumsal, eğitim, rehberlik… |
| Haberler (tür: Haber/Duyuru) | `/guncel/haberler` + detay + `#guncel` |
| Etkinlikler | `/guncel/etkinlikler` + detay + `#guncel` |
| Medya Arşivi | `/guncel/medya` |
| İdari Kadro | `/kurumsal/idari-kadro` |
| Site Ayarları | Footer e-posta/telefon, Instagram, OG görseli |
| Navigasyon | Üst menü (CMS menü açıkken tam menü; kapalıyken ek linkler) + `/sitemap` |

## Yeni sayfa ekleme

1. **İçerik → Sayfalar → Oluştur**
2. Başlık, slug, **URL öneki** (ör. `egitim`), **şablon** seçin
3. Overlay şablonunda hikâye satırları + galeri doldurun; blok şablonunda bölüm ekleyin
4. **Yayınla** (yönetici) → site: `/{öneki}/{slug}`
5. İsteğe bağlı: **Ayarlar → Navigasyon** ile menüye ekleyin

## Yayın iş akışı

- **Taslak:** Sitede görünmez; Canlı Önizleme ile kontrol edilir.
- **Yayınlandı:** Anında sitede görünür (`revalidatePath`).
- Editör kayıtları otomatik taslak kalır; yönetici yayınlar.
- Versiyon geçmişi: kayıt başına en fazla 25 sürüm (geri alma admin UI’dan).

## Sorun giderme

| Sorun | Çözüm |
|---|---|
| Admin `not-found` | Oturumu kapatıp tekrar giriş |
| Önizleme açılmıyor | `.env.local` → `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL` |
| Değişiklik yansımıyor | Kayıt **Yayınlandı** mı? Hard refresh |
| Footer eski bilgi | Site Ayarları kaydedildi mi? (yalnızca yönetici) |
| Boş CMS uyarısı | `npm run seed:all` |
| Özel bileşen hatası | `npm run generate:importmap` |
| Form spam / captcha | Üretimde `RECAPTCHA_SECRET_KEY` zorunlu |

## Yayın öncesi kontrol listesi

- [ ] Taslak olmayan kayıtlar yayınlandı mı?
- [ ] Medya alt metinleri dolu mu?
- [ ] Şube slug/URL alanları doğru mu?
- [ ] `npm run cms:health` temiz mi?
- [ ] `npm run typecheck` ve `npm run build` başarılı mı?
- [ ] SMTP / `INBOX_NOTIFY_EMAIL` tanımlı mı?
- [ ] Üretimde güçlü `PAYLOAD_SECRET` (≥32) var mı?
