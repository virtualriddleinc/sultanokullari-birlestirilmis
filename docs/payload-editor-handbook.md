# Editör El Kitabı — Sultan Okulları CMS

Bu belge yönetim panelinde içerik düzenleyenler içindir. Teknik kurulum için [`payload-kurulum.md`](./payload-kurulum.md) dosyasına bakın.

## Hızlı başlangıç (30 dk)

1. `http://localhost:5001/admin` adresine giriş yapın.
2. Dashboard'dan **Siteyi önizle** ile canlı siteyi açın.
3. **Ana Sayfa Düzeni** global'ından bir metin değiştirin → kaydedin → sitede kontrol edin.
4. **Hero Slaytları** listesinde bir slayt düzenleyin.
5. **Haberler** → yeni kayıt → **Taslak** olarak kaydedin → **Canlı Önizleme** sekmesini açın.
6. **Gelen Kutusu** → yeni mesaj açıldığında otomatik **Okundu** olur.

## Rol matrisi

| İşlem | Editör | Yönetici |
|---|---|---|
| İçerik oluşturma/düzenleme | ✓ | ✓ |
| Haber/etkinlik/sayfa **yayınlama** | ✗ (taslak) | ✓ |
| Medya yükleme | ✓ | ✓ |
| Gelen kutusu okuma | ✓ | ✓ |
| Kullanıcı yönetimi | Yalnızca kendi hesabı | ✓ |
| Site Ayarları global | ✓ | ✓ |

## Koleksiyon → site eşlemesi

| Panel | Site rotası |
|---|---|
| Hero / Yolculuk / Neden / Instagram | Ana sayfa ilgili bölüm |
| Şubeler | `/okullarimiz/[il]/[kampüs]`, footer, iletişim |
| Kurumsal Sayfalar | `/kurumsal/[slug]` veya sabit rotalar |
| Haberler | `/guncel/haberler` + `/guncel/haberler/[slug]` |
| Etkinlikler | `/guncel/etkinlikler` + `/guncel/etkinlikler/[slug]` |
| İdari Kadro | `/kurumsal/idari-kadro` |

## Yayın iş akışı

- **Taslak:** Sitede görünmez; Canlı Önizleme ile kontrol edilir.
- **Yayınlandı:** Anında sitede görünür (`revalidatePath`).
- Editör kayıtları otomatik taslak kalır; yönetici yayınlar.

## Sorun giderme

| Sorun | Çözüm |
|---|---|
| Admin `not-found` | Oturumu kapatıp tekrar giriş; editör hesabı `/api/users/me` erişimini kontrol edin |
| Sıralama 403 | Koleksiyon listesinde `_order` sıralaması kullanın; migration uygulayın |
| Önizleme açılmıyor | `.env.local` → `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL` |
| Değişiklik yansımıyor | Kayıt durumunun **Yayınlandı** olduğunu doğrulayın; sayfayı hard refresh |
| Boş CMS uyarısı | `npm run seed:all` veya ilgili seed komutu |
| Özel bileşen hatası | `npm run generate:importmap` |

## Yayın öncesi kontrol listesi

- [ ] Taslak olmayan kayıtlar yayınlandı mı?
- [ ] Medya alt metinleri dolu mu?
- [ ] Şube slug/URL alanları doğru mu?
- [ ] `npm run cms:health` temiz mi?
- [ ] `npm run typecheck` ve `npm run build` başarılı mı?
