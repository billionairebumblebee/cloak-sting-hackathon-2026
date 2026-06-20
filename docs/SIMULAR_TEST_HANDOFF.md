# Simular Test Handoff — Red-Team Fixtures

## Purpose

These fixture pages simulate real scam patterns for deterministic QA.
No real phishing URLs or victim data are used.

## Fixture Pages

| File | Scam type | Expected risk | Key signals |
|---|---|---|---|
| `demo/crypto-seed-phrase-scam.html` | Crypto seed phrase theft | **high** | payment (crypto/bitcoin), credential harvesting, secrecy pressure, .xyz TLD |
| `demo/marketplace-payment-scam.html` | Marketplace escrow fee scam | **high** | payment (gift card, Zelle, wire), urgency copy, isolation pressure |
| `demo/irs-government-fee-scam.html` | IRS/government impersonation | **high** | IRS impersonation, payment (gift card, bitcoin), secrecy pressure, .click TLD |
| `demo/safe-normal-page.html` | Benign recipe blog | **low** | none (0 findings) |

## Existing Fixture Pages

| File | Scam type | Expected risk |
|---|---|---|
| `demo/fake-bank-login.html` | Bank login credential theft | high |
| `demo/fake-shipping-fee.html` | Shipping fee payment scam | high |
| `demo/bank-otp-scam.html` | Bank OTP verification | high |
| `demo/chinese-family-scam.html` | Chinese-language family threat | high |
| `demo/crypto-investment-scam.html` | Crypto investment fraud | high |
| `demo/customs-fee-scam.html` | Customs fee impersonation | high |
| `demo/fake-hostage-ransom.html` | Hostage/ransom extortion | high |
| `demo/fake-tech-support.html` | Tech support impersonation | high |
| `demo/romance-scam.html` | Romance/money transfer scam | high |

## How to Test

### Automated

```bash
npm test   # includes tests/redteamFixtures.test.js
```

### Manual (Simular tester)

1. Load the repo as an unpacked Chrome extension.
2. Open each fixture page in a new tab.
3. Verify:
   - **Scam pages**: warning overlay appears before the user can submit credentials/payment.
   - **Safe page**: no overlay, no false positive.
4. Click **Copy receipt** on a scam page. Verify the receipt includes risk level, signals, and safe advice.

### What to Check

- Dangerous pages produce risk = `high` with score >= 65.
- Safe page produces risk = `low` with score < 35 and 0 findings.
- No real phishing URLs are used — all fixtures are local HTML.
- Receipt never claims to identify a private person or criminal actor.
