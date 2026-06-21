# Demo Script — Table Judging (≤5 minutes)

## Setup (before judges arrive)

- Chrome open with extension loaded (unpacked from repo folder)
- Two tabs pre-opened: `demo/fake-bank-login.html` and `demo/romance-scam.html`
- Terminal open with repo directory ready
- This script printed or on a second screen

---

## 0:00–0:30 — Hook

> "Scammers win because the warning arrives after the money is gone. sting catches the pattern and warns you before you type, pay, or trust."

Show Chrome on a normal page (google.com). Point out: no interruption, quiet watch mode.

---

## 0:30–1:30 — Live Demo: Fake Bank Login

Switch to `demo/fake-bank-login.html` tab.

**What judges see:**
- Page loads with a fake "Secure Bank Verification Center"
- sting overlay appears automatically (top-right corner)
- Shows: HIGH RISK, score, specific signals found (urgency, credential grab, secrecy pressure)
- Advice: "Pause. Do not pay, enter passwords, or call numbers on this page."

**Say:**
> "Grandma opens this page from a phishing link. Before she types her password, sting catches 5+ scam signals and blocks visually. No API call, no delay — deterministic detection in the browser."

Click "Copy receipt" → paste into a text editor to show the structured evidence output.

---

## 1:30–2:30 — Live Demo: Romance Scam

Switch to `demo/romance-scam.html` tab.

**What judges see:**
- Different scam type, same detection engine
- Overlay catches: gift card payment, wire transfer, secrecy pressure ("do not tell"), urgency

**Say:**
> "This isn't just phishing pages. Romance scams, crypto fraud, fake ransom calls — same engine, same receipt. We have 9 fixture types covering the most common scam categories."

---

## 2:30–3:30 — Evidence Dossier + Case Storage

In terminal, run:
```bash
node scripts/save_case_demo.js
```

**What judges see:**
- Case record created with full evidence, jurisdiction inference, reporting channels (FTC, IC3, bank)
- Markdown dossier output

**Say:**
> "Every scam attempt becomes a case file. Structured for banks, FTC, IC3. Stored in Redis when available, local JSON otherwise. The family member doesn't need to explain what happened — the dossier does it."

---

## 3:30–4:15 — Sponsor Integration: Browserbase

In terminal, run:
```bash
node scripts/inspect_link_demo.js
```

**What judges see:**
- Script shows how Browserbase would open the suspicious link in isolation
- Evidence extracted without exposing user's browser/device

**Say:**
> "If a link looks suspicious, STING opens it in a sandboxed Browserbase session. The user's device never touches the scam page. Evidence comes back as a receipt."

**Mention Redis:**
> "Cases persist in Redis Cloud — case memory means if the same scam domain hits another family member, we already have the dossier."

---

## 4:15–4:45 — Scope + Compliance

**Say:**
> "Built from scratch this hackathon, clean repo, no prior code. Deterministic detection — no ML needed for the core path. Anthropic Claude and Deepgram voice paths are in progress for grounded explanations and voicemail scam detection."

---

## 4:45–5:00 — Close

> "sting: stop the scam before the click becomes a crisis. Protect before the mistake, preserve proof after the attempt."

---

## If Judges Ask...

| Question | Answer |
|----------|--------|
| "Why not just use ML?" | Deterministic is instant, private, and offline. ML layer (Claude) is planned for explanation, not detection. |
| "How do you handle false positives?" | Threshold tuning + the overlay is dismissible. Low-risk pages never trigger. |
| "What about non-English scams?" | Identified as P0 gap in QA report. Chinese fixture works because of bilingual content; pure non-English needs term expansion. |
| "What's the Redis schema?" | Case record: id, url, hostname, risk, score, findings[], jurisdiction, reportingChannels[], timestamps. |
| "Revenue model?" | Free for individuals. Premium family dashboard, bank API integrations, enterprise compliance feed. |
| "Why Chrome extension?" | Fastest path to reading page DOM at the danger moment. Android Accessibility + iOS Safari planned next. |
