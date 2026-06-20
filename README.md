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
