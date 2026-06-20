# Cloak Sting — scam defense before the mistake

## Elevator Pitch

Cloak Sting is a Chrome extension that detects scam patterns the moment a user lands on a dangerous page — before they type a password, wire money, or call a fake number. It turns every scam attempt into a shareable evidence dossier that a family member, bank, or authority (FTC / IC3) can actually act on.

## What it does

Cloak Sting sits in the browser as an ambient protection layer. When a user visits a page that exhibits scam signals — urgency pressure, brand impersonation, unusual payment requests, credential harvesting, isolation tactics — the extension scores the threat in real time and intervenes with a calm, non-panic overlay at the exact danger moment.

**Core loop:**
1. User opens a suspicious page (fake bank login, USPS redelivery scam, etc.).
2. The detector scans DOM text, input fields, URL/domain patterns, and page copy for scam indicators.
3. A risk score (0-100) determines the intervention level: quiet watch, soft concern, or hard stop overlay.
4. The overlay blocks the form area with clear advice: "Pause before you type, pay, or call."
5. The user can copy a threat receipt summarizing every observed signal.
6. The receipt is normalized into a case record and stored (Redis Cloud or local fallback).
7. The case exports as an authority-ready evidence dossier (Markdown/JSON) with reporting channels (FTC ReportFraud, FBI IC3, bank contacts, brand abuse teams).

**What makes it different:** Cloak Sting is not a chatbot or a generic privacy tool. It is an ambient intervention that catches the pattern and keeps the receipt. It warns at the moment of risk and preserves proof after the attempt.

## How we built it

Built entirely during the hackathon window in a clean repo with no code carried from prior projects.

**Architecture:**
- `src/scamSignals.js` — Deterministic scam signal detector. Scores pages across five signal categories: urgency pressure, payment request patterns, trust/brand impersonation, isolation/secrecy tactics, and credential harvesting. Works entirely on page content — no API calls, no ML inference, no latency.
- `src/content.js` — Chrome extension content script. Reads the live DOM (text, inputs, placeholders, buttons, links, URL, title), runs the detector, and renders a risk-appropriate overlay (quiet/soft/hard stop). Stores the latest receipt to extension storage.
- `src/popup.js` + `popup.html` + `popup.css` — Extension popup showing the latest threat receipt with copy-to-clipboard.
- `src/caseStore.js` — Normalizes receipts into authority-safe case records with brand inference, jurisdiction detection, and reporting channel mapping. Persists to Redis Cloud (native client or REST) or local JSON fallback.
- `src/dossier.js` — Exports case records as Markdown or JSON dossiers with observed signals, safe next steps, reporting channels, and safety boundary language.
- `src/browserbaseInspect.js` — Creates an isolated Browserbase session to inspect a suspicious link without exposing the user's browser. Extracts page evidence and feeds it through the same detector/case/dossier pipeline.
- `demo/` — Intentionally fake scam fixture pages (bank verification, USPS shipping fee) for live demo.
- `scripts/` — CLI demo scripts for case saving and link inspection. Build script packages the extension as a zip.
- `tests/` — Node.js test suite covering signal detection, case normalization, dossier rendering, and Browserbase integration (mocked).

**Stack:** Vanilla JavaScript (no framework), Chrome Manifest V3, Node.js for backend tooling, Python for packaging.

## Sponsor Usage

### Redis (implemented)
Redis Cloud stores scam case records persistently. `caseStore.js` supports two connection modes:
- **Redis native client** (`redis` npm package v6) via `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` or `REDIS_URL`.
- **Redis REST API** via `REDIS_REST_URL` / `REDIS_API_KEY` (also supports Upstash env vars).

Cases are stored as JSON with keys like `cloak:case:{id}` and tracked in a `cloak:cases` set. When Redis is unavailable, the system falls back to `data/scam-cases.json` so the demo always works.

### Browserbase (implemented)
Browserbase provides isolated browser sessions for safe link inspection. When a user encounters a suspicious link, Cloak can open it in a sandboxed Browserbase session — extracting page evidence without exposing the user's device or cookies. The integration creates sessions via the Browserbase API with ad blocking, session recording, and logging enabled. The session recording URL is included in the case record for evidence review.

