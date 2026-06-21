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
npm test          # 213 tests pass — zero keys required
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

Devpost sponsor chips are only the entry point, so this README is the detailed proof surface. Every claimed sponsor maps to a real stage of the STING scam-defense pipeline, with code paths, scripts, or explicit support-tool usage. **Nothing requires an API key to demo the core product.**

| Sponsor / chip | How STING uses it | Runtime status | Proof |
|---|---|---|---|
| **Deepgram** | Voice scam pipeline: voicemail/call audio → transcript → voice scam pattern detection → evidence handoff packet. Used for bank impersonation, fake emergency, tech support, romance, crypto, kidnapping/grandparent, lottery, and utility scam scripts. | Live STT when `DEEPGRAM_API_KEY` is set; local audio fixtures + transcript fallback without keys. | `src/deepgramTranscribe.js`, `src/deepgramSTT.js`, `src/voiceScamPipeline.js`, `scripts/voice_scam_demo.js`, `scripts/transcribe_voice_demo.js`, `demo/voicemail-quarantine.html` |
| **Anthropic / Claude** | Plain-English explanation layer over deterministic evidence. Claude is not the detector; it turns findings into calm, grounded next steps for vulnerable users and families. | Live Claude when `ANTHROPIC_API_KEY` is set; deterministic template fallback otherwise. | `src/anthropicExplain.js`, `scripts/explain_case_demo.js` |
| **Browserbase** | Isolated suspicious-link inspection: a “bomb squad browser” path for opening risky URLs away from the user’s device, extracting page evidence, then feeding STING’s local detector. | Live Browserbase session when keys are set; local DOM/fetch fallback otherwise. | `src/browserbaseInspect.js`, `scripts/inspect_link_demo.js`, `dist/browserbase/` proof artifact |
| **Redis** | Scam memory and case database: saves evidence receipts, repeated scam indicators, and clustered suspected scam infrastructure profiles. Supports community blacklist/network-effect story. | Redis/Upstash when configured; automatic local JSON fallback for demos. | `src/caseStore.js`, `src/scammerProfile.js`, `scripts/save_case_demo.js`, `scripts/scammer_profile_demo.js`, `data/cluster-profiles-demo.json` |
| **Sentry** | Reliability + abuse-signal monitoring for protection software. STING sends scam-detection and integration-failure events so failures are visible when warnings, voice analysis, or AI explanation paths break. | Live Sentry project exists; local envelope/log fallback when `SENTRY_DSN` is absent. | `src/sentry.js`, `scripts/sentry_smoke_demo.js`, Sentry org: https://cloak-qr.sentry.io, project: `cloak-sting-extension`, issues: https://cloak-qr.sentry.io/issues/?project=cloak-sting-extension&query=is%3Aunresolved |
| **Fetch.ai / ASI:One** | Local agent-wrapper interface for STING as an anti-scam agent: analyze a suspicious page/voice/report request and return structured scam findings in an agent-style request/response shape. | Local wrapper implemented; no claim of Agentverse registration unless manually completed. | `src/asiOneWrapper.js`, `scripts/asi_agent_demo.js` |
| **Arize / Phoenix** | Evaluation layer for AI-generated scam explanations: checks whether explanations are grounded in evidence, safe, clear for nontechnical users, and avoid overclaiming. | Local eval report generation; cloud traces/observability if configured. | `src/arizeEvalCriteria.js`, `scripts/arize_eval_demo.js`, `docs/ARIZE_EVAL_PROOF.md`, `data/arize-eval-*.json` |
| **Token Company** | Risk-preserving evidence compression: noisy scam page/voice/report evidence → compact structured block that preserves URL, brand, score, exact scam quotes, indicators, and safe next steps. | Local deterministic compressor; demonstrates 66% reduction while preserving critical fields. | `src/tokenCompress.js`, `scripts/token_compress_demo.js`, `data/token-compress-proof.json` |
| **Simular / Sai** | Vulnerable-user simulation, not generic QA: Sai is framed as an older/nontechnical scam-victim persona testing whether STING’s warning, family rescue button, and scammer handoff packet are understandable under pressure. | Sponsor support/evaluation tool; not runtime product infrastructure. | Simular/Sai proof should show personas tested, screenshots/logs, findings, and fixes; see `docs/SPONSOR_STATUS.md` and site sponsor proof. |
| **OpenAI Codex** | AI coding agent used for implementation acceleration across tests, scripts, extension logic, and docs during a one-day hackathon sprint. | Development tool, not runtime product dependency. | Git history / generated implementation artifacts |
| **Devin (Cognition)** | Full-stack agent handoffs for parallel implementation: family rescue mode, scammer profile network, reporting routes, accessible inbox roadmap, sponsor proof audits. | Development tool, not runtime product dependency. | `docs/DEVIN_FAMILY_RESCUE_MODE_7_SUBAGENTS.md`, `docs/DEVIN_STING_ROADMAP_ACCESSIBLE_INBOX_SPRINT.md` |
| **Pika / Midjourney** | Visual design support for Devpost/Chrome Web Store/pitch assets: STING logo/thumbnail/listing-style graphics and launch support materials. | Support/polish only; not claimed as runtime product infrastructure. | `site/public/sting-logo.svg`, Devpost/extension listing assets |

### Key distinction
- **Core detection is 100% local** — `scamSignals.js`, `typosquatDetector.js`, `formAnalyzer.js`, `voicePatterns.js`, `familyRescue.js`, `reportingRoute.js`, and `scammerProfile.js` run without external API calls.
- **Sponsor APIs are enhancement layers** — explanation quality (Anthropic), voice transcription (Deepgram), URL sandboxing (Browserbase), persistence (Redis), monitoring (Sentry), coordination (ASI), eval (Arize), compression (Token Company).
- **Support sponsors are labeled honestly** — Simular/Sai tests vulnerable-user comprehension; Codex/Devin accelerate implementation; Pika/Midjourney provide visual polish. They are not described as hidden runtime infrastructure.
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
| 11 | All 213 tests pass | `npm test` | LIVE |
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

213 tests across 22 test files covering:
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
- Family rescue handoff packet generation
- Scam infrastructure profile clustering
- Official reporting route packets

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
