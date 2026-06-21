# Devin Command — STING accessible scam inbox + roadmap implementation sprint

Repo: `https://github.com/billionairebumblebee/cloak-sting-hackathon-2026`
Target branch: create `accessible-scam-inbox-roadmap` from latest `main`.

Mission: turn the newest judge/story ideas into **demoable product surfaces**, not just slide copy. STING should look like it can grow from a Chrome extension into an accessible safety layer for scam texts, voicemails, email, family handoffs, scammer profiles, and reporting.

This is a hackathon sprint. Build **credible, polished, local/demo-backed flows** without claiming platform access we do not have.

## Product thesis

> STING starts as a browser warning, but the bigger product is a scam-proof inbox for the people scammers target most: older adults, less technical users, immigrants, families, and anyone overwhelmed by fake bank texts/calls/emails.

## Non-negotiables

- No public Cloak mention in STING copy.
- Do not claim iPhone can be modified with custom message bubbles or secretly read all iMessages.
- Do not claim STING reads private texts/emails/voicemails automatically unless the code actually has platform permission/integration.
- Use honest language: `companion inbox`, `share/import suspicious messages`, `where platform APIs allow`, `demo mode`, `local fixture`.
- Build safe scam infrastructure profiles, not doxxing or identity accusations.
- Use `suspected scam cluster`, `reported indicators`, `shared infrastructure`, `needs verification`.
- Keep all new demo flows working without API keys.
- Run root `npm run build` before done. If site changes, run the site build too.

## Scope overview

Create demoable surfaces for:

1. Target-market / founder story slide or site section
2. Future roadmap / accessible scam-proof inbox slide or site section
3. Messages companion demo
4. Voicemail scam quarantine demo
5. Email scam quarantine demo
6. Family rescue handoff packet integration
7. Scammer infrastructure profile clustering
8. Elder-friendly volunteer report page
9. Reporting route packet to official channels

Parallelize across subagents, but keep integration clean.

---

## Subagent 1 — Target market / founder story product surface

Goal: create or update a judge-facing target-market slide/section.

Files likely involved:
- `site/` components or pages
- docs / pitch files
- optional static image/slide if the repo has a deck system

Content to include:
- Founder discovery story: at church, an older gentleman said he gets lots of scam texts and calls and sometimes struggles to tell what is real because he is not comfortable with technology.
- STING was designed for people like him.
- Also include: founder's mom is not that old, but still became scared after a week of fake bank texts/calls.
- Frame scams as a huge world problem: victims lose money, peace, trust, and confidence; some scam operations also exploit people trafficked/kidnapped into scam call centers.

Important tone:
- Human, founder-led, practical.
- No xenophobia. Frame scam operations as global exploitation networks harming both victims and coerced workers.

Suggested title:
`Built for the people scams actually hurt`

Suggested punchline:
`STING is not built for power users. It is built for the moment when someone is scared, unsure, and about to be manipulated.`

Acceptance:
- Judge can understand the target user in one glance.
- Copy feels real and founder-led, not generic TAM fluff.

---

## Subagent 2 — Future roadmap / scam-proof inbox surface

Goal: create/update a future plans slide/section that shows STING expanding beyond the Chrome extension.

Files likely involved:
- `site/` components or pages
- README / Devpost draft / pitch docs

Must include four roadmap cards:

1. **Messages**
   - accessible messages companion/remake
   - bigger buttons
   - obvious Scam/Junk area
   - trusted-contact review
   - plain-English explanations
   - language translation for suspicious texts
   - move likely scam texts into junk/quarantine where platform APIs allow

2. **Calls + Voicemail**
   - transcribe suspicious voicemails
   - detect bank/fake emergency/tech support/romance/government impersonation scripts
   - move junk voicemails to scam area where supported
   - create report-ready handoff packet from transcript + phone number + scam signals

3. **Email**
   - accessible big-button email client or companion filter
   - clear Safe/Suspicious/Scam labels
   - detect fake bank emails, fake delivery notices, phishing links, fake invoices, romance/crypto fraud
   - quarantine scam email
   - translate suspicious emails for non-native English speakers