### Anthropic / Claude (planned — not yet implemented)
Planned integration: Claude generates grounded, safe-next-step explanations for detected scam patterns. Would add a human-readable "what to do" section to dossiers based on the observed signals. Not yet in code — clearly a future enhancement.

### Arize (planned — not yet implemented)
Planned integration: Arize evaluates the safety and accuracy of any AI-generated explanations (e.g., Claude outputs) before they reach the user. Would provide an eval/guardrail layer. Not yet in code.

### Deepgram (planned — not yet implemented)
Planned integration: Deepgram transcribes voicemail/audio recordings (fake hostage calls, Mandarin-language family scams, bank robocalls) and feeds transcripts through the same scam detector pipeline. Would extend Cloak Sting from web pages to voice scam surfaces. Described in PRODUCT_SURFACES_PLAN.md but not yet merged.

## Challenges we ran into

- **Compliance boundary:** Maintaining a strict separation from prior Cloak extension work. Every line written fresh during the hackathon window in this repo.
- **Deterministic-first detection:** Resisting the urge to use ML/LLM inference for detection. The deterministic approach means zero latency, zero API cost, and zero false-positive hallucination — critical for a safety product that interrupts users.
- **Overlay UX under stress:** Designing a warning overlay that feels like a calm bodyguard, not a panic alarm. Scam victims are already stressed; the UI must de-escalate, not add fear.
- **Evidence vs. inference separation:** Dossiers must clearly separate observed evidence from any inferred conclusions. Legal and safety requirement for authority-ready reporting.
- **Multi-surface scam coverage:** Web pages are the hackathon surface, but scams happen over voice, SMS, and native apps. Architecting the detector to accept any text input (not just DOM) so voice/SMS paths can reuse it.

## Impact

- **Elderly / vulnerable users:** Scam losses for adults 60+ exceeded $3.4B in 2023 (FBI IC3). Cloak Sting intervenes at the exact moment — before the password is typed, before the wire is sent.
- **Families:** The shareable receipt/dossier means a grandchild can see exactly what signals were detected and help file a report.
- **Banks / platforms:** Dossiers include structured evidence that fraud teams can actually process, rather than vague "I got scammed" reports.
- **Authorities:** Reporting channel mapping (FTC, IC3, brand abuse teams) lowers the barrier from "I don't know who to call" to one-click.
- **Multilingual scam defense:** Jurisdiction inference already handles Chinese-language context clues, critical for cross-border ransom scams targeting Chinese-speaking families.

## What's next

- **Deepgram voice path:** Transcribe voicemails and phone recordings to detect ransom/pressure scams over audio.
- **Anthropic Claude integration:** Grounded safe-next-step explanations added to dossiers.
- **Arize eval layer:** Safety evaluation of any AI-generated content before it reaches users.
- **Android accessibility service:** Full-screen scam detection across SMS, browser, and payment apps.
- **iOS Safari extension + Share Sheet:** Webpage scanning and user-initiated suspicious message analysis.
- **Family dashboard:** Shared case memory across family members with role-based access.

## Setup / Demo Instructions

### Prerequisites
- Node.js 18+
- Python 3 (for extension packaging)
- Chrome browser

### Quick start

```bash
git clone https://github.com/billionairebumblebee/cloak-sting-hackathon-2026.git
cd cloak-sting-hackathon-2026
npm install
npm test
npm run build
```

### Load Chrome extension

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" → select the repo root folder
4. Navigate to `demo/fake-bank-login.html` or `demo/fake-shipping-fee.html`
5. Watch the warning overlay appear
6. Click the extension icon to see the popup with the latest threat receipt

### Run CLI demos

```bash
# Save a case and generate a dossier
node scripts/save_case_demo.js

# Inspect a link (uses local file if no Browserbase credentials)
node scripts/inspect_link_demo.js
```

### Optional: Redis Cloud persistence

Set environment variables (do not commit):
```bash
export REDIS_HOST=...
export REDIS_PORT=...
export REDIS_PASSWORD=...
```

### Optional: Browserbase isolated inspection

Set environment variables (do not commit):
```bash
export BROWSERBASE_API_KEY=...
export BROWSERBASE_PROJECT_ID=...
```
