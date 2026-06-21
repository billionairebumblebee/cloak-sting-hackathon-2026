# STING — UC Berkeley AI Hackathon 2026

**STING = Scam Tracking & Intelligence Network Guard**

STING is a Chrome extension + voice analysis pipeline that spots scams in real time — fake bank pages, crypto seed phrase harvesting, IRS impersonation calls, grandparent scams, romance fraud, and more. It links scam signals into readable profiles and generates evidence dossiers shareable with banks, authorities, and family members.

> *"Scammers picked the wrong target."*

---

## How to demo in 90 seconds (no API keys needed)

```bash
git clone https://github.com/billionairebumblebee/cloak-sting-hackathon-2026.git
cd cloak-sting-hackathon-2026
npm install
npm test          # 197 tests pass — zero keys required
npm run build     # packages extension ZIP
```

Then:
1. Open Chrome → `chrome://extensions` → enable Developer Mode
2. Click "Load unpacked" → select the repo root folder
3. Open `demo/fake-bank-login.html` — warning overlay fires in <1s
4. Open `demo/crypto-seed-drain.html` — seed phrase harvesting caught
5. Open `demo/grandparent-scam.html` — family emergency scam caught
6. Click the extension popup — see scan results + history

**One-click full demo (shows all capabilities):**
```bash
npm run demo      # runs scripts/full_demo.js — voice pipeline, evidence, export
```

**Scam cluster intelligence (groups reports into suspected scam networks):**
```bash
node scripts/scammer_profile_demo.js
```

---

## What it does

| Layer | Description |
|-------|-------------|
| **Page Scanner** | Scans every page for 10+ scam signal categories: urgency, payment demands, credential harvesting, impersonation, ransom, social engineering, crypto drain, deepfake indicators |
| **Typosquat Detector** | Levenshtein distance, homoglyph detection, combo-squat analysis, suspicious TLD flagging against 20 major brands |
| **Form Analyzer** | Detects credential-harvesting forms: SSN, credit cards, CVV, seed phrases, private keys, OTP codes |
| **Voice Pipeline** | Deepgram Nova-3 STT → 8-family voice scam pattern matcher (IRS, tech support, romance, crypto, kidnapping, grandparent, lottery, utility) |
| **Evidence Dossier** | Case records with brand inference, jurisdiction detection, reporting channels (FTC, FBI IC3, bank abuse teams) |
| **Threat Export** | STIX 2.1 bundles, CSV, and human-readable reports for law enforcement |
| **Link Pre-scan** | Hover any link to get real-time domain analysis tooltip |

---

## Sponsor integrations — honest status

Every sponsor technology is integrated with real code, real tests, and graceful fallbacks. **Nothing requires an API key to demo.**

| Sponsor | What it does | Without key | With key | Proof |
|---------|-------------|-------------|----------|-------|
| **Deepgram** | Voice STT → scam pattern matching | Local audio fixtures + transcript fallback | Live real-time transcription | `npm run demo` voice path |
| **Anthropic** | Plain-English explanation of findings | Deterministic template engine (same structure) | Claude generates grounded verdicts | `scripts/explain_case_demo.js` |
| **Browserbase** | Isolated URL detonation | Local DOM analysis only | Sandboxed cloud browser inspection | `scripts/inspect_link_demo.js` |
| **Redis** | Case persistence + pattern retrieval | Local JSON storage (automatic) | Cloud persistence via Upstash/Redis | `scripts/save_case_demo.js` |
| **Sentry** | Error + event monitoring | Local event log | Cloud envelope delivery | `scripts/sentry_smoke_demo.js` |
| **Fetch.ai / ASI:One** | Agent coordination (4 endpoints) | Local wrapper, no registration | Agentverse-registered agent | `scripts/asi_agent_demo.js` |
| **Arize / Phoenix** | 5-criteria eval pipeline | Local eval report generation | Cloud observability traces | `scripts/arize_eval_demo.js` |
| **Token Company** | Risk-preserving evidence compression | Local deterministic (66% reduction) | N/A | `scripts/token_compress_demo.js` |
| **Simular** | Autonomous cloud QA testing | Used for testing only — not in runtime | N/A | QA_REPORT.md |
| **OpenAI Codex** | AI pair programming | Development tool | N/A | — |
| **Devin (Cognition)** | Full-stack engineering agent | Development tool | N/A | — |
| **Pika / Midjourney** | Visual design support | Logo + site design assistance | N/A | Site assets |

