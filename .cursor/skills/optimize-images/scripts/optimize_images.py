#!/usr/bin/env python3
"""Optimize Dante image assets in place (no new npm deps).

JPEG/WebP: resize + recompress in place.
Opaque or large PNG: convert to WebP and path-aware ref updates.
SVG: recompress embedded rasters; optional SVGO via npx.

Requires: Pillow. Optional: npx (for svgo).
"""

from __future__ import annotations

import argparse
import base64
import io
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image

# .cursor/skills/optimize-images/scripts/this.py → repo root
REPO_ROOT = Path(__file__).resolve().parents[4]
ASSET_ROOTS = [
    REPO_ROOT / "src/assets/work",
    REPO_ROOT / "src/assets/img",
    REPO_ROOT / "src/posts/img",
    REPO_ROOT / "src/work/img",
]
REF_SUFFIXES = {".md", ".njk", ".html", ".js", ".css", ".json"}

MAX_EDGE = 1600
JPG_QUALITY = 82
WEBP_QUALITY = 80
DEFAULT_MIN_BYTES = 300_000
SVG_SVGO_MIN_BYTES = 200_000

EMBED_RE = re.compile(
    r"data:image/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=\r\n\t ]+)",
    re.IGNORECASE,
)


def web_url_for(path: Path) -> str | None:
    path = path.resolve()
    mapping = [
        (REPO_ROOT / "src/assets/work", "/assets/work"),
        (REPO_ROOT / "src/assets/img", "/assets/img"),
        (REPO_ROOT / "src/posts/img", "/assets/img"),
        (REPO_ROOT / "src/work/img", "/assets/img"),
    ]
    for root, prefix in mapping:
        try:
            rel = path.relative_to(root.resolve())
            return f"{prefix}/{rel.as_posix()}"
        except ValueError:
            continue
    return None


def front_matter_rel(path: Path) -> str | None:
    """Path relative to posts/img or work/img for featured_image-style refs."""
    for root in (REPO_ROOT / "src/posts/img", REPO_ROOT / "src/work/img"):
        try:
            return path.relative_to(root).as_posix()
        except ValueError:
            continue
    return None


def has_meaningful_alpha(im: Image.Image) -> bool:
    if im.mode in ("RGBA", "LA"):
        return im.getchannel("A").getextrema()[0] < 250
    if im.mode == "P" and "transparency" in im.info:
        return im.convert("RGBA").getchannel("A").getextrema()[0] < 250
    return False


def resize_max_edge(im: Image.Image, max_edge: int = MAX_EDGE) -> Image.Image:
    w, h = im.size
    scale = min(1.0, max_edge / max(w, h))
    if scale >= 1.0:
        return im
    return im.resize(
        (max(1, int(w * scale)), max(1, int(h * scale))),
        Image.Resampling.LANCZOS,
    )


def iter_images(root: Path, recursive: bool):
    exts = {".jpg", ".jpeg", ".png", ".webp", ".svg"}
    it = root.rglob("*") if recursive else root.glob("*")
    for f in it:
        if f.is_file() and f.suffix.lower() in exts:
            yield f


def collect_targets(
    paths: list[Path],
    *,
    min_bytes: int,
    recursive: bool,
    force_files: bool,
) -> list[Path]:
    out: list[Path] = []
    for p in paths:
        p = p.resolve()
        if p.is_file():
            if p.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".svg"}:
                continue
            if force_files or p.stat().st_size >= min_bytes:
                out.append(p)
            continue
        if p.is_dir():
            for f in iter_images(p, recursive):
                if f.stat().st_size >= min_bytes:
                    out.append(f)
    seen: set[Path] = set()
    unique: list[Path] = []
    for f in sorted(out, key=lambda x: -x.stat().st_size):
        if f not in seen:
            seen.add(f)
            unique.append(f)
    return unique


def ref_files() -> list[Path]:
    files = []
    src = REPO_ROOT / "src"
    for p in src.rglob("*"):
        if "node_modules" in p.parts:
            continue
        if p.is_file() and p.suffix.lower() in REF_SUFFIXES:
            files.append(p)
    return files


