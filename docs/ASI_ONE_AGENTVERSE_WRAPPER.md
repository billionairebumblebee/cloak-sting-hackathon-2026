# ASI:One / Agentverse Wrapper

## Overview

`agents/cloak-sting-agent.mjs` wraps the existing Cloak Sting scam-detection pipeline as an Agentverse-compatible agent. It exposes four HTTP routes that other agents or orchestrators can call to analyze threats.

**No public registration has been completed.** This is a local wrapper demonstrating the integration shape. Register on Agentverse only after verifying the agent meets ASI:One publication requirements.

## Routes

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/status` | Health check / readiness probe |
| `GET` | `/.well-known/agent.json` | Agent descriptor for discovery |
| `POST` | `/chat` | Conversational threat analysis |
| `POST` | `/analyze-threat` | Structured scam surface analysis |

## Usage

```bash
# Start the agent (default port 3100)
node agents/cloak-sting-agent.mjs

# Custom port
PORT=8080 node agents/cloak-sting-agent.mjs
```

## API Examples

### Health check

```bash
curl http://localhost:3100/status
# {"status":"ok","agent":"cloak-sting","version":"0.1.0"}
```

### Agent descriptor

```bash
curl http://localhost:3100/.well-known/agent.json
```

### Chat (conversational)

```bash
curl -X POST http://localhost:3100/chat \
  -H 'Content-Type: application/json' \
  -d '{"message": "Your account has been suspended. Verify now with your password and security code. Act now within 24 hours. Wire transfer required."}'
```

Response includes a human-readable `reply` and structured `analysis` with risk, score, findings, and advice.

### Analyze threat (structured)

```bash
curl -X POST http://localhost:3100/analyze-threat \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Bank Security Alert",
    "text": "Your account is locked. Pay the processing fee via gift card immediately.",
    "url": "https://secure-bank-verify.click/login",
    "hostname": "secure-bank-verify.click"
  }'
```

Response is the full `analyzeScamSurface` output: risk, score, findings array, advice, and timestamp.

## Architecture

```
HTTP request
  → agents/cloak-sting-agent.mjs (routing)
    → src/scamSignals.js (detection engine)
      → JSON response
```

The agent adds no new dependencies. It imports the existing `analyzeScamSurface` from `src/scamSignals.js` via `createRequire` (ESM → CJS bridge).

## Agentverse Integration Notes

- The `/.well-known/agent.json` descriptor follows the Agentverse discovery convention.
- Protocol field is set to `asi-one-v0` (placeholder — update when the ASI:One spec stabilizes).
- To register on Agentverse, deploy this agent to a public endpoint and submit the `.well-known/agent.json` URL.
- **Do not claim public registration unless actually completed.**
