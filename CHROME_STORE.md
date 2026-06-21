# CHROME_STORE.md — Chrome Web Store Submission Guide

## Store Listing Details

### Name
STING — scam protection

### Short Description (132 chars max)
Protects you from online scams, phishing, and fraud with real-time warnings. All detection runs locally — your data never leaves your device.

### Detailed Description

STING (Scam Tracking & Intelligence Network Guard) is a free, open-source Chrome extension that detects online scams in real time and warns you before you type, pay, or trust.

HOW IT WORKS:
STING silently analyzes every page you visit for scam patterns — urgency language, payment pressure, credential harvesting, domain spoofing, and more. When a threat is detected, a calm warning overlay appears with specific evidence and next steps. No panic. No false alarms on trusted sites.

WHAT IT CATCHES:
- Phishing pages impersonating banks, shipping companies, and government agencies
- Crypto seed phrase harvesting and fake investment schemes
- Romance scams and emotional manipulation
- Tech support scams and fake virus warnings
- Grandparent/family emergency scams
- Lottery and prize fee scams
- Typosquatted domains (subtle URL tricks)

KEY FEATURES:
- 100% local detection — your browsing data never leaves your device
- Calm, accessible warning UI designed for all ages
- Evidence receipts for reporting to banks, FTC, or family
- Scan history in the popup
- Light/dark mode
- Zero API keys or accounts required

PRIVACY:
STING reads page text locally to analyze scam patterns. Nothing is transmitted to external servers. No accounts. No tracking. No ads. See our full privacy policy at https://cloak-sting-hackathon-2026.vercel.app/privacy

---

## Permissions Justification

| Permission | Why |
|------------|-----|
| `storage` | Saves scan history and theme preference locally on your device using chrome.storage.local. No data is synced or transmitted. |
| `activeTab` | Required to read the current page's content for scam analysis when the extension is active. Only accesses the tab you're currently viewing. |
| `host_permissions: <all_urls>` | Content scripts need to run on all pages to provide real-time protection. Detection happens locally — no data is sent to external servers. |

### Permissions NOT requested:
- No `tabs` — we don't track your browsing
- No `history` — we don't read your history
- No `cookies` — we don't access your cookies
- No `webRequest` — we don't intercept network traffic
- No `identity` — no login/account required

---

## Privacy / Data Disclosure (for CWS form)

### Single Purpose Description
Detects online scam patterns in web pages and warns users before they interact with fraudulent content.

### Data Usage Disclosure

| Category | Collected? | Details |
|----------|-----------|---------|
| Personally identifiable information | No | — |
| Health information | No | — |
| Financial and payment information | No | — |
| Authentication information | No | — |
| Personal communications | No | — |
| Location | No | — |
| Web history | Yes | Page hostname and scan result (safe/warning) stored locally in chrome.storage.local. Never transmitted. Cleared on uninstall. |
| User activity | Yes | DOM text content observed locally for pattern matching. No clicks, mouse position, scroll, or keystrokes logged. Nothing transmitted. |
| Website content | Yes | Page text analyzed locally for scam signals. Analysis happens on-device. Results stored locally. Nothing transmitted to external servers. |

### Certification statements:
- This extension does NOT sell user data to third parties
- This extension does NOT use or transfer user data for purposes unrelated to the extension's single purpose
- This extension does NOT use or transfer user data to determine creditworthiness or for lending purposes

---

## Screenshot Asset Checklist

Screenshots needed for CWS listing (1280x800 or 640x400):

- [ ] Screenshot 1: Extension popup — Status tab (dark mode, showing "Protection active" with stats)
- [ ] Screenshot 2: Warning overlay on a scam page (fake bank login with amber/purple warning)
- [ ] Screenshot 3: Extension popup — light mode variant
- [ ] Screenshot 4: Evidence receipt / scan result detail
- [ ] Screenshot 5: Clean page — no warning (showing extension icon in toolbar, page is safe)

### Additional assets:
- [ ] Promotional tile (440x280): STING logo + tagline
- [ ] Small promo tile (440x280)
- [ ] Marquee promo (1400x560) — optional

### Icon sizes (already generated):
- [x] 16x16 — toolbar icon
- [x] 32x32 — toolbar icon @2x
- [x] 48x48 — extensions page
- [x] 128x128 — store listing + install dialog

---

## Submission Notes

### Category
Productivity (or Security if available as subcategory)

### Language
English

### Regions
All regions

### Pricing
Free

### Website
https://cloak-sting-hackathon-2026.vercel.app/

### Support URL
https://cloak-sting-hackathon-2026.vercel.app/support

### Privacy Policy URL
https://cloak-sting-hackathon-2026.vercel.app/privacy

---

## Under-Review Status

Once submitted, Chrome Web Store review typically takes 1-3 business days. During review:
- Extension will show "Pending review" status in the developer dashboard
- No changes can be pushed until review completes
- If rejected, the rejection reason will appear in the dashboard with specific items to fix

### Common rejection reasons to watch for:
- Remote code execution patterns (we've eliminated all — no eval, no fetch in content scripts, no dynamic import)
- Missing privacy policy (added at /privacy)
- Overly broad permissions without justification (we justify each one above)
- Misleading description (our copy is honest about heuristic limitations)

### Current compliance status:
- [x] No inline scripts (Manifest V3 CSP compliant)
- [x] No remote code execution patterns
- [x] No eval(), new Function(), or dynamic import() in extension files
- [x] Privacy policy URL set
- [x] Support URL set
- [x] All permissions justified
- [x] Single-purpose description provided
- [x] Extension zip < 10 MB (43 KB)
- [x] Icons at all required sizes