def basename_is_unique(name: str) -> bool:
    hits = []
    for root in ASSET_ROOTS:
        if root.exists():
            hits.extend(root.rglob(name))
    return len(hits) <= 1


def path_aware_replace(old_path: Path, new_path: Path) -> list[str]:
    """Replace refs with URL/path context. Avoid bare basename when ambiguous (e.g. hero.png)."""
    candidates: list[tuple[str, str]] = []

    old_url = web_url_for(old_path)
    new_url = web_url_for(new_path)
    if old_url and new_url:
        candidates.append((old_url, new_url))

    old_fm = front_matter_rel(old_path)
    new_fm = front_matter_rel(new_path)
    if old_fm and new_fm:
        candidates.append((old_fm, new_fm))

    if basename_is_unique(old_path.name):
        candidates.append((old_path.name, new_path.name))

    candidates = sorted(set(candidates), key=lambda x: -len(x[0]))
    updated: list[str] = []
    for rf in ref_files():
        try:
            text = rf.read_text(encoding="utf-8")
        except Exception:
            continue
        new_text = text
        for old, new in candidates:
            if old in new_text:
                new_text = new_text.replace(old, new)
        if new_text != text:
            rf.write_text(new_text, encoding="utf-8")
            updated.append(str(rf.relative_to(REPO_ROOT)))
    return updated


def optimize_embed_bytes(raw: bytes, max_edge: int) -> tuple[str, bytes]:
    im = Image.open(io.BytesIO(raw))
    im.load()
    im = resize_max_edge(im, max_edge)
    if has_meaningful_alpha(im):
        if im.mode != "RGBA":
            im = im.convert("RGBA")
        if im.getchannel("A").getextrema()[0] >= 250:
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.getchannel("A"))
            im = bg
        else:
            out = io.BytesIO()
            im.save(out, format="WEBP", quality=WEBP_QUALITY, method=6)
            return "webp", out.getvalue()
    if im.mode != "RGB":
        im = im.convert("RGB")
    out = io.BytesIO()
    im.save(out, format="WEBP", quality=WEBP_QUALITY, method=6)
    return "webp", out.getvalue()


def run_svgo(path: Path) -> None:
    cfg = Path(__file__).resolve().parent / "svgo.config.cjs"
    cmd = [
        "npx",
        "--yes",
        "svgo@3.3.2",
        "-i",
        str(path),
        "-o",
        str(path),
        "--multipass",
        "--precision=2",
        "--config",
        str(cfg),
    ]
    subprocess.run(cmd, check=False, capture_output=True, text=True, timeout=180)


def optimize_svg(path: Path, dry_run: bool) -> tuple[int, int, str]:
    before = path.stat().st_size
    text = path.read_text(encoding="utf-8", errors="surrogateescape")
    embeds = list(EMBED_RE.finditer(text))
    note_parts = []

    if embeds:
        parts: list[str] = []
        last = 0
        for m in embeds:
            parts.append(text[last : m.start()])
            b64 = re.sub(r"\s+", "", m.group(2))
            try:
                raw = base64.b64decode(b64)
                fmt, new_raw = optimize_embed_bytes(raw, MAX_EDGE)
                parts.append(
                    f"data:image/{fmt};base64,{base64.b64encode(new_raw).decode('ascii')}"
                )
            except Exception:
                parts.append(m.group(0))
            last = m.end()
        parts.append(text[last:])
        new_text = "".join(parts)
        note_parts.append(f"embeds:{len(embeds)}")
        if new_text != text:
            if dry_run:
                return before, len(new_text.encode("utf-8")), "+".join(note_parts) + "(dry)"
            path.write_text(new_text, encoding="utf-8")
    else:
        note_parts.append("no-embeds")

    if not dry_run and path.stat().st_size >= SVG_SVGO_MIN_BYTES:
        try:
            run_svgo(path)
            note_parts.append("svgo")
        except Exception as e:
            note_parts.append(f"svgo-skip:{e}")

    return before, path.stat().st_size, "+".join(note_parts)


