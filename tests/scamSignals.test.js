const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeScamSurface, scoreText, hostnameSignals } = require('../src/scamSignals.js');

test('flags high-risk fake bank verification page', () => {
  const result = analyzeScamSurface({
    hostname: 'secure-bank-verify-account-login.example',
    title: 'Secure Bank Verification Center',
    text: 'URGENT account suspended verify now password one-time code do not contact your bank only through this page'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.label.includes('Urgency')));
  assert.ok(result.findings.some((f) => f.label.includes('credential')));
});

test('flags shipping fee scam pressure', () => {
  const result = analyzeScamSurface({
    hostname: 'usps-redelivery-fee-claim.example',
    title: 'USPS final notice',
    text: 'Pay a redelivery fee immediately. Processing fee required to release your package.'
  });
  assert.ok(['medium', 'high'].includes(result.risk));
  assert.ok(result.findings.some((f) => f.type === 'payment'));
});

test('keeps ordinary page low risk', () => {
  const result = analyzeScamSurface({
    hostname: 'example.com',
    title: 'Cafe menu',
    text: 'Hours, coffee, tea, pastries, directions, and contact information.'
  });
  assert.equal(result.risk, 'low');
  assert.equal(result.findingCount, 0);
});

test('domain signals catch impersonation patterns', () => {
  const findings = hostnameSignals('paypal-secure-verify-support.xyz');
  assert.ok(findings.length >= 2);
});

test('text scoring catches secrecy pressure', () => {
  const findings = scoreText('Keep this confidential and do not tell anyone. Send crypto now.');
  assert.ok(findings.some((f) => f.type === 'pressure'));
  assert.ok(findings.some((f) => f.type === 'payment'));
});
