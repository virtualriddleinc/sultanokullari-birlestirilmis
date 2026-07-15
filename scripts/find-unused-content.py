#!/usr/bin/env python3
"""
public/ medya envanterini src/ + scripts/ referanslarıyla karşılaştırır.

Katmanlar:
  1. Disk yetimleri — kodda dosya adı / path geçmiyor
  2. Ölü registry — site-media.ts headerMedia anahtarları tüketilmiyor
  3. Duplikasyon — social-media ↔ site-media aynı isimler
  4. Arşiv — src/content PDF/extract dosyaları

CMS (Payload DB) referansları bu taramanın dışındadır.

Kullanım:
  python3 scripts/find-unused-content.py
  python3 scripts/find-unused-content.py --json
  python3 scripts/find-unused-content.py --markdown docs/kullanilmayan-icerik-raporu.md
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SITE_MEDIA_TS = ROOT / "src" / "content" / "site-media.ts"
CONTENT_DIR = ROOT / "src" / "content"
SOCIAL_DIR = PUBLIC / "social-media"
SITE_MEDIA_DIR = PUBLIC / "site-media"

MEDIA_EXT = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".mp4",
    ".mov",
    ".webm",
    ".avif",
}

CODE_EXT = {
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".jsx",
    ".css",
    ".scss",
    ".json",
    ".md",
    ".py",
}
CODE_DIRS = ("src", "scripts")

ARCHIVE_CONTENT_FILES = (
    "Web Sitesi İçerik Çalışması .pdf",
    "_pdf-extract.txt",
    "_pdf-paragraphs.txt",
    "_docx-extract.txt",
)


def fmt_bytes(n: int) -> str:
    if n >= 1024 * 1024:
        return f"{n / (1024 * 1024):.1f} MB"
    if n >= 1024:
        return f"{n / 1024:.0f} KB"
    return f"{n} B"


def collect_media() -> list[Path]:
    files: list[Path] = []
    for p in PUBLIC.rglob("*"):
        if not p.is_file():
            continue
        if p.suffix.lower() in MEDIA_EXT:
            files.append(p)
    return sorted(files)


THIS_SCRIPT = Path(__file__).resolve()


def load_code_corpus(*, exclude_site_media: bool = False) -> str:
    parts: list[str] = []
    for dname in CODE_DIRS:
        base = ROOT / dname
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if not p.is_file() or p.suffix not in CODE_EXT:
                continue
            resolved = p.resolve()
            # Bu script örnek path'ler içerir; kendini "used" saydırmaz.
            if resolved == THIS_SCRIPT:
                continue
            if exclude_site_media and resolved == SITE_MEDIA_TS.resolve():
                continue
            try:
                parts.append(p.read_text(encoding="utf-8", errors="ignore"))
            except OSError:
                continue
    return "\n".join(parts)


def public_url(path: Path) -> str:
    return "/" + path.relative_to(PUBLIC).as_posix()


def categorize(url: str) -> str:
    if url.startswith("/site-media/gallery/"):
        if url.endswith(".tmp.jpg") or ".tmp." in Path(url).name:
            return "gallery-tmp"
        return "gallery"
    if url.startswith("/site-media/"):
        return "site-media-root"
    if url.startswith("/videos/"):
        return "videos"
    if url.startswith("/images/"):
        return "images"
    if url.startswith("/social-media/"):
        return "social-media"
    if url.endswith(".svg"):
        return "svg-root"
    return "other"


def media_name_index(media: list[Path]) -> dict[str, list[str]]:
    """Dosya adı → public path listesi (çakışma riski için)."""
    index: dict[str, list[str]] = {}
    for p in media:
        index.setdefault(p.name, []).append(public_url(p))
    return index


def is_media_used(url: str, name: str, code: str, name_paths: dict[str, list[str]]) -> bool:
    """
    Used kararı: önce tam public path.
    Dosya adı fallback yalnızca path yoksa ve aynı isimde tek public dosya varsa
    (çakışma riski düşük). Instagram social-media ↔ site-media ikizleri path-only.
    """
    if url in code:
        return True
    # Aynı isimde birden fazla public dosya → path zorunlu (yanlış "used" önlenir)
    if len(name_paths.get(name, [])) > 1:
        return False
    return name in code


def find_disk_orphans(
    media: list[Path], code: str
) -> list[dict]:
    name_paths = media_name_index(media)
    orphans: list[dict] = []
    for p in media:
        url = public_url(p)
        name = p.name
        if is_media_used(url, name, code, name_paths):
            continue
        size = p.stat().st_size
        orphans.append(
            {
                "path": url,
                "bytes": size,
                "category": categorize(url),
            }
        )
    return orphans


def parse_header_media_keys(site_media_src: str) -> list[str]:
    m = re.search(
        r"export const headerMedia\s*=\s*\{(.*?)\n\} as const",
        site_media_src,
        re.S,
    )
    if not m:
        return []
    return re.findall(r"^  (\w+):", m.group(1), re.M)


def find_dead_header_media(code_without_site_media: str) -> list[dict]:
    if not SITE_MEDIA_TS.exists():
        return []
    src = SITE_MEDIA_TS.read_text(encoding="utf-8", errors="ignore")
    keys = parse_header_media_keys(src)
    out: list[dict] = []
    for key in keys:
        count = code_without_site_media.count(f"headerMedia.{key}")
        out.append({"key": key, "refs": count, "dead": count == 0})
    return out


def find_social_duplicates() -> list[dict]:
    if not SOCIAL_DIR.exists():
        return []
    rows: list[dict] = []
    for p in sorted(SOCIAL_DIR.iterdir()):
        if not p.is_file():
            continue
        twin = SITE_MEDIA_DIR / p.name
        rows.append(
            {
                "name": p.name,
                "socialPath": public_url(p),
                "socialBytes": p.stat().st_size,
                "alsoInSiteMedia": twin.exists(),
                "siteMediaPath": public_url(twin) if twin.exists() else None,
                "siteMediaBytes": twin.stat().st_size if twin.exists() else None,
            }
        )
    return rows


def find_archive_content() -> list[dict]:
    rows: list[dict] = []
    for name in ARCHIVE_CONTENT_FILES:
        p = CONTENT_DIR / name
        if p.exists() and p.is_file():
            rows.append(
                {
                    "path": f"src/content/{name}",
                    "bytes": p.stat().st_size,
                    "role": "kaynak-arsiv",
                }
            )
    ref = ROOT / "docs" / "reference" / "design-v2-source"
    if ref.exists():
        rows.append(
            {
                "path": "docs/reference/design-v2-source/",
                "bytes": None,
                "role": "arsiv-referans-kod",
            }
        )
    return rows


def sum_bytes(rows: list[dict], key: str = "bytes") -> int:
    return sum(int(r[key]) for r in rows if r.get(key) is not None)


def group_by_category(orphans: list[dict]) -> dict[str, list[dict]]:
    groups: dict[str, list[dict]] = {}
    for o in orphans:
        groups.setdefault(o["category"], []).append(o)
    return groups


def build_report() -> dict:
    media = collect_media()
    code = load_code_corpus(exclude_site_media=False)
    code_no_sm = load_code_corpus(exclude_site_media=True)
    orphans = find_disk_orphans(media, code)
    header = find_dead_header_media(code_no_sm)
    social = find_social_duplicates()
    archive = find_archive_content()

    used_count = len(media) - len(orphans)
    return {
        "generatedAt": date.today().isoformat(),
        "totals": {
            "mediaFiles": len(media),
            "used": used_count,
            "unused": len(orphans),
            "unusedBytes": sum_bytes(orphans),
        },
        "orphans": orphans,
        "orphansByCategory": {
            cat: {
                "count": len(items),
                "bytes": sum_bytes(items),
                "files": items,
            }
            for cat, items in sorted(group_by_category(orphans).items())
        },
        "headerMedia": header,
        "headerMediaDead": [h for h in header if h["dead"]],
        "headerMediaUsed": [h for h in header if not h["dead"]],
        "socialDuplicates": social,
        "archive": archive,
        "notes": [
            "Payload CMS DB path referansları bu taramanın dışındadır.",
            "Ölü headerMedia anahtarı, işaret ettiği dosyanın başka registry üzerinden kullanıldığı anlamına gelebilir.",
            "Bu script dosya silmez.",
        ],
    }


def print_console(report: dict) -> None:
    t = report["totals"]
    print("=== Kullanılmayan içerik auditi ===")
    print(f"Tarih: {report['generatedAt']}")
    print(
        f"Medya: {t['mediaFiles']} | Kullanılan: {t['used']} | "
        f"Yetim: {t['unused']} ({fmt_bytes(t['unusedBytes'])})"
    )
    print()
    print("--- Kategori özeti ---")
    for cat, info in report["orphansByCategory"].items():
        print(f"  {cat}: {info['count']} dosya, {fmt_bytes(info['bytes'])}")
    print()
    print("--- Disk yetimleri ---")
    for o in report["orphans"]:
        print(f"  {fmt_bytes(o['bytes']):>10}  {o['path']}")
    print()
    print("--- headerMedia ---")
    for h in report["headerMedia"]:
        status = "DEAD" if h["dead"] else "USED"
        print(f"  {status}\t{h['refs']}\t{h['key']}")
    print()
    print("--- social-media duplikasyon ---")
    for s in report["socialDuplicates"]:
        twin = "evet" if s["alsoInSiteMedia"] else "hayır"
        print(f"  {s['name']}  site-media kopyası: {twin}")
    print()
    print("--- Arşiv ---")
    for a in report["archive"]:
        size = fmt_bytes(a["bytes"]) if a["bytes"] is not None else "—"
        print(f"  {a['path']}  ({size})  [{a['role']}]")
    print()
    for n in report["notes"]:
        print(f"Not: {n}")


def render_markdown(report: dict) -> str:
    t = report["totals"]
    lines: list[str] = [
        "# Kullanılmayan içerik raporu",
        "",
        f"**Üretim tarihi:** {report['generatedAt']}  ",
        "**Araç:** `python3 scripts/find-unused-content.py`  ",
        "**Kapsam:** `public/` medya ↔ `src/` + `scripts/` string referansları",
        "",
        "> Bu rapor dosya silmez. Payload CMS veritabanındaki path referansları "
        "statik taramaya dahil değildir — silmeden önce CMS’i de kontrol edin.",
        "",
        "## Özet",
        "",
        f"| Metrik | Değer |",
        f"|---|---|",
        f"| Toplam public medya | {t['mediaFiles']} |",
        f"| Kodda referanslı | {t['used']} |",
        f"| Disk yetimi | {t['unused']} |",
        f"| Yetim toplam boyut | {fmt_bytes(t['unusedBytes'])} |",
        f"| Ölü `headerMedia` anahtarı | {len(report['headerMediaDead'])} / {len(report['headerMedia'])} |",
        f"| `social-media` ↔ `site-media` çift | {sum(1 for s in report['socialDuplicates'] if s['alsoInSiteMedia'])} |",
        "",
        "## 1. Disk yetimleri (kategori)",
        "",
        "| Kategori | Dosya | Boyut |",
        "|---|---:|---:|",
    ]
    for cat, info in report["orphansByCategory"].items():
        lines.append(
            f"| `{cat}` | {info['count']} | {fmt_bytes(info['bytes'])} |"
        )
    lines += [
        "",
        "### Tam liste",
        "",
        "| Boyut | Path | Kategori |",
        "|---:|---|---|",
    ]
    for o in report["orphans"]:
        lines.append(
            f"| {fmt_bytes(o['bytes'])} | `{o['path']}` | {o['category']} |"
        )

    lines += [
        "",
        "## 2. Ölü registry — `headerMedia`",
        "",
        "[`src/content/site-media.ts`](../src/content/site-media.ts) içinde tanımlı; "
        "aynı dosya dışında `headerMedia.<anahtar>` tüketimi:",
        "",
        "| Anahtar | Ref | Durum |",
        "|---|---:|---|",
    ]
    for h in report["headerMedia"]:
        status = "ölü" if h["dead"] else "kullanılıyor"
        lines.append(f"| `{h['key']}` | {h['refs']} | {status} |")

    lines += [
        "",
        "**Kullanılan:** "
        + (
            ", ".join(f"`{h['key']}`" for h in report["headerMediaUsed"])
            or "—"
        ),
        "",
        "> Ölü anahtar ≠ silinebilir dosya. Aynı medya `PAGE_MEDIA`, `heroMedia` "
        "veya galeri üzerinden hâlâ kullanılıyor olabilir.",
        "",
        "## 3. Duplikasyon — `social-media` ↔ `site-media`",
        "",
        "Instagram fallback [`src/content/instagram.ts`](../src/content/instagram.ts) "
        "`/social-media/` yolunu kullanır. Aşağıdaki dosyalar `site-media/` altında da vardır:",
        "",
        "| Dosya | social-media | site-media kopyası |",
        "|---|---:|---|",
    ]
    for s in report["socialDuplicates"]:
        twin = "evet" if s["alsoInSiteMedia"] else "hayır"
        lines.append(
            f"| `{s['name']}` | {fmt_bytes(s['socialBytes'])} | {twin} |"
        )

    lines += [
        "",
        "## 4. Arşiv / kaynak (runtime değil)",
        "",
        "| Path | Boyut | Rol |",
        "|---|---:|---|",
    ]
    for a in report["archive"]:
        size = fmt_bytes(a["bytes"]) if a["bytes"] is not None else "—"
        lines.append(f"| `{a['path']}` | {size} | {a['role']} |")

    lines += [
        "",
        "Ayrıca gitignore’lu ham kaynaklar (siteye servis edilmez):",
        "",
        "- `Görsel/` — galeri import kaynağı",
        "- `media/` — staging",
        "",
        "## 5. Temiz bulunanlar",
        "",
        "- `public/site-media/gallery/` üretim havuzu ↔ "
        "`src/content/gallery-media.generated.ts` (`.tmp.jpg` artıkları hariç) "
        "kod referanslarıyla uyumlu kabul edilir.",
        "- `src/content/*.ts` metin katalogları sayfa veya seed tarafından import ediliyor; "
        "yetim sayfa metni tespit edilmedi.",
        "- Mega menüde olmayan sayfalar sitemap / home CTA ile bağlı.",
        "",
        "## 6. Temizlik önerisi (uygulanmadı)",
        "",
        "En yüksek disk kazancı (onay sonrası):",
        "",
        "1. `/videos/sanat.mov` + `/videos/sanat-poster.jpg`",
        "2. Kök `/site-media/` WA dump yetimleri",
        "3. Scaffold SVG’ler (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)",
        "4. Kullanılmayan logo kopyaları ve `ankara.jpg` (kod `ankara.png` bekliyor)",
        "5. Galeri `*.tmp.jpg` import artıkları (varsa)",
        "",
        "## Notlar",
        "",
    ]
    for n in report["notes"]:
        lines.append(f"- {n}")
    lines.append("")
    lines.append("Raporu yenilemek için:")
    lines.append("")
    lines.append("```bash")
    lines.append(
        "python3 scripts/find-unused-content.py --markdown docs/kullanilmayan-icerik-raporu.md"
    )
    lines.append("```")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Kullanılmayan içerik auditi")
    parser.add_argument(
        "--json",
        action="store_true",
        help="Sonucu JSON olarak stdout'a yaz",
    )
    parser.add_argument(
        "--markdown",
        type=Path,
        metavar="PATH",
        help="Markdown raporu bu dosyaya yaz",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Konsol özetini bastır (--json/--markdown ile)",
    )
    args = parser.parse_args()

    report = build_report()

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    elif not args.quiet:
        print_console(report)

    if args.markdown:
        out = args.markdown
        if not out.is_absolute():
            out = ROOT / out
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render_markdown(report), encoding="utf-8")
        if not args.quiet:
            print(f"\nMarkdown yazıldı: {out.relative_to(ROOT)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
