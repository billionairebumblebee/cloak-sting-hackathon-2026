const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeScamSurface } = require('../src/scamSignals.js');

// ---------------------------------------------------------------------------
// Red-team fixtures — deterministic scam pages that MUST trigger high risk
// ---------------------------------------------------------------------------

test('crypto seed phrase scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    hostname: 'wallet-recovery-secure.xyz',
    title: 'Wallet Recovery - Enter Seed Phrase',
    text: 'URGENT: Your crypto wallet has been compromised. Act now to secure your bitcoin and other assets. Enter your 12-word seed phrase below to verify ownership and recover your funds immediately. Do not tell anyone about this recovery process. Keep this confidential. Enter your password and confirm your password again. Enter the one-time code and security code sent to your device. Only through this page can you recover your assets. Ignore other messages. Limited time — final notice.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65, `expected score >= 65, got ${result.score}`);
  assert.ok(result.findings.some((f) => f.type === 'payment'), 'should detect crypto/bitcoin payment signal');
  assert.ok(result.findings.some((f) => f.type === 'pressure'), 'should detect secrecy/isolation pressure');
  assert.ok(result.findings.some((f) => f.type === 'credential'), 'should detect credential harvesting');
  assert.ok(result.findings.some((f) => f.label.includes('novelty top-level domain')), 'should flag .xyz TLD');
});

test('marketplace payment scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    title: 'Marketplace Secure Payment',
    text: 'The seller has shipped your item. A processing fee of $49.99 is required. Act now — if the fee is not paid within 24 hours your purchase will be cancelled. Accepted payment methods: gift card, Zelle, Cash App, wire transfer. Do not contact the marketplace support team directly. Only through this page can you complete the transaction. Avoid calling customer service. Final notice. Verify now. Limited time offer.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65, `expected score >= 65, got ${result.score}`);
  assert.ok(result.findings.some((f) => f.type === 'payment'), 'should detect payment signals');
  assert.ok(result.findings.some((f) => f.type === 'copy'), 'should detect urgency copy');
  assert.ok(result.findings.some((f) => f.type === 'pressure'), 'should detect isolation pressure');
});

test('IRS/government fee scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    hostname: 'irs-tax-resolution-center.click',
    title: 'IRS Tax Resolution — Urgent Notice',
    text: 'FINAL NOTICE: You owe back taxes to the IRS. Your account has been suspended pending immediate resolution. Failure to pay the processing fee within 24 hours will result in legal action. Pay the resolution fee immediately via gift card, bitcoin, or wire transfer to avoid further penalties. Do not contact your local IRS office. Only through this page can you resolve this matter. Keep this confidential — do not tell your accountant. Password for verification. Account locked. Fraud department.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65, `expected score >= 65, got ${result.score}`);
  assert.ok(result.findings.some((f) => f.type === 'impersonation'), 'should detect IRS impersonation');
  assert.ok(result.findings.some((f) => f.type === 'payment'), 'should detect unusual payment request');
  assert.ok(result.findings.some((f) => f.type === 'pressure'), 'should detect secrecy pressure');
  assert.ok(result.findings.some((f) => f.label.includes('novelty top-level domain')), 'should flag .click TLD');
});

test('safe normal page fixture → low risk', () => {
  const result = analyzeScamSurface({
    hostname: 'myblog.example.com',
    title: 'Weekend Recipe: Homemade Sourdough',
    text: 'This weekend I tried making sourdough bread from scratch. It turned out great! Ingredients: 500g bread flour, 350ml water, 100g active sourdough starter, 10g salt. Mix flour and water. Let rest 30 minutes. Add starter and salt. Fold the dough several times over 4 hours. Shape and proof overnight. Bake at 450 degrees in a Dutch oven for 45 minutes. The crust was perfectly crispy and the crumb had great texture. Enjoy!'
  });
  assert.equal(result.risk, 'low');
  assert.ok(result.score < 35, `expected score < 35, got ${result.score}`);
  assert.equal(result.findingCount, 0, 'safe page should have no findings');
});

// ---------------------------------------------------------------------------
// Cross-fixture signal coverage — ensure all red-team fixtures collectively
// cover the key signal types
// ---------------------------------------------------------------------------

test('red-team fixtures collectively cover key signal types', () => {
  const fixtures = [
    {
      hostname: 'wallet-recovery-secure.xyz',
      title: 'Wallet Recovery',
      text: 'URGENT crypto bitcoin seed phrase act now do not tell keep this confidential password one-time code only through this page ignore other messages limited time final notice'
    },
    {
      title: 'Marketplace Payment',
      text: 'processing fee gift card zelle cash app wire transfer act now within 24 hours do not contact avoid calling only through this page final notice verify now limited time offer'
    },
    {
      hostname: 'irs-tax-resolution-center.click',
      title: 'IRS Tax',
      text: 'IRS fraud department account suspended gift card bitcoin wire transfer final notice within 24 hours do not tell keep this confidential password account locked'
    }
  ];

  const allTypes = new Set();
  for (const fixture of fixtures) {
    const result = analyzeScamSurface(fixture);
    for (const f of result.findings) allTypes.add(f.type);
  }

  assert.ok(allTypes.has('copy'), 'should detect urgency copy across fixtures');
  assert.ok(allTypes.has('payment'), 'should detect payment signals across fixtures');
  assert.ok(allTypes.has('pressure'), 'should detect secrecy pressure across fixtures');
  assert.ok(allTypes.has('impersonation'), 'should detect impersonation across fixtures');
  assert.ok(allTypes.has('domain'), 'should detect risky domains across fixtures');
});