4. **Family + scam network**
   - trusted contacts review before money is lost
   - shared scam receipts
   - volunteer reports
   - reused numbers/emails/domains/scripts/catfish assets become suspected scam profiles

Suggested title:
`From Browser Warning to Scam-Proof Inbox`

Bottom punchline:
`The long-term product is not another security dashboard. It is a calmer, more accessible inbox for people scammers target most.`

Acceptance:
- Roadmap sounds ambitious but platform-honest.
- It does not imply creepy surveillance.

---

## Subagent 3 — Messages companion demo

Goal: build a demo page/component that shows what a STING Messages companion could look like for older/less technical users.

Files likely involved:
- `site/` route/component, e.g. `/demo/messages` or a section on homepage
- local fixture data under `data/` or `site/src/data/`

Build:
- Big-button messages UI mock/demo.
- Three tabs/sections: `Inbox`, `Scam/Junk`, `Ask Family`.
- Fake scam texts from fixtures: bank alert, delivery fee, toll text, romance/catfish, OTP request.
- STING labels: Safe / Suspicious / Scam.
- Plain-English explanation for each suspicious text.
- Translation toggle/mock for one non-English suspicious message if easy.
- Button: `Ask someone I trust` -> produces the family handoff packet.
- Button: `Move to Scam/Junk`.
- Button: `Contribute indicator to STING database`.

Important:
- Label this as a future/companion demo if not connected to actual SMS APIs.
- Avoid claiming live SMS ingestion.

Acceptance:
- A judge can click through an accessible messages experience.
- It looks like a real product direction, not a placeholder.

---

## Subagent 4 — Voicemail scam quarantine demo

Goal: build a demo page/component/script that shows how STING handles suspicious calls and voicemails.

Files likely involved:
- existing voice scam pipeline files
- `site/` demo component/page
- fixture transcripts/audio metadata

Build:
- A voicemail inbox mock with big buttons.
- At least three fixtures:
  - fake bank call
  - fake emergency/grandparent scam
  - tech support/government impersonation
- Show transcript, phone number, risk label, top scam signals.
- Button: `Create handoff packet`.
- Button: `Move to Scam/Junk`.
- Button: `Report this number`.

If existing Deepgram/voice scripts are present, connect demo to transcript fixture output. If not, use fixture transcript data and make it honest.

Acceptance:
- Shows voicemail -> transcript -> scam signals -> handoff packet.
- No false claim of live carrier voicemail integration.

---

## Subagent 5 — Email scam protection demo

Goal: build an accessible email scam quarantine demo.

Files likely involved:
- `site/` demo component/page
- fixture email data

Build:
- Big-button email UI with `Inbox`, `Suspicious`, `Scam/Junk`.
- Fixtures:
  - fake bank security alert
  - fake delivery notice
  - fake invoice/payment request
  - romance/crypto pitch
- Show Safe/Suspicious/Scam label.
- Show why it was flagged: sender mismatch, urgency, suspicious link, payment pressure, impersonated brand.
- Button: `Create report packet`.
- Button: `Ask someone I trust`.
- Button: `Move to scam folder`.

Important:
- Label as email companion/future product unless actual email integration exists.

Acceptance:
- Looks useful for older/nontechnical users.
- Supports roadmap story and business model.

---

## Subagent 6 — Family rescue + handoff packet integration

Goal: ensure the browser extension and any new demo surfaces share one reusable handoff-packet model.

Files likely involved:
- `src/threatExport.js`
- `src/dossier.js`
- new `src/handoffPacket.js` if useful
- `src/content.js`
- tests

Build/ensure:
- Shared function that takes a receipt/case/message/email/voicemail and returns:
  - trusted-contact message
  - evidence summary
  - reporting packet summary
  - database contribution object
- Browser extension overlay has CTA: `Ask someone I trust before I continue`.
- Handoff modal includes action buttons:
  - Copy family message
  - Copy evidence for bank/report
  - Report scam pattern
  - Save/contribute indicator

Acceptance:
- Handoff packet can be reused by browser/messages/email/voicemail demos.
- Tests cover generated copy and evidence fields.

