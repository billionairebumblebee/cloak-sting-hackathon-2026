# JUDGE_PROOF.md — STING Judging Reference

## 30-Second Pitch

STING is a Chrome extension that detects online scams in real time — phishing, fake banks, crypto drains, romance fraud, grandparent scams — and warns users with a calm overlay before they type, pay, or trust. Every scam attempt becomes an evidence dossier shareable with family, banks, or authorities. Core detection is 100% local, 197 tests pass with zero API keys, and 12 sponsor integrations enhance the pipeline with voice transcription, case memory, isolated link inspection, and AI-grounded explanations.

---

## 3-Minute Pitch Bullets

1. **Problem**: Scammers win because warnings arrive *after* the damage. Reporting is confusing. Families can't protect each other.
2. **Solution**: Ambient detection at the moment of risk — before the wire transfer, before the password is typed.
3. **How it works**: Content script scores page text against 10 scam signal categories (urgency, payment, impersonation, credential harvesting, secrecy pressure, ransom, social engineering, crypto drain, deepfake, romance). If score > threshold, a calm warning overlay fires.
4. **Evidence layer**: Every detection becomes a structured receipt with case ID, findings, brand inference, jurisdiction, and reporting channels (FTC, FBI IC3, bank abuse teams).
5. **Voice pipeline**: Deepgram STT transcribes scam calls → 8-family voice pattern matcher identifies IRS, tech support, grandparent, romance, crypto, kidnapping, lottery, utility scams.
6. **Sponsor tech enhances, not powers**: Core detection runs 100% locally with zero network calls. Sponsors add quality layers (explanation, persistence, monitoring, eval, sandboxing).
7. **Impact**: Protects the most vulnerable — older adults and non-technical family members — at the exact moment of risk.
8. **Scale**: 197 tests, 12 integrations, 10 demo pages, Chrome Web Store ready, deployed site with live interactive demo.

---

## Demo Flow (Table Demo — 90 seconds)

### Pre-loaded tabs (have these ready):

1. `chrome://extensions` — show STING loaded, no errors
2. `demo/fake-bank-login.html` — bank phishing (warning fires)
3. `demo/crypto-seed-drain.html` — seed phrase harvesting
4. `demo/grandparent-scam.html` — family emergency scam
5. Extension popup — show Status tab (protection active, stats, modules)
6. Website: `https://cloak-sting-hackathon-2026.vercel.app/` — interactive demo + arsenal

### Demo script:

| Time | Action | Say |
|------|--------|-----|
| 0:00 | Show extension loaded | "STING runs on every page you visit, silently." |
| 0:10 | Navigate to fake-bank-login | "Grandma gets a text saying her bank account is locked. She clicks the link." |
| 0:15 | Warning overlay appears | "STING catches it instantly — urgency language, credential harvesting, domain spoofing. Calm warning, not panic." |
| 0:25 | Click "Save proof" | "Evidence receipt — case ID, findings, reporting channels. Copy this to your bank or FTC." |
| 0:35 | Show crypto-seed-drain | "Same engine catches crypto seed phrase harvesting." |
| 0:45 | Show grandparent scam | "And family emergency scams targeting grandparents." |
| 0:55 | Open extension popup | "Stats: pages scanned, threats found, 10 detection modules all LIVE." |
| 1:05 | Open website arsenal | "12 integrations — each with real code, tests, and honest fallback status." |
| 1:20 | End | "197 tests, zero API keys needed, Chrome Web Store ready." |

---

## Sponsor Proof Commands

Run these from the repo root. **All work without any API keys.**

```bash
# Full pipeline demo (all 7 stages)
npm run demo

# Individual sponsor proofs:
node scripts/arize_eval_demo.js          # Arize: 5-criteria eval, local report
node scripts/token_compress_demo.js      # Token Company: 66% compression proof
node scripts/asi_agent_demo.js           # ASI:One: 4-endpoint agent wrapper
node scripts/save_case_demo.js           # Redis: case persistence (JSON fallback)
node scripts/inspect_link_demo.js        # Browserbase: link inspection
node scripts/explain_case_demo.js        # Anthropic: explanation generation
node scripts/voice_scam_demo.js          # Deepgram: voice scam pipeline
node scripts/sentry_smoke_demo.js        # Sentry: envelope verification

# Tests (197 pass)
npm test

# Build + package extension zip
npm run build
```

---

## What Each Sponsor Does

| # | Sponsor | Role in Pipeline | Status | Proof |
|---|---------|-----------------|--------|-------|
| 1 | **Deepgram** | Voice STT → 8-family scam pattern matcher | FALLBACK (local fixtures without key) | `scripts/voice_scam_demo.js` |
| 2 | **Anthropic** | Grounded plain-English explanations of findings | FALLBACK (template engine without key) | `scripts/explain_case_demo.js` |
| 3 | **Browserbase** | Isolated URL detonation in sandboxed browser | FALLBACK (local DOM analysis without key) | `scripts/inspect_link_demo.js` |
| 4 | **Redis** | Case persistence + pattern memory | FALLBACK (local JSON without connection) | `scripts/save_case_demo.js` |
| 5 | **Sentry** | Error + scam event monitoring | FALLBACK (local log without DSN) | `scripts/sentry_smoke_demo.js` |
| 6 | **Fetch.ai / ASI:One** | Agent coordination (4 HTTP endpoints) | LOCAL (no Agentverse registration) | `scripts/asi_agent_demo.js` |
| 7 | **Arize / Phoenix** | 5-criteria eval for explanation quality | LOCAL (runs entirely locally) | `scripts/arize_eval_demo.js` |
| 8 | **Token Company** | Risk-preserving evidence compression | LOCAL (deterministic, no network) | `scripts/token_compress_demo.js` |
| 9 | **Simular** | Autonomous cloud QA testing (not runtime) | CLOUD QA | `QA_REPORT.md` |
| 10 | **OpenAI Codex** | AI pair programming | DEV TOOL | — |
| 11 | **Devin (Cognition)** | Full-stack engineering agent | DEV TOOL | — |
| 12 | **Pika / Midjourney** | Visual design + demo video | SUPPORT | Site assets |

