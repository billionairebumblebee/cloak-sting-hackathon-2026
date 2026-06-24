# Cloak Sting — Devpost Submission Draft

## Inspiration

Scam pages look more convincing every year — fake bank portals, shipping-fee traps, government impersonation, even hostage ransom calls. Victims lose money in minutes because there is no ambient warning before they submit credentials or payment. Cloak Sting sits between the user and the scam, flagging danger before the irreversible action.

## What it does

Cloak Sting is a Chrome extension that runs deterministic scam-signal analysis on any page the user visits. When it detects high-risk patterns — urgency pressure, unusual payment requests, brand impersonation, credential harvesting, isolation/secrecy language — it shows an ambient warning overlay and generates an evidence receipt. The receipt can be exported as a structured dossier for banks, platforms, or authorities.

### Key flows

1. **Page visit → ambient warning** — content script analyzes page text, hostname, and form fields in real time.
2. **Evidence receipt → copy to clipboard** — concise, authority-safe summary with risk score, signals, and safe next steps.
3. **Case database → dossier export** — Redis-backed (or local fallback) case store with Markdown/JSON dossier generation.
4. **Voice scam intake** — Deepgram transcribes voicemail/robocall audio; same detector pipeline produces a dossier.
5. **Isolated link inspection** — Browserbase opens suspicious links in an isolated browser session before the user does.
6. **Grounded explanation** — Anthropic Claude explains deterministic findings in plain language; falls back locally without API key.

## How we built it

- **Deterministic detector** (`src/scamSignals.js`): term-list scoring across urgency, payment, impersonation, secrecy pressure, hostage/ransom, Chinese-language scam, and credential harvesting categories.
- **Chrome extension** (`manifest.json`, `src/content.js`, `src/popup.js`): content script injects warning overlay; popup shows receipt.
- **Case store** (`src/caseStore.js`): Redis Cloud (client or REST) with local JSON fallback. Infers brand, jurisdiction, and reporting channels.
- **Dossier** (`src/dossier.js`): Markdown and JSON export for family, bank, platform abuse, FTC, or IC3 reports.
- **Voice pipeline** (`src/deepgramSTT.js`, `src/voiceScamPipeline.js`): Deepgram Nova-3 STT with language detection, word timing, and metadata.
- **Sentry** (`src/sentry.js`): lightweight envelope capture for reliability monitoring — no `@sentry/node` dependency.
- **Node.js only** — no build framework, no bundler, no transpiler. Pure CommonJS with native Node test runner.

## Challenges we ran into

- Keeping the detector deterministic and explainable — no ML black box, no false-positive hallucination.
- Sanitizing all output so no API keys, DSNs, or credentials appear in receipts, dossiers, or console output.
- Making every sponsor integration degrade gracefully when credentials are absent (booth QA without secrets).

## Accomplishments that we're proud of

- Zero false positives on benign pages (recipe blogs, news sites, legitimate banking) in our fixture suite.
- Every scam fixture page triggers high risk with the correct signal types.
- Full pipeline works offline — no external API required for the core detection loop.

## What we learned

- Scam patterns are surprisingly consistent across languages and media (text, voice, impersonation).
- Ambient warnings before the irreversible action (payment, credential entry) are more effective than post-hoc alerts.
- Structured evidence dossiers help victims take action with banks and authorities.

## What's next for Cloak Sting

- Browser-native ML for visual phishing detection (screenshot analysis).
- Real-time voice analysis during phone calls (not just voicemail replay).
- Community-contributed scam pattern database with privacy-preserving sharing.
- Multi-language expansion beyond English and Chinese.

## Sponsor Integration Status

| Sponsor | Status | Evidence |
|---|---|---|
| **Anthropic** | Implemented | `src/anthropicExplain.js` — Claude grounded explanation of deterministic findings. Falls back locally without API key. Live demo works with `ANTHROPIC_API_KEY`. |
| **Browserbase** | Implemented | `src/browserbaseInspect.js` — isolated link inspection session. Live demo works with `BROWSERBASE_API_KEY` + `BROWSERBASE_PROJECT_ID`. |
| **Deepgram** | Implemented | `src/deepgramSTT.js`, `src/voiceScamPipeline.js` — voice scam transcription + analysis. Live only if `DEEPGRAM_API_KEY` is set and audio proof artifact is available. |
| **Redis** | Implemented | `src/caseStore.js` — case database with Redis Cloud client/REST. Local JSON fallback when Redis is not configured. |
| **Sentry** | Implemented | `src/sentry.js` — lightweight envelope capture. Live only if `SENTRY_DSN` is configured. |
| **Simular** | QA/testing | Fixture pages + test handoff doc for Simular tester validation. |

## Built With

- JavaScript (Node.js, CommonJS)
- Chrome Extensions API (Manifest V3)
- Redis Cloud
- Deepgram Nova-3
- Anthropic Claude
- Browserbase
- Sentry (envelope wire format)
