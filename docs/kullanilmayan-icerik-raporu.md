# Kullanılmayan içerik raporu

**Üretim tarihi:** 2026-07-15  
**Araç:** `python3 scripts/find-unused-content.py`  
**Kapsam:** `public/` medya ↔ `src/` + `scripts/` string referansları

> Bu rapor dosya silmez. Payload CMS veritabanındaki path referansları statik taramaya dahil değildir — silmeden önce CMS’i de kontrol edin.

## Özet

| Metrik | Değer |
|---|---|
| Toplam public medya | 293 |
| Kodda referanslı | 286 |
| Disk yetimi | 7 |
| Yetim toplam boyut | 2.7 MB |
| Ölü `headerMedia` anahtarı | 0 / 2 |
| `social-media` ↔ `site-media` çift | 1 |

## 1. Disk yetimleri (kategori)

| Kategori | Dosya | Boyut |
|---|---:|---:|
| `site-media-root` | 7 | 2.7 MB |

### Tam liste

| Boyut | Path | Kategori |
|---:|---|---|
| 151 KB | `/site-media/IMG-20260429-WA0041.jpg` | site-media-root |
| 1.3 MB | `/site-media/IMG-20260429-WA0106.jpg` | site-media-root |
| 369 KB | `/site-media/IMG-20260429-WA0112.jpg` | site-media-root |
| 162 KB | `/site-media/IMG-20260429-WA0129.jpg` | site-media-root |
| 222 KB | `/site-media/IMG-20260429-WA0131.jpg` | site-media-root |
| 260 KB | `/site-media/IMG-20260429-WA0135.jpg` | site-media-root |
| 196 KB | `/site-media/IMG-20260429-WA0138.jpg` | site-media-root |

## 2. Ölü registry — `headerMedia`

[`src/content/site-media.ts`](../src/content/site-media.ts) içinde tanımlı; aynı dosya dışında `headerMedia.<anahtar>` tüketimi:

| Anahtar | Ref | Durum |
|---|---:|---|
| `insanKaynaklari` | 1 | kullanılıyor |
| `atolyeler` | 1 | kullanılıyor |

**Kullanılan:** `insanKaynaklari`, `atolyeler`

> Ölü anahtar ≠ silinebilir dosya. Aynı medya `PAGE_MEDIA`, `heroMedia` veya galeri üzerinden hâlâ kullanılıyor olabilir.

## 3. Duplikasyon — `social-media` ↔ `site-media`

Instagram fallback [`src/content/instagram.ts`](../src/content/instagram.ts) `/social-media/` yolunu kullanır. Aşağıdaki dosyalar `site-media/` altında da vardır:

| Dosya | social-media | site-media kopyası |
|---|---:|---|
| `VID-20260429-WA0161.mp4` | 2.2 MB | hayır |
| `VID-20260429-WA0163.mp4` | 3.0 MB | hayır |
| `VID-20260429-WA0165.mp4` | 4.8 MB | evet |
| `VID-20260429-WA0168.mp4` | 3.9 MB | hayır |
| `VID-20260429-WA0169.mp4` | 6.2 MB | hayır |
| `VID-20260429-WA0178.mp4` | 2.1 MB | hayır |
| `VID-20260429-WA0179.mp4` | 3.6 MB | hayır |
| `VID-20260429-WA0180.mp4` | 1.8 MB | hayır |

## 4. Arşiv / kaynak (runtime değil)

| Path | Boyut | Rol |
|---|---:|---|
| `src/content/Web Sitesi İçerik Çalışması .pdf` | 243 KB | kaynak-arsiv |
| `src/content/_pdf-extract.txt` | 37 KB | kaynak-arsiv |
| `src/content/_pdf-paragraphs.txt` | 36 KB | kaynak-arsiv |
| `src/content/_docx-extract.txt` | 23 KB | kaynak-arsiv |
| `docs/reference/design-v2-source/` | — | arsiv-referans-kod |

Ayrıca gitignore’lu ham kaynaklar (siteye servis edilmez):

- `Görsel/` — galeri import kaynağı
- `media/` — staging

## 5. Temiz bulunanlar

- `public/site-media/gallery/` üretim havuzu ↔ `src/content/gallery-media.generated.ts` (`.tmp.jpg` artıkları hariç) kod referanslarıyla uyumlu kabul edilir.
- `src/content/*.ts` metin katalogları sayfa veya seed tarafından import ediliyor; yetim sayfa metni tespit edilmedi.
- Mega menüde olmayan sayfalar sitemap / home CTA ile bağlı.

## 6. Temizlik önerisi (uygulanmadı)

En yüksek disk kazancı (onay sonrası):

1. `/videos/sanat.mov` + `/videos/sanat-poster.jpg`
2. Kök `/site-media/` WA dump yetimleri
3. Scaffold SVG’ler (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
4. Kullanılmayan logo kopyaları ve `ankara.jpg` (kod `ankara.png` bekliyor)
5. Galeri `*.tmp.jpg` import artıkları (varsa)

## Notlar

- Payload CMS DB path referansları bu taramanın dışındadır.
- Ölü headerMedia anahtarı, işaret ettiği dosyanın başka registry üzerinden kullanıldığı anlamına gelebilir.
- Bu script dosya silmez.

Raporu yenilemek için:

```bash
python3 scripts/find-unused-content.py --markdown docs/kullanilmayan-icerik-raporu.md
```
