# sting demo / QA handoff

## Product loop to demo

1. Load this repo as an unpacked Chrome extension.
2. Open `demo/fake-bank-login.html` or `demo/fake-shipping-fee.html`.
3. Confirm the ambient overlay appears before the user submits payment, password, or security-code fields.
4. Click **Copy receipt** and verify it includes risk, URL, advice, and observed signals.
5. Run the sponsor pipelines from the terminal:
   - `node scripts/save_case_demo.js` — Redis/local case database + Markdown/JSON dossier.
   - `node scripts/inspect_link_demo.js` — Browserbase-isolated link inspection shape; uses real Browserbase only when `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` are set.
   - `node scripts/explain_case_demo.js` — Anthropic grounded explanation; falls back locally without secrets.
   - `node scripts/voice_scam_demo.js` — Deepgram voice-scam path; falls back to explicit demo transcript without secrets.

## Acceptance checks

- Extension warning appears only for medium/high risk pages, not ordinary pages.
- Receipt and dossier never claim to identify a private person or criminal actor.
- Dossier includes: case summary, observed signals, safe next steps, reporting channels, safety boundary.
- If API keys are absent, demos explain missing setup and still run the local/fallback proof path.
- If API keys are present, command output must not print API keys, connection URLs, or bearer tokens.

## Simular tester instructions

Ask Simular to behave like a rushed nontechnical user and test these paths:

1. **Bank login scam**
   - Open `demo/fake-bank-login.html`.
   - Try to continue as if trying to unlock an account.
   - Expected: sting interrupts with high-risk reasoning before sensitive submission.

2. **Shipping fee scam**
   - Open `demo/fake-shipping-fee.html`.
   - Look for fee / urgency / verification pressure.
   - Expected: overlay or receipt flags payment pressure and impersonation indicators.

3. **Receipt copy path**
   - Press `Copy receipt`.
   - Paste into a scratch note.
   - Expected: concise, authority-safe receipt with URL, risk, signals, and safe advice.

4. **Dossier export path**
   - Run `node scripts/save_case_demo.js`.
   - Open the returned `.md` path.
   - Expected: `Grounded Explanation`, `Reporting Channels`, and `Safety Boundary` sections are present.

5. **Voice path smoke test**
   - Run `node scripts/voice_scam_demo.js` with no key.
   - Expected: fallback transcript still produces a case/dossier and clearly says Deepgram setup is missing.

## Judge-safe sponsor story

- **Redis:** case database and evidence dossier export, not just caching.
- **Browserbase:** suspicious links can be inspected in an isolated browser session before the user opens them.
- **Anthropic:** explains deterministic findings in human language; not the detector of record.
- **Deepgram:** turns voicemail/family-emergency/bank-call scams into the same receipt/dossier pipeline.
- **Simular:** tester can validate the user journey and catch unsafe claims or broken warning paths.

## Build verification

Run before presenting:

```bash
npm run build
```

Current expected result: syntax check passes, Node tests pass, and `dist/sting-extension.zip` is packaged.
