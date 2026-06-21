# Devin Command — 7-subagent sprint: STING Family Rescue + Scammer Profile Network

Repo: `https://github.com/billionairebumblebee/cloak-sting-hackathon-2026`
Target branch: create `wow-family-rescue-scammer-network` from latest `main`.

Mission: make STING memorable by turning it from “a browser warning” into a **community scam intelligence network** for vulnerable users. The judge wow moment: STING stops a risky page, creates a receipt for family, clusters the evidence into a scammer/infrastructure profile, and gives the user a safe reporting path.

Do this now with **7 subagents in parallel**. Keep it demoable, ethical, and honest. No huge backend. Use local/fixture-backed data if needed.

## Product line to anchor everything

> Scams work because victims are alone and scam crews reuse the same phone numbers, fake brands, emails, domains, scripts, and photos. STING stops the moment, builds the evidence, and helps report the pattern.

## Safety / ethics non-negotiables

- Do **not** dox private people or assert a real individual is a criminal based on weak evidence.
- Build **scam infrastructure profiles**, not vigilante identity accusations.
- Use language like `suspected scam cluster`, `reported indicators`, `shared infrastructure`, `likely impersonation`, `needs law-enforcement verification`.
- For photos: do not identify real people. Treat photos as `reused catfish image indicators` / `reported image hashes or filenames` only. No face recognition unless explicitly implemented and legal; avoid it for this sprint.
- For countries/call centers: infer routing/reporting from phone country code, domain/IP geo, user report, or fixture metadata. Say `likely reporting jurisdiction`, not definitive nationality of criminals.
- Do **not** claim actual law enforcement submission unless implemented. A generated report packet + official reporting links/forms is acceptable and honest.
- No Cloak mention in public STING copy.
- Keep extension functional without API keys.
- Run `npm run build` at repo root before marking done. If site changes, run site build too.

## Subagent 1 — Extension UX / Family Rescue Mode

Goal: implement the visible wow moment inside the Chrome extension overlay.

Files likely involved:
- `src/content.js`
- `src/threatExport.js`
- `src/dossier.js`
- tests under `tests/`

Tasks:
1. On high/medium risk overlay, add primary CTA: `Ask someone I trust before I continue`.
2. Clicking it opens a polished Family Rescue receipt panel/modal.
3. Panel includes:
   - page/domain/title
   - risk level and score
   - top findings with evidence
   - safe next steps
   - copyable trusted-contact message
   - copyable bank/authority evidence summary
   - link/button to `Report this scam pattern` if site/report page exists
4. Keep `Take me somewhere safe` behavior.
5. Ensure keyboard accessibility and no form re-enable bugs.

Suggested trusted-contact copy:

```text
Can you check this before I do anything? STING flagged this page as a possible scam.

Site: {hostname}
Risk: {risk} ({score}/100)
Why it looks dangerous: {top 2-3 findings}

I haven’t entered any information yet. Please help me verify this before I continue.
```

Acceptance:
- Demo scam page shows overlay.
- CTA opens share/evidence panel.
- Copy buttons work and fallback safely.
- No API key required.

## Subagent 2 — Demo fixture / Judge wow scenario

Goal: create one dead-simple judge demo path.

Files likely involved:
- add or polish `demo/grandma-bank-scam.html`, `demo/romance-catfish-scam.html`, or similar
- `docs/FAMILY_RESCUE_DEMO.md`

Tasks:
1. Add one emotional but clearly fake demo page where an older user is about to enter bank/OTP/payment info.
2. Include reusable scam indicators that Subagent 5 can cluster:
   - phone number
   - fake support email/login URL
   - impersonated company
   - payment rail/gift card/crypto address if already supported
   - optional reported catfish photo filename/placeholder, not real person identification
3. Ensure extension triggers high-risk warning.
4. Write a 60-second demo script:
   - open fake scam page
   - STING blocks risky moment
   - click Family Rescue
   - show trusted-contact receipt
   - show scammer profile/cluster: “this phone number / fake brand / email pattern appears in multiple reports”
   - show report packet page

