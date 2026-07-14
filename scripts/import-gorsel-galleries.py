#!/usr/bin/env python3
"""
Görsel/ klasöründen benzersiz medyayı public/site-media/gallery/ altına aktarır
ve src/content/gallery-media.generated.ts üretir.

- İçerik SHA1 ile dedupe (aynı dosya bir kez)
- HEIC → JPEG (sips)
- Görseller max 1920px, JPEG q80
- MOV/MP4 → web mp4 (720p, crf 28) + poster karesi
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public" / "site-media" / "gallery"
OUT_TS = ROOT / "src" / "content" / "gallery-media.generated.ts"
MANIFEST = ROOT / "scripts" / "_gorsel-manifest.json"

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VID_EXT = {".mp4", ".mov"}
HEIC_EXT = {".heic"}
ALLOWED = IMG_EXT | VID_EXT | HEIC_EXT

FOLDER_TO_KEY = {
    "Akademik Gelişim ve Tâkib": "akademikGelisim",
    "Anaokulu": "anaokulu",
    "Değerler Eğitimi": "degerler",
    "İlkokul": "ilkokul",
    "Kurumsal Değerlerimiz": "kurumsalDegerler",
    "Kurumsal Kimliğimiz": "kurumsalKimlik",
    "Nebevi Eğitim": "nebevi",
    "Nesil Tasavvurumuz": "nesilTasavvur",
    "Niyetimiz-İstikametimiz": "niyetimiz",
    "Ortaokul": "ortaokul",
    "Rehberlik ve Eğitim Koçluğu": "rehberlikKocluk",
    "Sultan Mektebi Modeli": "kademeler",
    "Sultanda Veli Olmak & Veli Akademisi": "veli",
    "Sultanda Yaşam": "sultandaYasam",
    "Yabancı Dil": "yabanciDil",
}

ALT_BY_KEY = {
    "akademikGelisim": "Akademik gelişim ve takip galerisinden kare",
    "anaokulu": "Anaokulu galerisinden kare",
    "degerler": "Değerler eğitimi galerisinden kare",
    "ilkokul": "İlkokul galerisinden kare",
    "kurumsalDegerler": "Kurumsal değerlerimiz galerisinden kare",
    "kurumsalKimlik": "Kurumsal kimliğimiz galerisinden kare",
    "nebevi": "Nebevî eğitim galerisinden kare",
    "nesilTasavvur": "Nesil tasavvurumuz galerisinden kare",
    "niyetimiz": "Niyetimiz ve istikametimiz galerisinden kare",
    "ortaokul": "Ortaokul galerisinden kare",
    "rehberlikKocluk": "Rehberlik ve eğitim koçluğu galerisinden kare",
    "kademeler": "Sultan Mektebi Modeli galerisinden kare",
    "veli": "Sultanda veli olmak galerisinden kare",
    "sultandaYasam": "Sultanda yaşam galerisinden kare",
    "yabanciDil": "Yabancı dil galerisinden kare",
}


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def fold(s: str) -> str:
    s = nfc(s).lower()
    for a, b in {
        "ı": "i",
        "i̇": "i",
        "ş": "s",
        "ğ": "g",
        "ü": "u",
        "ö": "o",
        "ç": "c",
        "â": "a",
        "î": "i",
        "û": "u",
    }.items():
        s = s.replace(a, b)
    return s


def find_gorsel_root() -> Path:
    for name in os.listdir(ROOT):
        if "rsel" in name.lower() and (ROOT / name).is_dir():
            return ROOT / name
    raise SystemExit("Görsel klasörü bulunamadı")


def file_hash(path: Path) -> str:
    h = hashlib.sha1()
    with path.open("rb") as f:
        while True:
            chunk = f.read(1024 * 1024)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()[:12]


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def convert_image(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".tmp.jpg")
    # HEIC/PNG/JPG → JPEG
    run(["sips", "-s", "format", "jpeg", str(src), "--out", str(tmp)])
    # max edge 1920
    run(
        [
            "sips",
            "--resampleHeightWidthMax",
            "1920",
            str(tmp),
            "--out",
            str(tmp),
        ]
    )
    # quality
    run(["sips", "-s", "formatOptions", "80", str(tmp), "--out", str(dest)])
    tmp.unlink(missing_ok=True)


def convert_video(src: Path, dest_mp4: Path, poster: Path) -> None:
    dest_mp4.parent.mkdir(parents=True, exist_ok=True)
    # web-friendly 720p h264
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-vf",
            "scale=-2:720",
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "28",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            str(dest_mp4),
        ]
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(dest_mp4),
            "-ss",
            "00:00:01",
            "-vframes",
            "1",
            "-q:v",
            "4",
            str(poster),
        ]
    )


def match_folder_key(folder_name: str) -> str | None:
    n = nfc(folder_name)
    for k, v in FOLDER_TO_KEY.items():
        if nfc(k) == n or fold(k) == fold(n):
            return v
    return None


def collect(gorsel: Path):
    by_hash: dict[str, dict] = {}
    page_order: dict[str, list[str]] = defaultdict(list)

    for name in sorted(os.listdir(gorsel), key=lambda x: fold(x)):
        path = gorsel / name
        if not path.is_dir():
            continue
        key = match_folder_key(name)
        if not key:
            print(f"SKIP unmapped folder: {name!r}")
            continue
        files = sorted(
            [f for f in os.listdir(path) if not f.startswith(".")],
            key=lambda x: fold(x),
        )
        for fname in files:
            ext = Path(fname).suffix.lower()
            if ext not in ALLOWED:
                continue
            fp = path / fname
            h = file_hash(fp)
            if h not in by_hash:
                by_hash[h] = {
                    "hash": h,
                    "src": str(fp),
                    "ext": ext,
                    "basename": fname,
                    "pages": set(),
                }
            by_hash[h]["pages"].add(key)
            if h not in page_order[key]:
                page_order[key].append(h)

    return by_hash, page_order


def process_asset(meta: dict) -> dict:
    h = meta["hash"]
    src = Path(meta["src"])
    ext = meta["ext"]
    pages = sorted(meta["pages"])
    primary_alt = ALT_BY_KEY[pages[0]]

    if ext in HEIC_EXT or ext in IMG_EXT:
        out_name = f"g-{h}.jpg"
        out_path = PUBLIC_DIR / out_name
        if not out_path.exists():
            print(f"  image {h} ← {src.name}")
            convert_image(src, out_path)
        return {
            "id": h,
            "kind": "image",
            "file": out_name,
            "alt": primary_alt,
            "pages": pages,
        }

    # video
    out_name = f"g-{h}.mp4"
    poster_name = f"g-{h}-poster.jpg"
    out_path = PUBLIC_DIR / out_name
    poster_path = PUBLIC_DIR / poster_name
    if not out_path.exists() or not poster_path.exists():
        print(f"  video {h} ← {src.name}")
        convert_video(src, out_path, poster_path)
    return {
        "id": h,
        "kind": "video",
        "file": out_name,
        "poster": poster_name,
        "alt": primary_alt,
        "pages": pages,
    }


def emit_ts(assets: dict[str, dict], page_order: dict[str, list[str]]) -> None:
    lines: list[str] = [
        "/* AUTO-GENERATED by scripts/import-gorsel-galleries.py — do not edit by hand */",
        "",
        "type GeneratedMedia = {",
        '  kind: "image" | "video";',
        "  src: string;",
        "  alt: string;",
        "  poster?: string;",
        "};",
        "",
        'const BASE = "/site-media/gallery";',
        "",
        "const image = (file: string, alt: string): GeneratedMedia => ({",
        '  kind: "image",',
        "  src: `${BASE}/${file}`,",
        "  alt,",
        "});",
        "",
        "const video = (file: string, alt: string, poster: string): GeneratedMedia => ({",
        '  kind: "video",',
        "  src: `${BASE}/${file}`,",
        "  alt,",
        "  poster: `${BASE}/${poster}`,",
        "});",
        "",
        "/** Tekil medya kaydı — her dosya bir kez */",
        "export const galleryAssets = {",
    ]

    for h in sorted(assets.keys()):
        a = assets[h]
        if a["kind"] == "image":
            lines.append(
                f'  "{h}": image("{a["file"]}", {json.dumps(a["alt"], ensure_ascii=False)}),'
            )
        else:
            lines.append(
                f'  "{h}": video("{a["file"]}", {json.dumps(a["alt"], ensure_ascii=False)}, "{a["poster"]}"),'
            )

    lines.append("} as const satisfies Record<string, GeneratedMedia>;")
    lines.append("")
    lines.append("export type GalleryAssetId = keyof typeof galleryAssets;")
    lines.append("")
    lines.append("function pick(...ids: GalleryAssetId[]): GeneratedMedia[] {")
    lines.append("  return ids.map((id) => galleryAssets[id]);")
    lines.append("}")
    lines.append("")
    lines.append("/** Sayfa galerileri — merkezi asset referansları */")
    lines.append("export const generatedPageGalleries = {")

    for key in sorted(page_order.keys()):
        ids = page_order[key]
        id_list = ", ".join(f'"{i}"' for i in ids)
        lines.append(f"  {key}: pick({id_list}),")

    lines.append(
        "} as const satisfies Record<string, readonly GeneratedMedia[]>;"
    )
    lines.append("")

    OUT_TS.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_TS.relative_to(ROOT)}")


def main() -> None:
    gorsel = find_gorsel_root()
    print(f"Source: {gorsel}")
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    by_hash, page_order = collect(gorsel)
    print(f"Unique assets: {len(by_hash)} | page refs: {sum(len(v) for v in page_order.values())}")

    assets: dict[str, dict] = {}
    for i, (h, meta) in enumerate(sorted(by_hash.items()), 1):
        print(f"[{i}/{len(by_hash)}]", end=" ")
        assets[h] = process_asset(meta)

    emit_ts(assets, page_order)

    manifest = {
        "assets": [
            {**{k: v for k, v in a.items()}, "pages": a["pages"]}
            for a in assets.values()
        ],
        "pages": page_order,
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    total = sum(p.stat().st_size for p in PUBLIC_DIR.glob("*") if p.is_file())
    print(f"Done. public/site-media/gallery size: {total / 1e9:.2f} GB")


if __name__ == "__main__":
    main()
