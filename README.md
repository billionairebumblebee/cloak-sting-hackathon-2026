# Cloak Sting — Hackathon 2026

Built from scratch for the hackathon submission window.

## Compliance boundary

This repository is intentionally separate from prior Cloak extension repos. Do not copy code, assets, commits, or implementation files from pre-hackathon Cloak repositories into this project unless the hackathon rules explicitly allow that material.

## MVP loop

Suspicious page → deterministic scam signals → ambient warning overlay → local evidence receipt → popup summary.

## Run

Full QA/demo handoff: [`docs/demo-handoff.md`](docs/demo-handoff.md)

```bash
npm test
npm run build
node scripts/save_case_demo.js
node scripts/inspect_link_demo.js
node scripts/explain_case_demo.js
node scripts/voice_scam_demo.js
node scripts/transcribe_voice_demo.js
```

Load this folder as an unpacked Chrome extension for demo.

## Demo pages

Open these locally in a browser after loading the extension:

- `demo/fake-bank-login.html`
- `demo/fake-shipping-fee.html`

The pages are intentionally fake scam fixtures for demo/testing.

## Case database / dossiers

`src/caseStore.js` turns a threat receipt into an authority-safe scam case record.

- If `REDIS_URL` is configured, or `REDIS_HOST` + `REDIS_PORT` + `REDIS_PASSWORD` are configured, it writes cases to Redis using the official Node client.
- If `REDIS_REST_URL` + `REDIS_API_KEY` are configured, it can also write cases via Redis REST.
- If Redis connection details are unavailable, it falls back to `data/scam-cases.json` so the demo still works.
- `src/dossier.js` exports the same case as JSON or Markdown for a family, bank, platform abuse team, FTC, or IC3 report.

Redis Cloud env shape:

```bash
REDIS_USERNAME=default
REDIS_PASSWORD=...
REDIS_HOST=...
REDIS_PORT=...
```

Safety boundary: Cloak Sting stores observed evidence and public technical indicators. It does not claim to identify private individuals or encourage vigilante action.

## Anthropic grounded receipt explanation

`src/anthropicExplain.js` adds a Claude explanation layer on top of deterministic findings. It only sends a compact case JSON containing observed fields and falls back to a local deterministic explanation when `ANTHROPIC_API_KEY` is missing or the API fails.

```bash
ANTHROPIC_API_KEY=... node scripts/explain_case_demo.js
```

The explanation is stored inside the dossier under `Grounded Explanation` and is framed as safety guidance, not a detector of record.

## Deepgram voice scam transcription

`src/deepgramTranscribe.js` supports voicemail / fake-bank / family-emergency voice scam intake:

```bash
DEEPGRAM_API_KEY=*** node scripts/voice_scam_demo.js path/to/audio.wav
```

Deepgram returns the transcript; Cloak Sting runs the same deterministic detector, stores the case in Redis/local fallback, and exports a dossier. If the key is missing, the demo uses an explicit fallback transcript so booth QA can still exercise the pipeline without secrets.

## Browserbase isolated link inspection

`src/browserbaseInspect.js` creates a Browserbase session using `BROWSERBASE_API_KEY` + `BROWSERBASE_PROJECT_ID`, then turns suspicious-link evidence into the same Cloak receipt/case/dossier shape.

Demo:

```bash
node scripts/inspect_link_demo.js https://example.com/suspicious-page
```

If Browserbase credentials are unavailable, the script still explains the missing setup instead of printing secrets.

## Extended voice scam pipeline (deepgramSTT + voiceScamPipeline)

`src/deepgramSTT.js` extends voice intake with URL-based transcription, word-level timing, full metadata extraction, and configurable query parameters (language, diarize, summarize).

`src/voiceScamPipeline.js` wires STT output through the `scamSignals` analyzer and produces a case record + dossier through `caseStore` / `dossier`.

### Extended scam signal coverage

| Scenario | Language | Signal types |
|---|---|---|
| Fake hostage / ransom | English | `ransom`, `payment`, `pressure` |
| Bank robocall | English | `copy`, `impersonation`, `payment` |
| Chinese embassy scam | Chinese | `chinese_scam` |

### Usage

```bash
# With Deepgram API key (live transcription from URL):
DEEPGRAM_API_KEY=... node scripts/transcribe_voice_demo.js https://example.com/audio.wav

# With sample transcripts (no API key needed):
node scripts/transcribe_voice_demo.js                    # hostage/ransom scenario
node scripts/transcribe_voice_demo.js '' bank            # bank robocall scenario
node scripts/transcribe_voice_demo.js '' chinese         # Chinese embassy scam
```

The demo falls back to mocked Deepgram responses when `DEEPGRAM_API_KEY` is not set. Produces full dossiers (Markdown + JSON) in `dist/dossiers/`.

## Sentry lightweight envelope capture

`src/sentry.js` sends scam-detection events to Sentry using the raw envelope wire format — no `@sentry/node` dependency. Reads `SENTRY_DSN` from env only; never hardcoded.

- Parses DSN to extract project ID, public key, and ingest URL.
- Builds a minimal Sentry envelope (event item) with sanitized tags/extra.
- Redacts any context keys matching `key`, `token`, `secret`, `password`, `dsn`, `auth`, `bearer`, `credential`.
- Sanitizes URLs by stripping query strings, fragments, and embedded credentials.
- Falls back gracefully when `SENTRY_DSN` is not set.

```bash
# Smoke demo (self-test without DSN, or live send with DSN):
node scripts/sentry_smoke_demo.js
SENTRY_DSN=https://key@o1.ingest.sentry.io/123 node scripts/sentry_smoke_demo.js
```

## ASI:One / Agentverse scam analysis agent

`src/asiOneWrapper.js` wraps the deterministic scam signal engine as an agent-callable endpoint compatible with Fetch.ai ASI:One / Agentverse protocol.

- `GET /info` — returns agent metadata (name, protocol, capabilities).
- `POST /analyze` — accepts `{ url, title, text }` and returns a threat receipt, case record summary, and dossier preview.
- No ASI:One API key or Agentverse registration required for local demo.
- Registration with Agentverse is a separate manual step (not yet completed).

```bash
node scripts/asi_agent_demo.js
# Starts agent server on port 8199, runs sample requests, then stops.
```
