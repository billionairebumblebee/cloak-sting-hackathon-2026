from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist" / "cloak-sting-extension.zip"
INCLUDE = [
    "manifest.json",
    "popup.html",
    "popup.css",
    "onboard.html",
    "README.md",
    "BRAND_AND_PITCH_BRIEF.md",
    "package.json",
]
INCLUDE_DIRS = ["src", "demo"]

OUT.parent.mkdir(exist_ok=True)
with ZipFile(OUT, "w", ZIP_DEFLATED) as zf:
    for rel in INCLUDE:
        zf.write(ROOT / rel, rel)
    for dirname in INCLUDE_DIRS:
        for path in sorted((ROOT / dirname).rglob("*")):
            if path.is_file():
                zf.write(path, path.relative_to(ROOT).as_posix())

print(f"Packaged {OUT} ({OUT.stat().st_size} bytes)")