Acceptance:
- Judge can reproduce in under 60 seconds.
- Fixture is clearly fake/demo-only and safe.

## Subagent 3 — Website / Arsenal / Business model integration

Goal: make the public site explain the wow factor and business case without becoming a deck.

Files likely involved:
- `site/` React/Vite app
- sponsor/arsenal components

Tasks:
1. Add concise section/card: `Family Rescue Mode`.
2. Add concise section/card: `Scammer Profile Network`.
3. Copy direction:
   - `STING does not just warn once. It turns repeated scam indicators — phone numbers, fake emails, impersonated brands, domains, scripts, and reported catfish assets — into suspected scam clusters that families and authorities can act on.`
4. Add business model slide/section:
   - Family plan: `$8–15/mo` for parents/grandparents/trusted contacts
   - Individual premium: `$5–10/mo`
   - Bank/credit union partnerships: reduce fraud losses + structured evidence
   - Elder-care/caregiver channel
5. Keep sponsor arsenal/info tabs honest. Do not imply this is a sponsor integration unless it is.

Acceptance:
- Website explains Family Rescue + Scammer Profile Network in one memorable story.
- Business model is visible and tasteful.
- Site build passes.

## Subagent 4 — Tests / Build / Regression guard

Goal: keep sprint from breaking extension/site.

Tasks:
1. Add tests for new pure functions:
   - trusted-contact message generation
   - authority report packet formatting
   - scam indicator extraction if added
   - scam profile clustering if added
2. Factor formatting/clustering into testable modules instead of burying everything in content script.
3. Run:
   - `npm run check`
   - `npm test`
   - `npm run build`
4. If site changed, run the site build too.
5. Report exact commands and results.

Acceptance:
- Root build passes.
- Existing tests pass.
- New logic covered by tests.

## Subagent 5 — Scammer Profile Network / Clustered scam intelligence

Goal: replace the old copy-only pitch subagent with actual scam profile intelligence. Build profiles of **scam infrastructure**, grouped by similar indicators.

Files likely involved:
- new `src/scamProfiles.js` or `src/scamClusterStore.js`
- `src/caseStore.js`
- `src/dossier.js`
- `data/scam-cases.json`
- tests under `tests/`
- optional `scripts/scam_profile_demo.js`

Tasks:
1. Extract normalized scam indicators from receipts/cases:
   - phone numbers
   - emails
   - domains/hostnames/URLs
   - impersonated company/brand if detectable from findings/title/text
   - fake login/payment keywords
   - crypto wallet/gift card/payment rail if already present
   - report-provided photo filename/hash placeholders, not identity claims
2. Cluster cases into suspected scam profiles when indicators overlap:
   - same phone number
   - same email/domain
   - same impersonated company + similar payment pattern
   - same script/finding family
3. Store profile data in Redis/local fallback via existing case storage patterns. If Redis is not configured, use local JSON demo fallback.
4. Create profile shape like:

```json
{
  "profile_id": "cluster_...",
  "status": "suspected_scam_cluster",
  "summary": "Fake bank security verification using repeated phone/email/domain indicators",
  "indicators": {
    "phones": [],
    "emails": [],
    "domains": [],
    "impersonated_brands": [],
    "payment_methods": [],
    "reported_image_refs": []
  },
  "case_count": 3,
  "first_seen": "...",
  "last_seen": "...",
  "likely_reporting_jurisdictions": [],
  "confidence": "low|medium|high",
  "caveat": "Indicators require human/law-enforcement verification."
}
```

5. Add `scripts/scam_profile_demo.js` that loads sample cases and prints/exports clustered scam profiles.
6. Add docs explaining this is infrastructure clustering, not doxxing.

Acceptance:
- Demo script produces at least 2 profile clusters from fixture/sample data.
- Tests verify clustering by shared phone/email/domain/brand.
- No claim that a real person has been identified.

## Subagent 6 — Law enforcement / authority reporting pathway

