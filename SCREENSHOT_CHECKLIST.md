# Screenshot & Video Clip Checklist

## Required Screenshots for Devpost

| # | Screenshot | What to capture | Notes |
|---|-----------|-----------------|-------|
| 1 | **Warning overlay on fake bank page** | `demo/fake-bank-login.html` with Cloak Sting overlay visible showing HIGH RISK, score, and findings | Hero image for Devpost |
| 2 | **Warning overlay on romance scam** | `demo/romance-scam.html` with overlay showing gift card/wire transfer/secrecy signals | Shows breadth beyond phishing |
| 3 | **Warning overlay on Chinese family scam** | `demo/chinese-family-scam.html` with overlay | Shows multilingual coverage |
| 4 | **Clean page with no overlay** | Normal page (google.com or amazon.com) — extension loaded but no warning | Proves no false-positive noise |
| 5 | **Chrome extension popup** | Click extension icon → show latest threat receipt summary in popup | Shows persistent state |
| 6 | **Copied receipt text** | Paste receipt into text editor after clicking "Copy receipt" | Shows structured evidence output |
| 7 | **Terminal: case dossier output** | Run `node scripts/save_case_demo.js` → show markdown dossier in terminal | Shows authority-ready export |
| 8 | **Terminal: Browserbase inspection** | Run `node scripts/inspect_link_demo.js` → show isolated inspection flow | Shows sponsor integration |
| 9 | **Test suite passing** | Run `npm test` → show all 29 tests passing | Proves reliability |
| 10 | **Extension loaded in Chrome** | `chrome://extensions` page showing Cloak Sting loaded with Manifest V3 | Proves it's a real extension |

## Required Video Clips

| # | Clip | Duration | What to show |
|---|------|----------|--------------|
| 1 | **End-to-end demo** | 60–90s | Navigate to fake-bank-login.html → overlay appears → click "Copy receipt" → paste receipt → show dossier |
| 2 | **Multiple scam types** | 30–45s | Quick cuts: bank login → shipping fee → romance → crypto → ransom overlay triggering |
| 3 | **Clean page vs scam page** | 15–20s | Side-by-side or quick toggle: google.com (no overlay) vs fake-bank-login.html (overlay) |

## Architecture Diagram (create or screenshot)

- Flow: `Browser page → scamSignals.js (DOM text + URL + hostname) → score/risk/findings → warning overlay → threat receipt → caseStore (Redis or JSON) → dossier export`
- Sponsor labels: Redis on case store, Browserbase on isolated inspection, Anthropic (planned) on explanation, Deepgram (planned) on voice path

## How to Capture

```bash
# Load extension:
# 1. chrome://extensions → Developer Mode → Load unpacked → select repo folder

# Open demo pages in Chrome and take screenshots:
# - Use Cmd+Shift+4 (Mac) or Shift+PrintScreen (Linux) or browser DevTools screenshot

# Terminal screenshots:
npm test
node scripts/save_case_demo.js
node scripts/inspect_link_demo.js
```

## File Naming Convention

```
screenshots/
  01-overlay-fake-bank.png
  02-overlay-romance-scam.png
  03-overlay-chinese-family.png
  04-clean-page-no-warning.png
  05-extension-popup.png
  06-copied-receipt.png
  07-case-dossier-terminal.png
  08-browserbase-inspection.png
  09-tests-passing.png
  10-extension-loaded.png
  video-demo-full.mp4
  video-scam-types.mp4
  video-clean-vs-scam.mp4
```
