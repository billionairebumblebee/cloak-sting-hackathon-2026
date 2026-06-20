# Cloak Sting — Hackathon 2026

Built from scratch for the hackathon submission window.

## Compliance boundary

This repository is intentionally separate from prior Cloak extension repos. Do not copy code, assets, commits, or implementation files from pre-hackathon Cloak repositories into this project unless the hackathon rules explicitly allow that material.

## MVP loop

Suspicious page → deterministic scam signals → ambient warning overlay → local evidence receipt → popup summary.

## Run

```bash
npm test
npm run build
node scripts/save_case_demo.js
node scripts/inspect_link_demo.js
```

Load this folder as an unpacked Chrome extension for demo.

## Demo pages

Open these locally in a browser after loading the extension:

- `demo/fake-bank-login.html`
- `demo/fake-shipping-fee.html`

The pages are intentionally fake scam fixtures for demo/testing.

## Case database / dossiers

`src/caseStore.js` turns a threat receipt into an authority-safe scam case record.

- If `REDIS_REST_URL` + `REDIS_API_KEY` are configured, it writes cases to Redis via REST.
- If only `REDIS_API_KEY` is present or Redis REST details are unavailable, it falls back to `data/scam-cases.json` so the demo still works.
- `src/dossier.js` exports the same case as JSON or Markdown for a family, bank, platform abuse team, FTC, or IC3 report.

Safety boundary: Cloak Sting stores observed evidence and public technical indicators. It does not claim to identify private individuals or encourage vigilante action.

## Browserbase isolated link inspection

`src/browserbaseInspect.js` creates a Browserbase session using `BROWSERBASE_API_KEY` + `BROWSERBASE_PROJECT_ID`, then turns suspicious-link evidence into the same Cloak receipt/case/dossier shape.

Demo:

```bash
node scripts/inspect_link_demo.js https://example.com/suspicious-page
```

If Browserbase credentials are unavailable, the script still explains the missing setup instead of printing secrets.
