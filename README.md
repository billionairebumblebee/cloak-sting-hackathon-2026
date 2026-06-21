# cloak STING — UC Berkeley AI Hackathon 2026

**STING = Scam Tracking & Intelligence Network Guard**

**Ambient scam-defense that protects the people who need it most.**

cloak STING is a Chrome extension + voice analysis pipeline that detects scams in real time — fake bank pages, crypto seed phrase harvesting, IRS impersonation calls, grandparent scams, romance fraud, and more. It generates evidence dossiers shareable with banks, law enforcement, and family members.

> *"Scammers picked the wrong target."*

## Quick Start

```bash
npm install
npm test        # 169 tests
npm run build   # check + test + package extension ZIP
npm run demo    # one-click showcase of all capabilities
```

Load `dist/cloak-sting-extension.zip` as an unpacked Chrome extension for live demo.

## What It Does

| Layer | Description |
|-------|-------------|
| **Page Scanner** | Scans every page for 10+ scam signal categories: urgency, payment demands, credential harvesting, impersonation, ransom, social engineering, crypto drain, deepfake indicators |
| **Typosquat Detector** | Levenshtein distance, homoglyph detection, combo-squat analysis, suspicious TLD flagging against 20 major brands |
| **Form Analyzer** | Detects credential-harvesting forms: SSN, credit cards, CVV, seed phrases, private keys, OTP codes |
| **Voice Pipeline** | Deepgram Nova-3 STT → 8-family voice scam pattern matcher (IRS, tech support, romance, crypto, kidnapping, grandparent, lottery, utility) |
| **Evidence Dossier** | Case records with brand inference, jurisdiction detection, reporting channels (FTC, FBI IC3, bank abuse teams) |
| **Threat Export** | STIX 2.1 bundles, CSV, and human-readable reports for law enforcement |
| **Link Pre-scan** | Hover any link to get real-time domain analysis tooltip |

## Sponsor Integrations (All Live)

| Sponsor | Integration | Files |
|---------|-------------|-------|
| **Deepgram** | Nova-3 real-time STT, language detection, word timestamps | `src/deepgramSTT.js`, `src/deepgramTranscribe.js`, `src/voiceScamPipeline.js` |
| **Anthropic** | Claude verdict engine with 5-criteria eval pipeline | `src/anthropicExplain.js`, `src/arizeEvalCriteria.js` |
| **Browserbase** | Sandboxed URL inspection, form/redirect capture | `src/browserbaseInspect.js` |
| **Redis** | 3-backend case store (Redis client, REST, local JSON) | `src/caseStore.js` |
| **Sentry** | Custom envelope protocol, all-path error capture, 20 tests | `src/sentry.js` |
| **Fetch.ai / ASI:One** | Agent wrapper with 4 endpoints, Agentverse-ready | `src/asiOneWrapper.js`, `agents/cloak-sting-agent.mjs` |
| **Arize / Phoenix** | 5-criteria eval: grounded, safeAction, noOverclaim, noSecrets, clarity | `src/arizeEvalCriteria.js` |

## Architecture

```
Page/Voice Input
     │
     ├──→ Deepgram STT (voice)
     │         │
     ├──→ Browserbase (suspicious URLs)
     │         │
     ▼         ▼
scamSignals.js ──→ typosquatDetector.js
     │              formAnalyzer.js
     │              voicePatterns.js
     │
     ▼
 Anthropic Claude (verdict + explanation)
     │
     ├──→ Arize eval (quality assurance)
     ├──→ Sentry (error + event capture)
     ├──→ Redis / local (case persistence)
     └──→ threatExport.js (STIX / CSV / human report)
```

## Demo Pages

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

## Test Coverage

169 tests across 15 test files covering:
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

## Environment Variables

All optional — every feature degrades gracefully without secrets:

```bash
DEEPGRAM_API_KEY=...          # Voice transcription
ANTHROPIC_API_KEY=...         # Claude explanations
BROWSERBASE_API_KEY=...       # URL sandboxing
BROWSERBASE_PROJECT_ID=...
SENTRY_DSN=...                # Error monitoring
REDIS_URL=...                 # Case persistence (or REDIS_HOST/PORT/PASSWORD)
REDIS_REST_URL=...            # Upstash REST alternative
REDIS_API_KEY=...
```

## Compliance Boundary

This repository is intentionally separate from prior Cloak extension repos. Built from scratch for the hackathon submission window.

Safety boundary: cloak STING stores observed evidence and public technical indicators. It does not claim to identify private individuals or encourage vigilante action.
