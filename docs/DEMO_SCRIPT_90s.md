# Cloak Sting — 90-Second Demo Script

> Target: 60–90 seconds. Each step has a timing cue.

## Setup (before demo)

1. Load the repo as an unpacked Chrome extension in Chrome.
2. Open two tabs: `demo/fake-bank-login.html` and `demo/safe-normal-page.html`.
3. Have a terminal ready in the repo root.

---

## Script

### [0:00–0:10] Hook

> "Scam pages cost victims billions every year. Cloak Sting is a Chrome extension that warns you before you submit credentials or payment to a scam page."

### [0:10–0:25] Live extension demo — scam page

- Switch to the **fake-bank-login.html** tab.
- Point out the ambient warning overlay that appeared automatically.
- Read the risk score and top signals: "High risk — urgency pressure, credential harvesting, brand impersonation."

> "The extension analyzed this page in real time and flagged it before I could enter my password."

### [0:25–0:35] Live extension demo — safe page

- Switch to the **safe-normal-page.html** tab.
- Show there is no warning overlay.

> "On a normal page — a recipe blog — there's no warning. Zero false positives."

### [0:35–0:45] Evidence receipt

- Go back to the scam page tab.
- Click **Copy receipt** in the popup.
- Paste into a scratch note or text editor.
- Show: risk, URL, observed signals, safe advice.

> "The receipt is structured for banks, platforms, or authorities — not just a red banner."

### [0:45–0:60] Terminal: case database + dossier

- In the terminal, run:
  ```bash
  node scripts/save_case_demo.js
  ```
- Show the output: case ID, backend (local-json or Redis), dossier path.
- Optionally open the Markdown dossier.

> "Cases are stored in Redis — or local JSON as fallback — and exported as authority-safe dossiers."

### [0:60–0:75] Voice scam path (optional, if time permits)

- In the terminal, run:
  ```bash
  node scripts/transcribe_voice_demo.js
  ```
- Show: transcript, risk score, signals (ransom, payment, pressure).

> "Cloak Sting also handles voice scams — voicemail, robocalls, even hostage ransom calls — through Deepgram transcription into the same detector pipeline."

### [0:75–0:90] Closing

> "Cloak Sting is deterministic, explainable, and works offline. It integrates with Anthropic for human-language explanations, Browserbase for isolated link inspection, Redis for case storage, Deepgram for voice intake, and Sentry for reliability. All sponsor integrations degrade gracefully without API keys."

---

## Timing Notes

- If running short, skip the voice scam path (0:60–0:75).
- If running long, skip pasting the receipt and just mention it.
- Keep terminal commands pre-typed in history for speed.
