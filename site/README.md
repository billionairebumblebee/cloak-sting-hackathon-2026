# sting

**Catch the scam before it catches you.**

sting is an AI safety layer that inspects suspicious links, messages, and web pages, then gives normal people a plain-English warning, evidence trail, and next step before they get scammed.

Built for [UC Berkeley AI Hackathon 2026](https://www.berkeleyaihackathon.com/).

---

## Quick Start

```bash
cd site
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

The static output lands in `site/dist/` — deploy to Vercel, Netlify, or any static host.

---

## Demo Script (60 seconds)

1. **Open the site** — the hero explains what sting does in one line.
2. **Scroll to "How It Works"** — three-step flow: paste, inspect, verdict.
3. **Click "Run a demo scan"** or scroll to the Interactive Demo section.
4. **Select a case**: Fake Package SMS, Fake AI Store, or Fake Bank Login.
5. **Watch the scan** — a 2-second analysis animation runs.
6. **Read the verdict** — risk score, signal breakdown, plain-English explanation, and safe next steps.
7. **Click "View Evidence Receipt"** — download a structured JSON receipt.
8. **Scroll to Architecture** — see how each sponsor technology fits the pipeline.

---

## Project Structure

```
site/
├── index.html              # Entry point
├── vite.config.js           # Vite + Tailwind config
├── public/
│   ├── favicon.svg          # stingray favicon
│   └── sting-logo.svg       # Full logo mark (standalone SVG)
└── src/
    ├── main.jsx             # React entry
    ├── index.css            # Tailwind + custom theme
    ├── App.jsx              # Root layout
    ├── assets/
    │   └── StingLogo.jsx    # stingray logo component
    ├── components/
    │   ├── Navbar.jsx       # Fixed top nav
    │   ├── Hero.jsx         # Hero section with CTAs
    │   ├── Problem.jsx      # "Scams don't look fake anymore"
    │   ├── ProductFlow.jsx  # 3-step how-it-works
    │   ├── InteractiveDemo.jsx  # Live demo with 3 cases
    │   ├── Architecture.jsx # Sponsor integration map
    │   └── Footer.jsx       # Footer
    └── data/
        └── demoData.js      # Mock scam cases + architecture nodes
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Logo | Custom SVG (stingray mark) |
| Data | Static mock JSON (no backend required) |
| Deploy target | Vercel / Netlify / any static host |

---

## Sponsor Technologies Used / Planned

| Sponsor | Role in sting | Status |
|---------|---------------|--------|
| **Browserbase** | Isolated cloud browser for safe page inspection | Architecture planned |
| **Anthropic / Claude** | Grounded plain-English explanations + safe next steps | Architecture planned, deterministic fallback implemented |
| **Redis** | Case memory, similar-scam retrieval, evidence receipt storage | Architecture planned, local JSON fallback implemented |
| **Arize / Phoenix** | Trace + eval observability for AI verdicts | Architecture planned |
| **Sentry** | Reliability and error monitoring for the scanning pipeline | Architecture planned |
| **Fetch.ai** | Agent-to-agent scam investigation coordination | Architecture planned |

---

## Hackathon Clean-Room Boundary

All implementation, code, assets, logos, visual design, and content in this repository were created during the UC Berkeley AI Hackathon 2026 hacking period. Prior projects (including Cloak) were used only as high-level conceptual inspiration. No code, assets, logos, CSS, screenshots, README text, or repository structure was copied from any previous project.

- The sting logo is an original stingray mark created from scratch.
- No Cloak branding, visual identity, or code is present.
- This is a standalone hackathon submission.

---

## Devpost Summary

### Elevator Pitch

sting is an AI second opinion for suspicious links and messages. Paste a sketchy URL or forward a phishing SMS, and sting inspects it, explains the danger in plain English, and tells you exactly what to do next — with a downloadable evidence receipt you can share with your bank, your family, or law enforcement.

### What It Does

sting analyzes suspicious web pages, messages, and links using a combination of deterministic signal detection and AI-powered explanation. It checks domain age, pressure tactics, impersonation patterns, form behavior, and pricing anomalies. Then it produces a risk score, signal breakdown, plain-English verdict, recommended next steps, and a structured evidence receipt.

### How We Built It

- React + Vite for a fast, responsive single-page site
- Tailwind CSS v4 for a premium dark-mode design system
- Custom SVG stingray logo and visual identity created from scratch
- Static mock data demonstrating three real-world scam scenarios
- Architecture designed around Browserbase (safe inspection), Claude (explanations), Redis (case memory), Arize (observability), Sentry (reliability), and Fetch.ai (agent coordination)

### Challenges

- Creating a polished consumer-facing product that feels protective and trustworthy, not enterprise-sludgy
- Designing an interactive demo that communicates the full analysis pipeline without requiring a live backend
- Balancing technical depth in the architecture section with accessibility for non-technical judges

### What's Next

- Connect Browserbase for live suspicious page inspection
- Wire up Claude for real-time grounded explanations
- Build Redis-backed case memory for "we've seen 47 variants of this scam"
- Add browser extension for one-click scanning of the current page
- Voice scam analysis via Deepgram STT integration
- Mobile-responsive progressive web app