def optimize_raster(path: Path, dry_run: bool) -> tuple[int, int, str]:
    before = path.stat().st_size
    im = Image.open(path)
    im.load()
    orig_size = im.size
    im = resize_max_edge(im)
    resized = im.size != orig_size
    ext = path.suffix.lower()

    if ext == ".png":
        if has_meaningful_alpha(im):
            save_im = im.convert("RGBA")
        else:
            if im.mode in ("RGBA", "LA"):
                bg = Image.new("RGB", im.size, (255, 255, 255))
                bg.paste(im, mask=im.split()[-1])
                save_im = bg
            else:
                save_im = im.convert("RGB")
        out = io.BytesIO()
        save_im.save(out, format="WEBP", quality=WEBP_QUALITY, method=6)
        data = out.getvalue()
        new_path = path.with_suffix(".webp")
        if dry_run:
            return before, len(data), "png->webp(dry)"
        new_path.write_bytes(data)
        refs = path_aware_replace(path, new_path)
        path.unlink(missing_ok=True)
        return before, new_path.stat().st_size, f"png->webp refs:{len(refs)}"

    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    out = io.BytesIO()
    if ext in (".jpg", ".jpeg"):
        im.save(out, format="JPEG", quality=JPG_QUALITY, optimize=True, progressive=True)
        kind = "jpg"
    else:
        im.save(out, format="WEBP", quality=WEBP_QUALITY, method=6)
        kind = "webp"
    data = out.getvalue()
    if dry_run:
        return before, len(data), f"{kind}(dry)"
    # Always keep a max-edge resize. Only skip write when dimensions
    # are unchanged and recompress grew more than ~2%.
    if resized or len(data) <= before * 1.02:
        path.write_bytes(data)
        note = f"{kind}+resize" if resized else kind
    else:
        note = f"{kind}-skip-grew"
    return before, path.stat().st_size, note


def main() -> int:
    parser = argparse.ArgumentParser(description="Optimize Dante image assets")
    parser.add_argument(
        "paths",
        nargs="*",
        type=Path,
        help="Files or directories (default: scan asset roots ≥ --min-bytes)",
    )
    parser.add_argument(
        "--min-bytes",
        type=int,
        default=None,
        help=f"Size floor for directory scans (default {DEFAULT_MIN_BYTES}). Explicit files ignore this unless set.",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--no-recursive", action="store_true")
    args = parser.parse_args()

    raw_paths = [p if p.is_absolute() else (REPO_ROOT / p) for p in args.paths]
    scanning = not raw_paths
    if scanning:
        raw_paths = [r for r in ASSET_ROOTS if r.exists()]
        min_bytes = DEFAULT_MIN_BYTES if args.min_bytes is None else args.min_bytes
        force_files = False
    else:
        min_bytes = 0 if args.min_bytes is None else args.min_bytes
        force_files = args.min_bytes is None

    targets = collect_targets(
        raw_paths,
        min_bytes=min_bytes,
        recursive=not args.no_recursive,
        force_files=force_files,
    )

    if not targets:
        print("No matching image files.")
        return 0

    print(f"Repo: {REPO_ROOT}")
    print(f"Targets: {len(targets)} ({'dry-run' if args.dry_run else 'write'})")
    total_b = total_a = 0
    for path in targets:
        try:
            rel = path.relative_to(REPO_ROOT)
        except ValueError:
            rel = path
        try:
            if path.suffix.lower() == ".svg":
                before, after, note = optimize_svg(path, args.dry_run)
            else:
                before, after, note = optimize_raster(path, args.dry_run)
        except Exception as e:
            print(f"FAIL {rel}: {e}")
            continue
        delta = 100 * (after - before) / before if before else 0
        print(f"{before // 1024:5}KB -> {after // 1024:5}KB ({delta:+.1f}%) [{note}] {rel}")
        if after != before:
            total_b += before
            total_a += after

    if total_b:
        print(
            f"\nChanged total: {total_b // 1024}KB -> {total_a // 1024}KB "
            f"({100 * (total_a - total_b) / total_b:+.1f}%)"
        )
    else:
        print("\nNo size changes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