Goal: create a real, safe pathway from STING evidence to the appropriate reporting destination.

Files likely involved:
- new `src/reportingRoutes.js`
- `src/dossier.js`
- docs under `docs/`
- tests under `tests/`
- optional site reporting page

Tasks:
1. Build a reporting route helper that maps case/profile indicators to official or semi-official reporting options.
2. Include at minimum:
   - United States: FTC fraud report, FBI IC3, local bank/card issuer reminder
   - India: Cyber Crime Portal / 1930 helpline guidance when phone/IP/country code indicates India or user selects India
   - UK/Europe fallback if easy: Action Fraud / local cybercrime reporting pointer
   - Nigeria/Africa/general international fallback: warn that jurisdiction is uncertain; provide generic local police/cybercrime and platform/bank reporting guidance. Do not label all African numbers as scammers.
   - Myanmar/call-center trafficking context: if user/report metadata says Myanmar or known scam-compound pattern, route to local/national cybercrime + human-trafficking caution language, not vigilante claims.
   - Romance/catfish scams: FTC/IC3-style reporting, dating platform report, reverse-image-search suggestion, trusted-contact review.
3. Generate an authority-ready packet:
   - victim-safe summary
   - indicators
   - timeline
   - screenshots/URLs if available
   - what not to do: do not engage, do not send more money, preserve evidence
4. Add copy buttons / links, not fake direct filing unless actually implemented.
5. Add tests for routing based on phone country code/domain/user-selected country/scam type.

Acceptance:
- A scam profile can output `recommended_reporting_routes`.
- The UI/docs can say: `STING prepares a report packet and points users to the right official channel.`
- No false claim of auto-submission to law enforcement.

## Subagent 7 — Elder-friendly volunteer reporting page

Goal: create a button/page where older users or family members can volunteer scam info into the database/demo flow.

Files likely involved:
- `site/` route/page/component or static HTML if site is simple
- possibly `data/volunteer-reports.json` demo fixture
- optional new script to ingest sample volunteer reports

Tasks:
1. Add a public-facing page/section: `Report a scam attempt` or `Help warn other families`.
2. Elder-friendly form fields:
   - What happened? text area
   - Phone number they used
   - Email address / website link
   - Company/person they pretended to be
   - What they asked for: gift card, bank login, OTP, crypto, wire, romance money, etc.
   - Optional upload placeholder/copy: fake photos/text screenshots can be preserved as evidence, but do not implement unsafe uploads unless already supported
   - Country/location optional
   - Consent checkbox: `I understand STING stores this as a scam report indicator, not a public accusation against a specific person.`
3. If no backend exists, implement as demo/local-only:
   - generate copyable JSON report
   - or save to localStorage
   - or provide a mailto/export packet
   - clearly label demo mode
4. Add CTA from Family Rescue panel: `Report this scam pattern`.
5. Make language calm and nontechnical for older users.

Acceptance:
- Site has a visible reporting flow.
- It produces structured report data usable by Subagent 5 clustering.
- It is honest about demo/local-only storage if no backend exists.

## Final integration owner checklist

After all 7 subagents finish:
1. Merge work cleanly onto `wow-family-rescue-scammer-network`.
2. Resolve conflicts.
3. Run root `npm run build`.
4. Run site build if site changed.
5. Run demo scripts:
   - Family rescue flow manual steps
   - `node scripts/scam_profile_demo.js` if created
   - any reporting route demo if created
6. Push branch and open PR.
7. Final summary must include:
   - changed files
   - how to demo Family Rescue Mode
   - how to demo scammer profile clustering
   - how to demo reporting route packet
   - how volunteer report data flows into profile clustering
   - exact commands run
   - caveats / honest limitations

## Definition of done

A judge sees: STING blocks the scam moment, helps the user ask family for help, clusters repeated scam indicators into suspected scammer/infrastructure profiles, and prepares the right report packet for banks/platforms/law enforcement. The product becomes memorable as **a family safety + scam intelligence network**, not just another browser warning.
