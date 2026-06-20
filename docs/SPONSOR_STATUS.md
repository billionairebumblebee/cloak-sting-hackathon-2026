# Cloak Sting — Sponsor Integration Status

Honest status of each sponsor integration as of the hackathon submission.

## Implemented and demoable

| Sponsor | Module | Status | Demo |
|---------|--------|--------|------|
| **Anthropic** | `src/anthropicExplain.js` | Implemented. Grounded explanation seam with deterministic fallback. | `node scripts/explain_case_demo.js` |
| **Browserbase** | `src/browserbaseInspect.js` | Implemented. Isolated link inspection seam. Live session creation when keys are set; local fixture path otherwise. | `node scripts/inspect_link_demo.js` |
| **Deepgram** | `src/deepgramTranscribe.js`, `src/deepgramSTT.js`, `src/voiceScamPipeline.js` | Implemented. Voice scam transcription + pipeline. Live transcription needs real audio + API key; fallback transcript demos work without keys. | `node scripts/voice_scam_demo.js` / `node scripts/transcribe_voice_demo.js` |
| **Redis** | `src/caseStore.js` | Implemented. Case store with Redis client, Redis REST, and local JSON fallback. Live Redis requires `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD` or `REDIS_URL`. | `node scripts/save_case_demo.js` |
| **Sentry** | `src/sentry.js` | Implemented. Zero-dependency envelope capture. Reads `SENTRY_DSN` from env only; sanitizes URLs and context. | `node scripts/sentry_smoke_demo.js` |
| **ASI:One / Agentverse** | `src/asiOneWrapper.js` | Implemented as local agent wrapper. Exposes scam analysis through agent-protocol request/response shape. **Not registered on Agentverse** — registration is a manual step. | `node scripts/asi_agent_demo.js` |

## Not implemented

| Sponsor | Status |
|---------|--------|
| **Simular** | Test handoff documented; no code integration. |

## Claim rules

- Only claim "live verified API call" if the demo actually calls the API with real credentials and succeeds.
- If the demo uses fallback/fixture data, say "adapter seam implemented with deterministic fallback."
- Do not claim Agentverse registration unless manually completed.
- Do not claim live Redis unless `REDIS_HOST` etc. are configured and output confirms Redis backend.
