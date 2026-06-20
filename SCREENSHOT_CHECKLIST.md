# Cloak Sting — Screenshot / Video Clip Checklist

Exact assets needed for Devpost submission, slide deck, and table demo backup.

---

## Screenshots (static)

### 1. Warning overlay on fake bank login
- **Page:** `demo/fake-bank-login.html` loaded in Chrome with the extension active
- **What to capture:** The full overlay card (risk score, signal cards, advice, Copy receipt / Dismiss buttons) floating over the fake bank form
- **Crop:** Full browser window including the address bar (shows the local file URL, reinforcing it's a demo fixture)
- **File name:** `screenshot-overlay-bank.png`

### 2. Warning overlay on fake shipping fee page
- **Page:** `demo/fake-shipping-fee.html` loaded in Chrome with the extension active
- **What to capture:** Same overlay behavior but with different signals (payment pressure, USPS impersonation)
- **File name:** `screenshot-overlay-shipping.png`

### 3. Extension popup with threat receipt
- **How:** Click the Cloak Sting extension icon after visiting a demo scam page
- **What to capture:** The popup showing risk level, page title, signal findings, and Copy receipt button
- **Crop:** Just the popup panel
- **File name:** `screenshot-popup-receipt.png`

### 4. Markdown dossier output
- **How:** Run `node scripts/save_case_demo.js`, then open the generated `.md` file in `dist/dossiers/`
- **What to capture:** The rendered Markdown dossier showing case summary, observed signals, reporting channels, and safety boundary
- **Crop:** Full dossier, scrolled or stitched if needed
- **File name:** `screenshot-dossier-markdown.png`

### 5. Terminal: test suite passing
- **How:** Run `npm test` in the repo root
- **What to capture:** All tests passing with no failures
- **File name:** `screenshot-tests-passing.png`

### 6. Terminal: case save output
- **How:** Run `node scripts/save_case_demo.js`
- **What to capture:** JSON output showing `savedTo`, `caseId`, `markdown`, `json` paths
- **File name:** `screenshot-case-save-output.png`

### 7. Redis Cloud dashboard (if configured)
- **How:** Log into Redis Cloud, navigate to the database, show stored `cloak:case:*` keys
- **What to capture:** Key list or key detail showing a stored case record
- **Note:** Only if Redis is connected for the demo. Skip if using local fallback.
- **File name:** `screenshot-redis-cases.png`

### 8. Architecture diagram
- **Create in:** Canva, Figma, or draw.io
- **Content:** `browser page → scam signal detector → warning overlay → threat receipt → case store (Redis / local) → evidence dossier → reporting channels (FTC, IC3, bank, brand)`
- **Side paths:** `Browserbase isolated inspection` feeding into the same receipt/case pipeline
- **Planned paths (dashed lines):** `Deepgram voice transcription`, `Claude safe explanations`, `Arize eval`
- **Style:** Black/cream/violet palette per brand brief. Clean, not cluttered.
- **File name:** `screenshot-architecture.png`

---

## Video clips (short, no audio needed — captions OK)

### 9. Live demo walkthrough (30–60 sec)
- **Flow:** Open `fake-bank-login.html` → overlay appears → scroll through signals → click Copy receipt → paste receipt in notes → open extension popup
- **Purpose:** Devpost embedded video or GIF showing the core loop
- **File name:** `clip-live-demo.mp4` or `clip-live-demo.gif`

### 10. CLI evidence pipeline (15–30 sec)
- **Flow:** Run `node scripts/save_case_demo.js` → show JSON output → open generated dossier file
- **Purpose:** Shows the receipt-to-dossier pipeline working
- **File name:** `clip-cli-pipeline.mp4`

### 11. Browserbase inspection (15–30 sec, if configured)
- **Flow:** Run `node scripts/inspect_link_demo.js` → show output with session ID and recording URL
- **Purpose:** Shows isolated link inspection without user browser exposure
- **File name:** `clip-browserbase-inspect.mp4`

---

## Capture notes

- Use a clean Chrome profile or incognito to avoid personal bookmarks/tabs in screenshots.
- Demo pages are intentionally ugly — that's the point (they're fake scam pages). The overlay is the polished element.
- Do not include any real credentials, API keys, or Redis passwords in any screenshot.
- Preferred resolution: 1440x900 or higher for retina clarity.
- Preferred format: PNG for screenshots, MP4 for clips, GIF as fallback for Devpost.
