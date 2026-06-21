# sting

## Elevator Pitch

sting is a Chrome extension that detects scam patterns in real time — urgency, payment pressure, credential grabs, impersonation — and interrupts the user with a calm warning overlay before they type, pay, or trust. Every scam attempt becomes a shareable evidence dossier for family, banks, or authorities.

## What It Does

sting runs silently on every page. When it detects scam signals (urgency language, unusual payment methods, trusted-institution impersonation, secrecy pressure, credential harvesting), it surfaces a non-panic overlay grading the threat as high/medium risk with specific evidence. The user can copy a structured receipt, dismiss the warning, or save the case for later reporting.

Key capabilities implemented during this hackathon:

- **Deterministic scam signal engine** — scores pages on 5 signal categories (urgency, payment, impersonation, secrecy pressure, credential grabs) plus domain heuristics
- **Ambient warning overlay** — calm, premium UI that interrupts at the danger moment without panic
- **Threat receipt + evidence dossier** — structured export for banks, FTC, IC3, family members
- **Case database** — persists cases to Redis (or local JSON fallback) for memory across sessions
- **Browserbase isolated link inspection** — inspects suspicious links in a sandboxed browser session without exposing the user's device
- **9 demo fixture pages** — fake bank login, shipping fee, romance scam, tech support, crypto investment, customs fee, bank OTP, hostage/ransom, Chinese-language family scam

## How We Built It

Built from scratch during the hackathon in a clean repo. No code carried from prior projects.

- **Core engine**: Pure JavaScript, no ML dependencies — deterministic keyword/pattern scoring runs instantly in the browser with zero API calls for the detection path
- **Chrome Extension (Manifest V3)**: Content script reads DOM text, input fields, URL/hostname; injects warning overlay when risk threshold met
- **Case persistence**: Node.js Redis client (official `redis` package v6) with automatic fallback to local JSON
- **Browserbase integration**: Creates isolated browser sessions via API to safely inspect suspicious links and extract evidence without user exposure
- **Testing**: Node.js built-in test runner (`node --test`), 177 tests across 17 files covering signal detection, case storage, dossier rendering, fixture classification, accessibility, and sponsor integration paths
- **Packaging**: Python script zips the extension for Chrome Web Store or unpacked loading

## Sponsor Usage

| Sponsor | Usage | Status |
|---------|-------|--------|
| **Redis** (MLH) | Case database — stores scam case records with full evidence, findings, jurisdiction, and reporting metadata. Uses `redis` npm package connecting to Redis Cloud (host/port/password). Falls back to local JSON when Redis unavailable. | ✅ Implemented |
| **Browserbase** | Isolated link inspection — opens suspicious URLs in a sandboxed Browserbase session, extracts page content/signals, returns a Cloak receipt without exposing the user's browser or device. | ✅ Implemented |
| **Anthropic/Claude** | Planned: grounded safe-next-steps generation from case evidence. Architecture wired but not yet calling the API. | 🔜 Planned |
| **Arize** | Planned: safety evaluation of detector outputs and dossier quality. | 🔜 Planned |
| **Deepgram** | Planned: voice scam transcription path (voicemail → transcript → scam detector → receipt). Branch in progress. | 🔜 In progress |

## Challenges

- **Avoiding false positives without ML**: Tuning keyword weights and thresholds to separate legitimate banking pages from scam pages required iterative fixture testing. Purely deterministic detection is fast but has coverage gaps for novel scam language.
- **Non-English scams**: Current term lists are English-only. Chinese-language scams are only caught when they include English fallback text. Identified as a priority gap.
- **Privacy-first design**: The extension reads full page text but never sends it to external servers in the detection path. Browserbase inspection is opt-in and isolated.
- **Score ceiling**: All high-confidence scam pages hit the 100-point cap, losing granularity for triage. Documented as a fix in QA report.

## Impact

- **Older adults and non-technical family members** are the primary beneficiaries — the people most targeted by scams and least served by existing tools
- **Families** get a way to see and act on scam evidence without needing technical skills
- **Banks and authorities** (FTC, IC3) get structured, machine-readable case dossiers instead of vague complaints
- **The protection happens at the danger moment** — before the wire transfer, before the password is typed, before the gift card PIN is read aloud

## What's Next

- Deepgram voice scam path (voicemail/call → transcript → detection → receipt)
- Anthropic Claude integration for grounded safe next steps
- Arize safety evaluation layer
- Non-English term list expansion (Chinese, Spanish, Hindi)
- Android Accessibility Service for SMS/app-level ambient detection
- iOS Safari extension + Share Sheet for suspicious messages
- Family dashboard for shared case visibility

## Setup / Demo Instructions

```bash
git clone https://github.com/billionairebumblebee/cloak-sting-hackathon-2026.git
cd cloak-sting-hackathon-2026
npm install
npm run build          # syntax check + tests + package extension zip

# Demo scripts (no external secrets needed):
node scripts/save_case_demo.js
node scripts/inspect_link_demo.js
```

**Load as Chrome extension:**
1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked" → select this repo folder
4. Navigate to any `demo/*.html` file to see the warning overlay trigger

**Demo fixture pages (open in browser after loading extension):**
- `demo/fake-bank-login.html` — bank verification phishing
- `demo/fake-shipping-fee.html` — USPS redelivery fee scam
- `demo/romance-scam.html` — romance/gift card scam
- `demo/fake-tech-support.html` — Microsoft support impersonation
- `demo/crypto-investment-scam.html` — crypto investment fraud
- `demo/customs-fee-scam.html` — DHL customs fee phishing
- `demo/bank-otp-scam.html` — bank OTP credential harvesting
- `demo/fake-hostage-ransom.html` — fake kidnapping/ransom
- `demo/chinese-family-scam.html` — Chinese-language family emergency scam

No external API keys, Redis credentials, or secrets are needed to run the core demo. Redis and Browserbase features activate only when their environment variables are present.
