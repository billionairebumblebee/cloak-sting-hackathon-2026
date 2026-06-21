from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist" / "sting-extension.zip"

# Only include files that the extension actually uses at runtime.
# Excludes Node.js-only modules (caseStore, browserbaseInspect, etc.)
# to avoid Chrome Web Store reviewers flagging remote code patterns.
INCLUDE = [
    "manifest.json",
    "popup.html",
    "onboard.html",
]

# Extension JS files that are referenced by manifest.json or popup.html
EXTENSION_JS = [
    "src/content.js",
    "src/scamSignals.js",
    "src/popup.js",
    "src/background.js",
    "src/screenshotCapture.js",
    "src/theme.js",
    "src/formAnalyzer.js",
    "src/typosquatDetector.js",
    "src/voicePatterns.js",
]

INCLUDE_DIRS = ["icons"]

OUT.parent.mkdir(exist_ok=True)
with ZipFile(OUT, "w", ZIP_DEFLATED) as zf:
    for rel in INCLUDE:
        zf.write(ROOT / rel, rel)
    for rel in EXTENSION_JS:
        path = ROOT / rel
        if path.is_file():
            zf.write(path, rel)
    for dirname in INCLUDE_DIRS:
        for path in sorted((ROOT / dirname).rglob("*")):
            if path.is_file():
                zf.write(path, path.relative_to(ROOT).as_posix())

print(f"Packaged {OUT} ({OUT.stat().st_size} bytes)")
