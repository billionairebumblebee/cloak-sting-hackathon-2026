# Arize Eval Proof — cloak sting Scam Explanations

## Booth Summary (for judges)

**What Arize does here:** Arize is the eval/observability proof layer for cloak sting's AI explanations. It does **not** replace the core scam detector — it evaluates whether the AI explanation is honest, grounded, safe, and clear.

**How Arize improved the app:** We built an eval harness with 5 criteria (groundedness, safe action, no overclaiming, no secrets, clarity). Running these evals on explanation output exposed failure modes — overclaiming, jargon-heavy language, missing safe actions — and drove concrete improvements. The before/after demo shows a hypothetical v0 explanation failing 3/5 criteria vs. the current Arize-guided explanation passing 5/5.

**What you'll see:**
- `node scripts/arize_eval_demo.js` runs 4 fixtures and prints pass/fail per criterion
- A before/after improvement demo in the same output
- If AX is configured: dataset + experiment visible in Arize space `billionairebumblebee Space`
- Local report at `data/arize-eval-report.json`

## What this evaluates

cloak sting's AI explanation layer (`src/anthropicExplain.js`) takes deterministic scam findings and produces a consumer-safety explanation via Anthropic Claude. When the API key is unavailable, a local deterministic fallback generates the explanation instead.

This eval layer checks that **explanations are honest, grounded, and safe** — regardless of which provider produced them.

## Eval criteria (5 checks per fixture)

| Criterion | What it checks |
|-----------|---------------|
| **grounded** | Explanation references observed evidence/signals from the case — not invented facts. |
| **safeAction** | Tells the user: don't enter card/password/code; use an official source to verify. |
| **noOverclaim** | Avoids "definitely fraud", "criminal", "guilty" unless evidence justifies it. |
| **noSecrets** | No API keys, tokens, or credentials appear in the explanation output. |
| **clarity** | Normal-person language — no excessive jargon (heuristic, embeddings, regex, etc.). |

## Fixtures

| Fixture | Scenario | Expected risk | Matches demo page |
|---------|----------|---------------|-------------------|
| fake-bank-login | Bank OTP/credential harvesting | high | `demo/fake-bank-login.html` |
| fake-shipping-fee | USPS redelivery fee phishing | high | `demo/fake-shipping-fee.html` |
| safe-normal-page | Wikipedia (no scam signals) | low | — |
| crypto-seed-phrase | Crypto wallet seed phrase theft | high | — |

## Before/after improvement demo

The script includes a concrete before/after comparison on the fake-bank-login fixture:

**BEFORE (hypothetical v0, no Arize eval):**
- Overclaims: "This is definitely a scam. The criminal is guilty."
- Jargon: "heuristic signal engine", "deterministic score normalization", "regex payload"
- Fails: noOverclaim, clarity, safeAction (vague)

**AFTER (Arize-guided, current code):**
- Grounded: "cloak sting marked this as high risk based on observed signals: Urgency pressure, ..."
- Safe action: "Pause, do not share money/passwords/codes, verify through an official app..."
- No overclaim: "The warning is based on page text, URL/domain patterns... not on guessing who is behind it."
- Clear language: no jargon, normal-person words
- Passes all 5 criteria

## How to run

```bash
# Local eval only (no Anthropic key needed — uses deterministic fallback)
node scripts/arize_eval_demo.js

# With Anthropic explanations
ANTHROPIC_API_KEY=... node scripts/arize_eval_demo.js
```

The report is written to `data/arize-eval-report.json`.

## Arize AX upload

If the `ax` CLI is configured with a valid profile, the script will:

1. Create an Arize dataset (`cloak-sting-scam-explanations`) with the fixture data.
2. Export the dataset to resolve example IDs.
3. Create an experiment with eval scores (grounded, safeAction, noOverclaim, noSecrets, clarity) per fixture.

### Setup

```bash
# Install ax CLI (if not already installed)
pip install arize-ax-cli

# Create a profile with your Arize API key
ax profiles create

# Run eval with upload
node scripts/arize_eval_demo.js
```

### AX status

If the `ax` profile is configured, the script uploads automatically. If not, it produces a local report and documents the exact blocker in `data/arize-eval-report.json` under `arizeAX.blocker`.

**To verify in Arize UI:** https://app.arize.com → Space "billionairebumblebee Space" → Datasets → cloak-sting-scam-explanations

## Architecture

```
Scam page fixture
  → src/scamSignals.js (deterministic signal engine — core detector)
  → src/caseStore.js   (normalize receipt → authority-safe case record)
  → src/anthropicExplain.js (Claude explanation, or deterministic fallback)
  → src/arizeEvalCriteria.js (5 eval checks — this is the Arize proof layer)
  → data/arize-eval-report.json (local report)
  → ax datasets create + ax experiments create (Arize cloud, if configured)
```

Arize evaluates the **explanation quality**, not the detector itself. The detector is deterministic and does not need LLM eval.

## Report format

`data/arize-eval-report.json` contains:

```json
{
  "evalName": "cloak-sting-explanation-quality",
  "criteria": ["grounded", "safeAction", "noOverclaim", "noSecrets", "clarity"],
  "fixtureCount": 4,
  "passCount": 4,
  "passRate": "100%",
  "results": [ ... ],
  "beforeAfter": {
    "before": { "passCount": 2, "totalCriteria": 5 },
    "after":  { "passCount": 5, "totalCriteria": 5 },
    "improvement": ["noOverclaim", "clarity", "safeAction"]
  },
  "arizeAX": { "attempted": false, "success": false, "blocker": "..." }
}
```

## Tests

```bash
npm test
```

`tests/arizeEval.test.js` validates all 5 eval criteria with positive and negative cases, plus a before/after improvement test.