### Key distinction
- **Core detection is 100% local** — `scamSignals.js`, `typosquatDetector.js`, `formAnalyzer.js`, `voicePatterns.js` run entirely in-browser with zero API calls.
- **Sponsor APIs are enhancement layers** — explanation quality (Anthropic), voice transcription (Deepgram), URL sandboxing (Browserbase), persistence (Redis), monitoring (Sentry), coordination (ASI), eval (Arize).
- **Every path has a working fallback** — the demo runs fully offline, judges see real protection behavior without any credentials.

---

## Proof checklist

| # | What to verify | How | Status |
|---|---------------|-----|--------|
| 1 | Extension loads without errors | `chrome://extensions` → no error badge | LIVE |
| 2 | Scam page triggers warning overlay | Open any `demo/*.html` file | LIVE |
| 3 | Safe page does NOT trigger warning | Open `example.com` or any normal site | LIVE |
| 4 | Warning blocks form inputs | Try typing in the scam form behind the overlay | LIVE |
| 5 | "Take me somewhere safe" navigates away | Click primary CTA | LIVE |
| 6 | Evidence receipt is copyable | Click "Save proof" button | LIVE |
| 7 | Popup shows scan results | Click extension icon | LIVE |
| 8 | History tab shows past scans | Switch to History in popup | LIVE |
| 9 | Voice pipeline processes fixture | `npm run demo` (voice section) | LIVE |
| 10 | Threat export generates STIX/CSV | `npm run demo` (export section) | LIVE |
| 11 | All 197 tests pass | `npm test` | LIVE |
| 12 | Eval criteria script runs | `node scripts/arize_eval_demo.js` | LIVE |
| 13 | Sentry smoke test passes | `node scripts/sentry_smoke_demo.js` | LIVE |
| 14 | Link pre-scan tooltip appears | Hover a link on any page | LIVE |
| 15 | Typosquat detection works | Visit a typosquatted domain | LIVE |

---

## Demo pages

Open in browser after loading the extension:

| File | Scam Type |
|------|-----------|
| `demo/fake-bank-login.html` | Bank OTP phishing |
| `demo/fake-shipping-fee.html` | USPS/FedEx fee scam |
| `demo/crypto-seed-drain.html` | MetaMask seed phrase harvesting |
| `demo/crypto-investment-scam.html` | Pig butchering / fake returns |
| `demo/grandparent-scam.html` | Family emergency bail scam |
| `demo/lottery-prize-scam.html` | Prize claim fee scam |
| `demo/fake-hostage-ransom.html` | Virtual kidnapping |
| `demo/chinese-family-scam.html` | Chinese embassy impersonation |
| `demo/romance-scam.html` | Romance / relationship fraud |
| `demo/fake-tech-support.html` | Microsoft/Apple support scam |

---

## Test coverage

197 tests across 19 test files covering:
- Scam signal detection (page + voice)
- Typosquat / homoglyph analysis
- Form credential harvesting
- Voice scam pattern matching (8 families)
- Threat intelligence export (STIX, CSV)
- Sentry envelope construction
- Case store (local + Redis)
- Screenshot capture
- ASI agent wrapper
- Arize eval criteria

---

## Environment variables

All optional — every feature degrades gracefully without secrets:

```bash
DEEPGRAM_API_KEY=...          # Voice transcription (fallback: local fixtures)
ANTHROPIC_API_KEY=...         # Claude explanations (fallback: template engine)
BROWSERBASE_API_KEY=...       # URL sandboxing (fallback: local DOM analysis)
BROWSERBASE_PROJECT_ID=...
SENTRY_DSN=...                # Error monitoring (fallback: local log)
REDIS_URL=...                 # Case persistence (fallback: local JSON)
REDIS_REST_URL=...            # Upstash REST alternative
REDIS_API_KEY=...
```

---

## Architecture

```
Page/Voice Input
     │
     ├──→ Deepgram STT (voice) [fallback: local fixture]
     │         │
     ├──→ Browserbase (suspicious URLs) [fallback: local DOM]
     │         │
     ▼         ▼
scamSignals.js ──→ typosquatDetector.js     ← 100% local, no API
     │              formAnalyzer.js
     │              voicePatterns.js
     │
     ▼
 Anthropic Claude (explanation) [fallback: template engine]
     │
     ├──→ Arize eval (quality assurance) [local]
     ├──→ Sentry (error + event capture) [fallback: local log]
     ├──→ Redis / local JSON (case persistence)
     └──→ threatExport.js (STIX / CSV / human report) [local]
```

---

## Compliance boundary

This repository is intentionally separate from prior extension repos. Built from scratch for the hackathon submission window.

Safety boundary: STING stores observed evidence and public technical indicators. It does not claim to identify private individuals or encourage vigilante action.

---

## Platform note

Chrome MV3 extensions are desktop-only. STING does not run on mobile Chrome (Android/iOS). This is a Chrome platform limitation, not a bug.