---

## Subagent 7 — Scammer infrastructure profile clustering

Goal: build or improve profile clustering for reused scam indicators.

Files likely involved:
- new/existing `src/scamProfiles.js` or `src/scamClusterStore.js`
- `src/caseStore.js`
- fixture data
- tests
- optional `scripts/scam_profile_demo.js`

Build:
- Extract normalized indicators from cases/reports/messages/emails/voicemails:
  - phone numbers
  - emails
  - domains/URLs
  - impersonated brands
  - payment methods
  - script category
  - reported image refs/hashes/filenames only; no face ID
- Cluster when indicators overlap.
- Output suspected scam infrastructure profiles:
  - profile_id
  - summary
  - indicators
  - case_count
  - first_seen / last_seen
  - likely reporting jurisdictions
  - confidence
  - caveat
- Demo script that generates at least 2 clusters from fixtures.

Acceptance:
- Tests prove same phone/email/domain/brand clusters correctly.
- Output avoids doxxing/identity claims.

---

## Subagent 8 — Reporting routes + authority packet

Goal: create official-channel routing for scam reports.

Files likely involved:
- new `src/reportingRoutes.js`
- `src/dossier.js`
- tests
- site reporting UI

Build:
- Function maps indicators/scam type/country/phone country code to reporting options.
- Include:
  - US: FTC, IC3, bank/card issuer
  - India: National Cyber Crime Portal / 1930 helpline guidance when relevant
  - UK if easy: Action Fraud
  - Romance/catfish: FTC/IC3 + dating platform + trusted-contact review
  - International fallback: local police/cybercrime unit, bank, platform, preserve evidence
  - Myanmar/call-center trafficking context only as cautious context if user/fixture metadata indicates it; no vigilante claims
- Generate authority-ready packet:
  - summary
  - indicators
  - timeline
  - evidence list
  - next steps
  - what not to do

Acceptance:
- Report packet has clear next steps.
- Tests cover routing cases.
- No false claim of automatic filing.

---

## Subagent 9 — Elder-friendly volunteer reporting page

Goal: create a public/reporting page for users/families to volunteer scam info into the database/demo flow.

Files likely involved:
- `site/` route/component
- localStorage or copyable JSON flow
- fixture JSON

Build:
- Page title: `Help warn other families` or `Report a scam attempt`.
- Big readable fields:
  - What happened?
  - Phone number used
  - Email / website link
  - Company/person they pretended to be
  - What they asked for: gift card, bank login, OTP, crypto, wire, romance money, etc.
  - Country/location optional
  - Optional evidence note: fake photos / texts / screenshots can be preserved as evidence
- Consent checkbox:
  - `I understand STING stores this as a scam report indicator, not a public accusation against a specific person.`
- If no backend, implement as local demo:
  - localStorage report list
  - copyable JSON packet
  - export packet
- Button to contribute report to local demo database / clustering flow.

Acceptance:
- Elder-friendly, calm, nontechnical.
- Produces structured data usable by profile clustering.
- Honest about demo/local-only mode.

---

## Final integration checklist

1. Merge all work into branch `accessible-scam-inbox-roadmap`.
2. Resolve conflicts.
3. Run root:
   - `npm run check`
   - `npm test`
   - `npm run build`
4. If site changed, run site build.
5. Run demo scripts if created:
   - `node scripts/scam_profile_demo.js`
   - reporting route demo script if created
6. Final summary must include:
   - changed files
   - how to demo target-market slide/section
   - how to demo future roadmap section
   - how to demo messages companion
   - how to demo voicemail scam quarantine
   - how to demo email scam quarantine
   - how to demo handoff packet
   - how to demo scammer profile clustering
   - how to demo reporting routes
   - how to demo volunteer report page
   - exact commands run
   - caveats/honest limitations
   - PR link

## Definition of done

A judge can see that STING is not just a Chrome extension. It is becoming a family-centered, accessible scam-protection inbox: browser warnings today, message/voicemail/email quarantine next, trusted-family handoffs, suspected scam infrastructure profiles, volunteer reporting, and official reporting packets.