---

## What NOT to Claim

| Claim | Reality |
|-------|---------|
| "We catch all scams" | We use heuristic pattern matching — false negatives happen |
| "We use AI/ML for detection" | Core detection is deterministic keyword/pattern scoring — NO ML |
| "Simular powers our detection" | Simular was QA testing only, not in the runtime pipeline |
| "We guarantee protection" | We provide informational warnings, not guarantees |
| "We identify criminals" | We observe public indicators, not identify individuals |
| "Redis is always connected" | It falls back to local JSON automatically |
| "Deepgram processes live calls" | Without API key, it uses local transcript fixtures |
| "ASI agent is on Agentverse" | It's a local wrapper; no live registration |
| "Arize uploads to cloud" | Runs locally; cloud upload requires `ax` CLI profile |
| "Token Company is a compression algorithm" | It's domain-specific risk-preserving field extraction |

---

## Q&A Prep

**Q: How is this different from Google Safe Browsing?**
A: Safe Browsing uses a blocklist of known-bad URLs. STING analyzes page *content* in real time — urgency language, payment demands, credential harvesting, domain spoofing. It catches zero-day scam pages that haven't been reported yet.

**Q: Does it send user data anywhere?**
A: No. Core detection runs entirely on-device. Page text is analyzed locally and never transmitted. Optional sponsor APIs (Browserbase, Redis, etc.) only activate when the user explicitly configures keys.

**Q: What about false positives?**
A: We raised thresholds (min visible = 55, block = 70) and added a 25+ domain allowlist for major trusted sites. A page needs multiple strong scam signals to trigger — not just one keyword.

**Q: Why not use ML?**
A: Deterministic detection is instant (no model loading), privacy-preserving (no data leaves the device), and explainable (every finding points to specific evidence). ML would be slower, less transparent, and require data collection.

**Q: How do the sponsor integrations work together?**
A: Pipeline: Page → scamSignals (local) → Browserbase (isolated inspection) → Anthropic (explanation) → Arize (eval quality) → Redis (persistence) → Sentry (monitoring) → threatExport (STIX/CSV). Each step has a working fallback.

**Q: What's the business model?**
A: Free forever for consumers. Future: enterprise API for banks/platforms to batch-scan URLs, family dashboard subscription, Chrome Web Store featured listing.

**Q: How many scam types does it detect?**
A: 10 categories: urgency/time pressure, unusual payment demands, impersonation/spoofing, secrecy/isolation pressure, credential harvesting, ransom/threats, social engineering, crypto drain, deepfake indicators, romance/emotional manipulation. Plus typosquat detection against 20 major brands.

**Q: Is this Chrome-only?**
A: Chrome Manifest V3 for now. Architecture supports Firefox (minor manifest changes). iOS/Android planned via Safari Web Extension and Accessibility Service.

---

## Ethical AI Answer

**Q: What are the ethical considerations?**

STING is designed with ethical boundaries from the start:

1. **Privacy-first**: All detection runs locally. No user data is collected, transmitted, or stored on external servers in the detection path. The extension requests only `storage` and `activeTab` permissions.

2. **No vigilante action**: We observe public technical indicators (URLs, page text, domain patterns). We do NOT identify individuals, encourage confrontation, or claim law enforcement authority. Language uses "spot," "link," "warn," "guard" — never "catch criminals" or "take down."

3. **Honest limitations**: The warning overlay explicitly states findings are heuristic-based. Users can dismiss warnings. False positives are acknowledged in docs and UI.

4. **Evidence, not judgment**: STING produces structured evidence (case IDs, findings, timestamps) for authorities and banks to evaluate. It does not make legal determinations.

5. **Accessibility**: Warning UI is designed for older adults and non-technical users — calm, readable, actionable. No jargon, no panic, no dark patterns.

6. **No overclaiming**: README, Devpost, and sponsor pages all use honest status labels (LIVE, FALLBACK, LOCAL, DEV TOOL). Nothing claims "guaranteed protection" or "100% detection rate."

---

## Quick Reference

| Metric | Value |
|--------|-------|
| Tests passing | 197 |
| Test files | 19 |
| Sponsor integrations | 12 |
| Demo pages | 10 |
| Scam signal categories | 10 |
| Voice scam families | 8 |
| Typosquat brands monitored | 20 |
| Extension zip size | 43 KB |
| Extension permissions | 2 (storage, activeTab) |
| API keys needed to demo | 0 |
| Deployed site | https://cloak-sting-hackathon-2026.vercel.app/ |
| Chrome Web Store ready | Yes |
