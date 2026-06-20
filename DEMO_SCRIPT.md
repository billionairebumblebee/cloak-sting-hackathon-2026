# Cloak Sting — Table Demo Script

**Target: <=5 minutes. Designed for Vivian to run under stress.**

---

## Pre-demo setup (do before judges arrive)

1. Chrome open with extension loaded (`chrome://extensions/` → Load unpacked → repo root).
2. Two demo tabs pre-loaded but **not yet visited** with the extension active:
   - `demo/fake-bank-login.html`
   - `demo/fake-shipping-fee.html`
3. Terminal open in the repo directory with `npm test` already passing (run it once to verify).
4. Have `data/scam-cases.json` visible in a file explorer or editor tab — it should be empty or have previous demo cases.

---

## Script

### 0:00–0:30 — Hook (30 sec)

> "Scammers win because warnings come after the damage, and reporting is too hard. Cloak Sting is an ambient scam-defense layer that warns before the click becomes a crisis — and keeps the receipt."

Show the extension icon in Chrome. It's quiet — no alerts on a safe page.

### 0:30–1:30 — Demo 1: Fake bank login (60 sec)

1. Navigate to the `fake-bank-login.html` tab.
2. **Overlay appears automatically.** Point out:
   - Risk score (should be high, 65+/100)
   - Signal cards: urgency pressure, credential harvesting, isolation tactics, brand impersonation
   - Advice text: "Pause. Do not pay, enter passwords, or call numbers on this page."
3. Click **"Copy receipt"** — paste it into a text editor or notes app to show the structured receipt.
4. Say: "Grandma sees this before she types her password. Not after."

### 1:30–2:30 — Demo 2: Shipping fee scam (60 sec)

1. Navigate to the `fake-shipping-fee.html` tab.
2. **Overlay appears.** Point out:
   - Different signal types: payment pressure (redelivery fee), USPS impersonation
   - Score reflects the different scam pattern
3. Say: "Different scam, same defense. Deterministic detection — no AI inference, no API latency, no hallucination."

### 2:30–3:30 — Evidence pipeline (60 sec)

1. Switch to terminal. Run:
   ```bash
   node scripts/save_case_demo.js
   ```
2. Show the output: case ID, backend (local-json or redis), dossier paths.
3. Open the generated Markdown dossier in `dist/dossiers/`. Walk through:
   - Case summary (risk, URL, suspected brand, jurisdiction)
   - Observed scam signals (type, evidence, weight)
   - Reporting channels (FTC, IC3, bank, brand abuse team)
   - Safety boundary statement
4. Say: "This is what you hand to your bank, or paste into an FTC report. Evidence, not just 'I got scammed.'"

### 3:30–4:15 — Sponsor tech (45 sec)

1. **Redis:** "Cases persist to Redis Cloud. If Redis isn't available, it falls back to local JSON — the demo always works." Point at the `data/scam-cases.json` file or mention Redis connection if configured.
2. **Browserbase:** "Suspicious links can be inspected in an isolated Browserbase session — the user's browser never touches the scam page." Run (if Browserbase is configured):
   ```bash
   node scripts/inspect_link_demo.js
   ```
   Or show the code path and explain: isolated session → extract evidence → same receipt/case/dossier pipeline.
3. **Planned sponsors (brief mention only):** "Anthropic Claude for grounded next-step explanations, Arize for safety eval, Deepgram for voice scam transcription — architected but not yet in code."

### 4:15–4:45 — Impact + why now (30 sec)

> "$3.4 billion lost by adults 60+ in 2023 to online scams. AI makes scams cheaper and more convincing. Families need AI-native defense. Cloak Sting catches the pattern before the mistake and preserves the proof after the attempt."

### 4:45–5:00 — Close (15 sec)

> "Cloak Sting: stop the scam before the click becomes a crisis."

Offer to show the test suite, the code, or answer questions.

---

## Troubleshooting during demo

| Problem | Fix |
|---|---|
| Overlay doesn't appear | Reload the demo page. Check `chrome://extensions/` — extension must be enabled. |
| `npm test` fails | Run `npm install` first. Check Node.js >= 18. |
| `save_case_demo.js` errors on Redis | Expected if Redis isn't configured. Output will show `local-json` backend. That's fine. |
| Extension popup shows "No receipt yet" | Visit a demo scam page first, then reopen the popup. |
| Judges ask about voice/Deepgram | "Architected in the product plan, branch created, not yet merged. The detector accepts any text — voice transcripts feed the same pipeline." |
| Judges ask about AI/LLM detection | "Deliberately deterministic for v1. Zero latency, zero cost, zero hallucination. Claude integration planned for grounded explanations, not detection." |
