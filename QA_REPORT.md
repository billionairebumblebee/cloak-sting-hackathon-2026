# QA Report — sting Scam Detector

## Test Summary

| Fixture                  | Expected | Actual | Score | Findings |
|--------------------------|----------|--------|-------|----------|
| romance-scam.html        | high     | high   | 100   | 11       |
| fake-tech-support.html   | high     | high   | 100   | 15       |
| crypto-investment-scam   | high     | high   | 100   | 11       |
| customs-fee-scam.html    | high     | high   | 100   | 13       |
| bank-otp-scam.html       | high     | high   | 100   | 14       |
| fake-hostage-ransom.html | high     | high   | 100   | 14       |
| chinese-family-scam.html | high     | high   | 100   | 12       |
| fake-bank-login.html     | high     | high   | 100   | (existing) |
| fake-shipping-fee.html   | medium+  | medium | (existing) | (existing) |

All new fixtures correctly classified as high risk. Medium and low edge cases also pass.

## Detected Gaps

### 1. No non-English keyword coverage
The detector only matches English terms. The Chinese-language fixture scores high only because it includes English fallback text. A page written entirely in Chinese, Spanish, or other languages would evade all term lists.

**Recommended fix:** Add parallel term lists for top scam languages (Chinese, Spanish, Hindi) or normalize via a simple translation map for the most common urgency/payment/secrecy phrases.

### 2. Score ceiling hides signal intensity differences
All 7 new fixtures hit the `Math.min(100, rawScore)` cap. A romance scam with 11 findings and a bank OTP scam with 14 findings both show score 100. This loses granularity for downstream triage.

**Recommended fix:** Either raise the cap or expose `rawScore` alongside `score` so consumers can differentiate extremely dense pages from borderline-high ones.

### 3. No romance/emotional manipulation signals
There are no terms for emotional manipulation patterns common in romance scams (e.g., "I love you", "send me money", "stranded overseas", "my darling"). The romance fixture only scores high because it uses generic urgency, payment, and secrecy terms.

**Recommended fix:** Add an `EMOTIONAL_MANIPULATION_TERMS` list: `['send me money', 'stranded overseas', 'my darling', 'prove your love', 'i need your help']` with a `romance` signal type.

### 4. No hostage/threat-specific signals
The ransom fixture scores high purely from urgency + payment + secrecy. There are no terms for explicit threats or kidnapping language ("we have your", "will be harmed", "ransom", "kidnapped").

**Recommended fix:** Add a `THREAT_TERMS` list with weight ~20 for terms like `ransom`, `kidnapped`, `we have your`, `will be harmed`.

### 5. Credential term matching is too narrow
The regex `/password|passcode|security code|one-time code|otp/g` only counts hits, requiring ≥2 to flag. A page asking for a single password plus other sensitive data (SSN, card number) won't trigger the credential signal.

**Recommended fix:** Lower the threshold to 1, or broaden the regex to include `ssn`, `social security`, `card number`, `cvv`, `pin`.

### 6. No form-field analysis
The detector only scores visible text. It doesn't inspect `<input>` field types, placeholder text, or form structure. A page with multiple password inputs and no visible scam text would score low.

**Recommended fix:** In `content.js`, the `getPageText()` function already collects input metadata — ensure `scamSignals.js` weights pages with multiple password-type inputs or sensitive field names.

### 7. No link/redirect analysis
Suspicious outbound links (e.g., URL shorteners, mismatched anchor text vs. href) are not analyzed.

**Recommended fix:** Add a `linkSignals(anchors)` function that flags URL shorteners (`bit.ly`, `tinyurl`) and text/href mismatches with weight ~10.

## Recommended Priority

| Priority | Gap | Effort |
|----------|-----|--------|
| P0       | #1 Non-English keywords | Small — add 2-3 term lists |
| P0       | #3 Romance signals | Small — add 1 term list |
| P1       | #4 Threat/ransom signals | Small — add 1 term list |
| P1       | #5 Broaden credential matching | Small — widen regex |
| P2       | #2 Score cap granularity | Trivial — expose rawScore |
| P2       | #6 Form-field analysis | Medium — wire input metadata into scoring |
| P3       | #7 Link analysis | Medium — new function |
